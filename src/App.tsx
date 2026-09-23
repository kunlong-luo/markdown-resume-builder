import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/preview/Preview';
import { ResumeChecker } from './components/resume-checker/ResumeChecker';
import { IframeWarningModal } from './components/IframeWarningModal';
import { BackupDraftModal } from './components/backup/BackupDraftModal';
import { HelpLegalModal } from './components/layout/HelpLegalModal';
import { Header } from './components/layout/Header';
import { Toolbar } from './components/layout/Toolbar';
import { useResumeStore } from './store/useResumeStore';
import { useResumeActions } from './hooks/useResumeActions';
import { ResumeSettings } from './types';
import { deserializeShareState } from './lib/share-utils';
import { SharedResumePage } from './components/share/SharedResumePage';
import { useToast } from './components/ui/Toast';
import { smartAutoFit } from './lib/preview-utils';
import { Edit3, Eye, FileDown } from 'lucide-react';
import { Tooltip } from './components/ui/Tooltip';

export default function App() {
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
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
    handleMarkdownChange,
    isHelpLegalOpen,
    setIsHelpLegalOpen
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
      // Snap to exact 50% when close
      const finalRatio = Math.abs(clamped - 50) < 1.5 ? 50 : clamped;
      setSplitRatio(finalRatio);
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
    handleExportDirectPDF,
    handleExportVectorPrint,
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

  const { showToast } = useToast() || {};
  const { updateSetting } = useResumeStore();

  // Global Keyboard Shortcuts (Cmd/Ctrl + S, Cmd/Ctrl + P, Cmd/Ctrl + Shift + F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl + S -> Manual Save trigger Toast
      if (isCmdOrCtrl && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        try {
          localStorage.setItem('resume-markdown', markdown);
          const now = new Date();
          const pad = (num: number) => String(num).padStart(2, '0');
          setLastSaved(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
          showToast?.({
            title: '简历草稿已手动保存',
            message: '核心内容已实时写入浏览器持久化存储',
            type: 'success',
            duration: 2500,
          });
        } catch (err) {
          console.error(err);
        }
      }

      // Cmd/Ctrl + P -> Intercept default browser print and call vector PDF print
      if (isCmdOrCtrl && !e.shiftKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        handleExportVectorPrint();
      }

      // Cmd/Ctrl + Shift + F -> Auto Fit One Page
      if (isCmdOrCtrl && e.shiftKey && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        smartAutoFit(settings, updateSetting);
        showToast?.({
          title: '已触发一键贴合控页',
          message: '微调行高与边距以压缩适应单页',
          type: 'info',
          duration: 2500,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [markdown, settings, setLastSaved, showToast, handleExportVectorPrint, updateSetting]);

  return (
    <div className={`flex flex-col h-[100dvh] overflow-hidden bg-[#f8fafc] dark:bg-[#070a13] text-slate-900 dark:text-slate-100 relative transition-colors duration-200 ${isDragging ? 'select-none cursor-col-resize' : ''}`}>
      <div className="flex flex-col h-full w-full z-10 relative">
        <div className="relative z-50">
          <Header 
            handleImportMarkdown={handleImportMarkdown}
            handleExportMarkdown={handleExportMarkdown}
            handleExportPDF={handleExportPDF}
            handleExportDirectPDF={handleExportDirectPDF}
            handleExportVectorPrint={handleExportVectorPrint}
          />
          <Toolbar />
        </div>

        <main 
          ref={containerRef}
          className="flex-1 flex flex-col md:flex-row overflow-hidden relative pb-14 md:pb-0"
        >
          {/* Editor Pane */}
          {(!isMobile || mobileTab === 'editor') && (
            <section 
              id="editor-pane" 
              style={{
                width: !isMobile ? (settings.layoutMode === 'split' ? `${splitRatio}%` : settings.layoutMode === 'editor' ? '100%' : '0%') : '100%'
              }}
              className={`z-10 relative transition-none h-full ${
                !isMobile && settings.layoutMode === 'preview' ? 'hidden' : 'w-full'
              } border-r border-slate-200/90 dark:border-slate-800`}
            >
              <Editor />
            </section>
          )}

          {/* Draggable Divider for Split Mode on Desktop */}
          {!isMobile && settings.layoutMode === 'split' && (
            <Tooltip
              content={settings.lang === 'en' ? 'Drag to resize (Double click to reset 50%)' : '拖拽调节左右宽度（双击复位 50%）'}
              side="top"
              delay={400}
              disabled={isDragging}
              wrapperClassName="hidden md:flex h-full items-center justify-center z-30"
            >
              <div 
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                className="flex items-center justify-center w-3 h-full -mx-1.5 cursor-col-resize group hover:w-3.5 transition-all select-none relative"
                onDoubleClick={() => setSplitRatio(50)}
              >
                <div className={`w-1 h-8 rounded-full transition-all duration-200 ${isDragging ? 'bg-indigo-600 scale-y-125' : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-indigo-400 dark:group-hover:bg-indigo-400 group-hover:scale-y-110'}`} />
                {isDragging && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900/90 dark:bg-slate-800/95 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow-lg border border-slate-700/80 whitespace-nowrap pointer-events-none animate-in fade-in duration-150 flex items-center gap-1 z-50">
                    <span>{Math.round(splitRatio)}%</span>
                    <span className="text-slate-400">:</span>
                    <span>{Math.round(100 - splitRatio)}%</span>
                  </div>
                )}
              </div>
            </Tooltip>
          )}

          {/* Preview Pane */}
          <section 
            style={{
              width: !isMobile ? (settings.layoutMode === 'split' ? `${100 - splitRatio}%` : settings.layoutMode === 'preview' ? '100%' : '0%') : '100%',
            }}
            className={`transition-none h-full ${
              isMobile 
                ? (mobileTab === 'preview' ? 'w-full relative' : 'absolute -left-[9999px] top-0 w-[210mm] pointer-events-none opacity-0 select-none')
                : (settings.layoutMode === 'editor' ? 'absolute -left-[9999px] top-0 w-[210mm] pointer-events-none opacity-0 select-none' : 'relative')
            }`}
          >
            <Preview 
              ref={contentRef} 
            />
          </section>

          <ResumeChecker />
        </main>

        {/* Mobile Ergonomic Bottom Floating Dock */}
        {isMobile && (
          <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 dark:bg-slate-800/95 border border-slate-700/80 backdrop-blur-xl shadow-2xl rounded-full p-1.5 flex items-center gap-1.5 text-xs font-bold text-white animate-in fade-in slide-in-from-bottom-3 duration-200">
            <button
              onClick={() => setMobileTab('editor')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                mobileTab === 'editor' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>编辑 Markdown</span>
            </button>

            <button
              onClick={() => setMobileTab('preview')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                mobileTab === 'preview' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>A4 预览</span>
            </button>

            <div className="w-px h-4 bg-slate-700 mx-0.5" />

            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all cursor-pointer active:scale-95"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>导出</span>
            </button>
          </div>
        )}

        <IframeWarningModal />
        <BackupDraftModal />
        <HelpLegalModal isOpen={isHelpLegalOpen} onClose={() => setIsHelpLegalOpen(false)} />
      </div>
    </div>
  );
}
