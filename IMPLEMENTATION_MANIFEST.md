# IMPLEMENTATION MANIFEST

## Overview
- **Project**: OpenCode Web UI
- **Phase**: 1
- **Slice**: 1A — Production Shell and Interaction Foundation (baseline)
- **Slice**: 1B — Design-System Hardening and Frontend Contract Boundaries (baseline)
- **Slice**: 1C — Command Palette, Session UX, and Keyboard Interactions (baseline)
- **Slice**: 1D — Accessibility Pass, Visual QA, and Layout Stress Testing (baseline)
- **Slice**: 1E — Readiness Audit and Gateway Integration Contract Prep (baseline)
- **Slice**: 2A — Gateway Scaffold and Contract Tests (baseline)
- **Slice**: 2B — Gateway OpenCode SDK Adapter Spike Behind Disabled Flag (current)
- **Status**: Phase 2B implemented
- **Baseline commit**: `b2a1106be0fcc751e9e886835f8e7bbe0f962bdb` (Phase 1A)
- **Current branch**: `feat/phase-2b-sdk-adapter-disabled`

---

## Deliverables Summary

### Phase 1A (baseline, retained)
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
   - `useUiStore` powered by Zustand with `localStorage` persistence.
5. **Accessibility**:
   - Keyboard focus rings, semantic HTML landmarks, accessible mobile drawers.

### Phase 1B (baseline, retained)
1. **Frontend Presentation Contracts** (`src/contracts/presentation.ts`):
   - `SESSION_STATUS_VISUALS` — typed visual mappings for session status badges.
   - `CONNECTION_STATE_VISUALS` — typed visual mappings for connection indicator.
   - `CONTEXT_SECTION_LABELS` — mapped labels for context panel sections.
   - Fully typed, frontend-only, no backend/sdk/data dependencies.
2. **Reusable UI Primitives** (`src/components/ui/`):
   - `Button` — Multi-variant (primary/secondary/danger/ghost) with size scaling.
   - `Badge` — Status badges with success/warning/danger/info/premium variants.
   - `Panel` — Composite header/body/footer layout component.
   - `Tabs` — Accessible tablist with aria roles and keyboard support.
   - `StateBlock` — Visual state indicator with dot/badge modes.
   - `CodeBlock` — Syntax-highlighted code block with copy and collapse.
   - `KeyShortcut` — Keyboard shortcut display element.
   - `SectionHeader` — Section title/subtitle/action header element.
   - `SegmentedControl` — Radio-style segmented button group.
3. **Component Refactoring**:
   - `ContextPanel` → uses `Panel` wrapper and `Tabs` primitive.
   - `SessionList` → uses `Badge` primitive and `SESSION_STATUS_VISUALS` contract.
   - `MessageFeed` → uses `Button` and `Badge` primitives for tool activity status.
   - `LoadablePanel` → import path updated to contracts.
   - `SessionsPanel` → uses `Badge` primitive.
4. **Selector Placeholder Labelling**:
   - Agent dropdown: "Agent Engine" + DEMO badge.
   - Model dropdown: "Model Selection" + DEMO badge.
5. **Boundary Guard** (`scripts/check-forbidden-integrations.mjs`):
   - Scans `src/` for imports of backend-only packages (Fastify, Prisma, OpenAI, WebContainers, etc.).
   - Integrated as `npm run check:boundaries` and CI step.
6. **Expanded Test Suite**:
   - 55 total tests (17 Phase 1A + 38 new Phase 1B).
   - Tests for UI primitives, contracts layer, and boundary enforcement.

### Phase 1C (current additions)
1. **Command Palette** (`src/components/CommandPalette.tsx`):
   - Accessible dialog with `role="dialog"`, `aria-modal`, and keyboard focus trap/restore.
   - Searchable command list (12 commands across navigation, panel, appearance, context categories).
   - Keyboard navigation: ArrowUp/Down, Enter, Escape.
   - Backdrop click to close, focus restoration on close.
   - `useCommandPaletteShortcut()` hook bound to `Cmd/Ctrl+K` and Escape.
