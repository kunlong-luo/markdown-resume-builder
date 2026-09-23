import React, { useState, useRef, useEffect } from 'react';

export interface TooltipProps {
  content?: React.ReactNode;
  shortcut?: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  disabled?: boolean;
  delay?: number;
  className?: string;
  wrapperClassName?: string;
}

export function Tooltip({
  content,
  shortcut,
  children,
  side = 'bottom',
  align = 'center',
  disabled = false,
  delay = 150,
  className = '',
  wrapperClassName = ''
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (disabled || !content) return;
    if (delay > 0) {
      timerRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (disabled || !content) {
    return <>{children}</>;
  }

  // Positioning classes
  let positionClasses = '';
  let arrowClasses = '';

  switch (side) {
    case 'top':
      positionClasses = 'bottom-full mb-1.5';
      arrowClasses = 'top-full left-1/2 -translate-x-1/2 border-t-slate-900 dark:border-t-slate-800 border-x-transparent border-b-transparent border-t-4 border-x-4 border-b-0';
      break;
    case 'bottom':
      positionClasses = 'top-full mt-1.5';
      arrowClasses = 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 dark:border-b-slate-800 border-x-transparent border-t-transparent border-b-4 border-x-4 border-t-0';
      break;
    case 'left':
      positionClasses = 'right-full mr-1.5 top-1/2 -translate-y-1/2';
      arrowClasses = 'left-full top-1/2 -translate-y-1/2 border-l-slate-900 dark:border-l-slate-800 border-y-transparent border-r-transparent border-l-4 border-y-4 border-r-0';
      break;
    case 'right':
      positionClasses = 'left-full ml-1.5 top-1/2 -translate-y-1/2';
      arrowClasses = 'right-full top-1/2 -translate-y-1/2 border-r-slate-900 dark:border-r-slate-800 border-y-transparent border-l-transparent border-r-4 border-y-4 border-l-0';
      break;
  }

  if (side === 'top' || side === 'bottom') {
    if (align === 'start') {
      positionClasses += ' left-0';
    } else if (align === 'end') {
      positionClasses += ' right-0';
    } else {
      positionClasses += ' left-1/2 -translate-x-1/2';
    }
  }

  return (
    <div
      className={`relative inline-flex items-center ${wrapperClassName}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-[9999] pointer-events-none select-none animate-in fade-in zoom-in-95 duration-150 ${positionClasses}`}
        >
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium leading-tight text-slate-100 bg-slate-900/95 dark:bg-slate-800/95 border border-slate-700/80 dark:border-slate-700/80 rounded-lg shadow-xl shadow-slate-950/20 backdrop-blur-md whitespace-nowrap tracking-wide ${className}`}
          >
            <span>{content}</span>
            {shortcut && (
              <kbd className="px-1.5 py-0.5 text-[9px] font-semibold bg-slate-800 dark:bg-slate-700 text-slate-300 rounded border border-slate-700 dark:border-slate-600 shadow-2xs">
                {shortcut}
              </kbd>
            )}
          </div>
          {/* Subtle Arrow */}
          <div className={`absolute w-0 h-0 ${arrowClasses}`} />
        </div>
      )}
    </div>
  );
}
