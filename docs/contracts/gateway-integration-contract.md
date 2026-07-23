# Gateway Integration Contract

> **Phase 1E** — Defines the future contract between the frontend Web UI and the gateway server.
> This document describes planned integration boundaries. No gateway exists yet.

---

## 1. Architecture Overview

```
Browser (OpenCode Web UI)        VPS / Server
┌──────────────────────┐         ┌──────────────────────┐
│  React SPA            │         │  Gateway (Fastify)    │
│  Zustand store        │ ◄──SSE──│  OpenCode SDK client  │
│  Demo adapter (Phase 1E)│       │  Session management   │
│  View-model contracts  │  REST  │  Permission bridge    │
│  No direct SDK access │  ──►   │  Preview runtime mgmt │
│  No canonical IDs     │         │  File I/O             │
│  No raw API calls     │         │  Authentication       │
└──────────────────────┘         └──────────────────────┘
```

The gateway is the **sole intermediary** between the frontend and the OpenCode backend. The frontend never talks directly to OpenCode servers, never holds SDK credentials, and never generates canonical OpenCode message IDs.

---

## 2. Future Gateway Responsibilities

### 2.1 Generate Canonical OpenCode Message IDs

- Every session, message, and tool event must receive a canonical OpenCode-assigned ID.
- The frontend must never generate or assume OpenCode ID formats.
- The gateway owns all ID generation and correlation.

### 2.2 Own `prompt_async` Correlation

- All asynchronous prompt operations are tracked server-side.
- The frontend receives only the resolved state (via view models), not raw `prompt_async` events.
- The gateway maps `prompt_async` tracking IDs to frontend-friendly view-model IDs.

### 2.3 Own SDK Client Creation

- The gateway creates and manages the `@opencode-ai/sdk` client instance.
- SDK credentials, API keys, and configuration live only on the server.
- The frontend never imports `@opencode-ai/sdk`.

### 2.4 Own SSE/EventSource Connection to OpenCode

- The gateway maintains persistent SSE connections to OpenCode servers.
- The frontend receives filtered/sanitised view models via REST responses and gateway-originated SSE.
- The frontend never creates `EventSource` or `WebSocket` connections to OpenCode.

### 2.5 Normalise Permission Events

- Raw OpenCode `permission.asked` / `permission.updated` events are normalised into `permission.requested` view models.
- The gateway removes internal tracking fields before forwarding to the frontend.

### 2.6 Persist Workspace Registry

- The gateway maintains a persistent registry of workspaces, branches, agents, and models.
- The frontend requests the current registry snapshot on connect and receives delta updates via SSE.

### 2.7 Expose Frontend-Safe View Models

- All data sent to the frontend is pre-shaped into `GatewayXxxView` types.
- No raw OpenCode API responses are forwarded to the frontend.
- No internal SDK types or server-internal IDs leak to the frontend.

---

## 3. Future Frontend Responsibilities

### 3.1 Render Gateway View Models

- The frontend renders `GatewaySessionView`, `GatewayMessageView`, and other gateway-provided view models.
- All data binding uses the typed contracts in `src/contracts/gatewayViewModels.ts`.
- The frontend never attempts to reconstruct raw OpenCode data from view models.

### 3.2 Never Generate Canonical OpenCode IDs

- The frontend assigns local-only rendering keys (e.g., React `key` props) but never emits IDs claiming to be OpenCode-canonical.
- Session creation requests omit IDs — the gateway assigns them on creation.

### 3.3 Never Talk Directly to OpenCode Server

- All network communication is mediated by the gateway.
- The frontend makes HTTP requests only to the gateway's REST API.
- The frontend receives real-time updates only from the gateway's SSE endpoint.

### 3.4 Never Hold SDK Credentials

- API tokens, SDK secrets, and authentication credentials reside on the gateway.
- The frontend receives only a session token (opaque string) for gateway-authenticated requests.

### 3.5 Never Silently Auto-Select Failed Selectors

- If a workspace, branch, agent, or model selector has no valid default, the frontend must surface the choice to the user.
- The frontend must never silently fall back to a hardcoded value.

### 3.6 Never Start Workspace Processes Directly

- Workspace process management (preview runtime, file watchers, dev servers) is exclusively handled by the gateway.
- The frontend requests start/stop operations through gateway REST endpoints.

---

## 4. Expected Route Groups

### 4.1 Frontend Routes (unchanged)

| Route | Purpose |
|---|---|
| `/` → `/builder` | Redirect |
| `/builder` | Main workspace |
| `/live-preview` | Preview runtime (will receive live data from gateway) |
| `/qa` | QA sandbox (always demo-only) |
| `/*` | 404 |

### 4.2 Future Gateway REST Routes (planned)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/sessions` | List sessions |
| `POST` | `/api/sessions` | Create session |
| `GET` | `/api/sessions/:id` | Get session detail |
| `DELETE` | `/api/sessions/:id` | Delete session |
| `POST` | `/api/sessions/:id/messages` | Submit message |
| `GET` | `/api/sessions/:id/messages` | Get message history |
| `GET` | `/api/sessions/:id/files` | List session files |
| `POST` | `/api/sessions/:id/preview/start` | Start preview |
| `POST` | `/api/sessions/:id/preview/stop` | Stop preview |
| `GET` | `/api/workspace` | Get workspace registry |
| `GET` | `/api/status` | Connection health |
| `POST` | `/api/permission/respond` | Respond to permission prompt |

### 4.3 Future Gateway SSE Events (planned)

