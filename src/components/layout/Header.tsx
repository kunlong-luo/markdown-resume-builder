import React, { useMemo } from 'react';
import { FileText, Cloud, Sparkles, Database, Upload, Download, FileDown, Loader2, Moon, Sun, Laptop } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { getWordCount } from '../../lib/word-count';
import { ThemeMode } from '../../types';

interface HeaderProps {
  handleImportMarkdown: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExportMarkdown: () => void;
  handleExportPDF: () => void;
}

export function Header({
  handleImportMarkdown,
  handleExportMarkdown,
  handleExportPDF
}: HeaderProps) {
  const {
    markdown,
    lastSaved,
    isCheckerOpen,
    isExportingPDF,
    setIsCheckerOpen,
    setIsBackupHubOpen,
    settings,
    updateSetting
  } = useResumeStore();

  const lang = settings.lang || 'zh';
  const themeMode: ThemeMode = settings.themeMode || 'light';
  const wordCount = useMemo(() => getWordCount(markdown), [markdown]);

  const toggleThemeMode = () => {
    // Cycle between light -> dark -> system
    const nextMode: ThemeMode = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light';
    updateSetting('themeMode', nextMode);
  };

  const themeLabel = themeMode === 'dark' 
    ? (lang === 'en' ? 'Dark Mode' : '深色模式') 
    : themeMode === 'system' 
      ? (lang === 'en' ? 'System Theme' : '跟随系统') 
      : (lang === 'en' ? 'Light Theme' : '浅色模式');

  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-3 sm:px-6 py-2 sm:py-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/90 z-20 gap-2 md:gap-0 shadow-[0_1px_3px_rgba(15,23,42,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-colors duration-200">
      <div className="flex items-center justify-between md:justify-start gap-2 sm:gap-3.5 w-full md:w-auto">
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="p-1.5 sm:p-2 bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 text-white flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 sm:gap-2">
              <span className="truncate max-w-[140px] sm:max-w-none">Markdown Resume</span>
              <span className="px-1.5 sm:px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[9px] sm:text-[10px] rounded-full font-bold border border-indigo-100/80 dark:border-indigo-800/60 shadow-xs">
                v1.5
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium hidden sm:block">
              {lang === 'en' ? 'Fine-tuned, pixel-perfect A4 online Markdown resume editor' : '专业级 A4 纸张排版 Markdown 简历编辑器'}
            </p>
          </div>
        </div>

        <div className="hidden sm:block w-px h-6 bg-slate-200/90 dark:bg-slate-800 mx-1 shrink-0" />

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-slate-100/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 rounded-lg text-[10px] sm:text-[11px] font-semibold shadow-2xs whitespace-nowrap">
            <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 dark:text-slate-400 shrink-0" />
            <span>{lang === 'en' ? 'Words' : '字数'}: <strong className="text-slate-800 dark:text-slate-100 font-bold">{wordCount}</strong></span>
          </div>
          {lastSaved && (
            <div className="hidden xs:flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/60 rounded-lg text-[10px] sm:text-[11px] font-semibold shadow-2xs whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>{lang === 'en' ? 'Saved' : '已保存'}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 sm:gap-2.5 w-full md:w-auto justify-start sm:justify-end overflow-x-auto scrollbar-none py-0.5 flex-nowrap">
        {/* Studio Dark Mode Toggle */}
        <button
          onClick={toggleThemeMode}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            themeMode === 'dark'
              ? 'bg-indigo-950/60 border border-indigo-700/60 text-indigo-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]'
              : themeMode === 'system'
                ? 'tactile-btn tactile-btn-hover tactile-btn-active text-indigo-600 dark:text-indigo-400'
                : 'tactile-btn tactile-btn-hover tactile-btn-active text-slate-700 dark:text-slate-200'
          }`}
          title={`${lang === 'en' ? 'Current' : '当前'}: ${themeLabel} (${lang === 'en' ? 'Click to switch' : '点击切换'})`}
        >
          {themeMode === 'dark' ? (
            <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          ) : themeMode === 'system' ? (
            <Laptop className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          )}
          <span>{themeLabel}</span>
        </button>

        <button
          onClick={() => setIsCheckerOpen(!isCheckerOpen)}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            isCheckerOpen 
              ? 'bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-inner' 
              : 'tactile-btn tactile-btn-hover tactile-btn-active text-slate-700 dark:text-slate-200'
          }`}
          title={lang === 'en' ? 'Audit resume writing guidelines & spacing issues' : '诊断简历书写规范与排版建议'}
        >
          <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isCheckerOpen ? 'text-indigo-600 dark:text-indigo-400 animate-pulse' : 'text-indigo-500'}`} />
          <span>{lang === 'en' ? 'Diagnostic' : '智能诊断'}</span>
        </button>

        <button
          onClick={() => setIsBackupHubOpen(true)}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 tactile-btn tactile-btn-hover tactile-btn-active text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap shrink-0"
          title={lang === 'en' ? 'Manage multiple versions & backups' : '管理简历版本与备份'}
        >
          <Database className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span>{lang === 'en' ? 'Versions' : '版本中心'}</span>
        </button>
        
        <div className="w-px h-5 bg-slate-200/80 dark:bg-slate-800 shrink-0" />

        <div className="flex items-center border border-slate-200/90 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-2xs shrink-0">
          <label className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer border-r border-slate-200/90 dark:border-slate-700 transition-colors select-none whitespace-nowrap">
            <Upload className="w-3 h-3 text-slate-500 dark:text-slate-400 shrink-0" />
            <span>{lang === 'en' ? 'Import MD' : '导入'}</span>
            <input type="file" accept=".md" onChange={handleImportMarkdown} className="hidden" />
          </label>
          <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            title={lang === 'en' ? 'Download original Markdown file' : '下载 Markdown 原创文本'}
          >
            <Download className="w-3 h-3 text-slate-500 dark:text-slate-400 shrink-0" />
            <span>{lang === 'en' ? 'Export MD' : '导出 MD'}</span>
          </button>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={isExportingPDF}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 tactile-btn-primary tactile-btn-primary-hover tactile-btn-primary-active text-white text-xs font-bold rounded-lg cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 whitespace-nowrap shrink-0"
          title={lang === 'en' ? 'Generate print format A4 resume or export PDF' : '生成打印格式 A4 简历或导出 PDF'}
        >
          {isExportingPDF ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
          ) : (
            <FileDown className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{isExportingPDF ? (lang === 'en' ? 'Generating...' : '正在生成...') : (lang === 'en' ? 'Export PDF' : '导出 PDF')}</span>
        </button>
      </div>
    </header>
  );
}
