import React, { useState } from 'react';
import { SlidersHorizontal, LayoutGrid } from 'lucide-react';
import { ResumeSettings, TemplateLayout, H2Style } from '../../types';
import { TEMPLATES } from '../../data';
import { useResumeStore } from '../../store/useResumeStore';
import { useConfirm } from '../../context/ConfirmContext';
import { CustomSelect, SelectOption } from '../ui/CustomSelect';
import { getTemplatePresentation } from '../../lib/template-presentation';
import {
  MASTER_PRESETS,
  TOOLBAR_TRANSLATIONS,
  findMatchingPresetId
} from './toolbar-presets';

interface ToolbarSelectorsProps {
  onOpenAesthetics: () => void;
  onOpenTemplateCenter: () => void;
}

export function ToolbarSelectors({
  onOpenAesthetics,
  onOpenTemplateCenter,
}: ToolbarSelectorsProps) {
  const {
    settings,
    updateSetting,
    updateSettings,
    currentTemplateId,
    setCurrentTemplateId,
    handleMarkdownChange
  } = useResumeStore();

  const { confirm } = useConfirm();
  const isEn = settings.lang === 'en';
  const t = isEn ? TOOLBAR_TRANSLATIONS.en : TOOLBAR_TRANSLATIONS.zh;

  const [selectedPresetId, setSelectedPresetId] = useState<string>('tech');

  const handleApplyPreset = (presetId: string) => {
    if (!presetId) return;
    if (presetId === 'custom') {
      setSelectedPresetId('custom');
      onOpenAesthetics();
      return;
    }
    const preset = MASTER_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setSelectedPresetId(presetId);
    updateSettings(preset.settings as Partial<ResumeSettings>);
  };

  const handleTemplateChange = async (id: string) => {
    const tmpl = TEMPLATES.find(t => t.id === id);
    if (tmpl) {
      const confirmed = await confirm({
        title: t.confirmLoadTemplateTitle,
        message: t.confirmLoadTemplateMsg(
          getTemplatePresentation(tmpl, isEn ? 'en' : 'zh').name,
        ),
        confirmText: t.confirmBtn,
        cancelText: t.cancelBtn,
        type: 'warning'
      });
      if (confirmed) {
        setCurrentTemplateId(id);
        handleMarkdownChange(tmpl.content, true);
      }
    }
  };

  const currentPreset = findMatchingPresetId(settings, selectedPresetId);

  const presetOptions: SelectOption[] = [
    { value: 'custom', label: t.customStyle },
    ...MASTER_PRESETS.map(p => ({
      value: p.id,
      label: isEn ? p.nameEn : p.name
    }))
  ];

  const templateOptions: SelectOption[] = [
    {
      value: 'custom',
      label: isEn ? 'Custom / Starter' : '自定义 / 起始简历',
      disabled: true,
    },
    ...TEMPLATES.map((tmpl) => ({
      value: tmpl.id,
      label: getTemplatePresentation(tmpl, isEn ? 'en' : 'zh').name,
    })),
  ];

  const layoutOptions: SelectOption[] = [
    { value: 'single', label: t.layoutSingle },
    { value: 'two-column', label: t.layoutDouble },
    { value: 'academic', label: t.layoutAcademic },
    { value: 'modern-card', label: t.layoutModernCard },
  ];

  const titleStyleOptions: SelectOption[] = [
    { value: 'accent-line', label: t.titleStyleLine },
    { value: 'modern-badge', label: t.titleStyleBadge },
    { value: 'minimal-clean', label: t.titleStyleMinimal },
    { value: 'academic-line', label: t.titleStyleAcademic },
    { value: 'bracket-tag', label: t.titleStyleBracket },
  ];

  return (
    <>
      {/* Style Preset Selector */}
      <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200/90 dark:border-slate-800 shrink-0">
        <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500 shrink-0 pointer-events-none" />
        <CustomSelect
          value={currentPreset}
          onChange={handleApplyPreset}
          options={presetOptions}
          placeholder={t.customStyle}
          size="xs"
          triggerClassName="bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-200/80 dark:border-indigo-800/60 text-indigo-950 dark:text-indigo-300 font-bold text-[11px] h-7 rounded-lg hover:bg-indigo-100/80 dark:hover:bg-indigo-900/60 shadow-2xs"
        />
      </div>

      {/* Template Selector + Visual Library */}
      <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200/90 dark:border-slate-800 shrink-0">
        <LayoutGrid className="w-3.5 h-3.5 text-indigo-500 shrink-0 pointer-events-none" />
        <CustomSelect
          value={currentTemplateId}
          onChange={handleTemplateChange}
          options={templateOptions}
          size="xs"
          triggerClassName="bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-[11px] h-7 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs"
        />
        <button
          type="button"
          onClick={onOpenTemplateCenter}
          aria-label={isEn ? 'Open template library' : '打开模板库'}
          className="h-7 rounded-lg border border-indigo-200/80 bg-indigo-50/80 px-2 text-[10px] font-black text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-800/70 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
        >
          {isEn ? 'Templates' : '模板库'}
        </button>
      </div>

      {/* Template Column Layout Selector */}
      <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200/90 dark:border-slate-800 shrink-0">
        <CustomSelect
          value={settings.templateLayout}
          onChange={(val) => updateSetting('templateLayout', val as TemplateLayout)}
          options={layoutOptions}
          size="xs"
          triggerClassName="bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium text-[11px] h-7 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs"
        />
      </div>

      {/* Title Style Selector */}
      <div className="flex items-center gap-1.5 shrink-0">
        <CustomSelect
          value={settings.h2Style}
          onChange={(val) => updateSetting('h2Style', val as H2Style)}
          options={titleStyleOptions}
          size="xs"
          triggerClassName="bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium text-[11px] h-7 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs"
        />
      </div>
    </>
  );
}