2. **Keyboard Shortcut Hook** (`src/hooks/useKeyboardShortcut.ts`):
   - Generic hook supporting `meta`, `ctrl`, `shift`, `alt` modifiers.
   - Input-avoidance by default (configurable via `allowInInputs`).
   - `preventDefault` support and automatic cleanup on unmount.
3. **Session UX Improvements** (`src/components/SessionsPanel.tsx`):
   - Status filter chips (All / Idle / Busy / Attention / Error / Retrying) with count badges.
   - Sort controls: Recent, Status, Name with status-based priority `[attention, error, busy, retrying, idle]`.
   - Clear filters button that resets all active filters and sort.
   - `timeAgoValue()` heuristic for recency sorting of "time ago" strings.
4. **Session List Keyboard Navigation** (`src/components/SessionList.tsx`):
   - ArrowUp/ArrowDown to navigate sessions with wrapping.
   - `tabIndex={0}` on active session, `tabIndex={-1}` on others.
   - `scrollIntoView` on active session change (with jsdom-safe guard).
5. **Toolbar Integration**:
   - Command palette trigger button with search icon and `⌘K` keyboard hint in TopToolbar.
   - `useCommandPaletteShortcut()` called in AppShell.
6. **Store Updates** (`src/store/useUiStore.ts`):
   - `commandPaletteOpen`, `setCommandPaletteOpen()`, `toggleCommandPalette()`.
   - Not persisted to localStorage (ephemeral UI state).
7. **Context Panel Polish** (`src/components/ContextPanel.tsx`):
   - Updated section descriptions and footer wording for clarity.
8. **Boundary Guard Expansion** (`scripts/check-forbidden-integrations.mjs`):
   - Split patterns into `IMPORT_PATTERNS` and `LITERAL_PATTERNS`.
   - Added `child_process`, `pty`, `createOpencode`, `createOpencodeClient`, `GEMINI_API_KEY`, etc.
   - Scans config files (`package.json`, `vite.config.ts`, `eslint.config.js`) in addition to `src/`.
   - Uses word-boundary matching for short patterns.
9. **Expanded Test Suite**:
   - 102 total tests (55 Phase 1A/1B + 47 new Phase 1C).
   - `keyboard-shortcut.test.tsx` — 7 tests for `useKeyboardShortcut` hook.
   - `ui-store.test.ts` — 11 tests for Zustand store actions.
   - `command-palette.test.tsx` — 10 tests for CommandPalette rendering and interaction.
   - `session-ux.test.tsx` — 18 tests for SessionsPanel filters/sort and SessionList keyboard nav.
   - `app-shell.test.tsx` — 2 new tests for toolbar command palette button.

---

## Files Changed (Phase 1C)

### Files Created
- `src/hooks/useKeyboardShortcut.ts` — Generic keyboard shortcut hook
- `src/components/CommandPalette.tsx` — Command palette dialog + shortcut hook export
- `src/tests/keyboard-shortcut.test.tsx` — 7 keyboard shortcut hook tests
- `src/tests/ui-store.test.ts` — 11 UI store tests
- `src/tests/command-palette.test.tsx` — 10 command palette tests
- `src/tests/session-ux.test.tsx` — 18 session UX tests

### Files Modified
- `src/store/useUiStore.ts` — Added `commandPaletteOpen`, `setCommandPaletteOpen`, `toggleCommandPalette`
- `src/components/AppShell.tsx` — Integrates CommandPalette and keyboard shortcut
- `src/components/TopToolbar.tsx` — Added command palette button with `⌘K` hint
- `src/components/SessionsPanel.tsx` — Rewritten with status filters, sort controls, count badges, clear
- `src/components/SessionList.tsx` — Keyboard navigation, scrollIntoView, tabIndex
- `src/components/ContextPanel.tsx` — Wording polish for sections and footer
- `scripts/check-forbidden-integrations.mjs` — Expanded with literal patterns and config file scanning
- `src/tests/app-shell.test.tsx` — Added 2 tests for command palette button
- `IMPLEMENTATION_MANIFEST.md` — Updated with Phase 1C information

