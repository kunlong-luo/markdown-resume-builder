import React from 'react';
import { X, ExternalLink, HelpCircle, FileDown, AlertCircle, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../store/useResumeStore';

export function IframeWarningModal() {
  const {
    isIframeModalOpen: isOpen,
    setIsIframeModalOpen,
    settings
  } = useResumeStore();

  const isEn = settings.lang === 'en';
  const onClose = () => setIsIframeModalOpen(false);

  const onOpenNewTab = () => {
    window.open(window.location.href, '_blank');
    setIsIframeModalOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px] cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col"
          >
            {/* Accent colored top bar */}
            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-blue-600">
                <AlertCircle className="w-5 h-5 text-amber-500 animate-bounce" />
                <h3 className="font-bold text-slate-800 text-base">
                  {isEn ? 'PDF Export Security Advisory' : 'PDF 导出说明'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800 leading-relaxed space-y-1">
                <p className="font-bold flex items-center gap-1">
                  ⚠️ {isEn ? 'Why cannot download directly?' : '为什么无法直接下载？'}
                </p>
                <p className="text-justify">
                  {isEn ? (
                    <>
                      You are currently in the <strong>AI Studio sandbox iframe preview</strong>. Due to modern browser security guidelines (cross-origin and sandbox constraints), nested iframes cannot directly trigger the browser print engine or file downloading actions.
                    </>
                  ) : (
                    <>
                      当前处于 <strong>iframe 预览沙箱环境</strong> 中。受现代浏览器安全策略（同源及沙箱限制）影响，嵌套的 iframe 无法直接调起系统的打印引擎和另存为 PDF 功能。
                    </>
                  )}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-700">
                  {isEn ? '💡 Simple Solution (Only 2 steps):' : '💡 解决方法：'}
                </p>
                
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <p className="leading-relaxed">
                      {isEn ? (
                        <>
                          Click the <strong className="text-blue-600">"Open in New Tab"</strong> button below, or click the <strong>"Open in New Window ↗"</strong> icon in the top right corner of the preview area.
                        </>
                      ) : (
                        <>
                          点击下方 <strong className="text-blue-600">“在新标签页中打开”</strong> 按钮，或者点击 AI Studio 预览区右上角的 <strong>“新窗口打开 ↗”</strong> 按钮。
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <p className="leading-relaxed">
                      {isEn ? (
                        <>
                          On the newly opened standalone page, click the <strong className="text-slate-800">"Export PDF"</strong> button. Select <strong>"Save as PDF"</strong> in the browser print panel.
                        </>
                      ) : (
                        <>
                          在新页面中，点击 <strong className="text-slate-800">“Export PDF”</strong> 按钮，在浏览器打印预览面板中选择 <strong>「另存为 PDF」</strong> 即可保存。
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Graphic/Visual Aid */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>
                    {isEn ? 'Supports pixel-perfect HD vector A4 PDF printing' : '支持无损 A4 纸张排版与打印'}
                  </span>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {isEn ? 'Watermark-free' : '无水印'}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center"
              >
                {isEn ? 'Back to Editor' : '返回编辑'}
              </button>
              <button
                onClick={onOpenNewTab}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-blue-600/15 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isEn ? 'Open & Export in New Tab' : '在新标签页中打开并导出'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
