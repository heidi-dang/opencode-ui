# Phase 2B — Gateway OpenCode SDK Adapter Spike Behind Disabled Flag

> **Status**: Complete. SDK adapter exists but is disabled by default.

---

## Goal

Add the gateway-only OpenCode SDK adapter seam behind a disabled flag.

This phase is a **spike and safety boundary phase**. It does not create a live user-facing connection.

## What Was Added

### SDK Types (`apps/gateway/src/opencode/sdkTypes.ts`)
- `SdkAdapterState`: `'not-enabled' | 'enabled' | 'error' | 'connecting' | 'connected'`
- `SdkConfig`: Server URL and default model configuration
- `SdkHealthView`: Health view model for API responses
- `SdkAdapter`: Interface for SDK interaction

### Disabled Adapter (`apps/gateway/src/opencode/sdkDisabled.ts`)
- Always returns `not-enabled` state
- `init()` throws `SdkNotEnabledError`
- `getHealth()` returns safe not-enabled health view
- `destroy()` is a safe no-op

### Adapter Factory (`apps/gateway/src/opencode/sdkAdapter.ts`)
- `createSdkAdapter({ enabled: false })` returns disabled adapter
- `createSdkAdapter({ enabled: true })` also returns disabled adapter in Phase 2B (live adapter not yet implemented)

### Config Changes
- `OPENCODE_SDK_ENABLED` (default: `false`)
- `OPENCODE_SERVER_URL` (default: `''`)
- `OPENCODE_DEFAULT_MODEL` (default: `''`)

## Default State

| Setting | Default | Notes |
|---|---|---|
| `OPENCODE_SDK_ENABLED` | `false` | SDK adapter is disabled |
| `OPENCODE_SERVER_URL` | (empty) | Must be set when enabling |
| `OPENCODE_DEFAULT_MODEL` | (empty) | Must be set when enabling |

## What Is Still Forbidden

- No browser SDK usage
- No EventSource (gateway)
- No WebSocket (gateway)
- No `prompt_async` execution
- No SQLite
- No secrets in config

## Next Phase

**Phase 2C — Gateway Runtime Config, Safe Startup, and Adapter Health**
