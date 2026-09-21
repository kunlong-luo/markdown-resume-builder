import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, LayoutGrid, Sliders, Check, Settings, Maximize2, Columns, Eye, Globe, ChevronDown, Palette } from 'lucide-react';
import { ResumeSettings, ThemeColor, FontSize, PaperMargin, FontFamily, TemplateLayout, H2Style } from '../../types';
import { TEMPLATES } from '../../data';
import { useResumeStore } from '../../store/useResumeStore';
import { useConfirm } from '../../context/ConfirmContext';
import { CustomSelect, SelectOption } from '../ui/CustomSelect';
import { CustomSlider } from '../ui/CustomSlider';
import { CustomColorPicker } from '../ui/CustomColorPicker';

const MASTER_PRESETS = [
  {
    id: 'finance',
    name: '金融咨询 (Navy Classic)',
    settings: {
      themeColor: 'custom',
      customColor: '#0F2942',
      fontFamily: 'serif',
      fontSize: 'standard',
      lineHeight: 1.55,
      blockGap: 0.9,
      letterSpacing: 0.02,
      h2Style: 'accent-line',
      margin: 'standard',
      topAccentLine: true
    }
  },
  {
    id: 'minimalist_finance',
    name: '极简商科 (Navy Compact)',
    settings: {
      themeColor: 'custom',
      customColor: '#1E3A8A',
      fontFamily: 'serif',
      fontSize: 'compact',
      lineHeight: 1.4,
      blockGap: 0.6,
      letterSpacing: 0.01,
      h2Style: 'minimal-clean',
      margin: 'compact',
      topAccentLine: false
    }
  },
  {
    id: 'tech',
    name: '互联网科技 (Modern Indigo)',
    settings: {
      themeColor: 'indigo',
      customColor: '#4F46E5',
      fontFamily: 'sans',
      fontSize: 'standard',
      lineHeight: 1.6,
      blockGap: 1.0,
      letterSpacing: 0.0,
      h2Style: 'accent-line',
      margin: 'standard',
      topAccentLine: true
    }
  },
  {
    id: 'geek_tech',
    name: '互联网极客 (Monospace Mint)',
    settings: {
      themeColor: 'teal',
      customColor: '#0D9488',
      fontFamily: 'mono',
      fontSize: 'standard',
      lineHeight: 1.5,
      blockGap: 0.9,
      letterSpacing: 0.0,
      h2Style: 'modern-badge',
      margin: 'standard',
      topAccentLine: true
    }
  },
  {
    id: 'academic',
    name: '学术研发 (Charcoal Clean)',
    settings: {
      themeColor: 'slate',
      customColor: '#334155',
      fontFamily: 'sans',
      fontSize: 'compact',
      lineHeight: 1.5,
      blockGap: 0.8,
      letterSpacing: -0.01,
      h2Style: 'minimal-clean',
      margin: 'standard',
      topAccentLine: true
    }
  },
  {
    id: 'latex_academic',
    name: 'LaTeX 学术 (TeX High Contrast)',
    settings: {
      themeColor: 'slate',
      customColor: '#1E293B',
      fontFamily: 'serif',
      fontSize: 'compact',
      lineHeight: 1.45,
      blockGap: 0.7,
      letterSpacing: -0.01,
      h2Style: 'minimal-clean',
      margin: 'standard',
      topAccentLine: false
    }
  },
  {
    id: 'cambridge_green',
    name: '剑桥墨绿 (Cambridge Emerald)',
    settings: {
      themeColor: 'custom',
      customColor: '#14532D',
      fontFamily: 'serif',
      fontSize: 'standard',
      lineHeight: 1.55,
      blockGap: 0.85,
      letterSpacing: 0.01,
      h2Style: 'accent-line',
      margin: 'standard',
      topAccentLine: true
    }
  },
  {
    id: 'creative',
    name: '设计创意 (Warm Caramel)',
    settings: {
      themeColor: 'custom',
      customColor: '#78350F',
      fontFamily: 'sans',
      fontSize: 'standard',
      lineHeight: 1.65,
      blockGap: 1.1,
      letterSpacing: 0.02,
      h2Style: 'accent-line',
      margin: 'standard',
      topAccentLine: true
    }
  },
  {
    id: 'executive',
    name: '高管主管 (Bronze Gold)',
    settings: {
      themeColor: 'custom',
      customColor: '#8D6037',
      fontFamily: 'serif',
      fontSize: 'standard',
      lineHeight: 1.6,
      blockGap: 1.0,
      letterSpacing: 0.01,
      h2Style: 'accent-line',
      margin: 'standard',
      topAccentLine: true
    }
  }
];

