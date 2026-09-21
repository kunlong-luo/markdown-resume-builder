import React, { useState } from 'react';

export interface CustomTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  containerClassName?: string;
}

export const CustomTextarea: React.FC<CustomTextareaProps> = ({
  id,
  value,
  onChange,
  placeholder,
  disabled = false,
  rows = 3,
  error,
  className = '',
  containerClassName = '',
  onFocus,
  onBlur,
  ...restProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative flex flex-col ${containerClassName}`}>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        className={`
          w-full px-3 py-2 text-sm bg-white dark:bg-slate-800/90 border rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
          transition-all duration-150 outline-none resize-y font-normal leading-relaxed
          ${
            error
              ? 'border-rose-400 dark:border-rose-500 focus:ring-2 focus:ring-rose-400/30'
              : isFocused
              ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20 dark:ring-indigo-400/20 shadow-sm'
              : 'border-slate-200/90 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.03)]'
          }
          ${disabled ? 'bg-slate-100/70 dark:bg-slate-800/50 cursor-not-allowed opacity-60 text-slate-400 dark:text-slate-600' : ''}
          ${className}
        `}
        {...restProps}
      />

      {error && <span className="text-[11px] text-rose-500 dark:text-rose-400 mt-1 font-medium">{error}</span>}
    </div>
  );
};
