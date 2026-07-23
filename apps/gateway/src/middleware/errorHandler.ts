import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

type RequestWithId = FastifyRequest & { requestId?: string };

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  const requestId = (request as RequestWithId).requestId ?? 'unknown';

  const statusCode = error.statusCode ?? 500;
  const isInternal = statusCode >= 500;

  const code = statusCode === 400 || error.validation ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR';

  // Mask internal details in production
  const message =
    isInternal && process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : error.message;

  reply.status(statusCode).send({
    ok: false,
    error: { code, message, requestId },
  });
}
