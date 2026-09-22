import React, { useState, useRef } from 'react';
import { 
  Layers, 
  Check, 
  Plus, 
  Copy, 
  Trash2, 
  Edit2, 
  Download, 
  Upload, 
  FileText, 
  GitCompare, 
  ExternalLink,
  Sparkles,
  Calendar,
  Tag
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { ResumeProfile } from '../../types';
import { NewProfileModal } from '../profile/NewProfileModal';

interface ProfilesTabProps {
  lang?: string;
  showToast: (msg: string, isError?: boolean) => void;
}

export function ProfilesTab({ lang, showToast }: ProfilesTabProps) {
  const isEn = lang === 'en';
  const { 
    profiles, 
    activeProfileId, 
    switchProfile, 
    duplicateProfile, 
    createProfile,
    renameProfile, 
    deleteProfile,
    importProfiles
  } = useResumeStore();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  
  // Comparison modal state
  const [compareTargetId, setCompareTargetId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  const handleFastDuplicate = () => {
    const dup = duplicateProfile(activeProfileId);
    showToast(isEn ? `Duplicated as "${dup.name}"` : `已一键复制副本「${dup.name}」并自动切换`);
  };

  const handleFastBlank = () => {
    const count = profiles.length + 1;
    const blankMd = `# 姓名\n求职岗位 ｜ 138-0000-0000 ｜ email@example.com\n\n## 个人优势\n- 掌握核心专业技能与工程实践，具备扎实的专业基础与快速学习能力\n\n## 工作经历\n### 科技企业 · 岗位名称  *2022.06 — 至今*\n- **核心业务贡献**：负责核心系统研发与架构优化，主导关键指标达成\n\n## 教育背景\n### 知名大学 · 本科 ｜ 计算机专业  *2018.09 — 2022.06*\n`;
    const newProfile = createProfile({
      name: `${isEn ? 'Resume Version' : '简历档案'} ${count}`,
      targetRole: isEn ? 'New Role' : '求职版',
      markdown: blankMd
    });
    showToast(isEn ? `Created "${newProfile.name}"` : `已新建「${newProfile.name}」并自动切换`);
  };

  const handleStartEdit = (p: ResumeProfile) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditRole(p.targetRole || '');
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      renameProfile(id, editName.trim(), editRole.trim() || undefined);
      showToast(isEn ? 'Profile updated' : '简历档案信息已更新');
    }
    setEditingId(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (profiles.length <= 1) {
      showToast(isEn ? 'Cannot delete the only remaining profile' : '至少需要保留一份简历档案，无法删除', true);
      return;
    }
    if (window.confirm(isEn ? `Are you sure you want to delete profile "${name}"?` : `确认删除档案「${name}」吗？`)) {
      deleteProfile(id);
      showToast(isEn ? 'Profile deleted' : '档案已删除');
    }
  };

  const handleDuplicate = (id: string) => {
    const dup = duplicateProfile(id);
    showToast(isEn ? `Duplicated as "${dup.name}"` : `已创建副本「${dup.name}」并自动切换`);
  };

  // Export all profiles as JSON file
  const handleExportAll = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profiles, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `resume_profiles_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast(isEn ? 'All profiles exported successfully' : '所有简历档案已打包导出为 JSON 文件');
    } catch (e) {
      showToast(isEn ? 'Export failed' : '导出失败', true);
    }
  };

  // Import profiles from JSON file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].markdown) {
          importProfiles(parsed);
          showToast(isEn ? `Imported ${parsed.length} profiles successfully` : `成功导入 ${parsed.length} 份简历档案并自动就绪`);
        } else {
          showToast(isEn ? 'Invalid profile archive format' : '档案备份文件格式不符合要求', true);
        }
      } catch (err) {
        showToast(isEn ? 'Failed to parse JSON file' : '解析 JSON 文件失败，请检查文件格式', true);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const compareTarget = profiles.find(p => p.id === compareTargetId);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
      {/* Top Banner / Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-slate-50/60 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900 border border-indigo-100/80 dark:border-indigo-900/60 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-indigo-600 text-white shrink-0">
              <Layers className="w-3.5 h-3.5" />
            </span>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              {isEn ? 'Multi-Profile Archive Hub' : '多简历独立档案库'}
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {profiles.length} {isEn ? 'Profiles' : '份独立档案'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isEn
              ? 'Save distinct resume versions (e.g., Tech Lead, Frontend, English CV) with separate styles and filenames.'
              : '针对不同企业或岗位（如：大厂自研版、外企英文版、技术管理版）独立保存排版、主题色与内容，支持秒切。'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={handleFastDuplicate}
            className="px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            title={isEn ? 'Clone active resume' : '一键复制当前正在编辑的档案'}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{isEn ? 'Clone Active' : '复制当前'}</span>
          </button>
          <button
            onClick={handleFastBlank}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            title={isEn ? 'New blank resume' : '一键新建空白简历'}
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isEn ? 'New Blank' : '新建空白'}</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            title={isEn ? 'Import profiles from JSON' : '从本地导入档案备份'}
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isEn ? 'Import' : '导入'}</span>
          </button>
          <button
            onClick={handleExportAll}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            title={isEn ? 'Export all profiles' : '导出全部档案备份'}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isEn ? 'Export' : '备份导出'}</span>
          </button>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {profiles.map((p) => {
          const isActive = p.id === activeProfileId;
          const isEditing = editingId === p.id;
          const previewLines = p.markdown
            .split('\n')
            .filter(line => line.trim().length > 0 && !line.startsWith('##'))
            .slice(0, 3)
            .join(' · ')
            .replace(/[#*`]+/g, '');

          return (
            <div
              key={p.id}
              className={`relative rounded-2xl border p-4 flex flex-col justify-between transition-all duration-200 ${
                isActive
                  ? 'bg-white dark:bg-slate-850 border-indigo-500/80 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-750 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xs'
              }`}
            >
              {/* Top Row: Name, Tag, Active Pill */}
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(p.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          className="w-full text-xs font-bold px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-indigo-400 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none"
                          autoFocus
                        />
                        <input
                          type="text"
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(p.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          placeholder={isEn ? 'Target role tag' : '岗位标签'}
                          className="w-full text-[11px] px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 focus:outline-none"
                        />
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={() => handleSaveEdit(p.id)}
                            className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-bold"
                          >
                            {isEn ? 'Save' : '保存'}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px]"
                          >
                            {isEn ? 'Cancel' : '取消'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h5 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100 tracking-tight truncate">
                            {p.name}
                          </h5>
                          {p.targetRole && (
                            <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-slate-100 dark:bg-slate-750 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                              {p.targetRole}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
                          {previewLines || (isEn ? 'No content preview' : '暂无内容概要')}
                        </p>
                      </div>
                    )}
                  </div>

                  {isActive ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800 flex items-center gap-1 shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>{isEn ? 'Active' : '正在编辑'}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        switchProfile(p.id);
                        showToast(isEn ? `Switched to "${p.name}"` : `已切换为「${p.name}」`);
                      }}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer"
                    >
                      {isEn ? 'Switch' : '切换'}
                    </button>
                  )}
                </div>

                {/* Metadata tags */}
                <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Active'}</span>
                  </span>
                  <span>·</span>
                  <span className="capitalize">
                    {p.settings?.themeColor || 'Indigo'} · {p.settings?.fontSize || 'Standard'}
                  </span>
                </div>
              </div>

              {/* Bottom Actions Toolbar */}
              <div className="flex items-center justify-between gap-1 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDuplicate(p.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50 transition-colors"
                    title={isEn ? 'Duplicate as new profile' : '复制为独立副本'}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleStartEdit(p)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                    title={isEn ? 'Rename profile' : '重命名档案'}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {!isActive && (
                    <button
                      onClick={() => setCompareTargetId(p.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-950/50 transition-colors"
                      title={isEn ? 'Compare with active profile' : '与当前档案进行内容对比'}
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {profiles.length > 1 && (
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/50 transition-colors"
                    title={isEn ? 'Delete profile' : '删除此档案'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Modal */}
      {compareTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-850 rounded-2xl max-w-3xl w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-purple-600" />
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  {isEn ? 'Profile Comparison' : '档案内容双向对比'}
                </h4>
              </div>
              <button
                onClick={() => setCompareTargetId(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 flex-1 overflow-hidden">
              <div className="flex flex-col h-full border border-slate-200 dark:border-slate-750 rounded-xl overflow-hidden">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 border-b border-indigo-100 dark:border-indigo-900">
                  {isEn ? 'Current Active' : '当前激活'}: {activeProfile.name}
                </div>
                <div className="p-3 font-mono text-[11px] overflow-y-auto whitespace-pre-wrap bg-slate-50/50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex-1">
                  {activeProfile.markdown}
                </div>
              </div>

              <div className="flex flex-col h-full border border-slate-200 dark:border-slate-750 rounded-xl overflow-hidden">
                <div className="p-2 bg-purple-50 dark:bg-purple-950/60 text-xs font-bold text-purple-700 dark:text-purple-300 border-b border-purple-100 dark:border-purple-900">
                  {isEn ? 'Compared Profile' : '对比目标'}: {compareTarget.name}
                </div>
                <div className="p-3 font-mono text-[11px] overflow-y-auto whitespace-pre-wrap bg-slate-50/50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex-1">
                  {compareTarget.markdown}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCompareTargetId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
              >
                {isEn ? 'Close' : '关闭'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Profile Modal */}
      <NewProfileModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
