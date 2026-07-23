import { describe, it, expect, beforeEach } from 'vitest';
import { useUiStore } from '../store/useUiStore';

describe('UiStore', () => {
  beforeEach(() => {
    // Reset store to defaults before each test
    useUiStore.setState({
      appearance: 'system',
      leftPanelOpen: true,
      rightPanelOpen: true,
      mobileNavigationOpen: false,
      mobileContextOpen: false,
      activeContextSection: 'workspace',
      commandPaletteOpen: false,
    });
    localStorage.clear();
  });

  describe('commandPaletteOpen', () => {
    it('defaults to false', () => {
      const state = useUiStore.getState();
      expect(state.commandPaletteOpen).toBe(false);
    });

    it('setCommandPaletteOpen sets the value', () => {
      useUiStore.getState().setCommandPaletteOpen(true);
      expect(useUiStore.getState().commandPaletteOpen).toBe(true);

      useUiStore.getState().setCommandPaletteOpen(false);
      expect(useUiStore.getState().commandPaletteOpen).toBe(false);
    });

    it('toggleCommandPalette flips the value', () => {
      expect(useUiStore.getState().commandPaletteOpen).toBe(false);

      useUiStore.getState().toggleCommandPalette();
      expect(useUiStore.getState().commandPaletteOpen).toBe(true);

      useUiStore.getState().toggleCommandPalette();
      expect(useUiStore.getState().commandPaletteOpen).toBe(false);
    });

    it('is NOT persisted to localStorage', () => {
      // Set commandPaletteOpen to true
      useUiStore.getState().setCommandPaletteOpen(true);

      // Trigger a persist by setting a persisted field
      useUiStore.getState().setAppearance('dark');

      const stored = JSON.parse(localStorage.getItem('opencode-ui-preferences-v1')!);
      expect(stored.state).not.toHaveProperty('commandPaletteOpen');
    });
  });

  describe('panel toggles', () => {
    it('toggleLeftPanel flips leftPanelOpen', () => {
      expect(useUiStore.getState().leftPanelOpen).toBe(true);
      useUiStore.getState().toggleLeftPanel();
      expect(useUiStore.getState().leftPanelOpen).toBe(false);
      useUiStore.getState().toggleLeftPanel();
      expect(useUiStore.getState().leftPanelOpen).toBe(true);
    });

    it('toggleRightPanel flips rightPanelOpen', () => {
      expect(useUiStore.getState().rightPanelOpen).toBe(true);
      useUiStore.getState().toggleRightPanel();
      expect(useUiStore.getState().rightPanelOpen).toBe(false);
      useUiStore.getState().toggleRightPanel();
      expect(useUiStore.getState().rightPanelOpen).toBe(true);
    });
  });

  describe('mobile drawer state', () => {
    it('setMobileNavigationOpen updates the value', () => {
      useUiStore.getState().setMobileNavigationOpen(true);
      expect(useUiStore.getState().mobileNavigationOpen).toBe(true);
      useUiStore.getState().setMobileNavigationOpen(false);
      expect(useUiStore.getState().mobileNavigationOpen).toBe(false);
    });

    it('setMobileContextOpen updates the value', () => {
      useUiStore.getState().setMobileContextOpen(true);
      expect(useUiStore.getState().mobileContextOpen).toBe(true);
      useUiStore.getState().setMobileContextOpen(false);
      expect(useUiStore.getState().mobileContextOpen).toBe(false);
    });
  });

  describe('resetLayout', () => {
    it('restores panel defaults while preserving other state', () => {
      useUiStore.getState().toggleLeftPanel();
      useUiStore.getState().toggleRightPanel();
      useUiStore.getState().setCommandPaletteOpen(true);

      useUiStore.getState().resetLayout();

      const state = useUiStore.getState();
      expect(state.leftPanelOpen).toBe(true);
      expect(state.rightPanelOpen).toBe(true);
      expect(state.activeContextSection).toBe('workspace');
      // resetLayout should NOT affect commandPaletteOpen
      expect(state.commandPaletteOpen).toBe(true);
    });
  });
});
