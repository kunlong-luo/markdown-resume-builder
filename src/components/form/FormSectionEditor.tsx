import React from 'react';
import { 
  Award, Layers, Briefcase, Sparkles, GraduationCap, FileText, Plus
} from 'lucide-react';
import { FormSection } from '../../lib/form-types';
import { getSectionCategory } from '../../lib/markdown-parser';
import { FormTextareaToolbar } from './FormTextareaToolbar';
import { SectionHeader } from './SectionHeader';
import { ItemEditor } from './ItemEditor';

export function getSectionIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes('教育') || t.includes('学校') || t.includes('education') || t.includes('academic')) return <GraduationCap className="w-4 h-4 text-purple-500" />;
  if (t.includes('优势') || t.includes('总结') || t.includes('summary') || t.includes('objective')) return <Award className="w-4 h-4 text-emerald-500" />;
  if (t.includes('技能') || t.includes('技术') || t.includes('skills') || t.includes('technologies')) return <Layers className="w-4 h-4 text-blue-500" />;
  if (t.includes('经历') || t.includes('工作') || t.includes('experience') || t.includes('employment') || t.includes('work')) return <Briefcase className="w-4 h-4 text-indigo-500" />;
  if (t.includes('项目') || t.includes('开源') || t.includes('projects') || t.includes('portfolio')) return <Sparkles className="w-4 h-4 text-amber-500" />;
  return <FileText className="w-4 h-4 text-slate-500" />;
}

interface FormSectionEditorProps {
  sec: FormSection;
  secIndex: number;
  totalSectionsCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  onTitleChange: (newTitle: string) => void;
  onTextChange: (text: string) => void;
  onMove: (direction: 'up' | 'down') => void;
  onDelete: () => void;
  onApplySpacing: () => void;
  onAddItem: () => void;
  onMoveItem: (itemIndex: number, direction: 'up' | 'down') => void;
  onDeleteItem: (itemId: string, itemOrg: string) => void;
  onItemFieldChange: (itemId: string, field: 'org' | 'role' | 'time' | 'gpa' | 'courses' | 'honors', value: string) => void;
  onItemContentChange: (itemId: string, content: string) => void;
  onInsertStarTemplate: (itemId: string, currentContent: string) => void;
  onTypeChange?: (newType: 'text' | 'items') => void;
  lang?: string;
}

const TRANSLATIONS = {
  zh: {
    textLabel: '文本内容',
    textPlaceholder: '- **核心技能 1**：描述您的核心竞争力...',
    noItems: '该模块下暂无经历子项',
    addItem: '添加一条新经历'
  },
  en: {
    textLabel: 'Text Content',
    textPlaceholder: '- **Core Skill 1**: Describe your core competencies and strengths...',
    noItems: 'No items in this section yet',
    addItem: 'Add a new entry'
  }
};

export function FormSectionEditor({
  sec, secIndex, totalSectionsCount, isExpanded, onToggle, onTitleChange, onTextChange, onMove, onDelete, onApplySpacing, onAddItem, onMoveItem, onDeleteItem, onItemFieldChange, onItemContentChange, onInsertStarTemplate,
  onTypeChange,
  lang = 'zh'
}: FormSectionEditorProps) {
  const t = lang === 'en' ? TRANSLATIONS.en : TRANSLATIONS.zh;

  return (
    <div id={`form-sec-${sec.id}`} className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:border-slate-300 relative group/section">
      <SectionHeader 
        title={sec.title} type={sec.type} isExpanded={isExpanded} isFirst={secIndex === 0} isLast={secIndex === totalSectionsCount - 1}
        onToggle={onToggle} onTitleChange={onTitleChange} onApplySpacing={onApplySpacing} onMove={onMove} onDelete={onDelete}
        onTypeChange={onTypeChange} lang={lang}
      />

      {isExpanded && (
        <div className="p-5 space-y-4 animate-in fade-in duration-200">
          {sec.type === 'text' ? (
            <div>
              <div className="mb-1.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t.textLabel}</label>
              </div>
              <div className="flex flex-col mt-1">
                <FormTextareaToolbar textareaId={sec.id} value={sec.textValue} onChange={onTextChange} lang={lang} />
                <textarea
                  id={sec.id} value={sec.textValue} onChange={(e) => onTextChange(e.target.value)} rows={6}
                  className="w-full p-3.5 text-xs font-mono leading-relaxed bg-white border border-slate-200 rounded-b-lg rounded-t-none border-t-0 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder={t.textPlaceholder}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {sec.items.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg text-xs text-slate-400">{t.noItems}</div>
              ) : (
                <div className="space-y-4">
                  {sec.items.map((item, itemIndex) => (
                    <ItemEditor 
                      key={item.id} item={item} index={itemIndex} totalItems={sec.items.length} category={getSectionCategory(sec.title)}
                      onFieldChange={(field, val) => onItemFieldChange(item.id, field, val)}
                      onContentChange={(val) => onItemContentChange(item.id, val)}
                      onMove={(dir) => onMoveItem(itemIndex, dir)}
                      onDelete={() => onDeleteItem(item.id, item.org)}
                      onInsertStarTemplate={() => onInsertStarTemplate(item.id, item.content)}
                      lang={lang}
                    />
                  ))}
                </div>
              )}
              <button
                type="button" onClick={onAddItem}
                className="flex items-center justify-center gap-1.5 w-full py-2 bg-slate-50 hover:bg-blue-50/50 text-slate-600 hover:text-blue-700 border border-dashed border-slate-200 hover:border-blue-300 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addItem}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
