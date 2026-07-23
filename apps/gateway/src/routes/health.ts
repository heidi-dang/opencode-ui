import type { FastifyInstance } from 'fastify';
import type { GatewayRuntimeConfig } from '../config.js';
import { computeMode } from '../config.js';

/**
 * Health-check and readiness routes.
 *
 * These endpoints read the runtime config from the decorated Fastify
 * instance (`app.runtimeConfig`) to return environment-aware responses.
 */
export async function registerHealthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => {
    const config: GatewayRuntimeConfig = (app as FastifyInstance & { runtimeConfig: GatewayRuntimeConfig }).runtimeConfig;
    return {
      ok: true,
      service: 'opencode-ui-gateway',
      mode: computeMode(config),
      version: '0.1.0',
    };
  });

  app.get('/ready', async () => ({
    ok: true,
    gateway: 'scaffold',
    opencode: 'not-connected',
    sdk: 'not-installed',
    sse: 'not-implemented',
  }));
}
