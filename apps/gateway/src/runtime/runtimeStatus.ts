/**
 * Gateway runtime status helpers.
 *
 * These utilities derive high-level operational state from the
 * canonical runtime config. Most logic lives in `config.ts`; this
 * module re-exports for convenience.
 */

export { computeMode } from '../config.js';
export type { RunMode } from '../config.js';
