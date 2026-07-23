# OpenCode Web UI

**Frontend web client foundation for the OpenCode headless AI development platform.**

Current phase: **Phase 2A — Gateway Scaffold and Contract Tests**

## Implemented Routes

| Route | Description |
|---|---|
| `/` | Redirects to `/builder` |
| `/builder` | Three-panel builder workspace (sessions, chat, context) |
| `/live-preview` | Intentional empty state for preview runtime (Phase 9) |
| `/qa` | Frontend QA sandbox — UI gallery, stress data, accessibility tests |
| `/*` | 404 Not Found page |

## Gateway Scaffold (Phase 2A)

The gateway server lives at `apps/gateway/`. It is a Fastify v5 HTTP server that serves contract-demo data only. No OpenCode SDK, no SSE, no WebSocket, no database.

```bash
# Run the gateway locally
GATEWAY_HOST=127.0.0.1 GATEWAY_PORT=3001 npm run gateway:dev

# Test endpoints
curl http://127.0.0.1:3001/health
curl http://127.0.0.1:3001/ready
curl http://127.0.0.1:3001/contract/status
```

Shared contracts are in `packages/contracts/` (Zod schemas + TypeScript types).

## Technology Stack

- **Frontend**: React 19 with TypeScript, Vite 6, Tailwind CSS v4, Zustand, React Router v7, Lucide React, Vitest + Testing Library, ESLint
- **Gateway**: Fastify v5 with TypeScript, Zod for schema validation, Vitest for tests

## Getting Started

```bash
# Install dependencies
npm install

# Start frontend development server
npm run dev

# Run frontend validation
npm run lint        # ESLint with zero-warning policy
npm run typecheck   # TypeScript type checking
npm run test:run    # Vitest test suite
npm run build       # Production build (typecheck + Vite build)
npm run check:boundaries  # Forbidden integration checks

# Run gateway
npm run gateway:install
GATEWAY_HOST=127.0.0.1 GATEWAY_PORT=3001 npm run gateway:dev

# Run gateway validation
npm run gateway:check  # typecheck + tests + build
```

## Repository Structure

```
opencode-ui/
├── apps/
│   └── gateway/        # Fastify gateway scaffold (Phase 2A)
│       ├── src/
│       │   ├── routes/       # Health and contract endpoints
│       │   ├── middleware/   # Request ID, error handler
│       │   └── tests/        # Gateway test suite
│       └── package.json
├── packages/
│   └── contracts/      # Shared Zod schemas and types
│       ├── src/
│       │   ├── gateway.ts    # View-model schemas
│       │   ├── events.ts     # Event type definitions
│       │   └── errors.ts     # Error response contract
│       └── package.json
├── src/
│   ├── adapters/       # Demo data adapter (Phase 1E)
│   ├── components/     # Reusable UI components
│   ├── contracts/      # Frontend-safe view models
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Route page components
│   ├── store/          # Zustand state management
│   ├── mocks/          # Demo/mock data
│   ├── types/          # TypeScript type definitions
│   └── tests/          # Vitest test suite
├── docs/
│   ├── readiness/      # Frontend readiness audit
│   ├── contracts/      # Gateway integration contract docs
│   └── gateway/        # Gateway scaffold documentation
├── scripts/            # Boundary check scripts
├── .github/workflows/  # CI configuration
├── eslint.config.js    # ESLint flat configuration
├── vite.config.ts      # Vite + Vitest configuration
└── tsconfig.json       # TypeScript configuration
```

## Deferred Functionality

The following features are **not implemented** yet:

- OpenCode SDK client creation (planned Phase 2B)
- SSE/EventSource stream to browser (planned Phase 2B)
- WebSocket for real-time updates (planned Phase 2B+)
- `prompt_async` correlation (planned Phase 2B+)
- Permission prompt execution (planned Phase 2B+)
- Preview runtime management (planned Phase 3+)
- Authentication (planned Phase 3+)
- SQLite/database persistence (planned Phase 3+)
- WebContainer preview runtime (planned Phase 9)
- PTY / Terminal server (planned Phase 4+)

See [IMPLEMENTATION_MANIFEST.md](./IMPLEMENTATION_MANIFEST.md) for the full roadmap.
