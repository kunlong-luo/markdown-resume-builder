import React, { useState, useMemo } from 'react';
import { Sparkles, X, Type, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeResume } from '../../lib/resume-checker-utils';
import { formatChineseEnglishSpacing } from '../../lib/format-utils';
import { ScoreDisplay } from './ScoreDisplay';
import { DiagnosticList } from './DiagnosticList';
import { useResumeStore } from '../../store/useResumeStore';

interface ResumeCheckerProps {
  markdown: string;
  onUpdateMarkdown: (newMarkdown: string, immediate?: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
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
    desc: '弱代动词短语，缺乏成就导向。建议以具体的强行动词开头，突出领导力和执行力。',
    replacements: [
      { word: 'Spearheaded', translation: '领衔主导' },
      { word: 'Orchestrated', translation: '统筹策划' },
      { word: 'Led', translation: '领导带领' },
      { word: 'Executed', translation: '执行落实' },
      { word: 'Directed', translation: '指导指引' }
    ]
  },
  {
    id: 'helped',
    pattern: /\b(?:helped)\b/gi,
    isRegex: true,
    weakText: 'helped',
    desc: '口语化弱词。使用能彰显团队贡献和专业能力的协作性行动词。',
    replacements: [
      { word: 'Collaborated with', translation: '携手协作' },
      { word: 'Facilitated', translation: '推进促进' },
      { word: 'Supported', translation: '支持协助' },
      { word: 'Empowered', translation: '赋能助力' },
      { word: 'Fostered', translation: '培养培育' }
    ]
  },
  {
    id: 'worked_on',
    pattern: /\b(?:worked\s+on)\b/gi,
    isRegex: true,
    weakText: 'worked on',
    desc: '描述过于平淡，缺乏专业深度。应使用展现工程能力或设计思维的动词。',
    replacements: [
      { word: 'Engineered', translation: '研发设计' },
      { word: 'Architected', translation: '架构设计' },
      { word: 'Developed', translation: '独立开发' },
      { word: 'Constructed', translation: '构建建设' },
      { word: 'Forged', translation: '打造打磨' }
    ]
  },
  {
    id: 'managed',
    pattern: /\b(?:managed)\b/gi,
    isRegex: true,
    weakText: 'managed',
    desc: '虽然是常用词，但稍显单调。建议根据具体管理性质使用更具体的词汇。',
    replacements: [
      { word: 'Orchestrated', translation: '统筹协调' },
      { word: 'Steered', translation: '舵手引领' },
      { word: 'Chaired', translation: '主持承担' },
      { word: 'Mobilized', translation: '调动集结' },
      { word: 'Supervised', translation: '监督督导' }
    ]
  },
  {
    id: 'improved',
    pattern: /\b(?:improved)\b/gi,
    isRegex: true,
    weakText: 'improved',
    desc: '含义较为泛化，建议用能够量化、具有显著提效意味的成就动词。',
    replacements: [
      { word: 'Optimized', translation: '极致优化' },
      { word: 'Enhanced', translation: '显著提升' },
      { word: 'Elevated', translation: '拔高提升' },
      { word: 'Amplified', translation: '放大增强' },
      { word: 'Refined', translation: '精雕细琢' }
    ]
  },
  {
    id: 'used',
    pattern: /\b(?:used)\b/gi,
    isRegex: true,
    weakText: 'used',
    desc: '平淡无奇的工具使用描述。应使用更能彰显技术掌控力与部署能力的强动词。',
    replacements: [
      { word: 'Leveraged', translation: '杠杆利用/借力' },
      { word: 'Utilized', translation: '充分运用' },
      { word: 'Deployed', translation: '部署调配' },
      { word: 'Harnessed', translation: '驾驭掌握' },
      { word: 'Capitalized on', translation: '依托并转化' }
    ]
  },
  {
    id: 'assisted',
    pattern: /\b(?:assisted)\b/gi,
    isRegex: true,
    weakText: 'assisted',
    desc: '略显被动。应强调您在项目合作中的具体分工与实质性技术产出。',
    replacements: [
      { word: 'Collaborated on', translation: '联合攻坚' },
      { word: 'Co-engineered', translation: '协同研发' },
      { word: 'Contributed to', translation: '实质贡献于' },
      { word: 'Facilitated', translation: '推动并达成' }
    ]
  },
  // Chinese weak words:
  {
    id: 'fuzela',
    pattern: '负责了',
    isRegex: false,
    weakText: '负责了',
    desc: '中文简历高频口水词，过于含糊。建议换成更能凸显您在项目中话语权与担当的词汇。',
    replacements: [
      { word: '主导了', translation: 'Lead / Spearheaded' },
      { word: '统筹了', translation: 'Orchestrated' },
      { word: '牵头了', translation: 'Initiated' },
      { word: '承接了', translation: 'Undertook' }
    ]
  },
  {
    id: 'fuze',
    pattern: '负责',
    isRegex: false,
    weakText: '负责',
    desc: '高频平淡词。建议使用更具主导性、更有力度和专业性的行为动词。',
    replacements: [
      { word: '主导', translation: 'Spearheaded' },
      { word: '统筹', translation: 'Orchestrated' },
      { word: '牵头', translation: 'Initiated' },
      { word: '聚焦', translation: 'Focused on' },
      { word: '开拓', translation: 'Pioneered' }
    ]
  },
  {
    id: 'zuoguo',
    pattern: '做过',
    isRegex: false,
    weakText: '做过',
    desc: '大白话。在简历中显得极其不专业，一定要替换为具备专业成熟度的动词。',
    replacements: [
      { word: '研发了', translation: 'Engineered' },
      { word: '构建了', translation: 'Constructed' },
      { word: '自主开发了', translation: 'Self-developed' },
      { word: '攻坚了', translation: 'Tackled' }
    ]
  },
  {
    id: 'xiele',
    pattern: '写了',
    isRegex: false,
    weakText: '写了',
    desc: '平铺直叙。建议换成架构、落地、沉淀等能够体现专业深度和工程广度的词汇。',
    replacements: [
      { word: '自主设计并编写了', translation: 'Designed & Authored' },
      { word: '架构并实现了', translation: 'Architected & Implemented' },
      { word: '沉淀了', translation: 'Accumulated' }
    ]
  },
  {
    id: 'gaijinle',
    pattern: '改进了',
    isRegex: false,
    weakText: '改进了',
    desc: '建议突出性能、效率提升的具体性质，使用更高级的词汇。',
    replacements: [
      { word: '重构并优化了', translation: 'Refactored & Optimized' },
      { word: '成功重构了', translation: 'Successfully over-hauled' },
      { word: '大幅提效了', translation: 'Significantly streamlined' }
    ]
  }
];

