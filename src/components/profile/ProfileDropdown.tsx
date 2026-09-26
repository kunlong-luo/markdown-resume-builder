import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, 
  ChevronDown, 
  Check, 
  Copy, 
  Trash2, 
  Edit2, 
  ExternalLink,
  LayoutTemplate,
  FilePlus
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { TEMPLATES } from '../../data';
import { Tooltip } from '../ui/Tooltip';

interface ProfileDropdownProps {
  lang?: string;
  isCompact?: boolean;
}

export function ProfileDropdown({ lang, isCompact }: ProfileDropdownProps) {
  const isEn = lang === 'en';
  const { 
    profiles, 
    activeProfileId, 
    switchProfile, 
    duplicateProfile, 
    createProfile,
    renameProfile, 
    deleteProfile,
    setIsBackupHubOpen
  } = useResumeStore();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setEditingId(null);
        setConfirmDeleteId(null);
        setShowTemplates(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus and select input text when entering edit mode
  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  // Save inline edit
  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      renameProfile(id, editName.trim());
    }
    setEditingId(null);
  };

  // 1-Click: Duplicate current profile and switch to it immediately
  const handleFastDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newProfile = duplicateProfile(activeProfileId);
    setEditingId(newProfile.id);
    setEditName(newProfile.name);
  };

  // 1-Click: Create new blank profile and switch immediately
  const handleFastBlank = (e: React.MouseEvent) => {
    e.stopPropagation();
    const count = profiles.length + 1;
    const blankMd = `# 姓名\n求职岗位 ｜ 138-0000-0000 ｜ email@example.com\n\n## 个人优势\n- 掌握核心专业技能与工程实践，具备扎实的专业基础与快速学习能力\n\n## 工作经历\n### 科技企业 · 岗位名称  *2022.06 — 至今*\n- **核心业务贡献**：负责核心系统研发与架构优化，主导关键指标达成\n- **性能优化突破**：重构核心模块，使响应耗时降低 40%，系统稳定性达 99.99%\n\n## 教育背景\n### 知名大学 · 本科 ｜ 计算机科学与技术  *2018.09 — 2022.06*\n`;
    const newProfile = createProfile({
      name: `${isEn ? 'Resume Version' : '简历档案'} ${count}`,
      targetRole: isEn ? 'New Role' : '求职版',
      markdown: blankMd
    });
    setEditingId(newProfile.id);
    setEditName(newProfile.name);
  };

  // 1-Click: Create profile directly from template
  const handleCreateFromTemplate = (templateId: string) => {
    const tpl = TEMPLATES.find(t => t.id === templateId);
    if (!tpl) return;
    createProfile({
      name: `${tpl.name}`,
      targetRole: tpl.category,
      markdown: tpl.content
    });
    setShowTemplates(false);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <Tooltip 
        content={isEn ? 'Switch or duplicate resume profiles' : '多简历档案库：一键切换或复制版本'}
        disabled={!isCompact}
      >
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="resume-profile-panel"
          onClick={() => {
            setIsOpen(!isOpen);
            setConfirmDeleteId(null);
          }}
          className={`group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
            isOpen
              ? 'border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-700 dark:text-indigo-300'
              : 'border-slate-200/90 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-600'
          }`}
        >
          <div className="w-5 h-5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-850">
            <Layers className="w-3 h-3" />
          </div>

          <div className="flex items-center gap-1.5 min-w-0 max-w-[130px] sm:max-w-[190px]">
            <span className="truncate text-slate-800 dark:text-slate-100 font-extrabold text-[11px] sm:text-xs">
              {activeProfile ? activeProfile.name : (isEn ? 'Profiles' : '档案库')}
            </span>
            {activeProfile?.targetRole && !isCompact && (
              <span className="hidden md:inline-block px-1.5 py-0.2 text-[9px] font-bold bg-slate-100 dark:bg-slate-700/80 text-slate-500 dark:text-slate-300 rounded border border-slate-200/60 dark:border-slate-600/60 truncate max-w-[65px]">
                {activeProfile.targetRole}
              </span>
            )}
          </div>

          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''}`} />
        </button>
      </Tooltip>

      {/* Dropdown Menu - Level fixed with z-[100] and absolute left-0 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="resume-profile-panel"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="absolute left-0 top-full mt-1.5 w-80 sm:w-88 rounded-2xl bg-white dark:bg-slate-850 shadow-2xl border border-slate-200/90 dark:border-slate-750/90 z-[100] overflow-hidden"
          >
          {/* Header & 1-Click Actions Bar */}
          <div className="p-3 bg-slate-50/80 dark:bg-slate-800/70 border-b border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                  {isEn ? 'Resume Profiles' : '简历档案库'}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {profiles.length}
                </span>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsBackupHubOpen(true);
                }}
                className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-0.5 transition-colors cursor-pointer"
              >
                <span>{isEn ? 'Manage' : '全景管理'}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* 1-Click Fast Action Buttons */}
            <div className="grid grid-cols-2 gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={handleFastDuplicate}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 text-[11px] font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                <Copy className="w-3 h-3" />
                <span>{isEn ? 'Copy' : '复制'}</span>
              </button>

              <button
                type="button"
                onClick={handleFastBlank}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-[11px] font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                <FilePlus className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{isEn ? 'New' : '新建'}</span>
              </button>
            </div>
          </div>

          {/* Profile List: 1-Click to Switch */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5">
            {profiles.map((p) => {
              const isActive = p.id === activeProfileId;
              const isEditing = editingId === p.id;
              const isConfirmingDelete = confirmDeleteId === p.id;

              if (isEditing) {
                return (
                  <div
                    key={p.id}
                    className="p-1.5 rounded-xl border border-indigo-400 dark:border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 animate-in fade-in duration-150"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(p.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      onBlur={() => handleSaveEdit(p.id)}
                      placeholder={isEn ? 'Profile name' : '输入档案名称（回车保存）'}
                      className="w-full text-xs font-bold px-2 py-1 bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <div className="text-[10px] text-slate-400 px-1 pt-1 flex justify-between">
                      <span>{isEn ? 'Enter to save, Esc to cancel' : '回车或点击空白自动保存'}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    switchProfile(p.id);
                    setIsOpen(false);
                  }}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/70 text-indigo-950 dark:text-indigo-100 font-bold border border-indigo-200/80 dark:border-indigo-800/70 shadow-2xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/90 dark:hover:bg-slate-800/90 border border-transparent'
                  }`}
                >
                  {/* Left: Active Indicator & Title */}
                  <div className="flex items-center gap-2 min-w-0 flex-1 pr-1">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isActive 
                        ? 'bg-indigo-600 text-white' 
                        : 'border border-slate-300 dark:border-slate-600 text-transparent group-hover:border-slate-400'
                    }`}>
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span 
                          className="text-xs truncate font-extrabold text-slate-800 dark:text-slate-100"
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            setEditingId(p.id);
                            setEditName(p.name);
                          }}
                        >
                          {p.name}
                        </span>
                        {p.targetRole && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold shrink-0 ${
                            isActive
                              ? 'bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200'
                              : 'bg-slate-100 dark:bg-slate-750 text-slate-500 dark:text-slate-400'
                          }`}>
                            {p.targetRole}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Hover / Quick Actions */}
                  <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1 animate-in fade-in duration-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProfile(p.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded hover:bg-red-700 transition-colors"
                        >
                          {isEn ? 'Delete?' : '确认删除'}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(null);
                          }}
                          className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] rounded hover:bg-slate-300"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip content={isEn ? 'Duplicate' : '复制档案'} side="top">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateProfile(p.id);
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </Tooltip>

                        <Tooltip content={isEn ? 'Rename' : '重命名'} side="top">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(p.id);
                              setEditName(p.name);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </Tooltip>

                        {profiles.length > 1 && (
                          <Tooltip content={isEn ? 'Delete' : '删除档案'} side="top">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDeleteId(p.id);
                              }}
                              className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Template Picker (1-Click without heavy modal) */}
          <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
            <button
              type="button"
              onClick={() => setShowTemplates(!showTemplates)}
              className="w-full px-3 py-2 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <LayoutTemplate className="w-3 h-3 text-purple-500" />
                <span>{isEn ? 'Fast load from benchmark templates...' : '快速选用标杆模板创建...'}</span>
              </div>
              <ChevronDown className={`w-3 h-3 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
            </button>

            {showTemplates && (
              <div className="p-2 pt-0 space-y-1 animate-in fade-in duration-150">
                {TEMPLATES.slice(0, 4).map(tpl => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleCreateFromTemplate(tpl.id)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <span className="truncate">{tpl.name}</span>
                    <span className="text-[9px] px-1 rounded bg-slate-100 dark:bg-slate-750 text-slate-400 group-hover:text-indigo-500 shrink-0">
                      {tpl.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
}
