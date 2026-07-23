import React from 'react';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 border-b border-slate-800/80 bg-slate-950/60 ${className}`}
    >
      <div className="min-w-0">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 truncate">
          {title}
        </h4>
        {subtitle && (
          <p className="text-[10px] text-slate-500 truncate mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 ml-2">{action}</div>}
    </div>
  );
};
