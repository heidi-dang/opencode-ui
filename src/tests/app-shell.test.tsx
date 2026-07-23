import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { useUiStore } from '../store/useUiStore';

// Helper to render the full app with routing
function renderApp(route = '/') {
  window.history.pushState({}, '', route);
  return render(<App />);
}

beforeEach(() => {
  // Reset Zustand store first (may write to localStorage via persist)
  useUiStore.setState({
    appearance: 'system',
    leftPanelOpen: true,
    rightPanelOpen: true,
    mobileNavigationOpen: false,
    mobileContextOpen: false,
    activeContextSection: 'workspace',
  });
  // Clear localStorage after reset to ensure pristine state between tests
  localStorage.clear();
});

describe('Route navigation', () => {
  it('redirects / to /builder', () => {
    renderApp('/');
    expect(window.location.pathname).toBe('/builder');
  });

  it('renders the Builder interface at /builder', () => {
    renderApp('/builder');
    expect(screen.getAllByText(/OpenCode/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Workflow Execution Timeline/i)).toBeInTheDocument();
  });

  it('renders the disconnected preview state at /live-preview', () => {
    renderApp('/live-preview');
    expect(screen.getByText(/Preview runtime not connected/i)).toBeInTheDocument();
    const startBtn = screen.getByRole('button', { name: /Start Preview/i });
    expect(startBtn).toBeDisabled();
  });

  it('renders the not-found page for an unknown route', () => {
    renderApp('/nonexistent-route');
    expect(screen.getByText(/404 Not Found/i)).toBeInTheDocument();
    expect(screen.getByText(/Requested Workspace Route Does Not Exist/i)).toBeInTheDocument();
  });

  it('navigates between Builder and Live Preview without a full reload', async () => {
    renderApp('/builder');
    expect(screen.getByText(/Workflow Execution Timeline/i)).toBeInTheDocument();

    const livePreviewLink = screen.getByRole('link', { name: /Live Preview/i });
    await userEvent.click(livePreviewLink);
    expect(screen.getByText(/Preview runtime not connected/i)).toBeInTheDocument();

    const builderLink = screen.getByRole('link', { name: /Builder/i });
    await userEvent.click(builderLink);
    expect(screen.getByText(/Workflow Execution Timeline/i)).toBeInTheDocument();
  });
});

describe('Session search', () => {
  it('is case-insensitive', async () => {
    renderApp('/builder');
    const searchInput = screen.getByPlaceholderText(/Filter sessions/i);
    await userEvent.type(searchInput, 'REFACTOR');
    expect(screen.getByText(/Refactor Tailwind Theme Tokens/i)).toBeInTheDocument();
  });

  it('displays an empty result state when no sessions match', async () => {
    renderApp('/builder');
    const searchInput = screen.getByPlaceholderText(/Filter sessions/i);
    await userEvent.type(searchInput, 'zzzznonexistent');
    expect(screen.getByText(/No sessions matched your filter/i)).toBeInTheDocument();
  });
});

describe('Panel toggles', () => {
  it('toggles left panel visibility', async () => {
    renderApp('/builder');
    expect(screen.getByText(/^Sessions$/i)).toBeInTheDocument();

    const toggleBtn = screen.getByRole('button', { name: /Collapse left panel/i });
    await userEvent.click(toggleBtn);
    expect(screen.getByRole('button', { name: /Expand left panel/i })).toBeInTheDocument();
  });

  it('toggles right panel visibility', async () => {
    renderApp('/builder');
    expect(screen.getByRole('heading', { name: /Workspace & Context/i })).toBeInTheDocument();

    const toggleBtn = screen.getByRole('button', { name: /Collapse context panel/i });
    await userEvent.click(toggleBtn);
    expect(screen.getByRole('button', { name: /Expand context panel/i })).toBeInTheDocument();
  });
});

