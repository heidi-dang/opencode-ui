# IMPLEMENTATION MANIFEST

## Overview
- **Project**: OpenCode Web UI
- **Phase**: 1
- **Slice**: 1A — Production Shell and Interaction Foundation (baseline)
- **Slice**: 1B — Design-System Hardening and Frontend Contract Boundaries (current)
- **Status**: Verified baseline; Phase 1B implemented
- **Baseline commit**: `b2a1106be0fcc751e9e886835f8e7bbe0f962bdb` (Phase 1A)
- **Current branch**: `feat/frontend-phase-1b-design-system`

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

### Phase 1B (current additions)
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

---

## Files Changed (Phase 1B)

### Files Created
- `.github/workflows/frontend-ci.yml` — Added boundary check step
- `src/contracts/presentation.ts` — Frontend-only presentation contracts
- `src/components/ui/Button.tsx` — Button primitive
- `src/components/ui/Badge.tsx` — Badge primitive
- `src/components/ui/Panel.tsx` — Panel layout primitive
- `src/components/ui/Tabs.tsx` — Accessible tabs primitive
- `src/components/ui/StateBlock.tsx` — State indicator primitive
- `src/components/ui/CodeBlock.tsx` — Code display primitive
- `src/components/ui/KeyShortcut.tsx` — Keyboard shortcut primitive
- `src/components/ui/SectionHeader.tsx` — Section header primitive
- `src/components/ui/SegmentedControl.tsx` — Segmented control primitive
- `src/components/ui/index.ts` — UI primitives barrel export
- `scripts/check-forbidden-integrations.mjs` — Boundary guard script
- `src/tests/contracts.test.ts` — 12 contract unit tests
- `src/tests/primitives.test.tsx` — 27 UI primitive tests
- `src/tests/boundaries.test.ts` — 3 boundary enforcement tests

### Files Modified
- `package.json` — Added `check:boundaries` script
- `src/components/ContextPanel.tsx` — Refactored to use `Panel` + `Tabs` primitives
- `src/components/SessionList.tsx` — Refactored to use `Badge` + `SESSION_STATUS_VISUALS`
- `src/components/MessageFeed.tsx` — Refactored to use `Button` + `Badge` primitives
- `src/components/LoadablePanel.tsx` — Updated import to contracts
- `src/components/SessionsPanel.tsx` — Refactored to use `Badge` primitive
- `src/components/TopToolbar.tsx` — Improved selector labels with DEMO badges
- `src/tests/app-shell.test.tsx` — Updated 2 tests for refactored components
- `IMPLEMENTATION_MANIFEST.md` — Updated with Phase 1B information

### Files Deleted
- None

---

## Validation Results (Phase 1B)

| Command | Result |
|---|---|
| `npm run check:boundaries` | PASS |
| `npm run test:run` (vitest run) | PASS (55/55 tests) |
| `npm run build` (tsc -b && vite build) | _pending CI_ |

## CI Workflow
- `.github/workflows/frontend-ci.yml`
- Trigger: pull_request, push to main
- Steps: `npm ci` → `lint` → `typecheck` → `test:run` → **`check:boundaries`** → `build`
- Dependency caching via package-lock.json

## Known Issues
- None identified in Phase 1B.

## Deferred Functionality (not implemented in Phase 1A or 1B)
- Fastify/Express gateway integration
- OpenCode SDK and SSE event streaming (Phase 1C)
- WebContainer preview runtime
- Real API requests and session creation
- PTY / Terminal server
- Database / SQLite persistence
- Authentication and user sessions
- Gemini API integration
- Real preview runtime connections

---

## Next Bounded Slice
**Frontend Phase 1C — SDK Client and Event Streaming Scaffolding**

This slice will introduce the OpenCode SDK client layer, SSE EventSource integration, and real gateway connection. It requires a backend gateway to be present. Phase 1A and 1B remain fully frontend-only.
