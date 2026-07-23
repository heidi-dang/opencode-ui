import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Terminal } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-950 text-slate-100 text-center select-none space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <span className="text-xs font-mono text-red-400 font-semibold uppercase tracking-wider">
          404 Not Found
        </span>
        <h1 className="text-xl font-bold text-slate-100">Requested Workspace Route Does Not Exist</h1>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          The path you attempted to access is not registered in the OpenCode Web UI Router.
        </p>
      </div>

      <Link
        to="/builder"
        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all shadow-xs focus-ring"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to OpenCode Builder</span>
      </Link>
    </div>
  );
};
