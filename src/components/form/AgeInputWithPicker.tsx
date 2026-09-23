import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

interface AgeInputWithPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  lang?: 'zh' | 'en';
  className?: string;
}

export function AgeInputWithPicker({
  value,
  onChange,
  placeholder,
  lang = 'zh',
  className = '',
}: AgeInputWithPickerProps) {
  const isEn = lang === 'en';
  const [isOpen, setIsOpen] = useState(false);

  const currentYear = new Date().getFullYear();

  // Deduce initial decade from existing age value
  const getInitialStartYear = () => {
    if (value) {
      const trimmed = value.trim();
      const numMatch = trimmed.match(/\d+/);
      if (numMatch) {
        const num = parseInt(numMatch[0], 10);
        if (num >= 1950 && num <= currentYear) {
          return Math.floor(num / 10) * 10;
        } else if (num >= 15 && num <= 70) {
          const birthYear = currentYear - num;
          return Math.floor(birthYear / 10) * 10;
        }
      }
    }
    // Default decade for typical candidates (e.g. 1990 - 2001)
    return 1990;
  };

  const [startYear, setStartYear] = useState<number>(getInitialStartYear);

  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    isDropUp: boolean;
  } | null>(null);

  const calculatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const isUp = spaceBelow < 250 && rect.top > 250;

    let left = rect.left;
    const popoverWidth = 260;
    if (left + popoverWidth > window.innerWidth) {
      left = Math.max(10, window.innerWidth - popoverWidth - 10);
    }

    setCoords({
      top: isUp ? rect.top - 6 : rect.bottom + 6,
      left,
      width: popoverWidth,
      isDropUp: isUp,
    });
  };

  const handleToggle = () => {
    if (!isOpen) {
      setStartYear(getInitialStartYear());
      calculatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      calculatePosition();
    };

    document.addEventListener('mousedown', handleOutsideClick, true);
    document.addEventListener('touchstart', handleOutsideClick, true);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick, true);
      document.removeEventListener('touchstart', handleOutsideClick, true);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen]);

  // Escape key support
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Standard 12-year grid: startYear to startYear + 11 (e.g. 1990 - 2001)
  const years = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < 12; i++) {
      list.push(startYear + i);
    }
    return list;
  }, [startYear]);

  // Derive numeric value to display in input, stripping trailing '岁' so it doesn't clash with the right suffix
  const displayValue = useMemo(() => {
    if (!value) return '';
    const trimmed = value.trim();
    const match = trimmed.match(/^(\d+)\s*(?:岁|years?\s*old|yrs)?$/i);
    if (match) return match[1];
    return trimmed;
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange('');
      return;
    }
    const trimmed = raw.trim();
    const numMatch = trimmed.match(/^(\d+)\s*(?:岁|years?\s*old|yrs)?$/i);
    if (numMatch) {
      onChange(numMatch[1]);
      return;
    }
    onChange(raw);
  };

  // When a year is selected, convert to age and fill into the input box
  const handleSelectYear = (year: number) => {
    const age = currentYear - year;
    onChange(String(age));
    setIsOpen(false);
  };

  const isYearSelected = (year: number) => {
    if (!value) return false;
    const trimmed = value.trim();
    const age = currentYear - year;
    const numMatch = trimmed.match(/\d+/);
    if (numMatch) {
      const num = parseInt(numMatch[0], 10);
      return num === age || num === year;
    }
    return false;
  };

  return (
    <div ref={triggerRef} className={`relative flex items-center h-9.5 ${className}`}>
      {/* Calendar icon button: click to open year picker */}
      <Tooltip content={isEn ? 'Open Year Picker' : '选择年份'} side="top">
        <button
          type="button"
          onClick={handleToggle}
          className={`
            absolute left-2.5 top-1/2 -translate-y-1/2 z-10 p-1 rounded-md cursor-pointer transition-colors
            ${isOpen ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800'}
          `}
        >
          <Calendar className="w-4 h-4" />
        </button>
      </Tooltip>

      {/* Free text / number input */}
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        className={`w-full h-9.5 pl-9 ${isEn ? 'pr-12' : 'pr-8'} text-sm tactile-input rounded-lg bg-white dark:bg-slate-900`}
        placeholder={placeholder || (isEn ? 'e.g., 28' : '例如：28')}
      />

      {/* Suffix label on the far right (like work experience's "年工作经验") */}
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium pointer-events-none select-none">
        {isEn ? 'yrs' : '岁'}
      </span>

      {/* Universal Year Picker Popover */}
      {typeof document !== 'undefined' &&
        isOpen &&
        coords &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: coords.isDropUp ? undefined : `${coords.top}px`,
              bottom: coords.isDropUp ? `${window.innerHeight - coords.top}px` : undefined,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              zIndex: 99999,
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-[0_12px_32px_-4px_rgba(15,23,42,0.18),0_4px_8px_-2px_rgba(15,23,42,0.06)] p-3 text-xs select-none"
          >
            {/* Standard Calendar Header: <  1990 — 2001  > */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
              <Tooltip content={isEn ? 'Previous 10 Years' : '前 10 年'} side="top">
                <button
                  type="button"
                  onClick={() => setStartYear((prev) => prev - 10)}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </Tooltip>

              <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs tracking-wide">
                {startYear} — {startYear + 11}
              </span>

              <Tooltip content={isEn ? 'Next 10 Years' : '后 10 年'} side="top">
                <button
                  type="button"
                  onClick={() => setStartYear((prev) => prev + 10)}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>

            {/* Standard 3 x 4 Universal Year Grid */}
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {years.map((year) => {
                const selected = isYearSelected(year);
                const age = currentYear - year;
                const isFuture = age < 0;

                return (
                  <button
                    key={year}
                    type="button"
                    disabled={isFuture}
                    onClick={() => handleSelectYear(year)}
                    className={`
                      h-8.5 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center text-xs
                      ${
                        isFuture
                          ? 'opacity-25 cursor-not-allowed text-slate-400'
                          : selected
                          ? 'bg-indigo-600 text-white font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-200 font-medium'
                      }
                    `}
                  >
                    {year}
                  </button>
                );
              })}
            </div>

            {/* Clean Footer with Clear button */}
            <div className="flex items-center justify-end pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 inline-flex items-center gap-1 cursor-pointer transition-colors px-1.5 py-0.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <RotateCcw className="w-3 h-3" />
                {isEn ? 'Clear' : '清空'}
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
