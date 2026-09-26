
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, LayoutGrid, Sparkles, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { TEMPLATES } from '../../data';
import { useConfirm } from '../../context/ConfirmContext';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import { getTemplatePresentation, getTemplatePreview } from '../../lib/template-presentation';
import { useResumeStore } from '../../store/useResumeStore';

interface TemplateCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function MiniResumePreview({ content, compact = false }: { content: string; compact?: boolean }) {
  const preview = getTemplatePreview(content);

  return (
    <div
      className={
        compact
          ? 'aspect-[210/297] w-full overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-sm'
          : 'aspect-[210/297] w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm'
      }
      aria-hidden="true"
    >
      <div className={compact ? 'truncate text-[7px] font-black text-slate-900' : 'truncate text-[11px] font-black text-slate-900'}>
        {preview.name}
      </div>
      {preview.subtitle && (
        <div className={compact ? 'mt-0.5 truncate text-[4.5px] text-slate-500' : 'mt-1 truncate text-[7px] text-slate-500'}>
          {preview.subtitle}
        </div>
      )}

      <div className={compact ? 'mt-2 space-y-2' : 'mt-4 space-y-4'}>
        {preview.sections.map((section, index) => (
          <div key={section}>
            <div className="flex items-center gap-1">
              <span className={compact ? 'whitespace-nowrap text-[4.5px] font-bold text-indigo-700' : 'whitespace-nowrap text-[7px] font-bold text-indigo-700'}>
                {section}
              </span>
              <span className="h-px flex-1 bg-indigo-100" />
            </div>
            <div
              className={compact ? 'mt-1 h-1 rounded-full bg-slate-100' : 'mt-1.5 h-1.5 rounded-full bg-slate-100'}
              style={{ width: index % 2 === 0 ? '92%' : '76%' }}
            />
            <div
              className={compact ? 'mt-0.5 h-1 rounded-full bg-slate-100' : 'mt-1 h-1.5 rounded-full bg-slate-100'}
              style={{ width: index % 2 === 0 ? '68%' : '88%' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TemplateCenterModal({ isOpen, onClose }: TemplateCenterModalProps) {
  const {
    markdown,
    settings,
    currentTemplateId,
    setCurrentTemplateId,
    handleMarkdownChange,
  } = useResumeStore();
  const { confirm } = useConfirm();
  const dialogRef = useRef<HTMLDivElement>(null);
  const isEn = settings.lang === 'en';

  useDialogFocus({ isOpen, dialogRef, onClose });

  const [selectedId, setSelectedId] = useState('ai_backend');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    if (!isOpen) return;
    const fallbackId = isEn ? 'english' : 'ai_backend';
    setSelectedId(
      TEMPLATES.some((template) => template.id === currentTemplateId)
        ? currentTemplateId
        : fallbackId,
    );
    setActiveCategory('all');
  }, [currentTemplateId, isEn, isOpen]);

  const localizedTemplates = useMemo(
    () =>
      TEMPLATES.map((template) => ({
        template,
        presentation: getTemplatePresentation(template, isEn ? 'en' : 'zh'),
      })),
    [isEn],
  );

  const categories = useMemo(
    () => Array.from(new Set(localizedTemplates.map((item) => item.presentation.category))),
    [localizedTemplates],
  );

  const visibleTemplates =
    activeCategory === 'all'
      ? localizedTemplates
      : localizedTemplates.filter((item) => item.presentation.category === activeCategory);

  const selectedTemplate =
    TEMPLATES.find((template) => template.id === selectedId) ?? TEMPLATES[0];

  if (!isOpen || !selectedTemplate || typeof document === 'undefined') return null;

  const selectedPresentation = getTemplatePresentation(
    selectedTemplate,
    isEn ? 'en' : 'zh',
  );
  const selectedPreview = getTemplatePreview(selectedTemplate.content);
  const isExactCurrent =
    currentTemplateId === selectedTemplate.id && markdown === selectedTemplate.content;

  const handleApply = async () => {
    if (isExactCurrent) return;

    const confirmed = await confirm({
      title: isEn ? 'Apply this template?' : '应用这个模板？',
      message: isEn
        ? 'Applying "' + selectedPresentation.name + '" will replace the content of your active resume. You can still undo after applying.'
        : '应用「' + selectedPresentation.name + '」会替换当前活动简历的内容。应用后仍可使用撤销恢复。',
      confirmText: isEn ? 'Apply template' : '应用模板',
      cancelText: isEn ? 'Cancel' : '取消',
      type: 'warning',
    });

    if (!confirmed) return;

    setCurrentTemplateId(selectedTemplate.id);
    handleMarkdownChange(selectedTemplate.content, true);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-3 sm:p-5">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-slate-950/65 backdrop-blur-sm"
        onClick={onClose}
        aria-label={isEn ? 'Close template center' : '关闭模板中心'}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-center-title"
        aria-describedby="template-center-description"
        tabIndex={-1}
        className="relative z-10 flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
          <div>
            <div className="mb-1 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <LayoutGrid className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                {isEn ? 'Template Library' : '模板库'}
              </span>
            </div>
            <h2 id="template-center-title" className="text-lg font-black text-slate-950 dark:text-white">
              {isEn ? 'Choose a resume template' : '选择简历模板'}
            </h2>
            <p id="template-center-description" className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {isEn
                ? 'Browse and preview first. Your resume changes only after you apply a template.'
                : '先浏览和预览模板；只有明确点击应用后，当前简历内容才会改变。'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? 'Close template center' : '关闭模板中心'}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-slate-100 px-5 py-3 dark:border-slate-800 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              aria-pressed={activeCategory === 'all'}
              className={
                'shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold transition ' +
                (activeCategory === 'all'
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-200 text-slate-600 hover:border-indigo-300 dark:border-slate-700 dark:text-slate-300')
              }
            >
              {isEn ? 'All' : '全部'}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={
                  'shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold transition ' +
                  (activeCategory === category
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-200 text-slate-600 hover:border-indigo-300 dark:border-slate-700 dark:text-slate-300')
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="min-h-0 overflow-y-auto border-b border-slate-200 p-4 dark:border-slate-800 sm:p-5 lg:border-b-0 lg:border-r">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {visibleTemplates.map(({ template, presentation }) => {
                const selected = template.id === selectedId;
                const exactCurrent =
                  currentTemplateId === template.id && markdown === template.content;

                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedId(template.id)}
                    aria-pressed={selected}
                    aria-label={presentation.name}
                    className={
                      'group rounded-2xl border p-2.5 text-left transition ' +
                      (selected
                        ? 'border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-500/10 dark:bg-indigo-950/30'
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900')
                    }
                  >
                    <MiniResumePreview content={template.content} compact />
                    <div className="mt-2.5 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-[11px] font-black text-slate-800 dark:text-slate-100">
                          {presentation.name}
                        </div>
                        <div className="mt-0.5 truncate text-[9px] font-semibold text-slate-400">
                          {presentation.category}
                        </div>
                      </div>
                      {exactCurrent && (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto bg-slate-50/80 p-5 dark:bg-slate-950/35 sm:p-6">
            <div className="mx-auto max-w-sm">
              <MiniResumePreview content={selectedTemplate.content} />
              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {selectedPresentation.category}
                  </span>
                  <span className="rounded-full bg-slate-200/70 px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {selectedPresentation.language}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-black text-slate-950 dark:text-white">
                  {selectedPresentation.name}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {selectedPresentation.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedPresentation.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                    {isEn ? 'Preview structure' : '内容结构预览'}
                  </div>
                  <div className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    {selectedPreview.name}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                    {selectedPreview.sections.join(' · ')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={isExactCurrent}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-black text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-500 disabled:cursor-default disabled:bg-emerald-600 disabled:shadow-none"
                >
                  {isExactCurrent ? (
                    <>
                      <Check className="h-4 w-4" />
                      {isEn ? 'Currently applied' : '当前正在使用'}
                    </>
                  ) : (
                    <>
                      <LayoutGrid className="h-4 w-4" />
                      {currentTemplateId === selectedTemplate.id
                        ? isEn
                          ? 'Restore this template'
                          : '恢复此模板原始内容'
                        : isEn
                          ? 'Apply this template'
                          : '应用此模板'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
