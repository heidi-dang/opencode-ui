/**
 * Canonical runtime-config layer for the gateway.
 *
 * This is the single import target for the rest of the gateway codebase.
 * It re-exports all config types, schemas, parsers, and mode helpers.
 *
 * To add module augmentations (e.g. Fastify decorators), extend this file.
 */

export type { GatewayRuntimeConfig, GatewayEnv, RunMode } from '../config.js';
export { GatewayEnvSchema, parseConfig, loadConfig, computeMode } from '../config.js';
export { ConfigValidationError } from './runtimeErrors.js';
