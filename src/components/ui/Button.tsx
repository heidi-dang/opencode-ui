import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs font-semibold',
  secondary:
    'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium',
  danger:
    'bg-red-600 hover:bg-red-700 text-white font-medium',
  ghost:
    'bg-transparent hover:bg-slate-800 text-slate-300 font-medium',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-2.5 py-1 text-xs rounded-lg',
  md: 'px-3.5 py-1.5 text-xs rounded-xl',
  lg: 'px-4 py-2 text-sm rounded-xl',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 transition-all focus-ring ${
        variantClasses[variant]
      } ${sizeClasses[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
