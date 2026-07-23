import { describe, it, expect } from 'vitest';
import {
  SESSION_STATUS_VISUALS,
  CONNECTION_STATE_VISUALS,
  CONTEXT_SECTION_LABELS,
} from '../contracts/presentation';

describe('SESSION_STATUS_VISUALS', () => {
  it('covers all session status values', () => {
    const statuses = ['idle', 'busy', 'retrying', 'attention', 'error'] as const;
    for (const s of statuses) {
      expect(SESSION_STATUS_VISUALS[s]).toBeDefined();
      expect(SESSION_STATUS_VISUALS[s].label).toBeTruthy();
      expect(SESSION_STATUS_VISUALS[s].containerClass).toBeTruthy();
      expect(SESSION_STATUS_VISUALS[s].textClass).toBeTruthy();
    }
  });

  it('has correct label for idle status', () => {
    expect(SESSION_STATUS_VISUALS.idle.label).toBe('Idle');
  });

  it('has correct label for error status', () => {
    expect(SESSION_STATUS_VISUALS.error.label).toBe('Error');
  });
});

describe('CONNECTION_STATE_VISUALS', () => {
  it('covers all connection state values', () => {
    const states = ['offline', 'connecting', 'connected', 'degraded', 'reconnecting'] as const;
    for (const s of states) {
      expect(CONNECTION_STATE_VISUALS[s]).toBeDefined();
      expect(CONNECTION_STATE_VISUALS[s].label).toBeTruthy();
    }
  });

  it('has correct label for connected state', () => {
    expect(CONNECTION_STATE_VISUALS.connected.label).toBe('Connected');
  });

  it('has correct label for offline state', () => {
    expect(CONNECTION_STATE_VISUALS.offline.label).toBe('Offline');
  });
});

describe('CONTEXT_SECTION_LABELS', () => {
  it('covers all context sections', () => {
    const sections = ['referenced', 'modified', 'workspace', 'todos'] as const;
    for (const s of sections) {
      expect(CONTEXT_SECTION_LABELS[s]).toBeTruthy();
    }
  });

  it('maps todos correctly', () => {
    expect(CONTEXT_SECTION_LABELS.todos).toBe('Todos');
  });
});