// Refactored to use useResumeStore instead of props

const TRANSLATIONS = {
  zh: {
    presetLabel: '风格预设',
    layoutLabel: '版式结构',
    templatePrefix: '模版：',
    layoutSingle: '经典单栏',
    layoutDouble: '现代双栏',
    titleStyleLine: '横线标题',
    titleStyleBadge: '色块标题',
    titleStyleMinimal: '极简标题',
    visualLabel: '视觉细节',
    customColorTitle: '自定义颜色 (Hex)',
    customColorPlaceholder: '#HEX',
    fontSans: '经典黑体 (无衬线)',
    fontSerif: '优雅宋体 (衬线)',
    fontMono: '极客等宽 (技术型)',
    fontSizeLabel: '字号:',
    fontSizeCompact: '紧凑',
    fontSizeStandard: '标准',
    fontSizeRelaxed: '宽松',
    marginLabel: '边距:',
    marginCompact: '窄',
    marginStandard: '中',
    marginRelaxed: '宽',
    topAccentBtn: '顶装饰线',
    spacingLabel: '间距微调',
    lineHeightLabel: '行高',
    blockGapLabel: '段距',
    letterSpacingLabel: '字距',
    pageBreakBtn: 'A4折页线',
    resetBtn: '重置',
    exportNameLabel: '文件名:',
    editorOnly: '仅编辑',
    splitView: '双栏分屏',
    previewOnly: '仅预览',
    aestheticsLabel: '排版精修',
    aestheticsTooltip: '细节微调：间距、边距、字体与颜色',
    doneBtn: '确定',
    fontSelection: '字体选择',
    layoutAids: '排版辅助',
    backdropBtn: '3D星轨背景',
  },
  en: {
    presetLabel: 'Style Presets',
    layoutLabel: 'Layout Structure',
    templatePrefix: 'Template: ',
    layoutSingle: 'Single Column (Standard)',
    layoutDouble: 'Modern 2-Column',
    titleStyleLine: 'Heading: Bottom Line',
    titleStyleBadge: 'Heading: Solid Badge',
    titleStyleMinimal: 'Heading: Minimalist',
    visualLabel: 'Visual Styling',
    customColorTitle: 'Custom Accent Color (Hex)',
    customColorPlaceholder: '#HEX',
    fontSans: 'Sans-Serif (Modern)',
    fontSerif: 'Serif (Classic)',
    fontMono: 'Monospace (Technical)',
    fontSizeLabel: 'Font size:',
    fontSizeCompact: 'Compact',
    fontSizeStandard: 'Standard',
    fontSizeRelaxed: 'Relaxed',
    marginLabel: 'Margin:',
    marginCompact: 'Narrow',
    marginStandard: 'Standard',
    marginRelaxed: 'Wide',
    topAccentBtn: 'Top Accent',
    spacingLabel: 'Spacing Adjustments',
    lineHeightLabel: 'Line Height',
    blockGapLabel: 'Section Spacing',
    letterSpacingLabel: 'Tracking',
    pageBreakBtn: 'A4 Crease Lines',
    resetBtn: 'Reset',
    exportNameLabel: 'Export Name:',
    editorOnly: 'Editor Only',
    splitView: 'Split View',
    previewOnly: 'Preview Only',
    aestheticsLabel: 'Aesthetics & Layout',
    aestheticsTooltip: 'Fine-tune fonts, margins, spacings, colors, and line-height',
    doneBtn: 'Done',
    fontSelection: 'Font Selection',
    layoutAids: 'Layout Aids',
    backdropBtn: '3D Backdrop',
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
    const preset = MASTER_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    
    setSelectedPresetId(presetId);
    // Apply all settings in the preset at once!
    updateSettings(preset.settings as Partial<ResumeSettings>);
  };

  const getCurrentPresetId = () => {
    // If selectedPresetId still matches active settings, return it
    if (selectedPresetId) {
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
    return matched ? matched.id : '';
  };

  const isEn = settings.lang === 'en';
  const t = isEn ? TRANSLATIONS.en : TRANSLATIONS.zh;

  const presetOptions: SelectOption[] = [
    ...(getCurrentPresetId() === '' ? [{ value: '', label: isEn ? 'Custom Style' : '自定义配置', disabled: true }] : []),
    ...MASTER_PRESETS.map(p => {
      let displayName = p.name;
      if (isEn) {
        if (p.id === 'finance') displayName = 'Finance/Consulting (Navy)';
        if (p.id === 'minimalist_finance') displayName = 'Minimalist Finance (Navy Compact)';
        if (p.id === 'tech') displayName = 'Tech/Startups (Modern Indigo)';
        if (p.id === 'geek_tech') displayName = 'Geek Tech (Monospace Mint)';
        if (p.id === 'academic') displayName = 'Academic/R&D (Charcoal)';
        if (p.id === 'latex_academic') displayName = 'LaTeX Academic (TeX High Contrast)';
        if (p.id === 'cambridge_green') displayName = 'Cambridge Emerald (Academic Green)';
        if (p.id === 'creative') displayName = 'Creative/Design (Caramel Warm)';
        if (p.id === 'executive') displayName = 'Executives (Bronze Gold)';
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
  ];

  const titleStyleOptions: SelectOption[] = [
    { value: 'accent-line', label: t.titleStyleLine },
    { value: 'modern-badge', label: t.titleStyleBadge },
    { value: 'minimal-clean', label: t.titleStyleMinimal },
  ];

  const fontFamilyOptions: SelectOption[] = [
    { value: 'sans', label: t.fontSans },
    { value: 'serif', label: t.fontSerif },
    { value: 'mono', label: t.fontMono },
  ];

  return (
    <div className="flex items-center justify-between px-2.5 sm:px-6 py-1.5 sm:py-2 bg-white/80 backdrop-blur-md border-b border-slate-200/80 z-30 gap-2 sm:gap-3 relative shadow-[0_1px_2px_rgba(15,23,42,0.02)] w-full">
      <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs overflow-x-auto scrollbar-none flex-nowrap min-w-0 shrink py-0.5">
        {/* Language Selection */}
        <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200/90 shrink-0">
          <Globe className="w-3.5 h-3.5 text-indigo-500 shrink-0 pointer-events-none" />
          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200/60 shadow-2xs">
            <button
              onClick={() => updateSetting('lang', 'zh')}
              className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                settings.lang !== 'en' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="切换到中文表单编辑"
            >
              中
            </button>
            <button
              onClick={() => updateSetting('lang', 'en')}
              className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                settings.lang === 'en' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Switch to English Editor Labels"
            >
              EN
            </button>
          </div>
        </div>

        {/* Style Preset Selector */}
        <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200/90 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 pointer-events-none" />
          <CustomSelect
            value={getCurrentPresetId()}
            onChange={handleApplyPreset}
            options={presetOptions}
            placeholder={isEn ? 'Custom Style' : '自定义配置'}
            size="xs"
            triggerClassName="bg-indigo-50/90 border-indigo-200/80 text-indigo-950 font-bold text-[11px] h-7 rounded-lg hover:bg-indigo-100/80 shadow-2xs"
          />
        </div>

        {/* Template Selector */}
        <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200/90 shrink-0">
          <LayoutGrid className="w-3.5 h-3.5 text-blue-500 shrink-0 pointer-events-none" />
          <CustomSelect
            value={currentTemplateId}
            onChange={handleTemplateChange}
            options={templateOptions}
            size="xs"
            triggerClassName="bg-white border-slate-200/90 text-slate-700 font-semibold text-[11px] h-7 rounded-lg hover:border-slate-300 shadow-2xs"
          />
        </div>

        {/* Template Column Layout Selector */}
        <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200/90 shrink-0">
          <CustomSelect
            value={settings.templateLayout}
            onChange={(val) => updateSetting('templateLayout', val as TemplateLayout)}
            options={layoutOptions}
            size="xs"
            triggerClassName="bg-white border-slate-200/90 text-slate-700 font-medium text-[11px] h-7 rounded-lg hover:border-slate-300 shadow-2xs"
          />
        </div>

        {/* Title Style Selector */}
        <div className="flex items-center gap-1.5 shrink-0">
          <CustomSelect
            value={settings.h2Style}
            onChange={(val) => updateSetting('h2Style', val as H2Style)}
            options={titleStyleOptions}
            size="xs"
            triggerClassName="bg-white border-slate-200/90 text-slate-700 font-medium text-[11px] h-7 rounded-lg hover:border-slate-300 shadow-2xs"
          />
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-2.5 text-xs shrink-0 relative flex-nowrap">
        {/* Custom File Name Input */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <span className="font-bold text-slate-500 text-[11px]">{t.exportNameLabel}</span>
          <input
            type="text"
            value={customFileName}
            onChange={(e) => setCustomFileName(e.target.value)}
            placeholder={`${exportTitle}_简历`}
            className="bg-white border border-slate-200/90 text-slate-700 rounded-lg py-1 px-2.5 font-semibold text-[11px] w-28 hover:border-slate-300 transition-all shadow-2xs focus:shadow-none focus:outline-none focus:ring-1.5 focus:ring-indigo-500"
          />
        </div>

        {/* Aesthetics Panel Toggle Button */}
        <button
          ref={aestheticsTriggerRef}
          onClick={handleToggleAesthetics}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer shrink-0 active:translate-y-px ${
            isAestheticsOpen
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
              : 'bg-white text-slate-700 border-slate-200/90 shadow-2xs hover:bg-slate-50 hover:border-slate-300'
          }`}
          title={t.aestheticsTooltip}
        >
          <Sliders className={`w-3.5 h-3.5 transition-transform ${isAestheticsOpen ? 'rotate-90 text-white' : 'text-indigo-500'}`} />
          <span>{t.aestheticsLabel}</span>
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isAestheticsOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Layout Mode Toggle Group */}
        <div className="bg-slate-100 p-0.5 rounded-lg flex items-center text-[11px] shrink-0 border border-slate-200/60 shadow-2xs">
          <button
            onClick={() => updateSetting('layoutMode', 'editor')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
              settings.layoutMode === 'editor' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden lg:inline ml-0.5">{t.editorOnly}</span>
          </button>
          <button
            onClick={() => updateSetting('layoutMode', 'split')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
              settings.layoutMode === 'split' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Columns className="w-3 h-3" />
            <span className="hidden lg:inline ml-0.5">{t.splitView}</span>
          </button>
          <button
            onClick={() => updateSetting('layoutMode', 'preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
              settings.layoutMode === 'preview' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span className="hidden lg:inline ml-0.5">{t.previewOnly}</span>
          </button>
        </div>

        {/* Aesthetics Popover Panel via Portal */}
        {isAestheticsOpen && panelCoords && typeof document !== 'undefined' && createPortal(
          <>
            {/* High-priority click outside backdrop */}
            <div 
              className="fixed inset-0 z-[120] bg-slate-900/10 backdrop-blur-[0.5px] transition-opacity cursor-default" 
              onClick={() => setIsAestheticsOpen(false)} 
            />
            
            {/* Panel Card */}
            <div 
              style={{
                position: 'fixed',
                top: `${panelCoords.top}px`,
                right: `${panelCoords.right}px`,
                maxHeight: `calc(100vh - ${panelCoords.top + 16}px)`,
              }}
              className="w-84 sm:w-96 max-w-[calc(100vw-1.25rem)] bg-white/98 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_48px_rgba(15,23,42,0.18),0_4px_16px_rgba(15,23,42,0.06)] rounded-2xl p-4 sm:p-5 z-[130] flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-150 scrollbar-thin overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 shrink-0">
                <div className="flex items-center gap-1.5 font-extrabold text-slate-800">
                  <Palette className="w-4 h-4 text-indigo-500" />
                  <span>{t.aestheticsLabel}</span>
                </div>
                <button 
                  onClick={() => setIsAestheticsOpen(false)}
                  className="text-slate-500 hover:text-slate-700 text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-1 rounded-md transition-all shadow-[0_1px_2px_rgba(15,23,42,0.02),inset_0_1.5px_2px_rgba(255,255,255,0.95)] active:translate-y-px cursor-pointer"
                >
                  {t.doneBtn}
                </button>
              </div>

              {/* Single smooth scroll area with distinct structural hierarchy */}
              <div className="space-y-4">
                {/* 1. Visual Accent & Colors */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.visualLabel}</label>
                  <div className="flex flex-wrap items-center gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    {colors.map(color => (
                      <button
                        key={color.name}
                        onClick={() => updateSetting('themeColor', color.name)}
                        className={`w-5 h-5 rounded-full ${color.bg} relative transition-all duration-150 hover:scale-110 focus:outline-none cursor-pointer ${
                          settings.themeColor === color.name ? `ring-2 ring-offset-2 ${color.ring} scale-110` : 'opacity-85 hover:opacity-100'
                        }`}
                        title={`${color.name.toUpperCase()} Accent`}
                      >
                        {settings.themeColor === color.name && (
                          <Check className="w-2.5 h-2.5 text-white absolute inset-0 m-auto stroke-[5px]" />
                        )}
                      </button>
                    ))}

                    {/* Custom Color Selector */}
                    <div className="flex items-center gap-1.5 ml-1 pl-1.5 border-l border-slate-200">
                      <button
                        onClick={() => {
                          updateSetting('themeColor', 'custom');
                          if (!settings.customColor) {
                            updateSetting('customColor', '#4f46e5');
                          }
                        }}
                        className={`w-5 h-5 rounded-full relative transition-all duration-150 hover:scale-110 focus:outline-none flex items-center justify-center border border-slate-300 cursor-pointer ${
                          settings.themeColor === 'custom' ? 'ring-2 ring-indigo-600/40 ring-offset-2 scale-110' : 'opacity-85 hover:opacity-100'
                        }`}
                        style={{ background: settings.themeColor === 'custom' ? (settings.customColor || '#4f46e5') : 'conic-gradient(from 0deg, red, yellow, green, cyan, blue, magenta, red)' }}
                        title={t.customColorTitle}
                      >
                        {settings.themeColor === 'custom' && (
                          <Check className="w-2.5 h-2.5 text-white absolute inset-0 m-auto stroke-[5px]" />
                        )}
                      </button>
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
                      triggerClassName="w-full bg-white border-slate-200/90 text-slate-700 rounded-lg px-2.5 py-1 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.fontSizeLabel}</label>
                    <div className="bg-slate-100 p-0.5 rounded-lg flex items-center h-[28px] border border-slate-200/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                      {(['compact', 'standard', 'relaxed'] as FontSize[]).map(sz => (
                        <button
                          key={sz}
                          onClick={() => updateSetting('fontSize', sz)}
                          className={`flex-1 text-center py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                            settings.fontSize === sz ? 'bg-white text-slate-800 shadow-xs border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
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
                    <div className="bg-slate-100 p-0.5 rounded-lg flex items-center h-[28px] border border-slate-200/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                      {(['compact', 'standard', 'relaxed'] as PaperMargin[]).map(m => (
                        <button
                          key={m}
                          onClick={() => updateSetting('margin', m)}
                          className={`flex-1 text-center py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                            settings.margin === m ? 'bg-white text-slate-800 shadow-xs border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
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
                      triggerClassName="w-full bg-white border-slate-200/90 text-slate-700 rounded-lg px-2.5 py-1 text-xs"
                    />
                  </div>
                </div>

                {/* 4. Layout Aids */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.layoutAids}</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => updateSetting('topAccentLine', !settings.topAccentLine)}
                      className={`flex items-center justify-center gap-1 py-1 px-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer h-[28px] active:translate-y-px truncate ${
                        settings.topAccentLine ? 'bg-blue-50 text-blue-700 border-blue-200/60 shadow-[0_1px_2px_rgba(59,130,246,0.05),inset_0_1.5px_2px_rgba(255,255,255,0.95)]' : 'bg-white text-slate-500 border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.02),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:bg-slate-50 hover:border-slate-350'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${settings.topAccentLine ? 'bg-blue-600' : 'bg-slate-300'}`} />
                      <span className="truncate">{t.topAccentBtn}</span>
                    </button>
                    <button
                      onClick={() => updateSetting('showPageBreakLine', !settings.showPageBreakLine)}
                      className={`flex items-center justify-center gap-1 py-1 px-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer h-[28px] active:translate-y-px truncate ${
                        settings.showPageBreakLine ? 'bg-rose-50 text-rose-700 border-rose-200/60 shadow-[0_1px_2px_rgba(244,63,94,0.05),inset_0_1.5px_2px_rgba(255,255,255,0.95)]' : 'bg-white text-slate-500 border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.02),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:bg-slate-50 hover:border-slate-350'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${settings.showPageBreakLine ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`} />
                      <span className="truncate">{t.pageBreakBtn}</span>
                    </button>
                    <button
                      onClick={() => updateSetting('show3DBackdrop', !settings.show3DBackdrop)}
                      className={`flex items-center justify-center gap-1 py-1 px-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer h-[28px] active:translate-y-px truncate ${
                        settings.show3DBackdrop ? 'bg-indigo-50 text-indigo-700 border-indigo-200/60 shadow-[0_1px_2px_rgba(99,102,241,0.05),inset_0_1.5px_2px_rgba(255,255,255,0.95)]' : 'bg-white text-slate-500 border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.02),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:bg-slate-50 hover:border-slate-350'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${settings.show3DBackdrop ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`} />
                      <span className="truncate">{t.backdropBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Export File Name on Mobile / Smaller popup widths */}
                <div className="flex sm:hidden flex-col gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.exportNameLabel}</span>
                  <input
                    type="text"
                    value={customFileName}
                    onChange={(e) => setCustomFileName(e.target.value)}
                    placeholder={`${exportTitle}_简历`}
                    className="bg-white border border-slate-200 text-slate-700 rounded-lg py-1 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-xs w-full hover:border-slate-300 transition-colors"
                  />
                </div>

                {/* 5. Fine Spacing Adjustments */}
                <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.spacingLabel}</label>
                    <button
                      onClick={() => {
                        updateSetting('lineHeight', 1.6);
                        updateSetting('blockGap', 1.0);
                        updateSetting('letterSpacing', 0.0);
                      }}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold transition-all cursor-pointer"
                    >
                      {t.resetBtn}
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
            </div>
          </>,
          document.body
        )}
      </div>
    </div>
  );
}
