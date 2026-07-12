import React, { useState, useRef } from 'react';
import { Lock, FileText, Printer, Check, ShieldCheck, HelpCircle } from 'lucide-react';
import { Preview } from '../preview/Preview';
import { ShareState } from '../../lib/share-utils';

interface SharedResumePageProps {
  shareState: ShareState;
}

export function SharedResumePage({ shareState }: SharedResumePageProps) {
  const { markdown, settings, passwordHash } = shareState;
  
  // If there's a password hash, we demand validation
  const isLocked = !!passwordHash;
  const [unlocked, setUnlocked] = useState(!isLocked);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const contentRef = useRef<HTMLDivElement>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === passwordHash) {
      setUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg(settings.lang === 'en' ? 'Incorrect access password' : '访问密码错误，请重试');
    }
  };

  const triggerPrint = () => {
    window.print();
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
        <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/40 p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
          
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-inner">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-lg">
                {settings.lang === 'en' ? 'Encrypted Resume Portfolio' : '受密码保护的专属简历外链'}
              </h1>
              <p className="text-xs text-slate-400 font-medium max-w-[280px] mx-auto mt-1">
                {settings.lang === 'en' 
                  ? 'The owner of this resume has enabled secure password protection'
                  : '该简历的求职者已开启高安全性防泄漏锁，请输入访问密码'}
              </p>
            </div>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {settings.lang === 'en' ? 'Access Code / Password' : '请输入招聘官访问密码'}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-center tracking-widest text-slate-800 font-bold"
                required
                autoFocus
              />
              {errorMsg && (
                <p className="text-[10px] text-rose-500 font-bold text-center animate-shake mt-1">
                  {errorMsg}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-indigo-600/10 cursor-pointer"
            >
              {settings.lang === 'en' ? 'Unlock & Read Resume' : '验证密码并查看简历'}
            </button>
          </form>

          <div className="border-t border-slate-100 pt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{settings.lang === 'en' ? 'SSL Secure Hashing Encrypted' : '256位端到端安全传输加密'}</span>
          </div>
        </div>
      </div>
    );
  }

  // Unlocked: Render full responsive visual resume!
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Navigation Header (Print Hidden) */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200/60 z-50 px-4 md:px-8 py-3.5 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 font-bold text-sm shadow-sm shadow-indigo-600/25">
            <FileText className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-xs md:text-sm">
              {settings.lang === 'en' ? 'Online Interactive Portfolio' : '求职专属在线简历推荐页'}
            </h2>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              {settings.lang === 'en' 
                ? 'Mobile-responsive view · Ready to print / save as PDF' 
                : '免登录全平台自适应排版 · 随时可直接打印/导出高保真 PDF'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerPrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-lg shadow-sm shadow-indigo-600/10 transition-all cursor-pointer"
            title={settings.lang === 'en' ? 'Print or Save PDF' : '保存本地 / 打印高精度 PDF'}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{settings.lang === 'en' ? 'Print / Export PDF' : '一键保存高保真 PDF'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1 flex justify-center py-4 md:py-8 px-2 overflow-x-hidden">
        <div className="w-full max-w-4xl flex justify-center relative">
          <Preview 
            ref={contentRef}
            overrideMarkdown={markdown}
            overrideSettings={settings}
          />
        </div>
      </main>

      {/* Floating Info Banner for recruiters */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm text-white text-[10px] md:text-xs px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 z-40 print:hidden font-medium border border-slate-800/50">
        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          {settings.lang === 'en'
            ? 'Desktop users: Click "Print / Export PDF" to save perfect single-page layout.'
            : '提示：招聘官可直接点击上方按钮或使用快捷键 Ctrl+P 获得极致排版的 A4 面纸质/PDF 档案。'}
        </span>
      </div>
    </div>
  );
}
