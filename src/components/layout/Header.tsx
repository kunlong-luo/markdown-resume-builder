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
    <header className="flex flex-col md:flex-row items-center justify-between px-6 py-3 bg-white border-b border-slate-200/80 z-20 gap-3 md:gap-0 shadow-sm shadow-slate-100/50">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg shadow-sm shadow-blue-500/10">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              Markdown Resume Builder
              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded-full font-semibold border border-blue-100/60">
                v1.4
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              {lang === 'en' ? 'Fine-tuned, pixel-perfect A4 online Markdown resume editor' : 'Markdown 简历编辑器'}
            </p>
          </div>
        </div>

        <div className="hidden sm:block w-px h-6 bg-slate-200/80 mx-1" />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200/50 rounded-lg text-[10px] font-semibold">
            <FileText className="w-3 h-3 text-slate-400" />
            <span>{lang === 'en' ? 'Words' : '字数'}: <strong className="text-slate-800">{wordCount}</strong></span>
          </div>
          {lastSaved && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100/40 rounded-lg text-[10px] font-semibold">
              <Cloud className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>{lang === 'en' ? 'Autosaved' : '已自动保存'}: {lastSaved}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
        <button
          onClick={() => setIsCheckerOpen(!isCheckerOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            isCheckerOpen 
          ? 'bg-indigo-50 border border-indigo-200/80 text-indigo-700 font-bold shadow-[inset_0_1.5px_3px_rgba(99,102,241,0.08)]' 
          : 'tactile-btn tactile-btn-hover tactile-btn-active text-slate-700'
          }`}
          title={lang === 'en' ? 'Audit resume writing guidelines & spacing issues' : '诊断简历书写规范与排版建议'}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isCheckerOpen ? 'text-indigo-600 animate-pulse' : 'text-slate-500'}`} />
          <span>{lang === 'en' ? 'Smart Diagnostic' : '智能诊断'}</span>
        </button>

        <button
          onClick={() => setIsBackupHubOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 tactile-btn tactile-btn-hover tactile-btn-active text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
          title={lang === 'en' ? 'Manage multiple versions & backups' : '管理简历版本与备份'}
        >
          <Database className="w-3.5 h-3.5 text-indigo-500" />
          <span>{lang === 'en' ? 'Versions' : '版本备份'}</span>
        </button>
        
        <div className="w-px h-5 bg-slate-200" />

        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-[0_2px_4px_rgba(15,23,42,0.02),inset_0_1.5px_2px_rgba(255,255,255,0.95)]">
          <label className="flex items-center gap-1 px-2.5 py-1.5 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer border-r border-slate-200 transition-colors select-none">
            <Upload className="w-3 h-3 text-slate-500" />
            <span>{lang === 'en' ? 'Import MD' : '导入 MD'}</span>
            <input type="file" accept=".md" onChange={handleImportMarkdown} className="hidden" />
          </label>
          <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-1 px-2.5 py-1.5 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            title={lang === 'en' ? 'Download original Markdown file' : '下载 Markdown 原创文本'}
          >
            <Download className="w-3 h-3 text-slate-500" />
            <span>{lang === 'en' ? 'Export MD' : '导出 MD'}</span>
          </button>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={isExportingPDF}
          className="flex items-center gap-1.5 px-4 py-1.5 tactile-btn-primary tactile-btn-primary-hover tactile-btn-primary-active text-white text-xs font-bold rounded-lg cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
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
