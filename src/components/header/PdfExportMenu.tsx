import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, FileDown, Loader2, Printer } from 'lucide-react';

interface PdfExportMenuProps {
  isEn: boolean;
  isExporting: boolean;
  progress?: string;
  onExportAts: () => void;
  onExportQuick?: () => void;
  compact?: boolean;
}

export function PdfExportMenu({
  isEn,
  isExporting,
  progress,
  onExportAts,
  onExportQuick,
  compact = false,
}: PdfExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative flex shrink-0">
      <button
        type="button"
        onClick={onExportAts}
        disabled={isExporting}
        className={`flex items-center gap-1.5 rounded-l-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-75 ${compact ? 'px-2.5' : ''}`}
      >
        {isExporting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Printer className="h-3.5 w-3.5" />
        )}
        <span>
          {isExporting
            ? progress || (isEn ? 'Exporting…' : '生成中…')
            : compact
              ? 'PDF'
              : isEn
                ? 'Download PDF'
                : '下载 PDF'}
        </span>
      </button>

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        disabled={isExporting}
        aria-label={isEn ? 'Choose PDF export mode' : '选择 PDF 下载方式'}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center justify-center rounded-r-xl border-l border-white/20 bg-blue-600 px-2 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-75"
      >
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div role="menu" className="absolute right-0 top-full z-[100] mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onExportAts();
            }}
            className="flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
          >
            <Printer className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
            <span>
              <span className="block text-xs font-black text-slate-800 dark:text-slate-100">
                {isEn ? 'ATS PDF · Recommended' : 'ATS PDF · 推荐'}
              </span>
              <span className="mt-0.5 block text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                {isEn
                  ? 'Keeps searchable text through browser Print / Save as PDF.'
                  : '通过浏览器打印 / 另存为 PDF，尽量保留可搜索文本。'}
              </span>
            </span>
          </button>

          {onExportQuick && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onExportQuick();
              }}
              className="flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <FileDown className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              <span>
                <span className="block text-xs font-black text-slate-800 dark:text-slate-100">
                  {isEn ? 'Quick PDF · Image' : '快速 PDF · 图片型'}
                </span>
                <span className="mt-0.5 block text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {isEn
                    ? 'Fast visual download for sharing; not preferred for ATS submissions.'
                    : '适合快速分享和视觉预览；正式投递不优先推荐。'}
                </span>
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
