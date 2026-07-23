/**
 * Gateway SDK type definitions.
 *
 * These types define the interface for the OpenCode SDK adapter.
 * Phase 2B: Disabled by default. No live SDK connection.
 */

/** SDK adapter state reported to the rest of the gateway. */
export type SdkAdapterState = 'not-enabled' | 'enabled' | 'error' | 'connecting' | 'connected';

/** Configuration required to initialise the SDK adapter. */
export interface SdkConfig {
  readonly serverUrl: string;
  readonly defaultModel: string;
}

/** Minimal SDK health view model. */
export interface SdkHealthView {
  readonly enabled: boolean;
  readonly state: SdkAdapterState;
  readonly serverConfigured: boolean;
  readonly modelConfigured: boolean;
  readonly error?: string;
}

/**
 * SDK adapter interface.
 *
 * The gateway uses this interface to interact with OpenCode.
 * In Phase 2B, only the disabled implementation exists.
 */
export interface SdkAdapter {
  /** Get the current state of the adapter. */
  readonly state: SdkAdapterState;

  /** Get a health view for API responses. */
  getHealth(): SdkHealthView;

  /** Initialise the adapter. Throws if not configured. */
  init(config: SdkConfig): Promise<void>;

  /** Destroy the adapter and clean up resources. */
  destroy(): Promise<void>;
}
