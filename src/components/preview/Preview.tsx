
import React, { forwardRef, useState, useEffect, useMemo, useRef, useDeferredValue } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ZoomIn, ZoomOut, Sliders, Grid, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { ResumeSettings } from '../../types';
import { useResumeStore } from '../../store/useResumeStore';
import { ThreePreview } from './ThreePreview';
import { storage, STORAGE_KEYS } from '../../lib/storage';

import { 
  THEME_MAP, FONT_FAMILY_CLASSES, parseResumeHeader, cleanMarkdown, 
  parseH2Sections, smartAutoFit, getSizeClasses
} from '../../lib/preview-utils';
import { createMarkdownComponents } from './PreviewRenderers';
import { HeightGuard } from './HeightGuard';
import { ResumeHeader } from './ResumeHeader';
import { CustomSlider } from '../ui/CustomSlider';

interface PreviewProps {
  overrideMarkdown?: string;
  overrideSettings?: ResumeSettings;
}

export const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ overrideMarkdown, overrideSettings }, ref) => {
  const {
    markdown: storeMarkdown,
    settings: storeSettings,
    updateSetting: onChangeSettings,
    setMeasuredPageCount
  } = useResumeStore();

  const activeMarkdown = overrideMarkdown !== undefined ? overrideMarkdown : storeMarkdown;
  const markdown = useDeferredValue(activeMarkdown);
  const settings = overrideSettings !== undefined ? overrideSettings : storeSettings;

  const theme = THEME_MAP[settings.themeColor] || THEME_MAP.blue;
  const fontClass = FONT_FAMILY_CLASSES[settings.fontFamily];

  const [targetPageLimit, setTargetPageLimit] = useState<1 | 2 | 3>(1);
  const [showGrid, setShowGrid] = useState<boolean>(() => {
    return storage.get<boolean>('resume_preview_show_grid', false);
  });

  const [show3D, setShow3D] = useState<boolean>(() => {
    return storage.get<boolean>('resume_preview_show_3d', false);
  });

  const toggleGrid = () => {
    setShowGrid(prev => {
      const next = !prev;
      storage.set('resume_preview_show_grid', next);
      return next;
    });
  };

  const toggle3D = () => {
    setShow3D(prev => {
      const next = !prev;
      storage.set('resume_preview_show_3d', next);
      return next;
    });
  };
  const [metrics, setMetrics] = useState({
    isOver: false,
    overflowPercent: 0,
    overflowPixels: 0,
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [wrapperWidth, setWrapperWidth] = useState<number>(850);
  const [unscaledHeight, setUnscaledHeight] = useState<number>(0);
  const [zoomMode, setZoomMode] = useState<'fit' | number>(() => {
    const saved = storage.getString(STORAGE_KEYS.PREVIEW_ZOOM);
    if (saved) {
      if (saved === 'fit') return 'fit';
      const parsed = parseFloat(saved);
      if (!isNaN(parsed)) return parsed;
    }
    return 'fit';
  });
  const [isAutoFitting, setIsAutoFitting] = useState(false);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    let rafId: number | null = null;
    const handleResize = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!element) return;
        const newWidth = element.clientWidth;
        setWrapperWidth((prev) => (Math.abs(prev - newWidth) > 1 ? newWidth : prev));
      });
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(element);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  const calculatedZoom = useMemo(() => {
    if (zoomMode === 'fit') {
      const horizontalPadding = wrapperWidth < 640 ? 20 : 64;
      const targetWidth = Math.max(100, wrapperWidth - horizontalPadding);
      const scale = targetWidth / 794; // 210mm standard is ~794px at 96dpi
      return Math.max(0.2, Math.min(1.2, scale));
    }
    return zoomMode;
  }, [zoomMode, wrapperWidth]);

  useEffect(() => {
    const element = ref && 'current' in ref ? ref.current : null;
    if (!element) return;

    let rafId: number | null = null;
    const measure = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!element) return;
        const width = element.clientWidth;
        const height = element.clientHeight;
        if (!width || !height) return;

        setUnscaledHeight(height);

        // Standard A4 aspect ratio height: 297mm / 210mm = 1.4142857
        const pHeight = (width / 210) * 297;
        
        // Calculate actual rendered page count with a 24px (~6.3mm) buffer
        // to avoid subpixel rounding errors on min-h-[297mm] falsely reporting 2 pages.
        const tolerance = 24;
        const actualPages = Math.max(1, Math.floor((height - tolerance) / pHeight) + 1);
        setMeasuredPageCount(actualPages);

        const limitHeight = targetPageLimit * pHeight;
        const isOver = height > limitHeight + tolerance;
        const overflowPixels = Math.max(0, Math.round(height - limitHeight));
        const overflowPercent = Math.min(
          150,
          Math.max(10, Math.round((height / limitHeight) * 100))
        );

        setMetrics({ isOver, overflowPercent, overflowPixels });
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    const timer = setTimeout(measure, 300);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [markdown, settings, ref, targetPageLimit, setMeasuredPageCount]);

  useEffect(() => {
    if (!isAutoFitting || !onChangeSettings) return;

    const runFitStep = () => {
      if (metrics.isOver) {
        let adjusted = false;

        // Progressive compaction step-by-step
        if (settings.margin === 'relaxed') {
          onChangeSettings('margin', 'standard');
          adjusted = true;
        } else if (settings.margin === 'standard') {
          onChangeSettings('margin', 'compact');
          adjusted = true;
        } else if (settings.blockGap > 0.8) {
          onChangeSettings('blockGap', Math.max(0.6, Number((settings.blockGap - 0.1).toFixed(2))));
          adjusted = true;
        } else if (settings.lineHeight > 1.45) {
          onChangeSettings('lineHeight', Math.max(1.35, Number((settings.lineHeight - 0.05).toFixed(2))));
          adjusted = true;
        } else if (settings.fontSize === 'relaxed') {
          onChangeSettings('fontSize', 'standard');
          adjusted = true;
        } else if (settings.fontSize === 'standard') {
          onChangeSettings('fontSize', 'compact');
          adjusted = true;
        } else if (settings.blockGap > 0.35) {
          onChangeSettings('blockGap', Math.max(0.3, Number((settings.blockGap - 0.05).toFixed(2))));
          adjusted = true;
        } else if (settings.lineHeight > 1.25) {
          onChangeSettings('lineHeight', Math.max(1.2, Number((settings.lineHeight - 0.05).toFixed(2))));
          adjusted = true;
        } else if (settings.letterSpacing > -0.01) {
          onChangeSettings('letterSpacing', Math.max(-0.02, Number((settings.letterSpacing - 0.01).toFixed(2))));
          adjusted = true;
        }

        if (!adjusted) {
          setIsAutoFitting(false);
        }
      } else {
        setIsAutoFitting(false);
      }
    };

    const timer = setTimeout(runFitStep, 90);
    return () => clearTimeout(timer);
  }, [isAutoFitting, metrics.isOver, settings, onChangeSettings]);

  const handleSmartAutoFit = () => {
    if (!onChangeSettings) return;
    if (metrics.isOver) {
      setIsAutoFitting(true);
    } else {
      // If not overflowing, run standard helper to optimize general spacing anyway
      smartAutoFit(settings, (key, val) => onChangeSettings(key as any, val));
    }
  };
  
  const cleaned = useMemo(() => cleanMarkdown(markdown), [markdown]);
  const headerInfo = useMemo(() => parseResumeHeader(cleaned), [cleaned]);
  const sizeClasses = useMemo(() => getSizeClasses(settings.fontSize, theme), [settings.fontSize, theme]);

  const markdownComponents = useMemo(() => {
    return createMarkdownComponents({ headerInfo, sizeClasses, theme, settings });
  }, [headerInfo, sizeClasses, theme, settings]);

  const marginClasses = {
    compact: 'p-[10mm] sm:p-[12mm] print:p-[12mm]',
    standard: 'p-[15mm] sm:p-[18mm] print:p-[18mm]',
    relaxed: 'p-[20mm] sm:p-[25mm] print:p-[25mm]',
  }[settings.margin];

  // Memoized Inner Resume Content to prevent duplication between 2D and 3D preview containers
  const resumeInnerContent = useMemo(() => {
    const bodyContent = headerInfo.hasHeader ? headerInfo.bodyMarkdown : cleaned;
    
    // Scissor pagebreak label
    const pageBreakLabel = settings.lang === 'en' ? 'A4 Page {p} Boundary ({size}mm) ✂️' : 'A4 第 {p} 页边界线 ({size}mm) ✂️';

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            .resume-wrapper {
              height: auto !important;
              max-width: none !important;
              width: 100% !important;
            }
            .resume-content {
              transform: none !important;
              position: static !important;
              left: auto !important;
              max-width: none !important;
              width: 100% !important;
            }
          }
          :root {
            --custom-theme-color: ${settings.customColor || '#4f46e5'};
          }
          .custom-accent-text { color: var(--custom-theme-color) !important; }
          .custom-accent-text:hover { filter: brightness(0.85); }
          .custom-h2-accent::before { background-color: var(--custom-theme-color) !important; }
          .custom-li-accent::before { background-color: var(--custom-theme-color) !important; opacity: 0.5; }
          .custom-blockquote-accent { border-left-color: var(--custom-theme-color) !important; background-color: color-mix(in srgb, var(--custom-theme-color) 8%, white) !important; }
          .custom-badge-bg { background-color: color-mix(in srgb, var(--custom-theme-color) 10%, white) !important; border-color: color-mix(in srgb, var(--custom-theme-color) 20%, white) !important; color: var(--custom-theme-color) !important; }
          .custom-icon-color { color: var(--custom-theme-color) !important; }
          .custom-top-accent { background-color: var(--custom-theme-color) !important; }
          .custom-h2-badge-bg { background-color: color-mix(in srgb, var(--custom-theme-color) 8%, white) !important; }
          .custom-h2-badge-border { border-left: 3.5px solid var(--custom-theme-color) !important; }
          .custom-h2-badge-text { color: color-mix(in srgb, var(--custom-theme-color) 80%, black) !important; }

          .resume-content p { margin-bottom: calc(0.5rem * ${settings.blockGap ?? 1.0}) !important; line-height: ${settings.lineHeight ?? 1.6} !important; letter-spacing: ${settings.letterSpacing ?? 0}em !important; }
          .resume-content li { margin-bottom: calc(0.25rem * ${settings.blockGap ?? 1.0}) !important; line-height: ${settings.lineHeight ?? 1.6} !important; letter-spacing: ${settings.letterSpacing ?? 0}em !important; }
          .resume-content h3 { margin-top: calc(1rem * ${settings.blockGap ?? 1.0}) !important; margin-bottom: calc(0.25rem * ${settings.blockGap ?? 1.0}) !important; letter-spacing: ${settings.letterSpacing ?? 0}em !important; }
          .resume-content h4 { margin-top: calc(0.75rem * ${settings.blockGap ?? 1.0}) !important; margin-bottom: calc(0.2rem * ${settings.blockGap ?? 1.0}) !important; letter-spacing: ${settings.letterSpacing ?? 0}em !important; }
          .resume-content h2 { margin-top: calc(1.5rem * ${settings.blockGap ?? 1.0}) !important; margin-bottom: calc(0.75rem * ${settings.blockGap ?? 1.0}) !important; letter-spacing: ${settings.letterSpacing ?? 0}em !important; }
          .resume-content ul { margin-bottom: calc(0.75rem * ${settings.blockGap ?? 1.0}) !important; }
          .resume-content .flex-row.items-baseline { margin-top: calc(1.25rem * ${settings.blockGap ?? 1.0}) !important; margin-bottom: calc(0.375rem * ${settings.blockGap ?? 1.0}) !important; }
        `}} />

        {settings.showPageBreakLine && (
          <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none print:hidden z-30">
            {[1, 2, 3].map(p => (
              <div 
                key={p} 
                className="absolute left-0 right-0 border-b border-dashed border-rose-300/70 dark:border-rose-700/60 flex items-center justify-between text-[9.5px] select-none h-0" 
                style={{ top: `${p * 297}mm` }}
              >
                {/* Left side guide tag */}
                <div className="bg-white/95 dark:bg-slate-850/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-md shadow-xs ml-4 -translate-y-1/2 flex items-center gap-1.5 font-medium tracking-tight">
                  <span className="text-[10px] opacity-70">✂️</span>
                  <span className="text-[9px] font-mono tracking-wider">{settings.lang === 'en' ? 'A4 Page Fold' : 'A4 分页裁切线'}</span>
                </div>
                {/* Right side page number badge */}
                <div className="bg-white/95 dark:bg-slate-850/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-md shadow-xs mr-4 -translate-y-1/2 font-mono flex items-center gap-1.5 text-[9px] font-medium tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500/80 inline-block" />
                  <span>{pageBreakLabel.replace('{p}', String(p)).replace('{size}', String(p * 297))}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {showGrid && (
          <div 
            className="absolute inset-0 pointer-events-none z-20 print:hidden select-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(99, 102, 241, 0.055) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(99, 102, 241, 0.055) 1px, transparent 1px)
              `,
              backgroundSize: '12px 12px',
            }}
          />
        )}

        {settings.topAccentLine && <div className={`absolute top-0 left-0 right-0 h-[4.5px] ${theme.topAccentColor}`} />}
        
        {headerInfo.hasHeader && <ResumeHeader headerInfo={headerInfo} theme={theme} />}

        {(() => {
          if (settings.templateLayout === 'two-column') {
            const sections = parseH2Sections(bodyContent);
            const SIDEBAR_KEYWORDS = ['个人信息', '基本信息', '联系', '技能', '评价', '总结', 'about', 'skill', 'contact', 'summary'];
            const isSidebar = (t: string) => SIDEBAR_KEYWORDS.some(k => t.toLowerCase().includes(k));

            let sidebarSections = sections.filter(s => isSidebar(s.title));
            let mainSections = sections.filter(s => !isSidebar(s.title));

            if (sections.length > 1 && sidebarSections.length === 0) {
              sidebarSections = [sections[0]];
              mainSections = sections.slice(1);
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 print:grid-cols-12 print:gap-6 mt-4">
                <div className="md:col-span-4 print:col-span-4 md:border-r md:border-gray-150 print:border-r print:border-gray-150 md:pr-5 print:pr-5 flex flex-col gap-4">
                  {sidebarSections.map((sec, i) => (
                    <div key={`side-${i}`} className="break-inside-avoid">
                      <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{sec.rawTitleLine ? `${sec.rawTitleLine}\n\n${sec.content}` : sec.content}</Markdown>
                    </div>
                  ))}
                </div>
                <div className="md:col-span-8 print:col-span-8 flex flex-col gap-4 pl-1">
                  {mainSections.map((sec, i) => (
                    <div key={`main-${i}`} className="break-inside-avoid">
                      <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{sec.rawTitleLine ? `${sec.rawTitleLine}\n\n${sec.content}` : sec.content}</Markdown>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          const pages = bodyContent.split(/<!--\s*pagebreak\s*-->/gi);
          return pages.map((page, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <>
                  <div className="print:hidden my-8 border-t-2 border-dashed border-gray-300 relative flex justify-center select-none">
                    <span className="absolute -top-3 bg-white px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{settings.lang === 'en' ? 'Page Break' : '分页符 / Page Break'}</span>
                  </div>
                  <div className="hidden print:block print-page-break" />
                </>
              )}
              <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{page}</Markdown>
            </React.Fragment>
          ));
        })()}
      </>
    );
  }, [headerInfo, cleaned, settings, markdownComponents, showGrid, theme]);

  const t = settings.lang === 'en' ? {
    previewHeader: 'Real-time Rendering Preview (A4 Page)',
    zoomOut: 'Zoom Out',
    zoomIn: 'Zoom In',
    zoomSlider: 'Slide to adjust zoom',
    zoomFit: 'Fit',
    pageBreakText: 'A4 Page {p} Boundary ({size}mm) ✂️',
  } : {
    previewHeader: '实时渲染预览 (A4 页面)',
    zoomOut: '缩小',
    zoomIn: '放大',
    zoomSlider: '滑动调整缩放',
    zoomFit: '自适应',
    pageBreakText: 'A4 第 {p} 页边界线 ({size}mm) ✂️',
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Zoom and Preview Toolbar */}
      <div className={`flex flex-row items-center justify-between px-3 sm:px-4 ${settings.isCompactTools ? 'py-1 sm:py-1.5' : 'py-1.5 sm:py-2'} bg-slate-50/95 dark:bg-slate-900/95 border-b border-slate-200/60 dark:border-slate-800/80 backdrop-blur-sm z-30 select-none print:hidden shrink-0 gap-2 transition-all`}>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ${settings.isCompactTools ? 'hidden sm:inline-block' : ''}`}>{t.previewHeader}</span>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Grid Toggle Button */}
          <button
            onClick={toggleGrid}
            className={`group flex items-center gap-1.5 ${settings.isCompactTools ? 'px-2 py-1' : 'px-2.5 py-1'} text-[10px] font-bold rounded-lg border transition-all cursor-pointer shrink-0 ${
              showGrid
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-800/50 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
            }`}
            title={settings.lang === 'en' ? 'Toggle alignment grid lines' : '显示/隐藏高精度排版网格辅助线'}
          >
            <Grid className="w-3.5 h-3.5 shrink-0" />
            <span className={settings.isCompactTools ? "max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-200 ease-out overflow-hidden inline-block whitespace-nowrap ml-0 group-hover:ml-1" : ""}>
              {settings.lang === 'en' ? 'Grid' : '网格线'}
            </span>
          </button>

          {/* 3D Space Toggle Button */}
          <button
            onClick={toggle3D}
            className={`group flex items-center gap-1.5 ${settings.isCompactTools ? 'px-2 py-1' : 'px-2.5 py-1'} text-[10px] font-bold rounded-lg border transition-all cursor-pointer shrink-0 ${
              show3D
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_2px_6px_rgba(99,102,241,0.3)]'
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
            }`}
            title={settings.lang === 'en' ? 'Toggle 3D Immersive Studio' : '进入 3D 拟真排版空间'}
          >
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span className={settings.isCompactTools ? "max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-200 ease-out overflow-hidden inline-block whitespace-nowrap ml-0 group-hover:ml-1" : ""}>
              {settings.lang === 'en' ? '3D View' : '3D 空间'}
            </span>
          </button>

          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 min-w-[32px] text-right">
            {Math.round(calculatedZoom * 100)}%
          </span>
        </div>
      </div>

      {show3D ? (
        <div className="flex-1 w-full h-full relative">
          <ThreePreview lang={settings.lang === 'en' ? 'en' : 'zh'}>
            <div className={`w-full text-left relative ${fontClass} ${marginClasses}`}>
              {resumeInnerContent}
            </div>
          </ThreePreview>
          
          {/* Hidden but print-accessible original 2D element so react-to-print finds it */}
          <div className="hidden print:block absolute left-[-9999px] top-0">
            <div 
              ref={ref}
              id="resume-print-content"
              className={`bg-white resume-content w-full max-w-[210mm] min-h-[297mm] h-fit mx-auto ${fontClass} ${marginClasses}`}
            >
              {resumeInnerContent}
            </div>
          </div>
        </div>
      ) : (
        <div 
          ref={wrapperRef}
          id="resume-preview-wrapper" 
          className="flex-1 overflow-y-auto p-2 sm:p-6 md:p-8 bg-slate-100/70 dark:bg-[#090d16] w-full flex justify-center items-start relative scrollbar-thin"
        >
          <div 
            style={{
              width: '100%',
              maxWidth: `${210 * calculatedZoom}mm`,
              height: unscaledHeight ? `${unscaledHeight * calculatedZoom}px` : 'auto',
              position: 'relative',
            }}
            className="resume-wrapper flex justify-center shrink-0 transition-all duration-200 print:block print:w-full print:max-w-full print:h-auto print:static"
          >
            <div 
              ref={ref}
              id="resume-print-content"
              style={{
                transformOrigin: 'top center',
                width: '100%',
                maxWidth: '210mm',
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: `translateX(-50%) scale(${calculatedZoom})`,
              }}
              className={`bg-white resume-content w-full max-w-[210mm] min-h-[297mm] h-fit mx-auto print:shadow-none print:ring-0 print:m-0 print:w-full relative origin-top transition-all duration-300 print:relative print:left-auto print:top-auto print:transform-none print:max-w-full print:w-full ${fontClass} ${marginClasses} ${
                metrics.isOver 
                  ? 'shadow-[0_4px_24px_rgba(244,63,94,0.08),0_16px_40px_-6px_rgba(15,23,42,0.12),0_0_0_1.5px_rgba(244,63,94,0.4)] ring-1 ring-rose-400/30' 
                  : 'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_12px_28px_-4px_rgba(15,23,42,0.06),0_24px_60px_-12px_rgba(15,23,42,0.08),0_0_0_1px_rgba(15,23,42,0.04)] ring-1 ring-black/5'
              }`}
            >
              {metrics.isOver && (
                <div className="absolute -top-3.5 right-6 z-40 print:hidden select-none pointer-events-none animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-[10px] font-bold rounded-full shadow-[0_4px_12px_rgba(244,63,94,0.3)] border border-white/20 tracking-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>{settings.lang === 'en' ? `Over Limit (${metrics.overflowPercent}%)` : `内容超出边界 (${metrics.overflowPercent}%)`}</span>
                  </div>
                </div>
              )}
              {resumeInnerContent}
            </div>
          </div>
        </div>
      )}

      {/* Floating Zoom Control Slider Panel (Responsive, premium glassmorphism, hidden on mobile to avoid content overlay) */}
      <motion.div 
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`absolute bottom-5 left-5 z-40 print:hidden hidden sm:flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 shadow-[0_12px_32px_rgba(15,23,42,0.12),0_2px_6px_rgba(15,23,42,0.04)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)] rounded-2xl ${settings.isCompactTools ? 'p-1.5' : 'p-2'} transition-all duration-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.16)] group`}
      >
        <div className="flex items-center gap-1">
          <button 
            onClick={() => {
              const current = calculatedZoom;
              const next = Math.max(0.5, Math.round((current - 0.05) * 100) / 100);
              setZoomMode(next);
              storage.set(STORAGE_KEYS.PREVIEW_ZOOM, String(next));
            }}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
            title={t.zoomOut}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          
          <div className={`flex items-center gap-2 px-1 ${settings.isCompactTools ? 'w-20 md:w-24' : 'w-24 md:w-32'} transition-all`}>
            <CustomSlider
              min={0.5}
              max={1.5}
              step={0.05}
              value={calculatedZoom}
              onChange={(val) => {
                setZoomMode(val);
                storage.set(STORAGE_KEYS.PREVIEW_ZOOM, String(val));
              }}
              colorTheme="indigo"
              size="sm"
            />
          </div>

          <button 
            onClick={() => {
              const current = calculatedZoom;
              const next = Math.min(1.5, Math.round((current + 0.05) * 100) / 100);
              setZoomMode(next);
              storage.set(STORAGE_KEYS.PREVIEW_ZOOM, String(next));
            }}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={t.zoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-[1px] bg-slate-200/80 dark:bg-slate-800" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setZoomMode('fit');
              storage.set(STORAGE_KEYS.PREVIEW_ZOOM, 'fit');
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              zoomMode === 'fit' 
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 shadow-sm font-sans' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent font-sans'
            }`}
          >
            {t.zoomFit}
          </button>
          
          <button
            onClick={() => {
              setZoomMode(1.0);
              storage.set(STORAGE_KEYS.PREVIEW_ZOOM, '1.0');
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              zoomMode === 1.0 
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 shadow-sm font-sans' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent font-sans'
            }`}
          >
            100%
          </button>
        </div>

        <div className="h-4 w-[1px] bg-slate-200/80 dark:bg-slate-800" />

        <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 min-w-[36px] text-center pr-1 select-none">
          {Math.round(calculatedZoom * 100)}%
        </span>
      </motion.div>

      <HeightGuard 
        metrics={metrics} 
        targetPageLimit={targetPageLimit} 
        setTargetPageLimit={setTargetPageLimit} 
        onSmartAutoFit={handleSmartAutoFit} 
        isAutoFitting={isAutoFitting}
        lang={settings.lang}
      />
    </div>
  );
});

Preview.displayName = 'Preview';
