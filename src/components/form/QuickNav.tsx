
import React from 'react';
import { Settings, User, ChevronsDown, ChevronsUp } from 'lucide-react';
import { FormSection } from '../../lib/form-types';
import { getSectionIcon } from './FormSectionEditor';

interface QuickNavProps {
  sections: FormSection[];
  expandedSections: Record<string, boolean>;
  setExpandedSections: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  lang?: string;
}

const translateSectionTitle = (title: string, lang?: string) => {
  if (lang !== 'en') return title || '自定义模块';
  const lower = title?.trim().toLowerCase() || '';
  if (lower === '工作经历' || lower === 'work experience') return 'Work Experience';
  if (lower === '教育背景' || lower === 'education background') return 'Education';
  if (lower === '项目经历' || lower === 'project experience') return 'Project Experience';
  if (lower === '技能特长' || lower === 'skills & rating' || lower === '专业技能' || lower === '技能证书') return 'Skills & Ratings';
  if (lower === '自我评价' || lower === 'self evaluation') return 'Summary';
  if (lower === '荣誉奖项' || lower === 'awards') return 'Awards';
  if (lower === '社交链接' || lower === 'links') return 'Links';
  return title || 'Custom Section';
};

export function QuickNav({ sections, expandedSections, setExpandedSections, lang = 'zh' }: QuickNavProps) {
  const isEn = lang === 'en';
  return (
    <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm pb-2.5 pt-4 -mt-6 -mx-6 px-6 border-b border-slate-200/40 flex flex-col gap-2 w-[calc(100%+3rem)] max-w-[calc(100%+3rem)] min-w-0 shrink-0">
      {/* Row 1: Quick Actions */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap pl-1 flex items-center gap-1">
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span>{isEn ? 'Actions:' : '快捷操作：'}</span>
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              const states: Record<string, boolean> = { basic: true };
              sections.forEach(sec => { states[sec.id] = true; });
              setExpandedSections(states);
            }}
            className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-[11px] font-bold text-indigo-700 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-xs"
            title={isEn ? 'Expand all sections' : '一键展开所有模块'}
          >
            <ChevronsDown className="w-3.5 h-3.5 text-indigo-500" />
            <span>{isEn ? 'Expand All' : '全部展开'}</span>
          </button>
          <button
            onClick={() => {
              const states: Record<string, boolean> = { basic: false };
              sections.forEach(sec => { states[sec.id] = false; });
              setExpandedSections(states);
            }}
            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-[11px] font-bold text-slate-600 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-xs"
            title={isEn ? 'Collapse all sections' : '一键折叠所有模块'}
          >
            <ChevronsUp className="w-3.5 h-3.5 text-slate-500" />
            <span>{isEn ? 'Collapse All' : '全部折叠'}</span>
          </button>
        </div>
      </div>

      {/* Row 2: Section Quick Jumping */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full min-w-0 py-0.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap pl-1 flex items-center gap-1 shrink-0">
          <span>{isEn ? 'Jump to:' : '跳转模块：'}</span>
        </span>
        <button
          onClick={() => {
            document.getElementById('form-sec-basic')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
          className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg transition-all shadow-xs whitespace-nowrap cursor-pointer flex items-center gap-1 hover:border-slate-300 hover:text-slate-800 shrink-0"
        >
          <User className="w-3 h-3 text-slate-400" />
          <span>{isEn ? 'Basic Info' : '基本信息'}</span>
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
            className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg transition-all shadow-xs whitespace-nowrap cursor-pointer flex items-center gap-1 hover:border-slate-300 hover:text-slate-800 shrink-0"
          >
            {getSectionIcon(sec.title)}
            <span>{translateSectionTitle(sec.title, lang)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
