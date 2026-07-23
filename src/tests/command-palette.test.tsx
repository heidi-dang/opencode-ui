import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CommandPalette } from '../components/CommandPalette';
import { useUiStore } from '../store/useUiStore';

describe('CommandPalette', () => {
  let user: ReturnType<typeof userEvent.setup>;

  const openPalette = () => {
    useUiStore.getState().setCommandPaletteOpen(true);
  };

  beforeEach(() => {
    user = userEvent.setup();
    useUiStore.setState({
      appearance: 'system',
      leftPanelOpen: true,
      rightPanelOpen: true,
      mobileNavigationOpen: false,
      mobileContextOpen: false,
      activeContextSection: 'workspace',
      commandPaletteOpen: false,
    });
  });

  afterEach(() => {
    useUiStore.getState().setCommandPaletteOpen(false);
    vi.restoreAllMocks();
  });

  it('renders nothing when closed', () => {
    const { container } = render(<CommandPalette />);
    expect(container.firstChild).toBeNull();
  });

  it('renders dialog when open', () => {
    openPalette();
    render(<CommandPalette />);
    expect(screen.getByRole('dialog', { name: /command palette/i })).toBeInTheDocument();
  });

  it('shows search input with placeholder', () => {
    openPalette();
    render(<CommandPalette />);
    const input = screen.getByPlaceholderText(/Type a command/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-label', 'Search commands');
  });

  it('displays all command categories in the list', () => {
    openPalette();
    render(<CommandPalette />);
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();

    // Check that navigation, panel, appearance, and context commands exist
    expect(screen.getByText('Go to Builder')).toBeInTheDocument();
    expect(screen.getByText('Toggle left panel')).toBeInTheDocument();
    expect(screen.getByText('Switch appearance: System')).toBeInTheDocument();
    expect(screen.getByText('Open context: Referenced files')).toBeInTheDocument();
  });

  it('filters commands when typing in search', async () => {
    openPalette();
    render(<CommandPalette />);

    // Type "left" — should show "Toggle left panel" but not others
    const input = screen.getByPlaceholderText(/Type a command/i);
    await user.type(input, 'left');

    expect(screen.getByText('Toggle left panel')).toBeInTheDocument();
    // "Go to Builder" should be hidden
    expect(screen.queryByText('Go to Builder')).not.toBeInTheDocument();
  });

  it('shows empty state when no commands match search', async () => {
    openPalette();
    render(<CommandPalette />);

    const input = screen.getByPlaceholderText(/Type a command/i);
    await user.type(input, 'zzzznonexistent');

    expect(screen.getByText(/No commands match/i)).toBeInTheDocument();
  });

  it('closes when clicking the backdrop', async () => {
    openPalette();
    render(<CommandPalette />);

    // The backdrop is the outermost div with role="dialog"
    const dialog = screen.getByRole('dialog', { name: /command palette/i });
    // Click the backdrop itself (not a child)
    await user.click(dialog);

    // After clicking backdrop, commandPaletteOpen should be false
    expect(useUiStore.getState().commandPaletteOpen).toBe(false);
  });

  it('navigates commands with ArrowDown and selects with Enter', async () => {
    openPalette();
    render(<CommandPalette />);

    const input = screen.getByPlaceholderText(/Type a command/i);

    // Focus the input
    await user.click(input);

    // First item should be selected by default
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');

    // Press ArrowDown to go to the second item
    await user.keyboard('{ArrowDown}');
    expect(options[0]).toHaveAttribute('aria-selected', 'false');
    expect(options[1]).toHaveAttribute('aria-selected', 'true');

    // Press Enter to select the second command — this should close the palette
    await user.keyboard('{Enter}');
    expect(useUiStore.getState().commandPaletteOpen).toBe(false);
  });

  it('closes on Escape key in the search input', async () => {
    openPalette();
    render(<CommandPalette />);

    const input = screen.getByPlaceholderText(/Type a command/i);
    await user.click(input);
    await user.keyboard('{Escape}');

    expect(useUiStore.getState().commandPaletteOpen).toBe(false);
  });

  it('shows keyboard hint footer', () => {
    openPalette();
    render(<CommandPalette />);
    expect(screen.getByText(/Frontend demo commands only/i)).toBeInTheDocument();
  });
});
