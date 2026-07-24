import { describe, it, expect, afterAll } from 'vitest';
import { loadConfig, parseConfig, computeMode, ConfigValidationError } from '../config.js';

const ORIGINAL_ENV = { ...process.env };

describe('loadConfig', () => {
  afterAll(() => {
    // Restore original env
    Object.assign(process.env, ORIGINAL_ENV);
  });

  it('reads GATEWAY_HOST from env', () => {
    process.env.GATEWAY_HOST = '0.0.0.0';
    process.env.GATEWAY_PORT = '3001';
    process.env.NODE_ENV = 'test';
    const config = loadConfig();
    expect(config.host).toBe('0.0.0.0');
  });

  it('reads GATEWAY_PORT from env', () => {
    process.env.GATEWAY_HOST = '127.0.0.1';
    process.env.GATEWAY_PORT = '8080';
    process.env.NODE_ENV = 'test';
    const config = loadConfig();
    expect(config.port).toBe(8080);
  });

  it('uses defaults when env is empty', () => {
    delete process.env.GATEWAY_HOST;
    delete process.env.GATEWAY_PORT;
    delete process.env.NODE_ENV;
    const config = loadConfig();
    expect(config.host).toBe('127.0.0.1');
    expect(config.port).toBe(3001);
    expect(config.nodeEnv).toBe('development');
  });

  it('invalid port string rejects', () => {
    process.env.GATEWAY_PORT = 'not-a-number';
    expect(() => parseConfig()).toThrow(ConfigValidationError);
  });

  it('produces safe-disabled mode by default', () => {
    delete process.env.GATEWAY_HOST;
    delete process.env.GATEWAY_PORT;
    delete process.env.NODE_ENV;
    const config = loadConfig();
    expect(computeMode(config)).toBe('safe-disabled');
  });

  it('supports overrides via loadConfig', () => {
    const config = loadConfig({ nodeEnv: 'test', port: 9999 });
    expect(config.nodeEnv).toBe('test');
    expect(config.port).toBe(9999);
  });
});
