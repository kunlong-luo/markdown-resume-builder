import React, { useRef, useMemo, useEffect } from 'react';
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
    }, 1000); // Save after 1 second of inactivity

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

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f8fafc] relative">
      <AestheticBackdrop />
      
      <div className="flex flex-col h-full w-full z-10 relative pointer-events-none">
        <div className="pointer-events-auto">
          <Header 
            handleImportMarkdown={handleImportMarkdown}
            handleExportMarkdown={handleExportMarkdown}
            handleExportPDF={handleExportPDF}
          />
          <Toolbar />
        </div>

        <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative pointer-events-auto">
        {(settings.layoutMode === 'split' || settings.layoutMode === 'editor') && (
          <section 
            id="editor-pane" 
            className={`z-10 relative border-r border-slate-200 transition-all duration-300 ${
              settings.layoutMode === 'editor' 
                ? 'w-full h-full' 
                : 'w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 border-slate-200'
            }`}
          >
            <Editor />
          </section>
        )}

        {(settings.layoutMode === 'split' || settings.layoutMode === 'preview') && (
          <section 
            className={`relative transition-all duration-300 ${
              settings.layoutMode === 'preview' 
                ? 'w-full h-full' 
                : 'w-full md:w-1/2 h-1/2 md:h-full'
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
