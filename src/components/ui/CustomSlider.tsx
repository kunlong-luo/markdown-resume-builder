import React, { useRef, useState, useCallback, useEffect } from 'react';

export interface CustomSliderProps {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: React.ReactNode;
  valueDisplay?: string | number | ((val: number) => string | number);
  className?: string;
  colorTheme?: 'indigo' | 'blue' | 'emerald';
  size?: 'sm' | 'md';
}

const THEME_STYLES = {
  indigo: {
    fill: 'bg-indigo-600',
    thumb: 'border-indigo-600 focus-visible:ring-indigo-500/30 hover:scale-110 active:scale-95',
  },
  blue: {
    fill: 'bg-blue-600',
    thumb: 'border-blue-600 focus-visible:ring-blue-500/30 hover:scale-110 active:scale-95',
  },
  emerald: {
    fill: 'bg-emerald-600',
    thumb: 'border-emerald-600 focus-visible:ring-emerald-500/30 hover:scale-110 active:scale-95',
  },
};

export const CustomSlider: React.FC<CustomSliderProps> = ({
  id,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label,
  valueDisplay,
  className = '',
  colorTheme = 'indigo',
  size = 'md',
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Clamp value between min and max
  const clampedValue = Math.min(Math.max(value, min), max);
  const percentage = Math.max(0, Math.min(100, ((clampedValue - min) / (max - min)) * 100));

  const calculateValueFromPointer = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return clampedValue;
      const rect = trackRef.current.getBoundingClientRect();
      const rawRatio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + rawRatio * (max - min);

      // Snap to step
      const stepsCount = Math.round((rawValue - min) / step);
      const steppedValue = min + stepsCount * step;
      
      // Precision handling to avoid floating point issues (e.g. 0.05 steps)
      const precision = (step.toString().split('.')[1] || '').length;
      const finalValue = Number(Math.min(Math.max(steppedValue, min), max).toFixed(precision));
      return finalValue;
    },
    [min, max, step, clampedValue]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    const newValue = calculateValueFromPointer(e.clientX);
    onChange(newValue);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const updatedValue = calculateValueFromPointer(moveEvent.clientX);
      onChange(updatedValue);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    let delta = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = step;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -step;
    else if (e.key === 'PageUp') delta = step * 5;
    else if (e.key === 'PageDown') delta = -step * 5;
    else if (e.key === 'Home') {
      e.preventDefault();
      onChange(min);
      return;
    } else if (e.key === 'End') {
      e.preventDefault();
      onChange(max);
      return;
    }

    if (delta !== 0) {
      e.preventDefault();
      const precision = (step.toString().split('.')[1] || '').length;
      const nextVal = Number(Math.min(Math.max(clampedValue + delta, min), max).toFixed(precision));
      onChange(nextVal);
    }
  };

  const theme = THEME_STYLES[colorTheme];
  const trackHeight = size === 'sm' ? 'h-1.5' : 'h-2';
  const thumbSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  const formattedDisplay =
    typeof valueDisplay === 'function'
      ? valueDisplay(clampedValue)
      : valueDisplay !== undefined
      ? valueDisplay
      : clampedValue;

  return (
    <div id={id} className={`w-full select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      {(label || valueDisplay !== undefined) && (
        <div className="flex items-center justify-between mb-1 text-xs">
          {label && <span className="font-semibold text-slate-600 dark:text-slate-300">{label}</span>}
          {valueDisplay !== undefined && (
            <span className="font-mono text-slate-500 dark:text-slate-400 font-bold">{formattedDisplay}</span>
          )}
        </div>
      )}

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        className={`
          relative flex items-center w-full cursor-pointer py-1.5
          ${disabled ? 'pointer-events-none' : ''}
        `}
      >
        {/* Track Background */}
        <div className={`w-full ${trackHeight} bg-slate-200/80 dark:bg-slate-700/80 rounded-full overflow-hidden shadow-inner`}>
          {/* Filled Portion */}
          <div
            className={`h-full ${theme.fill} transition-[width] duration-75`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Thumb */}
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={clampedValue}
          aria-disabled={disabled}
          onKeyDown={handleKeyDown}
          style={{ left: `${percentage}%` }}
          className={`
            absolute top-1/2 -translate-x-1/2 -translate-y-1/2
            ${thumbSize} rounded-full bg-white dark:bg-slate-900 border-2
            shadow-md transition-transform duration-100 ease-out outline-none
            focus-visible:ring-4
            ${theme.thumb}
            ${isDragging ? 'scale-110 shadow-lg' : ''}
          `}
        />
      </div>
    </div>
  );
};
