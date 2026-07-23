import Fastify from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { GatewayConfig } from './config.js';
import { registerRequestId } from './middleware/requestId.js';
import { errorHandler } from './middleware/errorHandler.js';
import { registerHealthRoutes } from './routes/health.js';
import { registerContractRoutes } from './routes/contract.js';

type RequestWithId = FastifyRequest & { requestId?: string };

export function buildServer(config: GatewayConfig) {
  const app = Fastify({
    logger: config.NODE_ENV !== 'test',
  });

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

  return app;
}
