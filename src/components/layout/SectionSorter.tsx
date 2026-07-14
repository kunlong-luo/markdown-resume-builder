import React, { useMemo, useState } from 'react';
import { ArrowUp, ArrowDown, Move, Info, GripVertical } from 'lucide-react';
import { splitMarkdownIntoSections, joinSectionsIntoMarkdown } from '../../lib/markdown-utils';

interface SectionSorterProps {
  markdown: string;
  onChange: (val: string, isUndoable?: boolean) => void;
  lang?: string;
}

export function SectionSorter({ markdown, onChange, lang }: SectionSorterProps) {
  const isEn = lang === 'en';
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

  const handleDragAndDrop = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const newSections = [...sections];
    const [removed] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, removed);
    onChange(joinSectionsIntoMarkdown(header, newSections), true);
  };

  // Helper to get nice background colors for different section types
  const getSectionTheme = (title: string) => {
    const t = title.trim().toLowerCase();
    if (t.includes('工作') || t.includes('实习') || t.includes('experience') || t.includes('work')) {
      return {
        border: 'border-blue-200/60 hover:border-blue-400/80',
        bg: 'bg-gradient-to-br from-white to-blue-50/30',
        dot: 'bg-gradient-to-r from-blue-400 to-blue-600',
        badge: isEn ? 'Work' : '工作经历'
      };
    }
    if (t.includes('教育') || t.includes('学校') || t.includes('education') || t.includes('academic')) {
      return {
        border: 'border-emerald-200/60 hover:border-emerald-400/80',
        bg: 'bg-gradient-to-br from-white to-emerald-50/30',
        dot: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
        badge: isEn ? 'Education' : '教育背景'
      };
    }
    if (t.includes('项目') || t.includes('产品') || t.includes('project')) {
      return {
        border: 'border-purple-200/60 hover:border-purple-400/80',
        bg: 'bg-gradient-to-br from-white to-purple-50/30',
        dot: 'bg-gradient-to-r from-purple-400 to-purple-600',
        badge: isEn ? 'Project' : '项目经历'
      };
    }
    if (t.includes('技能') || t.includes('评价') || t.includes('skill') || t.includes('award') || t.includes('honor')) {
      return {
        border: 'border-amber-200/60 hover:border-amber-400/80',
        bg: 'bg-gradient-to-br from-white to-amber-50/30',
        dot: 'bg-gradient-to-r from-amber-400 to-amber-600',
        badge: isEn ? 'Skills/Awards' : '专业技能/其他'
      };
    }
    return {
      border: 'border-slate-200 hover:border-slate-400/80',
      bg: 'bg-gradient-to-br from-white to-slate-50/40',
      dot: 'bg-gradient-to-r from-slate-400 to-slate-500',
      badge: isEn ? 'Section' : '常规模块'
    };
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Move className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span>{isEn ? 'Section Ordering' : '板块排序'}</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          {isEn
            ? 'Drag and drop blocks to reorder or use arrows. Changes sync in real-time.'
            : '支持鼠标直接拖拽板块排序，或使用方向键微调。所有编辑模式实时同步更新。'}
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

            const isDragging = draggedIndex === idx;
            const isDragOver = dragOverIndex === idx;

            return (
              <div
                key={idx}
                draggable
                onDragStart={(e) => {
                  setDraggedIndex(idx);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (draggedIndex !== idx) {
                    setDragOverIndex(idx);
                  }
                }}
                onDragLeave={() => {
                  if (dragOverIndex === idx) {
                    setDragOverIndex(null);
                  }
                }}
                onDragEnd={() => {
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedIndex !== null && draggedIndex !== idx) {
                    handleDragAndDrop(draggedIndex, idx);
                  }
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                className={`relative flex items-center justify-between p-4 pl-6 rounded-xl border select-none overflow-hidden transition-all duration-300 ease-out ${theme.bg} ${
                  isDragging 
                    ? 'opacity-30 scale-[0.97] border-dashed border-indigo-300 bg-indigo-50/5 shadow-[inset_0_2px_8px_rgba(15,23,42,0.05)]' 
                    : isDragOver
                    ? 'border-indigo-400 ring-4 ring-indigo-500/10 scale-[1.02] shadow-[0_20px_40px_-8px_rgba(99,102,241,0.18),0_4px_12px_rgba(99,102,241,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)]'
                    : `shadow-[0_4px_12px_rgba(15,23,42,0.03),0_1px_2px_rgba(15,23,42,0.02),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-1px_3px_rgba(15,23,42,0.02)] hover:-translate-y-1 hover:scale-[1.008] hover:shadow-[0_16px_32px_-4px_rgba(15,23,42,0.08),0_4px_8px_-2px_rgba(15,23,42,0.04),inset_0_2px_4px_rgba(255,255,255,0.95)] active:scale-[0.99] active:translate-y-0 active:shadow-[inset_0_2px_6px_rgba(15,23,42,0.06)] ${theme.border}`
                }`}
              >
                {/* Elegant left-most brand-colored strip */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${theme.dot}`} />

                <div className="flex items-center gap-3 min-w-0 flex-1 pr-4 cursor-grab active:cursor-grabbing">
                  {/* Grip controller icon */}
                  <GripVertical className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors shrink-0" />
                  
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

                {/* Arrow controllers for fallback/accessibility */}
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
        <div className="p-3 bg-indigo-50/40 border border-indigo-100/30 rounded-xl flex items-start gap-2 text-[11px] text-indigo-700">
          <Info className="w-3.5 h-3.5 shrink-0 text-indigo-500 mt-0.5" />
          <p className="leading-relaxed">
            {isEn
              ? 'Tip: You can drag sections by their grip handle or anywhere on the block cards to reorder them.'
              : '提示：你可以直接按住卡片左侧的拖拽手柄 ☰，或卡片任意位置进行拖拽排序。'}
          </p>
        </div>
      )}
    </div>
  );
}
