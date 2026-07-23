/**
 * Disabled SDK adapter — safe default when OpenCode SDK is not enabled.
 *
 * This adapter returns safe "not-enabled" state for all operations.
 * No SDK calls, no network, no credentials.
 *
 * Phase 2B: Default state. Must be explicitly enabled via config.
 */

import type { SdkAdapter, SdkAdapterState, SdkConfig, SdkHealthView } from './sdkTypes.js';

/** Error thrown when SDK operations are attempted while disabled. */
export class SdkNotEnabledError extends Error {
  readonly code = 'SDK_NOT_ENABLED';
  constructor() {
    super('OpenCode SDK is not enabled. Set OPENCODE_SDK_ENABLED=true and configure OPENCODE_SERVER_URL.');
    this.name = 'SdkNotEnabledError';
  }
}

export function createDisabledSdkAdapter(): SdkAdapter {
  const state: SdkAdapterState = 'not-enabled';

  return {
    state,

    getHealth(): SdkHealthView {
      return {
        enabled: false,
        state,
        serverConfigured: false,
        modelConfigured: false,
      };
    },

    async init(_config: SdkConfig): Promise<void> {
      // Disabled adapter never initialises — throw safe error
      throw new SdkNotEnabledError();
    },

    async destroy(): Promise<void> {
      // No-op: nothing to clean up
    },
  };
}