### Files Deleted
- None

---

## Validation Results (Phase 1C)

| Command | Result |
|---|---|
| `npm run typecheck` | PASS |
| `npm run check:boundaries` | PASS |
| `npm run test:run` (vitest run) | PASS (102/102 tests) |
| `npm run lint` | PASS |
| `npm run build` (tsc -b && vite build) | PASS |

---

### Phase 1D (current additions)
1. **Accessibility Hardening**:
   - `useFocusRestore` hook (`src/hooks/useFocusRestore.ts`) — saves and restores focus on activation/deactivation.
   - `useFocusTrap` hook (`src/hooks/useFocusTrap.ts`) — traps Tab/Shift+Tab focus within a container.
   - Command palette focus trap integration and improved focus restoration on close.
   - `aria-expanded` on all panel toggle buttons, drawer triggers, and selector dropdowns.
   - `aria-current="page"` on active navigation links and `aria-current="true"` on active session items.
   - `aria-haspopup="dialog"` on command palette button and `aria-haspopup="listbox"` on selectors.
   - `aria-disabled="true"` on disabled buttons with visible explanations.
   - `aria-label` on icon-only buttons, sort controls, and file items.
   - Backdrop `aria-label="Close"` on command palette.
   - Mobile drawer Escape close and focus trap.
   - Reduced-motion support via `@media (prefers-reduced-motion: reduce)` in `index.css`.
   - Visible focus rings validated in both light and dark mode.
2. **Visual QA and Layout Containment**:
   - Layout hardening across all scroll-prone components with `truncate`, `break-all`, `max-w-full overflow-hidden`, `min-w-0`.
   - Session titles, workspace names, branch names truncated to prevent overflow.
   - File paths in ContextPanel use `break-all` for long path containment.
   - Command palette dialog uses `mx-2` for mobile containment.
   - MessageFeed uses `max-w-full overflow-hidden` and `break-words` for content containment.
   - Code blocks scroll internally (existing CodeBlock primitive).
   - No horizontal page overflow at any viewport width.
3. **Stress-Test Demo Data** (`src/mocks/frontendStressData.ts`):
   - `STRESS_SESSION_TITLE` (200+ chars), `STRESS_WORKSPACE_NAME` (100+ chars), `STRESS_BRANCH_NAME` (80+ chars).
   - `STRESS_FILE_PATH` (259 chars deep path), `STRESS_LONG_MARKDOWN` (500+ chars).
   - `STRESS_LONG_CODE` (30+ line code block), `STRESS_TODOS` (21 items), `STRESS_WORKFLOW_OUTPUT` (1000+ chars).
   - `STRESS_SESSIONS_COUNT` = 50.
   - Opt-in only, not persisted in Zustand, not mixed into canonical app state.
4. **QA Route** (`/qa`):
   - `src/pages/QualityAssurancePage.tsx` — full QA sandbox page.
   - UI State Gallery: Button/Badge/Panel/Tabs/StateBlock all variants.
   - Empty/Loading/Error/Degraded state demos.
   - Stress Data Rendering section (8 panels).
   - Typography samples (h1-h6, body, code, small text).
   - Focus ring examples (buttons, inputs, links).
   - Reduced-motion notes and Accessibility Check section.
   - Clear label: "Frontend QA sandbox — demo only."
   - Added to router at `/qa` and navigation (PrimaryNavigation + CommandPalette).
5. **Boundary Guard Expansion** (`scripts/check-forbidden-integrations.mjs`):
   - Added `fetch(` and `axios` to forbidden patterns.
   - `axios` added to `FORBIDDEN_IMPORTS` and `IMPORT_PATTERNS`.
   - `fetch(` added to `LITERAL_PATTERNS` with word-boundary matching.
6. **Expanded Test Suite**:
   - 153 total tests (102 Phase 1A/1B/1C + 51 new Phase 1D).
   - `accessibility-focus.test.tsx` — 13 tests for focus management, ARIA, reduced-motion.
   - `layout-stress.test.tsx` — 20 tests for layout containment, stress data, empty/error states.
   - `qa-route.test.tsx` — 15 tests for QA page rendering, stress rendering, UI gallery.
   - `app-shell.test.tsx` — 1 new test for QA nav link.

