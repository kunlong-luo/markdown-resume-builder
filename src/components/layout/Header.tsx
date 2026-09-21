import React, { useMemo } from 'react';
import { FileText, Cloud, Sparkles, Database, Upload, Download, FileDown, Loader2 } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { getWordCount } from '../../lib/word-count';

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
    settings
  } = useResumeStore();

  const lang = settings.lang || 'zh';
  const wordCount = useMemo(() => getWordCount(markdown), [markdown]);

  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-6 py-2.5 bg-white/90 backdrop-blur-md border-b border-slate-200/80 z-20 gap-3 md:gap-0 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 w-full md:w-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 text-white flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Markdown Resume Builder</span>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] rounded-full font-bold border border-indigo-100/80 shadow-xs">
                v1.4
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              {lang === 'en' ? 'Fine-tuned, pixel-perfect A4 online Markdown resume editor' : '专业级 A4 纸张排版 Markdown 简历编辑器'}
            </p>
          </div>
        </div>

        <div className="hidden sm:block w-px h-6 bg-slate-200/90 mx-1" />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/70 text-slate-600 border border-slate-200/60 rounded-lg text-[11px] font-semibold shadow-2xs">
            <FileText className="w-3 h-3 text-slate-400" />
            <span>{lang === 'en' ? 'Words' : '字数'}: <strong className="text-slate-800 font-bold">{wordCount}</strong></span>
          </div>
          {lastSaved && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/50 rounded-lg text-[11px] font-semibold shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{lang === 'en' ? 'Saved' : '已自动保存'}: {lastSaved}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
        <button
          onClick={() => setIsCheckerOpen(!isCheckerOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            isCheckerOpen 
              ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-inner' 
              : 'tactile-btn tactile-btn-hover tactile-btn-active text-slate-700'
          }`}
          title={lang === 'en' ? 'Audit resume writing guidelines & spacing issues' : '诊断简历书写规范与排版建议'}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isCheckerOpen ? 'text-indigo-600 animate-pulse' : 'text-indigo-500'}`} />
          <span>{lang === 'en' ? 'Diagnostic' : '智能诊断'}</span>
        </button>

        <button
          onClick={() => setIsBackupHubOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 tactile-btn tactile-btn-hover tactile-btn-active text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
          title={lang === 'en' ? 'Manage multiple versions & backups' : '管理简历版本与备份'}
        >
          <Database className="w-3.5 h-3.5 text-indigo-500" />
          <span>{lang === 'en' ? 'Versions' : '版本中心'}</span>
        </button>
        
        <div className="w-px h-5 bg-slate-200/80" />

        <div className="flex items-center border border-slate-200/90 rounded-lg overflow-hidden bg-white shadow-2xs">
          <label className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer border-r border-slate-200/90 transition-colors select-none">
            <Upload className="w-3 h-3 text-slate-500" />
            <span>{lang === 'en' ? 'Import MD' : '导入'}</span>
            <input type="file" accept=".md" onChange={handleImportMarkdown} className="hidden" />
          </label>
          <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            title={lang === 'en' ? 'Download original Markdown file' : '下载 Markdown 原创文本'}
          >
            <Download className="w-3 h-3 text-slate-500" />
            <span>{lang === 'en' ? 'Export MD' : '导出 MD'}</span>
          </button>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={isExportingPDF}
          className="flex items-center gap-2 px-4 py-1.5 tactile-btn-primary tactile-btn-primary-hover tactile-btn-primary-active text-white text-xs font-bold rounded-lg cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20"
          title={lang === 'en' ? 'Generate print format A4 resume or export PDF' : '生成打印格式 A4 简历或导出 PDF'}
        >
          {isExportingPDF ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <FileDown className="w-3.5 h-3.5" />
          )}
          <span>{isExportingPDF ? (lang === 'en' ? 'Generating...' : '正在生成...') : (lang === 'en' ? 'Export PDF' : '导出 PDF')}</span>
        </button>
      </div>
    </header>
  );
}
