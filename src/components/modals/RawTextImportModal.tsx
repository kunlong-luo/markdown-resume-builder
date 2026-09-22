import React, { useState } from 'react';
import { Sparkles, Clipboard, Check, X, AlertCircle } from 'lucide-react';
import { parseRawTextToResumeMarkdown } from '../../lib/raw-text-importer';

interface RawTextImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (markdown: string) => void;
  lang?: string;
}

export function RawTextImportModal({ isOpen, onClose, onImport, lang = 'zh' }: RawTextImportModalProps) {
  const [rawText, setRawText] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const isEn = lang === 'en';

  if (!isOpen) return null;

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setRawText(text);
          setCopiedSuccess(true);
          setTimeout(() => setCopiedSuccess(false), 2000);
        }
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
    }
  };

  const handleExecuteImport = () => {
    if (!rawText.trim()) return;
    const generatedMarkdown = parseRawTextToResumeMarkdown(rawText);
    onImport(generatedMarkdown);
    setRawText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/80">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                {isEn ? 'Smart Raw Text Importer' : '智能纯文本一键导入'}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">
                {isEn ? 'Paste unstructured text from Word / PDF / Job sites into standard Markdown' : '直接粘贴招聘网或旧简历纯文本，自动识别提取并转为标准 Markdown'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <span>{isEn ? 'Paste Raw Text Here:' : '粘贴杂乱纯文本内容：'}</span>
            </label>
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 px-2.5 py-1 rounded-lg border border-indigo-200/60 dark:border-indigo-800/60 transition-colors cursor-pointer"
            >
              {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Clipboard className="w-3.5 h-3.5" />}
              <span>{copiedSuccess ? (isEn ? 'Pasted!' : '已读取剪贴板') : (isEn ? 'Paste from Clipboard' : '读取剪贴板内容')}</span>
            </button>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={12}
            placeholder={
              isEn
                ? `Example:\nJohn Doe\njohn@example.com | 138-0000-0000\nSenior Frontend Engineer\n\nExperience\nGoogle | Tech Lead | 2021.03 - Present\n- Led development of enterprise cloud platform\n- Optimized page load latency by 45%`
                : `示例纯文本（直接复制任意简历内容即可）：\n张三\n13800138000 | zhangsan@example.com\n高级前端开发工程师\n\n工作经历\n腾讯科技 | 前端负责人 | 2021.06 - 至今\n- 主导核心业务中台建设，提升团队 30% 交付效率\n- 深度调优首屏渲染性能，LCP 缩短 40%\n\n教育背景\n清华大学 | 计算机科学与技术 (硕士) | 2018 - 2021`
            }
            className="w-full p-3.5 text-xs font-mono leading-relaxed bg-slate-50/50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-750 rounded-xl text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150"
          />

          <div className="flex items-start gap-2 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/60 p-3 rounded-xl">
            <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-indigo-700 dark:text-indigo-300 leading-relaxed font-medium">
              {isEn
                ? 'The smart parser will auto-categorize sections (Experience, Education, Skills, Projects), reformat bullet points, and structure the Markdown without sending data to external servers.'
                : '纯本地智能分段算法：自动识别提取姓名、联系方式、经历、教育、技能等分块，并规整为 Markdown，无网络延迟与隐私泄露风险。'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {isEn ? 'Cancel' : '取消'}
          </button>
          <button
            onClick={handleExecuteImport}
            disabled={!rawText.trim()}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm shadow-indigo-600/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? 'Convert & Apply' : '一键转为规范简历'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
