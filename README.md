# OpenCode Web UI

**Frontend web client foundation for the OpenCode headless AI development platform.**

Current phase: **Phase 1E — Readiness Audit and Gateway Integration Contract Prep**

## Implemented Routes

| Route | Description |
|---|---|
| `/` | Redirects to `/builder` |
| `/builder` | Three-panel builder workspace (sessions, chat, context) |
| `/live-preview` | Intentional empty state for preview runtime (Phase 9) |
| `/qa` | Frontend QA sandbox — UI gallery, stress data, accessibility tests |
| `/*` | 404 Not Found page |

## Technology Stack

- **React 19** with TypeScript
- **Vite 6** build tool
- **Tailwind CSS v4** styling
- **Zustand** state management with localStorage persistence
- **React Router v7** client-side routing
- **Lucide React** icons
- **Vitest** + **Testing Library** for tests
- **ESLint** with TypeScript and React plugins

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run all validation
npm run lint        # ESLint with zero-warning policy
npm run typecheck   # TypeScript type checking
npm run test:run    # Vitest test suite
npm run build       # Production build (typecheck + Vite build)
```

## Repository Structure

```
opencode-ui/
├── src/
│   ├── adapters/       # Demo data adapter (Phase 1E)
│   ├── components/     # Reusable UI components
│   ├── contracts/      # TypeScript contracts and view models
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Route page components
│   ├── store/          # Zustand state management
│   ├── mocks/          # Phase 1A demo/mock data
│   ├── types/          # TypeScript type definitions
│   └── tests/          # Vitest test suite
├── docs/
│   ├── readiness/      # Frontend readiness audit
│   └── contracts/      # Gateway integration contract docs
├── .github/workflows/  # CI configuration
├── eslint.config.js    # ESLint flat configuration
├── vite.config.ts      # Vite + Vitest configuration
└── tsconfig.json       # TypeScript configuration
```

## Deferred Functionality

The following features are **not implemented** in Phase 1A through 1D:

- Fastify/Express gateway integration
- OpenCode SDK and SSE event streaming
- WebContainer preview runtime
- Real API requests and session creation
- PTY / Terminal server
- Database / SQLite persistence
- Authentication and user sessions
- Gemini API integration

See [IMPLEMENTATION_MANIFEST.md](./IMPLEMENTATION_MANIFEST.md) for the full roadmap.
