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
  Printer,
  Zap,
  ChevronDown,
  Check,
  ClipboardPaste
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { getWordCount } from '../../lib/word-count';
import { ThemeMode } from '../../types';
import { ProfileDropdown } from '../profile/ProfileDropdown';
import { RawTextImportModal } from '../modals/RawTextImportModal';

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
  handleExportVectorPrint
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
  const isCompact = !!settings.isCompactTools;
  const themeMode: ThemeMode = settings.themeMode || 'light';
  const wordCount = useMemo(() => getWordCount(markdown), [markdown]);

  const [isRawTextModalOpen, setIsRawTextModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [exportMode, setExportMode] = useState<'direct' | 'print'>(() => {
    try {
      return (localStorage.getItem('resume_pdf_mode') as 'direct' | 'print') || 'direct';
    } catch (e) {
      return 'direct';
    }
  });
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    if (isExportMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExportMenuOpen]);

  const handleSelectExportMode = (mode: 'direct' | 'print') => {
    setExportMode(mode);
    try {
      localStorage.setItem('resume_pdf_mode', mode);
    } catch (e) {}
  };

  const handleTriggerExport = (mode?: 'direct' | 'print') => {
    const targetMode = mode || exportMode;
    if (targetMode === 'direct') {
      if (handleExportDirectPDF) {
        handleExportDirectPDF();
      } else {
        handleExportPDF();
      }
    } else {
      if (handleExportVectorPrint) {
        handleExportVectorPrint();
      } else {
        handleExportPDF();
      }
    }
    setIsExportMenuOpen(false);
  };

  const toggleThemeMode = () => {
    // Cycle between light -> dark -> system
    const nextMode: ThemeMode = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light';
    updateSetting('themeMode', nextMode);
  };

  const toggleCompactMode = () => {
    updateSetting('isCompactTools', !isCompact);
  };

  const themeLabel = themeMode === 'dark' 
    ? (isEn ? 'Dark Mode' : '深色模式') 
    : themeMode === 'system' 
      ? (isEn ? 'System Theme' : '跟随系统') 
      : (isEn ? 'Light Theme' : '浅色模式');

  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-3 sm:px-6 py-2 sm:py-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/90 relative z-50 gap-2 md:gap-0 shadow-[0_1px_3px_rgba(15,23,42,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-colors duration-200">
      <div className="flex items-center justify-between md:justify-start gap-2 sm:gap-3.5 w-full md:w-auto">
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 via-indigo-600 to-blue-600 rounded-xl shadow-md shadow-indigo-500/20 text-white flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 sm:gap-2">
              <span className="truncate">Markdown Resume</span>
              <span className="px-1.5 sm:px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 text-[9px] sm:text-[10px] rounded-full font-bold border border-indigo-200/80 dark:border-indigo-800 shadow-2xs whitespace-nowrap">
                v1.5 PRO
              </span>
            </h1>
            <p className={`text-[11px] text-slate-400 dark:text-slate-400 font-medium ${isCompact ? 'hidden' : 'hidden sm:block'}`}>
              {isEn ? 'A4 Pixel-Perfect Resume Editor' : '极简 A4 纸张排版简历编辑器'}
            </p>
          </div>
        </div>

        <div className={`hidden sm:block w-px h-6 bg-slate-200/90 dark:bg-slate-800 mx-1 shrink-0 ${isCompact ? 'hidden md:block' : ''}`} />

        {/* Multi-Profile Archive Selector */}
        <ProfileDropdown lang={settings.lang} isCompact={isCompact} />

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-slate-100/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 rounded-lg text-[10px] sm:text-[11px] font-semibold shadow-2xs whitespace-nowrap" title={isEn ? `Word count: ${wordCount}` : `总字数: ${wordCount}`}>
            <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 dark:text-slate-400 shrink-0" />
            <span>{!isCompact && (isEn ? 'Words: ' : '字数: ')}<strong className="text-slate-800 dark:text-slate-100 font-bold">{wordCount}</strong></span>
          </div>
          {lastSaved && (
            <div className="hidden xs:flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/60 rounded-lg text-[10px] sm:text-[11px] font-semibold shadow-2xs whitespace-nowrap" title={isEn ? 'Saved' : '已自动保存'}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              {!isCompact && <span>{isEn ? 'Saved' : '已保存'}</span>}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-start sm:justify-end overflow-x-auto scrollbar-none py-0.5 flex-nowrap">
        {/* Compact Tool Icon Toggle (Zen Mode) */}
        <button
          onClick={toggleCompactMode}
          className={`group flex items-center px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            isCompact
              ? 'bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-inner'
              : 'tactile-btn tactile-btn-hover tactile-btn-active text-slate-700 dark:text-slate-200'
          }`}
          title={isEn ? 'Zen Mode' : '精简模式 (Zen Mode)'}
        >
          {isCompact ? (
            <Maximize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          ) : (
            <Minimize2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          )}
          <span className={isCompact ? "max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-200 ease-out overflow-hidden inline-block whitespace-nowrap ml-0 group-hover:ml-1.5" : "ml-1.5"}>
            {isEn ? 'Zen Mode' : '精简模式'}
          </span>
        </button>

        {/* Studio Dark Mode Toggle */}
        <button
          onClick={toggleThemeMode}
          className={`group flex items-center px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            themeMode === 'dark'
              ? 'bg-indigo-950/60 border border-indigo-700/60 text-indigo-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]'
              : themeMode === 'system'
                ? 'tactile-btn tactile-btn-hover tactile-btn-active text-indigo-600 dark:text-indigo-400'
                : 'tactile-btn tactile-btn-hover tactile-btn-active text-slate-700 dark:text-slate-200'
          }`}
          title={`${isEn ? 'Theme' : '主题'}: ${themeLabel}`}
        >
          {themeMode === 'dark' ? (
            <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          ) : themeMode === 'system' ? (
            <Laptop className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          )}
          <span className={isCompact ? "max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-200 ease-out overflow-hidden inline-block whitespace-nowrap ml-0 group-hover:ml-1.5" : "ml-1.5"}>
            {themeLabel}
          </span>
        </button>

        {/* Help & Legal Center Button */}
        <button
          onClick={() => setIsHelpLegalOpen(true)}
          className="group flex items-center px-2.5 sm:px-3 py-1.5 tactile-btn tactile-btn-hover tactile-btn-active text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap shrink-0 transition-all"
          title={isEn ? 'Help & Legal' : '帮助与法规'}
        >
          <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className={isCompact ? "max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-200 ease-out overflow-hidden inline-block whitespace-nowrap ml-0 group-hover:ml-1.5" : "ml-1.5"}>
            {isEn ? 'Help & Legal' : '帮助与法规'}
          </span>
        </button>

        {/* Diagnostic Button */}
        <button
          onClick={() => setIsCheckerOpen(!isCheckerOpen)}
          className={`group flex items-center px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            isCheckerOpen 
              ? 'bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-inner' 
              : 'tactile-btn tactile-btn-hover tactile-btn-active text-slate-700 dark:text-slate-200'
          }`}
          title={isEn ? 'Smart Diagnostic' : '智能诊断'}
        >
          <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isCheckerOpen ? 'text-indigo-600 dark:text-indigo-400 animate-pulse' : 'text-indigo-500'}`} />
          <span className={isCompact ? "max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-200 ease-out overflow-hidden inline-block whitespace-nowrap ml-0 group-hover:ml-1.5" : "ml-1.5"}>
            {isEn ? 'Diagnostic' : '智能诊断'}
          </span>
        </button>

        {/* Versions Button */}
        <button
          onClick={() => setIsBackupHubOpen(true)}
          className="group flex items-center px-2.5 sm:px-3 py-1.5 tactile-btn tactile-btn-hover tactile-btn-active text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap shrink-0 transition-all"
          title={isEn ? 'Backup Versions' : '版本中心'}
        >
          <Database className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className={isCompact ? "max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-200 ease-out overflow-hidden inline-block whitespace-nowrap ml-0 group-hover:ml-1.5" : "ml-1.5"}>
            {isEn ? 'Versions' : '版本中心'}
          </span>
        </button>
        
        <div className="w-px h-5 bg-slate-200/80 dark:bg-slate-800 shrink-0" />

        <div className="flex items-center border border-slate-200/90 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-2xs shrink-0">
          <button
            onClick={() => setIsRawTextModalOpen(true)}
            className="group flex items-center px-2 sm:px-2.5 py-1.5 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer border-r border-slate-200/90 dark:border-slate-700 transition-all select-none whitespace-nowrap"
            title={isEn ? 'Smart Raw Text Paste & Convert' : '智能纯文本粘贴导入 (Word/网页无格式简历)'}
          >
            <ClipboardPaste className="w-3 h-3 text-indigo-500 shrink-0" />
            <span className={isCompact ? "max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-200 ease-out overflow-hidden inline-block whitespace-nowrap ml-0 group-hover:ml-1.5" : "ml-1.5"}>
              {isEn ? 'Smart Paste' : '智能粘贴'}
            </span>
          </button>
          <label 
            className="group flex items-center px-2 sm:px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer border-r border-slate-200/90 dark:border-slate-700 transition-all select-none whitespace-nowrap"
            title={isEn ? 'Import Markdown (.md)' : '导入 Markdown (.md)'}
          >
            <Upload className="w-3 h-3 text-slate-500 dark:text-slate-400 shrink-0" />
            <span className={isCompact ? "max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-200 ease-out overflow-hidden inline-block whitespace-nowrap ml-0 group-hover:ml-1.5" : "ml-1.5"}>
              {isEn ? 'Import' : '导入'}
            </span>
            <input type="file" accept=".md" onChange={handleImportMarkdown} className="hidden" />
          </label>
          <button
            onClick={handleExportMarkdown}
            className="group flex items-center px-2 sm:px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
            title={isEn ? 'Export Markdown (.md)' : '导出 MD (.md)'}
          >
            <Download className="w-3 h-3 text-slate-500 dark:text-slate-400 shrink-0" />
            <span className={isCompact ? "max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-200 ease-out overflow-hidden inline-block whitespace-nowrap ml-0 group-hover:ml-1.5" : "ml-1.5"}>
              {isEn ? 'Export MD' : '导出 MD'}
            </span>
          </button>
        </div>

        {/* Dual-Mode PDF Export Split Button */}
        <div ref={exportMenuRef} className="relative inline-flex items-center shrink-0">
          <div className="flex items-center rounded-lg shadow-md shadow-indigo-500/20 bg-indigo-600 dark:bg-indigo-600 text-white overflow-hidden p-0.5 border border-indigo-500/50">
            {/* Primary Action Button */}
            <button
              onClick={() => handleTriggerExport()}
              disabled={isExportingPDF}
              className="group flex items-center px-2.5 sm:px-3 py-1 text-xs font-bold transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed hover:bg-white/10 active:bg-white/20 whitespace-nowrap rounded-l-md"
              title={
                exportMode === 'direct'
                  ? (isEn ? 'Direct PDF Download (html2canvas + jsPDF)' : '一键直接下载 PDF (免配置)')
                  : (isEn ? 'System Vector Print (A4)' : '系统矢量打印 (A4)')
              }
            >
              {isExportingPDF ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-white" />
              ) : exportMode === 'direct' ? (
                <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              ) : (
                <Printer className="w-3.5 h-3.5 text-indigo-200 shrink-0" />
              )}
              <span className={isCompact ? "max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-200 ease-out overflow-hidden inline-block whitespace-nowrap ml-0 group-hover:ml-1.5" : "ml-1.5"}>
                {isExportingPDF 
                  ? (pdfExportProgress || (isEn ? 'Exporting...' : '导出中...')) 
                  : exportMode === 'direct' 
                    ? (isEn ? 'Direct PDF' : '下载 PDF') 
                    : (isEn ? 'Print PDF' : '矢量打印')}
              </span>
            </button>

            {/* Split Divider */}
            <div className="w-px h-4 bg-white/25 shrink-0" />

            {/* Dropdown Menu Trigger */}
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              disabled={isExportingPDF}
              className="px-1.5 py-1 hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer rounded-r-md"
              title={isEn ? 'Select Export Mode' : '选择导出模式'}
            >
              <ChevronDown className={`w-3.5 h-3.5 text-white/90 transition-transform duration-200 ${isExportMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Export Mode Dropdown Menu */}
          {isExportMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 bg-white dark:bg-slate-850 rounded-xl shadow-xl border border-slate-200/90 dark:border-slate-700/90 p-1.5 z-50 text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  {isEn ? 'PDF Export Options' : 'PDF 导出双模式'}
                </span>
              </div>

              {/* Mode 1: Direct Download */}
              <button
                onClick={() => {
                  handleSelectExportMode('direct');
                  handleTriggerExport('direct');
                }}
                className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-all cursor-pointer ${
                  exportMode === 'direct'
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
                }`}
              >
                <div className="p-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      {isEn ? 'Direct PDF Download' : '一键直接下载 PDF'}
                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded">
                        {isEn ? 'Recommended' : '推荐'}
                      </span>
                    </span>
                    {exportMode === 'direct' && (
                      <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                    {isEn 
                      ? 'Client-side render via html2canvas + jsPDF. Silent direct download without printer dialog.'
                      : '采用超清光栅与 A4 分页切片，免调打印参数，点击直接保存 .pdf 文件。'}
                  </p>
                </div>
              </button>

              {/* Mode 2: System Vector Print */}
              <button
                onClick={() => {
                  handleSelectExportMode('print');
                  handleTriggerExport('print');
                }}
                className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-all cursor-pointer mt-1 ${
                  exportMode === 'print'
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
                }`}
              >
                <div className="p-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md shrink-0 mt-0.5">
                  <Printer className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      {isEn ? 'System Vector Print' : '系统矢量打印'}
                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded">
                        {isEn ? 'Vector' : '纯矢量'}
                      </span>
                    </span>
                    {exportMode === 'print' && (
                      <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                    {isEn 
                      ? 'Browser native print window. Selectable vector text, requires checking "Background graphics".'
                      : '调用浏览器打印窗口，输出纯矢量文字，可在打印配置中勾选「背景图形」。'}
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Smart Raw Text Import Modal */}
      <RawTextImportModal
        isOpen={isRawTextModalOpen}
        onClose={() => setIsRawTextModalOpen(false)}
        onImport={(newMd) => {
          handleMarkdownChange(newMd, true);
        }}
        lang={lang}
      />
    </header>
  );
}

