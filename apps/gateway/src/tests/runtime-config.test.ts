import { describe, it, expect } from 'vitest';
import {
  parseConfig,
  computeMode,
  ConfigValidationError,
  GatewayEnvSchema,
} from '../config.js';

describe('Config parsing – defaults', () => {
  it('Default config produces safe-disabled mode', () => {
    const config = parseConfig({});
    expect(computeMode(config)).toBe('safe-disabled');
    expect(config.opencode.sdkEnabled).toBe(false);
  });

  it('Missing SDK variables are accepted when disabled', () => {
    const config = parseConfig({
      GATEWAY_HOST: 'localhost',
      GATEWAY_PORT: '3001',
    });
    expect(config.opencode.sdkEnabled).toBe(false);
    expect(config.opencode.serverUrl).toBe('');
    expect(config.opencode.defaultModel).toBe('');
  });
});

describe('Config parsing – booleans', () => {
  it('Boolean false (string "false") parses correctly', () => {
    const config = parseConfig({
      GATEWAY_HOST: 'localhost',
      GATEWAY_PORT: '3001',
      OPENCODE_SDK_ENABLED: 'false',
      GATEWAY_CONFIG_STRICT: 'false',
    });
    expect(config.opencode.sdkEnabled).toBe(false);
    expect(config.strictConfig).toBe(false);
  });

  it('Boolean true (string "true") parses correctly', () => {
    const config = parseConfig({
      GATEWAY_HOST: 'localhost',
      GATEWAY_PORT: '3001',
      OPENCODE_SDK_ENABLED: 'true',
      GATEWAY_CONFIG_STRICT: 'true',
    });
    expect(config.opencode.sdkEnabled).toBe(true);
    expect(config.strictConfig).toBe(true);
  });

  it('Boolean true (string "1") parses as true', () => {
    const config = parseConfig({
      GATEWAY_HOST: 'localhost',
      GATEWAY_PORT: '3001',
      OPENCODE_SDK_ENABLED: '1',
    });
    expect(config.opencode.sdkEnabled).toBe(true);
  });
});

describe('Config parsing – port validation', () => {
  it('Valid gateway port accepted', () => {
    const config = parseConfig({ GATEWAY_HOST: 'localhost', GATEWAY_PORT: '8080' });
    expect(config.port).toBe(8080);
  });

  it('Port zero rejected', () => {
    expect(() => parseConfig({ GATEWAY_HOST: 'localhost', GATEWAY_PORT: '0' })).toThrow(
      ConfigValidationError,
    );
  });

  it('Negative port rejected', () => {
    expect(() => parseConfig({ GATEWAY_HOST: 'localhost', GATEWAY_PORT: '-1' })).toThrow(
      ConfigValidationError,
    );
  });

  it('Port above 65535 rejected', () => {
    expect(() => parseConfig({ GATEWAY_HOST: 'localhost', GATEWAY_PORT: '65536' })).toThrow(
      ConfigValidationError,
    );
  });
});

describe('Config parsing – host validation', () => {
  it('Empty host rejected', () => {
    expect(() => parseConfig({ GATEWAY_HOST: '', GATEWAY_PORT: '3001' })).toThrow(
      ConfigValidationError,
    );
  });

  it('Host containing scheme rejected', () => {
    expect(() => parseConfig({ GATEWAY_HOST: 'https://localhost', GATEWAY_PORT: '3001' })).toThrow(
      ConfigValidationError,
    );
  });
});

describe('Config parsing – log level', () => {
  it('Invalid log level rejected', () => {
    expect(() =>
      parseConfig({ GATEWAY_HOST: 'localhost', GATEWAY_PORT: '3001', GATEWAY_LOG_LEVEL: 'trace' }),
    ).toThrow(ConfigValidationError);
  });
});

describe('Config parsing – NODE_ENV', () => {
  it('Valid NODE_ENV values accepted', () => {
    const dev = parseConfig({ GATEWAY_HOST: 'localhost', GATEWAY_PORT: '3001', NODE_ENV: 'development' });
    expect(dev.nodeEnv).toBe('development');

    const test = parseConfig({ GATEWAY_HOST: 'localhost', GATEWAY_PORT: '3001', NODE_ENV: 'test' });
    expect(test.nodeEnv).toBe('test');

    const prod = parseConfig({ GATEWAY_HOST: 'localhost', GATEWAY_PORT: '3001', NODE_ENV: 'production' });
    expect(prod.nodeEnv).toBe('production');
  });

  it('Invalid NODE_ENV rejected', () => {
    expect(() =>
      parseConfig({ GATEWAY_HOST: 'localhost', GATEWAY_PORT: '3001', NODE_ENV: 'staging' }),
    ).toThrow(ConfigValidationError);
  });
});

