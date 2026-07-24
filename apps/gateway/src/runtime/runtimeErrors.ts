/**
 * Typed error classes for configuration validation.
 *
 * These errors carry a structured `code` property that callers
 * can use to discriminate error types without relying on `instanceof`.
 */

/** Error thrown when environment-variable validation fails. */
export class ConfigValidationError extends Error {
  readonly code = 'CONFIG_VALIDATION_ERROR';

  constructor(message: string) {
    super(message);
    this.name = 'ConfigValidationError';
  }
}
