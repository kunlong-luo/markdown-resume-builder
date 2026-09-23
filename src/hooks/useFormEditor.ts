import { useState, useEffect } from 'react';
import { formatChineseEnglishSpacing } from '../lib/format-utils';
import { FormItem, FormSection, ResumeFormModel } from '../lib/form-types';
import { parseMarkdownToForm, parseFormToMarkdown, getSectionCategory } from '../lib/markdown-parser';
import { getPresetSection, getStarTemplate } from '../lib/form-helpers';
import { useConfirm } from '../context/ConfirmContext';

export const FORM_EDITOR_TRANSLATIONS = {
  zh: {
    outlineTitle: '板块结构',
    totalSections: (count: number) => `${count} 个板块`,
    collapseOutline: '折叠大纲 [-]',
    expandOutline: '展开大纲 [+]',
    tip: '💡 提示：点击箭头调整模块上下顺序，右侧实时显示。',
    expandAll: '展开所有',
    collapseAll: '折叠所有',
    basicInfo: '🧑‍💼 个人基本信息',
    fixedTop: '置顶',
    unnamedSec: '未命名模块',
    moveUp: '上移',
    moveDown: '下移',
    
    // items defaults
    defaultSchool: '学校名称',
    defaultCompany: '公司/项目名称',
    defaultMajor: '专业与学位',
    defaultRole: '职位角色',
    defaultTime: '2026.01 - 至今',
    defaultDesc: '- 职责/业绩描述...',
    defaultGpa: '绩点 GPA 3.8/4.0',
    defaultCourses: '核心课程...',
    defaultHonors: '奖项荣誉...',
    
    // markdown conversion labels
    gpaLabel: '在校表现',
    coursesLabel: '主修课程',
    honorsLabel: '荣誉成就',

    // confirmations
    deleteSecTitle: '删除模块确认',
    deleteSecMsg: (title: string) => `确定要删除模块「${title}」吗？此操作将移除该模块的所有内容且无法撤销。`,
    confirmDelete: '确认删除',
    cancel: '取消',
    
    deleteItemTitle: '删除经历项确认',
    deleteItemMsg: (org: string) => `确定要删除此条经历「${org || '未命名经历'}」吗？此操作将彻底删除此项内容且无法撤销。`,
    
    overwriteTitle: '覆盖内容提示',
    overwriteMsg: '这将会覆盖您当前已输入的内容，确定要导入推荐的内容模板吗？',
    confirmImport: '确认导入'
  },
  en: {
    outlineTitle: 'Resume Outline & Easy Sorting',
    totalSections: (count: number) => `${count} sections total`,
    collapseOutline: 'Collapse Outline [-]',
    expandOutline: 'Expand Outline [+]',
    tip: '💡 Tip: Click arrows to adjust the layout order of sections. The preview renders in real-time.',
    expandAll: 'Expand All Forms',
    collapseAll: 'Collapse All Forms',
    basicInfo: '🧑‍💼 Personal Information',
    fixedTop: 'Fixed Top',
    unnamedSec: 'Unnamed Section',
    moveUp: 'Move Up',
    moveDown: 'Move Down',
    
    // items defaults
    defaultSchool: 'Institution Name',
    defaultCompany: 'Company / Project Name',
    defaultMajor: 'Major & Degree',
    defaultRole: 'Role / Title',
    defaultTime: '2026.01 - Present',
    defaultDesc: '- Responsibilities / achievements description...',
    defaultGpa: 'GPA 3.8/4.0',
    defaultCourses: 'Core courses...',
    defaultHonors: 'Awards & Honors...',
    
    // markdown conversion labels
    gpaLabel: 'GPA / Performance',
    coursesLabel: 'Core Courses',
    honorsLabel: 'Honors & Awards',

    // confirmations
    deleteSecTitle: 'Delete Section Confirmation',
    deleteSecMsg: (title: string) => `Are you sure you want to delete section "${title}"? This will remove all its content and cannot be undone.`,
    confirmDelete: 'Confirm Delete',
    cancel: 'Cancel',
    
    deleteItemTitle: 'Delete Item Confirmation',
    deleteItemMsg: (org: string) => `Are you sure you want to delete "${org || 'Unnamed Entry'}"? This action is permanent and cannot be undone.`,
    
    overwriteTitle: 'Overwrite Content Prompt',
    overwriteMsg: 'This will overwrite your existing text for this entry. Are you sure you want to import the recommended template?',
    confirmImport: 'Confirm Import'
  }
};

