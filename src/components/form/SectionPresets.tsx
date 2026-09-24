import React from 'react';
import { FileText, ListOrdered } from 'lucide-react';
import { getPresetTheme } from '../../lib/section-themes';
import { getTranslation } from '../../i18n';

interface SectionPresetsProps {
  onAddPreset: (type: 'summary' | 'skills' | 'work' | 'project' | 'edu' | 'custom_text' | 'custom_items') => void;
  lang?: string;
}

export function SectionPresets({ onAddPreset, lang = 'zh' }: SectionPresetsProps) {
  const activeLang = lang === 'en' ? 'en' : 'zh';
  const translations = getTranslation(activeLang);
  const isEn = activeLang === 'en';
  const t = translations.form.section;

  const presets = [
    { type: 'summary' as const, label: isEn ? 'Summary / Strengths' : '个人优势' },
    { type: 'skills' as const, label: isEn ? 'Skills' : '专业技能' },
    { type: 'work' as const, label: isEn ? 'Work Experience' : '工作经历' },
    { type: 'project' as const, label: isEn ? 'Projects' : '代表项目' },
    { type: 'edu' as const, label: isEn ? 'Education' : '教育背景' },
  ];

  return (
    <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
      {/* 常用标准模板 */}
      <div className="mb-4">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2.5">
          {t.standardModules}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {presets.map(item => {
            const theme = getPresetTheme(item.type, lang);
            const Icon = theme.icon;
            return (
              <button
                key={item.type}
                onClick={() => onAddPreset(item.type)}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-850 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 ${theme.hoverBorder} rounded-xl text-center transition-all cursor-pointer shadow-[0_1.5px_3px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] dark:shadow-none active:translate-y-px group`}
              >
                <div className={`p-1.5 ${theme.iconBg} ${theme.iconColor} rounded-lg transition-colors`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 自定义模块 */}
      <div>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2.5">
          {t.customModules}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <button
            onClick={() => onAddPreset('custom_text')}
            className="flex items-center justify-center gap-2.5 p-3 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-850 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-[0_1.5px_3px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] dark:shadow-none active:translate-y-px group"
          >
            <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>{t.customTextSection}</span>
          </button>
          
          <button
            onClick={() => onAddPreset('custom_items')}
            className="flex items-center justify-center gap-2.5 p-3 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-850 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-[0_1.5px_3px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] dark:shadow-none active:translate-y-px group"
          >
            <ListOrdered className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>{t.customItemSection}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
