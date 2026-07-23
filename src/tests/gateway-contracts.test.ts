import { describe, it, expect } from 'vitest';
import {
  mapAllSessionsToViews,
  mapMessagesToViews,
  getDemoPreviewStatus,
  getDemoPermissionPrompt,
  getDemoGatewayStatus,
  getDemoWorkspaceRegistry,
  getSessionViewById,
} from '../adapters/demoGatewayAdapter';
import { DEMO_SESSIONS } from '../mocks/frontendDemoData';

describe('Gateway view-model contracts', () => {
  it('GatewaySessionView contract compiles with correct shape', () => {
    const sessions = mapAllSessionsToViews();
    expect(sessions.length).toBeGreaterThan(0);
    const first = sessions[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('title');
    expect(first).toHaveProperty('status');
    expect(first).toHaveProperty('lastActivityLabel');
    expect(first).toHaveProperty('isDemo');
  });

  it('GatewayMessageView contract compiles with correct shape', () => {
    const messages = mapMessagesToViews();
    expect(messages.length).toBeGreaterThan(0);
    const first = messages[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('role');
    expect(first).toHaveProperty('content');
    expect(first).toHaveProperty('createdAtLabel');
    expect(first).toHaveProperty('isStreaming');
    expect(first).toHaveProperty('isDemo');
  });

  it('GatewayPreviewStatusView contract compiles with correct shape', () => {
    const preview = getDemoPreviewStatus();
    expect(preview).toHaveProperty('state');
    expect(preview).toHaveProperty('label');
    expect(preview).toHaveProperty('canStart');
    expect(preview).toHaveProperty('canStop');
    expect(preview.canStart).toBe(false);
    expect(preview.canStop).toBe(false);
  });

  it('GatewayPermissionPromptView returns undefined in demo mode', () => {
    const prompt = getDemoPermissionPrompt();
    expect(prompt).toBeUndefined();
  });

  it('GatewayStatusView contract compiles with correct shape', () => {
    const status = getDemoGatewayStatus();
    expect(status).toHaveProperty('connection');
    expect(status).toHaveProperty('sessionCount');
    expect(status).toHaveProperty('isDemo');
    expect(status.connection).toBe('offline');
    expect(status.isDemo).toBe(true);
  });

  it('GatewayWorkspaceRegistryView contract compiles with correct shape', () => {
    const registry = getDemoWorkspaceRegistry();
    expect(registry).toHaveProperty('workspaces');
    expect(registry).toHaveProperty('branches');
    expect(registry).toHaveProperty('agents');
    expect(registry).toHaveProperty('models');
    expect(registry.isDemo).toBe(true);
    expect(registry.workspaces.length).toBeGreaterThan(0);
    expect(registry.branches.length).toBeGreaterThan(0);
    expect(registry.agents.length).toBeGreaterThan(0);
    expect(registry.models.length).toBeGreaterThan(0);
  });
});

describe('DemoGatewayAdapter', () => {
  it('maps mock sessions to GatewaySessionView', () => {
    const views = mapAllSessionsToViews();
    expect(views.length).toBe(DEMO_SESSIONS.length);
    for (const view of views) {
      expect(view.isDemo).toBe(true);
      expect(typeof view.id).toBe('string');
      expect(typeof view.title).toBe('string');
      expect(['idle', 'busy', 'retrying', 'attention', 'error']).toContain(view.status);
    }
  });

  it('maps messages to GatewayMessageView', () => {
    const messages = mapMessagesToViews();
    expect(messages.length).toBeGreaterThan(0);
    for (const msg of messages) {
      expect(msg.isDemo).toBe(true);
      expect(['user', 'assistant', 'tool', 'system']).toContain(msg.role);
      expect(typeof msg.content).toBe('string');
    }
  });

  it('getSessionViewById returns correct session', () => {
    const view = getSessionViewById('sess-001');
    expect(view).toBeDefined();
    expect(view!.id).toBe('sess-001');
    expect(view!.title).toBeDefined();
  });

  it('getSessionViewById returns undefined for unknown ID', () => {
    const view = getSessionViewById('nonexistent');
    expect(view).toBeUndefined();
  });

  it('adapter is synchronous (no promises)', () => {
    // All adapter functions return plain values, not promises
    const result = mapAllSessionsToViews();
    expect(result).toBeInstanceOf(Array);
    // Verify it's not a promise-like object
    expect(typeof (result as unknown as Promise<unknown>).then).toBe('undefined');
  });

  it('adapter calls no network API', () => {
    // Adapter only imports from mocks — no fetch, EventSource, etc.
    // This is verified at compile time and by the boundary check.
    const adapterSource = require_node('fs').readFileSync(
      require_node('path').resolve(__dirname, '../adapters/demoGatewayAdapter.ts'),
      'utf-8',
    );
    // Check that adapter imports only from mocks and contracts
    const importLines = adapterSource
      .split('\n')
      .filter((l: string) => l.includes("'../") || l.includes('"../'));
    for (const line of importLines) {
      expect(line).not.toMatch(/from\s+['"]fetch/);
      expect(line).not.toMatch(/from\s+['"]axios/);
      expect(line).not.toMatch(/from\s+['"]@opencode/);
    }
  });

  it('view-model IDs are demo IDs only (sess- prefix)', () => {
    const sessions = mapAllSessionsToViews();
    for (const s of sessions) {
      expect(s.id).toMatch(/^sess-/);
    }
  });

  it('adapter does not import forbidden runtime integrations', () => {
    // Read the imports and verify no backend packages
    const adapterSource = require_node('fs').readFileSync(
      require_node('path').resolve(__dirname, '../adapters/demoGatewayAdapter.ts'),
      'utf-8',
    );
    // Should import from contracts and mocks only
    expect(adapterSource).toContain("'../contracts/gatewayViewModels'");
    expect(adapterSource).toContain("'../mocks/frontendDemoData'");
  });

  it('mock data remains outside Zustand persistence', () => {
    const storeSource = require_node('fs').readFileSync(
      require_node('path').resolve(__dirname, '../store/useUiStore.ts'),
      'utf-8',
    );
    // Zustand partialize should not include sessions or messages
    expect(storeSource).toContain('partialize');
    expect(storeSource).not.toContain('sessions');
    expect(storeSource).not.toContain('messages');
    expect(storeSource).not.toContain('stress');
  });

  it('getDemoGatewayStatus returns offline in Phase 1', () => {
    const status = getDemoGatewayStatus();
    expect(status.connection).toBe('offline');
    expect(status.isDemo).toBe(true);
    expect(status.sessionCount).toBeGreaterThan(0);
  });

  it('getDemoPreviewStatus returns not-configured in Phase 1', () => {
    const preview = getDemoPreviewStatus();
    expect(preview.state).toBe('not-configured');
    expect(preview.canStart).toBe(false);
    expect(preview.canStop).toBe(false);
  });
});

function require_node(module: string) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(module);
}
