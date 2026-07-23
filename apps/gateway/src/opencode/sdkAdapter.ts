/**
 * SDK adapter factory — creates the appropriate adapter based on config.
 *
 * Phase 2B: Only the disabled adapter is supported.
 * Enabled adapter will be added in a future phase.
 */

import type { SdkAdapter } from './sdkTypes.js';
import { createDisabledSdkAdapter } from './sdkDisabled.js';

export interface SdkAdapterOptions {
  readonly enabled: boolean;
}

/**
 * Create an SDK adapter based on the provided options.
 *
 * When `enabled` is false (the default), returns a disabled adapter
 * that throws `SdkNotEnabledError` on any initialisation attempt.
 */
export function createSdkAdapter(options: SdkAdapterOptions): SdkAdapter {
  if (!options.enabled) {
    return createDisabledSdkAdapter();
  }

  // Future: return live SDK adapter here when implemented
  // Phase 2B: only disabled adapter exists
  return createDisabledSdkAdapter();
}