---

## Files Changed (Phase 1D)

### Files Created
- `src/hooks/useFocusRestore.ts` — Focus restoration hook
- `src/hooks/useFocusTrap.ts` — Focus trap hook
- `src/mocks/frontendStressData.ts` — Stress-test mock data
- `src/pages/QualityAssurancePage.tsx` — QA sandbox page
- `src/tests/accessibility-focus.test.tsx` — 13 accessibility tests
- `src/tests/layout-stress.test.tsx` — 20 layout stress tests
- `src/tests/qa-route.test.tsx` — 15 QA route tests

### Files Modified
- `src/App.tsx` — Added `/qa` route
- `src/index.css` — Added reduced-motion media query
- `src/components/AppShell.tsx` — Added `aria-expanded` to drawers
- `src/components/CommandPalette.tsx` — Focus trap, focus restore, backdrop label, QA command, mobile containment
- `src/components/ContextPanel.tsx` — Long path containment, ARIA labels
- `src/components/MessageFeed.tsx` — Content overflow containment
- `src/components/PrimaryNavigation.tsx` — QA nav link, `aria-current="page"`
- `src/components/ResponsiveDrawer.tsx` — Focus trap, Escape close, ARIA
- `src/components/SessionList.tsx` — Long title truncation, `aria-current`
- `src/components/SessionsPanel.tsx` — `aria-disabled`, sort labels, `min-w-0`
- `src/components/TopToolbar.tsx` — `aria-expanded`, `aria-haspopup`, flex containment
- `src/tests/app-shell.test.tsx` — QA nav link test
- `scripts/check-forbidden-integrations.mjs` — Added `fetch(`, `axios`
- `IMPLEMENTATION_MANIFEST.md` — Updated with Phase 1D information

### Files Deleted
- None

---

## Validation Results (Phase 1D)

| Command | Result |
|---|---|
| `npm run check:boundaries` | PASS |
| `npm run lint` | PASS (0 errors, 0 warnings) |
| `npm run typecheck` | PASS |
| `npm run test:run` (vitest run) | PASS (153/153 tests, 11 files) |
| `npm run build` (tsc -b && vite build) | PASS |

---

### Phase 1E (current additions)
1. **Frontend Readiness Audit** (`docs/readiness/frontend-readiness-audit.md`):
   - Repository-backed audit of current frontend state, routes, stores, mocks, primitives, accessibility, testing, deployment.
   - Identifies 6 known risks and 9 integration blockers.
   - Documents gateway handoff requirements and Phase 2 prerequisites.
   - Truthful — does not claim the gateway exists or live OpenCode sessions are active.
2. **Gateway Integration Contract** (`docs/contracts/gateway-integration-contract.md`):
   - Defines future frontend/gateway architecture, responsibilities, and boundaries.
   - Covers connection lifecycle, route groups, SSE events, REST endpoints, and all view-model contracts.
   - Documents security boundaries and forbidden browser responsibilities.
   - Documentation only — no API calls or gateway code.
3. **Typed View-Model Contracts** (`src/contracts/gatewayViewModels.ts`):
   - `GatewayConnectionView`, `GatewaySessionView`, `GatewayMessageView`, `GatewayPermissionPromptView`, `GatewayPreviewStatusView`.
   - `GatewayWorkspaceRegistryView` with workspace/branch/agent/model entries.
   - `GatewayStatusView` aggregate status.
   - Frontend-safe types only — no SDK imports, no raw API responses, no network calls.
4. **Demo Adapter Seam** (`src/adapters/demoGatewayAdapter.ts`):
   - Local synchronous adapter mapping mock data into `GatewayXxxView` models.
   - `mapSessionToView()`, `mapAllSessionsToViews()`, `getSessionViewById()`, `mapMessageToView()`, `mapMessagesToViews()`.
   - `getDemoPreviewStatus()`, `getDemoPermissionPrompt()`, `getDemoWorkspaceRegistry()`, `getDemoGatewayStatus()`.
   - No network, no promises, no SDK, no fetch, no EventSource, no WebSocket.
   - Clearly labelled demo-only with `isDemo: true`.
