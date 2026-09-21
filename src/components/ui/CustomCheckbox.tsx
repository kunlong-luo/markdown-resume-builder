import React from 'react';
import { Check, Minus } from 'lucide-react';

export interface CustomCheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  colorTheme?: 'indigo' | 'blue' | 'emerald' | 'rose' | 'slate';
}

const COLOR_MAP = {
  indigo: {
    checked: 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200/50',
    ring: 'focus-visible:ring-indigo-500/30',
  },
  blue: {
    checked: 'bg-blue-600 border-blue-600 text-white shadow-blue-200/50',
    ring: 'focus-visible:ring-blue-500/30',
  },
  emerald: {
    checked: 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-200/50',
    ring: 'focus-visible:ring-emerald-500/30',
  },
  rose: {
    checked: 'bg-rose-600 border-rose-600 text-white shadow-rose-200/50',
    ring: 'focus-visible:ring-rose-500/30',
  },
  slate: {
    checked: 'bg-slate-800 border-slate-800 text-white shadow-slate-200/50',
    ring: 'focus-visible:ring-slate-500/30',
  },
};

const SIZE_MAP = {
  sm: {
    box: 'w-3.5 h-3.5 rounded',
    icon: 'w-2.5 h-2.5 stroke-[3]',
    text: 'text-xs',
  },
  md: {
    box: 'w-4 h-4 rounded-[5px]',
    icon: 'w-3 h-3 stroke-[3]',
    text: 'text-sm',
  },
  lg: {
    box: 'w-5 h-5 rounded-md',
    icon: 'w-3.5 h-3.5 stroke-[3]',
    text: 'text-base',
  },
};

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  id,
  checked,
  onChange,
  indeterminate = false,
  disabled = false,
  label,
  description,
  size = 'md',
  className = '',
  colorTheme = 'indigo',
}) => {
  const styles = COLOR_MAP[colorTheme];
  const sizeStyles = SIZE_MAP[size];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <label
      id={id}
      onClick={handleClick}
      className={`
        inline-flex items-start gap-2.5 select-none transition-all group
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${className}
      `}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        aria-disabled={disabled}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        className={`
          relative flex items-center justify-center shrink-0 mt-0.5
          border transition-all duration-150 outline-none
          shadow-sm
          ${sizeStyles.box}
          ${
            checked || indeterminate
              ? styles.checked
              : 'bg-white border-slate-300 group-hover:border-slate-400 group-hover:bg-slate-50/50'
          }
          focus-visible:ring-2 ${styles.ring}
        `}
      >
        {indeterminate ? (
          <Minus className={`${sizeStyles.icon} text-white animate-in zoom-in-75 duration-150`} />
        ) : checked ? (
          <Check className={`${sizeStyles.icon} text-white animate-in zoom-in-75 duration-150`} />
        ) : null}
      </button>

      {(label || description) && (
        <div className="flex flex-col select-none">
          {label && (
            <span
              className={`font-medium text-slate-700 leading-tight group-hover:text-slate-900 transition-colors ${sizeStyles.text}`}
            >
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-400 mt-0.5 leading-normal">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
};
