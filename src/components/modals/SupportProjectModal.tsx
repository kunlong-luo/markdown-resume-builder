import React, { useEffect, useState } from 'react';
import { ExternalLink, FileDown, Star, X } from 'lucide-react';
import { SUPPORT_REPO_URL } from '../../lib/support-prompt';

interface SupportProjectModalProps {
  isOpen: boolean;
  lang?: string;
  onClose: () => void;
  onSupportClick: () => void;
  onContinue: () => void;
  onSkip: () => void;
}

export function SupportProjectModal({
  isOpen,
  lang = 'zh',
  onClose,
  onSupportClick,
  onContinue,
  onSkip,
}: SupportProjectModalProps) {
  const [visitedGitHub, setVisitedGitHub] = useState(false);
  const isEn = lang === 'en';

  useEffect(() => {
    if (!isOpen) {
      setVisitedGitHub(false);
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const openGitHub = () => {
    window.open(SUPPORT_REPO_URL, '_blank', 'noopener,noreferrer');
    setVisitedGitHub(true);
    onSupportClick();
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-project-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-700/80 dark:bg-slate-900 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-indigo-50/90 to-transparent dark:from-indigo-950/30" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-400 transition-colors hover:bg-white/80 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
          aria-label={isEn ? 'Close' : '关闭'}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative px-6 pb-6 pt-8 sm:px-7">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-100 bg-white text-indigo-600 shadow-sm dark:border-indigo-900/60 dark:bg-slate-900 dark:text-indigo-400">
            <Star className="h-5 w-5" fill="currentColor" />
          </div>

          <div className="mt-4 text-center">
            <h2
              id="support-project-title"
              className="text-xl font-black tracking-tight text-slate-950 dark:text-white"
            >
              {isEn ? 'Enjoying Resume Craft?' : '喜欢 Resume Craft 吗？'}
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
              {isEn
                ? 'Resume Craft is free and open source. If it has made building your resume easier, a GitHub Star helps support continued improvements and helps more people discover the project.'
                : 'Resume Craft 是一个免费开源项目。如果它让你更轻松地完成简历，欢迎在 GitHub 点一个 Star，支持项目持续改进，也让更多人发现它。'}
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-2.5">
            {!visitedGitHub ? (
              <>
                <button
                  type="button"
                  onClick={openGitHub}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.99] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 cursor-pointer"
                >
                  <Star className="h-4 w-4" />
                  <span>{isEn ? 'Support on GitHub' : '去 GitHub 支持项目'}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </button>

                <button
                  type="button"
                  onClick={onSkip}
                  className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  {isEn ? 'Continue export' : '继续导出'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onContinue}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-500 active:scale-[0.99] cursor-pointer"
              >
                <FileDown className="h-4 w-4" />
                <span>{isEn ? 'Continue export' : '继续导出'}</span>
              </button>
            )}
          </div>

          <p className="mt-3 text-center text-[11px] leading-5 text-slate-400 dark:text-slate-500">
            {isEn
              ? 'After visiting GitHub, we will not show this reminder again for a while.'
              : '访问 GitHub 后，一段时间内不再提示。'}
          </p>
        </div>
      </div>
    </div>
  );
}
