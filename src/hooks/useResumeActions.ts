import React from 'react';
import { useReactToPrint } from 'react-to-print';
import { useResumeStore } from '../store/useResumeStore';

interface UseResumeActionsProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export function useResumeActions({ contentRef }: UseResumeActionsProps) {
  const {
    markdown,
    settings,
    customFileName,
    isExportingPDF,
    setIsIframeModalOpen,
    setIsExportingPDF,
    handleMarkdownChange
  } = useResumeStore();
  
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

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `${getExportTitle()}_简历`,
    onAfterPrint: () => {
      setIsExportingPDF(false);
    },
    onPrintError: () => {
      setIsExportingPDF(false);
    }
  });

  const handleExportPDF = () => {
    if (isExportingPDF) return;
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      setIsIframeModalOpen(true);
    } else {
      setIsExportingPDF(true);
      // Fallback timer: reset isExportingPDF after 6 seconds in case browser printing interactions block or omit callbacks
      const timer = setTimeout(() => {
        setIsExportingPDF(false);
      }, 6000);

      try {
        handlePrint();
      } catch (err) {
        setIsExportingPDF(false);
        clearTimeout(timer);
      }
    }
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    let filename = `${getExportTitle()}_resume.md`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportMarkdown = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        handleMarkdownChange(result, true);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return {
    handleExportPDF,
    handleExportMarkdown,
    handleImportMarkdown,
    getExportTitle
  };
}
