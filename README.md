# API Gateway — Microservicios

Proyecto de implementación de un **API Gateway** con **Kong** que orquesta y enruta peticiones a tres microservicios independientes: **Usuarios**, **Vehículos** y **Zonas**, cada uno con su propia base de datos PostgreSQL. Incluye un **documentación Swagger unificada** que centraliza todos los endpoints en un solo punto de acceso.

---

## Arquitectura

```
                    ┌─────────────────────────┐
                    │    Cliente / Frontend    │
                    └──────────┬──────────────┘
                               │
                               │ http://localhost:8000
                               ▼
                    ┌─────────────────────────┐
                    │   KONG API GATEWAY      │
                    │   (kong:3.8)            │
                    │   Puerto 8000           │
                    └──┬─────────┬─────────┬──┘
                       │         │         │
              ┌────────┘         │         └──────────┐
              ▼                  ▼                     ▼
     ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
     │  Usuarios    │  │  Vehículos   │  │     Zonas        │
     │  (NestJS)    │  │  (NestJS)    │  │  (Spring Boot)   │
     │  Puerto 3000 │  │  Puerto 3001 │  │  Puerto 8080     │
     └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘
            │                 │                    │
            ▼                 ▼                    ▼
     ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
     │  PostgreSQL  │  │  PostgreSQL  │  │   PostgreSQL     │
     │  usuarios_db │  │vehiculos_db  │  │    zonasDB       │
     │  (puerto 5432)│  │(puerto 5433)│  │  (puerto 5434)   │
     └──────────────┘  └──────────────┘  └──────────────────┘

                    ┌──────────────────────────┐
                    │   api-docs (Swagger UI)   │
                    │   Node.js / Express       │
                    │   Agrega specs de los 3   │
                    │   Acceso: /api/docs       │
                    └──────────────────────────┘
```

---

## Microservicios

| Microservicio | Tecnología | Framework | Puerto | Base de Datos |
|---|---|---|---|---|
| **usuarios** | TypeScript | NestJS 11 | 3000 | PostgreSQL 16 |
| **vehiculos** | TypeScript | NestJS 11 | 3001 | PostgreSQL 15 |
| **zonas** | Java 21 | Spring Boot 4 + Maven | 8080 | PostgreSQL 15 |

---

## Estructura del proyecto

```
📦 API GATEWAY
├── 📄 docker-compose.yml       → Orquestación global (8 servicios)
├── 📄 kong.yml                 → Configuración declarativa de rutas Kong
├── 📄 README.md                → Este documento
│
├── 📁 usuarios/                → Microservicio de usuarios (NestJS)
│   ├── 📄 Dockerfile           → Build multi-etapa Node 22
│   ├── 📄 .dockerignore
│   └── 📁 src/
│       ├── 📄 main.ts          → Swagger en /api/docs + server Kong
│       └── ... (controllers, services, entities)
│
├── 📁 vehiculos/               → Microservicio de vehículos (NestJS)
│   ├── 📄 Dockerfile           → Build multi-etapa Node 22
│   ├── 📄 .dockerignore
│   └── 📁 src/
│       ├── 📄 main.ts          → Swagger en /api + server Kong
│       └── ... (controllers, services, entities)
│
├── 📁 zonas/                   → Microservicio de zonas (Spring Boot)
│   ├── 📄 Dockerfile           → Build multi-etapa Maven + Temurin 21
│   ├── 📄 pom.xml
│   └── 📁 src/main/
│       ├── 📁 resources/
│       │   └── 📄 application.yaml  → Config con variables de entorno
│       └── 📁 java/.../config/
│           └── 📄 OpenApiConfig.java → Swagger con server Kong
│
└── 📁 api-docs/                → Agregador de documentación Swagger
    ├── 📄 Dockerfile           → Node 22
    ├── 📄 package.json
    └── 📁 src/
        └── 📄 index.js         → Fetch, merge y exposición de specs
```

---

## Dockerfiles

### Microservicios NestJS (usuarios y vehiculos)

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
EXPOSE 3000  # o 3001 para vehiculos
CMD ["node", "dist/main"]
```

**Explicación:**
- **Multi-etapa**: La primera etapa compila TypeScript → JavaScript; la segunda solo contiene los artefactos necesarios para ejecución.
- **Alpine**: Imagen liviana (~120 MB) para reducción de tamaño.
- **npm ci**: Instalación determinista basada en el lockfile.

### Microservicio Spring Boot (zonas)

```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml ./
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Explicación:**
- **Multi-etapa**: Compila con Maven y JDK 21; la imagen final solo contiene el JRE 21.
- **dependency:go-offline**: Pre-descarga dependencias para acelerar builds subsecuentes.
- **-DskipTests**: Omite pruebas durante la construcción de la imagen.

