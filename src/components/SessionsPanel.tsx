import React, { useState, useMemo } from 'react';
import { Plus, SlidersHorizontal, Layers } from 'lucide-react';
import { SessionSearch } from './SessionSearch';
import { SessionList } from './SessionList';
import { DEMO_SESSIONS } from '../mocks/frontendDemoData';
import { Badge } from './ui';

export const SessionsPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSessionId, setActiveSessionId] = useState(DEMO_SESSIONS[0].id);

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return DEMO_SESSIONS;
    const lower = searchQuery.toLowerCase();
    return DEMO_SESSIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(lower) ||
        s.lastMessage.toLowerCase().includes(lower) ||
        s.branch.toLowerCase().includes(lower)
    );
  }, [searchQuery]);

  return (
    <aside className="h-full flex flex-col bg-slate-950 text-slate-200 border-r border-slate-800/80 w-full select-none">
      {/* Panel Header */}
      <div className="p-3 border-b border-slate-800/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Sessions
            </h3>
          </div>
          <Badge>{filteredSessions.length} total</Badge>
        </div>

        {/* New Session Button (Disabled with clear explanation) */}
        <button
          type="button"
          disabled
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-500/60 cursor-not-allowed"
          title="Session creation requires OpenCode Gateway connected in Phase 2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Session (Gateway Offline)</span>
        </button>

        {/* Search */}
        <SessionSearch query={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Session List Scroll Area */}
      <div className="flex-1 overflow-y-auto p-2.5">
        <SessionList
          sessions={filteredSessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
        />
      </div>

      {/* Demo Mode Footer */}
      <div className="p-2.5 border-t border-slate-800/80 bg-slate-900/40 text-[10px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1 font-mono">
          <SlidersHorizontal className="w-3 h-3 text-slate-400" />
          Demo Mode (Phase 1A)
        </span>
        <span className="text-slate-400 font-mono">Local State</span>
      </div>
    </aside>
  );
};