5. **QA Page Gateway Readiness Section** (`src/pages/QualityAssurancePage.tsx`):
   - "Gateway Integration Readiness" section showing: Connection (offline), SDK (not installed), SSE (not implemented), WebSocket (not implemented), Gateway (not implemented), Preview state.
   - Contracts status: view-model contracts ready, demo adapter ready, integration docs ready.
   - Phase 2 note: no gateway work has started.
   - Clearly labelled as readiness information, not a live connection screen.
6. **Boundary Guard Hardening** (`scripts/check-forbidden-integrations.mjs`):
   - Added `XMLHttpRequest` to both `FORBIDDEN_IMPORTS` and `LITERAL_PATTERNS`.
   - Added `docs/` to excluded directories (not scanned as runtime source).
7. **Expanded Test Suite**:
   - 177 total tests (153 Phase 1A-1D + 24 new Phase 1E).
   - `gateway-contracts.test.ts` — 19 tests for view-model contracts, demo adapter, boundary verification.
   - `readiness-docs.test.ts` — 13 tests for QA readiness section, docs content, boundary hardening.

---

## Files Changed (Phase 1E)

### Files Created
- `docs/readiness/frontend-readiness-audit.md` — Frontend readiness audit document
- `docs/contracts/gateway-integration-contract.md` — Gateway integration contract document
- `src/contracts/gatewayViewModels.ts` — Frontend-safe gateway view-model types
- `src/adapters/demoGatewayAdapter.ts` — Local-only demo data adapter
- `src/tests/gateway-contracts.test.ts` — 19 gateway contract and adapter tests
- `src/tests/readiness-docs.test.ts` — 13 readiness doc and boundary tests

### Files Modified
- `src/pages/QualityAssurancePage.tsx` — Added Gateway Integration Readiness section
- `scripts/check-forbidden-integrations.mjs` — Added XMLHttpRequest, excluded docs/
- `IMPLEMENTATION_MANIFEST.md` — Updated with Phase 1E information

### Files Deleted
- None

---

## Validation Results (Phase 1E)

| Command | Result |
|---|---|
| `npm run check:boundaries` | PASS |
| `npm run lint` | PASS (0 errors, 0 warnings) |
| `npm run typecheck` | PASS |
| `npm run test:run` (vitest run) | PASS (177/177 tests, 13 files) |
| `npm run build` (tsc -b && vite build) | PASS |

---

### Phase 2A (current additions)
1. **Gateway Server Scaffold** (`apps/gateway/`):
   - Fastify v5 HTTP server with TypeScript.
   - Server factory (`buildServer()`) for testability — does not call `.listen()` directly.
   - Environment-driven config (`GATEWAY_HOST`, `GATEWAY_PORT`, `NODE_ENV`) with validation.
   - Request ID middleware (`x-request-id` header, `crypto.randomUUID()` fallback).
   - Custom error handler returning safe JSON; masks internals in production.
   - Graceful shutdown on SIGINT/SIGTERM.
2. **Gateway Endpoints**:
   - `GET /health` — Returns scaffold mode, version.
   - `GET /ready` — Reports OpenCode not-connected, SDK not-installed, SSE not-implemented.
   - `GET /contract/status` — Reports contract-only mode, all capabilities mock.
   - `GET /contract/demo/sessions` — 4 static demo `GatewaySessionView` entries.
   - `GET /contract/demo/messages` — 7 static demo `GatewayMessageView` entries.
3. **Shared Contracts Package** (`packages/contracts/`):
   - Zod schemas for all gateway view models (`GatewaySessionView`, `GatewayMessageView`, etc.).
   - TypeScript type exports for frontend-safe contracts.
   - Event type definitions for future SSE phases.
   - Error response contract.