describe('Config parsing – URL validation', () => {
  it('Enabled mode requires server URL', () => {
    const config = parseConfig({
      GATEWAY_HOST: 'localhost',
      GATEWAY_PORT: '3001',
      OPENCODE_SDK_ENABLED: 'true',
      OPENCODE_DEFAULT_MODEL: 'test-model',
      // no OPENCODE_SERVER_URL
    });
    expect(computeMode(config)).toBe('configuration-error');
  });

  it('Enabled mode requires default model', () => {
    const config = parseConfig({
      GATEWAY_HOST: 'localhost',
      GATEWAY_PORT: '3001',
      OPENCODE_SDK_ENABLED: 'true',
      OPENCODE_SERVER_URL: 'https://api.example.com',
      // no OPENCODE_DEFAULT_MODEL
    });
    expect(computeMode(config)).toBe('configuration-error');
  });

  it('Malformed URL rejected', () => {
    expect(() =>
      parseConfig({
        GATEWAY_HOST: 'localhost',
        GATEWAY_PORT: '3001',
        OPENCODE_SDK_ENABLED: 'true',
        OPENCODE_SERVER_URL: 'not-a-valid-url',
      }),
    ).toThrow(ConfigValidationError);
  });

  it('URL with embedded credentials rejected', () => {
    expect(() =>
      parseConfig({
        GATEWAY_HOST: 'localhost',
        GATEWAY_PORT: '3001',
        OPENCODE_SDK_ENABLED: 'true',
        OPENCODE_SERVER_URL: 'https://user:pass@api.example.com',
      }),
    ).toThrow(ConfigValidationError);
  });

  it('Valid HTTP URL accepted', () => {
    const config = parseConfig({
      GATEWAY_HOST: 'localhost',
      GATEWAY_PORT: '3001',
      OPENCODE_SDK_ENABLED: 'true',
      OPENCODE_SERVER_URL: 'http://api.example.com',
      OPENCODE_DEFAULT_MODEL: 'test-model',
    });
    expect(config.opencode.serverUrl).toBe('http://api.example.com');
  });

  it('Valid HTTPS URL accepted', () => {
    const config = parseConfig({
      GATEWAY_HOST: 'localhost',
      GATEWAY_PORT: '3001',
      OPENCODE_SDK_ENABLED: 'true',
      OPENCODE_SERVER_URL: 'https://api.example.com',
      OPENCODE_DEFAULT_MODEL: 'test-model',
    });
    expect(config.opencode.serverUrl).toBe('https://api.example.com');
  });
});

describe('Config parsing – complete config', () => {
  it('Complete config becomes configured-not-connected', () => {
    const config = parseConfig({
      GATEWAY_HOST: '0.0.0.0',
      GATEWAY_PORT: '4000',
      NODE_ENV: 'production',
      GATEWAY_LOG_LEVEL: 'warn',
      GATEWAY_CONFIG_STRICT: 'true',
      OPENCODE_SDK_ENABLED: 'true',
      OPENCODE_SERVER_URL: 'https://api.opencode.ai',
      OPENCODE_DEFAULT_MODEL: 'gemini-2.5-pro',
    });
    expect(config.nodeEnv).toBe('production');
    expect(config.host).toBe('0.0.0.0');
    expect(config.port).toBe(4000);
    expect(config.logLevel).toBe('warn');
    expect(config.strictConfig).toBe(true);
    expect(config.opencode.sdkEnabled).toBe(true);
    expect(config.opencode.serverUrl).toBe('https://api.opencode.ai');
    expect(config.opencode.defaultModel).toBe('gemini-2.5-pro');
    expect(computeMode(config)).toBe('configured-not-connected');
  });
});

describe('GatewayEnvSchema – direct schema tests', () => {
  it('Default values applied when missing', () => {
    const result = GatewayEnvSchema.parse({});
    expect(result.GATEWAY_HOST).toBe('127.0.0.1');
    expect(result.GATEWAY_PORT).toBe(3001);
    expect(result.NODE_ENV).toBe('development');
    expect(result.GATEWAY_LOG_LEVEL).toBe('info');
    expect(result.GATEWAY_CONFIG_STRICT).toBe(true);
    expect(result.OPENCODE_SDK_ENABLED).toBe(false);
    expect(result.OPENCODE_SERVER_URL).toBe('');
    expect(result.OPENCODE_DEFAULT_MODEL).toBe('');
  });
});
