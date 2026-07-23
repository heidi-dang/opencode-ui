import {
  DemoSession,
  DemoWorkflowStep,
  DemoMessage,
  DemoFileItem,
  DemoTodoItem,
  SelectorOption,
} from '../types/ui';

export const DEMO_WORKSPACES: SelectorOption[] = [
  { id: 'ws-main', name: 'opencode-core-workspace', description: 'Primary monorepo workspace' },
  { id: 'ws-api', name: 'gateway-fastify-service', description: 'API Server and SSE routes' },
  { id: 'ws-ui', name: 'web-ui-react-shell', description: 'React + Vite Frontend shell' },
];

export const DEMO_BRANCHES: SelectorOption[] = [
  { id: 'br-main', name: 'main', description: 'Production head branch' },
  { id: 'br-feat-1a', name: 'feat/opencode-web-phase-1a-shell', description: 'Active feature branch' },
  { id: 'br-fix-sse', name: 'fix/sse-reconnect-backoff', description: 'Hotfix branch' },
];

export const DEMO_AGENTS: SelectorOption[] = [
  { id: 'agent-coder', name: 'Coder Agent v2.4', description: 'Autonomous TypeScript developer', badge: 'Default' },
  { id: 'agent-architect', name: 'Architect Agent v1.1', description: 'System designer & schema planning' },
  { id: 'agent-reviewer', name: 'Reviewer Agent v3.0', description: 'Code quality & security audit' },
];

export const DEMO_MODELS: SelectorOption[] = [
  { id: 'model-gemini-pro', name: 'Gemini 2.5 Pro', description: 'Recommended for complex coding & reasoning', badge: 'Fast' },
  { id: 'model-gemini-flash', name: 'Gemini 2.5 Flash', description: 'Optimized for high-speed edits' },
  { id: 'model-claude-35', name: 'Claude 3.5 Sonnet (External)', description: 'Third-party provider via OpenCode' },
];

export const DEMO_SESSIONS: DemoSession[] = [
  {
    id: 'sess-001',
    title: 'Phase 1A: React Shell & 3-Panel Foundation',
    updatedAt: '2 mins ago',
    status: 'busy',
    branch: 'feat/opencode-web-phase-1a-shell',
    messageCount: 14,
    previewReady: false,
    lastMessage: 'Building responsive desktop toolbar and navigation layout...',
  },
  {
    id: 'sess-002',
    title: 'Refactor Tailwind Theme Tokens & Dark Canvas',
    updatedAt: '18 mins ago',
    status: 'idle',
    branch: 'main',
    messageCount: 8,
    previewReady: true,
    lastMessage: 'All theme tokens configured in index.css with CSS variables.',
  },
  {
    id: 'sess-003',
    title: 'Investigate Gateway SSE Reconnection Backoff',
    updatedAt: '1 hour ago',
    status: 'attention',
    branch: 'fix/sse-reconnect-backoff',
    messageCount: 22,
    previewReady: false,
    lastMessage: 'Attention: SSE ping dropped 3 packets. Retry mechanism required.',
  },
  {
    id: 'sess-004',
    title: 'Setup Zustand Layout Store with Storage Persistence',
    updatedAt: '3 hours ago',
    status: 'idle',
    branch: 'main',
    messageCount: 5,
    previewReady: true,
    lastMessage: 'useUiStore verified with local storage hydration test.',
  },
  {
    id: 'sess-005',
    title: 'Automated Fastify Route Schema Verification',
    updatedAt: 'Yesterday',
    status: 'error',
    branch: 'feat/fastify-gateway',
    messageCount: 19,
    previewReady: false,
    lastMessage: 'Error: Gateway endpoint /session/:id returned 502 Bad Gateway.',
  },
];

