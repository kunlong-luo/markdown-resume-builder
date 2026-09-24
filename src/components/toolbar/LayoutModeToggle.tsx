import React from 'react';
import { motion } from 'motion/react';
import { Maximize2, Columns, Eye } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { Tooltip } from '../ui/Tooltip';
import { TOOLBAR_TRANSLATIONS } from './toolbar-presets';

export function LayoutModeToggle() {
  const { settings, updateSetting } = useResumeStore();
  const isEn = settings.lang === 'en';
  const t = isEn ? TOOLBAR_TRANSLATIONS.en : TOOLBAR_TRANSLATIONS.zh;

  return (
    <div className="relative bg-slate-100 dark:bg-slate-800/90 p-0.5 rounded-lg flex items-center text-[11px] shrink-0 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
      <Tooltip content={t.editorOnly}>
        <button
          onClick={() => updateSetting('layoutMode', 'editor')}
          className={`relative flex items-center px-2 py-1 rounded-md font-bold transition-colors cursor-pointer z-10 ${
            settings.layoutMode === 'editor' ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          {settings.layoutMode === 'editor' && (
            <motion.div
              layoutId="layoutModeCapsule"
              className="absolute inset-0 bg-white dark:bg-slate-700 rounded-md shadow-xs z-[-1]"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <Maximize2 className="w-3 h-3 shrink-0" />
          <span className="hidden lg:inline ml-1">{t.editorOnly}</span>
        </button>
      </Tooltip>

      <Tooltip content={t.splitView}>
        <button
          onClick={() => updateSetting('layoutMode', 'split')}
          className={`relative flex items-center px-2 py-1 rounded-md font-bold transition-colors cursor-pointer z-10 ${
            settings.layoutMode === 'split' ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          {settings.layoutMode === 'split' && (
            <motion.div
              layoutId="layoutModeCapsule"
              className="absolute inset-0 bg-white dark:bg-slate-700 rounded-md shadow-xs z-[-1]"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <Columns className="w-3 h-3 shrink-0" />
          <span className="hidden lg:inline ml-1">{t.splitView}</span>
        </button>
      </Tooltip>

      <Tooltip content={t.previewOnly}>
        <button
          onClick={() => updateSetting('layoutMode', 'preview')}
          className={`relative flex items-center px-2 py-1 rounded-md font-bold transition-colors cursor-pointer z-10 ${
            settings.layoutMode === 'preview' ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          {settings.layoutMode === 'preview' && (
            <motion.div
              layoutId="layoutModeCapsule"
              className="absolute inset-0 bg-white dark:bg-slate-700 rounded-md shadow-xs z-[-1]"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <Eye className="w-3 h-3 shrink-0" />
          <span className="hidden lg:inline ml-1">{t.previewOnly}</span>
        </button>
      </Tooltip>
    </div>
  );
}
