import { useState, useEffect } from 'react';
import { formatChineseEnglishSpacing } from '../lib/format-utils';
import { FormItem, FormSection, ResumeFormModel } from '../lib/form-types';
import { parseMarkdownToForm, parseFormToMarkdown, getSectionCategory } from '../lib/markdown-parser';
import { getPresetSection, getStarTemplate } from '../lib/form-helpers';
import { useConfirm } from '../context/ConfirmContext';
import { getTranslation } from '../i18n';

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
  
  const currentLang = settings?.lang || 'zh';
  const translations = getTranslation(currentLang);
  const t = translations.form;

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
            id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            org: '',
            role: '',
            time: '',
            content: '',
          };
          if (category === 'edu') {
            newItem.degree = '';
            newItem.gpa = '';
            newItem.courses = '';
            newItem.honors = '';
          }
          return { ...sec, type: newType, items: [newItem], textValue: '' };
        } else if (newType === 'text' && !sec.textValue && sec.items.length > 0) {
          let textVal = '';
          const gpaTitle = currentLang === 'en' ? 'GPA / Performance' : '在校表现';
          const coursesTitle = currentLang === 'en' ? 'Core Courses' : '主修课程';
          const honorsTitle = currentLang === 'en' ? 'Honors & Awards' : '荣誉成就';

          sec.items.forEach(item => {
            const heading = [item.org, item.degree, item.role, item.time].filter(Boolean).join(' ｜ ');
            if (heading) {
              textVal += `### ${heading}\n`;
            }
            if (item.gpa && item.gpa.trim()) {
              textVal += `- **${gpaTitle}**：${item.gpa.trim()}\n`;
            }
            if (item.courses && item.courses.trim()) {
              textVal += `- **${coursesTitle}**：${item.courses.trim()}\n`;
            }
            if (item.honors && item.honors.trim()) {
              textVal += `- **${honorsTitle}**：${item.honors.trim()}\n`;
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
      title: t.dialogs.deleteSecTitle,
      message: t.dialogs.deleteSecMsg(sectionTitle),
      confirmText: t.dialogs.confirmDelete,
      cancelText: translations.common.cancel,
      type: 'danger'
    });
    if (confirmed) {
      const updatedSections = localModel.sections.filter(sec => sec.id !== sectionId);
      handleModelChange({ ...localModel, sections: updatedSections });
    }
  };

  const addPresetSection = (presetType: 'work' | 'project' | 'edu' | 'skills' | 'summary' | 'custom_text' | 'custom_items') => {
    const preset = getPresetSection(presetType, currentLang);
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
      title: t.dialogs.deleteItemTitle,
      message: t.dialogs.deleteItemMsg(itemOrg.trim()),
      confirmText: t.dialogs.confirmDelete,
      cancelText: translations.common.cancel,
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
    
    const newItem: FormItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      org: '',
      role: '',
      time: '',
      content: '',
    };

    if (category === 'edu') {
      newItem.degree = '';
      newItem.gpa = '';
      newItem.courses = '';
      newItem.honors = '';
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
      const template = getStarTemplate(sectionTitle, currentLang);
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
        title: t.dialogs.overwriteTitle,
        message: t.dialogs.overwriteMsg,
        confirmText: t.dialogs.confirmImport,
        cancelText: translations.common.cancel,
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
