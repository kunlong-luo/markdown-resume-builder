import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Pipette, Check, Palette } from 'lucide-react';

export interface CustomColorPickerProps {
  id?: string;
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
  label?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
}

const DEFAULT_PRESETS = [
  '#0f172a', // Slate 900
  '#1e293b', // Charcoal
  '#1e3a8a', // Deep Navy
  '#2563eb', // Royal Blue
  '#4f46e5', // Modern Indigo
  '#0284c7', // Ocean Sky
  '#059669', // Emerald
  '#0d9488', // Teal
  '#d97706', // Bronze Amber
  '#dc2626', // Crimson Red
  '#7c3aed', // Rich Violet
  '#475569', // Slate Neutral
];

export const CustomColorPicker: React.FC<CustomColorPickerProps> = ({
  id,
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  label,
  className = '',
  size = 'sm',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const nativeColorInputRef = useRef<HTMLInputElement>(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setHexInput(value);
  }, [value]);

  const updatePopoverPosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 220;
    const popoverHeight = 220;
    const margin = 6;

    let top = rect.bottom + margin;
    let left = rect.left;

    // Flip to top if overflowing window bottom
    if (top + popoverHeight > window.innerHeight && rect.top - popoverHeight - margin > 0) {
      top = rect.top - popoverHeight - margin;
    }

    // Shift left if overflowing window right
    if (left + popoverWidth > window.innerWidth) {
      left = Math.max(10, window.innerWidth - popoverWidth - 10);
    }

    setPopoverPos({ top, left });
  };

  const handleOpen = () => {
    updatePopoverPosition();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePopoverPosition();
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)) {
      onChange(val);
    }
  };

  const sizeClasses = {
    xs: 'h-6 px-1.5 py-0.5 text-[11px] gap-1.5',
    sm: 'h-7 px-2 py-1 text-xs gap-2',
    md: 'h-8 px-2.5 py-1.5 text-sm gap-2',
  };

  const swatchSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
  };

  return (
    <div id={id} className={`inline-flex flex-col relative ${className}`}>
      {label && <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">{label}</span>}

      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={`
          flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-lg
          hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-750 shadow-sm transition-all outline-none
          focus-visible:ring-2 focus-visible:ring-indigo-500/30
          ${sizeClasses[size]}
        `}
      >
        <div className="flex items-center gap-1.5">
          <span
            className={`${swatchSizes[size]} rounded-md shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)] shrink-0`}
            style={{ backgroundColor: value }}
          />
          <span className="font-mono text-slate-700 dark:text-slate-200 font-semibold tracking-tight uppercase">
            {value}
          </span>
        </div>
        <Palette className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            data-custom-select-portal="true"
            style={{
              position: 'fixed',
              top: `${popoverPos.top}px`,
              left: `${popoverPos.left}px`,
              zIndex: 99999,
            }}
            className="w-56 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xl dark:shadow-[0_16px_36px_rgba(0,0,0,0.6)] p-3 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Preset Palette
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-6 gap-1.5 mb-3">
              {presets.map((color) => {
                const isSelected = value.toLowerCase() === color.toLowerCase();
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      onChange(color);
                      setHexInput(color);
                    }}
                    className={`
                      w-6 h-6 rounded-md relative flex items-center justify-center
                      transition-transform hover:scale-110 active:scale-95 shadow-sm
                      border border-black/10
                    `}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-md stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Hex Input and Color Dropper */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="relative flex-1">
                <span className="absolute left-2 top-1.5 text-xs text-slate-400 font-mono">#</span>
                <input
                  type="text"
                  value={hexInput.startsWith('#') ? hexInput.slice(1) : hexInput}
                  onChange={(e) => handleHexChange({ ...e, target: { ...e.target, value: `#${e.target.value}` } })}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full pl-5 pr-2 py-1 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-md focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase"
                />
              </div>

              {/* Native color picker trigger disguised as Pipette/Picker button */}
              <button
                type="button"
                onClick={() => nativeColorInputRef.current?.click()}
                title="Spectrum color picker"
                className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md transition-colors shrink-0 cursor-pointer"
              >
                <Pipette className="w-4 h-4" />
                <input
                  ref={nativeColorInputRef}
                  type="color"
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value);
                    setHexInput(e.target.value);
                  }}
                  className="sr-only"
                />
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
