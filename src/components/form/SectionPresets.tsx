
import React from 'react';
import { Briefcase, FolderKanban, GraduationCap, Layers, Award, FileText } from 'lucide-react';

interface SectionPresetsProps {
  onAddPreset: (type: 'work' | 'project' | 'edu' | 'skills' | 'summary' | 'custom_text' | 'custom_items') => void;
  lang?: string;
}

export function SectionPresets({ onAddPreset, lang = 'zh' }: SectionPresetsProps) {
  const isEn = lang === 'en';
  return (
    <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
      {/* 常用标准模板 */}
      <div className="mb-4">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2.5">
          {isEn ? 'Standard Modules' : '常用模块'}
        </span>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
          <button
            onClick={() => onAddPreset('work')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-850 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 rounded-xl text-center transition-all cursor-pointer shadow-[0_1.5px_3px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] dark:shadow-none active:translate-y-px group"
          >
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 dark:text-indigo-400 rounded-lg group-hover:bg-indigo-100/80 dark:group-hover:bg-indigo-900/80 transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
              {isEn ? 'Work Experience' : '工作经历'}
            </span>
          </button>

          <button
            onClick={() => onAddPreset('project')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-850 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-600 rounded-xl text-center transition-all cursor-pointer shadow-[0_1.5px_3px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] dark:shadow-none active:translate-y-px group"
          >
            <div className="p-1.5 bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400 rounded-lg group-hover:bg-amber-100/80 dark:group-hover:bg-amber-900/80 transition-colors">
              <FolderKanban className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-amber-700 dark:group-hover:text-amber-300">
              {isEn ? 'Projects' : '代表项目'}
            </span>
          </button>

          <button
            onClick={() => onAddPreset('edu')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-850 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-600 rounded-xl text-center transition-all cursor-pointer shadow-[0_1.5px_3px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] dark:shadow-none active:translate-y-px group"
          >
            <div className="p-1.5 bg-purple-50 dark:bg-purple-950/60 text-purple-500 dark:text-purple-400 rounded-lg group-hover:bg-purple-100/80 dark:group-hover:bg-purple-900/80 transition-colors">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-300">
              {isEn ? 'Education' : '教育背景'}
            </span>
          </button>

          <button
            onClick={() => onAddPreset('skills')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-850 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600 rounded-xl text-center transition-all cursor-pointer shadow-[0_1.5px_3px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] dark:shadow-none active:translate-y-px group"
          >
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-500 dark:text-blue-400 rounded-lg group-hover:bg-blue-100/80 dark:group-hover:bg-blue-900/80 transition-colors">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300">
              {isEn ? 'Skills' : '专业技能'}
            </span>
          </button>

          <button
            onClick={() => onAddPreset('summary')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-850 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 rounded-xl text-center transition-all cursor-pointer shadow-[0_1.5px_3px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] dark:shadow-none active:translate-y-px group col-span-2 md:col-span-1"
          >
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 dark:text-emerald-400 rounded-lg group-hover:bg-emerald-100/80 dark:group-hover:bg-emerald-900/80 transition-colors">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
              {isEn ? 'Summary' : '自我评价'}
            </span>
          </button>
        </div>
      </div>

      {/* 自定义模块 */}
      <div>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2.5">
          {isEn ? 'Custom Modules' : '自定义模块'}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <button
            onClick={() => onAddPreset('custom_text')}
            className="flex items-center justify-center gap-2.5 p-3 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-850 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-[0_1.5px_3px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] dark:shadow-none active:translate-y-px group"
          >
            <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>{isEn ? 'Custom Text Section' : '文本自由块'}</span>
          </button>
          
          <button
            onClick={() => onAddPreset('custom_items')}
            className="flex items-center justify-center gap-2.5 p-3 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-850 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-[0_1.5px_3px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] dark:shadow-none active:translate-y-px group"
          >
            <Layers className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>{isEn ? 'Custom Itemized Section' : '经历列表块'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
