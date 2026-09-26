import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown, Palette, SlidersHorizontal, Zap } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { smartAutoFit } from '../../lib/preview-utils';
import { Tooltip } from '../ui/Tooltip';
import { TOOLBAR_TRANSLATIONS } from '../toolbar/toolbar-presets';
import { LanguageToggle } from '../toolbar/LanguageToggle';
import { ToolbarSelectors } from '../toolbar/ToolbarSelectors';
import { LayoutModeToggle } from '../toolbar/LayoutModeToggle';
import { LayoutDrawer } from '../toolbar/LayoutDrawer';
import { StyleDrawer } from '../toolbar/StyleDrawer';
import { TemplateCenterModal } from '../templates/TemplateCenterModal';
import { trackAnalyticsEvent } from '../../lib/analytics';

export function Toolbar() {
  const {
    settings,
    updateSetting,
  } = useResumeStore();

  const isEn = settings.lang === 'en';
  const t = isEn ? TOOLBAR_TRANSLATIONS.en : TOOLBAR_TRANSLATIONS.zh;

  const [isLayoutOpen, setIsLayoutOpen] = useState(false);
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const [isTemplateCenterOpen, setIsTemplateCenterOpen] = useState(false);
  const layoutTriggerRef = useRef<HTMLButtonElement>(null);
  const styleTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const openTemplateCenter = () => {
      setIsLayoutOpen(false);
      setIsStyleOpen(false);
      setIsTemplateCenterOpen(true);
    };
    const openLayout = () => {
      setIsTemplateCenterOpen(false);
      setIsStyleOpen(false);
      setIsLayoutOpen(true);
    };
    const openStyle = () => {
      setIsTemplateCenterOpen(false);
      setIsLayoutOpen(false);
      setIsStyleOpen(true);
    };

    window.addEventListener('resume-craft:open-template-center', openTemplateCenter);
    window.addEventListener('resume-craft:open-layout', openLayout);
    window.addEventListener('resume-craft:open-style', openStyle);

    return () => {
      window.removeEventListener('resume-craft:open-template-center', openTemplateCenter);
      window.removeEventListener('resume-craft:open-layout', openLayout);
      window.removeEventListener('resume-craft:open-style', openStyle);
    };
  }, []);

  return (
    <div id="resume-main-toolbar" className="flex items-center justify-between px-2.5 sm:px-6 py-1.5 sm:py-2 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/90 relative z-20 gap-2 sm:gap-3 shadow-[0_1px_2px_rgba(15,23,42,0.02)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] w-full transition-colors duration-200">
      {/* Left Area: Language + Template Library */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs overflow-x-auto scrollbar-none flex-nowrap min-w-0 shrink py-0.5">
        <LanguageToggle />
        <ToolbarSelectors
          onOpenTemplateCenter={() => setIsTemplateCenterOpen(true)}
        />
      </div>

      {/* Right Area: Auto Fit + Typography + View */}
      <div className="flex items-center gap-2.5 text-xs shrink-0 relative flex-nowrap">
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

        <Tooltip content={isEn ? 'Layout, typography, margins, and spacing' : '版面、字体、边距和间距'}>
          <button
            ref={layoutTriggerRef}
            onClick={() => {
              setIsLayoutOpen((open) => !open);
              setIsStyleOpen(false);
            }}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer shrink-0 active:translate-y-px ${
              isLayoutOpen
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-700 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <SlidersHorizontal className={`w-3.5 h-3.5 shrink-0 ${isLayoutOpen ? 'text-white' : 'text-indigo-500'}`} />
            <span>{isEn ? 'Layout' : '排版'}</span>
            <ChevronDown className={`w-3 h-3 shrink-0 ml-0.5 transition-transform duration-200 ${isLayoutOpen ? 'rotate-180' : ''}`} />
          </button>
        </Tooltip>

        <Tooltip content={isEn ? 'Colors, headings, and visual decoration' : '颜色、标题和视觉装饰'}>
          <button
            ref={styleTriggerRef}
            onClick={() => {
              setIsStyleOpen((open) => !open);
              setIsLayoutOpen(false);
            }}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer shrink-0 active:translate-y-px ${
              isStyleOpen
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-700 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <Palette className={`w-3.5 h-3.5 shrink-0 ${isStyleOpen ? 'text-white' : 'text-indigo-500'}`} />
            <span>{isEn ? 'Style' : '样式'}</span>
            <ChevronDown className={`w-3 h-3 shrink-0 ml-0.5 transition-transform duration-200 ${isStyleOpen ? 'rotate-180' : ''}`} />
          </button>
        </Tooltip>

        {/* Layout Mode Toggle Group */}
        <LayoutModeToggle />

        <LayoutDrawer
          isOpen={isLayoutOpen}
          onClose={() => setIsLayoutOpen(false)}
          triggerRef={layoutTriggerRef}
        />

        <StyleDrawer
          isOpen={isStyleOpen}
          onClose={() => setIsStyleOpen(false)}
          triggerRef={styleTriggerRef}
        />

        <TemplateCenterModal
          isOpen={isTemplateCenterOpen}
          onClose={() => setIsTemplateCenterOpen(false)}
        />
      </div>
    </div>
  );
}
