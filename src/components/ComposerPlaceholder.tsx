import React, { useState } from 'react';
import {
  Send,
  Square,
  AtSign,
  Hash,
  Slash,
  Cpu,
  Paperclip,
  Info,
} from 'lucide-react';

export const ComposerPlaceholder: React.FC = () => {
  const [text, setText] = useState('');
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  const handleSendClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setDemoNotice('Send action disabled in Phase 1A shell (Gateway disconnected).');
    setTimeout(() => setDemoNotice(null), 3000);
  };

  const insertMention = (char: string) => {
    setText((prev) => `${prev}${char}`);
  };

  return (
    <div className="p-3 bg-slate-900/95 dark:bg-slate-950/95 border-t border-slate-800 rounded-b-2xl">
      {/* Notice Banner */}
      {demoNotice && (
        <div className="mb-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-1.5 text-xs text-amber-400">
          <Info className="w-4 h-4 shrink-0" />
          <span>{demoNotice}</span>
        </div>
      )}

      <form onSubmit={handleSendClick} className="space-y-2">
        {/* Main Text Area */}
        <div className="relative rounded-xl bg-slate-950 border border-slate-800 focus-within:border-amber-500/60 focus-within:ring-1 focus-within:ring-amber-500/30 transition-all p-2.5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message, @file, #agent, or /command... (Cmd+Enter to send)"
            rows={3}
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-400 resize-none focus:outline-none"
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                handleSendClick(e);
              }
            }}
          />

          {/* Action Tools Bar */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
            {/* Left Tools */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => insertMention('@')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors focus-ring"
                title="Mention file (@)"
                aria-label="Mention file"
              >
                <AtSign className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => insertMention('#')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors focus-ring"
                title="Mention agent (#)"
                aria-label="Mention agent"
              >
                <Hash className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => insertMention('/')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors focus-ring"
                title="Slash command (/)"
                aria-label="Slash command"
              >
                <Slash className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                disabled
                className="p-1.5 rounded-lg text-slate-600 cursor-not-allowed"
                title="File attach (Requires OpenCode gateway)"
                aria-label="Attach file"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>

              <span className="h-4 w-px bg-slate-800 mx-1" />

              {/* Model Badge */}
              <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono">
                <Cpu className="w-3 h-3 text-purple-400" />
                <span>Gemini 2.5 Pro</span>
              </div>
            </div>

            {/* Right Buttons: Stop & Send */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                Cmd + Enter
              </span>

              {/* Stop Button Location */}
              <button
                type="button"
                disabled
                className="p-1.5 rounded-lg text-slate-600 bg-slate-900 border border-slate-800 cursor-not-allowed"
                title="Stop execution (Inactive in Phase 1A)"
                aria-label="Stop generation"
              >
                <Square className="w-3.5 h-3.5" />
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!text.trim()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus-ring ${
                  text.trim()
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                title="Gateway offline in Phase 1A"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
