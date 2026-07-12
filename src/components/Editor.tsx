import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Edit3, Copy, RotateCcw, Check, Bold, Italic, Link, List, ListOrdered, Table, Minus, Heading1, Heading2, Code, Info, Scissors, Undo, Redo,
  Sparkles, Type, Layers, Award, Phone, GraduationCap, ChevronDown, Briefcase
} from 'lucide-react';
import { FormEditor } from './form/FormEditor';
import { ResumeSettings } from '../types';

import { formatChineseEnglishSpacing } from '../lib/format-utils';

function highlightInline(text: string): string {
  let parsed = text;

  // STAR bold patterns like **[Situation 业务背景]** or **[Task]**
  parsed = parsed.replace(/\*\*\[([^\]]+)\]\*\*/g, '<span class="text-blue-600 font-bold bg-blue-50/70">**[$1]**</span>');

  // Inline bold: **text** or __text__
  parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<span class="text-slate-900 font-bold">**$1**</span>');
  parsed = parsed.replace(/__([^_]+)__/g, '<span class="text-slate-900 font-bold">__$1__</span>');

  // Inline italic: *text* or _text_
  parsed = parsed.replace(/\*([^*]+)\*/g, '<span class="text-slate-500 italic">*$1*</span>');
  parsed = parsed.replace(/_([^_]+)_/g, '<span class="text-slate-500 italic">_$1_</span>');

  // Inline code: `code`
  parsed = parsed.replace(/`([^`]+)`/g, '<span class="text-rose-600 bg-rose-50 font-semibold">`$1`</span>');

  // Links: [text](url)
  parsed = parsed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="text-blue-500 font-medium underline">[$1]</span><span class="text-slate-400">($2)</span>');

  // Star ratings (e.g. ★★★★☆)
  parsed = parsed.replace(/([★☆]+)/g, '<span class="text-amber-500 font-bold">$1</span>');

  return parsed;
}

function highlightMarkdown(text: string): string {
  if (!text) return '&nbsp;';

  // 1. Escape HTML
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. Line by line processing
  const lines = html.split('\n');
  const highlightedLines = lines.map(line => {
    if (line.trim() === '') {
      return '';
    }

    // Headers
    if (line.startsWith('### ')) {
      return `<span class="text-indigo-600 font-bold">### ${highlightInline(line.substring(4))}</span>`;
    }
    if (line.startsWith('## ')) {
      return `<span class="text-blue-600 font-bold">## ${highlightInline(line.substring(3))}</span>`;
    }
    if (line.startsWith('# ')) {
      return `<span class="text-slate-900 font-extrabold"># ${highlightInline(line.substring(2))}</span>`;
    }

    // Blockquotes
    if (line.startsWith('&gt; ')) {
      return `<span class="text-slate-400 italic font-semibold">&gt; </span><span class="text-slate-500 italic">${highlightInline(line.substring(5))}</span>`;
    }

    // Bullet List Items
    if (line.startsWith('- ') || line.startsWith('* ')) {
      return `<span class="text-indigo-500 font-bold">${line.substring(0, 2)}</span>${highlightInline(line.substring(2))}`;
    }

    // Numbered List Items
    const numMatch = line.match(/^(\d+\.\s)/);
    if (numMatch) {
      const numPrefix = numMatch[1];
      return `<span class="text-indigo-500 font-bold">${numPrefix}</span>${highlightInline(line.substring(numPrefix.length))}`;
    }

    // Divider
    if (line.trim() === '---' || line.trim() === '***') {
      return `<span class="text-slate-400 bg-slate-100 font-semibold">${line}</span>`;
    }

    // Page Break
    if (line.includes('&lt;!-- pagebreak --&gt;')) {
      return line.replace(/&lt;!-- pagebreak --&gt;/g, '<span class="text-amber-600 bg-amber-50 font-semibold">&lt;!-- pagebreak --&gt;</span>');
    }

    return highlightInline(line);
  });

  return highlightedLines.join('\n');
}

interface EditorProps {
  value: string;
  onChange: (value: string, immediate?: boolean) => void;
  onReset: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  settings: ResumeSettings;
}

