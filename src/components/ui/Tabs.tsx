import React from 'react';

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface TabsProps<T extends string> {
  items: TabItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
  className?: string;
}

export function Tabs<T extends string>({
  items,
  activeId,
  onChange,
  className = '',
}: TabsProps<T>) {
  return (
    <div
      className={`p-2 bg-slate-900/60 border-b border-slate-800/80 grid grid-cols-2 gap-1 sm:grid-cols-4 ${className}`}
      role="tablist"
    >
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all focus-ring ${
              isActive
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            <span className="truncate">{item.label}</span>
            {item.count !== undefined && (
              <span className="text-[10px] font-mono text-slate-500">
                ({item.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
