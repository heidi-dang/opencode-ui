import React, { useState } from 'react';
import { Button } from './Button';

export interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  showLineNumbers = false,
  maxHeight = '400px',
  className = '',
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback for secure contexts
    }
  };

  const lines = code.split('\n');
  const displayLines = collapsed ? lines.slice(0, 10) : lines;
  const isCollapsible = lines.length > 10;

  return (
    <div className={`relative group ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-700/40 text-[10px] text-slate-400 font-mono">
        <span>{language ?? 'text'}</span>
        <div className="flex items-center gap-1">
          {isCollapsible && (
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="hover:text-slate-200 transition-colors focus-ring"
              aria-label={collapsed ? 'Expand code' : 'Collapse code'}
            >
              {collapsed ? '…expand' : 'collapse'}
            </button>
          )}
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>

      {/* Code body */}
      <div
        className="overflow-auto bg-slate-950 p-3 font-mono text-xs leading-relaxed text-slate-300"
        style={{ maxHeight }}
      >
        <pre className="whitespace-pre-wrap break-all">
          {displayLines.map((line, idx) => (
            <React.Fragment key={idx}>
              {showLineNumbers && (
                <span className="text-slate-600 select-none mr-3 inline-block w-6 text-right">
                  {idx + 1}
                </span>
              )}
              {line}
              {'\n'}
            </React.Fragment>
          ))}
          {collapsed && lines.length > 10 && (
            <span className="text-slate-500 italic">
              … {lines.length - 10} more lines
            </span>
          )}
        </pre>
      </div>
    </div>
  );
};
