import React from 'react';
import { History, Plus, Clock, FileText, Settings, Check, X, Trash2 } from 'lucide-react';
import { ResumeDraft } from '../../types';

interface DraftsTabProps {
  drafts: ResumeDraft[];
  newDraftTitle: string;
  setNewDraftTitle: (val: string) => void;
  handleCreateDraft: (e: React.FormEvent) => void;
  handleRestoreDraft: (draft: ResumeDraft) => void;
  editingDraftId: string | null;
  setEditingDraftId: (id: string | null) => void;
  editingTitle: string;
  setEditingTitle: (val: string) => void;
  handleSaveRename: (id: string, e: React.MouseEvent) => void;
  handleDeleteDraft: (id: string, e: React.MouseEvent) => void;
  lang?: string;
}

export function DraftsTab({
  drafts,
  newDraftTitle,
  setNewDraftTitle,
  handleCreateDraft,
  handleRestoreDraft,
  editingDraftId,
  setEditingDraftId,
  editingTitle,
  setEditingTitle,
  handleSaveRename,
  handleDeleteDraft,
  lang
}: DraftsTabProps) {
  const isEn = lang === 'en';

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Create New Draft Form */}
      <form onSubmit={handleCreateDraft} className="flex gap-2">
        <input
          type="text"
          placeholder={isEn ? "Enter draft label or description (e.g., Core Refined / English-Ver-2026)..." : "输入新草稿标签或版本说明 (例如: 精简版2026 / 重心优化版)..."}
          value={newDraftTitle}
          onChange={(e) => setNewDraftTitle(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 shadow-sm shadow-indigo-600/10 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isEn ? 'Save as Draft' : '保存当前为新草稿'}</span>
        </button>
      </form>

      {/* Drafts List */}
      <div className="flex-1 min-h-[220px] overflow-y-auto border border-slate-100 rounded-xl bg-slate-50/30">
        {drafts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
            <History className="w-10 h-10 text-slate-300 stroke-[1.5]" />
            <p className="text-xs">{isEn ? 'No local drafts found yet' : '暂无本地历史草稿版本'}</p>
            <p className="text-[10px] text-slate-400 max-w-[280px] text-center">
              {isEn 
                ? 'Type a name above and click save to persist your current content and typography settings securely in this browser.'
                : '可在上方输入名称并点击保存，将当前的文字内容与全部排版样式持久保存在浏览器中。'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                onClick={() => handleRestoreDraft(draft)}
                className="group p-4 flex items-center justify-between hover:bg-indigo-50/40 transition-colors cursor-pointer"
              >
                <div className="space-y-1 pr-4 flex-1">
                  {editingDraftId === draft.id ? (
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={(e) => handleSaveRename(draft.id, e)}
                        className="p-1 hover:bg-emerald-100 rounded text-emerald-600"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingDraftId(null); }}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 text-xs group-hover:text-indigo-900 transition-colors">
                        {draft.title}
                      </span>
                      {draft.isAutoSave && (
                        <span className="px-1.5 py-0.5 bg-amber-50 border border-amber-100 text-amber-700 text-[9px] rounded font-bold">
                          {isEn ? 'Autosaved' : '自动保存'}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-300" />
                      {draft.timestamp}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-slate-300" />
                      {draft.markdown.length} {isEn ? 'Chars' : '字符'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Settings className="w-3 h-3 text-slate-300" />
                      Style: {draft.settings.themeColor}/{draft.settings.fontSize}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingDraftId(draft.id);
                      setEditingTitle(draft.title);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors text-[10px] font-bold"
                    title={isEn ? "Rename draft" : "重命名草稿"}
                  >
                    {isEn ? 'Rename' : '重命名'}
                  </button>
                  <button
                    onClick={(e) => handleDeleteDraft(draft.id, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title={isEn ? "Delete draft" : "删除草稿"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
