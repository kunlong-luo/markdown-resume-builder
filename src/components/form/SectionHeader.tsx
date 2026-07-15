
import React from 'react';
import { Type, ArrowUp, ArrowDown, Trash2, ChevronUp, ChevronDown, List, FileText } from 'lucide-react';
import { getSectionIcon } from './FormSectionEditor';

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
  return (
    <div 
      className={`flex items-center justify-between px-5 py-4 bg-gradient-to-r cursor-pointer select-none transition-all duration-300 ${
        isExpanded 
          ? 'from-indigo-50/40 to-slate-50 border-b border-indigo-100/40 hover:from-indigo-50/60 hover:to-slate-100/60' 
          : 'from-slate-50/80 to-slate-100/30 border-b border-slate-200/40 hover:from-slate-100/60 hover:to-slate-100/90'
      }`} 
      onClick={onToggle}
    >
      <div className="flex items-center gap-2.5">
        {getSectionIcon(title)}
        <input 
          type="text"
          value={title}
          onClick={(e) => e.stopPropagation()} 
          onChange={(e) => onTitleChange(e.target.value)}
          className="font-semibold text-sm text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100/50 px-1.5 py-0.5 rounded transition-all w-48 md:w-64"
          title={isEn ? "Click to rename this section directly" : "点击可直接修改模块名称"}
        />
      </div>
      
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onApplySpacing}
          className="p-1.5 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 rounded transition-all active:scale-90 duration-150"
          title={isEn ? "Auto-format spacing between Chinese, English and numbers" : "智能优化该模块下的中英文数字空格排版"}
        >
          <Type className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onMove('up')}
          disabled={isFirst}
          className={`p-1.5 rounded transition-all active:scale-90 duration-150 ${isFirst ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
          title={isEn ? "Move section up" : "上移模块"}
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onMove('down')}
          disabled={isLast}
          className={`p-1.5 rounded transition-all active:scale-90 duration-150 ${isLast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
          title={isEn ? "Move section down" : "下移模块"}
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onDelete}
          className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded transition-all active:scale-90 duration-150"
          title={isEn ? "Delete section" : "删除该模块"}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-slate-200/80 mx-1"></div>

        <div className="p-0.5 transition-transform duration-200 active:scale-75" onClick={onToggle}>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 hover:text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-400 hover:text-slate-600" />}
        </div>
      </div>
    </div>
  );
}
