import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, Sliders, SlidersHorizontal, Check, Settings, Maximize2, Columns, Eye, Globe, ChevronDown, Palette, Zap } from 'lucide-react';
import { ResumeSettings, ThemeColor, FontSize, PaperMargin, FontFamily, TemplateLayout, H2Style } from '../../types';
import { TEMPLATES } from '../../data';
import { useResumeStore } from '../../store/useResumeStore';
import { useConfirm } from '../../context/ConfirmContext';
import { smartAutoFit } from '../../lib/preview-utils';
import { CustomSelect, SelectOption } from '../ui/CustomSelect';
import { CustomSlider } from '../ui/CustomSlider';
import { CustomColorPicker } from '../ui/CustomColorPicker';
import { Tooltip } from '../ui/Tooltip';
import { useTranslation } from '../../i18n';

const MASTER_PRESETS = [
  {
    id: 'finance',
    name: '金融咨询',
    settings: {
      themeColor: 'custom',
      customColor: '#0F2942',
      fontFamily: 'serif',
      fontSize: 'standard',
      lineHeight: 1.55,
      blockGap: 0.9,
      letterSpacing: 0.02,
      h2Style: 'accent-line',
      templateLayout: 'single',
      margin: 'standard',
      topAccentLine: true
    }
  },
  {
    id: 'tech',
    name: '互联网科技',
    settings: {
      themeColor: 'indigo',
      customColor: '#4F46E5',
      fontFamily: 'sans',
      fontSize: 'standard',
      lineHeight: 1.6,
      blockGap: 1.0,
      letterSpacing: 0.0,
      h2Style: 'accent-line',
      templateLayout: 'single',
      margin: 'standard',
      topAccentLine: true
    }
  },
  {
    id: 'latex_academic',
    name: '学术科研',
    settings: {
      themeColor: 'slate',
      customColor: '#1E293B',
      fontFamily: 'serif',
      fontSize: 'compact',
      lineHeight: 1.45,
      blockGap: 0.7,
      letterSpacing: -0.01,
      h2Style: 'academic-line',
      templateLayout: 'academic',
      margin: 'standard',
      topAccentLine: false
    }
  },
  {
    id: 'modern_cards',
    name: '卡片矩阵',
    settings: {
      themeColor: 'teal',
      customColor: '#0D9488',
      fontFamily: 'sans',
      fontSize: 'standard',
      lineHeight: 1.55,
      blockGap: 0.85,
      letterSpacing: 0.0,
      h2Style: 'modern-badge',
      templateLayout: 'modern-card',
      margin: 'standard',
      topAccentLine: true
    }
  },
  {
    id: 'cambridge_green',
    name: '名校典雅',
    settings: {
      themeColor: 'custom',
      customColor: '#14532D',
      fontFamily: 'serif',
      fontSize: 'standard',
      lineHeight: 1.55,
      blockGap: 0.85,
      letterSpacing: 0.01,
      h2Style: 'accent-line',
      templateLayout: 'single',
      margin: 'standard',
      topAccentLine: true
    }
  },
  {
    id: 'executive',
    name: '综合管理',
    settings: {
      themeColor: 'custom',
      customColor: '#8D6037',
      fontFamily: 'sans',
      fontSize: 'standard',
      lineHeight: 1.6,
      blockGap: 1.0,
      letterSpacing: 0.01,
      h2Style: 'accent-line',
      templateLayout: 'single',
      margin: 'standard',
      topAccentLine: true
    }
  }
];

// Refactored to use useResumeStore instead of props

