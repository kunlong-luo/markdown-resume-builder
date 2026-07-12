import React, { useState } from 'react';
import { Sparkles, LayoutGrid, Sliders, Check, Settings, Maximize2, Columns, Eye, Globe, ChevronDown, Palette } from 'lucide-react';
import { ResumeSettings, ThemeColor, FontSize, PaperMargin, FontFamily, TemplateLayout, H2Style } from '../../types';
import { TEMPLATES } from '../../data';
import { useResumeStore } from '../../store/useResumeStore';
import { useConfirm } from '../../context/ConfirmContext';

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
      h2Style: 'accent-line'
    }
  },
  {
    id: 'minimalist_finance',
    name: '极简金融风 (Navy Compact)',
    settings: {
      themeColor: 'custom',
      customColor: '#0F172A',
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
      h2Style: 'accent-line'
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
      h2Style: 'minimal-clean'
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
    id: 'creative',
    name: '设计创意 (Emerald Warm)',
    settings: {
      themeColor: 'emerald',
      customColor: '#10B981',
      fontFamily: 'sans',
      fontSize: 'standard',
      lineHeight: 1.65,
      blockGap: 1.1,
      letterSpacing: 0.02,
      h2Style: 'accent-line'
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
      h2Style: 'accent-line'
    }
  }
];

// Refactored to use useResumeStore instead of props

