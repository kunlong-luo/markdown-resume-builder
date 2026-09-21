import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/preview/Preview';
import { ResumeChecker } from './components/resume-checker/ResumeChecker';
import { IframeWarningModal } from './components/IframeWarningModal';
import { BackupDraftModal } from './components/backup/BackupDraftModal';
import { Header } from './components/layout/Header';
import { Toolbar } from './components/layout/Toolbar';
import { useResumeStore } from './store/useResumeStore';
import { useResumeActions } from './hooks/useResumeActions';
import { ResumeSettings } from './types';
import { deserializeShareState } from './lib/share-utils';
import { SharedResumePage } from './components/share/SharedResumePage';
import { AestheticBackdrop } from './components/layout/AestheticBackdrop';

export default function App() {
  const shareState = useMemo(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const shareHash = urlParams.get('share');
      if (shareHash) {
        return deserializeShareState(shareHash);
      }
    } catch (e) {
      console.error('Failed to parse share parameter', e);
    }
    return null;
  }, []);

  if (shareState) {
    return <SharedResumePage shareState={shareState} />;
  }

  const {
    markdown,
    settings,
    setLastSaved,
    setMarkdown,
    setSettings,
    handleMarkdownChange
  } = useResumeStore();

  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  // Resizable split ratio (percentage for editor width)
  const [splitRatio, setSplitRatio] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('resume-split-ratio');
      if (saved) {
        const parsed = parseFloat(saved);
        if (parsed >= 25 && parsed <= 75) return parsed;
      }
    } catch (e) {}
    return 50;
  });

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newRatio = ((clientX - rect.left) / rect.width) * 100;
      // Clamp between 28% and 72%
      const clamped = Math.min(Math.max(newRatio, 28), 72);
      setSplitRatio(clamped);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      try {
        localStorage.setItem('resume-split-ratio', String(splitRatio));
      } catch (e) {}
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, splitRatio]);

  const {
    handleExportPDF,
    handleExportMarkdown,
    handleImportMarkdown
  } = useResumeActions({
    contentRef
  });

  const handleRestoreDraft = (newMarkdown: string, newSettings: ResumeSettings) => {
    setMarkdown(newMarkdown);
    setSettings(newSettings);
    handleMarkdownChange(newMarkdown, true);
  };

  // Debounce saving markdown to localStorage to prevent layout blocking on every keypress
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      localStorage.setItem('resume-markdown', markdown);
      const now = new Date();
      const pad = (num: number) => String(num).padStart(2, '0');
      setLastSaved(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [markdown, setLastSaved]);

  // Automated periodic autosave (every 3 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const currentDraftsRaw = localStorage.getItem('resume-drafts');
        const currentDrafts = currentDraftsRaw ? JSON.parse(currentDraftsRaw) : [];
        const hasDuplicate = currentDrafts.some((d: any) => d.markdown === markdown);
        if (hasDuplicate) return;

        const isEn = settings.lang === 'en';
        const newAutoDraft = {
          id: `draft_auto_${Date.now()}`,
          title: new Date().toLocaleTimeString(isEn ? 'en-US' : 'zh-CN', { hour12: false }),
          markdown,
          settings,
          timestamp: new Date().toLocaleString(isEn ? 'en-US' : 'zh-CN', { hour12: false }),
          isAutoSave: true
        };

        const otherDrafts = currentDrafts.filter((d: any) => !d.isAutoSave);
        const autoDrafts = currentDrafts.filter((d: any) => d.isAutoSave);
        const updatedAutoDrafts = [newAutoDraft, ...autoDrafts].slice(0, 5);
        localStorage.setItem('resume-drafts', JSON.stringify([...updatedAutoDrafts, ...otherDrafts]));
      } catch (e) {}
    }, 180000);

    return () => clearInterval(interval);
  }, [markdown, settings]);

  // Dark mode / Studio Dark synchronization
  useEffect(() => {
    const applyTheme = () => {
      const mode = settings.themeMode || 'light';
      let isDark = false;
      if (mode === 'dark') {
        isDark = true;
      } else if (mode === 'system') {
        isDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', isDark);
      }
      try {
        localStorage.setItem('resume_theme_mode', mode);
      } catch (e) {}
    };

    applyTheme();

    if (settings.themeMode === 'system' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [settings.themeMode]);

  return (
    <div className={`flex flex-col h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#070a13] text-slate-900 dark:text-slate-100 relative transition-colors duration-200 ${isDragging ? 'select-none cursor-col-resize' : ''}`}>
      <AestheticBackdrop />
      
      <div className="flex flex-col h-full w-full z-10 relative">
        <div className="relative z-30">
          <Header 
            handleImportMarkdown={handleImportMarkdown}
            handleExportMarkdown={handleExportMarkdown}
            handleExportPDF={handleExportPDF}
          />
          <Toolbar />
        </div>

        <main 
          ref={containerRef}
          className="flex-1 flex flex-col md:flex-row overflow-hidden relative"
        >
          {(settings.layoutMode === 'split' || settings.layoutMode === 'editor') && (
            <section 
              id="editor-pane" 
              style={{
                width: settings.layoutMode === 'split' ? (!isMobile ? `${splitRatio}%` : '100%') : '100%'
              }}
              className={`z-10 relative border-r border-slate-200/90 dark:border-slate-800 transition-none ${
                settings.layoutMode === 'editor' 
                  ? 'w-full h-full' 
                  : 'h-1/2 md:h-full border-b md:border-b-0 border-slate-200/90 dark:border-slate-800'
              }`}
            >
              <Editor />
            </section>
          )}

          {/* Draggable Divider for Split Mode */}
          {settings.layoutMode === 'split' && (
            <div 
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className="hidden md:flex items-center justify-center w-3 -mx-1.5 z-30 cursor-col-resize group hover:w-3.5 transition-all select-none"
              title="拖拽调节编辑器与预览区宽度（双击复位 50%）"
              onDoubleClick={() => setSplitRatio(50)}
            >
              <div className={`w-1 h-8 rounded-full transition-all duration-200 ${isDragging ? 'bg-indigo-600 scale-y-125' : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-indigo-400 dark:group-hover:bg-indigo-400 group-hover:scale-y-110'}`} />
            </div>
          )}

          {(settings.layoutMode === 'split' || settings.layoutMode === 'preview') && (
            <section 
              style={{
                width: settings.layoutMode === 'split' ? (!isMobile ? `${100 - splitRatio}%` : '100%') : '100%'
              }}
              className={`relative transition-none ${
                settings.layoutMode === 'preview' 
                  ? 'w-full h-full' 
                  : 'h-1/2 md:h-full'
              }`}
            >
              <Preview 
                ref={contentRef} 
              />
            </section>
          )}

          <ResumeChecker />
        </main>

        <IframeWarningModal />
        <BackupDraftModal />
      </div>
    </div>
  );
}