export const DEMO_WORKFLOW_STEPS: DemoWorkflowStep[] = [
  {
    id: 'wf-1',
    title: 'Workflow Execution Started',
    type: 'step_started',
    timestamp: '10:42:01',
    detail: 'Target task: Build OpenCode Phase 1A frontend shell',
    status: 'completed',
  },
  {
    id: 'wf-2',
    title: 'Queueing File Inspector Tool',
    type: 'tool_queued',
    timestamp: '10:42:03',
    detail: 'Inspecting apps/web workspace directory',
    status: 'completed',
  },
  {
    id: 'wf-3',
    title: 'Running File Creation: useUiStore.ts',
    type: 'tool_running',
    timestamp: '10:42:05',
    detail: 'Writing layout preference state with Zustand',
    duration: '1.2s',
    status: 'in_progress',
  },
  {
    id: 'wf-4',
    title: 'File Modified: src/types/ui.ts',
    type: 'file_changed',
    timestamp: '10:42:08',
    detail: '+42 lines added, 0 lines removed',
    status: 'completed',
  },
  {
    id: 'wf-5',
    title: 'Attention Required: Offline Gateway Mode',
    type: 'attention_required',
    timestamp: '10:42:12',
    detail: 'Phase 1A running in mock mode. Backend API calls are disabled.',
    status: 'warning',
  },
  {
    id: 'wf-6',
    title: 'Completed Component Assembly',
    type: 'tool_completed',
    timestamp: '10:42:15',
    detail: 'All shell panels rendered with zero console errors',
    duration: '0.8s',
    status: 'completed',
  },
];

export const DEMO_MESSAGES: DemoMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    author: 'Developer',
    timestamp: '10:40 AM',
    content: 'Please create the OpenCode Web UI Phase 1A shell with a three-panel responsive layout, Zustand state, and mock workspace components.',
  },
  {
    id: 'msg-2',
    role: 'assistant',
    author: 'Coder Agent v2.4',
    timestamp: '10:41 AM',
    content: `I am building **Frontend Phase 1A: Production Shell and Interaction Foundation** for OpenCode.

Here is the architectural overview of the layout:
* **Top Toolbar**: Product identity, Workspace & Branch selector, Agent/Model selector, Connection state indicator, and View toggles.
* **Left Panel**: Sessions panel with search, filter, and session status cards.
* **Center Column**: Compact Workflow summary timeline, scrollable message feed with code snippet controls, and multi-line composer placeholder.
* **Right Panel**: "Workspace & Context" panel showcasing Referenced Files, Modified Files, Workspace Tree Browser, and Todos.

Below is the layout store implementation snippet:`,
    tokensUsed: 1240,
    costEstimate: '$0.0024',
    codeBlocks: [
      {
        language: 'typescript',
        filename: 'src/store/useUiStore.ts',
        code: `import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppearanceMode, ContextSection } from '../types/ui';

interface UiState {
  appearance: AppearanceMode;
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  mobileNavigationOpen: boolean;
  mobileContextOpen: boolean;
  activeContextSection: ContextSection;
  setAppearance: (mode: AppearanceMode) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  setActiveContextSection: (section: ContextSection) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      appearance: 'system',
      leftPanelOpen: true,
      rightPanelOpen: true,
      mobileNavigationOpen: false,
      mobileContextOpen: false,
      activeContextSection: 'workspace',
      setAppearance: (appearance) => set({ appearance }),
      toggleLeftPanel: () => set((state) => ({ leftPanelOpen: !state.leftPanelOpen })),
      toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
      setActiveContextSection: (activeContextSection) => set({ activeContextSection }),
    }),
    { name: 'opencode-ui-preferences' }
  )
);`,
      },
    ],
    toolActivity: {
      toolName: 'create_file',
      action: 'Created src/store/useUiStore.ts',
      status: 'success',
      output: 'File created successfully (48 lines written)',
    },
  },
  {
    id: 'msg-3',
    role: 'user',
    author: 'Developer',
    timestamp: '10:42 AM',
    content: 'Ensure all buttons have explicit keyboard focus indicators and that the Live Preview route explains that the runtime server will connect in Phase 9.',
  },
  {
    id: 'msg-4',
    role: 'assistant',
    author: 'Coder Agent v2.4',
    timestamp: '10:43 AM',
    content: `All accessibility requirements have been satisfied:
1. Visible focus rings using \`focus-visible:ring-2 focus-visible:ring-amber-500\`.
2. Accessible drawer controls with \`aria-expanded\` and \`aria-current="page"\`.
3. The \`/live-preview\` route includes an intentional empty state clearly stating **Preview runtime not connected** with disabled viewports and logs placeholder.`,
    tokensUsed: 620,
    costEstimate: '$0.0012',
  },
];

