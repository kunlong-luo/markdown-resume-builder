
import React from 'react';
import { Type, ArrowUp, ArrowDown, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';
import { getSectionTheme } from '../../lib/section-themes';

interface SectionHeaderProps {
  title: string;
  type: 'text' | 'items';
  isExpanded: boolean;
  isFirst: boolean;
  isLast: boolean;
  onToggle: () => void;
  onTitleChange: (newTitle: string) => void;
  onApplySpacing: () => void;
  onMove: (direction: 'up' | 'down') => void;
  onDelete: () => void;
  onTypeChange?: (newType: 'text' | 'items') => void;
  lang?: string;
}

export function SectionHeader({
  title, type, isExpanded, isFirst, isLast,
  onToggle, onTitleChange, onApplySpacing, onMove, onDelete,
  onTypeChange, lang = 'zh'
}: SectionHeaderProps) {
  const isEn = lang === 'en';
  const theme = getSectionTheme(title, lang);
  const Icon = theme.icon;

  return (
    <div 
      className={`flex items-center justify-between px-5 py-3.5 bg-gradient-to-r cursor-pointer select-none transition-all duration-300 ${
        isExpanded 
          ? 'from-indigo-50/40 to-slate-50 dark:from-indigo-950/30 dark:to-slate-900/60 border-b border-indigo-100/40 dark:border-indigo-900/40 hover:from-indigo-50/60 hover:to-slate-100/60 dark:hover:from-indigo-950/50 dark:hover:to-slate-900/80' 
          : 'from-slate-50/80 to-slate-100/30 dark:from-slate-850/60 dark:to-slate-900/40 border-b border-slate-200/40 dark:border-slate-800 dark:hover:from-slate-800 dark:hover:to-slate-800/80 hover:from-slate-100/60 hover:to-slate-100/90'
      }`} 
      onClick={onToggle}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`p-2 rounded-lg border ${theme.iconBg} ${theme.iconColor} ${theme.border} shrink-0 flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap">
          <input 
            type="text"
            value={title}
            onClick={(e) => e.stopPropagation()} 
            onChange={(e) => onTitleChange(e.target.value)}
            className="font-bold text-sm text-slate-800 dark:text-slate-100 bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100/50 dark:focus:ring-indigo-900/50 px-1.5 py-0.5 rounded transition-all w-36 sm:w-48 md:w-56"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <Tooltip content={isEn ? "Format Spacing" : "格式化中英空格"} side="top">
          <button
            onClick={onApplySpacing}
            className="p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 rounded transition-all active:scale-90 duration-150 cursor-pointer"
          >
            <Type className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        <Tooltip content={isEn ? "Move section up" : "上移模块"} side="top" disabled={isFirst}>
          <button
            onClick={() => onMove('up')}
            disabled={isFirst}
            className={`p-1.5 rounded transition-all active:scale-90 duration-150 ${isFirst ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 cursor-pointer'}`}
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        <Tooltip content={isEn ? "Move section down" : "下移模块"} side="top" disabled={isLast}>
          <button
            onClick={() => onMove('down')}
            disabled={isLast}
            className={`p-1.5 rounded transition-all active:scale-90 duration-150 ${isLast ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 cursor-pointer'}`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        <Tooltip content={isEn ? "Delete section" : "删除模块"} side="top">
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-red-50 dark:hover:bg-rose-950/50 text-red-500 dark:text-rose-400 hover:text-red-700 dark:hover:text-rose-300 rounded transition-all active:scale-90 duration-150 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        <div className="w-px h-4 bg-slate-200/80 dark:bg-slate-750 mx-1"></div>

        <div className="p-0.5 transition-transform duration-200 active:scale-75 cursor-pointer" onClick={onToggle}>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" /> : <ChevronDown className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />}
        </div>
      </div>
    </div>
  );
}
