import React, { useEffect } from 'react';
import { TopToolbar } from './TopToolbar';
import { SessionsPanel } from './SessionsPanel';
import { ContextPanel } from './ContextPanel';
import { ResponsiveDrawer } from './ResponsiveDrawer';
import { useUiStore, applyAppearanceMode } from '../store/useUiStore';
import { ErrorBoundary } from './ErrorBoundary';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const {
    appearance,
    leftPanelOpen,
    rightPanelOpen,
    mobileNavigationOpen,
    mobileContextOpen,
    setMobileNavigationOpen,
    setMobileContextOpen,
  } = useUiStore();

  useEffect(() => {
    applyAppearanceMode(appearance);
  }, [appearance]);

  return (
    <div className="min-h-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Top Navigation Toolbar */}
      <ErrorBoundary fallbackTitle="Top Toolbar Error">
        <TopToolbar />
      </ErrorBoundary>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Desktop Sessions Panel */}
        {leftPanelOpen && (
          <div className="hidden lg:block w-72 h-full shrink-0 transition-all duration-200">
            <ErrorBoundary fallbackTitle="Sessions Panel Error">
              <SessionsPanel />
            </ErrorBoundary>
          </div>
        )}

        {/* Center Main View Area */}
        <div className="flex-1 h-full overflow-hidden min-w-0">
          <ErrorBoundary fallbackTitle="Main Workspace Error">{children}</ErrorBoundary>
        </div>

        {/* Right Desktop Context Panel */}
        {rightPanelOpen && (
          <div className="hidden lg:block w-80 h-full shrink-0 transition-all duration-200">
            <ErrorBoundary fallbackTitle="Context Panel Error">
              <ContextPanel />
            </ErrorBoundary>
          </div>
        )}
      </div>

      {/* Mobile Left Drawer for Sessions */}
      <ResponsiveDrawer
        isOpen={mobileNavigationOpen}
        onClose={() => setMobileNavigationOpen(false)}
        title="OpenCode Sessions"
        side="left"
      >
        <SessionsPanel />
      </ResponsiveDrawer>

      {/* Mobile Right Drawer for Workspace & Context */}
      <ResponsiveDrawer
        isOpen={mobileContextOpen}
        onClose={() => setMobileContextOpen(false)}
        title="Workspace & Context"
        side="right"
      >
        <ContextPanel />
      </ResponsiveDrawer>
    </div>
  );
};
