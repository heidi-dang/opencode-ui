/**
 * Frontend-only presentation contracts for the OpenCode Web UI.
 *
 * These are visual-state contracts used by UI components to render
 * consistent statuses, states, and modes. They are NOT API payloads,
 * SDK types, or backend data contracts.
 *
 * All data displayed in Phase 1A and 1B is demo/mock data only.
 */

/** Visual loadable state for panels and sections. */
export type LoadableState = 'idle' | 'loading' | 'ready' | 'empty' | 'error' | 'degraded';

/** Visual gateway connection status (frontend presentation only). */
export type ConnectionState =
  | 'offline'
  | 'connecting'
  | 'connected'
  | 'degraded'
  | 'reconnecting';

/** Visual session status badge values. */
export type SessionStatus =
  | 'idle'
  | 'busy'
  | 'retrying'
  | 'attention'
  | 'error';

/** Context panel section identifiers. */
export type ContextSection =
  | 'referenced'
  | 'modified'
  | 'workspace'
  | 'todos';

/** Appearance mode for the UI. */
export type AppearanceMode = 'system' | 'light' | 'dark';

/** Main view route identifiers. */
export type MainView = 'builder' | 'live-preview';

/** Demo boundary marker — all data in Phase 1A/1B is demo-only. */
export type DemoBoundary = {
  readonly mode: 'demo';
  readonly liveData: false;
};

/** Visual status metadata for consistent rendering across the UI. */
export interface StatusVisual {
  label: string;
  description?: string;
  /** Tailwind bg/border classes */
  containerClass: string;
  /** Tailwind text class */
  textClass: string;
}

/** Mapping from SessionStatus to visual presentation data. */
export const SESSION_STATUS_VISUALS: Record<SessionStatus, StatusVisual> = {
  idle: {
    label: 'Idle',
    description: 'Session is ready and waiting.',
    containerClass: 'bg-emerald-500/10 border-emerald-500/20',
    textClass: 'text-emerald-400',
  },
  busy: {
    label: 'Busy',
    description: 'Session is actively processing.',
    containerClass: 'bg-amber-500/10 border-amber-500/20',
    textClass: 'text-amber-400',
  },
  retrying: {
    label: 'Retrying',
    description: 'Gateway reconnection in progress.',
    containerClass: 'bg-blue-500/10 border-blue-500/20',
    textClass: 'text-blue-400',
  },
  attention: {
    label: 'Attention',
    description: 'User attention required.',
    containerClass: 'bg-orange-500/10 border-orange-500/20',
    textClass: 'text-orange-400',
  },
  error: {
    label: 'Error',
    description: 'Session encountered an error.',
    containerClass: 'bg-red-500/10 border-red-500/20',
    textClass: 'text-red-400',
  },
};

/** Mapping from ConnectionState to visual presentation data. */
export const CONNECTION_STATE_VISUALS: Record<ConnectionState, StatusVisual> = {
  offline: {
    label: 'Offline',
    description: 'Gateway is disconnected.',
    containerClass: 'bg-slate-500/10 border-slate-500/20',
    textClass: 'text-slate-400',
  },
  connecting: {
    label: 'Connecting',
    description: 'Attempting to connect to gateway.',
    containerClass: 'bg-blue-500/10 border-blue-500/20',
    textClass: 'text-blue-400',
  },
  connected: {
    label: 'Connected',
    description: 'Gateway is online.',
    containerClass: 'bg-emerald-500/10 border-emerald-500/20',
    textClass: 'text-emerald-400',
  },
  degraded: {
    label: 'Degraded',
    description: 'Gateway connection is unstable.',
    containerClass: 'bg-amber-500/10 border-amber-500/20',
    textClass: 'text-amber-400',
  },
  reconnecting: {
    label: 'Reconnecting',
    description: 'Attempting to restore gateway connection.',
    containerClass: 'bg-orange-500/10 border-orange-500/20',
    textClass: 'text-orange-400',
  },
};

/** Human-readable labels for context sections. */
export const CONTEXT_SECTION_LABELS: Record<ContextSection, string> = {
  referenced: 'Referenced',
  modified: 'Modified',
  workspace: 'Workspace',
  todos: 'Todos',
};
