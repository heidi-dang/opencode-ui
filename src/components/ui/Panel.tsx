import React from 'react';

export interface PanelProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export const Panel: React.FC<PanelProps> = ({
  children,
  title,
  subtitle,
  badge,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
}) => {
  return (
    <div
      className={`h-full flex flex-col bg-slate-950 text-slate-200 border-l border-slate-800/80 w-full select-none ${className}`}
    >
      {/* Header */}
      {(title || badge) && (
        <div
          className={`p-3 border-b border-slate-800/80 flex items-center justify-between ${headerClassName}`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {title && (
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <span className="text-[10px] text-slate-500 font-mono truncate">
                {subtitle}
              </span>
            )}
          </div>
          {badge && <div className="shrink-0 ml-2">{badge}</div>}
        </div>
      )}

      {/* Body */}
      <div className={`flex-1 overflow-y-auto ${bodyClassName}`}>{children}</div>

      {/* Footer */}
      {footer && (
        <div className="p-2.5 border-t border-slate-800/80 bg-slate-900/40 text-[10px] text-slate-400">
          {footer}
        </div>
      )}
    </div>
  );
};
