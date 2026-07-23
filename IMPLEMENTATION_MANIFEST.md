# IMPLEMENTATION MANIFEST

## Overview
- **Project**: OpenCode Web UI
- **Phase**: 1
- **Slice**: 1A — Production Shell and Interaction Foundation (baseline)
- **Slice**: 1B — Design-System Hardening and Frontend Contract Boundaries (baseline)
- **Slice**: 1C — Command Palette, Session UX, and Keyboard Interactions (baseline)
- **Slice**: 1D — Accessibility Pass, Visual QA, and Layout Stress Testing (current)
- **Status**: Phase 1D implemented
- **Baseline commit**: `b2a1106be0fcc751e9e886835f8e7bbe0f962bdb` (Phase 1A)
- **Current branch**: `feat/frontend-phase-1d-accessibility-visual-qa`

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

## CI Workflow
- `.github/workflows/frontend-ci.yml`
- Trigger: pull_request, push to main
- Steps: `npm ci` → `lint` → `typecheck` → `test:run` → **`check:boundaries`** → `build`
- Dependency caching via package-lock.json

## Deferred Functionality (not implemented in Phase 1A through 1D)
- Fastify/Express gateway integration
- OpenCode SDK and SSE event streaming
- WebContainer preview runtime
- Real API requests and session creation
- PTY / Terminal server
- Database / SQLite persistence
- Authentication and user sessions
- Gemini API integration
- Real preview runtime connections

---

## Known Issues
- None identified in Phase 1D.

## Next Bounded Slice
**Frontend Phase 1E — Frontend Readiness Audit and Gateway Integration Contract Prep**

Do not start Phase 1E.

Phase 1D remains fully frontend-only with no backend dependencies.
