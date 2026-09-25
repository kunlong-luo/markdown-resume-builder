import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  HelpCircle, 
  ShieldCheck, 
  BookOpen, 
  Lock, 
  Scale, 
  Lightbulb,
  Wand2,
  CheckCircle2, 
  Zap, 
  FileText, 
  ExternalLink,
  Laptop,
  Flame,
  Shield,
  Code
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { trackAnalyticsEvent } from '../../lib/analytics';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

interface HelpLegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpLegalModal({ isOpen, onClose }: HelpLegalModalProps) {
  const { settings } = useResumeStore();
  const lang = settings.lang || 'zh';
  const isEn = lang === 'en';

  const [activeTab, setActiveTab] = useState<'guide' | 'privacy' | 'license'>('guide');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-200 transform transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 rounded-xl text-indigo-600 dark:text-indigo-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>{isEn ? 'User Guide' : '使用指南'}</span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 rounded-full">
                  v2.0
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEn ? 'Usage tips & privacy info' : '使用技巧与本地数据隐私说明'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={isEn ? 'Close' : '关闭'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200/80 dark:border-slate-800 px-5 bg-white dark:bg-slate-900 gap-2">
          <button
            onClick={() => setActiveTab('guide')}
            className={`relative flex items-center gap-2 px-3.5 py-3 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'guide'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isEn ? 'User Guide' : '使用技巧'}</span>
            {activeTab === 'guide' && (
              <motion.div
                layoutId="helpLegalActiveTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`relative flex items-center gap-2 px-3.5 py-3 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isEn ? 'Privacy' : '隐私承诺'}</span>
            {activeTab === 'privacy' && (
              <motion.div
                layoutId="helpLegalActiveTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('license')}
            className={`relative flex items-center gap-2 px-3.5 py-3 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'license'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>{isEn ? 'Open Source' : '开源协议与版权'}</span>
            {activeTab === 'license' && (
              <motion.div
                layoutId="helpLegalActiveTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[60vh] text-xs leading-relaxed scrollbar-thin">
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === 'guide' && (
              <motion.div
                key="help-tab-guide"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
              <div className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/60 rounded-xl space-y-1">
                <h3 className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 text-xs">
                  <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                  {isEn ? 'Core Features Overview' : '快速上手指南与高效技巧'}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {isEn
                    ? 'Resume Craft combines visual form editing with Markdown in an A4-focused preview, PDF, and print workflow.'
                    : 'Resume Craft (简匠) 支持可视表单（Form Mode）与原生 Markdown 模式无缝双向同步，专为 A4 标准简历排版设计。'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1.5">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{isEn ? 'Page Break' : '手动精确分页'}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">
                    {isEn
                      ? 'Click the Scissors icon in the editor toolbar to insert a clean A4 page break.'
                      : '在编辑器工具栏点击「剪刀」图标插入分页符，即可精确定位 A4 强制换页位置。'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1.5">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isEn ? 'A4 Height Guard' : '页高预警与一键调整'}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">
                    {isEn
                      ? 'The bottom warning bar detects page overflows automatically. Click "Auto Fit" to optimize line spacing.'
                      : '底部 Heights Guard 自动侦测 A4 溢出行数。点击「一键适纸」即可自动平滑微调行距与边距。'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1.5">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isEn ? 'ATS Keyword Matcher' : 'ATS 关键字与智能诊断'}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">
                    {isEn
                      ? 'Paste target Job Descriptions to analyze match percentage and diagnose ATS parsing issues.'
                      : '点击「智能诊断」粘贴目标岗位 JD，算法将自动对比匹配度、扫描联系方式及排版规范缺陷。'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1.5">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{isEn ? 'Smart Raw Text Paste' : '智能纯文本一键导入'}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">
                    {isEn
                      ? 'Click "Import" in the top bar to paste raw text from Word, PDF, or job boards and convert it into structured Markdown.'
                      : '点击顶部「导入」，可粘贴来自 Word、网页或旧简历的杂乱纯文本，并由本地算法规整为 Markdown。'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1.5">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-blue-500" />
                    <span>{isEn ? 'PDF Export & Print' : 'PDF 下载与打印'}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">
                    {isEn
                      ? 'Use ATS PDF (recommended) to open the browser print / Save as PDF workflow and preserve searchable text where supported. Quick PDF is image-based and intended for visual sharing or fallback use.'
                      : '优先使用顶部「ATS PDF」进入浏览器打印 / 另存为 PDF 流程，在浏览器支持时可保留可搜索文本；「快速 PDF」为图片型文件，更适合视觉分享或备用导出。'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              key="help-tab-privacy"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3.5"
            >
              <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 rounded-xl space-y-1">
                <h3 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 text-xs">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {isEn ? 'Local-First Privacy Model' : '本地优先的数据与隐私模型'}
                </h3>
                <p className="text-emerald-800/90 dark:text-emerald-300/90">
                  {isEn
                    ? 'Resume drafts and settings stay in browser-local storage unless you explicitly create a share link. New share links keep their payload in the URL fragment so it is not sent to the hosting server as a request query. The app has no backend for persisting resume content.'
                    : '简历草稿与设置默认保存在浏览器本地；主动创建的新分享链接会把内容放在 URL fragment 中，不会作为请求查询参数发送给托管站点。应用本身不提供用于持久化简历内容的后端。'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                  <Lock className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">
                      {isEn ? 'Browser-Local Storage' : '浏览器本地存储'}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      {isEn
                        ? 'Draft history, backup versions, and settings are primarily stored in browser localStorage.'
                        : '您的简历草稿、多版本备份与排版参数主要保存在浏览器 localStorage 中；请将设备、浏览器账户与本地备份视为敏感数据环境。'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">
                      {isEn ? 'Privacy Masking Toggle' : '一键脱敏模式 (Privacy Masking)'}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      {isEn
                        ? 'Enable "Privacy Mask" in Basic Info to obscure phone numbers and email addresses during screen sharing.'
                        : '在基本信息编辑器中开启「隐私遮蔽」，即可在屏幕共享或演示时自动掩码手机与邮箱，防止敏感信息泄漏。'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                  <Scale className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">
                      {isEn ? 'Tracking & Analytics' : '追踪与分析边界'}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      {isEn
                        ? 'Resume Craft uses Simple Analytics for coarse aggregate product metrics with a fixed event allowlist and no event metadata. It does not use tracking cookies, session replay, or browser fingerprinting. Resume, JD, contact, filenames, share payloads, access codes, and URL query/hash values are never sent as analytics data. If Do Not Track is enabled, the analytics script is not loaded. Fonts use local system stacks and are not fetched from third-party font CDNs.'
                        : 'Resume Craft 使用 Simple Analytics 统计少量聚合产品指标，仅允许固定事件名且不附带事件 metadata；不使用追踪 Cookie、会话回放或浏览器指纹，也不会发送简历、JD、联系方式、文件名、分享内容、访问口令或 URL 查询/哈希参数。若浏览器开启 Do Not Track，统计脚本不会加载。字体使用本机系统字体栈，不从第三方字体 CDN 拉取。'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'license' && (
            <motion.div
              key="help-tab-license"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3.5"
            >
              <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <GithubIcon className="w-4 h-4" />
                    <span>Resume Craft · 简匠</span>
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-200/50 dark:border-indigo-800/50">
                    MIT License
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {isEn
                    ? 'An open-source, A4-focused Markdown resume builder designed for developers, designers, and job seekers.'
                    : '一款专为开发者、设计师与求职者打造的开源 A4 Markdown 简历编辑器。'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                  <span>{isEn ? 'GitHub Repository' : 'GitHub 官方开源仓库'}</span>
                  <a
                    href="https://github.com/kunlong-luo/resume-craft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>kunlong-luo/resume-craft</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  {isEn
                    ? 'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction under the terms of the MIT License.'
                    : '依据 MIT 开源协议许可：任何个人和企业均可免费使用、修改和分发本源代码，不含任何强制性付费或隐藏条款。'}
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">
            Resume Craft · 简匠 v2.0.0 • Powered by React 19 & Vite
          </span>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/kunlong-luo/resume-craft/discussions"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAnalyticsEvent('feedback_opened')}
              className="px-3 py-1.5 text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>{isEn ? 'Feedback' : '反馈'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-1.5 tactile-btn-primary tactile-btn-primary-hover text-white font-bold rounded-lg cursor-pointer"
            >
              {isEn ? 'Got it' : '我知道了'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