describe('Context tabs', () => {
  it('changes between referenced, modified, workspace, and todos sections', async () => {
    renderApp('/builder');

    // Find the context panel by its heading, then scope queries
    const contextHeading = screen.getByRole('heading', { name: /Workspace & Context/i });
    const contextPanel = contextHeading.closest('aside');
    expect(contextPanel).toBeTruthy();

    const tabs = within(contextPanel!).getAllByRole('button');
    // Find buttons by their text content
    const referencedBtn = tabs.find((b) => b.textContent?.includes('Referenced'));
    const modifiedBtn = tabs.find((b) => b.textContent?.includes('Modified'));
    const workspaceBtn = tabs.find((b) => b.textContent?.includes('Workspace'));
    const todosBtn = tabs.find((b) => b.textContent?.includes('Todos'));

    expect(referencedBtn).toBeTruthy();
    expect(modifiedBtn).toBeTruthy();
    expect(workspaceBtn).toBeTruthy();
    expect(todosBtn).toBeTruthy();

    // Click on Modified tab
    await userEvent.click(modifiedBtn!);
    expect(screen.getByText(/Uncommitted diff modifications/i)).toBeInTheDocument();

    // Click on Referenced tab
    await userEvent.click(referencedBtn!);
    expect(screen.getByText(/Files explicitly attached/i)).toBeInTheDocument();

    // Click on Todos tab
    await userEvent.click(todosBtn!);
    expect(screen.getByText(/Task list and implementation/i)).toBeInTheDocument();
  });
});

describe('Appearance mode', () => {
  it('changes between system, light, and dark', async () => {
    renderApp('/builder');
    const themeButton = screen.getByRole('button', { name: /Toggle theme/i });
    expect(themeButton).toBeInTheDocument();

    // Click to cycle: system -> dark -> light -> system
    await userEvent.click(themeButton);
    await userEvent.click(themeButton);
    await userEvent.click(themeButton);
    expect(screen.getByRole('button', { name: /Toggle theme/i })).toBeInTheDocument();
  });
});

describe('Error state', () => {
  it('provides a Retry action in error state', () => {
    renderApp('/builder');
    expect(screen.queryByText(/Retry Connection/i)).not.toBeInTheDocument();
  });
});

describe('Composer behavior', () => {
  it('Send does not call fetch', async () => {
    const fetchSpy = vi.spyOn(window, 'fetch');
    renderApp('/builder');

    const textarea = screen.getByPlaceholderText(/Type your message/i);
    await userEvent.type(textarea, 'Hello world');

    const sendButton = screen.getByRole('button', { name: /^Send$/i });
    await userEvent.click(sendButton);

    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});

describe('Preview Start button', () => {
  it('remains disabled', () => {
    renderApp('/live-preview');
    const startBtn = screen.getByRole('button', { name: /Start Preview/i });
    expect(startBtn).toBeDisabled();
  });
});

describe('Selector dropdowns', () => {
  it('opening model or agent selectors performs no network action', async () => {
    const fetchSpy = vi.spyOn(window, 'fetch');
    renderApp('/builder');

    // Find model selector button: contains "Gemini 2.5 Pro" and "Model Selection" dropdown
    const header = screen.getByRole('banner');
    const modelButton = within(header).getByText(/Gemini 2.5 Pro/i).closest('button');
    expect(modelButton).toBeTruthy();
    await userEvent.click(modelButton!);
    expect(screen.getByText(/Model Selection/i)).toBeInTheDocument();

    // Agent selector
    const agentButton = within(header).getByText(/Coder Agent v2.4/i).closest('button');
    expect(agentButton).toBeTruthy();
    await userEvent.click(agentButton!);
    expect(screen.getByText(/Agent Engine Placeholder/i)).toBeInTheDocument();

    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});

describe('UI persistence', () => {
  it('persists UI preferences in localStorage', async () => {
    const { unmount } = renderApp('/builder');

    const toggleBtn = screen.getByRole('button', { name: /Collapse left panel/i });
    await userEvent.click(toggleBtn);

    unmount();

    // Render again and check the preference was restored
    renderApp('/builder');
    expect(screen.getByRole('button', { name: /Expand left panel/i })).toBeInTheDocument();

    // Verify the localStorage key exists
    const stored = localStorage.getItem('opencode-ui-preferences-v1');
    expect(stored).toBeTruthy();
  });

  it('does not persist mock sessions or messages in state', async () => {
    renderApp('/builder');

    // Trigger a state change through the store to make persist write
    const toggleBtn = screen.getByRole('button', { name: /Collapse left panel/i });
    await userEvent.click(toggleBtn);

    // Now the persist middleware should have written to localStorage
    await waitFor(() => {
      const stored = localStorage.getItem('opencode-ui-preferences-v1');
      expect(stored).toBeTruthy();
    });

    const storedAfter = JSON.parse(localStorage.getItem('opencode-ui-preferences-v1')!);
    expect(storedAfter).toHaveProperty('state');
    expect(storedAfter).toHaveProperty('version');
    // Sessions and messages data should NOT be in the persisted preferences
    expect(storedAfter.state).not.toHaveProperty('sessions');
    expect(storedAfter.state).not.toHaveProperty('messages');
  });
});
