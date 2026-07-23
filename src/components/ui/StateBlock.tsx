import React from 'react';
import type { StatusVisual } from '../../contracts/presentation';

export interface StateBlockProps {
  visual: StatusVisual;
  /** Optional icon element */
  icon?: React.ReactNode;
  /** Optional detail text */
  detail?: string;
  size?: 'sm' | 'md';
  dotOnly?: boolean;
  className?: string;
}

export const StateBlock: React.FC<StateBlockProps> = ({
  visual,
  icon,
  detail,
  size = 'sm',
  dotOnly = false,
  className = '',
}) => {
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  if (dotOnly) {
    return (
      <span
        className={`inline-block ${dotSize} rounded-full ${visual.containerClass} ${className}`}
        title={visual.description ?? visual.label}
        aria-label={visual.label}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] leading-none ${visual.textClass} ${className}`}
      title={visual.description}
    >
      <span className={`${dotSize} rounded-full ${visual.containerClass}`} />
      {icon && <span>{icon}</span>}
      <span>{visual.label}</span>
      {detail && <span className="text-slate-500">· {detail}</span>}
    </span>
  );
};
