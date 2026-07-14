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
          placeholder={isEn ? "Enter draft label or description (e.g., Core Refined / English-Ver-2026)..." : "输入草稿备注 (如: 精简版、去除期望薪资)..."}
          value={newDraftTitle}
          onChange={(e) => setNewDraftTitle(e.target.value)}
          className="flex-1 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all shadow-inner"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm shadow-indigo-600/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isEn ? 'Save as Draft' : '保存草稿'}</span>
        </button>
      </form>

      {/* Drafts List */}
      <div className="flex-1 min-h-[240px] overflow-y-auto border border-slate-100/80 rounded-xl bg-slate-50/20 p-2 space-y-2">
        {drafts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
            <div className="p-3 bg-white border border-slate-100 rounded-full shadow-sm text-slate-300">
              <History className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-xs font-bold text-slate-700">{isEn ? 'No local drafts found yet' : '暂无本地草稿'}</p>
              <p className="text-[11px] text-slate-400 max-w-[320px] mx-auto leading-relaxed">
                {isEn 
                  ? 'Type a descriptive name above and click save to persist your current content and typography settings securely in this browser.'
                  : '在上方输入名称，可将当前文字与排版配置保存在本地浏览器中。'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                onClick={() => handleRestoreDraft(draft)}
                className="group p-4 bg-white border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md"
              >
                <div className="space-y-1.5 pr-4 flex-1 min-w-0">
                  {editingDraftId === draft.id ? (
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        autoFocus
                      />
                      <button
                        onClick={(e) => handleSaveRename(draft.id, e)}
                        className="p-1 hover:bg-emerald-100 rounded text-emerald-600"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingDraftId(null); }}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-slate-800 text-xs truncate group-hover:text-indigo-950 transition-colors">
                        {draft.title}
                      </span>
                      {draft.isAutoSave && (
                        <span className="px-1.5 py-0.5 bg-amber-50 border border-amber-100 text-amber-700 text-[9px] rounded font-bold shrink-0">
                          {isEn ? 'Autosaved' : '自动保存'}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-300 shrink-0" />
                      {draft.timestamp}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-slate-300 shrink-0" />
                      {draft.markdown.length} {isEn ? 'Chars' : '字符'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Settings className="w-3 h-3 text-slate-300 shrink-0" />
                      <span>{isEn ? 'Style:' : '样式:'} {draft.settings.themeColor} · {draft.settings.fontSize}</span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingDraftId(draft.id);
                      setEditingTitle(draft.title);
                    }}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-[10px] font-bold"
                    title={isEn ? "Rename draft" : "重命名草稿"}
                  >
                    {isEn ? 'Rename' : '重命名'}
                  </button>
                  <button
                    onClick={(e) => handleDeleteDraft(draft.id, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title={isEn ? "Delete draft" : "删除本草稿"}
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