| Event | Payload | Purpose |
|---|---|---|
| `session.updated` | `GatewaySessionView` | Session state change |
| `message.created` | `GatewayMessageView` | New message (may be streaming) |
| `message.streaming` | `GatewayMessageView` | Partial streaming content |
| `connection.state` | `GatewayConnectionView` | Connection status change |
| `permission.requested` | `GatewayPermissionPromptView` | User action required |
| `preview.status` | `GatewayPreviewStatusView` | Preview runtime state |
| `workspace.updated` | Registry snapshot | Selector data change |

---

## 5. Connection Lifecycle

1. **Initial load**: Frontend renders with demo/local state. Connection badge shows "Offline".
2. **User action**: User interacts with a "Connect" control (future).
3. **Handshake**: Frontend POSTs to gateway auth endpoint, receives session token.
4. **SSE subscription**: Frontend opens EventSource to gateway SSE endpoint, sending session token.
5. **Registry sync**: Gateway pushes workspace registry snapshot.
6. **Session sync**: Gateway pushes current session list.
7. **Active session**: Frontend renders gateway view models. Connection badge shows "Connected".
8. **Degradation**: If SSE drops, frontend shows "Reconnecting" badge. Gateway handles reconnection.
9. **Rehydration**: On reconnect, gateway pushes current state snapshot to rebuild UI.
10. **Disconnect**: User or gateway initiates disconnect. Frontend returns to demo state.

---

## 6. Session List Contract

```typescript
interface GatewaySessionView {
  readonly id: string;             // Gateway-assigned (not OpenCode-canonical for demo)
  readonly title: string;
  readonly status: 'idle' | 'busy' | 'retrying' | 'attention' | 'error';
  readonly lastActivityLabel: string;
  readonly description?: string;
  readonly isDemo?: boolean;
}
```

The frontend renders this directly. It never fetches raw session data.

---

## 7. Message Feed Contract

```typescript
interface GatewayMessageView {
  readonly id: string;
  readonly role: 'user' | 'assistant' | 'tool' | 'system';
  readonly content: string;
  readonly createdAtLabel: string;
  readonly isStreaming?: boolean;
  readonly isDemo?: boolean;
}
```

The frontend renders a flat list of messages. Streaming messages show partial content with an `isStreaming` flag.

---

## 8. Composer Submit Contract

When the user submits a message:
1. Frontend creates a local optimistic message entry (local-only rendering key).
2. Frontend POSTs `{ content, sessionId }` to gateway `/api/sessions/:id/messages`.
3. Gateway assigns canonical OpenCode message ID.
4. Gateway pushes `message.created` SSE event with final view model.
5. Frontend replaces optimistic entry with gateway view model.

---

## 9. Command Palette Contract

The command palette remains frontend-only. All commands are local UI actions (navigation, panel toggles, appearance switching). The gateway does not inject commands. Future phases may extend this with dynamic commands from the gateway.

---

## 10. Permission Prompt Contract

```typescript
interface GatewayPermissionPromptView {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly riskLevel: 'low' | 'medium' | 'high';
  readonly requestedActionLabel: string;
}
```

When the gateway emits a `permission.requested` event:
1. Frontend shows a permission prompt UI (not yet implemented).
2. User approves or denies.
3. Frontend POSTs response to `/api/permission/respond`.
4. Gateway forwards decision to OpenCode.

---

## 11. Preview Status Contract

```typescript
interface GatewayPreviewStatusView {
  readonly state: 'not-configured' | 'starting' | 'ready' | 'error' | 'stopped';
  readonly label: string;
  readonly canStart: boolean;
  readonly canStop: boolean;
}
```

The frontend renders preview status directly. Start/Stop buttons call gateway REST endpoints.

---

## 12. Error/Degraded State Contract

| State | Frontend Behaviour |
|---|---|
| `offline` | Show "Offline" badge. All sessions are demo. |
| `connecting` | Show "Connecting" badge. Disable submit. |
| `connected` | Normal operation. |
| `degraded` | Show "Degraded" badge. Warn before submits. |
| `reconnecting` | Show "Reconnecting" badge. Queue submits for retry. |

---

## 13. Reconnect/Rehydration Expectations

1. Gateway persists session state across disconnects.
2. On SSE reconnect, gateway pushes a `connection.state` event with current state.
3. Gateway re-pushes the session list and active session messages.
4. Frontend restores UI state from gateway snapshot.
5. Frontend does NOT attempt to reconnect to OpenCode directly.

---

## 14. Security Boundaries

| Boundary | Enforced By |
|---|---|
| SDK credentials never reach browser | Gateway architecture |
| No direct OpenCode API calls from browser | Boundary guard + gateway proxy |
| Canonical IDs generated server-side | Gateway |
| Permission decisions signed by user | Frontend prompt UI + gateway verification |
| File access restricted to gateway scope | Gateway filesystem isolation |

---

## 15. Forbidden Browser Responsibilities

The following must NEVER happen in the browser:

- ❌ Import `@opencode-ai/sdk`
- ❌ Create `new EventSource(...)` pointing to OpenCode servers
- ❌ Create `new WebSocket(...)` pointing to OpenCode servers
- ❌ Call `fetch()` to OpenCode API endpoints
- ❌ Store `GEMINI_API_KEY` or any provider API key
- ❌ Generate canonical OpenCode message IDs
- ❌ Call `prompt_async` directly
- ❌ Access filesystem or PTY
- ❌ Run workspace processes
- ❌ Bypass gateway for permission decisions
