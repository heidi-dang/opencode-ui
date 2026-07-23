import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Code2, MonitorPlay, Beaker } from 'lucide-react';

export const PrimaryNavigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) =>
    path === '/builder'
      ? location.pathname === '/' || location.pathname === '/builder'
      : location.pathname === path;

  const linkClass = ({ isActive: active }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all focus-ring ${
      active
        ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs border border-slate-200 dark:border-slate-700 font-semibold'
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
    }`;

  return (
    <nav className="flex items-center space-x-1 bg-slate-200/60 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-300/50 dark:border-slate-800">
      <NavLink
        to="/builder"
        className={linkClass}
        aria-current={isActive('/builder') ? 'page' : undefined}
      >
        <Code2 className="w-3.5 h-3.5" />
        <span>Builder</span>
      </NavLink>

      <NavLink
        to="/live-preview"
        className={linkClass}
        aria-current={isActive('/live-preview') ? 'page' : undefined}
      >
        <MonitorPlay className="w-3.5 h-3.5" />
        <span>Live Preview</span>
        <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full font-mono border border-amber-500/20">
          Phase 9
        </span>
      </NavLink>

      <NavLink
        to="/qa"
        className={linkClass}
        aria-current={isActive('/qa') ? 'page' : undefined}
      >
        <Beaker className="w-3.5 h-3.5" />
        <span>QA</span>
        <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-mono border border-emerald-500/20">
          Demo
        </span>
      </NavLink>
    </nav>
  );
};
