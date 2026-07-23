import { describe, it, expect } from 'vitest';
import { buildServer } from '../server.js';
import { loadConfig } from '../config.js';
import {
  GatewaySessionViewSchema,
  GatewayMessageViewSchema,
} from '../../../../packages/contracts/src/gateway.js';

function createTestApp() {
  const config = loadConfig({ NODE_ENV: 'test', GATEWAY_PORT: 0 } as any);
  return buildServer(config);
}

describe('GET /contract/status', () => {
  it('returns 200', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/contract/status' });
    expect(res.statusCode).toBe(200);
  });

  it('reports contract-only mode', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/contract/status' });
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('mode', 'contract-only');
    expect(body).toHaveProperty('connection', 'offline');
    expect(body).toHaveProperty('capabilities');
    expect(body.capabilities).toHaveProperty('sessions', 'mock');
    expect(body.capabilities).toHaveProperty('messages', 'mock');
    expect(body.capabilities).toHaveProperty('permissions', 'mock');
    expect(body.capabilities).toHaveProperty('preview', 'not-implemented');
  });
});

describe('GET /contract/demo/sessions', () => {
  it('returns array', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/contract/demo/sessions' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(3);
  });

  it('items have isDemo=true', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/contract/demo/sessions' });
    const body = JSON.parse(res.payload);
    for (const session of body) {
      expect(session).toHaveProperty('isDemo', true);
    }
  });

  it('validates against Zod schema', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/contract/demo/sessions' });
    const body = JSON.parse(res.payload);
    for (const session of body) {
      const result = GatewaySessionViewSchema.safeParse(session);
      expect(result.success).toBe(true);
    }
  });
});

describe('GET /contract/demo/messages', () => {
  it('returns array', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/contract/demo/messages' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(5);
  });

  it('items have isDemo=true', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/contract/demo/messages' });
    const body = JSON.parse(res.payload);
    for (const msg of body) {
      expect(msg).toHaveProperty('isDemo', true);
    }
  });

  it('validates against Zod schema', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/contract/demo/messages' });
    const body = JSON.parse(res.payload);
    for (const msg of body) {
      const result = GatewayMessageViewSchema.safeParse(msg);
      expect(result.success).toBe(true);
    }
  });
});

describe('Demo IDs', () => {
  it('session IDs start with demo- prefix', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/contract/demo/sessions' });
    const body = JSON.parse(res.payload);
    for (const session of body) {
      expect(session.id).toMatch(/^demo-/);
    }
  });

  it('message IDs start with demo- prefix', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/contract/demo/messages' });
    const body = JSON.parse(res.payload);
    for (const msg of body) {
      expect(msg.id).toMatch(/^demo-/);
    }
  });
});

describe('Unknown route', () => {
  it('returns 404 with safe JSON', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/nonexistent' });
    expect(res.statusCode).toBe(404);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('ok', false);
    expect(body).toHaveProperty('error');
    expect(body.error).toHaveProperty('code', 'NOT_FOUND');
    expect(body.error).toHaveProperty('message');
    expect(body.error).toHaveProperty('requestId');
  });
});
