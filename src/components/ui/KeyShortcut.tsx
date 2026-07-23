import React from 'react';

export interface KeyShortcutProps {
  keys: string[];
  separator?: string;
  className?: string;
}

export const KeyShortcut: React.FC<KeyShortcutProps> = ({
  keys,
  separator = '',
  className = '',
}) => {
  return (
    <kbd
      className={`inline-flex items-center gap-0.5 font-mono text-[10px] text-slate-400 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded ${className}`}
    >
      {keys.map((key, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-slate-600">{separator}</span>}
          <span>{key}</span>
        </React.Fragment>
      ))}
    </kbd>
  );
};
