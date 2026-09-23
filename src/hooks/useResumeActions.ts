import React from 'react';
import { useReactToPrint } from 'react-to-print';
import { useResumeStore } from '../store/useResumeStore';
import { exportDirectPDF } from '../lib/pdf-export';

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
    setPdfExportProgress,
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
    return settings.lang === 'en' ? 'resume' : '简历';
  };

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `${getExportTitle()}_${settings.lang === 'en' ? 'resume' : '简历'}`,
    onAfterPrint: () => {
      setIsExportingPDF(false);
      setPdfExportProgress(null);
    },
    onPrintError: () => {
      setIsExportingPDF(false);
      setPdfExportProgress(null);
    }
  });

  // Mode A: Direct PDF download (one-click silent download via html2canvas + jsPDF)
  const handleExportDirectPDF = async () => {
    if (isExportingPDF) return;
    setIsExportingPDF(true);
    setPdfExportProgress(settings.lang === 'en' ? 'Preparing PDF...' : '准备导出 PDF...');

    try {
      const targetElement = contentRef.current 
        || document.getElementById('resume-print-content') 
        || (document.querySelector('.resume-content') as HTMLElement);

      if (!targetElement) {
        throw new Error('未找到简历内容节点');
      }

      await exportDirectPDF(targetElement, {
        filename: `${getExportTitle()}_${settings.lang === 'en' ? 'resume' : '简历'}.pdf`,
        onProgress: (status) => {
          setPdfExportProgress(status);
        }
      });
    } catch (err) {
      console.error('Direct PDF export error:', err);
      // If direct capture fails, fall back to print
      handleExportVectorPrint();
    } finally {
      setIsExportingPDF(false);
      setPdfExportProgress(null);
    }
  };

  // Mode B: Native browser vector print
  const handleExportVectorPrint = () => {
    if (isExportingPDF) return;
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      setIsIframeModalOpen(true);
    } else {
      setIsExportingPDF(true);
      setPdfExportProgress(settings.lang === 'en' ? 'Opening print dialog...' : '调起打印窗口...');
      const timer = setTimeout(() => {
        setIsExportingPDF(false);
        setPdfExportProgress(null);
      }, 6000);

      try {
        handlePrint();
      } catch (err) {
        setIsExportingPDF(false);
        setPdfExportProgress(null);
        clearTimeout(timer);
      }
    }
  };

  // Main action: default to Direct PDF Download
  const handleExportPDF = () => {
    handleExportDirectPDF();
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
    handleExportDirectPDF,
    handleExportVectorPrint,
    handleExportMarkdown,
    handleImportMarkdown,
    getExportTitle
  };
}