const TRANSLATIONS = {
  zh: {
    presetLabel: '风格预设',
    layoutLabel: '版面结构',
    templatePrefix: '模版：',
    layoutSingle: '单栏标准',
    layoutDouble: '双栏现代',
    layoutAcademic: '学术 LaTeX',
    layoutModernCard: '卡片模块',
    titleStyleLine: '强调下划线',
    titleStyleBadge: '胶囊底色标',
    titleStyleMinimal: '极简素雅',
    titleStyleAcademic: '学术双横线',
    titleStyleBracket: '现代方括号',
    visualLabel: '视觉细节',
    customColorTitle: '自定义颜色 (Hex)',
    customColorPlaceholder: '#HEX',
    fontSans: '经典黑体 (无衬线)',
    fontSerif: '优雅宋体 (衬线)',
    fontMono: '极客等宽 (技术)',
    fontSizeLabel: '字号:',
    fontSizeCompact: '紧凑',
    fontSizeStandard: '标准',
    fontSizeRelaxed: '宽松',
    marginLabel: '边距:',
    marginCompact: '窄',
    marginStandard: '中',
    marginRelaxed: '宽',
    topAccentBtn: '顶部线',
    spacingLabel: '间距微调',
    lineHeightLabel: '行高',
    blockGapLabel: '段距',
    letterSpacingLabel: '字距',
    pageBreakBtn: '折页线',
    resetBtn: '重置',
    exportNameLabel: '命名:',
    editorOnly: '仅编辑',
    splitView: '分屏',
    previewOnly: '仅预览',
    autoFitBtn: '智能单页',
    autoFitSuccess: '已完成智能压缩',
    aestheticsLabel: '排版设置',
    aestheticsTooltip: '排版样式微调',
    doneBtn: '完成',
    fontSelection: '字体选择',
    layoutAids: '排版辅助',
  },
  en: {
    presetLabel: 'Presets',
    layoutLabel: 'Layout',
    templatePrefix: 'Template: ',
    layoutSingle: 'Single Col',
    layoutDouble: 'Two Cols',
    layoutAcademic: 'Academic LaTeX',
    layoutModernCard: 'Modern Cards',
    titleStyleLine: 'Underline',
    titleStyleBadge: 'Badge Accent',
    titleStyleMinimal: 'Minimal Clean',
    titleStyleAcademic: 'Academic Line',
    titleStyleBracket: 'Bracket Tag',
    visualLabel: 'Visual Styling',
    customColorTitle: 'Custom Accent Color (Hex)',
    customColorPlaceholder: '#HEX',
    fontSans: 'Sans-Serif (Modern)',
    fontSerif: 'Serif (Classic)',
    fontMono: 'Monospace (Tech)',
    fontSizeLabel: 'Font size:',
    fontSizeCompact: 'Compact',
    fontSizeStandard: 'Standard',
    fontSizeRelaxed: 'Relaxed',
    marginLabel: 'Margin:',
    marginCompact: 'Narrow',
    marginStandard: 'Standard',
    marginRelaxed: 'Wide',
    topAccentBtn: 'Top Line',
    spacingLabel: 'Spacing Adjustments',
    lineHeightLabel: 'Line Height',
    blockGapLabel: 'Section Gap',
    letterSpacingLabel: 'Tracking',
    pageBreakBtn: 'Fold Line',
    resetBtn: 'Reset',
    exportNameLabel: 'File Name:',
    editorOnly: 'Editor Only',
    splitView: 'Split View',
    previewOnly: 'Preview Only',
    autoFitBtn: 'Fit 1 Page',
    autoFitSuccess: 'Auto-fitted to 1 page!',
    aestheticsLabel: 'Typography',
    aestheticsTooltip: 'Typography & Layout Styling',
    doneBtn: 'Done',
    fontSelection: 'Font Selection',
    layoutAids: 'Layout Aids',
  }
};

