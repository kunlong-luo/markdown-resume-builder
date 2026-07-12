
import React from 'react';
import { Settings, User, ChevronsDown, ChevronsUp } from 'lucide-react';
import { FormSection } from '../../lib/form-types';
import { getSectionIcon } from './FormSectionEditor';

interface QuickNavProps {
  sections: FormSection[];
  expandedSections: Record<string, boolean>;
  setExpandedSections: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export function QuickNav({ sections, expandedSections, setExpandedSections }: QuickNavProps) {
  return (
    <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm pb-3 pt-1 -mt-2 -mx-2 border-b border-slate-200/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap pl-2 flex items-center gap-1">
        <Settings className="w-3.5 h-3.5 text-slate-400" />
        <span>快捷操作：</span>
      </span>

      <div className="flex items-center gap-1 pr-2.5 mr-1 border-r border-slate-200 shrink-0">
        <button
          onClick={() => {
            const states: Record<string, boolean> = { basic: true };
            sections.forEach(sec => { states[sec.id] = true; });
            setExpandedSections(states);
          }}
          className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-[11px] font-bold text-indigo-700 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm"
          title="一键展开所有模块"
        >
          <ChevronsDown className="w-3.5 h-3.5 text-indigo-500" />
          <span>全部展开</span>
        </button>
        <button
          onClick={() => {
            const states: Record<string, boolean> = { basic: false };
            sections.forEach(sec => { states[sec.id] = false; });
            setExpandedSections(states);
          }}
          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-[11px] font-bold text-slate-600 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm"
          title="一键折叠所有模块"
        >
          <ChevronsUp className="w-3.5 h-3.5 text-slate-500" />
          <span>全部折叠</span>
        </button>
      </div>

      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap pl-1 flex items-center gap-1">
        <span>跳转模块：</span>
      </span>
      <button
        onClick={() => {
          document.getElementById('form-sec-basic')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg transition-all shadow-sm whitespace-nowrap cursor-pointer flex items-center gap-1 hover:border-slate-300 hover:text-slate-800"
      >
        <User className="w-3 h-3 text-slate-400" />
        <span>基本信息</span>
      </button>
      {sections.map((sec) => (
        <button
          key={sec.id}
          onClick={() => {
            // Auto-expand section if collapsed
            if (expandedSections[sec.id] === false) {
              setExpandedSections(prev => ({ ...prev, [sec.id]: true }));
            }
            setTimeout(() => {
              document.getElementById(`form-sec-${sec.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 60);
          }}
          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg transition-all shadow-sm whitespace-nowrap cursor-pointer flex items-center gap-1 hover:border-slate-300 hover:text-slate-800"
        >
          {getSectionIcon(sec.title)}
          <span>{sec.title || '自定义模块'}</span>
        </button>
      ))}
    </div>
  );
}
