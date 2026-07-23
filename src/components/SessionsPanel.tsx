import React, { useState, useMemo } from 'react';
import { Plus, SlidersHorizontal, Layers, X, ArrowUpDown } from 'lucide-react';
import { SessionSearch } from './SessionSearch';
import { SessionList } from './SessionList';
import { DEMO_SESSIONS } from '../mocks/frontendDemoData';
import { Badge } from './ui';
import { SESSION_STATUS_VISUALS } from '../contracts/presentation';
import type { SessionStatus } from '../contracts/presentation';

type SortMode = 'recent' | 'status' | 'name';

const STATUS_ORDER: SessionStatus[] = ['attention', 'error', 'busy', 'retrying', 'idle'];

export const SessionsPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSessionId, setActiveSessionId] = useState(DEMO_SESSIONS[0].id);
  const [statusFilter, setStatusFilter] = useState<SessionStatus | 'all'>('all');
  const [sortMode, setSortMode] = useState<SortMode>('recent');

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: DEMO_SESSIONS.length };
    for (const s of DEMO_SESSIONS) {
      counts[s.status] = (counts[s.status] || 0) + 1;
    }
    return counts;
  }, []);

  const filteredAndSortedSessions = useMemo(() => {
    let result = [...DEMO_SESSIONS];

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((s) => s.status === statusFilter);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(lower) ||
          s.lastMessage.toLowerCase().includes(lower) ||
          s.branch.toLowerCase().includes(lower)
      );
    }

    // Sort
    switch (sortMode) {
      case 'recent':
        // Simple sort: "mins ago" < "hours ago" < "Yesterday"
        result.sort((a, b) => {
          const aVal = timeAgoValue(a.updatedAt);
          const bVal = timeAgoValue(b.updatedAt);
          return aVal - bVal;
        });
        break;
      case 'status':
        result.sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [searchQuery, statusFilter, sortMode]);

  const hasActiveFilters = statusFilter !== 'all' || searchQuery.trim() !== '';

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortMode('recent');
  };

  return (
    <aside className="h-full flex flex-col bg-slate-950 text-slate-200 border-r border-slate-800/80 w-full select-none min-w-0">
      {/* Panel Header */}
      <div className="p-3 border-b border-slate-800/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Sessions
            </h3>
          </div>
          <Badge>{filteredAndSortedSessions.length} total</Badge>
        </div>

        {/* New Session Button (Disabled with clear explanation) */}
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-500/60 cursor-not-allowed"
          title="Session creation requires OpenCode Gateway connected in Phase 2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Session (Gateway Offline)</span>
        </button>

        {/* Search */}
        <SessionSearch query={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Status Filter Chips */}
      <div className="px-2.5 py-1.5 border-b border-slate-800/60 flex flex-wrap items-center gap-1">
        {(['all', ...STATUS_ORDER] as const).map((status) => {
          const isActive = statusFilter === status;
          const count = statusCounts[status] ?? 0;
          if (count === 0 && status !== 'all') return null;

          return (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all focus-ring ${
                isActive
                  ? status === 'all'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : `${SESSION_STATUS_VISUALS[status].containerClass} ${SESSION_STATUS_VISUALS[status].textClass} border`
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:bg-slate-800/80'
              }`}
              aria-pressed={isActive}
            >
              {status === 'all' ? 'All' : SESSION_STATUS_VISUALS[status].label}
              <span className="font-mono opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Sort Controls + Clear */}
      <div className="px-2.5 py-1.5 border-b border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <ArrowUpDown className="w-3 h-3 text-slate-500" />
          {(['recent', 'status', 'name'] as SortMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setSortMode(mode)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-all focus-ring ${
                sortMode === mode
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              aria-pressed={sortMode === mode}
              aria-label={`Sort by ${mode}`}
            >
              {mode === 'recent' ? 'Recent' : mode === 'status' ? 'Status' : 'Name'}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors focus-ring"
            aria-label="Clear all filters"
          >
            <X className="w-2.5 h-2.5" />
            Clear
          </button>
        )}
      </div>

      {/* Session List Scroll Area */}
      <div className="flex-1 overflow-y-auto p-2.5">
        <SessionList
          sessions={filteredAndSortedSessions}
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

/** Rough heuristic to sort "time ago" strings by recency. */
function timeAgoValue(label: string): number {
  if (label.includes('min')) return 1;
  if (label.includes('hour')) return 2;
  if (label.includes('Yesterday')) return 3;
  if (label.includes('day')) return 4;
  return 5;
}
