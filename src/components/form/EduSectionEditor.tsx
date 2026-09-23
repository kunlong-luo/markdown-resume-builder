import React from 'react';
import { School, Calendar, BookOpen, Plus, Trash2, ChevronDown, ChevronUp, Award, Book, ArrowUp, ArrowDown, GraduationCap, GripVertical } from 'lucide-react';
import { FormSection, FormItem } from '../../lib/form-types';
import { FormTextareaToolbar } from './FormTextareaToolbar';
import { MonthRangePicker } from './MonthRangePicker';
import { CustomSelect } from '../ui/CustomSelect';
import { SmartMarkdownTextarea } from './SmartMarkdownTextarea';
import { Tooltip } from '../ui/Tooltip';

interface EduSectionEditorProps {
  section: FormSection;
  expanded: boolean;
  onToggle: () => void;
  onItemChange: (itemId: string, field: keyof FormItem, value: string) => void;
  onAddItem: () => void;
  onDeleteItem: (itemId: string, org: string) => void;
  onTitleChange: (title: string) => void;
  onMove?: (direction: 'up' | 'down') => void;
  onDelete?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  onTextChange?: (text: string) => void;
  onTypeChange?: (newType: 'text' | 'items') => void;
  onMoveItem?: (itemIndex: number, direction: 'up' | 'down') => void;
  onReorderItem?: (fromIndex: number, toIndex: number) => void;
  lang?: string;
}

const TRANSLATIONS = {
  zh: {
    subtitle: '院校名称、学历专业与就读表现',
    schoolLabel: '院校名称',
    schoolPlaceholder: '如：清华大学',
    degreeLabel: '学历',
    degreeChoosePreset: '选择预设',
    degreeCustom: '自定义',
    degreePlaceholder: '如：本科',
    majorLabel: '专业名称',
    majorPlaceholder: '如：计算机科学与技术',
    timeLabel: '就读时间',
    timePlaceholder: '如：2020.09 - 2024.06',
    gpaLabel: '学业成绩 (选填)',
    gpaPlaceholder: '如：绩点 3.8/4.0，专业前 5%',
    coursesLabel: '核心课程 (选填)',
    coursesPlaceholder: '如：数据结构、高级算法、计算机系统',
    honorsLabel: '荣誉奖项 (选填)',
    honorsPlaceholder: '如：国家奖学金、算法竞赛一等奖',
    descLabel: '补充描述 (选填)',
    descPlaceholder: '如有其他校园经历、社团活动或实践活动可在此处填写（支持 Markdown）',
    addBtn: '添加一段教育背景',
    textLabel: '文本内容',
    textPlaceholder: '请输入教育背景，支持 Markdown...',
    moveUp: '上移模块',
    moveDown: '下移模块',
    deleteSec: '删除该模块',
    customOption: '自定义输入',
    degreeOptions: [
      { value: '', label: '' },
      { value: '大专', label: '大专' },
      { value: '本科', label: '本科' },
      { value: '硕士', label: '硕士' },
      { value: '博士', label: '博士' },
    ]
  },
  en: {
    subtitle: 'Institution name, degree, major, and performance',
    schoolLabel: 'Institution Name',
    schoolPlaceholder: 'e.g. Harvard University',
    degreeLabel: 'Degree',
    degreeChoosePreset: 'Presets',
    degreeCustom: 'Custom',
    degreePlaceholder: 'e.g. Bachelor of Science',
    majorLabel: 'Major / Field',
    majorPlaceholder: 'e.g. Computer Science',
    timeLabel: 'Education Period',
    timePlaceholder: 'e.g. 2020.09 - 2024.06',
    gpaLabel: 'Academic GPA (Optional)',
    gpaPlaceholder: 'e.g. GPA 3.8/4.0, Top 5%',
    coursesLabel: 'Core Courses (Optional)',
    coursesPlaceholder: 'e.g. Data Structures, Algorithms, Computer Systems',
    honorsLabel: 'Honors & Awards (Optional)',
    honorsPlaceholder: 'e.g. National Scholarship, First Prize in Dean\'s List',
    descLabel: 'Additional Notes (Optional)',
    descPlaceholder: 'e.g. campus activities, club leadership or research (Markdown supported)',
    addBtn: 'Add Education Background',
    textLabel: 'Text Content',
    textPlaceholder: 'Enter your education info in Markdown...',
    moveUp: 'Move Up',
    moveDown: 'Move Down',
    deleteSec: 'Delete Section',
    customOption: 'Custom Input',
    degreeOptions: [
      { value: '', label: '' },
      { value: 'Associate', label: 'Associate' },
      { value: 'Bachelor', label: 'Bachelor' },
      { value: 'Master', label: 'Master' },
      { value: 'Ph.D.', label: 'Ph.D.' },
    ]
  }
};

