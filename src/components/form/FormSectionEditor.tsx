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

// Helper to determine if a section is inherently text-only (e.g., Personal Advantages, Self-Evaluation, Skills)
const isTextOnlySection = (title: string): boolean => {
  const t = title.trim().toLowerCase();
  const textOnlyKeywords = [
    '个人优势', '自我评价', '个人评价', '专业技能', '核心技能', '技能特长', '技能证书', '职业规划', '求职意向', '关于我', '兴趣爱好', '自我介绍',
    'summary', 'skills', 'personal summary', 'self evaluation', 'self-evaluation', 'key skills', 'core competencies', 'interests', 'certifications', 'hobbies', 'about me'
  ];
  return textOnlyKeywords.some(kw => t.includes(kw));
};

export function FormSectionEditor({
  sec, secIndex, totalSectionsCount, isExpanded, onToggle, onTitleChange, onTextChange, onMove, onDelete, onApplySpacing, onAddItem, onMoveItem, onDeleteItem, onItemFieldChange, onItemContentChange, onInsertStarTemplate,
  onTypeChange,
  lang = 'zh'
}: FormSectionEditorProps) {
  const t = lang === 'en' ? TRANSLATIONS.en : TRANSLATIONS.zh;
  const hideTypeSwitcher = isTextOnlySection(sec.title);

  return (
    <div 
      id={`form-sec-${sec.id}`} 
      className={`rounded-xl overflow-hidden relative group/section scroll-mt-20 transition-all duration-300 ${
        isExpanded 
          ? 'tactile-card shadow-[0_16px_36px_rgba(30,41,59,0.06),0_3px_10px_rgba(30,41,59,0.03)] border-indigo-200/50 scale-[1.002] ring-1 ring-indigo-50/50 mb-5' 
          : 'bg-slate-50/60 border border-slate-200/50 shadow-[0_2px_6px_rgba(30,41,59,0.015)] opacity-85 hover:opacity-100 scale-[0.995] hover:scale-100 mb-3'
      }`}
    >
      <SectionHeader 
        title={sec.title} type={sec.type} isExpanded={isExpanded} isFirst={secIndex === 0} isLast={secIndex === totalSectionsCount - 1}
        onToggle={onToggle} onTitleChange={onTitleChange} onApplySpacing={onApplySpacing} onMove={onMove} onDelete={onDelete}
        onTypeChange={hideTypeSwitcher ? undefined : onTypeChange} lang={lang}
      />

      {isExpanded && (
        <div className="p-5 space-y-4 animate-in fade-in duration-200">
          {sec.type === 'text' ? (
            <div>
              <div className="mb-1.5">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.textLabel}</label>
              </div>
              <div className="flex flex-col mt-1">
                <FormTextareaToolbar textareaId={sec.id} value={sec.textValue} onChange={onTextChange} lang={lang} />
                <textarea
                  id={sec.id} value={sec.textValue} onChange={(e) => onTextChange(e.target.value)} rows={6}
                  className="w-full p-3.5 text-xs font-mono leading-relaxed bg-slate-50/10 border border-slate-200/80 rounded-b-lg rounded-t-none border-t-0 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 shadow-[inset_0_1.5px_3px_rgba(15,23,42,0.04)] focus:shadow-none transition-all duration-200"
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
                className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-gradient-to-r from-slate-50 to-white hover:from-indigo-50/30 hover:to-white text-slate-600 hover:text-indigo-700 border border-dashed border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-bold transition-all shadow-[0_1px_2px_rgba(15,23,42,0.02),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:shadow-[0_2px_6px_rgba(99,102,241,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.95)] cursor-pointer active:translate-y-px"
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
