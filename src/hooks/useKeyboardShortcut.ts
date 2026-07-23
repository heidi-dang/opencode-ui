import { useEffect, useCallback } from 'react';

type Modifier = 'meta' | 'ctrl' | 'shift' | 'alt';

interface ShortcutOptions {
  /** The key to listen for (e.g. 'k', 'Escape') */
  key: string;
  /** Required modifiers. 'metaKey' on Mac, 'ctrlKey' on other platforms. */
  modifiers?: Modifier[];
  /** If true, the shortcut will fire even when the user is typing in an input/textarea/contenteditable */
  allowInInputs?: boolean;
  /** Whether to prevent the default browser behaviour */
  preventDefault?: boolean;
}

/**
 * Registers a keyboard shortcut that triggers a callback.
 *
 * By default, the shortcut will NOT fire when the user is typing in an
 * input, textarea, or contenteditable element, to avoid interfering with
 * text entry. Set `allowInInputs: true` to override this (e.g. for Escape).
 */
export function useKeyboardShortcut(
  { key, modifiers = [], allowInInputs = false, preventDefault = true }: ShortcutOptions,
  callback: () => void,
): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Avoid firing while typing in input elements (unless explicitly allowed)
      if (!allowInInputs) {
        const target = event.target as HTMLElement;
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return;
        }
      }

      // Check key
      if (event.key !== key) return;

      // Check modifiers
      const allModifiers = [...modifiers];

      // Check that every required modifier is pressed
      for (const mod of allModifiers) {
        switch (mod) {
          case 'meta':
            if (!event.metaKey && !event.ctrlKey) return;
            break;
          case 'ctrl':
            if (!event.ctrlKey) return;
            break;
          case 'shift':
            if (!event.shiftKey) return;
            break;
          case 'alt':
            if (!event.altKey) return;
            break;
        }
      }

      // Check that no extra modifiers are pressed (unless expected)
      const extraModifiers = ['metaKey', 'ctrlKey', 'shiftKey', 'altKey'].filter(
        (m) => !allModifiers.includes(m.replace('Key', '') as Modifier) && (event as unknown as Record<string, boolean>)[m],
      );
      if (extraModifiers.length > 0) return;

      if (preventDefault) {
        event.preventDefault();
      }

      callback();
    },
    [key, modifiers, allowInInputs, preventDefault, callback],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
