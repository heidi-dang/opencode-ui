/**
 * Frontend-safe gateway view models.
 *
 * These types define the shape of data that a future gateway server
 * will send to the frontend. They are NOT raw OpenCode API responses,
 * NOT SDK types, and NOT backend data contracts.
 *
 * Phase 1E: Contracts only — no gateway exists yet.
 * All current data is served by the demo adapter from local mocks.
 */

/** Gateway connection state presented to the UI. */
export type GatewayConnectionView =
  | 'offline'
  | 'connecting'
  | 'connected'
  | 'degraded'
  | 'reconnecting';

/** Frontend-safe session view model. */
export interface GatewaySessionView {
  readonly id: string;
  readonly title: string;
  readonly status: 'idle' | 'busy' | 'retrying' | 'attention' | 'error';
  readonly lastActivityLabel: string;
  readonly description?: string;
  readonly isDemo?: boolean;
}

/** Frontend-safe message view model. */
export interface GatewayMessageView {
  readonly id: string;
  readonly role: 'user' | 'assistant' | 'tool' | 'system';
  readonly content: string;
  readonly createdAtLabel: string;
  readonly isStreaming?: boolean;
  readonly isDemo?: boolean;
}

/** Frontend-safe permission prompt view model. */
export interface GatewayPermissionPromptView {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly riskLevel: 'low' | 'medium' | 'high';
  readonly requestedActionLabel: string;
}

/** Frontend-safe preview runtime status view model. */
export interface GatewayPreviewStatusView {
  readonly state: 'not-configured' | 'starting' | 'ready' | 'error' | 'stopped';
  readonly label: string;
  readonly canStart: boolean;
  readonly canStop: boolean;
}

/** Frontend-safe workspace registry entry. */
export interface GatewayWorkspaceEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly isDemo?: boolean;
}

/** Frontend-safe branch registry entry. */
export interface GatewayBranchEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly isDemo?: boolean;
}

/** Frontend-safe agent registry entry. */
export interface GatewayAgentEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly badge?: string;
  readonly isDemo?: boolean;
}

/** Frontend-safe model registry entry. */
export interface GatewayModelEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly badge?: string;
  readonly isDemo?: boolean;
}

/** Aggregate workspace registry view model. */
export interface GatewayWorkspaceRegistryView {
  readonly workspaces: readonly GatewayWorkspaceEntry[];
  readonly branches: readonly GatewayBranchEntry[];
  readonly agents: readonly GatewayAgentEntry[];
  readonly models: readonly GatewayModelEntry[];
  readonly isDemo: boolean;
}

/** Aggregate gateway status view model. */
export interface GatewayStatusView {
  readonly connection: GatewayConnectionView;
  readonly sessionCount: number;
  readonly gatewayVersion?: string;
  readonly isDemo: boolean;
}
