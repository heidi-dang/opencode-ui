import React, { useState } from 'react';
import {
  User,
  Bot,
  Copy,
  Check,
  Terminal,
  Coins,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { DEMO_MESSAGES } from '../mocks/frontendDemoData';

export const MessageFeed: React.FC = () => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="space-y-4 pr-1">
      {DEMO_MESSAGES.map((msg) => (
        <article
          key={msg.id}
          className={`p-4 rounded-2xl border transition-colors ${
            msg.role === 'user'
              ? 'bg-amber-500/5 border-amber-500/20 ml-4 sm:ml-12'
              : 'bg-slate-900/80 dark:bg-slate-900/90 border-slate-800 mr-4 sm:mr-8 shadow-xs'
          }`}
        >
          {/* Author Header */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  msg.role === 'user'
                    ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs font-bold text-slate-200">{msg.author}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">{msg.timestamp}</span>
          </div>

          {/* Content */}
          <div className="text-xs text-slate-300 space-y-2 whitespace-pre-wrap leading-relaxed select-text">
            {msg.content}
          </div>

          {/* Code Blocks */}
          {msg.codeBlocks && msg.codeBlocks.length > 0 && (
            <div className="mt-3 space-y-2">
              {msg.codeBlocks.map((block, idx) => {
                const codeId = `${msg.id}-code-${idx}`;
                const isCopied = copiedCodeId === codeId;

                return (
                  <div
                    key={codeId}
                    className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden font-mono text-xs"
                  >
                    <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400">
                      <span className="text-[11px] font-semibold text-slate-300">
                        {block.filename}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(block.code, codeId)}
                        className="flex items-center gap-1 text-[10px] hover:text-slate-100 px-1.5 py-0.5 rounded bg-slate-800/80 transition-colors focus-ring"
                        aria-label="Copy code block"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 text-[11px] text-slate-200 overflow-x-auto leading-normal">
                      <code>{block.code}</code>
                    </pre>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tool Activity Card */}
          {msg.toolActivity && (
            <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-semibold text-slate-300">{msg.toolActivity.toolName}</span>
                <span className="text-[11px] text-slate-400">{msg.toolActivity.action}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {msg.toolActivity.status === 'success' && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> Success
                  </span>
                )}
                {msg.toolActivity.status === 'running' && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-400 font-mono">
                    <Loader2 className="w-3 h-3 animate-spin" /> Running
                  </span>
                )}
                {msg.toolActivity.status === 'error' && (
                  <span className="flex items-center gap-1 text-[10px] text-red-400 font-mono">
                    <AlertCircle className="w-3 h-3" /> Failed
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Metadata Footer */}
          {(msg.tokensUsed || msg.costEstimate) && (
            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-end gap-3 text-[10px] font-mono text-slate-500">
              {msg.tokensUsed && (
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-purple-400" />
                  {msg.tokensUsed} tokens
                </span>
              )}
              {msg.costEstimate && (
                <span className="flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-400" />
                  {msg.costEstimate} est.
                </span>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  );
};
