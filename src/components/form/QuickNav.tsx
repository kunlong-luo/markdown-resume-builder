import React, { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import { motion } from 'motion/react';
import { FormSection } from '../../lib/form-types';
import { getSectionTheme } from '../../lib/section-themes';

interface QuickNavProps {
  sections: FormSection[];
  expandedSections: Record<string, boolean>;
  setExpandedSections: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  lang?: string;
}

const translateSectionTitle = (title: string, lang?: string) => {
  if (lang !== 'en') return title || '自定义模块';
  const lower = title?.trim().toLowerCase() || '';
  if (lower === '工作经历' || lower === 'work experience') return 'Work Experience';
  if (lower === '教育背景' || lower === 'education background') return 'Education';
  if (lower === '项目经历' || lower === 'project experience') return 'Project Experience';
  if (lower === '技能特长' || lower === 'skills & rating' || lower === '专业技能' || lower === '技能证书') return 'Skills & Ratings';
  if (lower === '自我评价' || lower === 'self evaluation') return 'Summary';
  if (lower === '荣誉奖项' || lower === 'awards') return 'Awards';
  if (lower === '社交链接' || lower === 'links') return 'Links';
  return title || 'Custom Section';
};

export function QuickNav({ sections, expandedSections, setExpandedSections, lang = 'zh' }: QuickNavProps) {
  const isEn = lang === 'en';
  const [activeSectionId, setActiveSectionId] = useState<string>('basic');
  const lastClickedRef = useRef<{ id: string; time: number } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // If a section button was clicked recently, stick to that section highlighted during scroll animation
      if (lastClickedRef.current && Date.now() - lastClickedRef.current.time < 1000) {
        setActiveSectionId(lastClickedRef.current.id);
        return;
      }

      const basicEl = document.getElementById('form-sec-basic');
      const container = basicEl?.closest('.overflow-y-auto') || basicEl?.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const sectionIds = ['basic', ...sections.map(s => s.id)];
      let bestSection = 'basic';

      // Find the last section that has scrolled past the top threshold of the container
      for (const id of sectionIds) {
        const el = document.getElementById(`form-sec-${id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const relativeTop = rect.top - containerRect.top;
          if (relativeTop <= 100) {
            bestSection = id;
          }
        }
      }

      // Edge case: If scrolled to the absolute bottom of the container, highlight the very last section
      const isAtBottom = Math.abs((container.scrollHeight - container.scrollTop) - container.clientHeight) < 15;
      if (isAtBottom && sectionIds.length > 0) {
        bestSection = sectionIds[sectionIds.length - 1];
      }

      setActiveSectionId(bestSection);
    };

    const basicEl = document.getElementById('form-sec-basic');
    const container = basicEl?.closest('.overflow-y-auto') || basicEl?.parentElement;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      
      const timer = setTimeout(handleScroll, 150);
      return () => {
        container.removeEventListener('scroll', handleScroll);
        clearTimeout(timer);
      };
    }
  }, [sections, expandedSections]);

  return (
    <div className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/80 pb-3 pt-2.5 px-6 w-full min-w-0 shrink-0">
      {/* Section Quick Jumping */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full min-w-0 py-0.5">
        <button
          onClick={() => {
            // Immediate high-response activation on click
            lastClickedRef.current = { id: 'basic', time: Date.now() };
            setActiveSectionId('basic');
            
            // Auto-expand basic info if collapsed
            if (expandedSections.basic === false) {
              setExpandedSections(prev => ({ ...prev, basic: true }));
            }
            setTimeout(() => {
              document.getElementById('form-sec-basic')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 60);
          }}
          className={`relative px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 z-10 transition-colors ${
            activeSectionId === 'basic'
              ? 'font-bold text-white'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
          }`}
        >
          {activeSectionId === 'basic' && (
            <motion.div
              layoutId="quickNavActiveCapsule"
              className="absolute inset-0 bg-indigo-600 dark:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/20 z-[-1]"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <User className={`w-3.5 h-3.5 ${activeSectionId === 'basic' ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
          <span>{isEn ? 'Basic Info' : '基本信息'}</span>
        </button>
        
        {sections.map((sec) => {
          const isActive = activeSectionId === sec.id;
          const theme = getSectionTheme(sec.title, lang);
          const Icon = theme.icon;

          return (
            <button
              key={sec.id}
              onClick={() => {
                // Immediate high-response activation on click
                lastClickedRef.current = { id: sec.id, time: Date.now() };
                setActiveSectionId(sec.id);

                // Auto-expand section if collapsed
                if (expandedSections[sec.id] === false) {
                  setExpandedSections(prev => ({ ...prev, [sec.id]: true }));
                }
                setTimeout(() => {
                  document.getElementById(`form-sec-${sec.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 60);
              }}
              className={`relative px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 z-10 transition-colors ${
                isActive
                  ? 'font-bold text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="quickNavActiveCapsule"
                  className="absolute inset-0 bg-indigo-600 dark:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/20 z-[-1]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className={`flex items-center justify-center shrink-0 ${isActive ? 'text-white' : theme.iconColor}`}>
                <Icon className="w-3.5 h-3.5" />
              </span>
              <span>{translateSectionTitle(sec.title, lang)}</span>
              {sec.type === 'items' && sec.items && sec.items.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                  {sec.items.length}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
