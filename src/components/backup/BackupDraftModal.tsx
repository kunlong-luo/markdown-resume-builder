
import React, { useState, useEffect, useRef } from 'react';
import { X, Database, History, FileJson, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeSettings, ResumeDraft } from '../../types';
import { DraftsTab } from './DraftsTab';
import { BackupTab } from './BackupTab';
import { useConfirm } from '../../context/ConfirmContext';

interface BackupDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
  settings: ResumeSettings;
  onRestore: (markdown: string, settings: ResumeSettings) => void;
}

export function BackupDraftModal({ isOpen, onClose, markdown, settings, onRestore }: BackupDraftModalProps) {
  const { confirm } = useConfirm();
  const [activeTab, setActiveTab] = useState<'drafts' | 'backup'>('drafts');
  const [drafts, setDrafts] = useState<ResumeDraft[]>([]);
  const [newDraftTitle, setNewDraftTitle] = useState('');
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [importDragActive, setImportDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadDrafts();
    }
  }, [isOpen]);

  const loadDrafts = () => {
    try {
      const saved = localStorage.getItem('resume-drafts');
      if (saved) {
        setDrafts(JSON.parse(saved));
      } else {
        setDrafts([]);
      }
    } catch (e) {
      console.error('Error loading drafts', e);
      setDrafts([]);
    }
  };

  const saveDraftsList = (updatedDrafts: ResumeDraft[]) => {
    localStorage.setItem('resume-drafts', JSON.stringify(updatedDrafts));
    setDrafts(updatedDrafts);
  };

  const showToast = (msg: string, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(''), 3000);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newDraftTitle.trim() || `草稿版 - ${new Date().toLocaleString('zh-CN', { hour12: false })}`;
    
    const newDraft: ResumeDraft = {
      id: `draft_${Date.now()}`,
      title,
      markdown,
      settings,
      timestamp: new Date().toLocaleString('zh-CN', { hour12: false }),
      isAutoSave: false
    };

    const updated = [newDraft, ...drafts];
    saveDraftsList(updated);
    setNewDraftTitle('');
    showToast('草稿保存成功！');
  };

  const handleRestoreDraft = async (draft: ResumeDraft) => {
    const isEn = settings.lang === 'en';
    const confirmed = await confirm({
      title: isEn ? 'Restore Draft' : '恢复草稿确认',
      message: isEn 
        ? `Are you sure you want to restore draft "${draft.title}"? Your current editor content and styles will be overwritten.`
        : `确认要恢复草稿「${draft.title}」吗？您当前的编辑内容和排版格式将被覆盖。`,
      confirmText: isEn ? 'Restore' : '确认恢复',
      cancelText: isEn ? 'Cancel' : '取消',
      type: 'warning'
    });
    if (confirmed) {
      onRestore(draft.markdown, draft.settings);
      showToast(isEn ? 'Draft restored successfully!' : '草稿恢复成功！');
      setTimeout(() => onClose(), 800);
    }
  };

  const handleDeleteDraft = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isEn = settings.lang === 'en';
    const confirmed = await confirm({
      title: isEn ? 'Delete Draft' : '删除草稿确认',
      message: isEn
        ? 'Are you sure you want to delete this draft? This action cannot be undone.'
        : '确定要删除这个草稿吗？此操作无法撤销。',
      confirmText: isEn ? 'Delete' : '确认删除',
      cancelText: isEn ? 'Cancel' : '取消',
      type: 'danger'
    });
    if (confirmed) {
      const updated = drafts.filter(d => d.id !== id);
      saveDraftsList(updated);
      showToast(isEn ? 'Draft deleted' : '草稿已删除');
    }
  };

  const handleSaveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editingTitle.trim()) return;
    const updated = drafts.map(d => d.id === id ? { ...d, title: editingTitle.trim() } : d);
    saveDraftsList(updated);
    setEditingDraftId(null);
    showToast('重命名成功');
  };

  const handleExportConfig = () => {
    try {
      const backupData = {
        version: "markdown-resume-backup-v1",
        exportedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
        markdown,
        settings
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      let title = 'my-resume-backup';
      const nameMatch = markdown.match(/#\s+([^\n]+)/);
      if (nameMatch && nameMatch[1]) {
        title = nameMatch[1].trim().replace(/[\\\/:*?"<>|]/g, '-');
      }

      link.href = url;
      link.setAttribute('download', `${title}_full_backup.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('配置文件导出成功！');
    } catch (e) {
      showToast('导出失败，请重试', true);
    }
  };

  const handleImportConfig = (file: File) => {
    if (!file) return;
    const isEn = settings.lang === 'en';
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      showToast(isEn ? 'Only .json files are supported' : '仅支持导入 .json 格式的备份文件', true);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        if (parsed.version !== "markdown-resume-backup-v1" || !parsed.markdown || !parsed.settings) {
          showToast(isEn ? 'Invalid resume backup file' : '非有效的简历备份文件，请检查文件格式是否正确', true);
          return;
        }

        const confirmed = await confirm({
          title: isEn ? 'Import Configuration' : '导入备份配置文件',
          message: isEn
            ? `Backup file loaded successfully (created at: ${parsed.exportedAt || 'unknown'}).\nAre you sure you want to import? This will overwrite your current content and settings.`
            : `解析成功！文件备份于: ${parsed.exportedAt || '未知时间'}。\n确认导入吗？这将覆盖您当前所有的简历内容与排版配置。`,
          confirmText: isEn ? 'Import' : '确认导入',
          cancelText: isEn ? 'Cancel' : '取消',
          type: 'warning'
        });

        if (confirmed) {
          onRestore(parsed.markdown, parsed.settings);
          showToast(isEn ? 'Configuration imported successfully!' : '备份文件导入并恢复成功！');
          setTimeout(() => onClose(), 800);
        }
      } catch (err) {
        showToast(isEn ? 'Failed to parse JSON backup' : '解析 JSON 失败，文件可能已损坏', true);
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setImportDragActive(true);
    } else if (e.type === 'dragleave') {
      setImportDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImportDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImportConfig(e.dataTransfer.files[0]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px] cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white w-full max-w-2xl h-[580px] rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col"
          >
            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-slate-800 text-base">数据存储与多版本备份 Hub</h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    管理本地草稿版本，或导出/导入合并后的完整配置文件 (包含 Markdown 与 排版参数)
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex border-b border-slate-100 px-6 bg-slate-50/50">
              <button
                onClick={() => setActiveTab('drafts')}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'drafts'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <History className="w-4 h-4" />
                <span>本地草稿版本 ({drafts.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('backup')}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'backup'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileJson className="w-4 h-4" />
                <span>完整配置备份 (.json)</span>
              </button>
            </div>

            <AnimatePresence>
              {(successMessage || errorMessage) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute top-16 left-6 right-6 z-20 p-3 rounded-xl text-xs flex items-center gap-2 shadow-md border ${
                    errorMessage 
                      ? 'bg-rose-50 border-rose-100 text-rose-800' 
                      : 'bg-emerald-50 border-emerald-100 text-emerald-800'
                  }`}
                >
                  <AlertCircle className={`w-4 h-4 ${errorMessage ? 'text-rose-600' : 'text-emerald-600'}`} />
                  <span className="font-semibold">{successMessage || errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'drafts' ? (
                <DraftsTab 
                  drafts={drafts}
                  newDraftTitle={newDraftTitle}
                  setNewDraftTitle={setNewDraftTitle}
                  handleCreateDraft={handleCreateDraft}
                  handleRestoreDraft={handleRestoreDraft}
                  editingDraftId={editingDraftId}
                  setEditingDraftId={setEditingDraftId}
                  editingTitle={editingTitle}
                  setEditingTitle={setEditingTitle}
                  handleSaveRename={handleSaveRename}
                  handleDeleteDraft={handleDeleteDraft}
                />
              ) : (
                <BackupTab 
                  handleExportConfig={handleExportConfig}
                  handleDrag={handleDrag}
                  handleDrop={handleDrop}
                  importDragActive={importDragActive}
                  fileInputRef={fileInputRef}
                  handleImportConfig={handleImportConfig}
                />
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                关闭 Hub
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
