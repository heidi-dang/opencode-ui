import React from 'react';

export interface SegmentedOption<T extends string> {
  id: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`inline-flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 ${className}`}
      role="radiogroup"
    >
      {options.map((opt) => {
        const isActive = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(opt.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all focus-ring ${
              isActive
                ? 'bg-amber-500/20 text-amber-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
