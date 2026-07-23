import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Code2, MonitorPlay } from 'lucide-react';

export const PrimaryNavigation: React.FC = () => {
  const location = useLocation();

  const isBuilderActive = location.pathname === '/' || location.pathname === '/builder';
  const isPreviewActive = location.pathname === '/live-preview';

  return (
    <nav className="flex items-center space-x-1 bg-slate-200/60 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-300/50 dark:border-slate-800">
      <NavLink
        to="/builder"
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all focus-ring ${
            isActive
              ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs border border-slate-200 dark:border-slate-700 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
          }`
        }
        aria-current={isBuilderActive ? 'page' : undefined}
      >
        <Code2 className="w-3.5 h-3.5" />
        <span>Builder</span>
      </NavLink>

      <NavLink
        to="/live-preview"
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all focus-ring ${
            isActive
              ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs border border-slate-200 dark:border-slate-700 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
          }`
        }
        aria-current={isPreviewActive ? 'page' : undefined}
      >
        <MonitorPlay className="w-3.5 h-3.5" />
        <span>Live Preview</span>
        <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full font-mono border border-amber-500/20">
          Phase 9
        </span>
      </NavLink>
    </nav>
  );
};
