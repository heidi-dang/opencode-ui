import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Search,
  ArrowRight,
  Layout,
  PanelLeft,
  PanelRight,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
  FileText,
  FileCode,
  FolderTree,
  CheckSquare,
  Command,
  Beaker,
} from 'lucide-react';
import { useUiStore } from '../store/useUiStore';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { useFocusTrap } from '../hooks/useFocusTrap';
import type { AppearanceMode, ContextSection } from '../contracts/presentation';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: 'navigation' | 'panel' | 'appearance' | 'context';
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    toggleLeftPanel,
    toggleRightPanel,
    resetLayout,
    setAppearance,
    setActiveContextSection,
  } = useUiStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Trap Tab focus within the palette while open
  useFocusTrap(commandPaletteOpen, containerRef);

  // Track the previously focused element when opening, restore on close
  useEffect(() => {
    if (commandPaletteOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement;
      // Focus the search input and reset state after a short delay
      setTimeout(() => {
        inputRef.current?.focus();
        setSearchQuery('');
        setActiveIndex(0);
      }, 50);
    }
    return () => {
      // Cleanup: restore focus when the effect cleans up (on unmount or deactivation)
      if (!commandPaletteOpen && lastFocusedRef.current && typeof lastFocusedRef.current.focus === 'function') {
        const el = lastFocusedRef.current;
        lastFocusedRef.current = null;
        // Use requestAnimationFrame to avoid React batching issues
        requestAnimationFrame(() => {
          el.focus();
        });
      }
    };
  }, [commandPaletteOpen]);

  const commands: CommandItem[] = useMemo(
    () => [
      // Navigation
      {
        id: 'nav-builder',
        label: 'Go to Builder',
        description: 'Switch to the Builder workspace view',
        icon: <Layout className="w-4 h-4" />,
        category: 'navigation',
        action: () => {
          window.location.hash = '#/builder';
          window.dispatchEvent(new PopStateEvent('popstate'));
          setCommandPaletteOpen(false);
        },
      },
      {
        id: 'nav-preview',
        label: 'Go to Live Preview',
        description: 'Switch to the Live Preview view',
        icon: <ArrowRight className="w-4 h-4" />,
        category: 'navigation',
        action: () => {
          window.location.hash = '#/live-preview';
          window.dispatchEvent(new PopStateEvent('popstate'));
          setCommandPaletteOpen(false);
        },
      },
      {
        id: 'nav-qa',
        label: 'Go to QA Sandbox',
        description: 'Open the Frontend QA sandbox page',
        icon: <Beaker className="w-4 h-4" />,
        category: 'navigation',
        action: () => {
          window.location.hash = '#/qa';
          window.dispatchEvent(new PopStateEvent('popstate'));
          setCommandPaletteOpen(false);
        },
      },

      // Panel
      {
        id: 'panel-left',
        label: 'Toggle left panel',
        description: 'Show or hide the sessions panel',
        icon: <PanelLeft className="w-4 h-4" />,
        category: 'panel',
        action: () => {
          toggleLeftPanel();
          setCommandPaletteOpen(false);
        },
      },
      {
        id: 'panel-right',
        label: 'Toggle right panel',
        description: 'Show or hide the context panel',
        icon: <PanelRight className="w-4 h-4" />,
        category: 'panel',
        action: () => {
          toggleRightPanel();
          setCommandPaletteOpen(false);
        },
      },
      {
        id: 'reset-layout',
        label: 'Reset layout',
        description: 'Restore default panel positions',
        icon: <RotateCcw className="w-4 h-4" />,
        category: 'panel',
        action: () => {
          resetLayout();
          setCommandPaletteOpen(false);
        },
      },

      // Appearance
      {
        id: 'appearance-system',
        label: 'Switch appearance: System',
        description: 'Use system preference for light/dark mode',
        icon: <Laptop className="w-4 h-4" />,
        category: 'appearance',
        action: () => {
          setAppearance('system' as AppearanceMode);
          setCommandPaletteOpen(false);
        },
      },
      {
        id: 'appearance-light',
        label: 'Switch appearance: Light',
        description: 'Use light mode',
        icon: <Sun className="w-4 h-4" />,
        category: 'appearance',
        action: () => {
          setAppearance('light' as AppearanceMode);
          setCommandPaletteOpen(false);
        },
      },
      {
        id: 'appearance-dark',
        label: 'Switch appearance: Dark',
        description: 'Use dark mode',
        icon: <Moon className="w-4 h-4" />,
        category: 'appearance',
        action: () => {
          setAppearance('dark' as AppearanceMode);
          setCommandPaletteOpen(false);
        },
      },

      // Context sections
      {
        id: 'context-referenced',
        label: 'Open context: Referenced files',
        description: 'View files referenced in the prompt context',
        icon: <FileText className="w-4 h-4" />,
        category: 'context',
        action: () => {
          setActiveContextSection('referenced' as ContextSection);
          setCommandPaletteOpen(false);
        },
      },
      {
        id: 'context-modified',
        label: 'Open context: Modified files',
        description: 'View uncommitted file modifications',
        icon: <FileCode className="w-4 h-4" />,
        category: 'context',
        action: () => {
          setActiveContextSection('modified' as ContextSection);
          setCommandPaletteOpen(false);
        },
      },
      {
        id: 'context-workspace',
        label: 'Open context: Workspace browser',
        description: 'Browse the workspace file tree',
        icon: <FolderTree className="w-4 h-4" />,
        category: 'context',
        action: () => {
          setActiveContextSection('workspace' as ContextSection);
          setCommandPaletteOpen(false);
        },
      },
      {
        id: 'context-todos',
        label: 'Open context: Todos',
        description: 'View the task checklist',
        icon: <CheckSquare className="w-4 h-4" />,
        category: 'context',
        action: () => {
          setActiveContextSection('todos' as ContextSection);
          setCommandPaletteOpen(false);
        },
      },
    ],
    [setCommandPaletteOpen, toggleLeftPanel, toggleRightPanel, resetLayout, setAppearance, setActiveContextSection],
  );

  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) return commands;
    const lower = searchQuery.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(lower) ||
        c.description.toLowerCase().includes(lower),
    );
  }, [searchQuery, commands]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % filteredCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[activeIndex]) {
            filteredCommands[activeIndex].action();
          }
          break;
        case 'Escape':
          e.preventDefault();
          setCommandPaletteOpen(false);
          break;
      }
    },
    [filteredCommands, activeIndex, setCommandPaletteOpen],
  );

  // Scroll active command into view (safe for test environments without scrollIntoView)
  useEffect(() => {
    if (listRef.current) {
      const activeItem = listRef.current.children[activeIndex] as HTMLElement;
      if (activeItem && typeof activeItem.scrollIntoView === 'function') {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  // Close on backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setCommandPaletteOpen(false);
      }
    },
    [setCommandPaletteOpen],
  );

  if (!commandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        ref={containerRef}
        className="w-full max-w-lg mx-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Search Input */}
        <div className="flex items-center gap-2 p-3 border-b border-slate-800">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
            aria-label="Search commands"
          />
          <kbd className="text-[10px] font-mono text-slate-500 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded">
            Esc
          </kbd>
        </div>

        {/* Command List */}
        {filteredCommands.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No commands match "{searchQuery}".
          </div>
        ) : (
          <div ref={listRef} className="max-h-72 overflow-y-auto p-1.5 space-y-0.5" role="listbox">
            {filteredCommands.map((cmd, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={cmd.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={cmd.action}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors focus-ring ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <span
                    className={`shrink-0 ${
                      isActive ? 'text-amber-400' : 'text-slate-500'
                    }`}
                  >
                    {cmd.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium leading-snug">{cmd.label}</div>
                    <div className="text-[10px] text-slate-500 truncate">{cmd.description}</div>
                  </div>
                  <span className="text-[9px] font-mono uppercase text-slate-600 shrink-0">
                    {cmd.category}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="p-2 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3" />
            <span>Frontend demo commands only</span>
          </span>
          <span>
            <kbd className="px-1 bg-slate-800 rounded">↑↓</kbd> Navigate{' '}
            <kbd className="px-1 bg-slate-800 rounded">↵</kbd> Select
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook to bind the Command palette keyboard shortcut (Cmd/Ctrl+K).
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useCommandPaletteShortcut = () => {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUiStore();
  useKeyboardShortcut(
    { key: 'k', modifiers: ['meta'], allowInInputs: false, preventDefault: true },
    () => setCommandPaletteOpen(!commandPaletteOpen),
  );
  useKeyboardShortcut(
    { key: 'Escape', allowInInputs: true, preventDefault: false },
    () => {
      if (commandPaletteOpen) setCommandPaletteOpen(false);
    },
  );
};