export function useFormEditor(
  value: string,
  onChange: (value: string, immediate?: boolean) => void,
  settings?: { lang?: string }
) {
  const { confirm } = useConfirm();
  const [localModel, setLocalModel] = useState<ResumeFormModel>(() => parseMarkdownToForm(value));
  const [lastParsedValue, setLastParsedValue] = useState<string>(value);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true
  });
  
  const isEn = settings?.lang === 'en';
  const t = isEn ? FORM_EDITOR_TRANSLATIONS.en : FORM_EDITOR_TRANSLATIONS.zh;

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

  useEffect(() => {
    const isAllExpanded = expandedSections.basic !== false && 
                          localModel.sections.every(sec => expandedSections[sec.id] !== false);
    
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      const targetState = customEvent.detail.expand;
      const states: Record<string, boolean> = { basic: targetState };
      localModel.sections.forEach(sec => { states[sec.id] = targetState; });
      setExpandedSections(states);
    };

    const dispatchState = () => {
      document.dispatchEvent(new CustomEvent('form-expanded-state', {
        detail: {
          isAllExpanded,
          hasSections: true
        }
      }));
    };

    const timer = setTimeout(dispatchState, 0);

    document.addEventListener('toggle-all-sections', handler);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('toggle-all-sections', handler);
      document.dispatchEvent(new CustomEvent('form-expanded-state', {
        detail: {
          isAllExpanded: true,
          hasSections: false
        }
      }));
    };
  }, [expandedSections, localModel.sections]);

  const handleModelChange = (newModel: ResumeFormModel) => {
    setLocalModel(newModel);
    const newMd = parseFormToMarkdown(newModel);
    setLastParsedValue(newMd);
    onChange(newMd, false);
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
            org: category === 'edu' ? t.defaultSchool : t.defaultCompany,
            role: category === 'edu' ? t.defaultMajor : t.defaultRole,
            time: t.defaultTime,
            content: t.defaultDesc,
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
              textVal += `- **${t.gpaLabel}**：${item.gpa.trim()}\n`;
            }
            if (item.courses && item.courses.trim()) {
              textVal += `- **${t.coursesLabel}**：${item.courses.trim()}\n`;
            }
            if (item.honors && item.honors.trim()) {
              textVal += `- **${t.honorsLabel}**：${item.honors.trim()}\n`;
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
      title: t.deleteSecTitle,
      message: t.deleteSecMsg(sectionTitle),
      confirmText: t.confirmDelete,
      cancelText: t.cancel,
      type: 'danger'
    });
    if (confirmed) {
      const updatedSections = localModel.sections.filter(sec => sec.id !== sectionId);
      handleModelChange({ ...localModel, sections: updatedSections });
    }
  };

  const addPresetSection = (presetType: 'work' | 'project' | 'edu' | 'skills' | 'summary' | 'custom_text' | 'custom_items') => {
    const preset = getPresetSection(presetType, settings?.lang || 'zh');
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

  const reorderItems = (sectionId: string, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const updatedSections = localModel.sections.map(sec => {
      if (sec.id === sectionId) {
        if (fromIndex < 0 || fromIndex >= sec.items.length || toIndex < 0 || toIndex >= sec.items.length) return sec;
        const updatedItems = [...sec.items];
        const [moved] = updatedItems.splice(fromIndex, 1);
        updatedItems.splice(toIndex, 0, moved);
        return { ...sec, items: updatedItems };
      }
      return sec;
    });
    handleModelChange({ ...localModel, sections: updatedSections });
  };

  const deleteItem = async (sectionId: string, itemId: string, itemOrg: string) => {
    const confirmed = await confirm({
      title: t.deleteItemTitle,
      message: t.deleteItemMsg(itemOrg.trim()),
      confirmText: t.confirmDelete,
      cancelText: t.cancel,
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
      org: category === 'edu' ? t.defaultSchool : t.defaultCompany,
      role: category === 'edu' ? t.defaultMajor : t.defaultRole,
      time: t.defaultTime,
      content: t.defaultDesc,
    };

    if (category === 'edu') {
      newItem.gpa = t.defaultGpa;
      newItem.courses = t.defaultCourses;
      newItem.honors = t.defaultHonors;
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
      const template = getStarTemplate(sectionTitle, settings?.lang || 'zh');
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
        title: t.overwriteTitle,
        message: t.overwriteMsg,
        confirmText: t.confirmImport,
        cancelText: t.cancel,
        type: 'warning'
      });
      if (confirmed) {
        applyTemplate();
      }
    } else {
      applyTemplate();
    }
  };

  return {
    localModel,
    expandedSections,
    setExpandedSections,
    showOptionalBasic,
    setShowOptionalBasic,
    t,
    handleModelChange,
    toggleSection,
    handleSectionTitleChange,
    handleSectionTextChange,
    handleSectionTypeChange,
    moveSection,
    deleteSection,
    addPresetSection,
    handleItemFieldChange,
    handleItemContentChange,
    moveItem,
    reorderItems,
    deleteItem,
    addItem,
    applyChineseEnglishSpacingToSection,
    insertStarTemplateToItem
  };
}
