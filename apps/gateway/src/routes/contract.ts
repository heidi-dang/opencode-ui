import type { FastifyInstance } from 'fastify';
import type { GatewaySessionView, GatewayMessageView } from '../../../../packages/contracts/src/gateway.js';

const demoSessionViews: GatewaySessionView[] = [
  {
    id: 'demo-sess-1',
    title: 'Feature Implementation',
    status: 'idle',
    lastActivityLabel: '2 hours ago',
    description: 'Building the new auth system',
    isDemo: true,
  },
  {
    id: 'demo-sess-2',
    title: 'Bug Fix: Login Flow',
    status: 'busy',
    lastActivityLabel: '30 minutes ago',
    description: 'Investigating session timeout issues',
    isDemo: true,
  },
  {
    id: 'demo-sess-3',
    title: 'Code Review: PR #142',
    status: 'idle',
    lastActivityLabel: '1 day ago',
    isDemo: true,
  },
  {
    id: 'demo-sess-4',
    title: 'Database Migration Plan',
    status: 'attention',
    lastActivityLabel: 'Just now',
    description: 'Requires user confirmation to proceed',
    isDemo: true,
  },
];

const demoMessageViews: GatewayMessageView[] = [
  {
    id: 'demo-msg-1',
    role: 'user',
    content: 'Hello, can you help me implement a new authentication flow?',
    createdAtLabel: '2 hours ago',
    isDemo: true,
  },
  {
    id: 'demo-msg-2',
    role: 'assistant',
    content:
      "I'd be happy to help! Let me start by analyzing the current auth setup and suggesting an approach. What authentication strategy are you considering?",
    createdAtLabel: '2 hours ago',
    isStreaming: false,
    isDemo: true,
  },
  {
    id: 'demo-msg-3',
    role: 'user',
    content: 'I think JWT-based auth with refresh tokens would work best.',
    createdAtLabel: '2 hours ago',
    isDemo: true,
  },
  {
    id: 'demo-msg-4',
    role: 'tool',
    content: 'Reading project files... Found auth configuration in src/auth/config.ts',
    createdAtLabel: '90 minutes ago',
    isDemo: true,
  },
  {
    id: 'demo-msg-5',
    role: 'assistant',
    content:
      "Great choice! I've reviewed your current setup. Here's my plan:\n\n1. Create a JWT utility module\n2. Add refresh token rotation\n3. Update the login endpoint\n4. Add token middleware\n\nShall I proceed with implementation?",
    createdAtLabel: '90 minutes ago',
    isStreaming: false,
    isDemo: true,
  },
  {
    id: 'demo-msg-6',
    role: 'system',
    content: 'Session state saved. You can resume this conversation at any time.',
    createdAtLabel: '30 minutes ago',
    isDemo: true,
  },
  {
    id: 'demo-msg-7',
    role: 'user',
    content: 'Yes, please proceed with the implementation plan.',
    createdAtLabel: '30 minutes ago',
    isDemo: true,
  },
];

export async function registerContractRoutes(app: FastifyInstance): Promise<void> {
  app.get('/contract/status', async () => ({
    connection: 'offline',
    mode: 'contract-only',
    capabilities: {
      sessions: 'mock',
      messages: 'mock',
      permissions: 'mock',
      preview: 'not-implemented',
    },
  }));

  app.get('/contract/demo/sessions', async () => demoSessionViews);

  app.get('/contract/demo/messages', async () => demoMessageViews);
}