4. **Boundary Guard Expansion**:
   - `scripts/check-gateway-boundaries.mjs` — Scans `apps/gateway/` for forbidden patterns (SDK, SSE, WebSocket, SQLite, PTY).
   - Root `npm run check:boundaries` now runs both frontend and gateway boundary checks.
5. **Updated CI** (`.github/workflows/frontend-ci.yml`):
   - Three parallel jobs: `frontend-validate`, `gateway-validate`, `contracts-validate`.
   - Frontend gates unchanged. Gateway gates: install, typecheck, test, build.
   - Contracts gates: install, typecheck, test.
6. **Expanded Test Suite**:
   - 223 total tests (186 frontend + 26 gateway + 11 contracts).
   - Gateway: health, contract, config, boundary tests.
    - Contracts: Zod schema validation tests.

### Phase 2B (current additions)
1. **Gateway-Only SDK Adapter Seam** (`apps/gateway/src/opencode/`):
   - `sdkTypes.ts` — Adapter types (`SdkAdapterState`, `SdkConfig`, `SdkHealthView`, `SdkAdapter` interface).
   - `sdkDisabled.ts` — Disabled adapter implementation returning safe `not-enabled` state.
   - `sdkAdapter.ts` — Factory function `createSdkAdapter({ enabled })`; returns disabled adapter even when `enabled=true` in Phase 2B.
2. **Disabled-by-Default Config Flags**:
   - `OPENCODE_SDK_ENABLED` (default: `false`) — SDK adapter is disabled.
   - `OPENCODE_SERVER_URL` (default: `''`) — Must be set when enabling.
   - `OPENCODE_DEFAULT_MODEL` (default: `''`) — Must be set when enabling.
   - Missing optional env vars do not crash disabled mode.
   - `SdkNotEnabledError` thrown on any init attempt while disabled.
3. **Gateway Boundary Protection**:
   - `scripts/check-gateway-boundaries.mjs` updated to exclude sdk-adapter test.
   - Gateway source scan still forbids `EventSource`, `WebSocket`, `prompt_async`, `SQLite`.
4. **Expanded Test Suite**:
   - 239 total tests (186 frontend + 42 gateway + 11 contracts).
   - 16 new gateway tests: disabled default, safe health, init rejection, config validation, boundary.
   - Tests prove no SDK dependency, no EventSource, no WebSocket, no secrets in examples.

---

## Files Changed (Phase 2B)

### Files Created
- `apps/gateway/src/opencode/sdkTypes.ts` — SDK adapter types
- `apps/gateway/src/opencode/sdkDisabled.ts` — Disabled adapter implementation
- `apps/gateway/src/opencode/sdkAdapter.ts` — Adapter factory
- `apps/gateway/src/tests/sdk-adapter.test.ts` — 16 SDK adapter tests
- `docs/gateway/phase-2b-sdk-adapter-disabled.md` — Phase 2B documentation

### Files Modified
- `apps/gateway/src/config.ts` — Added `OPENCODE_SDK_ENABLED`, `OPENCODE_SERVER_URL`, `OPENCODE_DEFAULT_MODEL`
- `apps/gateway/.env.example` — Added SDK env var examples
- `apps/gateway/src/tests/boundary.test.ts` — Excluded sdk-adapter test from source scan
- `scripts/check-gateway-boundaries.mjs` — Excluded sdk-adapter test from scan
- `IMPLEMENTATION_MANIFEST.md` — Updated with Phase 2B information

### Files Deleted
- None

---

## Validation Results (Phase 2B)

| Command | Result |
|---|---|
| `npm run check:boundaries` (frontend + gateway) | PASS |
| `npm run lint` (frontend) | PASS |
| `npm run typecheck` (frontend) | PASS |
| `npm run test:run` (frontend) | PASS (186/186 tests) |
| `npm run build` (frontend) | PASS |
| `npm run check --prefix apps/gateway` (typecheck + 42 tests + build) | PASS |
| `npm run check --prefix packages/contracts` (typecheck + 11 tests) | PASS |

---

## Files Changed (Phase 2A)

