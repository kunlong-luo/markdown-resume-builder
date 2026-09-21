import React from 'react';
import { THEME_TOKENS } from '../../lib/theme-tokens';

export interface CustomSwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  colorTheme?: 'indigo' | 'blue' | 'emerald' | 'rose' | 'slate';
}

const SIZE_MAP = {
  sm: {
    track: 'w-7 h-4',
    thumb: 'w-3 h-3',
    translate: 'translate-x-3',
    text: 'text-xs',
  },
  md: {
    track: 'w-9 h-5',
    thumb: 'w-3.5 h-3.5',
    translate: 'translate-x-4',
    text: 'text-sm',
  },
  lg: {
    track: 'w-11 h-6',
    thumb: 'w-4.5 h-4.5',
    translate: 'translate-x-5',
    text: 'text-base',
  },
};

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
  id,
  checked,
  onChange,
  disabled = false,
  label,
  description,
  size = 'md',
  className = '',
  colorTheme = 'indigo',
}) => {
  const accent = THEME_TOKENS.themeAccents[colorTheme] || THEME_TOKENS.themeAccents.indigo;
  const sizeConfig = SIZE_MAP[size];

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
        inline-flex items-center gap-2.5 select-none transition-all group
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${className}
      `}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        className={`
          relative inline-flex items-center shrink-0 rounded-full p-0.5
          transition-colors duration-200 ease-in-out outline-none
          focus-visible:ring-2
          ${sizeConfig.track}
          ${
            checked
              ? accent.track
              : 'bg-slate-200 dark:bg-slate-700 group-hover:bg-slate-300 dark:group-hover:bg-slate-600'
          }
        `}
      >
        <span
          className={`
            pointer-events-none inline-block rounded-full bg-white dark:bg-slate-100 shadow-sm ring-0
            transform transition duration-200 ease-in-out
            ${sizeConfig.thumb}
            ${checked ? sizeConfig.translate : 'translate-x-0.5'}
          `}
        />
      </button>

      {(label || description) && (
        <div className="flex flex-col select-none">
          {label && (
            <span
              className={`font-medium text-slate-700 dark:text-slate-200 leading-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors ${sizeConfig.text}`}
            >
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-normal">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
};
