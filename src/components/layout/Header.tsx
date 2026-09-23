import React, { useMemo, useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Database, 
  Upload, 
  Download, 
  FileDown, 
  Loader2, 
  Moon, 
  Sun, 
  Laptop, 
  HelpCircle, 
  Maximize2, 
  Minimize2,
  ClipboardPaste
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { getWordCount } from '../../lib/word-count';
import { ThemeMode } from '../../types';
import { ProfileDropdown } from '../profile/ProfileDropdown';
import { RawTextImportModal } from '../modals/RawTextImportModal';
import { Tooltip } from '../ui';

interface HeaderProps {
  handleImportMarkdown: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExportMarkdown: () => void;
  handleExportPDF: () => void;
  handleExportDirectPDF?: () => void;
  handleExportVectorPrint?: () => void;
}

export function Header({
  handleImportMarkdown,
  handleExportMarkdown,
  handleExportPDF,
  handleExportDirectPDF,
}: HeaderProps) {
  const {
    markdown,
    lastSaved,
    isCheckerOpen,
    isExportingPDF,
    pdfExportProgress,
    setIsCheckerOpen,
    setIsBackupHubOpen,
    setIsHelpLegalOpen,
    handleMarkdownChange,
    settings,
    updateSetting
  } = useResumeStore();

  const lang = settings.lang || 'zh';
  const isEn = lang === 'en';
  const themeMode: ThemeMode = settings.themeMode || 'light';
  const wordCount = useMemo(() => getWordCount(markdown), [markdown]);

  const [isRawTextModalOpen, setIsRawTextModalOpen] = useState(false);

  const handleTriggerExport = () => {
    if (handleExportDirectPDF) {
      handleExportDirectPDF();
    } else {
      handleExportPDF();
    }
  };

  const toggleThemeMode = (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Cycle between light -> dark -> system
    const nextMode: ThemeMode = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light';

    // High-performance View Transitions API for ultra-smooth radial wave transition
    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      const x = e?.clientX ?? window.innerWidth / 2;
      const y = e?.clientY ?? window.innerHeight / 2;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      // Disable CSS element transitions during view transition capture to prevent double-rendering lag
      document.documentElement.classList.add('view-transition-active');

      const transition = (document as any).startViewTransition(() => {
        updateSetting('themeMode', nextMode);
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ];
        const animation = document.documentElement.animate(
          {
            clipPath: clipPath
          },
          {
            duration: 420,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );

        animation.onfinish = () => {
          document.documentElement.classList.remove('view-transition-active');
        };
      });
    } else {
      updateSetting('themeMode', nextMode);
    }
  };

  const themeLabel = themeMode === 'dark' 
    ? (isEn ? 'Dark' : '深色') 
    : themeMode === 'system' 
      ? (isEn ? 'System' : '系统') 
      : (isEn ? 'Light' : '浅色');

  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-3 sm:px-6 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/90 relative z-50 gap-2 md:gap-0 shadow-[0_1px_3px_rgba(15,23,42,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-colors duration-200">
      <div className="flex items-center justify-between md:justify-start gap-2 sm:gap-3.5 w-full md:w-auto">
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 via-indigo-600 to-blue-600 rounded-xl shadow-md shadow-indigo-500/20 text-white flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 sm:gap-2">
              <span className="truncate">Markdown Resume</span>
              <span className="px-1.5 sm:px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 text-[9px] sm:text-[10px] rounded-full font-bold border border-indigo-200/80 dark:border-indigo-800 shadow-2xs whitespace-nowrap">
                PRO
              </span>
            </h1>
          </div>
        </div>

        <div className="hidden sm:block w-px h-5 bg-slate-200/90 dark:bg-slate-800 mx-1 shrink-0" />

        {/* Multi-Profile Archive Selector */}
        <ProfileDropdown lang={settings.lang} />

        {lastSaved && (
          <Tooltip 
            content={isEn ? 'All changes automatically saved to local storage' : '已自动同步保存至本地浏览器'}
            side="bottom"
          >
            <div className="hidden xs:flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/60 rounded-lg text-[10px] sm:text-[11px] font-semibold shadow-2xs whitespace-nowrap cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="hidden sm:inline">{isEn ? '已保存' : '已保存'}</span>
            </div>
          </Tooltip>
        )}
      </div>
      
      <div className="flex items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-start sm:justify-end overflow-x-auto scrollbar-none py-0.5 flex-nowrap">
        {/* Studio Dark Mode Toggle */}
        <Tooltip
          content={`${isEn ? 'Theme' : '切换主题'}: ${themeLabel}`}
          side="bottom"
        >
          <button
            onClick={(e) => toggleThemeMode(e)}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95 ${
              themeMode === 'dark'
                ? 'bg-indigo-950/60 border border-indigo-700/60 text-indigo-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]'
                : themeMode === 'system'
                  ? 'tactile-btn tactile-btn-hover tactile-btn-active text-indigo-600 dark:text-indigo-400'
                  : 'tactile-btn tactile-btn-hover tactile-btn-active text-slate-700 dark:text-slate-200'
            }`}
          >
            {themeMode === 'dark' ? (
              <Moon key="dark" className="w-3.5 h-3.5 text-indigo-400 shrink-0 animate-theme-icon" />
            ) : themeMode === 'system' ? (
              <Laptop key="system" className="w-3.5 h-3.5 text-indigo-500 shrink-0 animate-theme-icon" />
            ) : (
              <Sun key="light" className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-theme-icon" />
            )}
            <span className="hidden sm:inline">{themeLabel}</span>
          </button>
        </Tooltip>

        {/* Help & Legal Center Button */}
        <Tooltip
          content={isEn ? 'User Guide & Privacy Policy' : '求职指南与隐私说明'}
          side="bottom"
        >
          <button
            onClick={() => setIsHelpLegalOpen(true)}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 tactile-btn tactile-btn-hover tactile-btn-active text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap shrink-0 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="hidden sm:inline">{isEn ? 'Help' : '帮助'}</span>
          </button>
        </Tooltip>

        {/* Diagnostic Button */}
        <Tooltip
          content={isEn ? 'ATS Diagnostic & Optimization' : 'ATS 自检与关键词诊断'}
          side="bottom"
        >
          <button
            onClick={() => setIsCheckerOpen(!isCheckerOpen)}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              isCheckerOpen 
                ? 'bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-inner' 
                : 'tactile-btn tactile-btn-hover tactile-btn-active text-slate-700 dark:text-slate-200'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isCheckerOpen ? 'text-indigo-600 dark:text-indigo-400 animate-pulse' : 'text-indigo-500'}`} />
            <span className="hidden sm:inline">{isEn ? 'ATS Check' : '简历自检'}</span>
          </button>
        </Tooltip>

        {/* Versions Button */}
        <Tooltip
          content={isEn ? 'Job Versions & History Backups' : '岗位版本库与历史草稿'}
          side="bottom"
        >
          <button
            onClick={() => setIsBackupHubOpen(true)}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 tactile-btn tactile-btn-hover tactile-btn-active text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap shrink-0 transition-all"
          >
            <Database className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="hidden sm:inline">{isEn ? 'Versions' : '版本管理'}</span>
          </button>
        </Tooltip>
        
        <div className="w-px h-5 bg-slate-200/80 dark:bg-slate-800 shrink-0" />

        {/* Unified Import & Export Actions */}
        <div className="flex items-center border border-slate-200/90 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-2xs shrink-0">
          <Tooltip
            content={isEn ? 'Import Markdown file or paste text' : '导入文件或提取文本'}
            side="bottom"
          >
            <button
              onClick={() => setIsRawTextModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer border-r border-slate-200/90 dark:border-slate-700 transition-all select-none whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>{isEn ? 'Import' : '导入'}</span>
            </button>
          </Tooltip>

          <Tooltip
            content={isEn ? 'Export raw Markdown file (.md)' : '导出 Markdown 源码 (.md)'}
            side="bottom"
          >
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1 px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
              <span>{isEn ? 'Export MD' : '导出源码'}</span>
            </button>
          </Tooltip>
        </div>

        {/* Direct PDF Export Action Button */}
        <Tooltip
          content={isEn ? 'Download high-definition A4 PDF' : '下载高清 A4 PDF 简历'}
          side="bottom"
        >
          <button
            onClick={() => handleTriggerExport()}
            disabled={isExportingPDF}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
          >
            {isExportingPDF ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-white" />
            ) : (
              <FileDown className="w-3.5 h-3.5 text-white shrink-0" />
            )}
            <span>
              {isExportingPDF 
                ? (pdfExportProgress || (isEn ? 'Exporting...' : '生成中...')) 
                : (isEn ? 'Download PDF' : '下载 PDF')}
            </span>
          </button>
        </Tooltip>
      </div>

      {/* Smart Raw Text / File Import Modal */}
      <RawTextImportModal
        isOpen={isRawTextModalOpen}
        onClose={() => setIsRawTextModalOpen(false)}
        onImport={(newMd) => {
          handleMarkdownChange(newMd, true);
        }}
        onImportFile={handleImportMarkdown}
        lang={lang}
      />
    </header>
  );
}