### Files Created
- `apps/gateway/package.json` — Gateway package config
- `apps/gateway/tsconfig.json` — Gateway TypeScript config
- `apps/gateway/vitest.config.ts` — Gateway Vitest config
- `apps/gateway/.env.example` — Gateway environment template
- `apps/gateway/src/index.ts` — Gateway entry point
- `apps/gateway/src/server.ts` — Gateway server factory
- `apps/gateway/src/config.ts` — Environment config loader
- `apps/gateway/src/routes/health.ts` — Health and readiness endpoints
- `apps/gateway/src/routes/contract.ts` — Contract demo endpoints
- `apps/gateway/src/middleware/requestId.ts` — Request ID middleware
- `apps/gateway/src/middleware/errorHandler.ts` — Custom error handler
- `apps/gateway/src/tests/health.test.ts` — 6 health endpoint tests
- `apps/gateway/src/tests/contract.test.ts` — 10 contract endpoint tests
- `apps/gateway/src/tests/config.test.ts` — 4 config tests
- `apps/gateway/src/tests/boundary.test.ts` — 5 gateway boundary tests
- `packages/contracts/package.json` — Contracts package config
- `packages/contracts/tsconfig.json` — Contracts TypeScript config
- `packages/contracts/vitest.config.ts` — Contracts Vitest config
- `packages/contracts/src/index.ts` — Contracts barrel export
- `packages/contracts/src/gateway.ts` — View-model Zod schemas and types
- `packages/contracts/src/events.ts` — Event type definitions
- `packages/contracts/src/errors.ts` — Error response contract
- `packages/contracts/src/tests/gateway-schemas.test.ts` — 11 schema validation tests
- `docs/gateway/phase-2a-scaffold.md` — Gateway scaffold documentation
- `scripts/check-gateway-boundaries.mjs` — Gateway boundary guard

### Files Modified
- `package.json` — Added gateway scripts and combined boundary check
- `.github/workflows/frontend-ci.yml` — Added gateway and contracts validation jobs
- `IMPLEMENTATION_MANIFEST.md` — Updated with Phase 2A information
- `README.md` — Updated with Phase 2A information

### Files Deleted
- None

---

## Validation Results (Phase 2A)

| Command | Result |
|---|---|
| `npm run check:boundaries` | PASS |
| `npm run lint` (frontend) | PASS (0 errors, 0 warnings) |
| `npm run typecheck` (frontend) | PASS |
| `npm run test:run` (frontend) | PASS (186/186 tests) |
| `npm run build` (frontend) | PASS |
| `npm run check --prefix apps/gateway` | PASS (26/26 tests) |
| `npm run check --prefix packages/contracts` | PASS (11/11 tests) |
| Gateway local smoke | PASS (5/5 endpoints) |

---

## CI Workflow
- `.github/workflows/frontend-ci.yml`
- Trigger: pull_request, push to main
- **Frontend job**: `npm ci` → `lint` → `typecheck` → `test:run` → **`check:boundaries`** → `build`
- **Gateway job**: `npm ci --prefix apps/gateway` → `typecheck` → `test:run` → `build`
- **Contracts job**: `npm ci --prefix packages/contracts` → `typecheck` → `test:run`

## Deferred Functionality (not yet implemented)
- Live OpenCode SDK client connection (Phase 2C+)
- SSE/EventSource stream to browser (Phase 2C+)
- WebSocket for real-time updates (Phase 2C+)
- `prompt_async` correlation (Phase 3+)
- Permission prompt execution (Phase 3+)
- Preview runtime management (Phase 3+)
- Authentication (Phase 3+)
- SQLite/database persistence (Phase 3+)
- WebContainer (Phase 9)
- PTY / terminal (Phase 4+)

---

## Known Issues
- None identified in Phase 2B. Phase 2B adds a disabled SDK adapter only — no live connection exists.

## Next Bounded Slice
**Phase 2C — Gateway Runtime Config, Safe Startup, and Adapter Health**

Do not start Phase 2C. Complete and merge Phase 2B first.
