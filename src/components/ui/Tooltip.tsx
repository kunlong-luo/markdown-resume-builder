import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

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
  side = 'top',
  align = 'center',
  disabled = false,
  delay = 150,
  className = '',
  wrapperClassName = ''
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; actualSide: 'top' | 'bottom' | 'left' | 'right' }>({
    top: 0,
    left: 0,
    actualSide: side
  });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    const gap = 6;
    let actualSide = side;
    let top = 0;
    let left = 0;

    // Check vertical flips
    if (side === 'top') {
      if (triggerRect.top - tooltipRect.height - gap < 8) {
        actualSide = 'bottom';
        top = triggerRect.bottom + gap;
      } else {
        top = triggerRect.top - tooltipRect.height - gap;
      }
    } else if (side === 'bottom') {
      if (triggerRect.bottom + tooltipRect.height + gap > window.innerHeight - 8) {
        actualSide = 'top';
        top = triggerRect.top - tooltipRect.height - gap;
      } else {
        top = triggerRect.bottom + gap;
      }
    } else if (side === 'left') {
      if (triggerRect.left - tooltipRect.width - gap < 8) {
        actualSide = 'right';
        left = triggerRect.right + gap;
      } else {
        left = triggerRect.left - tooltipRect.width - gap;
      }
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
    } else if (side === 'right') {
      if (triggerRect.right + tooltipRect.width + gap > window.innerWidth - 8) {
        actualSide = 'left';
        left = triggerRect.left - tooltipRect.width - gap;
      } else {
        left = triggerRect.right + gap;
      }
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
    }

    if (actualSide === 'top' || actualSide === 'bottom') {
      if (align === 'start') {
        left = triggerRect.left;
      } else if (align === 'end') {
        left = triggerRect.right - tooltipRect.width;
      } else {
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
      }
    }

    // Viewport boundary clamping
    const minX = 8;
    const maxX = window.innerWidth - tooltipRect.width - 8;
    left = Math.max(minX, Math.min(left, maxX));

    const minY = 8;
    const maxY = window.innerHeight - tooltipRect.height - 8;
    top = Math.max(minY, Math.min(top, maxY));

    setCoords({ top, left, actualSide });
  };

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

  useLayoutEffect(() => {
    if (isVisible) {
      updatePosition();
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    const handleScrollOrResize = () => {
      updatePosition();
    };
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isVisible]);

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

  return (
    <div
      ref={triggerRef}
      className={`relative inline-flex items-center ${wrapperClassName}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}

      {isVisible &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 99999
            }}
            className="pointer-events-none select-none transition-opacity duration-150 animate-in fade-in zoom-in-95"
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
          </div>,
          document.body
        )}
    </div>
  );
}
