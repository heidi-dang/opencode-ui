import React from 'react';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  XCircle,
  GitBranch,
} from 'lucide-react';
import { DemoSession, SessionStatus } from '../types/ui';

interface SessionListProps {
  sessions: DemoSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
}

const statusBadgeMap: Record<
  SessionStatus,
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  idle: {
    label: 'Idle',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    text: 'text-emerald-400',
    icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
  },
  busy: {
    label: 'Busy',
    bg: 'bg-amber-500/10 border-amber-500/20',
    text: 'text-amber-400',
    icon: <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />,
  },
  retrying: {
    label: 'Retrying',
    bg: 'bg-blue-500/10 border-blue-500/20',
    text: 'text-blue-400',
    icon: <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />,
  },
  attention: {
    label: 'Attention',
    bg: 'bg-orange-500/10 border-orange-500/20',
    text: 'text-orange-400',
    icon: <AlertTriangle className="w-3 h-3 text-orange-400" />,
  },
  error: {
    label: 'Error',
    bg: 'bg-red-500/10 border-red-500/20',
    text: 'text-red-400',
    icon: <XCircle className="w-3 h-3 text-red-400" />,
  },
};

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
}) => {
  if (sessions.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 text-xs">
        No sessions matched your filter.
      </div>
    );
  }

  return (
    <div className="space-y-1.5" role="listbox" aria-label="OpenCode Sessions">
      {sessions.map((session) => {
        const isActive = session.id === activeSessionId;
        const statusMeta = statusBadgeMap[session.status];

        return (
          <button
            key={session.id}
            type="button"
            onClick={() => onSelectSession(session.id)}
            role="option"
            aria-selected={isActive}
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
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border ${statusMeta.bg} ${statusMeta.text}`}
              >
                {statusMeta.icon}
                {statusMeta.label}
              </span>
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
