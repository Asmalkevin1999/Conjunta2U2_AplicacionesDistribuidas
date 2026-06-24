const express = require('express');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3100;
const BASE = '/api/docs';

const SERVICES = [
  { name: 'usuarios', url: 'http://usuarios:3000/api/docs-json', prefix: '/api/usuarios' },
  { name: 'vehiculos', url: 'http://vehiculos:3001/api-json', prefix: '/api/vehiculos' },
  { name: 'asignaciones', url: 'http://asignaciones:3002/api-json', prefix: '/api/asignaciones' },
  { name: 'zonas', url: 'http://zonas:8080/v3/api-docs', prefix: '' },
];

const FETCH_TIMEOUT = 8_000;
const RETRY_DELAY = 10_000;
const REFRESH_INTERVAL = 60_000;

const specs = Object.fromEntries(SERVICES.map(s => [s.name, { data: null, error: null }]));

async function fetchOne(service) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(service.url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchAndCache(name) {
  const svc = SERVICES.find(s => s.name === name);
  const entry = specs[name];
  try {
    const spec = await fetchOne(svc);
    entry.data = spec;
    entry.error = null;
    console.log(`[${name}] OK — ${Object.keys(spec.paths || {}).length} paths`);
    return true;
  } catch (err) {
    entry.error = err.message;
    console.warn(`[${name}] FAIL — ${err.message}`);
    return false;
  }
}

async function retryLoop(services) {
  const results = await Promise.all(services.map(s => fetchAndCache(s.name)));
  const stillFailed = services.filter((_, i) => !results[i]);
  if (stillFailed.length) {
    const names = stillFailed.map(s => s.name).join(', ');
    console.log(`[${names}] retrying in ${RETRY_DELAY / 1000}s...`);
    setTimeout(() => retryLoop(stillFailed), RETRY_DELAY);
  }
}

async function refreshAll() {
  const results = await Promise.all(SERVICES.map(s => fetchAndCache(s.name)));
  const failed = SERVICES.filter((_, i) => !results[i]);
  if (failed.length) {
    retryLoop(failed);
  }
}

function buildMerged() {
  const merged = {
    openapi: '3.0.3',
    info: {
      title: 'API Gateway - Microservicios',
      version: '1.0.0',
      description: [
        'Documentación unificada de los microservicios accesibles a través del API Gateway (Kong).',
        '',
        '## Microservicios incluidos',
        '- **Usuarios** — Gestión de usuarios, personas, roles y asignaciones',
        '- **Vehículos** — Gestión de vehículos (autos, motos, camionetas)',
        '- **Asignaciones** — Gestión de asignación de vehículos y trazabilidad',
        '- **Zonas** — Gestión de zonas y espacios de parqueadero',
        '',
        'Todas las peticiones deben pasar por el Gateway en `http://localhost:8000`.',
      ].join('\n'),
    },
    servers: [{ url: 'http://localhost:8000', description: 'Kong API Gateway' }],
    paths: {},
    components: { schemas: {} },
    tags: [],
  };

  for (const svc of SERVICES) {
    const entry = specs[svc.name];
    if (!entry.data) continue;

    const spec = entry.data;
    for (const [path, methods] of Object.entries(spec.paths || {})) {
      merged.paths[svc.prefix + path] = methods;
    }

    if (spec.components?.schemas) {
      Object.assign(merged.components.schemas, spec.components.schemas);
    }

    if (spec.tags) {
      const seen = new Set(merged.tags.map(t => t.name));
      for (const t of spec.tags) {
        if (!seen.has(t.name)) {
          merged.tags.push(t);
          seen.add(t.name);
        }
      }
    }
  }

  return merged;
}

// ─── Startup ─────────────────────────────────────────
console.log('Fetching specs from microservices...');
refreshAll();
setInterval(refreshAll, REFRESH_INTERVAL);

// ─── Routes ──────────────────────────────────────────
app.get(`${BASE}/api-docs.json`, (_req, res) => {
  res.json(buildMerged());
});

app.get(`${BASE}/health`, (_req, res) => {
  const status = Object.fromEntries(
    SERVICES.map(s => [s.name, specs[s.name].data ? 'ok' : `error: ${specs[s.name].error || 'pending'}`])
  );
  res.json({ status, totalEndpoints: Object.keys(buildMerged().paths).length });
});

app.use(BASE, swaggerUi.serve, swaggerUi.setup(null, {
  swaggerUrl: `${BASE}/api-docs.json`,
  explorer: true,
  customSiteTitle: 'API Gateway - Documentación',
}));

app.get('/', (_req, res) => res.redirect(BASE));

app.listen(PORT, () => {
  console.log(`API Docs → http://0.0.0.0:${PORT}${BASE}`);
  console.log(`Health   → http://0.0.0.0:${PORT}${BASE}/health`);
});
