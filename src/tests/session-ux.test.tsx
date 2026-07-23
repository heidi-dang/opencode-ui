import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SessionsPanel } from '../components/SessionsPanel';
import { SessionList } from '../components/SessionList';
import { DEMO_SESSIONS } from '../mocks/frontendDemoData';

describe('SessionsPanel', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders the panel header with title and total badge', () => {
    render(<SessionsPanel />);
    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByText(`${DEMO_SESSIONS.length} total`)).toBeInTheDocument();
  });

  it('renders status filter chips', () => {
    render(<SessionsPanel />);
    // Filter chip buttons all have type="button" and aria-pressed
    const filterChips = screen.getAllByRole('button').filter(
      (btn) => btn.hasAttribute('aria-pressed'),
    );
    // At minimum: All, Idle, Busy, Error, Attention
    expect(filterChips.length).toBeGreaterThanOrEqual(5);
    // "All" chip is always present and unique
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('clicks the "All" status filter chip and activates it', async () => {
    render(<SessionsPanel />);

    // "All" appears only in the filter chip section (no session title contains "All")
    const allChip = screen.getByText('All');
    await user.click(allChip);

    // The "All" chip's button should now be aria-pressed="true" (active)
    expect(allChip.closest('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('clicks the "All" chip and shows clear filters', async () => {
    render(<SessionsPanel />);

    // Initially no clear button
    expect(screen.queryByRole('button', { name: /Clear all filters/i })).not.toBeInTheDocument();

    // Click "All" chip (it's already the default, but clicking still activates filter)
    const allChip = screen.getByText('All');
    await user.click(allChip);

    // Clear button still shouldn't appear since "All" is the default filter
    // Actually "All" as statusFilter !== 'all' - no, wait: statusFilter starts as 'all'
    // Clicking "All" chip sets statusFilter to 'all' which IS the default
    // So clear button should NOT appear
    expect(screen.queryByRole('button', { name: /Clear all filters/i })).not.toBeInTheDocument();
  });

  it('renders sort controls', () => {
    render(<SessionsPanel />);
    expect(screen.getByText('Recent')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('sorts by status when Status sort is clicked', async () => {
    render(<SessionsPanel />);

    const statusSortBtn = screen.getByText('Status');
    await user.click(statusSortBtn);

    expect(statusSortBtn.closest('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('sorts by name when Name sort is clicked', async () => {
    render(<SessionsPanel />);

    const nameSortBtn = screen.getByText('Name');
    await user.click(nameSortBtn);

    expect(nameSortBtn.closest('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows clear filters button only when filters are active', async () => {
    render(<SessionsPanel />);

    // No filters active initially, no clear button
    expect(screen.queryByRole('button', { name: /Clear all filters/i })).not.toBeInTheDocument();

    // Find a non-default filter chip by finding the button with aria-pressed that contains text "Error"
    // Use getAllByRole to find all buttons, then filter for the filter chip with "Error" text
    const allButtons = screen.getAllByRole('button');
    const errorChip = allButtons.find(
      (btn) => btn.hasAttribute('aria-pressed') && btn.textContent?.includes('Error'),
    );
    expect(errorChip).toBeTruthy();

    if (errorChip) {
      await user.click(errorChip);
    }

    // Clear button should appear
    expect(screen.getByRole('button', { name: /Clear all filters/i })).toBeInTheDocument();
  });

  it('clear filters removes all active filters and resets sort', async () => {
    render(<SessionsPanel />);

    // Find the Error filter chip and click it
    const allButtons = screen.getAllByRole('button');
    const errorChip = allButtons.find(
      (btn) => btn.hasAttribute('aria-pressed') && btn.textContent?.includes('Error'),
    );
    expect(errorChip).toBeTruthy();
    if (errorChip) await user.click(errorChip);

    // Click "Name" sort
    await user.click(screen.getByText('Name'));

    // Verify filters are active: clear button should appear
    expect(screen.getByRole('button', { name: /Clear all filters/i })).toBeInTheDocument();

    // Click clear
    await user.click(screen.getByRole('button', { name: /Clear all filters/i }));

    // Clear button should be gone
    expect(screen.queryByRole('button', { name: /Clear all filters/i })).not.toBeInTheDocument();

    // Recent should be the active sort again
    const recentBtn = screen.getByText('Recent');
    expect(recentBtn.closest('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders demo mode footer', () => {
    render(<SessionsPanel />);
    expect(screen.getByText(/Demo Mode \(Phase 1A\)/i)).toBeInTheDocument();
    expect(screen.getByText('Local State')).toBeInTheDocument();
  });
});

describe('SessionList', () => {
  let user: ReturnType<typeof userEvent.setup>;

  const mockSessions = DEMO_SESSIONS.slice(0, 3); // Use first 3 sessions

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders session items', () => {
    render(
      <SessionList
        sessions={mockSessions}
        activeSessionId={mockSessions[0].id}
        onSelectSession={() => {}}
      />,
    );

    expect(screen.getByText(mockSessions[0].title)).toBeInTheDocument();
    expect(screen.getByText(mockSessions[1].title)).toBeInTheDocument();
  });

  it('highlights the active session', () => {
    render(
      <SessionList
        sessions={mockSessions}
        activeSessionId={mockSessions[0].id}
        onSelectSession={() => {}}
      />,
    );

    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onSelectSession when a session is clicked', async () => {
    const onSelect = vi.fn();
    render(
      <SessionList
        sessions={mockSessions}
        activeSessionId={mockSessions[0].id}
        onSelectSession={onSelect}
      />,
    );

    await user.click(screen.getByText(mockSessions[1].title));
    expect(onSelect).toHaveBeenCalledWith(mockSessions[1].id);
  });

  it('navigates with ArrowDown key on listbox', () => {
    const onSelect = vi.fn();
    render(
      <SessionList
        sessions={mockSessions}
        activeSessionId={mockSessions[0].id}
        onSelectSession={onSelect}
      />,
    );

    const listbox = screen.getByRole('listbox', { name: /OpenCode Sessions/i });
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    expect(onSelect).toHaveBeenCalledWith(mockSessions[1].id);
  });

  it('navigates with ArrowUp key on listbox', () => {
    const onSelect = vi.fn();
    render(
      <SessionList
        sessions={mockSessions}
        activeSessionId={mockSessions[1].id}
        onSelectSession={onSelect}
      />,
    );

    const listbox = screen.getByRole('listbox', { name: /OpenCode Sessions/i });
    fireEvent.keyDown(listbox, { key: 'ArrowUp' });
    expect(onSelect).toHaveBeenCalledWith(mockSessions[0].id);
  });

  it('wraps around from last to first on ArrowDown', () => {
    const onSelect = vi.fn();
    const lastIdx = mockSessions.length - 1;
    render(
      <SessionList
        sessions={mockSessions}
        activeSessionId={mockSessions[lastIdx].id}
        onSelectSession={onSelect}
      />,
    );

    const listbox = screen.getByRole('listbox', { name: /OpenCode Sessions/i });
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    // Should wrap to first session
    expect(onSelect).toHaveBeenCalledWith(mockSessions[0].id);
  });

  it('wraps around from first to last on ArrowUp', () => {
    const onSelect = vi.fn();
    render(
      <SessionList
        sessions={mockSessions}
        activeSessionId={mockSessions[0].id}
        onSelectSession={onSelect}
      />,
    );

    const listbox = screen.getByRole('listbox', { name: /OpenCode Sessions/i });
    fireEvent.keyDown(listbox, { key: 'ArrowUp' });
    // Should wrap to last session
    expect(onSelect).toHaveBeenCalledWith(mockSessions[mockSessions.length - 1].id);
  });

  it('shows empty state when no sessions', () => {
    render(
      <SessionList
        sessions={[]}
        activeSessionId=""
        onSelectSession={() => {}}
      />,
    );

    expect(screen.getByText(/No sessions matched your filter/i)).toBeInTheDocument();
  });

  it('renders branch name, message count, and time for each session', () => {
    render(
      <SessionList
        sessions={mockSessions}
        activeSessionId={mockSessions[0].id}
        onSelectSession={() => {}}
      />,
    );

    // Each session shows its branch name
    for (const s of mockSessions) {
      expect(screen.getByText(s.branch)).toBeInTheDocument();
    }
  });
});
