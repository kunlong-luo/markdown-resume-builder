import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Check, X, RotateCcw } from 'lucide-react';

interface MonthRangePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  lang?: string;
  leftIcon?: React.ReactNode;
}

export function MonthRangePicker({
  value,
  onChange,
  placeholder = '',
  className = '',
  lang = 'zh',
  leftIcon
}: MonthRangePickerProps) {
  const isEn = lang === 'en';
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse existing value e.g. "2021.09 - 2024.06" or "2021.09 - 至今"
  const currentYearStr = String(new Date().getFullYear());
  const [startYear, setStartYear] = useState(currentYearStr);
  const [startMonth, setStartMonth] = useState('09');
  const [endYear, setEndYear] = useState(currentYearStr);
  const [endMonth, setEndMonth] = useState('06');
  const [isOngoing, setIsOngoing] = useState(false);

  // Generate Year Options: from currentYear + 5 down to 25 years ago
  const years = useMemoYears();

  function useMemoYears() {
    const cy = new Date().getFullYear();
    const result = [];
    for (let i = cy + 4; i >= cy - 25; i--) {
      result.push(String(i));
    }
    return result;
  }

  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  // Handle parsing when opening the picker
  useEffect(() => {
    if (isOpen && value) {
      // Split by any common range separator: hyphen (-), em-dash (—), en-dash (–), tilde (~), '至', or 'to'
      const parts = value.split(/\s*(?:[\-—–~至]|to)\s*/i).map(s => s.trim()).filter(Boolean);
      if (parts.length >= 1) {
        // Split year and month by '.', '-', '/', '年', or '月'
        const startParts = parts[0].split(/[\.\-\/年月]/).map(s => s.trim()).filter(Boolean);
        if (startParts.length >= 1) {
          const year = startParts[0];
          if (year.length === 4) setStartYear(year);
        }
        if (startParts.length >= 2) {
          const month = startParts[1].padStart(2, '0');
          if (month.length === 2 && months.includes(month)) setStartMonth(month);
        }
      }
      if (parts.length >= 2) {
        const endStr = parts[1];
        const now = new Date();
        const cy = String(now.getFullYear());
        const cm = String(now.getMonth() + 1).padStart(2, '0');

        if (endStr === '至今' || endStr.toLowerCase() === 'present' || endStr === '现在' || endStr === 'now') {
          setIsOngoing(true);
        } else {
          const endParts = endStr.split(/[\.\-\/年月]/).map(s => s.trim()).filter(Boolean);
          let parsedYear = endYear;
          let parsedMonth = endMonth;
          if (endParts.length >= 1) {
            const year = endParts[0];
            if (year.length === 4) {
              parsedYear = year;
              setEndYear(year);
            }
          }
          if (endParts.length >= 2) {
            const month = endParts[1].padStart(2, '0');
            if (month.length === 2 && months.includes(month)) {
              parsedMonth = month;
              setEndMonth(month);
            }
          }
          // If the parsed date is the current year and month, default isOngoing to true
          if (parsedYear === cy && parsedMonth === cm) {
            setIsOngoing(true);
          } else {
            setIsOngoing(false);
          }
        }
      }
    }
  }, [isOpen, value]);

  // Handle click outside to close the picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleApply = () => {
    const startStr = `${startYear}.${startMonth}`;
    const now = new Date();
    const cy = now.getFullYear();
    const cm = String(now.getMonth() + 1).padStart(2, '0');
    const endStr = isOngoing ? `${cy}.${cm}` : `${endYear}.${endMonth}`;
    onChange(`${startStr} - ${endStr}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
  };

  const cleanedClassName = className
    .split(' ')
    .filter(c => !/^(px-|pr-|pl-)/.test(c))
    .join(' ');

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-slate-400 z-10 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => {
            const val = e.target.value;
            if (!val) return;
            const now = new Date();
            const cy = now.getFullYear();
            const cm = String(now.getMonth() + 1).padStart(2, '0');
            const currentFormatted = `${cy}.${cm}`;
            
            // Auto replace "至今", "现在", "present", "Present", "now" with the current YYYY.MM
            const regex = /(至今|现在|present|Present|now)/gi;
            if (regex.test(val)) {
              const cleaned = val.replace(regex, currentFormatted);
              onChange(cleaned);
            }
          }}
          className={`w-full ${leftIcon ? 'pl-9' : 'pl-3'} pr-9 ${cleanedClassName}`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 p-1 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
          title={isEn ? "Open Date Picker" : "打开日期选择器"}
        >
          <Calendar className="w-3.5 h-3.5" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-[410px] bg-white border border-slate-200/90 shadow-[0_20px_48px_rgba(30,41,59,0.14)] rounded-2xl p-4.5 z-50 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-500" />
              {isEn ? 'Select Period' : '选择起止时间'}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Start Date Panel */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                  {isEn ? 'Start' : '起始时间'}
                </span>
                <select
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 text-slate-700 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-4 gap-1">
                {months.map(m => {
                  const isSelected = startMonth === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setStartMonth(m)}
                      className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {m}{isEn ? '' : '月'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* End Date Panel */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                    {isEn ? 'End' : '结束时间'}
                  </span>
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 cursor-pointer select-none" title={isEn ? "Automatically use current year and month" : "自动使用当年当月的日期"}>
                    <input
                      type="checkbox"
                      checked={isOngoing}
                      onChange={(e) => setIsOngoing(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3 h-3 cursor-pointer"
                    />
                    <span>{isEn ? 'Present' : '至今'}</span>
                  </label>
                </div>
                
                <select
                  disabled={isOngoing}
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                  className={`text-xs font-bold bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 text-slate-700 outline-none cursor-pointer hover:bg-slate-100 transition-colors ${
                    isOngoing ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100' : ''
                  }`}
                >
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-4 gap-1">
                {months.map(m => {
                  const isSelected = !isOngoing && endMonth === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      disabled={isOngoing}
                      onClick={() => setEndMonth(m)}
                      className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                        isOngoing
                          ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                          : isSelected
                          ? 'bg-indigo-600 text-white shadow-sm cursor-pointer'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 cursor-pointer'
                      }`}
                    >
                      {m}{isEn ? '' : '月'}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-1">
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] font-bold text-slate-500 hover:text-rose-600 px-2.5 py-1.5 rounded-lg border border-slate-200/80 hover:bg-rose-50/20 hover:border-rose-200 transition-all cursor-pointer flex items-center gap-1 active:translate-y-px"
            >
              <RotateCcw className="w-3 h-3" />
              {isEn ? 'Clear' : '清除'}
            </button>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-bold text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
              >
                {isEn ? 'Cancel' : '取消'}
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 active:translate-y-px shadow-sm"
              >
                <Check className="w-3 h-3" />
                {isEn ? 'Apply' : '确定'}
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
