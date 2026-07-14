
import React from 'react';
import { Briefcase, Sparkles, GraduationCap, Layers, Award, FileText } from 'lucide-react';

interface SectionPresetsProps {
  onAddPreset: (type: 'work' | 'project' | 'edu' | 'skills' | 'summary' | 'custom_text' | 'custom_items') => void;
  lang?: string;
}

export function SectionPresets({ onAddPreset, lang = 'zh' }: SectionPresetsProps) {
  const isEn = lang === 'en';
  return (
    <div className="pt-6 border-t border-slate-200">
      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">
        {isEn ? 'Add New Section / Resume Block' : '添加新版块 / 简历模块'}
      </label>
      
      {/* 常用标准模板 */}
      <div className="mb-4">
        <span className="text-[10px] font-bold text-slate-400 block mb-2">
          {isEn ? 'Standard Resume Blocks (Recommended):' : '常用标准板块 (推荐)：'}
        </span>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
          <button
            onClick={() => onAddPreset('work')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/80 hover:border-indigo-300 rounded-xl text-center transition-all cursor-pointer shadow-[0_1.5px_3px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:shadow-[0_4px_10px_rgba(99,102,241,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.95)] active:translate-y-px group"
          >
            <div className="p-1.5 bg-indigo-50 text-indigo-500 rounded-lg group-hover:bg-indigo-100/80 transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-700">
              {isEn ? 'Work Experience' : '工作经历'}
            </span>
          </button>

          <button
            onClick={() => onAddPreset('project')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/80 hover:border-amber-300 rounded-xl text-center transition-all cursor-pointer shadow-[0_1.5px_3px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:shadow-[0_4px_10px_rgba(245,158,11,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.95)] active:translate-y-px group"
          >
            <div className="p-1.5 bg-amber-50 text-amber-500 rounded-lg group-hover:bg-amber-100/80 transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 group-hover:text-amber-700">
              {isEn ? 'Projects' : '项目经验'}
            </span>
          </button>

          <button
            onClick={() => onAddPreset('edu')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/80 hover:border-purple-300 rounded-xl text-center transition-all cursor-pointer shadow-[0_1.5px_3px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:shadow-[0_4px_10px_rgba(168,85,247,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.95)] active:translate-y-px group"
          >
            <div className="p-1.5 bg-purple-50 text-purple-500 rounded-lg group-hover:bg-purple-100/80 transition-colors">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 group-hover:text-purple-700">
              {isEn ? 'Education' : '教育背景'}
            </span>
          </button>

          <button
            onClick={() => onAddPreset('skills')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/80 hover:border-blue-300 rounded-xl text-center transition-all cursor-pointer shadow-[0_1.5px_3px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:shadow-[0_4px_10px_rgba(59,130,246,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.95)] active:translate-y-px group"
          >
            <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-100/80 transition-colors">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">
              {isEn ? 'Skills' : '专业技能'}
            </span>
          </button>

          <button
            onClick={() => onAddPreset('summary')}
            className="flex flex-col items-center justify-center gap-1.5 p-3 bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/80 hover:border-emerald-300 rounded-xl text-center transition-all cursor-pointer shadow-[0_1.5px_3px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:shadow-[0_4px_10px_rgba(16,185,129,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.95)] active:translate-y-px group col-span-2 md:col-span-1"
          >
            <div className="p-1.5 bg-emerald-50 text-emerald-500 rounded-lg group-hover:bg-emerald-100/80 transition-colors">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-700">
              {isEn ? 'Summary' : '自我评价'}
            </span>
          </button>
        </div>
      </div>

      {/* 自定义排版块 */}
      <div>
        <span className="text-[10px] font-bold text-slate-400 block mb-2">
          {isEn ? 'Custom Blocks:' : '自定义板块：'}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <button
            onClick={() => onAddPreset('custom_text')}
            className="flex items-center justify-center gap-2.5 p-3 bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/80 hover:border-slate-350 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-[0_1.5px_3px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] active:translate-y-px group"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>{isEn ? 'Single-Text Section' : '自定义单段文本'}</span>
          </button>
          
          <button
            onClick={() => onAddPreset('custom_items')}
            className="flex items-center justify-center gap-2.5 p-3 bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/80 hover:border-slate-350 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-[0_1.5px_3px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] active:translate-y-px group"
          >
            <Layers className="w-4 h-4 text-slate-500" />
            <span>{isEn ? 'Multi-Item Section' : '自定义多项列表'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
