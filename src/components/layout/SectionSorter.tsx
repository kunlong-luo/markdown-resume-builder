import React, { useMemo, useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Move, Info, GripVertical, CheckCircle2 } from 'lucide-react';
import { Reorder, motion } from 'motion/react';
import { splitMarkdownIntoSections, joinSectionsIntoMarkdown, MarkdownSection } from '../../lib/markdown-utils';

interface SectionSorterProps {
  markdown: string;
  onChange: (val: string, isUndoable?: boolean) => void;
  lang?: string;
}

interface SorterItem extends MarkdownSection {
  id: string;
}

export function SectionSorter({ markdown, onChange, lang }: SectionSorterProps) {
  const isEn = lang === 'en';

  const { header, sections } = useMemo(() => {
    return splitMarkdownIntoSections(markdown);
  }, [markdown]);

  // Maintain stable IDs across renders for Reorder.Group
  const [items, setItems] = useState<SorterItem[]>([]);

  useEffect(() => {
    setItems((prevItems) => {
      // Map existing items or generate stable keys based on title and content snippet
      return sections.map((sec, idx) => {
        const existing = prevItems.find((p) => p.title === sec.title && p.content === sec.content);
        return {
          id: existing ? existing.id : `sec_${idx}_${sec.title.replace(/\s+/g, '_')}`,
          title: sec.title,
          content: sec.content
        };
      });
    });
  }, [sections]);

  const handleReorder = (newItems: SorterItem[]) => {
    setItems(newItems);
    const newMarkdown = joinSectionsIntoMarkdown(
      header,
      newItems.map((item) => ({ title: item.title, content: item.content }))
    );
    onChange(newMarkdown, true);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    handleReorder(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    handleReorder(newItems);
  };

  // Helper to get nice background colors for different section types
  const getSectionTheme = (title: string) => {
    const t = title.trim().toLowerCase();
    if (t.includes('工作') || t.includes('实习') || t.includes('experience') || t.includes('work')) {
      return {
        border: 'border-blue-200/70 dark:border-blue-800/60',
        bg: 'bg-white dark:bg-slate-850',
        badgeBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60',
        dot: 'bg-blue-600 dark:bg-blue-500',
        badge: isEn ? 'Work' : '工作经历'
      };
    }
    if (t.includes('教育') || t.includes('学校') || t.includes('education') || t.includes('academic')) {
      return {
        border: 'border-emerald-200/70 dark:border-emerald-800/60',
        bg: 'bg-white dark:bg-slate-850',
        badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60',
        dot: 'bg-emerald-600 dark:bg-emerald-500',
        badge: isEn ? 'Education' : '教育背景'
      };
    }
    if (t.includes('项目') || t.includes('产品') || t.includes('project')) {
      return {
        border: 'border-purple-200/70 dark:border-purple-800/60',
        bg: 'bg-white dark:bg-slate-850',
        badgeBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/60',
        dot: 'bg-purple-600 dark:bg-purple-500',
        badge: isEn ? 'Project' : '项目经历'
      };
    }
    if (t.includes('技能') || t.includes('评价') || t.includes('skill') || t.includes('award') || t.includes('honor')) {
      return {
        border: 'border-amber-200/70 dark:border-amber-800/60',
        bg: 'bg-white dark:bg-slate-850',
        badgeBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60',
        dot: 'bg-amber-600 dark:bg-amber-500',
        badge: isEn ? 'Skills/Awards' : '专业技能/其他'
      };
    }
    return {
      border: 'border-slate-200 dark:border-slate-750',
      bg: 'bg-white dark:bg-slate-850',
      badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      dot: 'bg-indigo-600 dark:bg-indigo-500',
      badge: isEn ? 'Section' : '常规模块'
    };
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/40 dark:bg-slate-900/60 select-none">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-0.5">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Move className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{isEn ? 'Section Smooth Reordering' : '板块平滑拖拽排序'}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800">
              Motion
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isEn
              ? 'Grab any card or handle to smoothly reorder sections. Changes sync in real-time.'
              : '按住手柄或卡片即可平滑拖拽调整板块上下顺序，右侧预览实时重绘。'}
          </p>
        </div>

        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shrink-0">
          {items.length} {isEn ? 'Sections' : '个板块'}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center gap-2">
          <Info className="w-8 h-8 text-slate-300 dark:text-slate-600 stroke-[1.5]" />
          <p className="text-xs">
            {isEn ? 'No primary sections (H2 ## headings) detected' : '未检测到主要的简历板块（以 ## 开头的二级标题）'}
          </p>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={handleReorder}
          className="space-y-2.5 list-none p-0 m-0"
        >
          {items.map((item, idx) => {
            const theme = getSectionTheme(item.title);
            const contentPreview = item.content
              .replace(/^##\s+.*/, '')
              .replace(/[#*`\-\n\s]+/g, ' ')
              .substring(0, 90);

            return (
              <Reorder.Item
                key={item.id}
                value={item}
                whileDrag={{
                  scale: 1.02,
                  zIndex: 50,
                  boxShadow: '0 20px 25px -5px rgba(79, 70, 229, 0.2), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
                  cursor: 'grabbing'
                }}
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 30
                }}
                className={`group relative flex items-center justify-between p-3 sm:p-3.5 pl-4 sm:pl-5 rounded-xl border select-none transition-colors duration-150 cursor-grab active:cursor-grabbing ${theme.bg} ${theme.border} hover:border-indigo-300 dark:hover:border-indigo-600 shadow-xs hover:shadow-md`}
              >
                {/* Left Colored Accent Strip */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 ${theme.dot} rounded-l-xl`} />

                <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                  {/* Grip controller icon with tactile hover */}
                  <div className="flex items-center justify-center w-6 h-6 rounded-md text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50 transition-colors shrink-0">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Section index number */}
                  <div className="w-5 text-[11px] font-black text-slate-400 dark:text-slate-500 shrink-0 tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">
                        {item.title}
                      </span>
                      <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-bold border ${theme.badgeBg}`}>
                        {theme.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-400 truncate font-medium">
                      {contentPreview || (isEn ? '(Empty section content)' : '(板块内容暂空)')}
                    </p>
                  </div>
                </div>

                {/* Arrow controllers for accessibility and fallback */}
                <div 
                  className="flex items-center gap-1 shrink-0"
                  onPointerDown={(e) => e.stopPropagation()} // Prevent drag start when clicking buttons
                >
                  <button
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveUp(idx);
                    }}
                    className={`p-1 sm:p-1.5 rounded-lg border transition-all ${
                      idx === 0
                        ? 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-850 cursor-not-allowed'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/40 cursor-pointer active:scale-95'
                    }`}
                    title={isEn ? 'Move up' : '上移板块'}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === items.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveDown(idx);
                    }}
                    className={`p-1 sm:p-1.5 rounded-lg border transition-all ${
                      idx === items.length - 1
                        ? 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-850 cursor-not-allowed'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/40 cursor-pointer active:scale-95'
                    }`}
                    title={isEn ? 'Move down' : '下移板块'}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}

      {items.length > 0 && (
        <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-xl flex items-start gap-2.5 text-[11px] text-indigo-700 dark:text-indigo-300">
          <Info className="w-3.5 h-3.5 shrink-0 text-indigo-500 dark:text-indigo-400 mt-0.5" />
          <p className="leading-relaxed">
            {isEn
              ? 'Powered by Motion: Smooth spring physics with automatic layout animation. Click or drag handles freely.'
              : '底层采用 Motion 物理弹簧引擎，拖拽时其他板块平滑避让，松手自动归位，所有编辑模式即时同步。'}
          </p>
        </div>
      )}
    </div>
  );
}