export function ResumeChecker() {
  const {
    markdown,
    handleMarkdownChange: onUpdateMarkdown,
    isCheckerOpen: isOpen,
    setIsCheckerOpen,
    settings
  } = useResumeStore();

  const onClose = () => setIsCheckerOpen(false);
  const lang = settings.lang || 'zh';

  const [activeTab, setActiveTab] = useState<'diagnostics' | 'verbs'>('diagnostics');

  const isSpacingOptimized = useMemo(() => {
    return formatChineseEnglishSpacing(markdown) === markdown;
  }, [markdown]);

  const analysis = useMemo(() => {
    return analyzeResume(markdown, onUpdateMarkdown, lang);
  }, [markdown, onUpdateMarkdown, lang]);

  const scoreBadge = useMemo(() => {
    const isEn = lang === 'en';
    if (analysis.score >= 90) return { label: isEn ? 'Gold Resume' : '金牌简历', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'text-emerald-500' };
    if (analysis.score >= 75) return { label: isEn ? 'Good Resume' : '良好简历', color: 'bg-blue-50 text-blue-700 border-blue-200', text: 'text-blue-500' };
    return { label: isEn ? 'Needs Work' : '急需优化', color: 'bg-rose-50 text-rose-700 border-rose-200', text: 'text-rose-500' };
  }, [analysis.score, lang]);

  // Search weak words
  const matchedWeakWords = useMemo(() => {
    const results: { config: WeakWordConfig; count: number }[] = [];
    WEAK_WORDS_CONFIG.forEach(cfg => {
      let count = 0;
      if (cfg.isRegex) {
        const matches = markdown.match(cfg.pattern as RegExp);
        if (matches) {
          count = matches.length;
        }
      } else {
        let pos = markdown.indexOf(cfg.pattern as string);
        while (pos !== -1) {
          count++;
          pos = markdown.indexOf(cfg.pattern as string, pos + 1);
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
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="absolute top-0 right-0 h-full w-[355px] bg-white border-l border-slate-200/80 shadow-2xl z-40 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-blue-600 animate-pulse" />
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                {isEn ? 'Smart Diagnostic' : '智能诊断'}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-slate-200/60 rounded-md text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/50">
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'diagnostics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              {isEn ? 'Score & Advice' : '评分建议'}
            </button>
            <button
              onClick={() => setActiveTab('verbs')}
              className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'verbs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isEn ? 'Verb Optimization' : '用词优化'}</span>
              {matchedWeakWords.length > 0 && (
                <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-1 scale-90">
                  {matchedWeakWords.length}
                </span>
              )}
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'diagnostics' ? (
              <div className="space-y-8 animate-in fade-in duration-200">
                <ScoreDisplay analysis={analysis} scoreBadge={scoreBadge} lang={lang} />
                <DiagnosticList issues={analysis.issues} lang={lang} />
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3">
                  <span className="text-[11px] font-bold text-indigo-800 flex items-center gap-1 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isEn ? 'Action Verb Optimizer' : '专业用词优化'}</span>
                  </span>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    {isEn 
                      ? 'Using result-oriented STAR strong verbs instead of passive expressions can make your resume more powerful.'
                      : '推荐使用 STAR 法则强动词代替平淡口水词，显著增强简历说服力。'}
                  </p>
                </div>

                {matchedWeakWords.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-3.5">
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <Check className="w-6 h-6 text-emerald-500 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700">
                        {isEn ? 'No weak verbs detected!' : '未检测到弱词'}
                      </p>
                      <p className="text-[10px] text-slate-400 max-w-[240px] mx-auto leading-relaxed">
                        {isEn 
                          ? 'Your word choices are professional, concise, and result-oriented.'
                          : '您的用词专业干练，已避开常见平淡词汇。'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1 uppercase tracking-wider">
                      <span>
                        {isEn ? `Found ${matchedWeakWords.length} weak words` : `${matchedWeakWords.length} 处弱词`}
                      </span>
                      <span className="text-rose-500">
                        {isEn ? 'Replace Suggested ⚡' : '建议替换 ⚡'}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {matchedWeakWords.map(({ config, count }) => (
                        <div key={config.id} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-3 shadow-xs hover:border-slate-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                              <span className="line-through text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded font-mono border border-slate-200/40">{config.weakText}</span>
                              <span className="text-[9px] bg-red-50 text-red-600 border border-red-150/40 px-2 py-0.5 rounded-full font-bold">
                                {isEn ? `Found ${count} here` : `出现 ${count} 次`}
                              </span>
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-slate-500 leading-relaxed pl-0.5">
                            {getLocalizedDesc(config.id, config.desc)}
                          </p>
                          
                          <div className="space-y-2 pt-1 border-t border-slate-100/80">
                            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider pl-0.5">
                              {isEn ? 'Refactor to:' : '建议替换为：'}
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {config.replacements.map(rep => (
                                <button
                                  key={rep.word}
                                  onClick={() => handleReplace(config, rep.word)}
                                  className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-[10px] font-bold text-slate-700 hover:text-emerald-800 rounded-lg transition-all cursor-pointer shadow-xs active:scale-95 text-left flex flex-col justify-center gap-0.5"
                                >
                                  <span className="text-slate-800 font-bold">{rep.word}</span>
                                  {!isEn && (
                                    <span className="text-[9px] text-slate-400 font-normal truncate">{rep.translation}</span>
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
              </div>
            )}
          </div>

          {/* Action Button at the bottom of the panel */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-2">
            <button
              disabled={isSpacingOptimized}
              onClick={() => {
                if (isSpacingOptimized) return;
                const formatted = formatChineseEnglishSpacing(markdown);
                onUpdateMarkdown(formatted, true);
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isSpacingOptimized
                  ? 'bg-emerald-50 border border-emerald-200/60 text-emerald-700 cursor-default'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white shadow-md shadow-blue-500/10 cursor-pointer'
              }`}
            >
              {isSpacingOptimized ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
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
          <div className="p-4 bg-slate-50 border-t border-slate-200/80 text-center text-[10px] text-slate-400 font-medium">
            {isEn 
              ? '💡 Privacy Guarantee: All audits run in-browser safely.' 
              : '💡 诊断与优化均在本地运行，不泄露任何隐私'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
