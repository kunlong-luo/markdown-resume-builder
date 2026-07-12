import React from 'react';
import { FileText, Cloud, Sparkles, Database, Upload, Download, FileDown, Loader2 } from 'lucide-react';

interface HeaderProps {
  wordCount: number;
  lastSaved: string;
  isCheckerOpen: boolean;
  setIsCheckerOpen: (open: boolean) => void;
  setIsBackupHubOpen: (open: boolean) => void;
  handleImportMarkdown: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExportMarkdown: () => void;
  handleExportPDF: () => void;
  isExportingPDF: boolean;
  lang: string;
}

export function Header({
  wordCount,
  lastSaved,
  isCheckerOpen,
  setIsCheckerOpen,
  setIsBackupHubOpen,
  handleImportMarkdown,
  handleExportMarkdown,
  handleExportPDF,
  isExportingPDF,
  lang
}: HeaderProps) {
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
                PRO v1.3
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              {lang === 'en' ? 'Fine-tuned, pixel-perfect A4 online Markdown resume editor' : '精细排版、完美A4分页的在线简历编辑器'}
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
          className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-[0.98] cursor-pointer ${
            isCheckerOpen 
              ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' 
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
          title={lang === 'en' ? 'Audit resume writing guidelines & spacing issues' : '一键诊断简历书写规范与排版建议'}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isCheckerOpen ? 'text-blue-600 animate-pulse' : 'text-slate-500'}`} />
          <span>{lang === 'en' ? 'Diagnostic Audit' : '智能诊断'}</span>
        </button>

        <button
          onClick={() => setIsBackupHubOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          title={lang === 'en' ? 'Manage multiple drafts & historical versions' : '管理多个不同的简历版本与本地历史草稿'}
        >
          <Database className="w-3.5 h-3.5 text-indigo-500" />
          <span>{lang === 'en' ? 'Draft History Hub' : '多版本草稿箱'}</span>
        </button>
        
        <div className="w-px h-5 bg-slate-200" />

        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <label className="flex items-center gap-1 px-2.5 py-1.5 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer border-r border-slate-150 transition-colors select-none">
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
          className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-blue-600/10 hover:shadow-lg hover:shadow-blue-600/15 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
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
