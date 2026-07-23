# IMPLEMENTATION MANIFEST

## Overview
* **Project**: OpenCode Headless Web UI
* **Phase**: 1
* **Slice**: 1A (Production Shell and Interaction Foundation)
* **Status**: Completed

---

## Deliverables Summary
Phase 1A delivers a production-grade, highly polished React + Vite web UI shell foundation for the OpenCode headless server.

### Features Implemented
1. **Three-Panel Layout**:
   - Left: Sessions Panel with filterable search and status indicators.
   - Center: Builder Workspace with workflow timeline summary, message feed with code snippet copy tools, and multi-line composer placeholder.
   - Right: "Workspace & Context" panel with Referenced Files, Modified Files, Workspace File Tree, and Todos sections.
2. **Top Toolbar**:
   - OpenCode brand identity.
   - Workspace, Git Branch, Agent, and Model selectors with deterministic fallback behavior.
   - Gateway connection offline indicator badge.
   - System/Light/Dark appearance toggle.
   - Panel toggle controls and responsive drawer triggers.
3. **Routing**:
   - `/` redirects to `/builder`.
   - `/builder`: Main Chat and Builder three-panel shell.
   - `/live-preview`: Intentional empty state for Phase 9 preview runtime connection with disabled controls, viewport placeholders, and log stream placeholder.
   - `/*`: Not-found page.
4. **State Persistence**:
   - `useUiStore` powered by Zustand with `localStorage` persistence for appearance, panel visibility, and context tab selection.
5. **Accessibility**:
   - Keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-amber-500`).
   - Semantic HTML landmarks (`<header>`, `<nav>`, `<aside>`, `<main>`).
   - Accessible mobile drawers with backdrop overlay and Escape key handlers.

---

## File Changes & Inventory

### Created / Updated Files
- `metadata.json` - Updated app name and description
- `index.html` - Set title to OpenCode Web UI
- `src/index.css` - Defined dark theme CSS variables, scrollbars, and focus ring utilities
- `src/types/ui.ts` - Defined types for UI state, sessions, workflow steps, messages, files, and todos
- `src/mocks/frontendDemoData.ts` - Isolated mock data module for Phase 1A demonstration
- `src/store/useUiStore.ts` - Zustand layout and preference store with storage persistence
- `src/components/ErrorBoundary.tsx` - Reusable component error boundary
- `src/components/LoadablePanel.tsx` - Panel wrapper supporting idle, loading, ready, empty, error, and degraded states
- `src/components/ResponsiveDrawer.tsx` - Accessible mobile slide-over drawer with backdrop
- `src/components/PrimaryNavigation.tsx` - Tab router navigation between Builder and Live Preview
- `src/components/TopToolbar.tsx` - Main desktop header with selectors and panel controls
- `src/components/SessionSearch.tsx` - Filter input for sessions
- `src/components/SessionList.tsx` - Status-badged session item list
- `src/components/SessionsPanel.tsx` - Left sidebar for session management
- `src/components/WorkflowSummary.tsx` - Collapsible workflow execution timeline
- `src/components/MessageFeed.tsx` - Markdown message stream with code block copy buttons
- `src/components/ComposerPlaceholder.tsx` - Multi-line prompt composer with mention buttons
- `src/components/ContextPanel.tsx` - Right "Workspace & Context" panel with 4 sections
- `src/components/BuilderWorkspace.tsx` - Center column workspace container
- `src/components/AppShell.tsx` - Responsive shell wrapper
- `src/pages/BuilderPage.tsx` - Primary builder page route
- `src/pages/LivePreviewEmptyState.tsx` - Intentional Phase 9 live preview empty state route
- `src/pages/NotFoundPage.tsx` - 404 route
- `src/App.tsx` - React Router entry point

---

## Dependencies Added
- `zustand`: ^5.x (UI state persistence)
- `react-router-dom`: ^7.x (Client-side routing)

---

## Explicitly Deferred Functionality (Boundaries)
- Fastify gateway integration
- OpenCode SDK & SSE stream consumer
- WebContainer preview runtime
- Real API requests and session creation
- PTY / Terminal server
- Database / SQLite persistence

---

## Next Bounded Slice
**Phase 1B / Phase 2**: Fastify gateway setup, SSE event streaming integration, and live session creation API client connection.
