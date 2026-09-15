import { describe, expect, it } from 'vitest';
import { validateEnvironment } from './environment';

const requiredEnvironment = {
  NODE_ENV: 'test',
  DATABASE_URL: 'postgresql://fitness:fitness@localhost:5432/fitness',
  JWT_ACCESS_SECRET: 'test-access-secret-at-least-32-characters',
  JWT_REFRESH_SECRET: 'test-refresh-secret-at-least-32-characters',
};

describe('validateEnvironment', () => {
  it('converts the string PORT supplied by deployment environments', () => {
    expect(validateEnvironment({ ...requiredEnvironment, PORT: '8000' }).PORT).toBe(8000);
  });

  it('rejects a non-numeric PORT', () => {
    expect(() => validateEnvironment({ ...requiredEnvironment, PORT: 'invalid' })).toThrow();
  });
});
