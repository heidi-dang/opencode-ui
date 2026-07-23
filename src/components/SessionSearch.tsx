import React from 'react';
import { Search, X } from 'lucide-react';

interface SessionSearchProps {
  query: string;
  onChange: (value: string) => void;
}

export const SessionSearch: React.FC<SessionSearchProps> = ({ query, onChange }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-3.5 h-3.5" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Filter sessions..."
        className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-900/60 dark:bg-slate-950/80 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-400 focus-ring"
      />
      {query && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-200"
          aria-label="Clear search filter"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