export function Editor({ value, onChange, onReset, onUndo, onRedo, canUndo = false, canRedo = false, settings }: EditorProps) {
  const [copied, setCopied] = useState(false);
  const [activeMode, setActiveMode] = useState<'markdown' | 'form'>('form');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  useEffect(() => {
    // Synchronize scroll on state changes or initial rendering
    const timer = setTimeout(() => {
      if (textareaRef.current && preRef.current) {
        preRef.current.scrollTop = textareaRef.current.scrollTop;
        preRef.current.scrollLeft = textareaRef.current.scrollLeft;
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [value, activeMode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    
    let replacement = syntax;
    if (start !== end) {
      const selected = text.substring(start, end);
      if (syntax.includes('text')) {
        replacement = syntax.replace('text', selected);
      } else {
        replacement = syntax + selected;
      }
    }
    
    onChange(before + replacement + after, true);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  const [spaced, setSpaced] = useState(false);
  const [isSnippetsDropdownOpen, setIsSnippetsDropdownOpen] = useState(false);

  const handleAutoSpacing = () => {
    const formatted = formatChineseEnglishSpacing(value);
    onChange(formatted, false);
    setSpaced(true);
    setTimeout(() => setSpaced(false), 1500);
  };

  const insertStarTemplate = () => {
    const starTemplate = `\n### **项目经历标题 (符合 STAR 原则描述)**\n- **[Situation 业务背景]**：面对...（描述背景，例如：原有支付网关在并发1W时延迟高、高频卡顿，导致核心下单率降低了15%）\n- **[Task 核心任务]**：作为重构技术负责人，我的目标是主导核心链路重构，将端到端支付耗时降低50%并支撑双十一大促\n- **[Action 关键行动]**：为了达成这一目标，我主导并实施了以下关键方案：\n  1. **架构重构**：使用 React Concurrent Features 与 Suspense 异步组件，大幅减少首屏体积 30% 并实现页面瞬时渲染\n  2. **高并发处理**：引入 Redis 集群缓存高频商品，并利用 Kafka 消息队列进行削峰填谷，彻底平抑了流量浪涌\n  3. **SQL性能优化**：针对全表扫描的查询建立联合索引，优化复杂多表 Join，实现慢查询占比降低 85%\n- **[Result 实际产出]**：项目上线后，首屏耗时由 2.5s 骤降至 0.7s，下单成功率由 83% 提升至 99.8%，完美承载双十一大促且零线上故障\n`;
    
    insertMarkdown(starTemplate);
  };

  // Stats calculation and markdown highlighting memoization
  const charCount = useMemo(() => value.length, [value]);
  const wordCount = useMemo(() => value.trim() === '' ? 0 : value.trim().split(/\s+/).length, [value]);
  const lineCount = useMemo(() => value.split('\n').length, [value]);
  // Estimate page logic (around 2200 characters usually fits standard 1 A4 page)
  const estPages = useMemo(() => Math.max(1, Math.ceil(charCount / 2400)), [charCount]);
  const highlightedHtml = useMemo(() => highlightMarkdown(value) + '\n', [value]);

  return (
    <div className="flex flex-col h-full bg-[#fdfdfd] border-r border-gray-200 shadow-[inset_-4px_0_12px_rgb(0,0,0,0.02)] min-w-0 overflow-hidden">
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-2.5 bg-white border-b border-gray-200 gap-3 relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
        
        {/* Toggle Mode Segmented Control */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
          <button
            onClick={() => setActiveMode('form')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer ${
              activeMode === 'form'
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/10'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{settings.lang === 'en' ? 'Visual Form Editor' : '可视化表单编辑'}</span>
          </button>
          <button
            onClick={() => setActiveMode('markdown')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer ${
              activeMode === 'markdown'
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/10'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{settings.lang === 'en' ? 'Markdown Editor' : 'Markdown 编辑'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {onUndo && (
            <button 
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-1.5 rounded transition-colors ${canUndo ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
              title={settings.lang === 'en' ? 'Undo (Ctrl+Z)' : '撤销 (Ctrl+Z)'}
            >
              <Undo className="w-3.5 h-3.5" />
            </button>
          )}
          {onRedo && (
            <button 
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-1.5 rounded transition-colors ${canRedo ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
              title={settings.lang === 'en' ? 'Redo (Ctrl+Y)' : '重做 (Ctrl+Y)'}
            >
              <Redo className="w-3.5 h-3.5" />
            </button>
          )}
          {(onUndo || onRedo) && <div className="w-px h-4 bg-gray-200 mx-1"></div>}
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? (settings.lang === 'en' ? 'Copied!' : '已复制！') : (settings.lang === 'en' ? 'Copy All' : '复制全文')}
          </button>
          <div className="w-px h-4 bg-gray-200 mx-1"></div>
          <button 
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title={settings.lang === 'en' ? 'Reset to Default Template' : '重置为默认模板'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {settings.lang === 'en' ? 'Reset' : '重置'}
          </button>
        </div>
      </div>

      {activeMode === 'markdown' ? (
        <>
          {/* Formatting Help Toolbar */}
          <div className="flex items-center flex-wrap gap-1 px-4 py-1.5 bg-gray-50/70 border-b border-gray-100">
            <button
              onClick={() => insertMarkdown('# text')}
              className="p-1.5 hover:bg-gray-200/60 text-gray-600 hover:text-gray-900 rounded transition-colors"
              title="Heading 1"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('## text')}
              className="p-1.5 hover:bg-gray-200/60 text-gray-600 hover:text-gray-900 rounded transition-colors"
              title="Section Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3.5 bg-gray-200 mx-1"></div>
            <button
              onClick={() => insertMarkdown('**text**')}
              className="p-1.5 hover:bg-gray-200/60 text-gray-600 hover:text-gray-900 rounded transition-colors"
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('*text*')}
              className="p-1.5 hover:bg-gray-200/60 text-gray-600 hover:text-gray-900 rounded transition-colors"
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('`text`')}
              className="p-1.5 hover:bg-gray-200/60 text-gray-600 hover:text-gray-900 rounded transition-colors"
              title="Code"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3.5 bg-gray-200 mx-1"></div>
            <button
              onClick={() => insertMarkdown('- text')}
              className="p-1.5 hover:bg-gray-200/60 text-gray-600 hover:text-gray-900 rounded transition-colors"
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('1. text')}
              className="p-1.5 hover:bg-gray-200/60 text-gray-600 hover:text-gray-900 rounded transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('[link](url)')}
              className="p-1.5 hover:bg-gray-200/60 text-gray-600 hover:text-gray-900 rounded transition-colors"
              title="Link"
            >
              <Link className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('\n---\n')}
              className="p-1.5 hover:bg-gray-200/60 text-gray-600 hover:text-gray-900 rounded transition-colors"
              title="Divider Line"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('\n<!-- pagebreak -->\n')}
              className="p-1.5 hover:bg-gray-200/60 text-gray-600 hover:text-gray-900 rounded transition-colors"
              title="Insert Page Break (插入打印分页符)"
            >
              <Scissors className="w-3.5 h-3.5 text-amber-600" />
            </button>
            <button
              onClick={() => insertMarkdown('\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Item 1   | Item 2   |\n')}
              className="p-1.5 hover:bg-gray-200/60 text-gray-600 hover:text-gray-900 rounded transition-colors"
              title="Table"
            >
              <Table className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-3.5 bg-gray-200 mx-1.5"></div>

            {/* Quick Snippets Inserter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSnippetsDropdownOpen(!isSnippetsDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 hover:text-indigo-800 rounded border border-blue-200/50 text-[11px] font-semibold transition-all shadow-sm cursor-pointer ml-1 active:scale-95"
                title={settings.lang === 'en' ? 'Insert common resume templates at cursor' : '一键在光标处插入常用简历排版模块'}
              >
                <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{settings.lang === 'en' ? 'Insert Snippets' : '插入常用模块'}</span>
                <ChevronDown className={`w-3 h-3 text-blue-500 transition-transform ${isSnippetsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSnippetsDropdownOpen && (
                <>
                  {/* Overlay background to dismiss */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsSnippetsDropdownOpen(false)}
                  />
                  {/* Dropdown Items list */}
                  <div className="absolute left-1 mt-1 w-56 bg-white border border-gray-200 shadow-xl rounded-lg py-1.5 z-50 flex flex-col animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 mb-1">
                      {settings.lang === 'en' ? 'Select Snippet to Insert' : '选择常用模块插入'}
                    </div>
                    
                    {/* 1. Work Experience */}
                    <button
                      onClick={() => {
                        const snippet = settings.lang === 'en'
                          ? `\n### **Company Name | Position / Role | 2023.06 - Present**\n- **Core Responsibility**: Directed/Led... (Describe major tasks, e.g. key system design and full-stack development)\n- **Business Impact**: Spearheaded... (e.g. Completed performance overhaul, reducing latency by 50% and doubling peak throughput)\n- **Team & Collaboration**: Mentored 3 junior engineers and established continuous integration guidelines to accelerate release velocity by 30%.\n`
                          : `\n### **公司名称 ｜ 岗位名称 ｜ 2023.06 - 至今**\n- **核心职责**：主导/负责...（描述主要工作，如：核心系统的架构设计与研发）\n- **业务产出**：主导了...（例如：完成了全链路性能重构，首屏耗时降低 50%，核心 QPS 支持翻倍）\n- **团队协作**：指导...（例如：指导 3 位初级工程师，制定 CI/CD 规范，缩短版本发布周期 30%）\n`;
                        insertMarkdown(snippet);
                        setIsSnippetsDropdownOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer text-left font-medium"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                      <span>{settings.lang === 'en' ? 'Work Experience' : '工作经历模板'}</span>
                    </button>

                    {/* 2. STAR Project */}
                    <button
                      onClick={() => {
                        const snippet = settings.lang === 'en'
                          ? `\n### **Project Name | Role | 2024.10 - 2025.02**\n- **[Situation]**: Faced with severe latency spikes (averaging 3.5s) and slow queries during high traffic events, resulting in a 10% drop in user conversion rate.\n- **[Task]**: As Lead Engineer, tasked to refactor database performance and system architecture to reduce average latency below 500ms.\n- **[Action]**: Designed and implemented the following initiatives:\n  1. **Database Tuning**: Engineered composite indexes and optimized SQL joins to reduce slow query logs by 90%.\n  2. **Concurrency Control**: Implemented Redis cache clusters and Kafka message brokers for reliable request throttling.\n- **[Result]**: Reduced response time to 500ms, achieved 100% service uptime during high-concurrency events, and increased checkout conversion by 12%.\n`
                          : `\n### **项目名称 ｜ 角色名称 ｜ 2024.10 - 2025.02**\n- **[Situation 业务背景]**：面对...（例如：原有系统在 QPS 万级时存在慢查询和高延迟问题，导致成单率降低了 10%）\n- **[Task 核心任务]**：作为重构负责人，主导数据库性能调优与架构演进，在 3 个月内将响应耗时控制在 500ms 内\n- **[Action 关键行动]**：为了达成目标，实施了以下方案：\n  1. **数据库优化**：针对全表扫描慢查询建立复合索引，重写 Join 逻辑，使慢 SQL 占比降低 90%\n  2. **并发削峰**：引入 Redis 热点缓存与 Kafka 消息队列，完美支撑双十一 QPS 高峰\n- **[Result 实际产出]**：项目上线后，首屏响应由 3.5s 缩短至 0.5s，单点服务稳定度 100%，成单率增加 12%\n`;
                        insertMarkdown(snippet);
                        setIsSnippetsDropdownOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer text-left font-medium"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{settings.lang === 'en' ? 'Project Experience (STAR)' : '项目经历模板 (STAR)'}</span>
                    </button>

                    {/* 3. Skill bar progress indicators */}
                    <button
                      onClick={() => {
                        const snippet = settings.lang === 'en'
                          ? `\n- **Frontend Core**: React / Vue.js | Expert ★★★★★\n- **Backend/Full-stack**: Node.js / Go | Proficient ★★★★☆\n- **AI & LLM**: RAG / Agent Development | Proficient ★★★★☆\n- **DevOps & Tooling**: Webpack / Vite / Docker | Familiar ★★★☆☆\n`
                          : `\n- **前端核心**：React / Vue.js ｜ 精通 ★★★★★\n- **后端/全栈**：Node.js / Go ｜ 熟练 ★★★★☆\n- **大模型应用**：RAG / Agent 开发 ｜ 熟练 ★★★★☆\n- **工具与工程**：Webpack / Vite / Docker ｜ 熟悉 ★★★☆☆\n`;
                        insertMarkdown(snippet);
                        setIsSnippetsDropdownOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer text-left font-medium"
                    >
                      <Award className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{settings.lang === 'en' ? 'Skills & Ratings' : '技能掌握度 (带星级)'}</span>
                    </button>

                    {/* 4. Multi-column Contacts */}
                    <button
                      onClick={() => {
                        const snippet = settings.lang === 'en'
                          ? `\n# Your Name\nPosition: Senior Software Engineer | 5 Years Experience | San Francisco, CA\n+1 (555) 019-2834 | your.email@email.com | github.com/yourusername | linkedin.com/in/yourprofile\n`
                          : `\n# 姓名\n意向岗位：高级前端工程师 ｜ 5年工作经验 ｜ 深圳\n13812345678 ｜ your.email@email.com ｜ github.com/yourgithub\n`;
                        insertMarkdown(snippet);
                        setIsSnippetsDropdownOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer text-left font-medium"
                    >
                      <Phone className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{settings.lang === 'en' ? 'Contact Info Header' : '个人联系方式栏'}</span>
                    </button>

                    {/* 5. Education experiences */}
                    <button
                      onClick={() => {
                        const snippet = settings.lang === 'en'
                          ? `\n### **University Name | B.S. in Computer Science | 2016.09 - 2020.06**\n- **Academic Performance**: GPA 3.8/4.0 (Top 5%), received National Scholarship for Academic Excellence.\n- **Campus Leadership**: Served as CS Club President, organizing 2 campus-wide hackathons.\n`
                          : `\n### **学校名称 ｜ 专业名称 (本科) ｜ 2016.09 - 2020.06**\n- **学术成绩**：GPA 3.8/4.0 (专业前 5%)，连续 2 年获得国家励志奖学金\n- **校园经历**：曾担任学校计算机社团团长，主导举办了 2 次校级编程挑战赛\n`;
                        insertMarkdown(snippet);
                        setIsSnippetsDropdownOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer text-left font-medium"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
                      <span>{settings.lang === 'en' ? 'Education Background' : '教育背景模板'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Auto Spacing button */}
            <button
              onClick={handleAutoSpacing}
              className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-semibold transition-all shadow-sm cursor-pointer ml-1 active:scale-95 ${
                spaced 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 border-indigo-200/50'
              }`}
              title={settings.lang === 'en' ? 'One-click to insert standard spaces between Chinese, English and numbers to enhance spacing aesthetics' : '一键在中文与英文、数字之间添加标准空格，提升排版细节专业度'}
            >
              <Type className="w-3 h-3 shrink-0" />
              <span>{spaced ? (settings.lang === 'en' ? 'Optimized!' : '已优化！') : (settings.lang === 'en' ? 'Format Spacing' : '中英混排优化')}</span>
            </button>
          </div>

          {/* Main Textarea with Highlighted Overlay */}
          <div className="relative flex-1 w-full overflow-hidden bg-white border-t border-gray-100">
            {/* Syntax Highlighted Layer (behind the transparent textarea) */}
            <pre
              ref={preRef}
              className="absolute inset-0 w-full h-full editor-font-base editor-pre text-slate-800"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              aria-hidden="true"
            />
            {/* Transparent Textarea on top */}
            <textarea
              id="markdown-textarea"
              ref={textareaRef}
              className="absolute inset-0 w-full h-full editor-font-base editor-textarea text-transparent focus:outline-none focus:ring-0 selection:bg-blue-100/60"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onScroll={handleScroll}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                  if (e.shiftKey) {
                    if (onRedo && canRedo) {
                      e.preventDefault();
                      onRedo();
                    }
                  } else {
                    if (onUndo && canUndo) {
                      e.preventDefault();
                      onUndo();
                    }
                  }
                }
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
                  if (onRedo && canRedo) {
                    e.preventDefault();
                    onRedo();
                  }
                }
              }}
              placeholder="Type your resume in Markdown here..."
              spellCheck="false"
            />
          </div>
        </>
      ) : (
        <FormEditor value={value} onChange={onChange} settings={settings} />
      )}

      {/* Status Bar */}
      <div className="flex items-center justify-between px-5 py-2 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 font-medium z-10">
        <div className="flex items-center gap-4">
          <span>{settings.lang === 'en' ? 'Words' : '总字数'}: <strong className="text-gray-700">{wordCount}</strong></span>
          <span>{settings.lang === 'en' ? 'Chars' : '字符数'}: <strong className="text-gray-700">{charCount}</strong></span>
          <span>{settings.lang === 'en' ? 'Lines' : '行数'}: <strong className="text-gray-700">{lineCount}</strong></span>
        </div>
        <div className="flex items-center gap-3 text-blue-600">
          <div className="hidden md:flex items-center gap-1 text-gray-400 cursor-help" title={settings.lang === 'en' ? "Click the scissors icon in toolbar to insert <!-- pagebreak --> where you want to force page partition" : "在需要强制分页的地方点击剪刀按钮插入 <!-- pagebreak -->"}>
            <Info className="w-3 h-3" />
            <span>{settings.lang === 'en' ? 'Supports <!-- pagebreak --> force paging' : '支持 <!-- pagebreak --> 强制分页'}</span>
          </div>
          <div className="w-px h-3 bg-gray-200 hidden md:block"></div>
          <div className="flex items-center gap-1.5">
            <span>{settings.lang === 'en' ? 'Est. A4 Pages' : '预估 A4 页数'}: <strong className="font-bold">{estPages}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
