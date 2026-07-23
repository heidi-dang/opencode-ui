import type { FastifyInstance } from 'fastify';

export async function registerHealthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => ({
    ok: true,
    service: 'opencode-ui-gateway',
    mode: 'scaffold',
    version: '0.1.0',
  }));

  app.get('/ready', async () => ({
    ok: true,
    gateway: 'scaffold',
    opencode: 'not-connected',
    sdk: 'not-installed',
    sse: 'not-implemented',
  }));
}
