import React, { useMemo, useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  ClipboardCheck, 
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
  ClipboardPaste,
  DownloadCloud,
  Menu,
  X,
  Globe,
  Settings,
  CheckCircle2
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { getWordCount } from '../../lib/word-count';
import { ThemeMode } from '../../types';
import { ProfileDropdown } from '../profile/ProfileDropdown';
import { Tooltip } from '../ui';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { trackAnalyticsEvent } from '../../lib/analytics';

const RawTextImportModal = React.lazy(() => import('../modals/RawTextImportModal').then(m => ({ default: m.RawTextImportModal })));

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
    isSaving,
    saveStatus,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isInstallable, triggerInstall } = usePWAInstall();

  const handleTriggerExport = () => {
    if (handleExportDirectPDF) {
      handleExportDirectPDF();
    } else {
      handleExportPDF();
    }
  };

  const handleInstallApp = async () => {
    const installed = await triggerInstall();
    if (installed) {
      trackAnalyticsEvent('pwa_install');
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
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/90 relative z-50 shadow-[0_1px_3px_rgba(15,23,42,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-colors duration-200">
      {/* Mobile Top Bar (< md) */}
      <div className="flex md:hidden items-center justify-between px-3.5 h-12 w-full">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 rounded-lg text-white flex items-center justify-center shadow-xs font-black text-xs tracking-tighter">
            RC
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-black text-xs text-slate-900 dark:text-white tracking-tight">
              {isEn ? 'Resume Craft' : '简匠'}
            </span>
          </div>
          <ProfileDropdown lang={settings.lang} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleTriggerExport()}
            disabled={isExportingPDF}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold active:scale-95 transition-all shadow-xs"
          >
            {isExportingPDF ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileDown className="w-3 h-3" />}
            <span>PDF</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-indigo-500" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Top Bar (>= md) */}
      <div className="hidden md:flex items-center justify-between px-6 py-2 w-full">
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 rounded-xl shadow-md shadow-indigo-500/20 text-white flex items-center justify-center font-black text-xs tracking-tighter">
              RC
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-black text-slate-900 dark:text-white tracking-tight">
                {isEn ? 'Resume Craft' : '简匠'}
              </span>
            </div>
          </div>

          <div className="w-px h-5 bg-slate-200/90 dark:bg-slate-800 mx-1 shrink-0" />

          {/* Multi-Profile Archive Selector */}
          <ProfileDropdown lang={settings.lang} />

          {/* Real-time 3-Stage Save Status Indicator */}
          {saveStatus === 'editing' ? (
            <Tooltip
              content={isEn ? 'Editing document...' : '正在实时编辑简历内容...'}
              side="bottom"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/60 rounded-lg text-[11px] font-semibold shadow-2xs whitespace-nowrap cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping shrink-0" />
                <span>{isEn ? 'Editing' : '正在编辑'}</span>
              </div>
            </Tooltip>
          ) : saveStatus === 'saving' || isSaving ? (
            <Tooltip
              content={isEn ? 'Syncing changes to local storage...' : '正在自动保存修改到本地浏览器...'}
              side="bottom"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/60 rounded-lg text-[11px] font-semibold shadow-2xs whitespace-nowrap cursor-default animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin text-amber-500 shrink-0" />
                <span>{isEn ? 'Saving...' : '保存中...'}</span>
              </div>
            </Tooltip>
          ) : (
            <Tooltip 
              content={
                lastSaved 
                  ? `${isEn ? 'Saved at' : '保存于'} ${lastSaved} (${isEn ? 'Local Storage' : '已自动同步至本地'})`
                  : (isEn ? 'All changes automatically saved to local storage' : '已自动同步保存至本地浏览器')
              }
              side="bottom"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/60 rounded-lg text-[11px] font-semibold shadow-2xs whitespace-nowrap cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>{isEn ? 'Saved' : '已保存'}</span>
              </div>
            </Tooltip>
          )}
        </div>
        
        <div className="flex items-center gap-2 justify-end shrink-0">
          {/* Studio Dark Mode Toggle */}
          <Tooltip content={`${isEn ? 'Theme' : '切换主题'}: ${themeLabel}`} side="bottom">
            <button
              onClick={(e) => toggleThemeMode(e)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95 ${
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
              <span>{themeLabel}</span>
            </button>
          </Tooltip>

          {/* Help & Legal Center Button */}
          <Tooltip content={isEn ? 'User Guide & Privacy Policy' : '使用指南与隐私说明'} side="bottom">
            <button
              onClick={() => setIsHelpLegalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 tactile-btn tactile-btn-hover tactile-btn-active text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap shrink-0 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>{isEn ? 'Guide' : '指南'}</span>
            </button>
          </Tooltip>

          {/* PWA Install Button */}
          {isInstallable && (
            <Tooltip content={isEn ? 'Install as Desktop / Mobile App' : '安装为桌面或手机独立应用'} side="bottom">
              <button
                onClick={handleInstallApp}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap shrink-0 transition-all active:scale-95"
              >
                <DownloadCloud className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{isEn ? 'Install App' : '安装应用'}</span>
              </button>
            </Tooltip>
          )}

          {/* Diagnostic Button */}
          <Tooltip content={isEn ? 'ATS Diagnostic & Optimization' : '简历诊断与智能评分'} side="bottom">
            <button
              onClick={() => setIsCheckerOpen(!isCheckerOpen)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isCheckerOpen 
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-inner' 
                  : 'tactile-btn tactile-btn-hover tactile-btn-active text-slate-700 dark:text-slate-200'
              }`}
            >
              <ClipboardCheck className={`w-3.5 h-3.5 shrink-0 ${isCheckerOpen ? 'text-indigo-600 dark:text-indigo-400' : 'text-indigo-500'}`} />
              <span>{isEn ? 'Diagnostic' : '诊断'}</span>
            </button>
          </Tooltip>

          <div className="w-px h-5 bg-slate-200/80 dark:bg-slate-800 shrink-0" />

          {/* Unified Import & Export Actions */}
          <div className="flex items-center border border-slate-200/90 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-2xs shrink-0">
            <Tooltip content={isEn ? 'Import Markdown file or paste text' : '导入文件或提取文本'} side="bottom">
              <button
                onClick={() => setIsRawTextModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer border-r border-slate-200/90 dark:border-slate-700 transition-all select-none whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>{isEn ? 'Import' : '导入'}</span>
              </button>
            </Tooltip>

            <Tooltip content={isEn ? 'Export raw Markdown file (.md)' : '导出 Markdown 源码 (.md)'} side="bottom">
              <button
                onClick={handleExportMarkdown}
                className="flex items-center gap-1 px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                <span>{isEn ? 'Export' : '导出'}</span>
              </button>
            </Tooltip>
          </div>

          {/* Direct PDF Export Action Button */}
          <Tooltip content={isEn ? 'Download PDF' : '下载 PDF 简历'} side="bottom">
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
                  : (isEn ? 'Download' : '下载')}
              </span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-2xl p-4 flex flex-col gap-3 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">{isEn ? 'Quick Actions' : '快捷功能菜单'}</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={(e) => { toggleThemeMode(e); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all active:scale-95"
              >
                {themeMode === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <span>{isEn ? 'Theme' : '外观主题'}: {themeLabel}</span>
              </button>

              <button
                onClick={() => { setIsCheckerOpen(!isCheckerOpen); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all active:scale-95"
              >
                <ClipboardCheck className="w-4 h-4 text-indigo-500" />
                <span>{isEn ? 'ATS Check' : 'ATS 简历自检'}</span>
              </button>

              <button
                onClick={() => { setIsBackupHubOpen(true); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all active:scale-95"
              >
                <Database className="w-4 h-4 text-indigo-500" />
                <span>{isEn ? 'Versions' : '版本管理'}</span>
              </button>

              <button
                onClick={() => { setIsRawTextModalOpen(true); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all active:scale-95"
              >
                <Upload className="w-4 h-4 text-indigo-500" />
                <span>{isEn ? 'Import' : '导入/提取文本'}</span>
              </button>

              <button
                onClick={() => { handleExportMarkdown(); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all active:scale-95"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>{isEn ? 'Export' : '导出'}</span>
              </button>

              <button
                onClick={() => { setIsHelpLegalOpen(true); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all active:scale-95"
              >
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                <span>{isEn ? 'Help' : '使用帮助与隐私'}</span>
              </button>

              {isInstallable && (
                <button
                  onClick={() => { void handleInstallApp(); setIsMobileMenuOpen(false); }}
                  className="col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all active:scale-95"
                >
                  <DownloadCloud className="w-4 h-4 text-emerald-500 animate-bounce" />
                  <span>{isEn ? 'Install App' : '安装 Resume Craft 应用'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Smart Raw Text / File Import Modal */}
      {isRawTextModalOpen && (
        <React.Suspense fallback={null}>
          <RawTextImportModal
            isOpen={isRawTextModalOpen}
            onClose={() => setIsRawTextModalOpen(false)}
            onImport={(newMd) => {
              handleMarkdownChange(newMd, true);
            }}
            onImportFile={handleImportMarkdown}
            lang={lang}
          />
        </React.Suspense>
      )}
    </header>
  );
}

