
import React, { forwardRef, useState, useEffect, useMemo, useRef, useDeferredValue } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ZoomIn, ZoomOut, Sliders, Grid } from 'lucide-react';
import { motion } from 'motion/react';
import { ResumeSettings } from '../../types';
import { useResumeStore } from '../../store/useResumeStore';

import { 
  THEME_MAP, FONT_FAMILY_CLASSES, parseResumeHeader, cleanMarkdown, 
  parseH2Sections, smartAutoFit, getSizeClasses
} from '../../lib/preview-utils';
import { createMarkdownComponents } from './PreviewRenderers';
import { HeightGuard } from './HeightGuard';
import { ResumeHeader } from './ResumeHeader';

interface PreviewProps {
  overrideMarkdown?: string;
  overrideSettings?: ResumeSettings;
}

export const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ overrideMarkdown, overrideSettings }, ref) => {
  const {
    markdown: storeMarkdown,
    settings: storeSettings,
    updateSetting: onChangeSettings
  } = useResumeStore();

  const activeMarkdown = overrideMarkdown !== undefined ? overrideMarkdown : storeMarkdown;
  const markdown = useDeferredValue(activeMarkdown);
  const settings = overrideSettings !== undefined ? overrideSettings : storeSettings;

  const theme = THEME_MAP[settings.themeColor] || THEME_MAP.blue;
  const fontClass = FONT_FAMILY_CLASSES[settings.fontFamily];

  const [targetPageLimit, setTargetPageLimit] = useState<1 | 2 | 3>(1);
  const [showGrid, setShowGrid] = useState<boolean>(() => {
    return localStorage.getItem('resume_preview_show_grid') === 'true';
  });

  const toggleGrid = () => {
    setShowGrid(prev => {
      const next = !prev;
      localStorage.setItem('resume_preview_show_grid', String(next));
      return next;
    });
  };
  const [metrics, setMetrics] = useState({
    isOver: false,
    overflowPercent: 0,
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [wrapperWidth, setWrapperWidth] = useState<number>(850);
  const [unscaledHeight, setUnscaledHeight] = useState<number>(0);
  const [zoomMode, setZoomMode] = useState<'fit' | number>(() => {
    const saved = localStorage.getItem('resume_preview_zoom');
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

    const handleResize = () => {
      setWrapperWidth(element.clientWidth);
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const calculatedZoom = useMemo(() => {
    if (zoomMode === 'fit') {
      const targetWidth = wrapperWidth - 64; // standard 32px padding on each side
      const scale = targetWidth / 794; // 210mm standard is ~794px at 96dpi
      return Math.max(0.4, Math.min(1.2, scale));
    }
    return zoomMode;
  }, [zoomMode, wrapperWidth]);

  useEffect(() => {
    const element = ref && 'current' in ref ? ref.current : null;
    if (!element) return;

    const measure = () => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (!width || !height) return;

      setUnscaledHeight(height);

      const pHeight = width * 1.4142857; 
      const limitHeight = targetPageLimit * pHeight;
      const isOver = height > limitHeight + 8;
      const overflowPercent = Math.round((height / limitHeight) * 100);

      setMetrics({ isOver, overflowPercent });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    const timer = setTimeout(measure, 300);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [markdown, settings, ref, targetPageLimit]);

  useEffect(() => {
    const element = ref && 'current' in ref ? ref.current : null;
    if (!element) return;
    const width = element.clientWidth;
    const height = element.clientHeight;
    if (width && height) {
      const pHeight = width * 1.4142857;
      const pages = Math.ceil(height / pHeight);
      if (pages === 2 || pages === 3) setTargetPageLimit(pages as 1 | 2 | 3);
    }
  }, [markdown]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200/60 backdrop-blur-sm z-30 select-none print:hidden shrink-0 gap-2">
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.previewHeader}</span>
        </div>
        
        <div className="flex items-center flex-wrap gap-3">
          {/* Zoom slider control */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200/40">
            <button 
              onClick={() => {
                const current = calculatedZoom;
                const next = Math.max(0.5, Math.round((current - 0.05) * 100) / 100);
                setZoomMode(next);
                localStorage.setItem('resume_preview_zoom', String(next));
              }}
              className="p-0.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors cursor-pointer"
              title={t.zoomOut}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            
            <input 
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={calculatedZoom}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setZoomMode(val);
                localStorage.setItem('resume_preview_zoom', String(val));
              }}
              className="w-16 sm:w-20 md:w-24 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
              title={t.zoomSlider}
            />
            
            <button 
              onClick={() => {
                const current = calculatedZoom;
                const next = Math.min(1.5, Math.round((current + 0.05) * 100) / 100);
                setZoomMode(next);
                localStorage.setItem('resume_preview_zoom', String(next));
              }}
              className="p-0.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors cursor-pointer"
              title={t.zoomIn}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/40 text-[10px] font-bold">
            <button
              onClick={() => {
                setZoomMode(0.75);
                localStorage.setItem('resume_preview_zoom', '0.75');
              }}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                zoomMode === 0.75 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/20' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              75%
            </button>
            <button
              onClick={() => {
                setZoomMode(1.0);
                localStorage.setItem('resume_preview_zoom', '1.0');
              }}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                zoomMode === 1.0 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/20' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              100%
            </button>
            <button
              onClick={() => {
                setZoomMode('fit');
                localStorage.setItem('resume_preview_zoom', 'fit');
              }}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                zoomMode === 'fit' 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/20' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.zoomFit}
            </button>
          </div>

          {/* Grid Toggle Button */}
          <button
            onClick={toggleGrid}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
              showGrid
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200/50 shadow-sm'
                : 'bg-white text-slate-500 border-slate-200/40 hover:text-slate-700 hover:bg-slate-50'
            }`}
            title={settings.lang === 'en' ? 'Toggle alignment grid lines' : '显示/隐藏高精度排版网格辅助线'}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{settings.lang === 'en' ? 'Grid' : '网格线'}</span>
          </button>

          <span className="text-[10px] font-mono font-bold text-slate-500 min-w-[32px] text-right">
            {Math.round(calculatedZoom * 100)}%
          </span>
        </div>
      </div>

      <div 
        ref={wrapperRef}
        id="resume-preview-wrapper" 
        className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-100/50 w-full flex justify-center items-start relative scrollbar-thin"
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
            style={{
              transformOrigin: 'top center',
              width: '100%',
              maxWidth: '210mm',
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: `translateX(-50%) scale(${calculatedZoom})`,
            }}
            className={`bg-white shadow-[0_1px_3px_rgba(15,23,42,0.015),0_8px_24px_rgba(15,23,42,0.03),0_20px_48px_rgba(15,23,42,0.05)] resume-content w-full max-w-[210mm] min-h-[297mm] h-fit mx-auto print:shadow-none print:ring-0 print:m-0 print:w-full relative origin-top transition-all duration-200 print:relative print:left-auto print:top-auto print:transform-none print:max-w-full print:w-full ${fontClass} ${marginClasses} ${
              metrics.isOver 
                ? 'ring-4 ring-rose-500/80 shadow-[0_0_25px_rgba(244,63,94,0.3)]' 
                : 'ring-1 ring-slate-100/60 shadow-[0_2px_4px_rgba(15,23,42,0.01),0_16px_32px_rgba(15,23,42,0.035),0_28px_64px_rgba(15,23,42,0.045)]'
            }`}
          >
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
          .resume-content h2 { margin-top: calc(1.5rem * ${settings.blockGap ?? 1.0}) !important; margin-bottom: calc(0.75rem * ${settings.blockGap ?? 1.0}) !important; letter-spacing: ${settings.letterSpacing ?? 0}em !important; }
          .resume-content ul { margin-bottom: calc(0.75rem * ${settings.blockGap ?? 1.0}) !important; }
          .resume-content .flex-row.items-baseline { margin-top: calc(1.25rem * ${settings.blockGap ?? 1.0}) !important; margin-bottom: calc(0.375rem * ${settings.blockGap ?? 1.0}) !important; }
        `}} />

        {settings.showPageBreakLine && (
          <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none print:hidden z-30">
            {[1, 2, 3].map(p => (
              <div 
                key={p} 
                className="absolute left-0 right-0 border-b border-dashed border-rose-400/50 hover:border-rose-500/80 transition-all flex items-center justify-between text-[9.5px] font-extrabold text-rose-500/80 select-none h-0" 
                style={{ top: `${p * 297}mm` }}
              >
                {/* Left side scissor indicator */}
                <div className="bg-rose-50/90 backdrop-blur-sm border border-rose-200/80 text-rose-600 px-2 py-0.5 rounded-full shadow-[0_2px_6px_rgba(244,63,94,0.1)] ml-6 -translate-y-1/2 font-sans flex items-center gap-1.5 font-extrabold tracking-wider transition-transform hover:scale-105">
                  <span>✂️</span>
                  <span>{settings.lang === 'en' ? 'CUT / FOLD LINE' : '折叠剪裁辅助线'}</span>
                </div>
                {/* Right side page number badge */}
                <span className="bg-rose-50/90 backdrop-blur-sm border border-rose-200/80 text-rose-600 px-2.5 py-0.5 rounded-full shadow-[0_2px_6px_rgba(244,63,94,0.1)] mr-6 -translate-y-1/2 font-sans flex items-center gap-1 font-extrabold tracking-wider transition-transform hover:scale-105">
                  {t.pageBreakText.replace('{p}', String(p)).replace('{size}', String(p * 297))}
                </span>
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
          const bodyContent = headerInfo.hasHeader ? headerInfo.bodyMarkdown : cleaned;

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
          </div>
        </div>
      </div>

      {/* Floating Zoom Control Slider Panel (Responsive, premium glassmorphism, hidden on mobile to avoid content overlay) */}
      <motion.div 
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="absolute bottom-5 left-5 z-40 print:hidden hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-lg rounded-xl p-1.5 transition-all duration-300 hover:shadow-xl hover:bg-white/95 group"
      >
        <div className="flex items-center gap-1">
          <button 
            onClick={() => {
              const current = calculatedZoom;
              const next = Math.max(0.5, Math.round((current - 0.05) * 100) / 100);
              setZoomMode(next);
              localStorage.setItem('resume_preview_zoom', String(next));
            }}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title={t.zoomOut}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 px-1">
            <input 
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={calculatedZoom}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setZoomMode(val);
                localStorage.setItem('resume_preview_zoom', String(val));
              }}
              className="w-24 md:w-32 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none transition-all duration-200"
              style={{
                background: `linear-gradient(to right, rgb(79, 70, 229) 0%, rgb(79, 70, 229) ${((calculatedZoom - 0.5) / 1.0) * 100}%, rgb(226, 232, 240) ${((calculatedZoom - 0.5) / 1.0) * 100}%, rgb(226, 232, 240) 100%)`
              }}
              title={t.zoomSlider}
            />
          </div>

          <button 
            onClick={() => {
              const current = calculatedZoom;
              const next = Math.min(1.5, Math.round((current + 0.05) * 100) / 100);
              setZoomMode(next);
              localStorage.setItem('resume_preview_zoom', String(next));
            }}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title={t.zoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-[1px] bg-slate-200/80" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setZoomMode('fit');
              localStorage.setItem('resume_preview_zoom', 'fit');
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              zoomMode === 'fit' 
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm font-sans' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent font-sans'
            }`}
          >
            {t.zoomFit}
          </button>
          
          <button
            onClick={() => {
              setZoomMode(1.0);
              localStorage.setItem('resume_preview_zoom', '1.0');
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              zoomMode === 1.0 
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm font-sans' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent font-sans'
            }`}
          >
            100%
          </button>
        </div>

        <div className="h-4 w-[1px] bg-slate-200/80" />

        <span className="text-[10px] font-mono font-bold text-slate-600 min-w-[36px] text-center pr-1 select-none">
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
