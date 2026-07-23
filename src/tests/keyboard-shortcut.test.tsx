import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';

describe('useKeyboardShortcut', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fires callback when the target key is pressed', async () => {
    const spy = vi.fn();
    function SimpleHarness() {
      useKeyboardShortcut({ key: 'a' }, spy);
      return <p>Press A</p>;
    }
    render(<SimpleHarness />);
    await user.keyboard('a');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not fire for a different key', async () => {
    const spy = vi.fn();
    function SimpleHarness() {
      useKeyboardShortcut({ key: 'b' }, spy);
      return <p>Press B</p>;
    }
    render(<SimpleHarness />);
    await user.keyboard('a');
    expect(spy).not.toHaveBeenCalled();
  });

  it('does not fire when typing in an input by default', async () => {
    const spy = vi.fn();
    function InputHarness() {
      useKeyboardShortcut({ key: 'Enter' }, spy);
      return <input data-testid="input" placeholder="type" />;
    }
    render(<InputHarness />);
    const input = screen.getByTestId('input');
    await user.click(input);
    await user.keyboard('{Enter}');
    // The Enter keydown in an input should not trigger the callback
    expect(spy).not.toHaveBeenCalled();
  });

  it('fires in inputs when allowInInputs is true', async () => {
    const spy = vi.fn();
    function InputHarness() {
      useKeyboardShortcut({ key: 'Escape', allowInInputs: true }, spy);
      return <input data-testid="input" placeholder="type" />;
    }
    render(<InputHarness />);
    const input = screen.getByTestId('input');
    await user.click(input);
    await user.keyboard('{Escape}');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('requires the specified modifier key', async () => {
    const spy = vi.fn();
    function ModHarness() {
      useKeyboardShortcut({ key: 'k', modifiers: ['meta'] }, spy);
      return <p>Cmd+K</p>;
    }
    render(<ModHarness />);

    // Press just 'k' — should not fire
    await user.keyboard('k');
    expect(spy).not.toHaveBeenCalled();

    // Press Cmd+K — should fire (userEvent simulates metaKey)
    const metaSpy = vi.fn();
    function MetaHarness() {
      useKeyboardShortcut({ key: 'k', modifiers: ['meta'] }, metaSpy);
      return <p>Meta+K</p>;
    }
    const { unmount } = render(<MetaHarness />);
    // userEvent.keyboard supports Meta key
    await user.keyboard('{Meta>}k{/Meta}');
    expect(metaSpy).toHaveBeenCalled();
    unmount();
  });

  it('accepts ctrl modifier', async () => {
    const spy = vi.fn();
    function CtrlHarness() {
      useKeyboardShortcut({ key: 's', modifiers: ['ctrl'] }, spy);
      return <p>Ctrl+S</p>;
    }
    render(<CtrlHarness />);

    await user.keyboard('{Control>}s{/Control}');
    expect(spy).toHaveBeenCalled();
  });

  it('cleans up event listener on unmount', async () => {
    const spy = vi.fn();
    function UnmountHarness() {
      useKeyboardShortcut({ key: 'x' }, spy);
      return <p>Press X</p>;
    }
    const { unmount } = render(<UnmountHarness />);
    unmount();
    await user.keyboard('x');
    expect(spy).not.toHaveBeenCalled();
  });
});
