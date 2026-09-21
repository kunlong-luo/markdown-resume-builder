import React, { useState } from 'react';
import { X } from 'lucide-react';

export interface CustomInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'tactile' | 'ghost' | 'underline';
  error?: string;
  className?: string;
  containerClassName?: string;
}

const SIZE_STYLES = {
  xs: 'py-1 text-xs px-2.5 h-7',
  sm: 'py-1.5 text-xs px-3 h-8',
  md: 'py-2 text-sm px-3.5 h-9',
  lg: 'py-2.5 text-base px-4 h-11',
};

const PADDING_WITH_LEFT_ICON = {
  xs: 'pl-7',
  sm: 'pl-8',
  md: 'pl-9',
  lg: 'pl-11',
};

const PADDING_WITH_RIGHT_ICON = {
  xs: 'pr-7',
  sm: 'pr-8',
  md: 'pr-9',
  lg: 'pr-11',
};

export const CustomInput: React.FC<CustomInputProps> = ({
  id,
  value,
  onChange,
  type = 'text',
  placeholder,
  leftIcon,
  rightIcon,
  clearable = false,
  size = 'md',
  variant = 'tactile',
  error,
  disabled = false,
  className = '',
  containerClassName = '',
  autoFocus,
  readOnly,
  onKeyDown,
  onFocus,
  onBlur,
  ...restProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  const getVariantStyles = () => {
    if (variant === 'tactile') {
      return `
        bg-white dark:bg-slate-800/90 border rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
        ${
          error
            ? 'border-rose-400 dark:border-rose-500 focus:ring-2 focus:ring-rose-400/30'
            : isFocused
            ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20 dark:ring-indigo-400/20 shadow-sm'
            : 'border-slate-200/90 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.03)]'
        }
      `;
    }
    if (variant === 'ghost') {
      return `
        bg-slate-50/70 dark:bg-slate-800/50 border border-transparent rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
        ${
          error
            ? 'border-rose-400 dark:border-rose-500 focus:bg-white dark:focus:bg-slate-800'
            : isFocused
            ? 'bg-white dark:bg-slate-800 border-indigo-500 dark:border-indigo-400 ring-1 ring-indigo-500/30'
            : 'hover:bg-slate-100/70 dark:hover:bg-slate-750'
        }
      `;
    }
    return 'border-b border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-800 dark:text-slate-100';
  };

  return (
    <div className={`relative flex flex-col ${containerClassName}`}>
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div
            className={`
              absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center transition-colors
              ${isFocused ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}
            `}
          >
            {leftIcon}
          </div>
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          readOnly={readOnly}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onKeyDown={onKeyDown}
          className={`
            w-full transition-all duration-150 outline-none font-medium
            ${SIZE_STYLES[size]}
            ${leftIcon ? PADDING_WITH_LEFT_ICON[size] : ''}
            ${rightIcon || (clearable && value && !disabled) ? PADDING_WITH_RIGHT_ICON[size] : ''}
            ${getVariantStyles()}
            ${disabled ? 'bg-slate-100/70 dark:bg-slate-800/50 cursor-not-allowed opacity-60 text-slate-400 dark:text-slate-600' : ''}
            ${className}
          `}
          {...restProps}
        />

        {clearable && value && !disabled && !rightIcon && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-300 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {rightIcon && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 dark:text-slate-500 pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>

      {error && <span className="text-[11px] text-rose-500 dark:text-rose-400 mt-1 font-medium">{error}</span>}
    </div>
  );
};
