import React, { useState, useRef } from 'react';
import { Sliders, ChevronDown, Zap } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { smartAutoFit } from '../../lib/preview-utils';
import { Tooltip } from '../ui/Tooltip';
import { TOOLBAR_TRANSLATIONS } from '../toolbar/toolbar-presets';
import { LanguageToggle } from '../toolbar/LanguageToggle';
import { ToolbarSelectors } from '../toolbar/ToolbarSelectors';
import { LayoutModeToggle } from '../toolbar/LayoutModeToggle';
import { AestheticsDrawer } from '../toolbar/AestheticsDrawer';
import { trackAnalyticsEvent } from '../../lib/analytics';

export function Toolbar() {
  const {
    settings,
    updateSetting,
    markdown,
    customFileName,
    setCustomFileName
  } = useResumeStore();

  const isEn = settings.lang === 'en';
  const t = isEn ? TOOLBAR_TRANSLATIONS.en : TOOLBAR_TRANSLATIONS.zh;

  const [isAestheticsOpen, setIsAestheticsOpen] = useState(false);
  const aestheticsTriggerRef = useRef<HTMLButtonElement>(null);

  const getExportTitle = () => {
    if (customFileName.trim()) {
      return customFileName.trim().replace(/[\\\/:*?"<>|]/g, '-');
    }
    const firstLine = markdown.trim().split('\n')[0];
    if (firstLine && firstLine.startsWith('# ')) {
      const parsedName = firstLine.replace('# ', '').trim();
      if (parsedName) {
        return parsedName.replace(/[\\\/:*?"<>|]/g, '-');
      }
    }
    return 'resume';
  };

  const exportTitle = getExportTitle();

  return (
    <div className="flex items-center justify-between px-2.5 sm:px-6 py-1.5 sm:py-2 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/90 relative z-20 gap-2 sm:gap-3 shadow-[0_1px_2px_rgba(15,23,42,0.02)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] w-full transition-colors duration-200">
      {/* Left Area: Language + Preset + Template + Column Layout + Title Style */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs overflow-x-auto scrollbar-none flex-nowrap min-w-0 shrink py-0.5">
        <LanguageToggle />
        <ToolbarSelectors onOpenAesthetics={() => setIsAestheticsOpen(true)} />
      </div>

      {/* Right Area: File Name + 1-Click AutoFit + Aesthetics Panel Trigger + Layout Mode Toggle */}
      <div className="flex items-center gap-2.5 text-xs shrink-0 relative flex-nowrap">
        {/* Custom File Name Input */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <span className="font-bold text-slate-500 dark:text-slate-400 text-[11px]">
            {t.exportNameLabel}
          </span>
          <input
            type="text"
            value={customFileName}
            onChange={(e) => setCustomFileName(e.target.value)}
            placeholder={`${exportTitle}_简历`}
            className="bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg py-1 px-2.5 font-semibold text-[11px] hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-2xs focus:shadow-none focus:outline-none focus:ring-1.5 focus:ring-indigo-500 w-28"
          />
        </div>

        {/* 1-Click Auto Fit Button */}
        <Tooltip content={t.autoFitTooltip}>
          <button
            onClick={() => {
              smartAutoFit(settings, (key, val) => updateSetting(key, val));
              trackAnalyticsEvent('auto_fit_used');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 shadow-2xs transition-all cursor-pointer shrink-0 active:translate-y-px"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{t.autoFitBtn}</span>
          </button>
        </Tooltip>

        {/* Aesthetics Panel Toggle Button */}
        <Tooltip content={t.aestheticsTooltip}>
          <button
            ref={aestheticsTriggerRef}
            onClick={() => setIsAestheticsOpen((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer shrink-0 active:translate-y-px ${
              isAestheticsOpen
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-700 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <Sliders
              className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                isAestheticsOpen ? 'rotate-90 text-white' : 'text-indigo-500'
              }`}
            />
            <span>{t.aestheticsLabel}</span>
            <ChevronDown
              className={`w-3 h-3 shrink-0 ml-0.5 transition-transform duration-200 ${
                isAestheticsOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </Tooltip>

        {/* Layout Mode Toggle Group */}
        <LayoutModeToggle />

        {/* Aesthetics Drawer Modal via Portal */}
        <AestheticsDrawer
          isOpen={isAestheticsOpen}
          onClose={() => setIsAestheticsOpen(false)}
          triggerRef={aestheticsTriggerRef}
          exportTitle={exportTitle}
        />
      </div>
    </div>
  );
}
