import type { FastifyInstance } from 'fastify';
import type { GatewayRuntimeConfig } from '../config.js';
import { computeMode } from '../config.js';

/**
 * Fastify plugin that registers runtime config and adapter-health endpoints.
 *
 * These endpoints expose gateway runtime state without leaking
 * sensitive values (host, port, tokens, full URLs, etc.).
 */
export async function registerRuntimeRoutes(app: FastifyInstance): Promise<void> {
  /**
   * GET /runtime/config
   *
   * Returns the sanitised runtime configuration — metadata about
   * the gateway's environment and SDK readiness.
   *
   * NEVER returns raw env values such as host, port, logLevel,
   * serverUrl, defaultModel, or any secrets.
   */
  app.get('/runtime/config', async () => {
    const config: GatewayRuntimeConfig = (app as FastifyInstance & { runtimeConfig: GatewayRuntimeConfig }).runtimeConfig;
    const mode = computeMode(config);

    return {
      nodeEnv: config.nodeEnv,
      sdkEnabled: config.opencode.sdkEnabled,
      serverConfigured: !!config.opencode.serverUrl,
      modelConfigured: !!config.opencode.defaultModel,
      mode,
    };
  });

  /**
   * GET /runtime/adapter-health
   *
   * Returns the SDK adapter health status.
   * In Phase 2C the SDK adapter is always disabled or configured-but-not-connected.
   */
  app.get('/runtime/adapter-health', async () => {
    const config: GatewayRuntimeConfig = (app as FastifyInstance & { runtimeConfig: GatewayRuntimeConfig }).runtimeConfig;
    const mode = computeMode(config);

    if (mode === 'safe-disabled') {
      return {
        ok: true,
        adapter: 'disabled',
        connection: 'not-enabled',
        sdkInstalled: false,
        liveRequestsEnabled: false,
        message: 'OpenCode SDK integration is disabled.',
      };
    }

    // configuration-error and configured-not-connected both report as configured
    return {
      ok: true,
      adapter: 'configured',
      connection: 'not-connected',
      sdkInstalled: false,
      liveRequestsEnabled: false,
      message: 'OpenCode configuration is valid, but live SDK integration is not implemented.',
    };
  });
}
