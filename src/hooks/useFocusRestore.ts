import { useRef, useEffect } from 'react';

/**
 * Saves a ref to the currently focused element on activation.
 * Restores focus to the saved element on deactivation.
 *
 * @param active - Whether the focus restore behavior is active.
 */
export function useFocusRestore(active: boolean): void {
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (active) {
      lastFocusedRef.current = document.activeElement as HTMLElement;
    } else if (lastFocusedRef.current && typeof lastFocusedRef.current.focus === 'function') {
      lastFocusedRef.current.focus();
      lastFocusedRef.current = null;
    }
  }, [active]);
}
