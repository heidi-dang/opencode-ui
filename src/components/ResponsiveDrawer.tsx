import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface ResponsiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  side?: 'left' | 'right';
  'aria-expanded'?: boolean;
  children: React.ReactNode;
}

export const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = ({
  isOpen,
  onClose,
  title,
  side = 'left',
  children,
  ...props
}) => {
  const drawerContainerRef = useRef<HTMLDivElement>(null);

  // Trap focus inside the drawer when open
  useFocusTrap(isOpen, drawerContainerRef);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        ref={drawerContainerRef}
        className={`relative z-10 w-4/5 max-w-sm bg-slate-900 text-slate-100 h-full flex flex-col shadow-2xl transition-transform duration-200 ${
          side === 'right' ? 'ml-auto border-l border-slate-800' : 'mr-auto border-r border-slate-800'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        {...props}
      >
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wide text-slate-200">{title}</h3>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus-ring"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
};
