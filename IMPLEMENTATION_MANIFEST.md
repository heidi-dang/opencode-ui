# IMPLEMENTATION MANIFEST

## Overview
- **Project**: OpenCode Web UI
- **Phase**: 1
- **Slice**: 1A — Production Shell and Interaction Foundation (baseline)
- **Slice**: 1B — Design-System Hardening and Frontend Contract Boundaries (baseline)
- **Slice**: 1C — Command Palette, Session UX, and Keyboard Interactions (current)
- **Status**: Phase 1C implemented
- **Baseline commit**: `b2a1106be0fcc751e9e886835f8e7bbe0f962bdb` (Phase 1A)
- **Current branch**: `feat/frontend-phase-1c-interactions`

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
| `npm run lint` | _pending_ |
| `npm run build` (tsc -b && vite build) | _pending_ |

---

## CI Workflow
- `.github/workflows/frontend-ci.yml`
- Trigger: pull_request, push to main
- Steps: `npm ci` → `lint` → `typecheck` → `test:run` → **`check:boundaries`** → `build`
- Dependency caching via package-lock.json

## Deferred Functionality (not implemented in Phase 1A, 1B, or 1C)
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

## Next Bounded Slice
**Frontend Phase 1D — TBD**

Phase 1C remains fully frontend-only with no backend dependencies.
