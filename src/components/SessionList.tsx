import React, { useCallback, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  XCircle,
  GitBranch,
} from 'lucide-react';
import type { DemoSession, SessionStatus } from '../types/ui';
import { SESSION_STATUS_VISUALS } from '../contracts/presentation';
import { Badge } from './ui';

interface SessionListProps {
  sessions: DemoSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
}

const statusBadgeMap: Record<
  SessionStatus,
  { variant: 'success' | 'warning' | 'danger' | 'info' | 'default'; icon: React.ReactNode }
> = {
  idle: {
    variant: 'success',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  busy: {
    variant: 'warning',
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
  },
  retrying: {
    variant: 'info',
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
  },
  attention: {
    variant: 'warning',
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  error: {
    variant: 'danger',
    icon: <XCircle className="w-3 h-3" />,
  },
};

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll active session into view (safe for test environments without scrollIntoView)
  useEffect(() => {
    if (activeButtonRef.current && typeof activeButtonRef.current.scrollIntoView === 'function') {
      activeButtonRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeSessionId, sessions]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIdx = sessions.findIndex((s) => s.id === activeSessionId);
      if (currentIdx === -1) return;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const nextIdx = (currentIdx + 1) % sessions.length;
          onSelectSession(sessions[nextIdx].id);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prevIdx = (currentIdx - 1 + sessions.length) % sessions.length;
          onSelectSession(sessions[prevIdx].id);
          break;
        }
      }
    },
    [sessions, activeSessionId, onSelectSession],
  );

  if (sessions.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 text-xs">
        No sessions matched your filter.
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      className="space-y-1.5"
      role="listbox"
      aria-label="OpenCode Sessions"
      onKeyDown={handleKeyDown}
    >
      {sessions.map((session) => {
        const isActive = session.id === activeSessionId;
        const statusMeta = statusBadgeMap[session.status];

        return (
          <button
            key={session.id}
            ref={isActive ? activeButtonRef : undefined}
            type="button"
            onClick={() => onSelectSession(session.id)}
            role="option"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            className={`w-full text-left p-2.5 rounded-xl border transition-all focus-ring ${
              isActive
                ? 'bg-amber-500/10 border-amber-500/40 text-slate-100 shadow-xs'
                : 'bg-slate-900/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-1.5 mb-1">
              <h4 className="text-xs font-semibold line-clamp-1 flex-1 leading-snug">
                {session.title}
              </h4>
              <Badge variant={statusMeta.variant}>
                {statusMeta.icon}
                {SESSION_STATUS_VISUALS[session.status].label}
              </Badge>
            </div>

            <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
              {session.lastMessage}
            </p>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3 text-slate-400" />
                {session.branch}
              </span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-0.5">
                  <MessageSquare className="w-3 h-3" />
                  {session.messageCount}
                </span>
                <span className="flex items-center gap-0.5">
                  <Clock className="w-3 h-3" />
                  {session.updatedAt}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
