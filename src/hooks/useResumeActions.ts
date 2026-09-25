import React from 'react';
import { useReactToPrint } from 'react-to-print';
import { useResumeStore } from '../store/useResumeStore';
import { exportDirectPDF } from '../lib/pdf-export';
import { trackAnalyticsEvent } from '../lib/analytics';

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

  // Quick PDF: one-click raster download via html2canvas + jsPDF.
  // This is kept as a visual-fidelity fallback, not the recommended ATS submission path.
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
      trackAnalyticsEvent('pdf_export_success');
      setIsExportingPDF(false);
      setPdfExportProgress(null);
    } catch (err) {
      console.error('Quick PDF export error:', err);
      setIsExportingPDF(false);
      setPdfExportProgress(null);

      // Fall back to the browser print engine so the user still has
      // a text-preserving export path when raster capture fails.
      handleExportVectorPrint();
    }
  };

  // ATS PDF: native browser print / Save as PDF.
  // This is the recommended submission path because browser-generated PDFs
  // normally preserve text/searchability instead of flattening each page to JPEG.
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
        trackAnalyticsEvent('browser_print_started');
        handlePrint();
      } catch (err) {
        setIsExportingPDF(false);
        setPdfExportProgress(null);
        clearTimeout(timer);
      }
    }
  };

  // Main action: default to ATS-friendly browser print / Save as PDF.
  const handleExportPDF = () => {
    handleExportVectorPrint();
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
