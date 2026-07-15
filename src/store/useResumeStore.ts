import { create } from 'zustand';
import { DEFAULT_MARKDOWN, TEMPLATES } from '../data';
import { ResumeSettings } from '../types';

interface ResumeState {
  // States
  markdown: string;
  settings: ResumeSettings;
  currentTemplateId: string;
  lastSaved: string;
  history: string[];
  historyIndex: number;
  customFileName: string;
  isCheckerOpen: boolean;
  isIframeModalOpen: boolean;
  isBackupHubOpen: boolean;
  isExportingPDF: boolean;
  atsKeywords: string[];
  jdText: string;

  // Actions
  setMarkdown: (markdown: string) => void;
  setSettings: (settings: ResumeSettings) => void;
  setCurrentTemplateId: (id: string) => void;
  setLastSaved: (lastSaved: string) => void;
  setCustomFileName: (name: string) => void;
  setIsCheckerOpen: (open: boolean) => void;
  setIsIframeModalOpen: (open: boolean) => void;
  setIsBackupHubOpen: (open: boolean) => void;
  setIsExportingPDF: (isExporting: boolean) => void;
  setAtsKeywords: (keywords: string[]) => void;
  setJdText: (text: string) => void;
  
  handleMarkdownChange: (newVal: string, immediate?: boolean) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  updateSetting: <K extends keyof ResumeSettings>(key: K, value: ResumeSettings[K]) => void;
  updateSettings: (newSettings: Partial<ResumeSettings>) => void;
}

// Module-level variable for debouncing history push
let debounceTimer: NodeJS.Timeout | null = null;
let isUndoRedoAction = false;

// Helper to initialize markdown
const getInitialMarkdown = (): string => {
  const saved = localStorage.getItem('resume-markdown');
  let md = saved || DEFAULT_MARKDOWN;
  
  // Discard any old stored resumes containing real-world experiences to respect privacy
  if (md.includes('陆云腾') || md.includes('极光智云') || md.includes('苏州瀚海星空') || md.includes('天拓云创') || md.includes('微云传动')) {
    md = DEFAULT_MARKDOWN;
    localStorage.setItem('resume-markdown', DEFAULT_MARKDOWN);
  }
  
  // Migration: Rename "教育经历" to "教育背景" to match the new convention and avoid duplicates
  if (md.includes('## 教育经历')) {
    md = md.replace(/## 教育经历/g, '## 教育背景');
  }
  
  // De-duplicate "教育背景" sections if they appear multiple times
  const sections = md.split('\n## ');
  const seenEdu = new Set();
  const cleanSections = [];
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (i === 0 && !section.startsWith('## ')) {
      cleanSections.push(section);
      continue;
    }
    
    const title = section.split('\n')[0].trim();
    const isEdu = title.includes('教育') || title.includes('学校') || title.toLowerCase().includes('education');
    
    if (isEdu) {
      if (seenEdu.has(title)) {
        continue;
      }
      seenEdu.add(title);
    }
    
    cleanSections.push(i === 0 ? section : '## ' + section);
  }
  
  md = cleanSections.join('\n').replace(/\n{3,}/g, '\n\n');
  return md;
};

// Helper to initialize currentTemplateId
const getInitialTemplateId = (initialMarkdown: string): string => {
  const match = TEMPLATES.find(t => t.content === initialMarkdown);
  return match ? match.id : 'ai_backend';
};

// Helper to initialize settings
const getInitialSettings = (): ResumeSettings => {
  const savedSettings = localStorage.getItem('resume-settings');
  const defaultSettings: ResumeSettings = {
    themeColor: 'indigo',
    customColor: '#4F46E5',
    fontSize: 'standard',
    fontFamily: 'sans',
    margin: 'standard',
    layoutMode: 'split',
    h2Style: 'accent-line',
    topAccentLine: true,
    lineHeight: 1.6,
    blockGap: 1.0,
    letterSpacing: 0.0,
    showPageBreakLine: true,
    templateLayout: 'single',
    lang: 'zh',
    show3DBackdrop: false,
  };
  
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings);
      return { ...defaultSettings, ...parsed };
    } catch (e) {}
  }
  return defaultSettings;
};

const initialMarkdown = getInitialMarkdown();

export const useResumeStore = create<ResumeState>((set, get) => ({
  // Initial States
  markdown: initialMarkdown,
  settings: getInitialSettings(),
  currentTemplateId: getInitialTemplateId(initialMarkdown),
  lastSaved: '',
  history: [initialMarkdown],
  historyIndex: 0,
  customFileName: '',
  isCheckerOpen: false,
  isIframeModalOpen: false,
  isBackupHubOpen: false,
  isExportingPDF: false,
  atsKeywords: [],
  jdText: '',

  // Simple setters
  setMarkdown: (markdown) => set({ markdown }),
  setSettings: (settings) => {
    localStorage.setItem('resume-settings', JSON.stringify(settings));
    set({ settings });
  },
  setCurrentTemplateId: (currentTemplateId) => set({ currentTemplateId }),
  setLastSaved: (lastSaved) => set({ lastSaved }),
  setCustomFileName: (customFileName) => set({ customFileName }),
  setIsCheckerOpen: (isCheckerOpen) => set({ isCheckerOpen }),
  setIsIframeModalOpen: (isIframeModalOpen) => set({ isIframeModalOpen }),
  setIsBackupHubOpen: (isBackupHubOpen) => set({ isBackupHubOpen }),
  setIsExportingPDF: (isExportingPDF) => set({ isExportingPDF }),
  setAtsKeywords: (atsKeywords) => set({ atsKeywords }),
  setJdText: (jdText) => set({ jdText }),

  // Complex operations
  handleMarkdownChange: (newVal, immediate = false) => {
    set({ markdown: newVal });

    if (isUndoRedoAction) {
      isUndoRedoAction = false;
      return;
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const pushToHistory = () => {
      const { history, historyIndex } = get();
      const nextHistory = history.slice(0, historyIndex + 1);
      if (nextHistory[nextHistory.length - 1] !== newVal) {
        const updated = [...nextHistory, newVal];
        if (updated.length > 50) {
          updated.shift();
          set({ history: updated, historyIndex: updated.length - 1 });
        } else {
          set({ history: updated, historyIndex: updated.length - 1 });
        }
      }
    };

    if (immediate) {
      pushToHistory();
    } else {
      debounceTimer = setTimeout(() => {
        pushToHistory();
      }, 800);
    }
  },

  handleUndo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      isUndoRedoAction = true;
      const prevIndex = historyIndex - 1;
      set({
        historyIndex: prevIndex,
        markdown: history[prevIndex]
      });
    }
  },

  handleRedo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      isUndoRedoAction = true;
      const nextIndex = historyIndex + 1;
      set({
        historyIndex: nextIndex,
        markdown: history[nextIndex]
      });
    }
  },

  updateSetting: (key, value) => {
    const newSettings = { ...get().settings, [key]: value };
    localStorage.setItem('resume-settings', JSON.stringify(newSettings));
    set({ settings: newSettings });
  },

  updateSettings: (partialSettings) => {
    const newSettings = { ...get().settings, ...partialSettings };
    localStorage.setItem('resume-settings', JSON.stringify(newSettings));
    set({ settings: newSettings });
  }
}));
