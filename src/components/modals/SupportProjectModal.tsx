import React, { useEffect, useState } from 'react';
import { ExternalLink, FileDown, Heart, Star, X } from 'lucide-react';
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
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/65 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-project-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-2 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          aria-label={isEn ? 'Close' : '关闭'}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 pb-6 pt-7">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-400">
            <Heart className="h-5 w-5" fill="currentColor" />
          </div>

          <h2 id="support-project-title" className="pr-8 text-lg font-black tracking-tight text-slate-900 dark:text-white">
            {isEn ? 'Enjoying Resume Craft?' : '觉得 Resume Craft 好用吗？'}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {isEn
              ? 'Resume Craft is free and open source. If it helped you, a GitHub Star is a small way to help more people discover the project.'
              : 'Resume Craft 永久免费开源。如果它帮你省下了排版时间，欢迎在 GitHub 点一个 Star，帮助更多人发现这个项目。'}
          </p>

          <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-xs leading-5 text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/30 dark:text-indigo-300">
            {isEn
              ? 'No login or verification is required. You can always continue exporting.'
              : '无需登录，也不会验证你是否 Star。你始终可以直接继续导出。'}
          </div>

          <div className="mt-5 flex flex-col gap-2.5">
            {!visitedGitHub ? (
              <button
                type="button"
                onClick={openGitHub}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.99] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 cursor-pointer"
              >
                <Star className="h-4 w-4" />
                <span>{isEn ? 'Star on GitHub' : '去 GitHub 支持一下'}</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onContinue}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-500 active:scale-[0.99] cursor-pointer"
              >
                <FileDown className="h-4 w-4" />
                <span>{isEn ? 'Continue export' : '返回后继续导出'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onSkip}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              {isEn ? 'Not now — export directly' : '暂时不了，直接导出'}
            </button>
          </div>

          <p className="mt-3 text-center text-[11px] text-slate-400 dark:text-slate-500">
            {isEn
              ? 'Choose GitHub support: hide for 30 days · Not now: hide for 7 days'
              : '访问 GitHub 后 30 天内不再提示 · 暂时不了则 7 天内不再提示'}
          </p>
        </div>
      </div>
    </div>
  );
}
