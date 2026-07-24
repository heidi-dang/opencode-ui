import { describe, it, expect } from 'vitest';
import { buildServer } from '../server.js';
import { loadConfig, parseConfig } from '../config.js';

function createTestApp() {
  const config = loadConfig({ nodeEnv: 'test', port: 3001 });
  return buildServer(config);
}

function createEnabledTestApp() {
  const config = parseConfig({
    GATEWAY_HOST: 'localhost',
    GATEWAY_PORT: '3001',
    NODE_ENV: 'test',
    OPENCODE_SDK_ENABLED: 'true',
    OPENCODE_SERVER_URL: 'https://api.opencode.ai',
    OPENCODE_DEFAULT_MODEL: 'gemini-2.5-pro',
  });
  return buildServer(config);
}

describe('GET /runtime/config', () => {
  it('returns valid JSON', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/runtime/config' });
    expect(res.statusCode).toBe(200);
    expect(() => JSON.parse(res.payload)).not.toThrow();
  });

  it('validates against expected shape', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/runtime/config' });
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('nodeEnv');
    expect(body).toHaveProperty('sdkEnabled', false);
    expect(body).toHaveProperty('serverConfigured', false);
    expect(body).toHaveProperty('modelConfigured', false);
    expect(body).toHaveProperty('mode', 'safe-disabled');
    // Ensure sensitive values are NOT leaked
    expect(body).not.toHaveProperty('host');
    expect(body).not.toHaveProperty('port');
    expect(body).not.toHaveProperty('logLevel');
    expect(body).not.toHaveProperty('serverUrl');
    expect(body).not.toHaveProperty('defaultModel');
  });

  it('does not return raw env values', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/runtime/config' });
    const body = JSON.parse(res.payload);
    expect(body).not.toHaveProperty('GATEWAY_HOST');
    expect(body).not.toHaveProperty('GATEWAY_PORT');
    expect(body).not.toHaveProperty('OPENCODE_SERVER_URL');
    expect(body).not.toHaveProperty('OPENCODE_DEFAULT_MODEL');
  });
});

describe('GET /runtime/adapter-health', () => {
  it('returns valid JSON', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/runtime/adapter-health' });
    expect(res.statusCode).toBe(200);
    expect(() => JSON.parse(res.payload)).not.toThrow();
  });

  it('default adapter health reports disabled', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/runtime/adapter-health' });
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('ok', true);
    expect(body).toHaveProperty('adapter', 'disabled');
  });

  it('sdk installed is false', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/runtime/adapter-health' });
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('sdkInstalled', false);
  });

  it('live requests is false', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/runtime/adapter-health' });
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('liveRequestsEnabled', false);
  });

  it('has correct default message', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/runtime/adapter-health' });
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('message', 'OpenCode SDK integration is disabled.');
  });
});

describe('GET /runtime/adapter-health – enabled config', () => {
  it('shows configured-not-connected when SDK is enabled and configured', async () => {
    const app = createEnabledTestApp();
    const res = await app.inject({ method: 'GET', url: '/runtime/adapter-health' });
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('ok', true);
    expect(body).toHaveProperty('adapter', 'configured');
    expect(body).toHaveProperty('connection', 'not-connected');
    expect(body).toHaveProperty('sdkInstalled', false);
    expect(body).toHaveProperty('liveRequestsEnabled', false);
    expect(body).toHaveProperty(
      'message',
      'OpenCode configuration is valid, but live SDK integration is not implemented.',
    );
  });

  it('enabled config runtime/config shows configured-not-connected mode', async () => {
    const app = createEnabledTestApp();
    const res = await app.inject({ method: 'GET', url: '/runtime/config' });
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('sdkEnabled', true);
    expect(body).toHaveProperty('serverConfigured', true);
    expect(body).toHaveProperty('modelConfigured', true);
    expect(body).toHaveProperty('mode', 'configured-not-connected');
  });
});

describe('Unknown runtime route', () => {
  it('returns safe 404 for unknown runtime route', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/runtime/nonexistent' });
    expect(res.statusCode).toBe(404);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('ok', false);
    expect(body).toHaveProperty('error');
    expect(body.error).toHaveProperty('code', 'NOT_FOUND');
  });
});

describe('Existing health routes still work', () => {
  it('GET /health passes', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('ok', true);
    expect(body).toHaveProperty('service', 'opencode-ui-gateway');
  });

  it('GET /ready still accurate', async () => {
    const app = createTestApp();
    const res = await app.inject({ method: 'GET', url: '/ready' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('ok', true);
    expect(body).toHaveProperty('gateway', 'scaffold');
    expect(body).toHaveProperty('opencode', 'not-connected');
    expect(body).toHaveProperty('sdk', 'not-installed');
    expect(body).toHaveProperty('sse', 'not-implemented');
  });
});