export function Toolbar() {
  const {
    settings,
    updateSetting,
    updateSettings,
    currentTemplateId,
    setCurrentTemplateId,
    markdown,
    handleMarkdownChange,
    customFileName,
    setCustomFileName
  } = useResumeStore();

  const { confirm } = useConfirm();

  const handleTemplateChange = async (id: string) => {
    const tmpl = TEMPLATES.find(t => t.id === id);
    if (tmpl) {
      const isEn = settings.lang === 'en';
      const confirmed = await confirm({
        title: isEn ? 'Load Template' : '确认加载模板',
        message: isEn 
          ? `Are you sure you want to load the template "${tmpl.name}"? Your current changes will be overwritten.`
          : `确认加载「${tmpl.name}」模版吗？您当前的修改将被覆盖。`,
        confirmText: isEn ? 'Load' : '确认加载',
        cancelText: isEn ? 'Cancel' : '取消',
        type: 'warning'
      });
      if (confirmed) {
        setCurrentTemplateId(id);
        handleMarkdownChange(tmpl.content, true);
      }
    }
  };

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
  const [isAestheticsOpen, setIsAestheticsOpen] = useState(false);
  const aestheticsTriggerRef = useRef<HTMLButtonElement>(null);
  const [panelCoords, setPanelCoords] = useState<{ top: number; right: number } | null>(null);

  const updatePanelPosition = () => {
    if (!aestheticsTriggerRef.current) return;
    const rect = aestheticsTriggerRef.current.getBoundingClientRect();
    const top = rect.bottom + 8;
    const right = Math.max(10, window.innerWidth - rect.right);
    setPanelCoords({ top, right });
  };

  useEffect(() => {
    if (!isAestheticsOpen) return;
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
  }, [isAestheticsOpen]);

  const handleToggleAesthetics = () => {
    if (!isAestheticsOpen) {
      updatePanelPosition();
      setIsAestheticsOpen(true);
    } else {
      setIsAestheticsOpen(false);
    }
  };

  const colors: { name: ThemeColor; bg: string; ring: string }[] = [
    { name: 'blue', bg: 'bg-blue-600', ring: 'ring-blue-600/30' },
    { name: 'indigo', bg: 'bg-indigo-600', ring: 'ring-indigo-600/30' },
    { name: 'teal', bg: 'bg-teal-600', ring: 'ring-teal-600/30' },
    { name: 'emerald', bg: 'bg-emerald-600', ring: 'ring-emerald-600/30' },
    { name: 'slate', bg: 'bg-slate-700', ring: 'ring-slate-700/30' },
    { name: 'bronze', bg: 'bg-[rgb(141,96,55)]', ring: 'ring-[rgb(141,96,55)]/30' },
    { name: 'crimson', bg: 'bg-rose-600', ring: 'ring-rose-600/30' },
    { name: 'amber', bg: 'bg-amber-600', ring: 'ring-amber-600/30' },
  ];

  const [selectedPresetId, setSelectedPresetId] = useState<string>('tech');

  const handleApplyPreset = (presetId: string) => {
    if (!presetId) return;
    if (presetId === 'custom') {
      setSelectedPresetId('custom');
      // Open the aesthetics panel so user can customize settings
      setIsAestheticsOpen(true);
      return;
    }
    const preset = MASTER_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    
    setSelectedPresetId(presetId);
    // Apply all settings in the preset at once!
    updateSettings(preset.settings as Partial<ResumeSettings>);
  };

  const getCurrentPresetId = () => {
    // If selectedPresetId still matches active settings, return it
    if (selectedPresetId && selectedPresetId !== 'custom') {
      const active = MASTER_PRESETS.find(p => p.id === selectedPresetId);
      if (active) {
        const matches = Object.entries(active.settings).every(([key, val]) => {
          if (key === 'customColor') {
            return String(settings.customColor || '').toLowerCase() === String(val).toLowerCase();
          }
          return settings[key as keyof ResumeSettings] === val;
        });
        if (matches) return selectedPresetId;
      }
    }

    const matched = MASTER_PRESETS.find(preset => {
      return Object.entries(preset.settings).every(([key, val]) => {
        if (key === 'customColor') {
          return String(settings.customColor || '').toLowerCase() === String(val).toLowerCase();
        }
        return settings[key as keyof ResumeSettings] === val;
      });
    });
    return matched ? matched.id : 'custom';
  };

  const isEn = settings.lang === 'en';
  const t = isEn ? TRANSLATIONS.en : TRANSLATIONS.zh;

  const presetOptions: SelectOption[] = [
    { value: 'custom', label: isEn ? 'Custom Style' : '自定义样式' },
    ...MASTER_PRESETS.map(p => {
      let displayName = p.name;
      if (isEn) {
        if (p.id === 'finance') displayName = 'Finance & Consulting';
        if (p.id === 'tech') displayName = 'Tech & Internet';
        if (p.id === 'latex_academic') displayName = 'Academic & Research';
        if (p.id === 'modern_cards') displayName = 'Modern Cards';
        if (p.id === 'cambridge_green') displayName = 'Cambridge Emerald';
        if (p.id === 'executive') displayName = 'Executive Leadership';
      }
      return { value: p.id, label: displayName };
    })
  ];

  const templateOptions: SelectOption[] = TEMPLATES.map(tmpl => {
    let name = tmpl.name;
    if (isEn) {
      if (tmpl.id === 'ai_backend') name = 'AI Backend Developer';
      if (tmpl.id === 'frontend') name = 'AI Frontend Developer';
      if (tmpl.id === 'pm_lead') name = 'Technical PM / Director';
      if (tmpl.id === 'operations') name = 'Product Operations';
      if (tmpl.id === 'campus') name = 'Campus Graduate';
    }
    return { value: tmpl.id, label: name };
  });

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

  const fontFamilyOptions: SelectOption[] = [
    { value: 'sans', label: t.fontSans },
    { value: 'serif', label: t.fontSerif },
    { value: 'mono', label: t.fontMono },
  ];

  return (
    <div className="flex items-center justify-between px-2.5 sm:px-6 py-1.5 sm:py-2 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/90 relative z-20 gap-2 sm:gap-3 shadow-[0_1px_2px_rgba(15,23,42,0.02)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] w-full transition-colors duration-200">
      <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs overflow-x-auto scrollbar-none flex-nowrap min-w-0 shrink py-0.5">
        {/* Language Selection */}
        <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200/90 dark:border-slate-800 shrink-0">
          <Globe className="w-3.5 h-3.5 text-indigo-500 shrink-0 pointer-events-none" />
          <div className="relative bg-slate-100 dark:bg-slate-800/90 p-0.5 rounded-lg flex items-center border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
            <button
              onClick={() => updateSetting('lang', 'zh')}
              className={`relative px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors cursor-pointer z-10 ${
                settings.lang !== 'en' ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {settings.lang !== 'en' && (
                <motion.div
                  layoutId="langToggleCapsule"
                  className="absolute inset-0 bg-white dark:bg-slate-700 rounded-md shadow-xs z-[-1]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              中
            </button>
            <button
              onClick={() => updateSetting('lang', 'en')}
              className={`relative px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors cursor-pointer z-10 ${
                settings.lang === 'en' ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {settings.lang === 'en' && (
                <motion.div
                  layoutId="langToggleCapsule"
                  className="absolute inset-0 bg-white dark:bg-slate-700 rounded-md shadow-xs z-[-1]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              EN
            </button>
          </div>
        </div>

        {/* Style Preset Selector */}
        <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200/90 dark:border-slate-800 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500 shrink-0 pointer-events-none" />
          <CustomSelect
            value={getCurrentPresetId()}
            onChange={handleApplyPreset}
            options={presetOptions}
            placeholder={isEn ? 'Custom Style' : '自定义样式'}
            size="xs"
            triggerClassName="bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-200/80 dark:border-indigo-800/60 text-indigo-950 dark:text-indigo-300 font-bold text-[11px] h-7 rounded-lg hover:bg-indigo-100/80 dark:hover:bg-indigo-900/60 shadow-2xs"
          />
        </div>

        {/* Template Selector */}
        <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200/90 dark:border-slate-800 shrink-0">
          <LayoutGrid className="w-3.5 h-3.5 text-indigo-500 shrink-0 pointer-events-none" />
          <CustomSelect
            value={currentTemplateId}
            onChange={handleTemplateChange}
            options={templateOptions}
            size="xs"
            triggerClassName="bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-[11px] h-7 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs"
          />
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
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-2.5 text-xs shrink-0 relative flex-nowrap">
        {/* Custom File Name Input */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <span className="font-bold text-slate-500 dark:text-slate-400 text-[11px]">{t.exportNameLabel}</span>
          <input
            type="text"
            value={customFileName}
            onChange={(e) => setCustomFileName(e.target.value)}
            placeholder={`${exportTitle}_简历`}
            className="bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg py-1 px-2.5 font-semibold text-[11px] hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-2xs focus:shadow-none focus:outline-none focus:ring-1.5 focus:ring-indigo-500 w-28"
          />
        </div>

        {/* 1-Click Auto Fit Button */}
        <Tooltip
          content={settings.lang === 'en' ? 'One-Click Auto-Fit Margins & Spacing to 1 Page' : '一键智能紧凑排版，自动微调页边距与行间距'}
        >
          <button
            onClick={() => {
              smartAutoFit(settings, (key, val) => updateSetting(key, val));
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 shadow-2xs transition-all cursor-pointer shrink-0 active:translate-y-px"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{t.autoFitBtn}</span>
          </button>
        </Tooltip>

        {/* Aesthetics Panel Toggle Button */}
        <Tooltip
          content={t.aestheticsTooltip}
        >
          <button
            ref={aestheticsTriggerRef}
            onClick={handleToggleAesthetics}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer shrink-0 active:translate-y-px ${
              isAestheticsOpen
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-700 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <Sliders className={`w-3.5 h-3.5 shrink-0 transition-transform ${isAestheticsOpen ? 'rotate-90 text-white' : 'text-indigo-500'}`} />
            <span>{t.aestheticsLabel}</span>
            <ChevronDown className={`w-3 h-3 shrink-0 ml-0.5 transition-transform duration-200 ${isAestheticsOpen ? 'rotate-180' : ''}`} />
          </button>
        </Tooltip>

        {/* Layout Mode Toggle Group */}
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

        {/* Aesthetics Popover Panel via Portal */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {isAestheticsOpen && panelCoords && (
              <>
                {/* High-priority click outside backdrop */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-0 z-[120] bg-slate-900/10 dark:bg-black/40 backdrop-blur-[0.5px] cursor-default" 
                  onClick={() => setIsAestheticsOpen(false)} 
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
                    onClick={() => setIsAestheticsOpen(false)}
                    className="text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 px-2.5 py-1 rounded-md transition-all shadow-[0_1px_2px_rgba(15,23,42,0.02),inset_0_1.5px_2px_rgba(255,255,255,0.95)] active:translate-y-px cursor-pointer"
                  >
                    {t.doneBtn}
                  </button>
                </div>

                {/* Single smooth scroll area with distinct structural hierarchy */}
                <div className="space-y-4">
                  {/* 1. Visual Accent & Colors */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.visualLabel}</label>
                    <div className="flex flex-wrap items-center gap-2 bg-slate-50/80 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-750">
                      {colors.map(color => (
                        <motion.button
                          key={color.name}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateSetting('themeColor', color.name)}
                          className={`w-5 h-5 rounded-full ${color.bg} relative transition-shadow focus:outline-none cursor-pointer ${
                            settings.themeColor === color.name ? `ring-2 ring-offset-2 ${color.ring}` : 'opacity-85 hover:opacity-100'
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
                            settings.themeColor === 'custom' ? 'ring-2 ring-indigo-600/40 ring-offset-2' : 'opacity-85 hover:opacity-100'
                          }`}
                          style={{ background: settings.themeColor === 'custom' ? (settings.customColor || '#4f46e5') : 'conic-gradient(from 0deg, red, yellow, green, cyan, blue, magenta, red)' }}
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

                {/* 2. Fonts and Font Size */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.fontSelection}</label>
                    <CustomSelect
                      value={settings.fontFamily}
                      onChange={(val) => updateSetting('fontFamily', val as FontFamily)}
                      options={fontFamilyOptions}
                      size="sm"
                      triggerClassName="w-full bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.fontSizeLabel}</label>
                    <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg flex items-center h-[28px] border border-slate-200/60 dark:border-slate-700/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                      {(['compact', 'standard', 'relaxed'] as FontSize[]).map(sz => (
                        <button
                          key={sz}
                          onClick={() => updateSetting('fontSize', sz)}
                          className={`flex-1 text-center py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                            settings.fontSize === sz ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs border border-slate-200/50 dark:border-slate-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                          }`}
                        >
                          {sz === 'compact' ? t.fontSizeCompact : sz === 'standard' ? t.fontSizeStandard : t.fontSizeRelaxed}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Margins & Title Style */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.marginLabel}</label>
                    <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg flex items-center h-[28px] border border-slate-200/60 dark:border-slate-700/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                      {(['compact', 'standard', 'relaxed'] as PaperMargin[]).map(m => (
                        <button
                          key={m}
                          onClick={() => updateSetting('margin', m)}
                          className={`flex-1 text-center py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                            settings.margin === m ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs border border-slate-200/50 dark:border-slate-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                          }`}
                        >
                          {m === 'compact' ? t.marginCompact : m === 'standard' ? t.marginStandard : t.marginRelaxed}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{isEn ? 'Title Style' : '标题样式'}</label>
                    <CustomSelect
                      value={settings.h2Style}
                      onChange={(val) => updateSetting('h2Style', val as H2Style)}
                      options={titleStyleOptions}
                      size="sm"
                      triggerClassName="w-full bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1 text-xs"
                    />
                  </div>
                </div>

                {/* 4. Layout Aids */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.layoutAids}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateSetting('topAccentLine', !settings.topAccentLine)}
                      className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer h-[28px] active:translate-y-px truncate ${
                        settings.topAccentLine ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60 shadow-[0_1px_2px_rgba(59,130,246,0.05),inset_0_1.5px_2px_rgba(255,255,255,0.95)]' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.02)] hover:bg-slate-50 dark:hover:bg-slate-750'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${settings.topAccentLine ? 'bg-blue-600' : 'bg-slate-300'}`} />
                      <span className="truncate">{t.topAccentBtn}</span>
                    </button>
                    <button
                      onClick={() => updateSetting('showPageBreakLine', !settings.showPageBreakLine)}
                      className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer h-[28px] active:translate-y-px truncate ${
                        settings.showPageBreakLine ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/60 shadow-[0_1px_2px_rgba(244,63,94,0.05),inset_0_1.5px_2px_rgba(255,255,255,0.95)]' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.02)] hover:bg-slate-50 dark:hover:bg-slate-750'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${settings.showPageBreakLine ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`} />
                      <span className="truncate">{t.pageBreakBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Export File Name on Mobile / Smaller popup widths */}
                <div className="flex sm:hidden flex-col gap-1.5 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-750">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.exportNameLabel}</span>
                  <input
                    type="text"
                    value={customFileName}
                    onChange={(e) => setCustomFileName(e.target.value)}
                    placeholder={`${exportTitle}_简历`}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg py-1 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-xs w-full hover:border-slate-300 transition-colors"
                  />
                </div>

                {/* 5. Fine Spacing Adjustments */}
                <div className="space-y-3 bg-slate-50/80 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-750">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.spacingLabel}</label>
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
                        settings.lineHeight <= 1.45 && settings.blockGap <= 0.7 ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 shadow-2xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {isEn ? 'Compact' : '紧凑单页'}
                    </button>
                    <button
                      onClick={() => {
                        updateSetting('lineHeight', 1.6);
                        updateSetting('blockGap', 1.0);
                        updateSetting('letterSpacing', 0.0);
                      }}
                      className={`py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                        settings.lineHeight > 1.45 && settings.lineHeight < 1.75 && settings.blockGap > 0.7 && settings.blockGap < 1.2 ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 shadow-2xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {isEn ? 'Normal' : '标准舒适'}
                    </button>
                    <button
                      onClick={() => {
                        updateSetting('lineHeight', 1.8);
                        updateSetting('blockGap', 1.3);
                        updateSetting('letterSpacing', 0.01);
                      }}
                      className={`py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                        settings.lineHeight >= 1.75 || settings.blockGap >= 1.2 ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 shadow-2xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {isEn ? 'Spacious' : '宽松大气'}
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
    )}
      </div>
    </div>
  );
}
