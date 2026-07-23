import React from 'react';
import { Loader2, AlertCircle, RefreshCw, Inbox, WifiOff } from 'lucide-react';
import type { LoadableState } from '../contracts/presentation';

export interface LoadablePanelProps {
  state: LoadableState;
  onRetry?: () => void;
  loadingMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  errorMessage?: string;
  degradedWarning?: string;
  children: React.ReactNode;
}

export const LoadablePanel: React.FC<LoadablePanelProps> = ({
  state,
  onRetry,
  loadingMessage = 'Loading workspace state...',
  emptyTitle = 'No Items Available',
  emptyMessage = 'There is currently no data in this workspace view.',
  errorMessage = 'Failed to load panel state from runtime.',
  degradedWarning,
  children,
}) => {
  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[160px] space-y-3 text-slate-500 dark:text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        <span className="text-xs font-medium">{loadingMessage}</span>
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[160px] text-center space-y-2 text-slate-500 dark:text-slate-400">
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
          <Inbox className="w-6 h-6 text-slate-400" />
        </div>
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{emptyTitle}</h4>
        <p className="text-xs max-w-xs">{emptyMessage}</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[160px] text-center space-y-3 bg-red-500/5 border border-red-500/20 rounded-xl my-2">
        <div className="p-2.5 bg-red-500/10 rounded-full text-red-500">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">Unable to sync view</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs">{errorMessage}</p>
        </div>
        {onRetry ? (
          <button
            onClick={onRetry}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors focus-ring"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Connection
          </button>
        ) : (
          <span className="text-[11px] text-slate-400 italic">Deterministic mode: Retaining last known state</span>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {degradedWarning && (
        <div className="mb-3 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between text-xs text-amber-700 dark:text-amber-400">
          <div className="flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5" />
            <span>{degradedWarning}</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-500/20 rounded">DEMO MODE</span>
        </div>
      )}
      {children}
    </div>
  );
};