const TRANSLATIONS = {
  zh: {
    presetLabel: '风格预设',
    presetPlaceholder: '✨ 选择行业大师预设一键配色...',
    layoutLabel: '版式结构',
    templatePrefix: '模版：',
    layoutSingle: '单栏自上而下',
    layoutDouble: '现代双栏 (侧边栏)',
    titleStyleLine: '标题：横线装饰',
    titleStyleBadge: '标题：底色色块',
    titleStyleMinimal: '标题：简约留白',
    visualLabel: '视觉细节',
    customColorTitle: '自定义主题色 (Hex)',
    customColorPlaceholder: '#HEX',
    fontSans: '黑体/无衬线 (推荐)',
    fontSerif: '宋体/经典衬线',
    fontMono: '等宽/技术风格',
    fontSizeLabel: '字号:',
    fontSizeCompact: '紧凑',
    fontSizeStandard: '标准',
    fontSizeRelaxed: '宽松',
    marginLabel: '边距:',
    marginCompact: '窄',
    marginStandard: '中',
    marginRelaxed: '宽',
    topAccentBtn: '顶边线',
    spacingLabel: '间距微调',
    lineHeightLabel: '行高',
    blockGapLabel: '段距',
    letterSpacingLabel: '字距',
    pageBreakBtn: 'A4折页线',
    resetBtn: '重置',
    exportNameLabel: '导出名称:',
    editorOnly: '仅编辑',
    splitView: '双栏分屏',
    previewOnly: '仅预览',
    aestheticsLabel: '排版细节设置',
    aestheticsTooltip: '一键精修：调整间距、页面边距、字体样式与主题色彩',
    doneBtn: '确定',
    fontSelection: '字体选择',
    layoutAids: '排版辅助',
  },
  en: {
    presetLabel: 'Style Presets',
    presetPlaceholder: '✨ Select style preset to apply...',
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

  const handleApplyPreset = (presetId: string) => {
    if (!presetId) return;
    const preset = MASTER_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    
    // Apply all settings in the preset at once!
    updateSettings(preset.settings as Partial<ResumeSettings>);
  };

  const getCurrentPresetId = () => {
    const matched = MASTER_PRESETS.find(preset => {
      return Object.entries(preset.settings).every(([key, val]) => {
        return settings[key as keyof ResumeSettings] === val;
      });
    });
    return matched ? matched.id : '';
  };

  const isEn = settings.lang === 'en';
  const t = isEn ? TRANSLATIONS.en : TRANSLATIONS.zh;

  return (
    <div className="flex items-center justify-between px-6 py-2 bg-slate-50 border-b border-slate-200 z-30 gap-3 select-none relative shadow-xs w-full">
      <div className="flex items-center gap-2 text-xs overflow-x-auto scrollbar-none flex-nowrap min-w-0 shrink">
        {/* Language Selection */}
        <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200 shrink-0">
          <Globe className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <div className="bg-indigo-50 p-0.5 rounded-lg flex items-center border border-indigo-100">
            <button
              onClick={() => updateSetting('lang', 'zh')}
              className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                settings.lang !== 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'text-indigo-600 hover:text-indigo-800'
              }`}
              title="切换到中文表单编辑"
            >
              中
            </button>
            <button
              onClick={() => updateSetting('lang', 'en')}
              className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                settings.lang === 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'text-indigo-600 hover:text-indigo-800'
              }`}
              title="Switch to English Editor Labels"
            >
              EN
            </button>
          </div>
        </div>

        {/* Style Preset Selector */}
        <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <select
            value={getCurrentPresetId()}
            onChange={(e) => {
              handleApplyPreset(e.target.value);
            }}
            className="bg-indigo-50 border border-indigo-150 text-indigo-800 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold text-[11px] cursor-pointer hover:bg-indigo-100 transition-colors max-w-[150px] sm:max-w-none"
          >
            <option value="" disabled>{t.presetPlaceholder}</option>
            {MASTER_PRESETS.map(p => {
              let displayName = p.name;
              if (isEn) {
                if (p.id === 'finance') displayName = 'Finance/Consulting (Navy)';
                if (p.id === 'tech') displayName = 'Tech/Startups (Modern Indigo)';
                if (p.id === 'academic') displayName = 'Academic/R&D (Charcoal)';
                if (p.id === 'creative') displayName = 'Creative/Design (Emerald)';
                if (p.id === 'executive') displayName = 'Executives (Bronze Gold)';
              }
              return <option key={p.id} value={p.id}>{displayName}</option>;
            })}
          </select>
        </div>

        {/* Template Selector */}
        <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200 shrink-0">
          <LayoutGrid className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <select
            value={currentTemplateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-[11px] cursor-pointer hover:border-slate-300 transition-colors"
          >
            {TEMPLATES.map(tmpl => {
              let name = tmpl.name;
              if (isEn) {
                if (tmpl.id === 'ai_backend') name = 'AI Backend Developer';
                if (tmpl.id === 'frontend') name = 'AI Frontend Developer';
                if (tmpl.id === 'pm_lead') name = 'Technical PM / Director';
                if (tmpl.id === 'operations') name = 'Product Operations';
                if (tmpl.id === 'campus') name = 'Campus Graduate';
              }
              return <option key={tmpl.id} value={tmpl.id}>{t.templatePrefix}{name}</option>;
            })}
          </select>
        </div>

        {/* Template Column Layout Selector */}
        <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200 shrink-0">
          <select
            value={settings.templateLayout}
            onChange={(e) => updateSetting('templateLayout', e.target.value as TemplateLayout)}
            className="bg-white border border-slate-200 text-slate-700 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-[11px] cursor-pointer hover:border-slate-300 transition-colors"
          >
            <option value="single">{t.layoutSingle}</option>
            <option value="two-column">{t.layoutDouble}</option>
          </select>
        </div>

        {/* Title Style Selector */}
        <div className="flex items-center gap-1.5 shrink-0">
          <select
            value={settings.h2Style}
            onChange={(e) => updateSetting('h2Style', e.target.value as H2Style)}
            className="bg-white border border-slate-200 text-slate-700 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-[11px] cursor-pointer hover:border-slate-300 transition-colors"
          >
            <option value="accent-line">{t.titleStyleLine}</option>
            <option value="modern-badge">{t.titleStyleBadge}</option>
            <option value="minimal-clean">{t.titleStyleMinimal}</option>
          </select>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-2.5 text-xs shrink-0 relative flex-nowrap">
        {/* Custom File Name Input */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <span className="font-bold text-slate-500">{t.exportNameLabel}</span>
          <input
            type="text"
            value={customFileName}
            onChange={(e) => setCustomFileName(e.target.value)}
            placeholder={`${exportTitle}_简历`}
            className="bg-white border border-slate-200 text-slate-700 rounded-lg py-0.5 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-[11px] w-24 hover:border-slate-300 transition-colors"
          />
        </div>

        {/* Aesthetics Panel Toggle Button */}
        <button
          onClick={() => setIsAestheticsOpen(!isAestheticsOpen)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer shadow-xs shrink-0 ${
            isAestheticsOpen
              ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-600/20'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
          }`}
          title={t.aestheticsTooltip}
        >
          <Sliders className={`w-3.5 h-3.5 transition-transform ${isAestheticsOpen ? 'rotate-90 text-white' : 'text-indigo-500'}`} />
          <span>{t.aestheticsLabel}</span>
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isAestheticsOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Layout Mode Toggle Group */}
        <div className="bg-slate-200/60 p-0.5 rounded-lg flex items-center text-[11px] shrink-0 border border-slate-200/40">
          <button
            onClick={() => updateSetting('layoutMode', 'editor')}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
              settings.layoutMode === 'editor' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden lg:inline ml-0.5">{t.editorOnly}</span>
          </button>
          <button
            onClick={() => updateSetting('layoutMode', 'split')}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
              settings.layoutMode === 'split' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Columns className="w-3 h-3" />
            <span className="hidden lg:inline ml-0.5">{t.splitView}</span>
          </button>
          <button
            onClick={() => updateSetting('layoutMode', 'preview')}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
              settings.layoutMode === 'preview' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span className="hidden lg:inline ml-0.5">{t.previewOnly}</span>
          </button>
        </div>

        {/* Aesthetics Popover Panel */}
        {isAestheticsOpen && (
          <>
            {/* Click outside backdrop */}
            <div 
              className="fixed inset-0 z-40 bg-transparent" 
              onClick={() => setIsAestheticsOpen(false)} 
            />
            
            {/* Panel Card */}
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200/80 shadow-2xl rounded-xl p-5 z-50 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-1.5 font-extrabold text-slate-800">
                  <Palette className="w-4 h-4 text-indigo-500" />
                  <span>{t.aestheticsLabel}</span>
                </div>
                <button 
                  onClick={() => setIsAestheticsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors"
                >
                  {t.doneBtn}
                </button>
              </div>

              {/* Grid content */}
              <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
                
                {/* Visual Accent & Colors */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.visualLabel}</label>
                  <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {colors.map(color => (
                      <button
                        key={color.name}
                        onClick={() => updateSetting('themeColor', color.name)}
                        className={`w-5 h-5 rounded-full ${color.bg} relative transition-all duration-150 hover:scale-110 focus:outline-none ${
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
                        className={`w-5 h-5 rounded-full relative transition-all duration-150 hover:scale-110 focus:outline-none flex items-center justify-center border border-slate-300 ${
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
                          <input 
                            type="color"
                            value={settings.customColor || '#4f46e5'}
                            onChange={(e) => updateSetting('customColor', e.target.value)}
                            className="w-5 h-5 p-0 border-0 rounded cursor-pointer bg-transparent focus:outline-none"
                            title={t.customColorTitle}
                          />
                          <input 
                            type="text"
                            value={(settings.customColor || '#4f46e5').toUpperCase()}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val.startsWith('#') && val.length <= 7) {
                                updateSetting('customColor', val);
                              } else if (!val.startsWith('#') && val.length <= 6) {
                                updateSetting('customColor', '#' + val);
                              }
                            }}
                            className="w-16 px-1.5 py-0.5 text-[10px] font-mono border border-slate-200 rounded text-slate-700 bg-white uppercase text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder={t.customColorPlaceholder}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fonts and Size Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.fontSelection}</label>
                    <select
                      value={settings.fontFamily}
                      onChange={(e) => updateSetting('fontFamily', e.target.value as FontFamily)}
                      className="w-full bg-white border border-slate-200 text-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-xs cursor-pointer hover:border-slate-300 transition-colors"
                    >
                      <option value="sans">{t.fontSans}</option>
                      <option value="serif">{t.fontSerif}</option>
                      <option value="mono">{t.fontMono}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.fontSizeLabel}</label>
                    <div className="bg-slate-100 p-0.5 rounded-lg flex items-center h-[28px] border border-slate-200/40">
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

                {/* Margins & Top Accent */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.marginLabel}</label>
                    <div className="bg-slate-100 p-0.5 rounded-lg flex items-center h-[28px] border border-slate-200/40">
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
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.layoutAids}</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateSetting('topAccentLine', !settings.topAccentLine)}
                        className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer h-[28px] ${
                          settings.topAccentLine ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-350'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${settings.topAccentLine ? 'bg-blue-600' : 'bg-slate-300'}`} />
                        <span>{t.topAccentBtn}</span>
                      </button>
                      <button
                        onClick={() => updateSetting('showPageBreakLine', !settings.showPageBreakLine)}
                        className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer h-[28px] ${
                          settings.showPageBreakLine ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-xs' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-350'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${settings.showPageBreakLine ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`} />
                        <span>{t.pageBreakBtn}</span>
                      </button>
                    </div>
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

                {/* Fine Spacing Adjustments */}
                <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
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
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                      <span>{t.lineHeightLabel}</span>
                      <span className="font-mono font-bold bg-white px-1.5 py-0.2 rounded border border-slate-150 text-slate-700 text-[10px]">
                        {settings.lineHeight.toFixed(2)}
                      </span>
                    </div>
                    <input 
                      type="range" min="1.2" max="2.2" step="0.05"
                      value={settings.lineHeight}
                      onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                    />
                  </div>

                  {/* Block Gap Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                      <span>{t.blockGapLabel}</span>
                      <span className="font-mono font-bold bg-white px-1.5 py-0.2 rounded border border-slate-150 text-slate-700 text-[10px]">
                        {settings.blockGap.toFixed(2)}
                      </span>
                    </div>
                    <input 
                      type="range" min="0.3" max="2.0" step="0.05"
                      value={settings.blockGap}
                      onChange={(e) => updateSetting('blockGap', parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                    />
                  </div>

                  {/* Letter Spacing Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                      <span>{t.letterSpacingLabel}</span>
                      <span className="font-mono font-bold bg-white px-1.5 py-0.2 rounded border border-slate-150 text-slate-700 text-[10px]">
                        {settings.letterSpacing > 0 ? '+' : ''}{settings.letterSpacing.toFixed(2)}
                      </span>
                    </div>
                    <input 
                      type="range" min="-0.04" max="0.12" step="0.01"
                      value={settings.letterSpacing}
                      onChange={(e) => updateSetting('letterSpacing', parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                    />
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