### Agregador Swagger (api-docs)

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3100
CMD ["node", "src/index.js"]
```

---

## Docker Compose general

Archivo: `docker-compose.yml`

### Servicios definidos

| Servicio | Imagen / Build | Puerto expuesto | Propósito |
|---|---|---|---|
| `usuarios-db` | postgres:16 | 5432 | Base de datos de usuarios |
| `vehiculos-db` | postgres:15 | 5433 | Base de datos de vehículos |
| `zonas-db` | postgres:15 | 5434 | Base de datos de zonas |
| `usuarios` | build ./usuarios | 3000 | API de usuarios |
| `vehiculos` | build ./vehiculos | 3001 | API de vehículos |
| `zonas` | build ./zonas | 8080 | API de zonas |
| `api-docs` | build ./api-docs | 3100 | Swagger unificado |
| `kong` | kong:3.8 | 8000 / 8443 / 8001 | API Gateway |

### Variables de entorno por microservicio

Cada microservicio se configura con variables de entorno para apuntar a su base de datos usando el nombre del servicio Docker:

```yaml
usuarios:
  environment:
    PORT: 3000
    DB_HOST: usuarios-db
    DB_PORT: 5432
    DB_USERNAME: postgres
    DB_PASSWORD: postgres
    DB_DATABASE: usuarios_db
    DB_SYNCHRONIZE: "true"
```

### Healthchecks

Cada base de datos incluye un healthcheck que usa `pg_isready` para verificar disponibilidad antes de que los microservicios intenten conectarse:

```yaml
usuarios-db:
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres"]
    interval: 5s
    timeout: 5s
    retries: 5
```

### Red interna

Todos los servicios comparten la red `api-gateway-network` (driver bridge), lo que permite comunicación interna por nombre de servicio.

---

## Kong API Gateway

Archivo: `kong.yml`

### Configuración declarativa

Kong se ejecuta en modo **DB-less** (sin base de datos), usando un archivo declarativo YAML.

### Servicios y rutas

| Ruta pública | strip_path | Backend | Ejemplo |
|---|---|---|---|
| `/api/usuarios` | ✅ true | `usuarios:3000` | `/api/usuarios/users` → `usuarios:3000/users` |
| `/api/vehiculos` | ✅ true | `vehiculos:3001` | `/api/vehiculos/vehiculos` → `vehiculos:3001/vehiculos` |
| `/api/v1/zonas` | ❌ false | `zonas:8080` | `/api/v1/zonas` → `zonas:8080/api/v1/zonas` |
| `/api/v1/espacios` | ❌ false | `zonas:8080` | `/api/v1/espacios` → `zonas:8080/api/v1/espacios` |
| `/api/docs` | ❌ false | `api-docs:3100` | `/api/docs` → `api-docs:3100/api/docs` |

**Explicación de strip_path:**
- **Usuarios y Vehículos** (NestJS): sus endpoints internos son `/users`, `/persons`, `/vehiculos`, etc. Kong elimina el prefijo `/api/usuarios` al reenviar, traduciendo `/api/usuarios/users` a `usuarios:3000/users`.
- **Zonas** (Spring Boot): sus controladores ya están anotados con `/api/v1/zonas` y `/api/v1/espacios`. Se usa `strip_path: false` para que el path se mantenga intacto.
- **api-docs**: los estáticos de Swagger UI (CSS, JS) se sirven bajo `/api/docs/...`, por lo que se usa `strip_path: false` para preservar la jerarquía de rutas.

### Comportamiento del enrutamiento

```
Cliente: GET http://localhost:8000/api/usuarios/users
                                           │
                                           ▼
  Kong:        /api/usuarios/users  ──strip_path──→  /users
                                           │
                                           ▼
  Backend:     http://usuarios:3000/users
                                           │
                                           ▼
  Respuesta:   Lista de usuarios
