/**
 * Demo gateway adapter — maps existing local mock data into
 * frontend-safe gateway view models.
 *
 * This is a local-only synchronous adapter. No network calls.
 * No EventSource. No WebSocket. No OpenCode SDK.
 *
 * Purpose: prepare the frontend for future replacement with a
 * real gateway adapter in Phase 2.
 *
 * @demo-only — All data returned by this adapter is demo/mock data.
 */

import type {
  GatewaySessionView,
  GatewayMessageView,
  GatewayPreviewStatusView,
  GatewayPermissionPromptView,
  GatewayWorkspaceRegistryView,
  GatewayWorkspaceEntry,
  GatewayBranchEntry,
  GatewayAgentEntry,
  GatewayModelEntry,
  GatewayStatusView,
} from '../contracts/gatewayViewModels';
import {
  DEMO_SESSIONS,
  DEMO_MESSAGES,
  DEMO_WORKSPACES,
  DEMO_BRANCHES,
  DEMO_AGENTS,
  DEMO_MODELS,
} from '../mocks/frontendDemoData';
import type { DemoSession, DemoMessage, SelectorOption } from '../types/ui';

/**
 * Map a DemoSession to a GatewaySessionView.
 * Synchronous, local-only, no network.
 */
export function mapSessionToView(session: DemoSession): GatewaySessionView {
  return {
    id: session.id,
    title: session.title,
    status: session.status,
    lastActivityLabel: session.updatedAt,
    description: session.lastMessage,
    isDemo: true,
  };
}

/**
 * Map all demo sessions to GatewaySessionView[].
 */
export function mapAllSessionsToViews(): GatewaySessionView[] {
  return DEMO_SESSIONS.map(mapSessionToView);
}

/**
 * Get a single demo session view by ID.
 */
export function getSessionViewById(id: string): GatewaySessionView | undefined {
  const session = DEMO_SESSIONS.find((s) => s.id === id);
  return session ? mapSessionToView(session) : undefined;
}

/**
 * Map a DemoMessage to a GatewayMessageView.
 * Synchronous, local-only, no network.
 */
export function mapMessageToView(message: DemoMessage): GatewayMessageView {
  return {
    id: message.id,
    role: message.role as GatewayMessageView['role'],
    content: message.content,
    createdAtLabel: message.timestamp,
    isStreaming: false,
    isDemo: true,
  };
}

/**
 * Map all demo messages to GatewayMessageView[].
 * In Phase 1, messages are not filtered by session ID since
 * the demo data uses a flat message list.
 */
export function mapMessagesToViews(): GatewayMessageView[] {
  return DEMO_MESSAGES.map(mapMessageToView);
}

/**
 * Get the demo preview status — always "not-configured" in Phase 1.
 * Synchronous, local-only, no network.
 */
export function getDemoPreviewStatus(): GatewayPreviewStatusView {
  return {
    state: 'not-configured',
    label: 'Preview runtime not configured (Phase 9)',
    canStart: false,
    canStop: false,
  };
}

/**
 * Get a demo permission prompt — returns undefined since no
 * permission system is active in Phase 1.
 */
export function getDemoPermissionPrompt(): GatewayPermissionPromptView | undefined {
  return undefined;
}

/**
 * Map selector options to gateway entry types.
 */
function mapOptionsToEntries<T extends SelectorOption>(
  options: T[],
): (GatewayWorkspaceEntry | GatewayBranchEntry | GatewayAgentEntry | GatewayModelEntry)[] {
  return options.map((opt) => ({
    id: opt.id,
    name: opt.name,
    description: opt.description,
    ...(opt.badge ? { badge: opt.badge } : {}),
    isDemo: true,
  }));
}

/**
 * Get the demo workspace registry.
 * Synchronous, local-only, no network.
 */
export function getDemoWorkspaceRegistry(): GatewayWorkspaceRegistryView {
  return {
    workspaces: mapOptionsToEntries(DEMO_WORKSPACES) as GatewayWorkspaceEntry[],
    branches: mapOptionsToEntries(DEMO_BRANCHES) as GatewayBranchEntry[],
    agents: mapOptionsToEntries(DEMO_AGENTS) as GatewayAgentEntry[],
    models: mapOptionsToEntries(DEMO_MODELS) as GatewayModelEntry[],
    isDemo: true,
  };
}

/**
 * Get the demo gateway status — always offline in Phase 1.
 */
export function getDemoGatewayStatus(): GatewayStatusView {
  return {
    connection: 'offline',
    sessionCount: DEMO_SESSIONS.length,
    isDemo: true,
  };
}