export const DEMO_REFERENCED_FILES: DemoFileItem[] = [
  { id: 'rf-1', path: 'src/App.tsx', name: 'App.tsx', size: '1.2 KB', status: 'unchanged' },
  { id: 'rf-2', path: 'src/types/ui.ts', name: 'ui.ts', size: '2.4 KB', status: 'added' },
  { id: 'rf-3', path: 'src/store/useUiStore.ts', name: 'useUiStore.ts', size: '1.8 KB', status: 'added' },
  { id: 'rf-4', path: 'src/index.css', name: 'index.css', size: '3.1 KB', status: 'modified' },
];

export const DEMO_MODIFIED_FILES: DemoFileItem[] = [
  { id: 'mf-1', path: 'src/types/ui.ts', name: 'ui.ts', status: 'added', linesAdded: 54, linesRemoved: 0 },
  { id: 'mf-2', path: 'src/store/useUiStore.ts', name: 'useUiStore.ts', status: 'added', linesAdded: 48, linesRemoved: 0 },
  { id: 'mf-3', path: 'src/components/AppShell.tsx', name: 'AppShell.tsx', status: 'added', linesAdded: 112, linesRemoved: 0 },
  { id: 'mf-4', path: 'src/index.css', name: 'index.css', status: 'modified', linesAdded: 24, linesRemoved: 2 },
];

export const DEMO_WORKSPACE_FILES = [
  { id: 'dir-src', name: 'src', isDir: true, path: 'src' },
  { id: 'file-app', name: 'App.tsx', isDir: false, path: 'src/App.tsx', size: '1.2 KB' },
  { id: 'file-main', name: 'main.tsx', isDir: false, path: 'src/main.tsx', size: '0.4 KB' },
  { id: 'dir-components', name: 'components', isDir: true, path: 'src/components' },
  { id: 'file-shell', name: 'AppShell.tsx', isDir: false, path: 'src/components/AppShell.tsx', size: '4.8 KB' },
  { id: 'file-toolbar', name: 'TopToolbar.tsx', isDir: false, path: 'src/components/TopToolbar.tsx', size: '3.2 KB' },
  { id: 'file-sessions', name: 'SessionsPanel.tsx', isDir: false, path: 'src/components/SessionsPanel.tsx', size: '3.9 KB' },
  { id: 'file-context', name: 'ContextPanel.tsx', isDir: false, path: 'src/components/ContextPanel.tsx', size: '4.1 KB' },
  { id: 'dir-store', name: 'store', isDir: true, path: 'src/store' },
  { id: 'file-uistore', name: 'useUiStore.ts', isDir: false, path: 'src/store/useUiStore.ts', size: '1.8 KB' },
  { id: 'file-pkg', name: 'package.json', isDir: false, path: 'package.json', size: '0.8 KB' },
  { id: 'file-manifest', name: 'IMPLEMENTATION_MANIFEST.md', isDir: false, path: 'IMPLEMENTATION_MANIFEST.md', size: '2.1 KB' },
];

export const DEMO_TODOS: DemoTodoItem[] = [
  { id: 'todo-1', task: 'Implement Phase 1A 3-panel shell layout', completed: true, category: 'Frontend' },
  { id: 'todo-2', task: 'Setup Zustand theme and layout persistence', completed: true, category: 'State' },
  { id: 'todo-3', task: 'Build accessible mobile drawers with backdrop', completed: true, category: 'UX' },
  { id: 'todo-4', task: 'Create Live Preview Phase 9 placeholder route', completed: true, category: 'Routing' },
  { id: 'todo-5', task: 'Connect Fastify gateway and SSE event stream', completed: false, category: 'Phase 2' },
  { id: 'todo-6', task: 'Integrate WebContainer runtime preview server', completed: false, category: 'Phase 9' },
];
