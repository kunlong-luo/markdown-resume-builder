import React, { useState, useRef, useMemo, useDeferredValue } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/preview/Preview';
import { ResumeChecker } from './components/resume-checker/ResumeChecker';
import { IframeWarningModal } from './components/IframeWarningModal';
import { BackupDraftModal } from './components/backup/BackupDraftModal';
import { Header } from './components/layout/Header';
import { Toolbar } from './components/layout/Toolbar';
import { DEFAULT_MARKDOWN, TEMPLATES } from './data';
import { ResumeSettings } from './types';
import { useResumeData } from './hooks/useResumeData';
import { useResumeActions } from './hooks/useResumeActions';
import { getWordCount } from './lib/word-count';
import { useConfirm } from './context/ConfirmContext';

export default function App() {
  const {
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
    canUndo,
    canRedo,
    updateSetting,
    updateSettings
  } = useResumeData();

  const { confirm } = useConfirm();

  const [isCheckerOpen, setIsCheckerOpen] = useState(false);
  const [isIframeModalOpen, setIsIframeModalOpen] = useState(false);
  const [isBackupHubOpen, setIsBackupHubOpen] = useState(false);
  const [customFileName, setCustomFileName] = useState('');
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const {
    handleExportPDF,
    handleExportMarkdown,
    handleImportMarkdown,
    getExportTitle
  } = useResumeActions({
    markdown,
    settings,
    customFileName,
    contentRef,
    handleMarkdownChange,
    setIsIframeModalOpen,
    isExportingPDF,
    setIsExportingPDF
  });

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

  const handleRestoreDraft = (newMarkdown: string, newSettings: ResumeSettings) => {
    setMarkdown(newMarkdown);
    setSettings(newSettings);
    handleMarkdownChange(newMarkdown, true);
  };

  const handleReset = async () => {
    const isEn = settings.lang === 'en';
    const confirmed = await confirm({
      title: isEn ? 'Reset Template' : '重置模板',
      message: isEn
        ? 'Are you sure you want to reset to the default template? Your current changes will be lost.'
        : '确定要重置为默认模板吗？当前的修改将会丢失。',
      confirmText: isEn ? 'Reset' : '确定重置',
      cancelText: isEn ? 'Cancel' : '取消',
      type: 'danger'
    });
    if (confirmed) {
      handleMarkdownChange(DEFAULT_MARKDOWN, true);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(window.location.href, '_blank');
    setIsIframeModalOpen(false);
  };

  const wordCount = useMemo(() => getWordCount(markdown), [markdown]);
  const exportTitle = useMemo(() => getExportTitle(), [markdown, customFileName]);
  const deferredMarkdown = useDeferredValue(markdown);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f8fafc]">
      <Header 
        wordCount={wordCount}
        lastSaved={lastSaved}
        isCheckerOpen={isCheckerOpen}
        setIsCheckerOpen={setIsCheckerOpen}
        setIsBackupHubOpen={setIsBackupHubOpen}
        handleImportMarkdown={handleImportMarkdown}
        handleExportMarkdown={handleExportMarkdown}
        handleExportPDF={handleExportPDF}
        isExportingPDF={isExportingPDF}
        lang={settings.lang || 'zh'}
      />

      <Toolbar 
        settings={settings}
        updateSetting={updateSetting}
        updateSettings={updateSettings}
        currentTemplateId={currentTemplateId}
        handleTemplateChange={handleTemplateChange}
        customFileName={customFileName}
        setCustomFileName={setCustomFileName}
        exportTitle={exportTitle}
      />

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {(settings.layoutMode === 'split' || settings.layoutMode === 'editor') && (
          <section 
            id="editor-pane" 
            className={`z-10 relative border-r border-slate-200 transition-all duration-300 ${
              settings.layoutMode === 'editor' 
                ? 'w-full h-full' 
                : 'w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 border-slate-200'
            }`}
          >
            <Editor 
              value={markdown} 
              onChange={handleMarkdownChange} 
              onReset={handleReset} 
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
              settings={settings}
            />
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
              markdown={deferredMarkdown} 
              settings={settings} 
              ref={contentRef} 
              onChangeSettings={updateSetting}
            />
          </section>
        )}

        <ResumeChecker
          markdown={deferredMarkdown}
          onUpdateMarkdown={handleMarkdownChange}
          isOpen={isCheckerOpen}
          onClose={() => setIsCheckerOpen(false)}
        />
      </main>

      <IframeWarningModal
        isOpen={isIframeModalOpen}
        onClose={() => setIsIframeModalOpen(false)}
        onOpenNewTab={handleOpenInNewTab}
        lang={settings.lang}
      />

      <BackupDraftModal
        isOpen={isBackupHubOpen}
        onClose={() => setIsBackupHubOpen(false)}
        markdown={markdown}
        settings={settings}
        onRestore={handleRestoreDraft}
      />
    </div>
  );
}

