# Phase 2A — Gateway Scaffold

> **Status**: Scaffold only — no live OpenCode integration.

---

## Overview

Phase 2A creates the gateway service foundation and shared contracts package.
The gateway is a Fastify-based HTTP server that serves contract-demo data.
No OpenCode SDK, no SSE, no WebSocket, no database.

---

## Gateway Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check — returns scaffold mode |
| `GET` | `/ready` | Readiness — reports OpenCode not connected |
| `GET` | `/contract/status` | Contract status — all capabilities are mock |
| `GET` | `/contract/demo/sessions` | Returns 4 demo `GatewaySessionView` entries |
| `GET` | `/contract/demo/messages` | Returns 7 demo `GatewayMessageView` entries |

All endpoints return static contract-demo data with `isDemo: true`.
No persistence. No network. No canonical OpenCode IDs.

---

## How to Run Locally

```bash
# Install dependencies
npm install --prefix apps/gateway

# Start development server
GATEWAY_HOST=127.0.0.1 GATEWAY_PORT=3001 npm run gateway:dev

# In another terminal, test endpoints
curl http://127.0.0.1:3001/health
curl http://127.0.0.1:3001/ready
curl http://127.0.0.1:3001/contract/status
curl http://127.0.0.1:3001/contract/demo/sessions
curl http://127.0.0.1:3001/contract/demo/messages
```

---

## Shared Contracts

Located in `packages/contracts/`.

Provides Zod schemas and TypeScript types:

- `GatewayConnectionView` / `GatewayConnectionViewSchema`
- `GatewaySessionView` / `GatewaySessionViewSchema`
- `GatewayMessageView` / `GatewayMessageViewSchema`
- `GatewayPermissionPromptView` / `GatewayPermissionPromptViewSchema`
- `GatewayPreviewStatusView` / `GatewayPreviewStatusViewSchema`
- `GatewayWorkspaceRegistryView` / `GatewayWorkspaceRegistryViewSchema`
- `GatewayStatusView` / `GatewayStatusViewSchema`

---

## What Is Still Deferred

| Feature | Planned Phase |
|---|---|
| OpenCode SDK client creation | Phase 2B |
| SSE/EventSource stream to browser | Phase 2B |
| WebSocket for real-time updates | Phase 2B+ |
| `prompt_async` correlation | Phase 2B+ |
| Permission prompt execution | Phase 2B+ |
| Preview runtime management | Phase 3+ |
| Authentication | Phase 3+ |
| SQLite/database persistence | Phase 3+ |
| PTY / terminal | Phase 4+ |
| WebContainer | Phase 9 |

---

## Phase 2B Requirements

- Install `@opencode-ai/sdk`
- Create SDK client behind a disabled feature flag
- Spike SSE event types from SDK connection
- No production activation
