# Phase 2C — Gateway Runtime Config, Safe Startup, and Adapter Health

> **Status**: Complete. Runtime configuration is validated with Zod. No live OpenCode connection.

---

## Objective

Centralize and validate gateway runtime configuration, expose safe runtime status endpoints, and ensure safe default startup without OpenCode configuration.

## Runtime Configuration Variables

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | Environment mode (`development`, `test`, `production`) |
| `GATEWAY_HOST` | `127.0.0.1` | Gateway bind host |
| `GATEWAY_PORT` | `3001` | Gateway bind port (1–65535) |
| `GATEWAY_LOG_LEVEL` | `info` | Logging level (`silent`, `error`, `warn`, `info`, `debug`) |
| `GATEWAY_CONFIG_STRICT` | `true` | Reject unknown env vars |
| `OPENCODE_SDK_ENABLED` | `false` | Enable SDK adapter |
| `OPENCODE_SERVER_URL` | (empty) | OpenCode server URL (required when enabled) |
| `OPENCODE_DEFAULT_MODEL` | (empty) | Default model (required when enabled) |

## Runtime Modes

| Mode | Description |
|---|---|
| `safe-disabled` | Default. SDK disabled, no configuration required. |
| `configured-not-connected` | SDK enabled and configured, but no live connection. |
| `configuration-error` | SDK enabled but required values missing/invalid. |

## Validation Rules

- URL must be HTTP or HTTPS, no embedded credentials
- Port must be integer 1–65535
- Host must be non-empty, no URL schemes or paths
- Log level must be one of: silent, error, warn, info, debug
- NODE_ENV must be one of: development, test, production

## Runtime Endpoints

### `GET /runtime/config`

Returns sanitized runtime configuration (no raw env values):

```json
{
  "nodeEnv": "development",
  "sdkEnabled": false,
  "serverConfigured": false,
  "modelConfigured": false,
  "mode": "safe-disabled"
}
```

### `GET /runtime/adapter-health`

Returns adapter health status:

```json
{
  "ok": true,
  "adapter": "disabled",
  "connection": "not-enabled",
  "sdkInstalled": false,
  "liveRequestsEnabled": false,
  "message": "OpenCode SDK integration is disabled."
}
```

## Redaction Rules

- Server URL is never returned in API responses
- Model value is never returned in API responses
- Host, port, log level are not returned in runtime config
- Validation errors omit credential values
- Logs do not expose raw configured URL

## Local Test Commands

```bash
# Disabled mode
GATEWAY_HOST=127.0.0.1 GATEWAY_PORT=3001 OPENCODE_SDK_ENABLED=false npm run dev

# Configured-not-connected mode
GATEWAY_HOST=127.0.0.1 GATEWAY_PORT=3002 \
  OPENCODE_SDK_ENABLED=true \
  OPENCODE_SERVER_URL=http://127.0.0.1:4096 \
  OPENCODE_DEFAULT_MODEL=test-model \
  npm run dev
```

## Deferred Functionality

- Live OpenCode SDK connection (Phase 2D+)
- SSE/EventSource stream to browser (Phase 2D+)
- WebSocket for real-time updates (Phase 2D+)
- `prompt_async` correlation (Phase 3+)
- SQLite/database persistence (Phase 3+)
- Authentication (Phase 3+)
- Workspace registry (Phase 3+)
