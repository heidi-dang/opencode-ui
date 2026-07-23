# IMPLEMENTATION MANIFEST

## Overview
- **Project**: OpenCode Web UI
- **Phase**: 1
- **Slice**: 1A (Production Shell and Interaction Foundation)
- **Status**: Verified baseline (repair branch)
- **Baseline commit**: `b2a1106be0fcc751e9e886835f8e7bbe0f962bdb`
- **Repair branch**: `fix/phase-1a-validation-baseline`

---

## Deliverables Summary
Phase 1A delivers a production-grade, highly polished React + Vite web UI shell foundation for the OpenCode headless server. This manifest documents the verified baseline after repository integrity, dependency hygiene, tests, documentation, and CI repair.

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

## Files Changed (repair branch)

### Files Created
- `.github/workflows/frontend-ci.yml` — GitHub Actions CI workflow
- `eslint.config.js` — ESLint flat configuration
- `tsconfig.build.json` — TypeScript build configuration for `tsc -b`
- `src/tests/setup.ts` — Vitest test setup with jsdom and Testing Library
- `src/tests/app-shell.test.tsx` — 17 integration tests covering routes, panels, search, appearance, persistence, and behavior

### Files Modified
- `package.json` — Corrected identity, scripts (lint, typecheck, test, build), removed unrelated deps
- `vite.config.ts` — Added Vitest configuration (jsdom environment, setup files)
- `tsconfig.json` — Added strict type-checking options, removed composite/noEmit conflict
- `README.md` — Professional OpenCode Web UI README
- `IMPLEMENTATION_MANIFEST.md` — Updated with verified baseline information
- `.env.example` — Replaced Gemini-specific variables with Phase 1A note

### Files Deleted
- `bun.lock` — Replaced with package-lock.json (npm)

### Dependencies Removed
- `@google/genai` — Unused AI SDK dependency
- `dotenv` — Not used in frontend-only phase
- `express` — Backend dependency, deferred to Phase 2
- `@types/express` — Associated type definitions
- `tsx` — Not used in this project
- `motion` — No imports from it in source code
- `autoprefixer` — Not needed (Tailwind v4 handles prefixes)
- `esbuild` — Not needed (Vite bundles its own)

### Dependencies Added (dev)
- `eslint` — Linting
- `@eslint/js` — ESLint recommended config
- `typescript-eslint` — TypeScript ESLint support
- `eslint-plugin-react-hooks` — React hooks lint rules
- `eslint-plugin-react-refresh` — React fast refresh lint rules
- `vitest` — Test runner
- `jsdom` — DOM environment for tests
- `@testing-library/react` — React Testing Library
- `@testing-library/jest-dom` — DOM matchers
- `@testing-library/user-event` — User event simulation
- `@vitest/coverage-v8` — Coverage reporter

---

## Validation Results

| Command | Result |
|---|---|
| `npm ci` | PASS |
| `npm run lint` (ESLint —max-warnings=0) | PASS |
| `npm run typecheck` (tsc --noEmit) | PASS (0 errors) |
| `npm run test:run` (vitest run) | PASS (17/17 tests) |
| `npm run build` (tsc -b && vite build) | PASS |

## CI Workflow
- `.github/workflows/frontend-ci.yml`
- Trigger: pull_request, push to main
- Steps: `npm ci` → `lint` → `typecheck` → `test:run` → `build`
- Dependency caching via package-lock.json

## Known Issues
- None identified in Phase 1A baseline

## Deferred Functionality (not implemented in Phase 1A)
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
**Frontend Phase 1B — Design-System Hardening and Frontend Contract Boundaries**

This slice focuses on design-system refinement, component contract enforcement, and frontend-only boundary hardening. It does **not** implement Fastify, SDK/SSE, authentication, or preview runtime.
