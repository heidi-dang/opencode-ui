# Frontend Readiness Audit

> **Phase 1E** — Repository-backed audit of the OpenCode Web UI frontend ahead of gateway integration.
> This document describes the current state only. It does not claim the gateway exists.

---

## 1. Current Frontend State

| Aspect | Status |
|---|---|
| **Phase** | 1E (Readiness Audit and Gateway Integration Contract Prep) |
| **Slice** | All Phase 1A–1D completed and merged to `main` |
| **Baseline commit** | `c9a4d99` |
| **Architecture** | Single-page React application with client-side routing |
| **Data layer** | Local mock data only; no real API calls |
| **Authentication** | None |
| **Network requests** | None (boundary guard enforces this) |

---

## 2. Routes

| Route | Purpose | Status |
|---|---|---|
| `/` | Redirects to `/builder` | ✅ |
| `/builder` | Three-panel builder workspace | ✅ |
| `/live-preview` | Preview runtime empty state (Phase 9 placeholder) | ✅ |
| `/qa` | Frontend QA sandbox — UI gallery, stress data, accessibility | ✅ |
| `/*` | 404 Not Found | ✅ |

All routes use `react-router-dom` v7 with `BrowserRouter`.

---

## 3. State Stores

| Store | Technology | Persistence | Contents |
|---|---|---|---|
| `useUiStore` | Zustand + `persist` middleware | `localStorage` (`opencode-ui-preferences-v1`) | `appearance`, `leftPanelOpen`, `rightPanelOpen`, `activeContextSection`, ephemeral toggles |

**What is stored:**
- UI preferences only (appearance mode, panel visibility, active context tab)
- `commandPaletteOpen` — ephemeral, **not persisted**

**What is NOT stored:**
- Sessions, messages, workflow steps, todos, file data — all mock, local-only, never persisted
- Stress test data — opt-in, never persisted
- Authentication tokens — none exist

---

## 4. Mock Data Sources

| File | Contents |
|---|---|
| `src/mocks/frontendDemoData.ts` | Demo sessions (5), workflow steps, messages, referenced files, modified files, workspace files, todos, selectors |
| `src/mocks/frontendStressData.ts` | Stress-test data for QA (long strings, deep paths, large todo lists) |

**Rules:**
- Mock data is imported directly by components — no adapter layer exists yet.
- Mock sessions use local string IDs (`sess-001` etc.) — these are NOT canonical OpenCode IDs.
- No mock data is persisted in Zustand.

---

## 5. UI Primitives

All in `src/components/ui/`:

| Component | Status |
|---|---|
| `Button` | Multi-variant, size scaling ✅ |
| `Badge` | Status badges, all variants ✅ |
| `Panel` | Header/body/footer layout ✅ |
| `Tabs` | Accessible tablist with keyboard support ✅ |
| `StateBlock` | Dot/badge state indicator ✅ |
| `CodeBlock` | Syntax-highlighted code with copy/collapse ✅ |
| `KeyShortcut` | Keyboard shortcut display ✅ |
| `SectionHeader` | Section title/subtitle/action ✅ |
| `SegmentedControl` | Radio-style button group ✅ |

---

## 6. Accessibility Status

| Check | Status |
|---|---|
| Focus trap in modals | ✅ `useFocusTrap` hook |
| Focus restoration on close | ✅ `useFocusRestore` hook |
| Keyboard shortcut hook | ✅ `useKeyboardShortcut` |
| ARIA attributes | ✅ `aria-expanded`, `aria-current`, `aria-modal`, `aria-label`, etc. |
| Reduced motion | ✅ `@media (prefers-reduced-motion: reduce)` in CSS |
| Visible focus rings | ✅ `.focus-ring` class in light and dark mode |
| Drawer Escape close | ✅ ResponsiveDrawer |
| Command palette Escape close | ✅ |
| Screen reader labels | ✅ Icon buttons, inputs, disabled controls |

---

## 7. Testing Status