```

---

## Documentación Swagger Unificada

### Problema

Cada microservicio exponía su propia documentación Swagger en puertos distintos, obligando al desarrollador a conocer las URLs individuales y navegar entre múltiples pestañas.

### Solución: Servicio `api-docs`

Se creó un servicio **Node.js + Express** que:

1. **Fetchea** el OpenAPI JSON de cada microservicio interno (por nombre de servicio Docker)
2. **Ajusta los paths** agregando el prefijo del Gateway (`/api/usuarios/*`, `/api/vehiculos/*`)
3. **Mergea** las tres especificaciones en un solo documento OpenAPI 3.0.3
4. **Sirve** Swagger UI apuntando al Gateway (`http://localhost:8000`)

### URLs de los specs individuales (consumidas internamente)

| Microservicio | Endpoint OpenAPI JSON |
|---|---|
| usuarios | `http://usuarios:3000/api/docs-json` |
| vehiculos | `http://vehiculos:3001/api-json` |
| zonas | `http://zonas:8080/v3/api-docs` |

### Lógica de merge (api-docs/src/index.js)

```javascript
// Por cada servicio:
for (const [path, methods] of Object.entries(spec.paths || {})) {
  merged.paths[svc.prefix + path] = methods;  // Agrega prefijo del Gateway
}
```

Los schemas, tags y componentes se mergean evitando duplicados.

### Reintentos inteligentes

El servicio implementa un sistema de reintentos para manejar el arranque asíncrono:

- **Timeout** de 8s por petición
- **Reintento** cada 10s para servicios que fallan
- **Refresco completo** cada 60s
- **Cache en memoria** para servir respuestas rápidas

### Endpoints del servicio api-docs

| Ruta (via Kong) | Descripción |
|---|---|
| `http://localhost:8000/api/docs` | Swagger UI unificado |
| `http://localhost:8000/api/docs/api-docs.json` | Spec OpenAPI mergeada (JSON) |
| `http://localhost:8000/api/docs/health` | Estado de cada microservicio |

### Modificaciones a cada microservicio

Se agregó el servidor de Kong en la configuración Swagger de cada microservicio:

**NestJS (usuarios/main.ts y vehiculos/main.ts):**
```typescript
const config = new DocumentBuilder()
  .addServer('http://localhost:8000', 'Kong API Gateway')
  .build();
```

**Spring Boot (OpenApiConfig.java):**
```java
return new OpenAPI()
  .addServersItem(new Server()
    .url("http://localhost:8000")
    .description("Kong API Gateway"))
  // ...
```

### Configuración de variables de entorno para zonas

Se actualizó `application.yaml` para usar variables de entorno en lugar de valores hardcodeados:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5434}/${DB_NAME:zonasDB}
    username: ${DB_USER:kfamaguana}
    password: ${DB_PASS:espe123}
```

---

## Cómo ejecutar

### Requisitos

- Docker Engine 24+
- Docker Compose v2

### Pasos

```bash
# 1. Limpiar contenedores previos (si existen)
docker compose down

# 2. Construir y levantar todos los servicios
docker compose up -d --build

# 3. Verificar que todos los contenedores estén corriendo
docker compose ps

# 4. Ver logs en tiempo real
docker compose logs -f
```

### Verificación

```bash
# Probar cada microservicio a través del Gateway
curl http://localhost:8000/api/usuarios/users
curl http://localhost:8000/api/vehiculos/vehiculos
curl http://localhost:8000/api/v1/zonas
curl http://localhost:8000/api/v1/espacios

# Documentación Swagger unificada
http://localhost:8000/api/docs

# Estado del agregador
http://localhost:8000/api/docs/health
```

### Tiempo de arranque

| Servicio | Tiempo estimado |
|---|---|
| Bases de datos | ~10s |
| NestJS (usuarios, vehiculos) | ~15s |
| Spring Boot (zonas) | ~30-40s |
| Kong | ~5s |
| api-docs | ~5s |

> El agregador `api-docs` reintenta automáticamente hasta que todos los servicios estén disponibles.

---

## Endpoints disponibles

### Usuarios (via Gateway)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/usuarios/users` | Listar usuarios |
| POST | `/api/usuarios/users` | Crear usuario |
| GET | `/api/usuarios/users/{id}` | Obtener usuario por UUID |
| PATCH | `/api/usuarios/users/{id}` | Actualizar usuario |
| DELETE | `/api/usuarios/users/{id}` | Eliminar (soft delete) usuario |
| GET | `/api/usuarios/persons` | Listar personas |
| POST | `/api/usuarios/persons` | Crear persona con usuario |
| GET | `/api/usuarios/persons/{id}` | Obtener persona |
| PATCH | `/api/usuarios/persons/{id}` | Actualizar persona |
| DELETE | `/api/usuarios/persons/{id}` | Eliminar persona |
| GET | `/api/usuarios/roles` | Listar roles |
| POST | `/api/usuarios/roles` | Crear rol |
| GET | `/api/usuarios/roles/{id}` | Obtener rol |
| PATCH | `/api/usuarios/roles/{id}` | Actualizar rol |
| DELETE | `/api/usuarios/roles/{id}` | Eliminar rol |
| POST | `/api/usuarios/user-role` | Asignar rol a usuario |
| DELETE | `/api/usuarios/user-role/{idUser}/{idRole}` | Remover asignación |
| GET | `/api/usuarios/user-role/user/{idUser}` | Roles de un usuario |
| GET | `/api/usuarios/user-role/role/{idRole}` | Usuarios de un rol |

### Vehículos (via Gateway)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/vehiculos/vehiculos` | Listar vehículos (filtro opcional `?tipo=`) |
| POST | `/api/vehiculos/vehiculos` | Crear vehículo (auto/moto/camioneta) |
| GET | `/api/vehiculos/vehiculos/{id}` | Obtener vehículo por UUID |
| PATCH | `/api/vehiculos/vehiculos/{id}` | Actualizar vehículo |
| DELETE | `/api/vehiculos/vehiculos/{id}` | Eliminar vehículo |

### Zonas (via Gateway)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/zonas` | Listar zonas |
| POST | `/api/v1/zonas` | Crear zona |
| PUT | `/api/v1/zonas/{idZona}` | Actualizar zona |
| PATCH | `/api/v1/zonas/{idZona}/estado` | Activar/Desactivar zona |
| DELETE | `/api/v1/zonas/{idZona}` | Eliminar zona |
| GET | `/api/v1/espacios` | Listar espacios |
| POST | `/api/v1/espacios` | Crear espacio |
| PUT | `/api/v1/espacios/{idEspacio}` | Actualizar espacio |
| PATCH | `/api/v1/espacios/{idEspacio}/estado?estado=` | Cambiar estado |
| DELETE | `/api/v1/espacios/{idEspacio}` | Eliminar espacio |
| GET | `/api/v1/espacios/estado/{estado}` | Espacios por estado |
| GET | `/api/v1/espacios/zona/{idZona}/estado/{estado}` | Espacios por zona y estado |

---

## Tecnologías utilizadas

| Componente | Tecnología | Versión |
|---|---|---|
| API Gateway | Kong | 3.8 |
| Microservicio usuarios | NestJS / Node.js | 11 / 22 |
| Microservicio vehiculos | NestJS / Node.js | 11 / 22 |
| Microservicio zonas | Spring Boot / Java | 4.0.6 / 21 |
| Bases de datos | PostgreSQL | 15 y 16 |
| Documentación | Swagger / OpenAPI | 3.0.3 |
| Agregador docs | Express / swagger-ui-express | 4.21 / 5.0 |
| Contenedores | Docker / Docker Compose | — |
| Lenguajes | TypeScript, Java, JavaScript | — |
| ORM (NestJS) | TypeORM | 1.0 |
| ORM (Spring) | Hibernate / JPA | — |
| Documentación API | springdoc-openapi | 2.8.6 |

---

## Diagrama de flujo de petición

```
  Cliente                    Kong                    api-docs             Microservicio
    │                         │                        │                      │
    │  GET /api/docs          │                        │                      │
    ├────────────────────────►│                        │                      │
    │                         │  GET /api/docs         │                      │
    │                         ├───────────────────────►│                      │
    │                         │                        │                      │
    │                         │                        │  GET /api/docs-json  │
    │                         │                        ├─────────────────────►│
    │                         │                        │◄─────────────────────┤
    │                         │                        │                      │
    │                         │                        │  GET /api-json       │
    │                         │                        ├─────────────────────►│
    │                         │                        │◄─────────────────────┤
    │                         │                        │                      │
    │                         │                        │  GET /v3/api-docs    │
    │                         │                        ├─────────────────────►│
    │                         │                        │◄─────────────────────┤
    │                         │                        │                      │
    │                         │  HTML + assets         │                      │
    │                         │◄───────────────────────┤                      │
    │◄────────────────────────┤                        │                      │
    │                         │                        │                      │
    │                         │                        │                      │
    │  GET /api/usuarios/users│                        │                      │
    ├────────────────────────►│                        │                      │
    │                         │  GET /users            │                      │
    │                         ├──────────────────────────────────────────────►│
    │                         │◄──────────────────────────────────────────────┤
    │◄────────────────────────┤                        │                      │
```

---

## Conclusión

La implementación del **API Gateway con Kong** centraliza el acceso a los tres microservicios bajo un único punto de entrada (`localhost:8000`), abstrae la complejidad de las rutas internas y proporciona una **documentación Swagger unificada** que permite explorar y probar todos los endpoints desde una sola interfaz, simplificando el desarrollo, las pruebas y el despliegue en producción.
