import React, { useState, useMemo } from 'react';
import { SpellCheck, ClipboardCheck, X, Type, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeResume } from '../../lib/resume-checker-utils';
import { formatChineseEnglishSpacing } from '../../lib/format-utils';
import { ScoreDisplay } from './ScoreDisplay';
import { DiagnosticList } from './DiagnosticList';
import { useResumeStore } from '../../store/useResumeStore';

interface ResumeCheckerProps {
  markdown?: string;
  onUpdateMarkdown?: (newMarkdown: string, immediate?: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
  lang?: string;
}

interface WeakWordConfig {
  id: string;
  pattern: RegExp | string;
  isRegex: boolean;
  weakText: string;
  desc: string;
  replacements: { word: string; translation: string }[];
}

const WEAK_WORDS_CONFIG: WeakWordConfig[] = [
  {
    id: 'responsible_for',
    pattern: /\b(?:responsible\s+for)\b/gi,
    isRegex: true,
    weakText: 'responsible for',
    desc: '弱代动词，缺乏成就导向。建议以强动词开头，突出业务或技术担当。',
    replacements: [
      { word: 'Spearheaded', translation: '主导 / 牵头' },
      { word: 'Orchestrated', translation: '统筹 / 规划' },
      { word: 'Led', translation: '带领 / 负责' },
      { word: 'Executed', translation: '执行 / 落地' },
      { word: 'Directed', translation: '指导 / 组织' }
    ]
  },
  {
    id: 'helped',
    pattern: /\b(?:helped)\b/gi,
    isRegex: true,
    weakText: 'helped',
    desc: '口语化动词。建议使用强调跨团队协作与推进力的动词。',
    replacements: [
      { word: 'Collaborated with', translation: '协同 / 协作' },
      { word: 'Facilitated', translation: '推进 / 促进' },
      { word: 'Supported', translation: '配合 / 支持' },
      { word: 'Empowered', translation: '赋能 / 助力' },
      { word: 'Coordinated', translation: '协调 / 联络' }
    ]
  },
  {
    id: 'worked_on',
    pattern: /\b(?:worked\s+on)\b/gi,
    isRegex: true,
    weakText: 'worked on',
    desc: '描述过于平淡。应使用展现工程落地或系统设计能力的动词。',
    replacements: [
      { word: 'Engineered', translation: '研发 / 设计' },
      { word: 'Architected', translation: '架构 / 设计' },
      { word: 'Developed', translation: '开发 / 实现' },
      { word: 'Constructed', translation: '搭建 / 构建' },
      { word: 'Implemented', translation: '实现 / 交付' }
    ]
  },
  {
    id: 'managed',
    pattern: /\b(?:managed)\b/gi,
    isRegex: true,
    weakText: 'managed',
    desc: '词义略显宽泛，建议根据具体管理与协调职责使用更精准的词汇。',
    replacements: [
      { word: 'Orchestrated', translation: '统筹 / 协调' },
      { word: 'Steered', translation: '把控 / 推进' },
      { word: 'Supervised', translation: '管理 / 监督' },
      { word: 'Organized', translation: '组织 / 安排' },
      { word: 'Chaired', translation: '主持 / 牵头' }
    ]
  },
  {
    id: 'improved',
    pattern: /\b(?:improved)\b/gi,
    isRegex: true,
    weakText: 'improved',
    desc: '含义泛化，建议用能够体现性能、质量或效率提升的动词。',
    replacements: [
      { word: 'Optimized', translation: '优化 / 调优' },
      { word: 'Enhanced', translation: '提升 / 增强' },
      { word: 'Upgraded', translation: '升级 / 迭代' },
      { word: 'Refined', translation: '重构 / 完善' },
      { word: 'Streamlined', translation: '精简 / 提效' }
    ]
  },
  {
    id: 'used',
    pattern: /\b(?:used)\b/gi,
    isRegex: true,
    weakText: 'used',
    desc: '单纯使用工具缺乏技术深度。用展现工程落地或技术集成的词汇。',
    replacements: [
      { word: 'Leveraged', translation: '运用 / 借助' },
      { word: 'Integrated', translation: '集成 / 整合' },
      { word: 'Deployed', translation: '部署 / 落地' },
      { word: 'Adopted', translation: '引入 / 采纳' },
      { word: 'Configured', translation: '配置 / 定制' }
    ]
  },
  {
    id: 'assisted',
    pattern: /\b(?:assisted)\b/gi,
    isRegex: true,
    weakText: 'assisted',
    desc: '略显被动。强调个人在项目中的具体担当与关键技术产出。',
    replacements: [
      { word: 'Partnered with', translation: '联合 / 协同' },
      { word: 'Contributed to', translation: '参与 / 贡献' },
      { word: 'Co-authored', translation: '共同编写' },
      { word: 'Delivered', translation: '协助交付' }
    ]
  },
  // Chinese weak words
  {
    id: 'fuzela',
    pattern: '负责了',
    isRegex: false,
    weakText: '负责了',
    desc: '高频泛用词，建议根据具体角色换成更精准的业务担当或技术主导动词。',
    replacements: [
      { word: '主导了', translation: '强调主导把控' },
      { word: '统筹了', translation: '强调全局协调' },
      { word: '推进了', translation: '强调落地执行' },
      { word: '完成了', translation: '强调闭环交付' },
      { word: '落地了', translation: '强调成果达成' }
    ]
  },
  {
    id: 'fuze',
    pattern: '负责',
    isRegex: false,
    weakText: '负责',
    desc: '句首口水词，直接用强动词开篇更具冲击力。',
    replacements: [
      { word: '主导', translation: '核心主导地位' },
      { word: '统筹', translation: '全局协调规划' },
      { word: '牵头', translation: '组织协同' },
      { word: '研发', translation: '技术开发' }
    ]
  },
  {
    id: 'zuoguo',
    pattern: '做过',
    isRegex: false,
    weakText: '做过',
    desc: '口语化严重，缺乏专业职场仪式感。建议替换为标准化项目描述。',
    replacements: [
      { word: '设计并开发了', translation: '系统研发' },
      { word: '实施落地了', translation: '闭环推进' },
      { word: '重构并交付了', translation: '工程攻坚' },
      { word: '搭建了', translation: '从0到1构建' }
    ]
  },
  {
    id: 'xiele',
    pattern: '写了',
    isRegex: false,
    weakText: '写了',
    desc: '描述单薄。建议使用展现工程架构与设计水平的词汇。',
    replacements: [
      { word: '封装了', translation: '模块/组件封装' },
      { word: '编写了', translation: '规范书写' },
      { word: '沉淀了', translation: '文档/规范沉淀' },
      { word: '设计了', translation: '架构/体系设计' },
      { word: '独立完成了', translation: '独立担当' }
    ]
  },
  {
    id: 'gaijinle',
    pattern: '改进了',
    isRegex: false,
    weakText: '改进了',
    desc: '含义较为泛化，建议用能够量化、具有提效意味的成就动词。',
    replacements: [
      { word: '优化了', translation: '性能/体验优化' },
      { word: '重构了', translation: '架构升级' },
      { word: '提升了', translation: '效率/指标提升' },
      { word: '迭代了', translation: '版本演进' },
      { word: '解决了', translation: '攻坚排障' }
    ]
  }
];

export function ResumeChecker(props: ResumeCheckerProps = {}) {
  const store = useResumeStore();
  const markdown = props.markdown ?? store.markdown;
  const onUpdateMarkdown = props.onUpdateMarkdown ?? store.handleMarkdownChange;
  const isOpen = props.isOpen ?? store.isCheckerOpen;
  const onClose = props.onClose ?? (() => store.setIsCheckerOpen(false));
  const lang = props.lang ?? store.settings.lang;

  const [activeTab, setActiveTab] = useState<'diagnostics' | 'verbs'>('diagnostics');

  const isSpacingOptimized = useMemo(() => {
    return formatChineseEnglishSpacing(markdown) === markdown;
  }, [markdown]);

  const analysis = useMemo(() => {
    return analyzeResume(markdown, onUpdateMarkdown, lang);
  }, [markdown, onUpdateMarkdown, lang]);

  const scoreBadge = useMemo(() => {
    if (analysis.score >= 90) return { label: lang === 'en' ? 'Excellent' : '极佳', color: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300', text: 'text-emerald-600 dark:text-emerald-400' };
    if (analysis.score >= 75) return { label: lang === 'en' ? 'Good' : '良好', color: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300', text: 'text-blue-600 dark:text-blue-400' };
    return { label: lang === 'en' ? 'Needs Improvement' : '需优化', color: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300', text: 'text-rose-600 dark:text-rose-400' };
  }, [analysis.score, lang]);

  const matchedWeakWords = useMemo(() => {
    const results: { config: WeakWordConfig; count: number }[] = [];
    WEAK_WORDS_CONFIG.forEach(cfg => {
      let count = 0;
      if (cfg.isRegex) {
        const matches = markdown.match(cfg.pattern as RegExp);
        count = matches ? matches.length : 0;
      } else {
        let pos = 0;
        const target = cfg.pattern as string;
        while ((pos = markdown.indexOf(target, pos)) !== -1) {
          count++;
          pos += target.length;
        }
      }
      if (count > 0) {
        results.push({ config: cfg, count });
      }
    });
    return results;
  }, [markdown]);

  const handleReplace = (cfg: WeakWordConfig, replacement: string) => {
    let newMarkdown = markdown;
    if (cfg.isRegex) {
      newMarkdown = markdown.replace(cfg.pattern as RegExp, (match) => {
        const isCapitalized = /^[A-Z]/.test(match);
        if (isCapitalized) {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        return replacement;
      });
    } else {
      newMarkdown = markdown.replaceAll(cfg.pattern as string, replacement);
    }
    onUpdateMarkdown(newMarkdown, true);
  };

  const isEn = lang === 'en';

  const getLocalizedDesc = (id: string, defaultDesc: string) => {
    const DESCS: Record<string, string> = {
      responsible_for: 'Weak verb phrase lacking achievement-oriented tone. Begin with dynamic action verbs to showcase leadership.',
      helped: 'Informal weak verb. Use strong collaborative verbs to showcase team contributions.',
      worked_on: 'Flat description lacking technical depth. Use precise action verbs showing design or engineering power.',
      managed: 'Commonly used but flat. Try more dynamic management verbs based on responsibilities.',
      improved: 'General description. Use dynamic verbs that show quantifiable improvements or optimization.',
      used: 'Flat tool-usage description. Use verbs highlighting technical orchestration, leverage, and deployment.',
      assisted: 'Slightly passive. Emphasize your concrete contributions and key technical achievements.',
      fuzela: 'Extremely overused in Chinese resumes. Replace with precise action verbs showing ownership.',
      fuze: 'Overused filler verb. Use stronger, more direct, and authoritative action verbs.',
      zuoguo: 'Colloquial verb. Highly unprofessional in a resume. Replace with action verbs showing depth.',
      xiele: 'Too simple. Replace with words highlighting architecture, deployment, or authorship.',
      gaijinle: 'Consider using verbs highlighting optimization, refactoring, and quantifiable impact.'
    };
    return isEn ? (DESCS[id] || defaultDesc) : defaultDesc;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px] z-40 sm:hidden cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed sm:absolute top-0 right-0 h-full w-full sm:w-[355px] max-w-full bg-white dark:bg-slate-900 sm:border-l border-slate-200/80 dark:border-slate-800 shadow-2xl z-50 sm:z-40 flex flex-col overflow-hidden transition-colors"
          >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                {isEn ? 'Resume Diagnostic' : '简历诊断'}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 relative">
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`relative flex-1 py-3 text-xs font-bold transition-all cursor-pointer ${activeTab === 'diagnostics' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <span>{isEn ? 'Score & Advice' : '评分建议'}</span>
              {activeTab === 'diagnostics' && (
                <motion.div
                  layoutId="checkerActiveTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('verbs')}
              className={`relative flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'verbs' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <SpellCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isEn ? 'Verb Optimization' : '用词优化'}</span>
              {matchedWeakWords.length > 0 && (
                <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-1 scale-90">
                  {matchedWeakWords.length}
                </span>
              )}
              {activeTab === 'verbs' && (
                <motion.div
                  layoutId="checkerActiveTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
            <AnimatePresence mode="wait" initial={false}>
              {activeTab === 'diagnostics' ? (
                <motion.div 
                  key="tab-diagnostics"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8"
                >
                  <ScoreDisplay analysis={analysis} scoreBadge={scoreBadge} lang={lang} />
                  <DiagnosticList issues={analysis.issues} lang={lang} />
                </motion.div>
              ) : (
                <motion.div 
                  key="tab-verbs"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5"
                >
                <div className="bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/60 rounded-xl p-3">
                  <span className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1 mb-1">
                    <SpellCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{isEn ? 'Action Verb Optimizer' : '专业用词优化'}</span>
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isEn 
                      ? 'Using result-oriented STAR strong verbs instead of passive expressions can make your resume more powerful.'
                      : '推荐使用 STAR 法则强动词代替平淡口水词，显著增强简历说服力。'}
                  </p>
                </div>

                {matchedWeakWords.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 dark:text-slate-500 space-y-3.5">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/60 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <Check className="w-6 h-6 text-emerald-500 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {isEn ? 'No weak verbs detected!' : '未检测到弱词'}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-[240px] mx-auto leading-relaxed">
                        {isEn 
                          ? 'Your word choices are professional, concise, and result-oriented.'
                          : '您的用词专业干练，已避开常见平淡词汇。'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 px-1 uppercase tracking-wider">
                      <span>
                        {isEn ? `Found ${matchedWeakWords.length} weak words` : `${matchedWeakWords.length} 处弱词`}
                      </span>
                      <span className="text-rose-500">
                        {isEn ? 'Replace Suggested ⚡' : '建议替换 ⚡'}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {matchedWeakWords.map(({ config, count }) => (
                        <div key={config.id} className="bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3.5 space-y-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                              <span className="line-through text-slate-400 dark:text-slate-500 bg-slate-100/80 dark:bg-slate-700/80 px-2 py-0.5 rounded font-mono border border-slate-200/40 dark:border-slate-600">{config.weakText}</span>
                              <span className="text-[9px] bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-150/40 dark:border-red-800/60 px-2 py-0.5 rounded-full font-bold">
                                {isEn ? `Found ${count} here` : `出现 ${count} 次`}
                              </span>
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed pl-0.5">
                            {getLocalizedDesc(config.id, config.desc)}
                          </p>
                          
                          <div className="space-y-2 pt-1 border-t border-slate-100/80 dark:border-slate-700/60">
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider pl-0.5">
                              {isEn ? 'Refactor to:' : '建议替换为：'}
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {config.replacements.map(rep => (
                                <button
                                  key={rep.word}
                                  onClick={() => handleReplace(config, rep.word)}
                                  className="px-2.5 py-1.5 bg-white dark:bg-slate-750 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-800 dark:hover:text-emerald-300 rounded-lg transition-all cursor-pointer shadow-2xs active:scale-95 text-left flex flex-col justify-center gap-0.5"
                                >
                                  <span className="text-slate-800 dark:text-slate-100 font-bold">{rep.word}</span>
                                  {!isEn && (
                                    <span className="text-[9px] text-slate-400 dark:text-slate-400 font-normal truncate">{rep.translation}</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Button at the bottom of the panel */}
          <div className="p-4 bg-slate-50/50 dark:bg-slate-850/70 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <button
              disabled={isSpacingOptimized}
              onClick={() => {
                if (isSpacingOptimized) return;
                const formatted = formatChineseEnglishSpacing(markdown);
                onUpdateMarkdown(formatted, true);
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isSpacingOptimized
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 cursor-default'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white shadow-md shadow-blue-500/10 cursor-pointer'
              }`}
            >
              {isSpacingOptimized ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{isEn ? 'Spacing Already Perfect' : '中英空格已是最佳'}</span>
                </>
              ) : (
                <>
                  <Type className="w-4 h-4" />
                  <span>{isEn ? 'Optimize Spacing (CN/EN)' : '一键优化中英空格'}</span>
                </>
              )}
            </button>
          </div>

          {/* Footer Guide */}
          <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200/80 dark:border-slate-800 text-center text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            {isEn 
              ? '💡 Privacy Guarantee: All audits run in-browser safely.' 
              : '💡 诊断与优化均在本地运行，不泄露任何隐私'}
          </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
