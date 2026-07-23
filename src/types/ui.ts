export type AppearanceMode = 'system' | 'light' | 'dark';

export type MainView = 'builder' | 'live-preview';

export type ContextSection = 'referenced' | 'modified' | 'workspace' | 'todos';

export type SessionStatus = 'idle' | 'busy' | 'retrying' | 'attention' | 'error';

export type LoadableState = 'idle' | 'loading' | 'ready' | 'empty' | 'error';

export interface DemoSession {
  id: string;
  title: string;
  updatedAt: string;
  status: SessionStatus;
  branch: string;
  messageCount: number;
  previewReady: boolean;
  lastMessage: string;
}

export interface DemoWorkflowStep {
  id: string;
  title: string;
  type: 'step_started' | 'tool_queued' | 'tool_running' | 'file_changed' | 'tool_completed' | 'attention_required';
  timestamp: string;
  detail?: string;
  duration?: string;
  status: 'completed' | 'in_progress' | 'pending' | 'warning' | 'failed';
}

export interface DemoMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  author: string;
  timestamp: string;
  content: string;
  tokensUsed?: number;
  costEstimate?: string;
  codeBlocks?: {
    language: string;
    filename: string;
    code: string;
  }[];
  toolActivity?: {
    toolName: string;
    action: string;
    status: 'success' | 'running' | 'error';
    output?: string;
  };
}

export interface DemoFileItem {
  id: string;
  path: string;
  name: string;
  status?: 'modified' | 'added' | 'deleted' | 'unchanged';
  linesAdded?: number;
  linesRemoved?: number;
  size?: string;
}

export interface DemoTodoItem {
  id: string;
  task: string;
  completed: boolean;
  category: string;
}

export interface SelectorOption {
  id: string;
  name: string;
  description?: string;
  badge?: string;
  disabled?: boolean;
}
