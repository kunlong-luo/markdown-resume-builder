import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Check } from 'lucide-react';
import { FontSize, PaperMargin, FontFamily, H2Style, ResumeSettings, TemplateLayout } from '../../types';
import { useResumeStore } from '../../store/useResumeStore';
import { CustomSelect, SelectOption } from '../ui/CustomSelect';
import { CustomSlider } from '../ui/CustomSlider';
import { CustomColorPicker } from '../ui/CustomColorPicker';
import {
  MASTER_PRESETS,
  THEME_COLOR_PALETTES,
  TOOLBAR_TRANSLATIONS,
  findMatchingPresetId
} from './toolbar-presets';

interface AestheticsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  exportTitle: string;
}

export function AestheticsDrawer({
  isOpen,
  onClose,
  triggerRef,
  exportTitle
}: AestheticsDrawerProps) {
  const {
    settings,
    updateSetting,
    updateSettings,
    customFileName,
    setCustomFileName
  } = useResumeStore();

  const isEn = settings.lang === 'en';
  const t = isEn ? TOOLBAR_TRANSLATIONS.en : TOOLBAR_TRANSLATIONS.zh;

  const [panelCoords, setPanelCoords] = useState<{ top: number; right: number } | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState('tech');

  const updatePanelPosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const top = rect.bottom + 8;
    const right = Math.max(10, window.innerWidth - rect.right);
    setPanelCoords({ top, right });
  };

  useEffect(() => {
    if (!isOpen) return;
    updatePanelPosition();

    const handleResizeOrScroll = () => {
      updatePanelPosition();
    };

    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, true);
    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll, true);
    };
  }, [isOpen]);

  const currentPreset = findMatchingPresetId(settings, selectedPresetId);

  const presetOptions: SelectOption[] = [
    { value: 'custom', label: t.customStyle },
    ...MASTER_PRESETS.map((preset) => ({
      value: preset.id,
      label: isEn ? preset.nameEn : preset.name,
    })),
  ];

  const layoutOptions: SelectOption[] = [
    { value: 'single', label: t.layoutSingle },
    { value: 'two-column', label: t.layoutDouble },
    { value: 'academic', label: t.layoutAcademic },
    { value: 'modern-card', label: t.layoutModernCard },
  ];

  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === 'custom') return;

    const preset = MASTER_PRESETS.find((item) => item.id === presetId);
    if (preset) {
      updateSettings(preset.settings as Partial<ResumeSettings>);
    }
  };

  const fontFamilyOptions: SelectOption[] = [
    { value: 'sans', label: t.fontSans },
    { value: 'serif', label: t.fontSerif },
    { value: 'mono', label: t.fontMono },
  ];

  const titleStyleOptions: SelectOption[] = [
    { value: 'accent-line', label: t.titleStyleLine },
    { value: 'modern-badge', label: t.titleStyleBadge },
    { value: 'minimal-clean', label: t.titleStyleMinimal },
    { value: 'academic-line', label: t.titleStyleAcademic },
    { value: 'bracket-tag', label: t.titleStyleBracket },
  ];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && panelCoords && (
        <>
          {/* High-priority click outside backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[120] bg-slate-900/10 dark:bg-black/40 backdrop-blur-[0.5px] cursor-default"
            onClick={onClose}
          />

          {/* Panel Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            style={{
              position: 'fixed',
              top: `${panelCoords.top}px`,
              right: `${panelCoords.right}px`,
              maxHeight: `calc(100vh - ${panelCoords.top + 16}px)`,
            }}
            className="w-84 sm:w-96 max-w-[calc(100vw-1.25rem)] bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_48px_rgba(15,23,42,0.18),0_4px_16px_rgba(15,23,42,0.06)] dark:shadow-[0_24px_56px_rgba(0,0,0,0.6)] rounded-2xl p-4 sm:p-5 z-[130] flex flex-col gap-4 scrollbar-thin overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 shrink-0">
              <div className="flex items-center gap-1.5 font-extrabold text-slate-800 dark:text-white">
                <Palette className="w-4 h-4 text-indigo-500" />
                <span>{t.aestheticsLabel}</span>
              </div>
              <button
                onClick={onClose}
                className="text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 px-2.5 py-1 rounded-md transition-all shadow-[0_1px_2px_rgba(15,23,42,0.02),inset_0_1.5px_2px_rgba(255,255,255,0.95)] active:translate-y-px cursor-pointer"
              >
                {t.doneBtn}
              </button>
            </div>

            {/* Single smooth scroll area with distinct structural hierarchy */}
            <div className="space-y-4">
              {/* 1. Preset & layout */}
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-750 dark:bg-slate-800/60">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {isEn ? 'Style preset' : '风格预设'}
                  </label>
                  <CustomSelect
                    value={currentPreset}
                    onChange={handlePresetChange}
                    options={presetOptions}
                    size="sm"
                    triggerClassName="w-full bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {isEn ? 'Page layout' : '版面结构'}
                  </label>
                  <CustomSelect
                    value={settings.templateLayout}
                    onChange={(value) => updateSetting('templateLayout', value as TemplateLayout)}
                    options={layoutOptions}
                    size="sm"
                    triggerClassName="w-full bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1 text-xs"
                  />
                </div>
              </div>

              {/* 2. Visual Accent & Colors */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {t.visualLabel}
                </label>
                <div className="flex flex-wrap items-center gap-2 bg-slate-50/80 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-750">
                  {THEME_COLOR_PALETTES.map((color) => (
                    <motion.button
                      key={color.name}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateSetting('themeColor', color.name)}
                      className={`w-5 h-5 rounded-full ${color.bg} relative transition-shadow focus:outline-none cursor-pointer ${
                        settings.themeColor === color.name
                          ? `ring-2 ring-offset-2 ${color.ring}`
                          : 'opacity-85 hover:opacity-100'
                      }`}
                      title={`${color.name.toUpperCase()} Accent`}
                    >
                      {settings.themeColor === color.name && (
                        <Check className="w-2.5 h-2.5 text-white absolute inset-0 m-auto stroke-[5px]" />
                      )}
                    </motion.button>
                  ))}

                  {/* Custom Color Selector */}
                  <div className="flex items-center gap-1.5 ml-1 pl-1.5 border-l border-slate-200 dark:border-slate-700">
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        updateSetting('themeColor', 'custom');
                        if (!settings.customColor) {
                          updateSetting('customColor', '#4f46e5');
                        }
                      }}
                      className={`w-5 h-5 rounded-full relative transition-shadow focus:outline-none flex items-center justify-center border border-slate-300 dark:border-slate-600 cursor-pointer ${
                        settings.themeColor === 'custom'
                          ? 'ring-2 ring-indigo-600/40 ring-offset-2'
                          : 'opacity-85 hover:opacity-100'
                      }`}
                      style={{
                        background:
                          settings.themeColor === 'custom'
                            ? settings.customColor || '#4f46e5'
                            : 'conic-gradient(from 0deg, red, yellow, green, cyan, blue, magenta, red)',
                      }}
                      title={t.customColorTitle}
                    >
                      {settings.themeColor === 'custom' && (
                        <Check className="w-2.5 h-2.5 text-white absolute inset-0 m-auto stroke-[5px]" />
                      )}
                    </motion.button>
                    {settings.themeColor === 'custom' && (
                      <div className="flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-150">
                        <CustomColorPicker
                          value={settings.customColor || '#4f46e5'}
                          onChange={(color) => updateSetting('customColor', color)}
                          size="xs"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Fonts and Font Size */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {t.fontSelection}
                  </label>
                  <CustomSelect
                    value={settings.fontFamily}
                    onChange={(val) => updateSetting('fontFamily', val as FontFamily)}
                    options={fontFamilyOptions}
                    size="sm"
                    triggerClassName="w-full bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {t.fontSizeLabel}
                  </label>
                  <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg flex items-center h-[28px] border border-slate-200/60 dark:border-slate-700/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                    {(['compact', 'standard', 'relaxed'] as FontSize[]).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => updateSetting('fontSize', sz)}
                        className={`flex-1 text-center py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                          settings.fontSize === sz
                            ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs border border-slate-200/50 dark:border-slate-600'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        {sz === 'compact' ? t.fontSizeCompact : sz === 'standard' ? t.fontSizeStandard : t.fontSizeRelaxed}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Margins & Title Style */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {t.marginLabel}
                  </label>
                  <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg flex items-center h-[28px] border border-slate-200/60 dark:border-slate-700/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                    {(['compact', 'standard', 'relaxed'] as PaperMargin[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => updateSetting('margin', m)}
                        className={`flex-1 text-center py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                          settings.margin === m
                            ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs border border-slate-200/50 dark:border-slate-600'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        {m === 'compact' ? t.marginCompact : m === 'standard' ? t.marginStandard : t.marginRelaxed}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {t.titleStyleLabel}
                  </label>
                  <CustomSelect
                    value={settings.h2Style}
                    onChange={(val) => updateSetting('h2Style', val as H2Style)}
                    options={titleStyleOptions}
                    size="sm"
                    triggerClassName="w-full bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1 text-xs"
                  />
                </div>
              </div>

              {/* 5. Layout Aids */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {t.layoutAids}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateSetting('topAccentLine', !settings.topAccentLine)}
                    className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer h-[28px] active:translate-y-px truncate ${
                      settings.topAccentLine
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60 shadow-[0_1px_2px_rgba(59,130,246,0.05),inset_0_1.5px_2px_rgba(255,255,255,0.95)]'
                        : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.02)] hover:bg-slate-50 dark:hover:bg-slate-750'
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        settings.topAccentLine ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    />
                    <span className="truncate">{t.topAccentBtn}</span>
                  </button>
                  <button
                    onClick={() => updateSetting('showPageBreakLine', !settings.showPageBreakLine)}
                    className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer h-[28px] active:translate-y-px truncate ${
                      settings.showPageBreakLine
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/60 shadow-[0_1px_2px_rgba(244,63,94,0.05),inset_0_1.5px_2px_rgba(255,255,255,0.95)]'
                        : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.02)] hover:bg-slate-50 dark:hover:bg-slate-750'
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        settings.showPageBreakLine ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'
                      }`}
                    />
                    <span className="truncate">{t.pageBreakBtn}</span>
                  </button>
                </div>
              </div>

              {/* Export File Name on Mobile / Smaller popup widths */}
              <div className="flex sm:hidden flex-col gap-1.5 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-750">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {t.exportNameLabel}
                </span>
                <input
                  type="text"
                  value={customFileName}
                  onChange={(e) => setCustomFileName(e.target.value)}
                  placeholder={`${exportTitle}_简历`}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg py-1 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-xs w-full hover:border-slate-300 transition-colors"
                />
              </div>

              {/* 6. Fine Spacing Adjustments */}
              <div className="space-y-3 bg-slate-50/80 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-750">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {t.spacingLabel}
                  </label>
                  <button
                    onClick={() => {
                      updateSetting('lineHeight', 1.6);
                      updateSetting('blockGap', 1.0);
                      updateSetting('letterSpacing', 0.0);
                    }}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold transition-all cursor-pointer"
                  >
                    {t.resetBtn}
                  </button>
                </div>

                {/* Quick Spacing Rhythm Presets */}
                <div className="grid grid-cols-3 gap-1.5 bg-white dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                  <button
                    onClick={() => {
                      updateSetting('lineHeight', 1.4);
                      updateSetting('blockGap', 0.6);
                      updateSetting('letterSpacing', -0.01);
                    }}
                    className={`py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                      settings.lineHeight <= 1.45 && settings.blockGap <= 0.7
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 shadow-2xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {t.compactPreset}
                  </button>
                  <button
                    onClick={() => {
                      updateSetting('lineHeight', 1.6);
                      updateSetting('blockGap', 1.0);
                      updateSetting('letterSpacing', 0.0);
                    }}
                    className={`py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                      settings.lineHeight > 1.45 &&
                      settings.lineHeight < 1.75 &&
                      settings.blockGap > 0.7 &&
                      settings.blockGap < 1.2
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 shadow-2xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {t.normalPreset}
                  </button>
                  <button
                    onClick={() => {
                      updateSetting('lineHeight', 1.8);
                      updateSetting('blockGap', 1.3);
                      updateSetting('letterSpacing', 0.01);
                    }}
                    className={`py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                      settings.lineHeight >= 1.75 || settings.blockGap >= 1.2
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 shadow-2xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {t.spaciousPreset}
                  </button>
                </div>

                {/* Line Height Slider */}
                <div className="space-y-1">
                  <CustomSlider
                    label={t.lineHeightLabel}
                    value={settings.lineHeight}
                    onChange={(val) => updateSetting('lineHeight', val)}
                    min={1.2}
                    max={2.2}
                    step={0.05}
                    valueDisplay={settings.lineHeight.toFixed(2)}
                    size="sm"
                  />
                </div>

                {/* Block Gap Slider */}
                <div className="space-y-1">
                  <CustomSlider
                    label={t.blockGapLabel}
                    value={settings.blockGap}
                    onChange={(val) => updateSetting('blockGap', val)}
                    min={0.3}
                    max={2.0}
                    step={0.05}
                    valueDisplay={settings.blockGap.toFixed(2)}
                    size="sm"
                  />
                </div>

                {/* Letter Spacing Slider */}
                <div className="space-y-1">
                  <CustomSlider
                    label={t.letterSpacingLabel}
                    value={settings.letterSpacing}
                    onChange={(val) => updateSetting('letterSpacing', val)}
                    min={-0.04}
                    max={0.12}
                    step={0.01}
                    valueDisplay={`${settings.letterSpacing > 0 ? '+' : ''}${settings.letterSpacing.toFixed(2)}`}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
