import React, { useState, useRef } from 'react';
import { Sparkles, Clipboard, Check, X, AlertCircle, Upload, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { parseRawTextToResumeMarkdown } from '../../lib/raw-text-importer';

interface RawTextImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (markdown: string) => void;
  onImportFile?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  lang?: string;
}

export function RawTextImportModal({ isOpen, onClose, onImport, onImportFile, lang = 'zh' }: RawTextImportModalProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [rawText, setRawText] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEn = lang === 'en';

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

  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          onImport(content);
          onClose();
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 380 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] z-10"
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
                    {isEn ? 'Import Content' : '导入简历内容'}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">
                    {isEn ? 'Import .md file or paste raw text' : '支持导入 .md 文件或直接粘贴纯文本'}
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

            {/* Tab switcher */}
            <div className="px-5 pt-3 flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900 gap-2">
              <button
                onClick={() => setActiveTab('text')}
                className={`relative pb-2 px-3 text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'text'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {isEn ? 'Paste Text' : '粘贴纯文本'}
                {activeTab === 'text' && (
                  <motion.div
                    layoutId="rawImportActiveTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab('file')}
                className={`relative pb-2 px-3 text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'file'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {isEn ? 'Upload .md' : '上传 .md 文件'}
                {activeTab === 'file' && (
                  <motion.div
                    layoutId="rawImportActiveTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {activeTab === 'text' ? (
            <>
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
                rows={10}
                placeholder={
                  isEn
                    ? `Example:\nJohn Doe\njohn@example.com | 138-0000-0000\nSenior Frontend Engineer\n\nExperience\nGoogle | Tech Lead | 2021.03 - Present\n- Led development of enterprise cloud platform\n- Optimized page load latency by 45%`
                    : `示例纯文本（直接复制任意旧简历文本）：\n张三\n13800138000 | zhangsan@example.com\n高级前端开发工程师\n\n工作经历\n腾讯科技 | 前端负责人 | 2021.06 - 至今\n- 主导核心业务中台建设，提升团队 30% 交付效率\n- 深度调优首屏渲染性能，LCP 缩短 40%\n\n教育背景\n清华大学 | 计算机科学与技术 (硕士) | 2018 - 2021`
                }
                className="w-full p-3.5 text-xs font-mono leading-relaxed bg-slate-50/50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-750 rounded-xl text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150"
              />

              <div className="flex items-start gap-2 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/60 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-indigo-700 dark:text-indigo-300 leading-relaxed font-medium">
                  {isEn
                    ? 'Pure local parser: auto-categorizes sections, standardizes formatting, and runs 100% in your browser.'
                    : '本地隐私安全解析：自动识别经历、教育、项目等模块，完全在本地浏览器运行，不上传任何服务器。'}
                </p>
              </div>
            </>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                {isEn ? 'Select a Markdown (.md) file' : '选择本地 Markdown (.md) 简历文件'}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                {isEn ? 'Supports standard Markdown files generated by this tool or other editors' : '支持导入本工具导出的简历源码或标准 Markdown 文本'}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.txt"
                onChange={handleLocalFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 cursor-pointer transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>{isEn ? 'Choose File' : '选择文件导入'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {isEn ? 'Cancel' : '取消'}
          </button>
          {activeTab === 'text' && (
            <button
              onClick={handleExecuteImport}
              disabled={!rawText.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm shadow-indigo-600/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? 'Convert & Apply' : '一键转为规范简历'}</span>
            </button>
          )}
        </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

