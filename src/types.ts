export type ThemeColor = 'blue' | 'emerald' | 'slate' | 'indigo' | 'crimson' | 'amber' | 'teal' | 'bronze' | 'custom';
export type FontSize = 'compact' | 'standard' | 'relaxed';
export type FontFamily = 'sans' | 'serif' | 'mono';
export type PaperMargin = 'compact' | 'standard' | 'relaxed';
export type LayoutMode = 'split' | 'editor' | 'preview';
export type H2Style = 'accent-line' | 'modern-badge' | 'minimal-clean';
export type TemplateLayout = 'single' | 'two-column';
export type Language = 'zh' | 'en';

export interface ResumeSettings {
  themeColor: ThemeColor;
  customColor?: string;
  fontSize: FontSize;
  fontFamily: FontFamily;
  margin: PaperMargin;
  layoutMode: LayoutMode;
  h2Style: H2Style;
  topAccentLine: boolean;
  lineHeight: number;
  blockGap: number;
  letterSpacing: number;
  showPageBreakLine: boolean;
  templateLayout: TemplateLayout;
  lang?: Language;
  isPrivacyMasked?: boolean;
}

export interface ResumeDraft {
  id: string;
  title: string;
  markdown: string;
  settings: ResumeSettings;
  timestamp: string;
  isAutoSave?: boolean;
}