export function EduSectionEditor({ 
  section, 
  expanded, 
  onToggle, 
  onItemChange, 
  onAddItem, 
  onDeleteItem,
  onTitleChange,
  onMove,
  onDelete,
  isFirst,
  isLast,
  onTextChange,
  onTypeChange,
  onMoveItem,
  onReorderItem,
  lang = 'zh'
}: EduSectionEditorProps) {
  const [customDegrees, setCustomDegrees] = React.useState<Record<string, boolean>>({});
  const t = lang === 'en' ? TRANSLATIONS.en : TRANSLATIONS.zh;

  React.useEffect(() => {
    if (section.type === 'items') {
      const newCustomDegrees = { ...customDegrees };
      section.items.forEach(item => {
        if (item.degree && !t.degreeOptions.some(o => o.value === item.degree)) {
          newCustomDegrees[item.id] = true;
        }
      });
      setCustomDegrees(newCustomDegrees);
    }
  }, [section.items, lang]);

  const toggleCustomDegree = (itemId: string) => {
    setCustomDegrees(prev => {
      const isCustom = !prev[itemId];
      if (isCustom) {
        onItemChange(itemId, 'degree', '');
      }
      return { ...prev, [itemId]: isCustom };
    });
  };

  return (
    <div 
      id={`form-sec-${section.id}`} 
      className={`rounded-xl overflow-hidden scroll-mt-20 transition-all duration-300 ${
        expanded 
          ? 'tactile-card shadow-[0_16px_36px_rgba(30,41,59,0.06),0_3px_10px_rgba(30,41,59,0.03)] border-indigo-200/50 dark:border-slate-800 scale-[1.002] ring-1 ring-indigo-50/50 dark:ring-slate-800 mb-5' 
          : 'bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 shadow-[0_2px_6px_rgba(30,41,59,0.015)] opacity-85 hover:opacity-100 scale-[0.995] hover:scale-100 mb-3'
      }`}
    >
      <div 
        className={`flex items-center justify-between p-4 bg-gradient-to-r cursor-pointer transition-colors ${
          expanded 
            ? 'from-indigo-50/40 to-slate-50 dark:from-indigo-950/30 dark:to-slate-900/60 border-b border-indigo-100/40 dark:border-indigo-900/40 hover:from-indigo-50/60 hover:to-slate-100/60 dark:hover:from-indigo-950/50 dark:hover:to-slate-900/80' 
            : 'from-slate-50/80 to-slate-100/30 dark:from-slate-850/60 dark:to-slate-900/40 border-b border-slate-200/40 dark:border-slate-800 hover:from-slate-100/60 hover:to-slate-100/90 dark:hover:from-slate-800 dark:hover:to-slate-800/80'
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-lg">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={section.title}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onTitleChange(e.target.value)}
                className="font-bold text-slate-800 dark:text-slate-100 bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none px-1 rounded transition-all"
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {onMove && (
            <>
              <Tooltip content={t.moveUp} side="top" disabled={isFirst}>
                <button
                  onClick={() => onMove('up')}
                  disabled={isFirst}
                  className={`p-1.5 rounded transition-colors ${isFirst ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 cursor-pointer'}`}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </Tooltip>
              <Tooltip content={t.moveDown} side="top" disabled={isLast}>
                <button
                  onClick={() => onMove('down')}
                  disabled={isLast}
                  className={`p-1.5 rounded transition-colors ${isLast ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 cursor-pointer'}`}
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </Tooltip>
            </>
          )}
          {onDelete && (
            <Tooltip content={t.deleteSec} side="top">
              <button
                onClick={onDelete}
                className="p-1.5 hover:bg-red-50 dark:hover:bg-rose-950/50 text-red-500 dark:text-rose-400 hover:text-red-700 dark:hover:text-rose-300 rounded transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Tooltip>
          )}
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-750 mx-1"></div>
          <div className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer" onClick={onToggle}>
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="p-5 space-y-6">
          {section.type === 'text' ? (
            <div>
              <div className="mb-1.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t.textLabel}</label>
              </div>
              <div className="flex flex-col mt-1">
                <FormTextareaToolbar textareaId={section.id} value={section.textValue || ''} onChange={onTextChange!} lang={lang} />
                <textarea
                  id={section.id} 
                  value={section.textValue || ''} 
                  onChange={(e) => onTextChange!(e.target.value)} 
                  rows={6}
                  className="w-full p-3.5 text-xs font-mono leading-relaxed bg-slate-50/10 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-750 rounded-b-lg rounded-t-none border-t-0 text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 shadow-[inset_0_1.5px_3px_rgba(15,23,42,0.04)] focus:shadow-none transition-all duration-200"
                  placeholder={t.textPlaceholder}
                />
              </div>
            </div>
          ) : (
            <>
              {section.items.map((item, itemIndex) => {
                const handleDragStart = (e: React.DragEvent) => {
                  e.dataTransfer.setData('text/plain', String(itemIndex));
                  e.dataTransfer.effectAllowed = 'move';
                };

                const handleDragOver = (e: React.DragEvent) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                };

                const handleDrop = (e: React.DragEvent) => {
                  e.preventDefault();
                  const sourceIndexStr = e.dataTransfer.getData('text/plain');
                  if (!sourceIndexStr) return;
                  const sourceIndex = parseInt(sourceIndexStr, 10);
                  if (!isNaN(sourceIndex) && sourceIndex !== itemIndex && onReorderItem) {
                    onReorderItem(sourceIndex, itemIndex);
                  }
                };

                return (
                  <div 
                    key={item.id} 
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="relative p-5 border border-slate-200/60 dark:border-slate-800 rounded-xl bg-gradient-to-br from-white to-slate-50/60 dark:from-slate-850 dark:to-slate-900/90 transition-all group shadow-[0_2px_6px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] dark:shadow-none hover:border-purple-300 dark:hover:border-purple-800 hover:shadow-[0_4px_12px_rgba(15,23,42,0.03),inset_0_1.5px_2px_rgba(255,255,255,0.95)]"
                  >
                    {/* Action Buttons */}
                    <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                      {onReorderItem && (
                        <Tooltip content={lang === 'en' ? 'Drag to reorder' : '按住拖拽排序'} side="top">
                          <div
                            draggable
                            onDragStart={handleDragStart}
                            className="p-1 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded cursor-grab active:cursor-grabbing transition-colors"
                          >
                            <GripVertical className="w-3.5 h-3.5" />
                          </div>
                        </Tooltip>
                      )}
                      {onMoveItem && (
                        <>
                          <Tooltip content={lang === 'en' ? 'Move Item Up' : '上移此项'} side="top" disabled={itemIndex === 0}>
                            <button 
                              type="button" 
                              onClick={() => onMoveItem(itemIndex, 'up')} 
                              disabled={itemIndex === 0} 
                              className={`p-1 rounded transition-colors ${itemIndex === 0 ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 cursor-pointer'}`} 
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                          </Tooltip>
                          <Tooltip content={lang === 'en' ? 'Move Item Down' : '下移此项'} side="top" disabled={itemIndex === section.items.length - 1}>
                            <button 
                              type="button" 
                              onClick={() => onMoveItem(itemIndex, 'down')} 
                              disabled={itemIndex === section.items.length - 1} 
                              className={`p-1 rounded transition-colors ${itemIndex === section.items.length - 1 ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 cursor-pointer'}`} 
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip content={lang === 'en' ? 'Delete Item' : '删除此项'} side="top">
                        <button 
                          onClick={() => onDeleteItem(item.id, item.org)}
                          className="p-1 hover:bg-red-50 dark:hover:bg-rose-950/50 text-red-500 dark:text-rose-400 hover:text-red-700 dark:hover:text-rose-300 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </Tooltip>
                    </div>

                  {/* Primary Fields Row */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-[1.5] min-w-0 space-y-1.5">
                      <div className="h-6 flex items-center justify-between">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none select-none">{t.schoolLabel}</label>
                      </div>
                      <div className="relative h-9.5">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><School className="w-3.5 h-3.5" /></span>
                        <input 
                          type="text" 
                          value={item.org || ''}
                          onChange={(e) => onItemChange(item.id, 'org', e.target.value)}
                          className="w-full h-9.5 pl-9 pr-3 text-sm font-semibold tactile-input rounded-lg"
                          placeholder={t.schoolPlaceholder}
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="h-6 flex items-center justify-between">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none select-none">{t.degreeLabel}</label>
                        <button
                          type="button"
                          onClick={() => toggleCustomDegree(item.id)}
                          className="h-5 text-[10px] text-purple-600 hover:text-purple-700 font-semibold cursor-pointer transition-colors inline-flex items-center"
                        >
                          {customDegrees[item.id] ? t.degreeChoosePreset : t.degreeCustom}
                        </button>
                      </div>
                      <div className="relative h-9.5">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10"><GraduationCap className="w-3.5 h-3.5" /></span>
                        {customDegrees[item.id] ? (
                          <input 
                            type="text" 
                            value={item.degree || ''}
                            onChange={(e) => onItemChange(item.id, 'degree', e.target.value)}
                            className="w-full h-9.5 pl-9 pr-3 text-sm tactile-input rounded-lg"
                            placeholder={t.degreePlaceholder}
                          />
                        ) : (
                          <CustomSelect
                            value={item.degree || ''}
                            onChange={(val) => {
                              if (val === '__custom__') {
                                toggleCustomDegree(item.id);
                              } else {
                                onItemChange(item.id, 'degree', val);
                              }
                            }}
                            options={[
                              ...(item.degree && !t.degreeOptions.some(opt => opt.value === item.degree) ? [{ value: item.degree, label: item.degree }] : []),
                              ...t.degreeOptions,
                              { value: '__custom__', label: t.customOption }
                            ]}
                            size="md"
                            className="w-full h-9.5"
                            triggerClassName="w-full h-9.5 pl-9 pr-3 text-sm tactile-input font-normal bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg"
                            placeholder={t.degreePlaceholder}
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex-[1.2] min-w-0 space-y-1.5">
                      <div className="h-6 flex items-center justify-between">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none select-none">{t.majorLabel}</label>
                      </div>
                      <div className="relative h-9.5">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><BookOpen className="w-3.5 h-3.5" /></span>
                        <input 
                          type="text" 
                          value={item.role || ''}
                          onChange={(e) => onItemChange(item.id, 'role', e.target.value)}
                          className="w-full h-9.5 pl-9 pr-3 text-sm tactile-input font-medium rounded-lg"
                          placeholder={t.majorPlaceholder}
                        />
                      </div>
                    </div>

                     <div className="w-full md:w-[220px] shrink-0 space-y-1.5">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.timeLabel}</label>
                      <MonthRangePicker
                        value={item.time || ''}
                        onChange={(val) => onItemChange(item.id, 'time', val)}
                        className="pl-9 pr-3 py-2 text-sm tactile-input font-mono"
                        placeholder={t.timePlaceholder}
                        lang={lang}
                        leftIcon={<Calendar className="w-3.5 h-3.5" />}
                      />
                    </div>
                  </div>

                  {/* Secondary Fields Row: Academic & Achievements */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.gpaLabel}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 pointer-events-none"><Award className="w-3.5 h-3.5" /></span>
                        <input 
                          type="text" 
                          value={item.gpa || ''}
                          onChange={(e) => onItemChange(item.id, 'gpa', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm tactile-input"
                          placeholder={t.gpaPlaceholder}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.coursesLabel}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 pointer-events-none"><Book className="w-3.5 h-3.5" /></span>
                        <input 
                          type="text" 
                          value={item.courses || ''}
                          onChange={(e) => onItemChange(item.id, 'courses', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm tactile-input"
                          placeholder={t.coursesPlaceholder}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.honorsLabel}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 pointer-events-none"><Award className="w-3.5 h-3.5" /></span>
                        <input 
                          type="text" 
                          value={item.honors || ''}
                          onChange={(e) => onItemChange(item.id, 'honors', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm tactile-input"
                          placeholder={t.honorsPlaceholder}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Supplemental Content / Description Textarea */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="mb-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.descLabel}</label>
                    </div>
                    <div className="flex flex-col mt-1.5">
                      <FormTextareaToolbar textareaId={item.id} value={item.content || ''} onChange={(val) => onItemChange(item.id, 'content', val)} lang={lang} />
                      <SmartMarkdownTextarea 
                        id={item.id}
                        value={item.content || ''}
                        onChange={(val) => onItemChange(item.id, 'content', val)}
                        minRows={3}
                        className="w-full p-3 text-xs font-mono leading-relaxed bg-slate-50/10 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-750 rounded-b-lg rounded-t-none border-t-0 text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 shadow-[inset_0_1.5px_3px_rgba(15,23,42,0.04)] focus:shadow-none transition-all duration-200"
                        placeholder={t.descPlaceholder}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onAddItem}
                  className="flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-dashed border-purple-200 dark:border-purple-800 rounded-xl transition-all group cursor-pointer"
                >
                  <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{t.addBtn}</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
