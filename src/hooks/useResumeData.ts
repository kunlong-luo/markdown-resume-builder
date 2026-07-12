import { useState, useEffect, useRef } from 'react';
import { DEFAULT_MARKDOWN, TEMPLATES } from '../data';
import { ResumeSettings } from '../types';

export function useResumeData() {
  const [markdown, setMarkdown] = useState(() => {
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
      let section = sections[i];
      if (i === 0 && !section.startsWith('## ')) {
        // This is the header (before any ## section)
        cleanSections.push(section);
        continue;
      }
      
      const title = section.split('\n')[0].trim();
      const isEdu = title.includes('教育') || title.includes('学校') || title.toLowerCase().includes('education');
      
      if (isEdu) {
        if (seenEdu.has(title)) {
          // Skip duplicate education section
          continue;
        }
        seenEdu.add(title);
      }
      
      cleanSections.push(i === 0 ? section : '## ' + section);
    }
    
    md = cleanSections.join('\n').replace(/\n{3,}/g, '\n\n');
    return md;
  });

  const [currentTemplateId, setCurrentTemplateId] = useState(() => {
    const saved = localStorage.getItem('resume-markdown');
    if (!saved || saved.includes('陆云腾') || saved.includes('极光智云')) return 'ai_backend';
    const match = TEMPLATES.find(t => t.content === saved);
    return match ? match.id : 'ai_backend';
  });

  const [lastSaved, setLastSaved] = useState<string>('');

  // --- Undo/Redo History System ---
  const [history, setHistory] = useState<string[]>([markdown]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isUndoRedoAction = useRef(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const [settings, setSettings] = useState<ResumeSettings>(() => {
    const savedSettings = localStorage.getItem('resume-settings');
    const defaultSettings: ResumeSettings = {
      themeColor: 'blue',
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
    };
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        return { ...defaultSettings, ...parsed };
      } catch (e) {}
    }
    return defaultSettings;
  });

  const handleMarkdownChange = (newVal: string, immediate = false) => {
    setMarkdown(newVal);

    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const pushToHistory = () => {
      setHistory(prev => {
        const nextHistory = prev.slice(0, historyIndex + 1);
        if (nextHistory[nextHistory.length - 1] !== newVal) {
          const updated = [...nextHistory, newVal];
          if (updated.length > 50) {
            updated.shift();
            setHistoryIndex(updated.length - 1);
            return updated;
          }
          setHistoryIndex(updated.length - 1);
          return updated;
        }
        return prev;
      });
    };

    if (immediate) {
      pushToHistory();
    } else {
      debounceTimer.current = setTimeout(() => {
        pushToHistory();
      }, 800);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setMarkdown(history[prevIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setMarkdown(history[nextIndex]);
    }
  };

  // Debounce saving to localStorage to prevent layout blocking on every keypress
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      localStorage.setItem('resume-markdown', markdown);
      const now = new Date();
      const pad = (num: number) => String(num).padStart(2, '0');
      setLastSaved(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    }, 1000); // Save after 1 second of inactivity

    return () => clearTimeout(saveTimer);
  }, [markdown]);

  useEffect(() => {
    localStorage.setItem('resume-settings', JSON.stringify(settings));
  }, [settings]);

  // Automated periodic autosave
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const currentDraftsRaw = localStorage.getItem('resume-drafts');
        const currentDrafts = currentDraftsRaw ? JSON.parse(currentDraftsRaw) : [];
        const hasDuplicate = currentDrafts.some((d: any) => d.markdown === markdown);
        if (hasDuplicate) return;

        const newAutoDraft = {
          id: `draft_auto_${Date.now()}`,
          title: `自动备份 - ${new Date().toLocaleTimeString('zh-CN', { hour12: false })}`,
          markdown,
          settings,
          timestamp: new Date().toLocaleString('zh-CN', { hour12: false }),
          isAutoSave: true
        };

        const otherDrafts = currentDrafts.filter((d: any) => !d.isAutoSave);
        const autoDrafts = currentDrafts.filter((d: any) => d.isAutoSave);
        const updatedAutoDrafts = [newAutoDraft, ...autoDrafts].slice(0, 5);
        localStorage.setItem('resume-drafts', JSON.stringify([...updatedAutoDrafts, ...otherDrafts]));
      } catch (e) {}
    }, 180000); // Every 3 minutes

    return () => clearInterval(interval);
  }, [markdown, settings]);

  const updateSetting = <K extends keyof ResumeSettings>(key: K, value: ResumeSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateSettings = (newSettings: Partial<ResumeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    markdown,
    setMarkdown,
    settings,
    setSettings,
    currentTemplateId,
    setCurrentTemplateId,
    lastSaved,
    handleMarkdownChange,
    handleUndo,
    handleRedo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    updateSetting,
    updateSettings
  };
}
