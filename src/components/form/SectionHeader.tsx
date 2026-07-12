
import React from 'react';
import { Type, ArrowUp, ArrowDown, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
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
      className="flex items-center justify-between px-5 py-4 bg-slate-50/40 border-b border-slate-100 cursor-pointer select-none" 
      onClick={onToggle}
    >
      <div className="flex items-center gap-2.5">
        {getSectionIcon(title)}
        <input 
          type="text"
          value={title}
          onClick={(e) => e.stopPropagation()} 
          onChange={(e) => onTitleChange(e.target.value)}
          className="font-semibold text-sm text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-none px-1.5 py-0.5 rounded transition-all w-48 md:w-64"
          title={isEn ? "Click to rename this section directly" : "点击可直接修改模块名称"}
        />
        <span 
          onClick={(e) => {
            if (onTypeChange) {
              e.stopPropagation();
              onTypeChange(type === 'items' ? 'text' : 'items');
            }
          }}
          className={`text-[10px] px-1.5 py-0.5 rounded font-medium transition-colors ${
            onTypeChange 
              ? 'bg-blue-100 hover:bg-blue-200 text-blue-700 cursor-pointer' 
              : 'bg-slate-200/60 text-slate-500'
          }`}
          title={onTypeChange ? (isEn ? "Click to switch layout (Single Text / Multi-Item)" : "点击切换该模块布局模式 (单段文本/多项经历)") : undefined}
        >
          {type === 'items' ? (isEn ? 'Multi-Item' : '多项经历') : (isEn ? 'Single Text' : '单段文本')}
        </span>
      </div>
      
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onApplySpacing}
          className="p-1.5 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 rounded transition-colors"
          title={isEn ? "Auto-format spacing between Chinese, English and numbers" : "智能优化该模块下的中英文数字空格排版"}
        >
          <Type className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onMove('up')}
          disabled={isFirst}
          className={`p-1.5 rounded transition-colors ${isFirst ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
          title={isEn ? "Move section up" : "上移模块"}
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onMove('down')}
          disabled={isLast}
          className={`p-1.5 rounded transition-colors ${isLast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
          title={isEn ? "Move section down" : "下移模块"}
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onDelete}
          className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded transition-colors"
          title={isEn ? "Delete section" : "删除该模块"}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-slate-200 mx-1"></div>

        <div className="p-0.5" onClick={onToggle}>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>
    </div>
  );
}
