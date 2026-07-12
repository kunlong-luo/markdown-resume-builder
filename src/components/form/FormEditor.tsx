
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Layers, ChevronsDown, ChevronsUp } from 'lucide-react';
import { formatChineseEnglishSpacing } from '../../lib/format-utils';

import { FormItem, FormSection, ResumeFormModel } from '../../lib/form-types';
import { parseMarkdownToForm, parseFormToMarkdown } from '../../lib/markdown-parser';
import { BasicInfoEditor } from './BasicInfoEditor';
import { FormSectionEditor, getSectionIcon } from './FormSectionEditor';
import { EduSectionEditor } from './EduSectionEditor';
import { QuickNav } from './QuickNav';
import { SectionPresets } from './SectionPresets';
import { getPresetSection, getStarTemplate } from '../../lib/form-helpers';
import { getSectionCategory } from '../../lib/markdown-parser';
import { useConfirm } from '../../context/ConfirmContext';

interface FormEditorProps {
  value: string;
  onChange: (value: string, immediate?: boolean) => void;
  settings?: any;
}

export function FormEditor({ value, onChange, settings }: FormEditorProps) {
  const { confirm } = useConfirm();
  const [localModel, setLocalModel] = useState<ResumeFormModel>(() => parseMarkdownToForm(value));
  const [lastParsedValue, setLastParsedValue] = useState<string>(value);
  const [isOutlineOpen, setIsOutlineOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true
  });
  
  const [showOptionalBasic, setShowOptionalBasic] = useState(() => {
    const parsed = parseMarkdownToForm(value);
    return !!(parsed.subtitle || parsed.social || parsed.experience);
  });

  useEffect(() => {
    if (value !== lastParsedValue) {
      const parsed = parseMarkdownToForm(value);
      setLocalModel(parsed);
      setLastParsedValue(value);
      if (parsed.subtitle || parsed.social || parsed.experience) {
        setShowOptionalBasic(true);
      }
    }
  }, [value, lastParsedValue]);

  const handleModelChange = (newModel: ResumeFormModel) => {
    setLocalModel(newModel);
    const newMd = parseFormToMarkdown(newModel);
    setLastParsedValue(newMd);
    onChange(newMd, false);
  };

  const handleExpandAll = (expand: boolean) => {
    const states: Record<string, boolean> = { basic: expand };
    localModel.sections.forEach(sec => {
      states[sec.id] = expand;
    });
    setExpandedSections(states);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleSectionTitleChange = (sectionId: string, newTitle: string) => {
    const updatedSections = localModel.sections.map(sec => {
      if (sec.id === sectionId) return { ...sec, title: newTitle };
      return sec;
    });
    handleModelChange({ ...localModel, sections: updatedSections });
  };

  const handleSectionTextChange = (sectionId: string, text: string) => {
    const updatedSections = localModel.sections.map(sec => {
      if (sec.id === sectionId) return { ...sec, textValue: text };
      return sec;
    });
    handleModelChange({ ...localModel, sections: updatedSections });
  };

  const handleSectionTypeChange = (sectionId: string, newType: 'text' | 'items') => {
    const updatedSections = localModel.sections.map(sec => {
      if (sec.id === sectionId) {
        if (newType === 'items' && sec.items.length === 0) {
          const category = getSectionCategory(sec.title);
          const newItem: FormItem = {
            id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
            org: category === 'edu' ? '学校名称' : '公司/项目名称',
            role: category === 'edu' ? '专业与学位' : '职位角色',
            time: '2026.01 - 至今',
            content: '- 职责/业绩描述...',
          };
          if (category === 'edu') {
            newItem.gpa = '';
            newItem.courses = '';
            newItem.honors = '';
            newItem.content = '';
          }
          return { ...sec, type: newType, items: [newItem], textValue: '' };
        } else if (newType === 'text' && !sec.textValue && sec.items.length > 0) {
          let textVal = '';
          sec.items.forEach(item => {
            const heading = [item.org, item.degree, item.role, item.time].filter(Boolean).join(' ｜ ');
            if (heading) {
              textVal += `### ${heading}\n`;
            }
            if (item.gpa && item.gpa.trim()) {
              textVal += `- **在校表现**：${item.gpa.trim()}\n`;
            }
            if (item.courses && item.courses.trim()) {
              textVal += `- **主修课程**：${item.courses.trim()}\n`;
            }
            if (item.honors && item.honors.trim()) {
              textVal += `- **荣誉成就**：${item.honors.trim()}\n`;
            }
            if (item.content) {
              textVal += `${item.content.trim()}\n`;
            }
            textVal += '\n';
          });
          return { ...sec, type: newType, textValue: textVal.trim() };
        }
        return { ...sec, type: newType };
      }
      return sec;
    });
    handleModelChange({ ...localModel, sections: updatedSections });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= localModel.sections.length) return;

    const updatedSections = [...localModel.sections];
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[newIndex];
    updatedSections[newIndex] = temp;

    handleModelChange({ ...localModel, sections: updatedSections });
  };

  const deleteSection = async (sectionId: string, sectionTitle: string) => {
    const confirmed = await confirm({
      title: '删除模块确认',
      message: `确定要删除模块「${sectionTitle}」吗？此操作将移除该模块的所有内容且无法撤销。`,
      confirmText: '确认删除',
      cancelText: '取消',
      type: 'danger'
    });
    if (confirmed) {
      const updatedSections = localModel.sections.filter(sec => sec.id !== sectionId);
      handleModelChange({ ...localModel, sections: updatedSections });
    }
  };

  const addPresetSection = (presetType: 'work' | 'project' | 'edu' | 'skills' | 'summary' | 'custom_text' | 'custom_items') => {
    const preset = getPresetSection(presetType);
    const now = Date.now();
    const newSection: FormSection = {
      ...preset,
      id: `sec_${now}_${Math.random().toString(36).substring(2, 7)}`,
    };

    const updatedSections = [...localModel.sections, newSection];
    setExpandedSections(prev => ({ ...prev, [newSection.id]: true }));
    handleModelChange({ ...localModel, sections: updatedSections });

    setTimeout(() => {
      document.getElementById(`form-sec-${newSection.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  };

  const handleItemFieldChange = (sectionId: string, itemId: string, field: keyof FormItem, value: string) => {
    const updatedSections = localModel.sections.map(sec => {
      if (sec.id === sectionId) {
        const updatedItems = sec.items.map(item => item.id === itemId ? { ...item, [field]: value } : item);
        return { ...sec, items: updatedItems };
      }
      return sec;
    });
    handleModelChange({ ...localModel, sections: updatedSections });
  };

  const handleItemContentChange = (sectionId: string, itemId: string, content: string) => {
    const updatedSections = localModel.sections.map(sec => {
      if (sec.id === sectionId) {
        const updatedItems = sec.items.map(item => item.id === itemId ? { ...item, content } : item);
        return { ...sec, items: updatedItems };
      }
      return sec;
    });
    handleModelChange({ ...localModel, sections: updatedSections });
  };

  const moveItem = (sectionId: string, itemIndex: number, direction: 'up' | 'down') => {
    const updatedSections = localModel.sections.map(sec => {
      if (sec.id === sectionId) {
        const newIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
        if (newIndex < 0 || newIndex >= sec.items.length) return sec;
        const updatedItems = [...sec.items];
        const temp = updatedItems[itemIndex];
        updatedItems[itemIndex] = updatedItems[newIndex];
        updatedItems[newIndex] = temp;
        return { ...sec, items: updatedItems };
      }
      return sec;
    });
    handleModelChange({ ...localModel, sections: updatedSections });
  };

  const deleteItem = async (sectionId: string, itemId: string, itemOrg: string) => {
    const confirmed = await confirm({
      title: '删除经历项确认',
      message: `确定要删除此条经历「${itemOrg.trim() || '未命名经历'}」吗？此操作将彻底删除此项内容且无法撤销。`,
      confirmText: '确认删除',
      cancelText: '取消',
      type: 'danger'
    });
    if (confirmed) {
      const updatedSections = localModel.sections.map(sec => {
        if (sec.id === sectionId) {
          return { ...sec, items: sec.items.filter(item => item.id !== itemId) };
        }
        return sec;
      });
      handleModelChange({ ...localModel, sections: updatedSections });
    }
  };

  const addItem = (sectionId: string, sectionTitle: string) => {
    const category = getSectionCategory(sectionTitle);
    
    let newItem: FormItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      org: category === 'edu' ? '学校名称' : '公司/项目名称',
      role: category === 'edu' ? '专业与学位' : '职位角色',
      time: '2026.01 - 至今',
      content: '- 职责/业绩描述...',
    };

    if (category === 'edu') {
      newItem.gpa = '绩点 GPA 3.8/4.0';
      newItem.courses = '核心课程...';
      newItem.honors = '奖项荣誉...';
      newItem.content = '';
    }

    const updatedSections = localModel.sections.map(sec => {
      if (sec.id === sectionId) return { ...sec, items: [...sec.items, newItem] };
      return sec;
    });
    handleModelChange({ ...localModel, sections: updatedSections });
  };

  const applyChineseEnglishSpacingToSection = (sectionId: string) => {
    const updatedSections = localModel.sections.map(sec => {
      if (sec.id === sectionId) {
        if (sec.type === 'text') return { ...sec, textValue: formatChineseEnglishSpacing(sec.textValue) };
        const updatedItems = sec.items.map(item => ({
          ...item,
          org: formatChineseEnglishSpacing(item.org),
          role: formatChineseEnglishSpacing(item.role),
          time: formatChineseEnglishSpacing(item.time),
          content: formatChineseEnglishSpacing(item.content),
          gpa: item.gpa ? formatChineseEnglishSpacing(item.gpa) : item.gpa,
          courses: item.courses ? formatChineseEnglishSpacing(item.courses) : item.courses,
          honors: item.honors ? formatChineseEnglishSpacing(item.honors) : item.honors
        }));
        return { ...sec, items: updatedItems };
      }
      return sec;
    });
    handleModelChange({ ...localModel, sections: updatedSections });
  };

  const insertStarTemplateToItem = async (sectionId: string, itemId: string, currentContent: string, sectionTitle: string) => {
    const applyTemplate = () => {
      const template = getStarTemplate(sectionTitle);
      const updatedSections = localModel.sections.map(sec => {
        if (sec.id === sectionId) {
          const updatedItems = sec.items.map(item => item.id === itemId ? { ...item, ...template } : item);
          return { ...sec, items: updatedItems };
        }
        return sec;
      });
      handleModelChange({ ...localModel, sections: updatedSections });
    };

    if (currentContent.trim()) {
      const confirmed = await confirm({
        title: '覆盖内容提示',
        message: '这将会覆盖您当前已输入的内容，确定要导入推荐的内容模板吗？',
        confirmText: '确认导入',
        cancelText: '取消',
        type: 'warning'
      });
      if (confirmed) {
        applyTemplate();
      }
    } else {
      applyTemplate();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 space-y-6">
      <QuickNav sections={localModel.sections} expandedSections={expandedSections} setExpandedSections={setExpandedSections} />

      {/* 模块快速排序与架构管理 */}
      <div className="bg-white border border-slate-200/85 rounded-xl shadow-sm overflow-hidden transition-all duration-200">
        <div 
          onClick={() => setIsOutlineOpen(!isOutlineOpen)}
          className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-100 cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 animate-pulse" />
            <h3 className="text-xs font-bold text-slate-800">简历板块大纲与一键排序</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-bold bg-slate-200/60 px-2 py-0.5 rounded-full">
              共 {localModel.sections.length + 1} 个板块
            </span>
            <span className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
              {isOutlineOpen ? '折叠大纲 [-]' : '展开大纲 [+]'}
            </span>
          </div>
        </div>
        
        {isOutlineOpen && (
          <div className="p-4 space-y-3 bg-white/50 border-t border-slate-100/50 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/30 border border-indigo-100/30 p-3 rounded-xl">
              <p className="text-[10px] text-slate-500 leading-relaxed pl-1 sm:max-w-[60%]">
                💡 提示：您可以点击右侧箭头一键调整模块的上下顺序，右侧预览将实时重绘。
              </p>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleExpandAll(true)}
                  className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 text-[10px] font-bold text-indigo-700 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <ChevronsDown className="w-3.5 h-3.5 text-indigo-500" />
                  一键展开所有表单
                </button>
                <button
                  type="button"
                  onClick={() => handleExpandAll(false)}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <ChevronsUp className="w-3.5 h-3.5 text-slate-500" />
                  一键折叠所有表单
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 1. Basic Info (Always at the top) */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-150 rounded-xl text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 flex items-center justify-center bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold border border-indigo-100">1</span>
                  <span>🧑‍💼 个人基本信息</span>
                </div>
                <span className="text-[9px] text-slate-400 font-bold bg-slate-200/60 px-2 py-0.5 rounded-full">固定置顶</span>
              </div>

              {/* 2. Custom sections */}
              {localModel.sections.map((sec, idx) => (
                <div 
                  key={sec.id} 
                  className="flex items-center justify-between p-2.5 bg-white border border-slate-250/80 rounded-xl text-xs font-semibold hover:border-indigo-200 hover:bg-indigo-50/5 hover:shadow-xs transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 flex items-center justify-center bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors border border-slate-200/60">
                      {idx + 2}
                    </span>
                    <span className="text-slate-750 flex items-center gap-1.5 min-w-0 truncate">
                      {getSectionIcon(sec.title)}
                      <strong className="truncate">{sec.title || '未命名板块'}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveSection(idx, 'up'); }}
                      disabled={idx === 0}
                      className={`p-1.5 rounded-lg transition-all ${idx === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 active:scale-90'}`}
                      title="上移板块"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveSection(idx, 'down'); }}
                      disabled={idx === localModel.sections.length - 1}
                      className={`p-1.5 rounded-lg transition-all ${idx === localModel.sections.length - 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 active:scale-90'}`}
                      title="下移板块"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BasicInfoEditor
        model={localModel}
        onChange={handleModelChange}
        expanded={expandedSections['basic'] !== false}
        onToggleExpanded={() => setExpandedSections(prev => ({ ...prev, basic: prev['basic'] === false }))}
        showOptional={showOptionalBasic}
        onToggleOptional={() => setShowOptionalBasic(!showOptionalBasic)}
        lang={settings?.lang}
      />
      
      {localModel.sections.map((sec, secIndex) => {
        const category = getSectionCategory(sec.title);
        
        if (category === 'edu') {
          return (
            <EduSectionEditor
              key={sec.id}
              section={sec}
              expanded={expandedSections[sec.id] !== false}
              onToggle={() => toggleSection(sec.id)}
              onItemChange={(itemId, field, value) => handleItemFieldChange(sec.id, itemId, field as any, value)}
              onAddItem={() => addItem(sec.id, sec.title)}
              onDeleteItem={(itemId, org) => deleteItem(sec.id, itemId, org)}
              onTitleChange={(newTitle) => handleSectionTitleChange(sec.id, newTitle)}
              onMove={(direction) => moveSection(secIndex, direction)}
              onDelete={() => deleteSection(sec.id, sec.title)}
              isFirst={secIndex === 0}
              isLast={secIndex === localModel.sections.length - 1}
              onTextChange={(text) => handleSectionTextChange(sec.id, text)}
              onTypeChange={(newType) => handleSectionTypeChange(sec.id, newType)}
              onMoveItem={(itemIndex, direction) => moveItem(sec.id, itemIndex, direction)}
              lang={settings?.lang}
            />
          );
        }

        return (
          <FormSectionEditor
            key={sec.id}
            sec={sec}
            secIndex={secIndex}
            totalSectionsCount={localModel.sections.length}
            isExpanded={expandedSections[sec.id] !== false}
            onToggle={() => toggleSection(sec.id)}
            onTitleChange={(newTitle) => handleSectionTitleChange(sec.id, newTitle)}
            onTextChange={(text) => handleSectionTextChange(sec.id, text)}
            onMove={(direction) => moveSection(secIndex, direction)}
            onDelete={() => deleteSection(sec.id, sec.title)}
            onApplySpacing={() => applyChineseEnglishSpacingToSection(sec.id)}
            onAddItem={() => addItem(sec.id, sec.title)}
            onMoveItem={(itemIndex, direction) => moveItem(sec.id, itemIndex, direction)}
            onDeleteItem={(itemId, itemOrg) => deleteItem(sec.id, itemId, itemOrg)}
            onItemFieldChange={(itemId, field, value) => handleItemFieldChange(sec.id, itemId, field, value)}
            onItemContentChange={(itemId, content) => handleItemContentChange(sec.id, itemId, content)}
            onInsertStarTemplate={(itemId, currentContent) => insertStarTemplateToItem(sec.id, itemId, currentContent, sec.title)}
            onTypeChange={(newType) => handleSectionTypeChange(sec.id, newType)}
            lang={settings?.lang}
          />
        );
      })}

      <SectionPresets onAddPreset={addPresetSection} />
    </div>
  );
}
