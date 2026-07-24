import Fastify from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { GatewayRuntimeConfig } from './config.js';
import { registerRequestId } from './middleware/requestId.js';
import { errorHandler } from './middleware/errorHandler.js';
import { registerHealthRoutes } from './routes/health.js';
import { registerContractRoutes } from './routes/contract.js';
import { registerRuntimeRoutes } from './routes/runtime.js';

// Augment FastifyInstance so app.runtimeConfig is type-safe everywhere.
declare module 'fastify' {
  interface FastifyInstance {
    runtimeConfig: GatewayRuntimeConfig;
  }
}

type RequestWithId = FastifyRequest & { requestId?: string };

/**
 * Build and configure a Fastify gateway instance.
 *
 * This function wires up middleware, error handlers, and all route plugins.
 * It does NOT call `.listen()` — the caller is responsible for that.
 *
 * @param config - Validated runtime configuration.
 */
export function buildServer(config: GatewayRuntimeConfig) {
  const app = Fastify({
    logger: config.nodeEnv !== 'test',
  });

  // Decorate instance with the runtime config for downstream access
  app.decorate('runtimeConfig', config);

  // Register middleware
  registerRequestId(app);

  // Custom error handler
  app.setErrorHandler(errorHandler);

  // 404 handler – returns safe JSON
  app.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    const requestId = (request as RequestWithId).requestId ?? 'unknown';
    reply.status(404).send({
      ok: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
        requestId,
      },
    });
  });

  // Register routes
  app.register(registerHealthRoutes);
  app.register(registerContractRoutes);
  app.register(registerRuntimeRoutes);

  return app;
}
