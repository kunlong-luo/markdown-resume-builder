import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';

interface ToolbarSelectorsProps {
  onOpenTemplateCenter: () => void;
}

export function ToolbarSelectors({
  onOpenTemplateCenter,
}: ToolbarSelectorsProps) {
  const { settings } = useResumeStore();
  const isEn = settings.lang === 'en';

  return (
    <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200/90 dark:border-slate-800 shrink-0">
      <button
        type="button"
        onClick={onOpenTemplateCenter}
        aria-label={isEn ? 'Open template library' : '打开模板库'}
        className="flex h-7 items-center gap-1.5 rounded-lg border border-indigo-200/80 bg-indigo-50/80 px-2.5 text-[10px] font-black text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-800/70 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
      >
        <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
        {isEn ? 'Templates' : '模板库'}
      </button>
    </div>
  );
}
