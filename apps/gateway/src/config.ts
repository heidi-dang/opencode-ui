import { z } from 'zod';
import { ConfigValidationError } from './runtime/runtimeErrors.js';

export { ConfigValidationError };

// ── Zod schemas ──────────────────────────────────────────────────────────────

const LogLevelSchema = z.enum(['silent', 'error', 'warn', 'info', 'debug']);
const NodeEnvSchema = z.enum(['development', 'test', 'production']);

/** URL validation: must be http/https, no embedded credentials, or empty. */
const SdkServerUrlSchema = z.string().refine(
  (val) => {
    if (!val) return true; // empty is ok when disabled
    try {
      const url = new URL(val);
      if (url.username || url.password) return false; // reject embedded credentials
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  },
  'Must be a valid HTTP or HTTPS URL without embedded credentials',
);

/**
 * Custom boolean preprocessor that correctly handles the string 'false' and '0'.
 *
 * `z.coerce.boolean()` alone treats any non-empty string (including 'false')
 * as truthy. This preprocess step converts common falsey strings to `false`
 * before the coercion step.
 */
const BooleanSchema = z.preprocess(
  (val) => {
    if (typeof val === 'string') {
      if (val === 'true' || val === '1') return true;
      if (val === 'false' || val === '0') return false;
    }
    return val;
  },
  z.coerce.boolean(),
);

/**
 * Zod schema for gateway environment variables.
 * All keys are optional in the input; defaults are applied.
 */
export const GatewayEnvSchema = z.object({
  NODE_ENV: NodeEnvSchema.default('development'),
  GATEWAY_HOST: z
    .string()
    .min(1, 'GATEWAY_HOST must be non-empty')
    .refine((val) => !val.includes('://'), 'GATEWAY_HOST must not contain URL schemes')
    .refine((val) => !val.includes('/'), 'GATEWAY_HOST must not contain paths')
    .default('127.0.0.1'),
  GATEWAY_PORT: z
    .coerce
    .number()
    .int('GATEWAY_PORT must be an integer')
    .min(1, 'GATEWAY_PORT must be between 1 and 65535')
    .max(65535, 'GATEWAY_PORT must be between 1 and 65535')
    .default(3001),
  GATEWAY_LOG_LEVEL: LogLevelSchema.default('info'),
  GATEWAY_CONFIG_STRICT: BooleanSchema.default(true),
  OPENCODE_SDK_ENABLED: BooleanSchema.default(false),
  OPENCODE_SERVER_URL: SdkServerUrlSchema.default(''),
  OPENCODE_DEFAULT_MODEL: z.string().default(''),
});

/** Type of the raw Zod-parsed environment (after defaults are applied). */
export type GatewayEnv = z.infer<typeof GatewayEnvSchema>;

// ── Runtime config shape ─────────────────────────────────────────────────────

/**
 * Canonical runtime configuration consumed by the gateway.
 *
 * This is a clean, typed representation of all gateway settings,
 * derived from environment variables via Zod validation.
 */
export interface GatewayRuntimeConfig {
  nodeEnv: 'development' | 'test' | 'production';
  host: string;
  port: number;
  logLevel: 'silent' | 'error' | 'warn' | 'info' | 'debug';
  strictConfig: boolean;
  opencode: {
    sdkEnabled: boolean;
    serverUrl: string;
    defaultModel: string;
  };
}

/** Describes the gateway's SDK integration readiness. */
export type RunMode = 'safe-disabled' | 'configuration-error' | 'configured-not-connected';

// ── Mode computation ─────────────────────────────────────────────────────────

/**
 * Compute the SDK run mode from the runtime config.
 *
 * - `safe-disabled`: SDK is not enabled (default).
 * - `configuration-error`: SDK is enabled but serverUrl or defaultModel is missing.
 * - `configured-not-connected`: SDK is enabled and both values are present.
 */
export function computeMode(config: GatewayRuntimeConfig): RunMode {
  if (!config.opencode.sdkEnabled) return 'safe-disabled';
  if (!config.opencode.serverUrl || !config.opencode.defaultModel) return 'configuration-error';
  return 'configured-not-connected';
}

// ── Parser ───────────────────────────────────────────────────────────────────

/**
 * Parse environment variables and return a validated `GatewayRuntimeConfig`.
 *
 * @param env - Environment key/value map (defaults to `process.env`).
 * @throws {ConfigValidationError} When validation fails.
 */
export function parseConfig(
  env: Record<string, string | undefined> = process.env,
): GatewayRuntimeConfig {
  const result = GatewayEnvSchema.safeParse(env);

  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');
    throw new ConfigValidationError(`Configuration validation failed: ${issues}`);
  }

  const e = result.data;

  return {
    nodeEnv: e.NODE_ENV,
    host: e.GATEWAY_HOST,
    port: e.GATEWAY_PORT,
    logLevel: e.GATEWAY_LOG_LEVEL,
    strictConfig: e.GATEWAY_CONFIG_STRICT,
    opencode: {
      sdkEnabled: e.OPENCODE_SDK_ENABLED,
      serverUrl: e.OPENCODE_SERVER_URL,
      defaultModel: e.OPENCODE_DEFAULT_MODEL,
    },
  };
}

// ── Legacy backward-compatible helper ────────────────────────────────────────

/**
 * Backward-compatible wrapper around `parseConfig`.
 *
 * Accepts optional partial `GatewayRuntimeConfig` overrides.
 * This is kept for existing call sites that have not yet migrated
 * to the new config shape. Prefer `parseConfig()` in new code.
 */
export function loadConfig(overrides?: Partial<GatewayRuntimeConfig>): GatewayRuntimeConfig {
  const config = parseConfig();
  if (overrides) {
    return { ...config, ...overrides };
  }
  return config;
}