| Metric | Value |
|---|---|
| **Total tests** | 153 |
| **Test files** | 11 |
| **Coverage areas** | App shell, UI primitives, contracts, keyboard shortcuts, UI store, session UX, command palette, accessibility/focus, layout stress, QA route |
| **CI** | GitHub Actions — runs lint, typecheck, test, boundary check, build |

---

## 8. Boundary Guard Status

| Check | Status |
|---|---|
| `npm run check:boundaries` | ✅ Passes |
| Scans `src/` for forbidden imports | ✅ |
| Scans config files (package.json, vite.config.ts, eslint.config.js) | ✅ |
| Forbidden patterns include | `fastify`, `express`, `@opencode-ai/sdk`, `eventsource`, `fetch(`, `axios`, `XMLHttpRequest`, `prisma`, `child_process`, `pty`, `localhost:`, `127.0.0.1:`, `GEMINI_API_KEY`, etc. |

---

## 9. Deployment Status

| Aspect | Status |
|---|---|
| **Domain** | `https://ai.tnaprovider.com.au` |
| **Static server** | Caddy on `127.0.0.1:18080` |
| **Tunnel** | Cloudflare Tunnel (`pte-ui-tunnel`) |
| **Release path** | `/opt/opencode-ui/releases/<timestamp>-<sha>` |
| **Current release** | `20260723132630-c9a4d99` |
| **Rollback** | Previous releases preserved in `/opt/opencode-ui/releases/` |

---

## 10. Known Frontend Risks

1. **No adapter layer** — Components import mock data directly. Switching to a real gateway requires refactoring every data consumer.
2. **No canonical IDs** — Session/message IDs are local demo strings. Real OpenCode IDs will have different formats.
3. **No streaming support** — Message rendering assumes complete payloads. Streaming/SSE not tested.
4. **No permission prompt UI** — The future gateway will surface `permission.requested` prompts. No UI exists yet.
5. **No connection lifecycle** — The UI treats the gateway as permanently offline. No connect/reconnect/degraded logic.
6. **No error recovery** — Error states render statically. No reconnection or retry orchestration.
7. **Composer sends nothing** — The Send button is wired to a no-op. Real submission requires gateway mediation.
8. **Session search is mock-local** — Filtering operates on an in-memory array. Real sessions require server-side search or pagination.

---

## 11. Integration Blockers

1. **@opencode-ai/sdk not installed** — Cannot create gateway client.
2. **SSE/EventSource not implemented** — No real-time data path.
3. **WebSocket not implemented** — No bidirectional channel.
4. **fetch() not used** — No HTTP API calls are made.
5. **No authentication** — No tokens, sessions, or login flow.
6. **No gateway process** — No Fastify/Express server running.
7. **No OpenCode message IDs** — Frontend generates no canonical IDs.
8. **No permission prompt handling** — No UI for tool/action approval.
9. **No preview runtime wiring** — The `/live-preview` route is a static empty state.

---

## 12. Gateway Handoff Requirements

Before the frontend can connect to a real gateway, the following must be provided:

1. **Gateway server process** (Fastify or Express running the OpenCode SDK)
2. **SSE/EventSource endpoint** for session and message streaming
3. **REST or RPC endpoints** for session CRUD, message submission, and file operations
4. **Authentication mechanism** (token exchange or OAuth)
5. **Canonical OpenCode message ID generation** (server-owned)
6. **Permission prompt protocol** (e.g., `permission.requested` events)
7. **Preview runtime lifecycle management**

---

## 13. Phase 2 Prerequisites

| Prerequisite | Frontend Ready? | Gateway Required? |
|---|---|---|
| Gateway adapter seam | ✅ Created in Phase 1E | ❌ |
| View-model contracts | ✅ Created in Phase 1E | ❌ |
| Integration contract docs | ✅ Created in Phase 1E | ❌ |
| Boundary guard | ✅ Already passing | ❌ |
| Gateway server scaffold | ❌ | ✅ |
| SDK installation | ❌ | ✅ |
| SSE/EventSource client | ❌ | ✅ |
| Authentication flow | ❌ | ✅ |
| Session listing API | ❌ | ✅ |
| Message submit API | ❌ | ✅ |
