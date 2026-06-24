import { Transform } from 'class-transformer';

export const toLowerTrim = Transform(({ value }) =>
  typeof value === 'string' ? value.toLowerCase().trim() : value,
);

export const toLowerSingleSpace = Transform(({ value }) =>
  typeof value === 'string'
    ? value.toLowerCase().replace(/\s+/g, ' ').trim()
    : value,
);

export const trimOnly = Transform(({ value }) =>
  typeof value === 'string' ? value.trim() : value,
);
