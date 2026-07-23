import { describe, it, expect } from 'vitest';
import {
  GatewaySessionViewSchema,
  GatewayMessageViewSchema,
  GatewayPermissionPromptViewSchema,
  GatewayPreviewStatusViewSchema,
  GatewayWorkspaceRegistryViewSchema,
  GatewayStatusViewSchema,
  GatewayConnectionViewSchema,
} from '../gateway.js';

describe('GatewaySessionViewSchema', () => {
  it('accepts a valid session view', () => {
    const result = GatewaySessionViewSchema.parse({
      id: 'demo-sess-1',
      title: 'Test Session',
      status: 'idle',
      lastActivityLabel: '2 mins ago',
      isDemo: true,
    });
    expect(result.id).toBe('demo-sess-1');
  });

  it('rejects an invalid status', () => {
    expect(() =>
      GatewaySessionViewSchema.parse({
        id: 's1',
        title: 'T',
        status: 'invalid_status',
        lastActivityLabel: 'now',
      }),
    ).toThrow();
  });

  it('allows optional description', () => {
    const result = GatewaySessionViewSchema.parse({
      id: 's1',
      title: 'T',
      status: 'busy',
      lastActivityLabel: 'now',
      description: 'Some description',
    });
    expect(result.description).toBe('Some description');
  });
});

describe('GatewayMessageViewSchema', () => {
  it('accepts a valid message view', () => {
    const result = GatewayMessageViewSchema.parse({
      id: 'demo-msg-1',
      role: 'user',
      content: 'Hello',
      createdAtLabel: '10:00 AM',
      isDemo: true,
    });
    expect(result.role).toBe('user');
  });

  it('rejects invalid role', () => {
    expect(() =>
      GatewayMessageViewSchema.parse({
        id: 'm1',
        role: 'admin',
        content: 'x',
        createdAtLabel: 'now',
      }),
    ).toThrow();
  });

  it('allows streaming flag', () => {
    const result = GatewayMessageViewSchema.parse({
      id: 'm1',
      role: 'assistant',
      content: 'Thinking...',
      createdAtLabel: 'now',
      isStreaming: true,
    });
    expect(result.isStreaming).toBe(true);
  });
});

describe('GatewayPermissionPromptViewSchema', () => {
  it('accepts valid permission prompt', () => {
    const result = GatewayPermissionPromptViewSchema.parse({
      id: 'perm-1',
      title: 'File access',
      summary: 'This tool wants to read src/config.ts',
      riskLevel: 'medium',
      requestedActionLabel: 'Read file',
    });
    expect(result.riskLevel).toBe('medium');
  });
});

describe('GatewayPreviewStatusViewSchema', () => {
  it('accepts valid preview status', () => {
    const result = GatewayPreviewStatusViewSchema.parse({
      state: 'not-configured',
      label: 'Preview not configured',
      canStart: false,
      canStop: false,
    });
    expect(result.state).toBe('not-configured');
  });
});

describe('GatewayWorkspaceRegistryViewSchema', () => {
  it('accepts valid registry', () => {
    const result = GatewayWorkspaceRegistryViewSchema.parse({
      workspaces: [{ id: 'ws-1', name: 'Workspace 1', description: 'Desc' }],
      branches: [],
      agents: [],
      models: [],
      isDemo: true,
    });
    expect(result.workspaces.length).toBe(1);
  });
});

describe('GatewayStatusViewSchema', () => {
  it('accepts valid status', () => {
    const result = GatewayStatusViewSchema.parse({
      connection: 'offline',
      sessionCount: 0,
      isDemo: true,
    });
    expect(result.connection).toBe('offline');
  });
});

describe('GatewayConnectionViewSchema', () => {
  it('accepts all valid states', () => {
    const validStates = ['offline', 'connecting', 'connected', 'degraded', 'reconnecting'];
    for (const state of validStates) {
      expect(GatewayConnectionViewSchema.parse(state)).toBe(state);
    }
  });
});
