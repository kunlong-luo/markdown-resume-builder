import React, { useMemo } from 'react';
import { ArrowUp, ArrowDown, Move, Info } from 'lucide-react';
import { splitMarkdownIntoSections, joinSectionsIntoMarkdown } from '../../lib/markdown-utils';

interface SectionSorterProps {
  markdown: string;
  onChange: (val: string, isUndoable?: boolean) => void;
  lang?: string;
}

export function SectionSorter({ markdown, onChange, lang }: SectionSorterProps) {
  const isEn = lang === 'en';

  const { header, sections } = useMemo(() => {
    return splitMarkdownIntoSections(markdown);
  }, [markdown]);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;
    onChange(joinSectionsIntoMarkdown(header, newSections), true);
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;
    onChange(joinSectionsIntoMarkdown(header, newSections), true);
  };

  // Helper to get nice background colors for different section types
  const getSectionTheme = (title: string) => {
    const t = title.trim().toLowerCase();
    if (t.includes('工作') || t.includes('实习') || t.includes('experience') || t.includes('work')) {
      return {
        border: 'border-blue-200 hover:border-blue-400 bg-blue-50/20',
        dot: 'bg-blue-500',
        badge: isEn ? 'Work' : '工作经历'
      };
    }
    if (t.includes('教育') || t.includes('学校') || t.includes('education') || t.includes('academic')) {
      return {
        border: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/20',
        dot: 'bg-emerald-500',
        badge: isEn ? 'Education' : '教育背景'
      };
    }
    if (t.includes('项目') || t.includes('产品') || t.includes('project')) {
      return {
        border: 'border-purple-200 hover:border-purple-400 bg-purple-50/20',
        dot: 'bg-purple-500',
        badge: isEn ? 'Project' : '项目经历'
      };
    }
    if (t.includes('技能') || t.includes('评价') || t.includes('skill') || t.includes('award') || t.includes('honor')) {
      return {
        border: 'border-amber-200 hover:border-amber-400 bg-amber-50/20',
        dot: 'bg-amber-500',
        badge: isEn ? 'Skills/Awards' : '专业技能/其他'
      };
    }
    return {
      border: 'border-slate-200 hover:border-slate-400 bg-slate-50/20',
      dot: 'bg-slate-400',
      badge: isEn ? 'Section' : '常规模块'
    };
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Move className="w-4 h-4 text-indigo-600" />
          <span>{isEn ? 'Section Layout Precision Sorter' : '板块位置一键排序'}</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          {isEn
            ? 'Adjust the vertical reading order of major sections (such as Education, Experience, Projects) instantly. Changes synchronize in real-time with Form, Markdown, and PDF layouts.'
            : '自由、极速调整「工作经历」、「教育背景」、「项目经历」等大板块在简历中的垂直排版顺序。调整后将实时反映到可视化表单、Markdown 源码与 PDF 预览中。'}
        </p>
      </div>

      {sections.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <Info className="w-8 h-8 text-slate-300 stroke-[1.5]" />
          <p className="text-xs">
            {isEn ? 'No primary sections (H2 ## headings) detected' : '未检测到主要的简历板块（以 ## 开头的二级标题）'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section, idx) => {
            const theme = getSectionTheme(section.title);
            const contentPreview = section.content
              .replace(/^##\s+.*/, '') // remove section title
              .replace(/[#*`\-\n\s]+/g, ' ') // remove syntax
              .substring(0, 100);

            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-4 rounded-xl border bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 ${theme.border}`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${theme.dot} shrink-0`} />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-800 text-sm">
                        {section.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-slate-100 text-slate-600">
                        {theme.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate font-medium">
                      {contentPreview || (isEn ? '(Empty content)' : '(内容暂未填写)')}
                    </p>
                  </div>
                </div>

                {/* Arrow controllers */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveUp(idx)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      idx === 0
                        ? 'border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed'
                        : 'border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 cursor-pointer active:scale-95'
                    }`}
                    title={isEn ? 'Move up' : '上移板块'}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={idx === sections.length - 1}
                    onClick={() => handleMoveDown(idx)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      idx === sections.length - 1
                        ? 'border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed'
                        : 'border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 cursor-pointer active:scale-95'
                    }`}
                    title={isEn ? 'Move down' : '下移板块'}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {sections.length > 0 && (
        <div className="p-3.5 bg-indigo-50/40 border border-indigo-100/50 rounded-xl flex items-start gap-2.5 text-[11px] text-indigo-700 font-medium">
          <Info className="w-4 h-4 shrink-0 text-indigo-500 mt-0.5" />
          <p className="leading-relaxed">
            {isEn
              ? 'Pro-tip: If you want to rename or add a custom section, you can switch back to "Visual Form Editor" or "Markdown Editor". This helper specifically handles block-level order optimizations.'
              : '贴心提示：如需重命名或新增自定义模块，可以直接切换到「表单编辑」或「Markdown 编辑」。本面板专门用于进行高级的模块级阅读顺序调优。'}
          </p>
        </div>
      )}
    </div>
  );
}
