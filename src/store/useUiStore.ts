import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppearanceMode, ContextSection } from '../types/ui';

export interface UiState {
  appearance: AppearanceMode;
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  mobileNavigationOpen: boolean;
  mobileContextOpen: boolean;
  activeContextSection: ContextSection;
  setAppearance: (mode: AppearanceMode) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  setMobileNavigationOpen: (open: boolean) => void;
  setMobileContextOpen: (open: boolean) => void;
  setActiveContextSection: (section: ContextSection) => void;
  resetLayout: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      appearance: 'system',
      leftPanelOpen: true,
      rightPanelOpen: true,
      mobileNavigationOpen: false,
      mobileContextOpen: false,
      activeContextSection: 'workspace',

      setAppearance: (appearance: AppearanceMode) => {
        set({ appearance });
        applyAppearanceMode(appearance);
      },

      toggleLeftPanel: () => set((state) => ({ leftPanelOpen: !state.leftPanelOpen })),

      toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),

      setMobileNavigationOpen: (mobileNavigationOpen: boolean) => set({ mobileNavigationOpen }),

      setMobileContextOpen: (mobileContextOpen: boolean) => set({ mobileContextOpen }),

      setActiveContextSection: (activeContextSection: ContextSection) => set({ activeContextSection }),

      resetLayout: () =>
        set({
          leftPanelOpen: true,
          rightPanelOpen: true,
          mobileNavigationOpen: false,
          mobileContextOpen: false,
          activeContextSection: 'workspace',
        }),
    }),
    {
      name: 'opencode-ui-preferences-v1',
      partialize: (state) => ({
        appearance: state.appearance,
        leftPanelOpen: state.leftPanelOpen,
        rightPanelOpen: state.rightPanelOpen,
        activeContextSection: state.activeContextSection,
      }),
    }
  )
);

export function applyAppearanceMode(mode: AppearanceMode) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;

  const isDark =
    mode === 'dark' ||
    (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}
