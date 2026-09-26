import { ThemeColor, ResumeSettings } from '../../types';

export interface StylePreset {
  id: string;
  name: string;
  nameEn: string;
  settings: Partial<ResumeSettings>;
}

export const MASTER_PRESETS: StylePreset[] = [
  {
    id: 'finance',
    name: '金融咨询',
    nameEn: 'Finance & Consulting',
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
    nameEn: 'Tech & Internet',
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
    nameEn: 'Academic & Research',
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
    nameEn: 'Modern Cards',
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
    nameEn: 'Cambridge Emerald',
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
    nameEn: 'Executive Leadership',
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

export interface ThemeColorItem {
  name: ThemeColor;
  bg: string;
  ring: string;
}

export const THEME_COLOR_PALETTES: ThemeColorItem[] = [
  { name: 'blue', bg: 'bg-blue-600', ring: 'ring-blue-600/30' },
  { name: 'indigo', bg: 'bg-indigo-600', ring: 'ring-indigo-600/30' },
  { name: 'teal', bg: 'bg-teal-600', ring: 'ring-teal-600/30' },
  { name: 'emerald', bg: 'bg-emerald-600', ring: 'ring-emerald-600/30' },
  { name: 'slate', bg: 'bg-slate-700', ring: 'ring-slate-700/30' },
  { name: 'bronze', bg: 'bg-[rgb(141,96,55)]', ring: 'ring-[rgb(141,96,55)]/30' },
  { name: 'crimson', bg: 'bg-rose-600', ring: 'ring-rose-600/30' },
  { name: 'amber', bg: 'bg-amber-600', ring: 'ring-amber-600/30' },
];

export const TOOLBAR_TRANSLATIONS = {
  zh: {
    presetLabel: '风格预设',
    layoutLabel: '版面结构',
    layoutSingle: '单栏标准',
    layoutDouble: '双栏现代',
    layoutAcademic: '学术 LaTeX',
    layoutModernCard: '卡片模块',
    titleStyleLine: '强调下划线',
    titleStyleBadge: '胶囊底色标',
    titleStyleMinimal: '极简素雅',
    titleStyleAcademic: '学术双横线',
    titleStyleBracket: '现代方括号',
    titleStyleLabel: '标题样式',
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
    editorOnly: '编辑',
    splitView: '分屏',
    previewOnly: '预览',
    autoFitBtn: '智能单页',
    autoFitSuccess: '已完成智能压缩',
    autoFitTooltip: '一键智能紧凑排版，自动微调页边距与行间距',
    aestheticsLabel: '排版',
    aestheticsTooltip: '排版与样式',
    doneBtn: '完成',
    fontSelection: '字体选择',
    layoutAids: '排版辅助',
    customStyle: '自定义样式',
    compactPreset: '紧凑单页',
    normalPreset: '标准舒适',
    spaciousPreset: '宽松大气'
  },
  en: {
    presetLabel: 'Presets',
    layoutLabel: 'Layout',
    layoutSingle: 'Single Col',
    layoutDouble: 'Two Cols',
    layoutAcademic: 'Academic LaTeX',
    layoutModernCard: 'Modern Cards',
    titleStyleLine: 'Underline',
    titleStyleBadge: 'Badge Accent',
    titleStyleMinimal: 'Minimal Clean',
    titleStyleAcademic: 'Academic Line',
    titleStyleBracket: 'Bracket Tag',
    titleStyleLabel: 'Title Style',
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
    editorOnly: 'Edit',
    splitView: 'Split',
    previewOnly: 'Preview',
    autoFitBtn: 'Fit 1 Page',
    autoFitSuccess: 'Auto-fitted to 1 page!',
    autoFitTooltip: 'One-Click Auto-Fit Margins & Spacing to 1 Page',
    aestheticsLabel: 'Typography',
    aestheticsTooltip: 'Typography & Layout Styling',
    doneBtn: 'Done',
    fontSelection: 'Font Selection',
    layoutAids: 'Layout Aids',
    customStyle: 'Custom Style',
    compactPreset: 'Compact',
    normalPreset: 'Normal',
    spaciousPreset: 'Spacious'
  }
};

export function findMatchingPresetId(settings: ResumeSettings, currentSelectedId?: string): string {
  if (currentSelectedId && currentSelectedId !== 'custom') {
    const active = MASTER_PRESETS.find(p => p.id === currentSelectedId);
    if (active) {
      const matches = Object.entries(active.settings).every(([key, val]) => {
        if (key === 'customColor') {
          return String(settings.customColor || '').toLowerCase() === String(val).toLowerCase();
        }
        return settings[key as keyof ResumeSettings] === val;
      });
      if (matches) return currentSelectedId;
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
}
