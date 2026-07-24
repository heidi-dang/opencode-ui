import { describe, it, expect } from 'vitest';
import { buildServer } from '../server.js';
import { loadConfig } from '../config.js';

function createTestApp() {
  const config = loadConfig({ nodeEnv: 'test', port: 3001 });
  return buildServer(config);
}

describe('GET /health', () => {
  it('returns 200 with correct shape', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('ok', true);
    expect(body).toHaveProperty('service', 'opencode-ui-gateway');
    expect(body).toHaveProperty('version', '0.1.0');
  });

  it('reports safe-disabled mode by default', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/health' });
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('mode', 'safe-disabled');
  });
});

describe('GET /ready', () => {
  it('returns 200 with correct shape', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/ready' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('ok', true);
    expect(body).toHaveProperty('gateway', 'scaffold');
  });

  it('reports opencode not-connected', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/ready' });
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('opencode', 'not-connected');
  });

  it('reports sdk not-installed', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/ready' });
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('sdk', 'not-installed');
  });

  it('reports sse not-implemented', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/ready' });
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('sse', 'not-implemented');
  });
});
