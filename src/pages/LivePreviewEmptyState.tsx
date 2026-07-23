import React, { useState } from 'react';
import {
  MonitorPlay,
  Play,
  Monitor,
  Tablet,
  Smartphone,
  Terminal,
  ShieldAlert,
  Info,
} from 'lucide-react';

export const LivePreviewEmptyState: React.FC = () => {
  const [activeViewport, setActiveViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 sm:p-6 select-none">
      {/* Top Controls Bar Placeholder */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl mb-6 flex flex-wrap items-center justify-between gap-3">
        {/* Viewport Selectors */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveViewport('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors focus-ring ${
              activeViewport === 'desktop'
                ? 'bg-slate-800 text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveViewport('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors focus-ring ${
              activeViewport === 'tablet'
                ? 'bg-slate-800 text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveViewport('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors focus-ring ${
              activeViewport === 'mobile'
                ? 'bg-slate-800 text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Start Preview Button (Disabled intentionally for Phase 1A) */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-amber-400/80 font-mono hidden sm:inline">
            Runtime Supervisor: Offline
          </span>
          <button
            type="button"
            disabled
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-xl bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-75"
            title="Preview supervisor will be implemented in Phase 9"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Start Preview (Disabled)</span>
          </button>
        </div>
      </div>

      {/* Main Empty State Banner */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-3xl bg-slate-900/30 max-w-2xl mx-auto w-full my-auto space-y-4">
        {/* CSS Visual Icon Illustration */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-purple-500/10 to-blue-500/20 border border-amber-500/30 flex items-center justify-center shadow-2xl">
            <MonitorPlay className="w-10 h-10 text-amber-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-900 border border-amber-500/40 text-amber-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h2 className="text-lg font-extrabold text-slate-100 tracking-tight">
            Preview runtime not connected
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            The local application preview supervisor and WebContainer integration will be initialized in{' '}
            <strong className="text-amber-400">Phase 9</strong>. No live process or iframe server is running in this Phase 1A frontend shell slice.
          </p>
        </div>

        {/* Informational Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Phase 1A Boundary</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Strictly provides the responsive web shell and top toolbar navigation state without connecting external ports.
            </p>
          </div>

          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Upcoming Runtime</span>
            </div>
            <p className="text-[11px] text-slate-400">
              In Phase 9, hot reloading, dev server stdout streams, and interactive viewport emulation will be linked.
            </p>
          </div>
        </div>
      </div>

      {/* Preview Logs Placeholder */}
      <div className="mt-6 p-3 bg-slate-950 border border-slate-800 rounded-2xl">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800 mb-2">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-amber-500" />
            Runtime Logs Placeholder
          </span>
          <span className="text-[10px] text-slate-500">0 log lines</span>
        </div>
        <div className="text-[11px] font-mono text-slate-600 italic py-2 text-center">
          [System] Runtime logging stream offline. Supervisor initialization scheduled for Phase 9.
        </div>
      </div>
    </div>
  );
};
