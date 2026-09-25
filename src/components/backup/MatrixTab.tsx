import React, { useState, useEffect, useMemo } from 'react';
import { 
  Folder, FolderOpen, GitCompare, Share2, Lock, Eye, EyeOff, Copy, Check, Trash2, Plus, Shield, ShieldCheck, Loader2
} from 'lucide-react';
import { ResumeSettings, ResumeDraft } from '../../types';
import {
  generateShareUrl,
  SHARE_PASSWORD_MAX_LENGTH,
  SHARE_PASSWORD_MIN_LENGTH,
  type ShareState,
} from '../../lib/share-utils';
import { splitMarkdownIntoSections } from '../../lib/markdown-utils';
import { CustomSelect } from '../ui/CustomSelect';
import { storage, STORAGE_KEYS } from '../../lib/storage';
import { trackAnalyticsEvent } from '../../lib/analytics';

interface MatrixTabProps {
  currentMarkdown: string;
  currentSettings: ResumeSettings;
  onRestore: (markdown: string, settings: ResumeSettings) => void;
  lang?: string;
  showToast: (msg: string, isError?: boolean) => void;
}

export function MatrixTab({ currentMarkdown, currentSettings, onRestore, lang, showToast }: MatrixTabProps) {
  const isEn = lang === 'en';

  // 1. Manage Role-Specific Folders / Resume Matrix
  const [matrixVersions, setMatrixVersions] = useState<ResumeDraft[]>([]);
  const [newVersionName, setNewVersionName] = useState('');
  const [isCreatingVersion, setIsCreatingVersion] = useState(false);

  // 2. Comparison States
  const [compareWithId, setCompareWithId] = useState<string>('');
  const [showCompareModal, setShowCompareModal] = useState(false);

  // 3. Share Settings States
  const [selectedVersionIdForShare, setSelectedVersionIdForShare] = useState<string>('');
  const [sharePassword, setSharePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);

  // Load from storage
  useEffect(() => {
    try {
      const saved = storage.get<ResumeDraft[] | null>(STORAGE_KEYS.MATRIX, null);
      if (saved && Array.isArray(saved) && saved.length > 0) {
        setMatrixVersions(saved);
      } else {
        // Seed default template folders to show user how they look
        const defaultSeeds: ResumeDraft[] = [
          {
            id: 'matrix_seed_frontend',
            title: isEn ? 'Frontend Engineer Version' : '前端开发岗位版',
            markdown: currentMarkdown.replace('# 姓名', '# 姓名 ｜ 前端研发工程师'),
            settings: { ...currentSettings, themeColor: 'blue' },
            timestamp: new Date().toLocaleString(isEn ? 'en-US' : 'zh-CN', { hour12: false }),
            isAutoSave: false
          },
          {
            id: 'matrix_seed_fullstack',
            title: isEn ? 'Fullstack Dev Version' : '全栈工程师岗位版',
            markdown: currentMarkdown.replace('# 姓名', '# 姓名 ｜ 核心全栈技术负责人'),
            settings: { ...currentSettings, themeColor: 'indigo' },
            timestamp: new Date().toLocaleString(isEn ? 'en-US' : 'zh-CN', { hour12: false }),
            isAutoSave: false
          }
        ];
        storage.set(STORAGE_KEYS.MATRIX, defaultSeeds);
        setMatrixVersions(defaultSeeds);
      }
    } catch (e) {
      console.error('Error loading resume matrix', e);
    }
  }, [lang]);

  const saveMatrix = (updated: ResumeDraft[]) => {
    storage.set(STORAGE_KEYS.MATRIX, updated);
    setMatrixVersions(updated);
  };

  const handleCreateVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionName.trim()) return;

    const newVersion: ResumeDraft = {
      id: `matrix_${Date.now()}`,
      title: newVersionName.trim(),
      markdown: currentMarkdown,
      settings: currentSettings,
      timestamp: new Date().toLocaleString(isEn ? 'en-US' : 'zh-CN', { hour12: false }),
      isAutoSave: false
    };

    const updated = [newVersion, ...matrixVersions];
    saveMatrix(updated);
    setNewVersionName('');
    setIsCreatingVersion(false);
    showToast(isEn ? 'New targeted version folder created!' : '成功创建新版本！');
  };

  const handleDeleteVersion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(isEn ? 'Delete this resume version?' : '确定要彻底删除该简历版本吗？')) {
      const updated = matrixVersions.filter(v => v.id !== id);
      saveMatrix(updated);
      showToast(isEn ? 'Version deleted' : '版本已删除');
      if (selectedVersionIdForShare === id) {
        setGeneratedLink('');
      }
    }
  };

  const handleLoadVersion = (version: ResumeDraft) => {
    if (confirm(isEn ? `Switch editor to "${version.title}"? Your unsaved current changes in active editor will be replaced.` : `确认要切换当前编辑区到「${version.title}」吗？未保存的当前改动将被替换。`)) {
      onRestore(version.markdown, version.settings);
      showToast(isEn ? 'Version loaded into editor' : '版本已成功载入编辑区');
    }
  };

  // 4. One-Click Comparison Logic
  const comparisonDiffs = useMemo(() => {
    if (!compareWithId) return null;
    const targetVersion = matrixVersions.find(v => v.id === compareWithId);
    if (!targetVersion) return null;

    // Compare major sections between current active editor resume and target version
    const currentParsed = splitMarkdownIntoSections(currentMarkdown);
    const targetParsed = splitMarkdownIntoSections(targetVersion.markdown);

    const currentSectionsMap = new Map(currentParsed.sections.map(s => [s.title, s.content]));
    const targetSectionsMap = new Map(targetParsed.sections.map(s => [s.title, s.content]));

    // Find section differences
    const allTitles = Array.from(new Set([
      ...currentParsed.sections.map(s => s.title),
      ...targetParsed.sections.map(s => s.title)
    ]));

    const diffList = allTitles.map(title => {
      const currContent = currentSectionsMap.get(title) || '';
      const targetContent = targetSectionsMap.get(title) || '';
      const isDifferent = currContent.trim() !== targetContent.trim();

      return {
        title,
        currContent,
        targetContent,
        status: !currContent ? 'added_in_target' : (!targetContent ? 'removed_in_target' : (isDifferent ? 'modified' : 'identical'))
      };
    });

    return {
      targetTitle: targetVersion.title,
      diffList
    };
  }, [compareWithId, currentMarkdown, matrixVersions]);

  // 5. Generate Share Logic
  const handleGenerateShare = async (version: ResumeDraft) => {
    const password = sharePassword.trim();

    if (
      password &&
      (password.length < SHARE_PASSWORD_MIN_LENGTH ||
        password.length > SHARE_PASSWORD_MAX_LENGTH)
    ) {
      setGeneratedLink('');
      showToast(
        isEn
          ? `Encrypted share passwords must be ${SHARE_PASSWORD_MIN_LENGTH}-${SHARE_PASSWORD_MAX_LENGTH} characters`
          : `加密分享密码需要 ${SHARE_PASSWORD_MIN_LENGTH}-${SHARE_PASSWORD_MAX_LENGTH} 个字符`,
        true,
      );
      return;
    }

    setSelectedVersionIdForShare(version.id);
    setGeneratedLink('');
    setCopied(false);
    setIsGeneratingShare(true);

    try {
      const state: ShareState = {
        markdown: version.markdown,
        settings: version.settings,
      };
      const url = await generateShareUrl(state, password || undefined);
      setGeneratedLink(url);
      trackAnalyticsEvent('share_created');
    } catch (error) {
      console.error('Failed to generate share link', error);
      showToast(
        isEn
          ? 'Failed to generate the share link in this browser'
          : '当前浏览器无法生成分享链接，请重试',
        true,
      );
    } finally {
      setIsGeneratingShare(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    showToast(isEn ? 'Share link copied!' : '专属分享链接已成功复制！');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 h-full flex flex-col text-slate-700 dark:text-slate-200">
      
      {/* Upper Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-1 scrollbar-thin">
        
        {/* Left Side: Versions List */}
        <div className="space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{isEn ? 'Targeted Resume Folders' : '版本列表'}</span>
            </h4>
            
            {!isCreatingVersion && (
              <button
                onClick={() => setIsCreatingVersion(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/80 rounded-lg transition-all cursor-pointer active:scale-95 border border-indigo-100/50 dark:border-indigo-800/60"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isEn ? 'New Version' : '新建版本'}</span>
              </button>
            )}
          </div>

          {isCreatingVersion && (
            <form onSubmit={handleCreateVersion} className="flex gap-2 p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 animate-in fade-in slide-in-from-top-1.5 duration-250">
              <input
                type="text"
                placeholder={isEn ? "e.g., Python Backend Dev" : "输入版本名称 (如: 算法工程师、外企版)..."}
                value={newVersionName}
                onChange={(e) => setNewVersionName(e.target.value)}
                className="flex-1 bg-white dark:bg-slate-750 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
                required
                autoFocus
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm active:scale-95"
              >
                {isEn ? 'Create' : '创建'}
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingVersion(false)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs rounded-lg transition-colors"
              >
                {isEn ? 'Cancel' : '取消'}
              </button>
            </form>
          )}

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px] scrollbar-thin pr-0.5">
            {matrixVersions.map((version) => {
              const isSelectedForShare = selectedVersionIdForShare === version.id;
              
              // Map the theme colors to accurate border/accent colors
              const themeColorName = version.settings?.themeColor || 'indigo';
              const colorMap: Record<string, { border: string, bg: string, text: string }> = {
                blue: { border: 'border-l-blue-500', bg: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
                indigo: { border: 'border-l-indigo-500', bg: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400' },
                purple: { border: 'border-l-purple-500', bg: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400' },
                emerald: { border: 'border-l-emerald-500', bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
                rose: { border: 'border-l-rose-500', bg: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
                amber: { border: 'border-l-amber-500', bg: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
                teal: { border: 'border-l-teal-500', bg: 'bg-teal-500', text: 'text-teal-600 dark:text-teal-400' },
                slate: { border: 'border-l-slate-500', bg: 'bg-slate-500', text: 'text-slate-600 dark:text-slate-400' },
              };
              const colorInfo = colorMap[themeColorName] || colorMap.indigo;

              return (
                <div
                  key={version.id}
                  onClick={() => handleLoadVersion(version)}
                  className={`group p-4 rounded-xl border-l-4 border-y border-r transition-all duration-250 cursor-pointer flex items-center justify-between shadow-sm hover:shadow ${
                    isSelectedForShare
                      ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/30 shadow-indigo-100/50'
                      : `border-slate-100 dark:border-slate-700 hover:border-slate-200/80 dark:hover:border-slate-600 bg-white dark:bg-slate-800 ${colorInfo.border}`
                  }`}
                >
                  <div className="min-w-0 pr-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <Folder className={`w-4 h-4 ${colorInfo.text} group-hover:scale-110 transition-transform shrink-0`} />
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                        {version.title}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded font-bold uppercase">
                        {themeColorName}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                      <span>{isEn ? 'Updated at' : '更新时间'}: {version.timestamp}</span>
                      <span>·</span>
                      <span>{version.markdown.length} {isEn ? 'Chars' : '字符'}</span>
                    </p>
                  </div>

                  {/* Actions inside matrix item */}
                  <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleGenerateShare(version)}
                      className="p-1.5 px-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-bold text-[10px] flex items-center gap-1.5 transition-all cursor-pointer border border-indigo-100/40 dark:border-indigo-800/40"
                      title={isEn ? "Generate exclusive share page" : "分享该版本"}
                    >
                      <Share2 className="w-3 h-3" />
                      <span>{isEn ? 'Share' : '分享'}</span>
                    </button>
                    <button
                      onClick={(e) => handleDeleteVersion(version.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      title={isEn ? "Delete version" : "删除本版本"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Comparisons and QR/Link Generation */}
        <div className="space-y-4 flex flex-col bg-slate-50/50 dark:bg-slate-850 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-inner">
          
          {/* Section 1: Comparison Selector */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isEn ? 'One-Click Matrix Comparison' : '版本差异比对'}</span>
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              {isEn ? 'Compare section structures & modified texts with other versions side-by-side' : '可视化比对当前简历与其它版本的正文及排版差异。'}
            </p>
            <div className="flex gap-2">
              <CustomSelect
                value={compareWithId}
                onChange={(val) => setCompareWithId(val)}
                options={matrixVersions.map(v => ({ value: v.id, label: v.title }))}
                placeholder={isEn ? '-- Select version to compare --' : '-- 选择一个对比版本 --'}
                size="sm"
                className="flex-1"
                triggerClassName="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-3 py-2 text-xs shadow-sm"
              />
              {compareWithId && (
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-emerald-600/10"
                >
                  <Eye className="w-4 h-4" />
                  <span>{isEn ? 'Compare' : '开始比对'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 2: Link Share & Password Lock */}
          <div className="border-t border-slate-200/60 dark:border-slate-700 pt-4 space-y-4 flex-1 flex flex-col justify-end">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{isEn ? 'Share Link & Optional Encryption' : '链接分享与可选加密'}</span>
            </h4>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                {isEn ? 'Optional encryption password (leave empty for public access)' : '可选加密密码（留空为公开访问）'}
              </label>
              <div className="flex gap-1.5 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={isEn ? `Leave empty, or use ${SHARE_PASSWORD_MIN_LENGTH}-${SHARE_PASSWORD_MAX_LENGTH} chars` : `留空公开分享，或输入 ${SHARE_PASSWORD_MIN_LENGTH}-${SHARE_PASSWORD_MAX_LENGTH} 位密码`}
                  value={sharePassword}
                  onChange={(e) => {
                    setSharePassword(e.target.value);
                    setGeneratedLink('');
                    setCopied(false);
                  }}
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg pl-9 pr-9 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {generatedLink ? (
              <div className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl space-y-4 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 text-xs font-bold">
                  {sharePassword.trim() ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-emerald-700 dark:text-emerald-400">{isEn ? 'AES-256-GCM encryption active' : '已启用 AES-256-GCM 加密'}</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="text-indigo-700 dark:text-indigo-300">{isEn ? 'Public link generated.' : '公开分享链接已生成'}</span>
                    </>
                  )}
                </div>

                {/* Privacy-first share link row */}
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/60 rounded-lg text-[10.5px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    {isEn
                      ? 'Privacy note: the resume payload is stored in the URL fragment, so it is not sent to the hosting server as a request query. QR generation is kept local-only by not calling third-party QR services.'
                      : '隐私说明：简历分享数据写入 URL fragment，不会作为请求查询参数发送给托管站点；为避免完整分享链接泄露给第三方，当前不调用外部二维码生成服务。'}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2.5">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {isEn 
                        ? (sharePassword.trim()
                          ? 'Send the encrypted link and password through separate channels when practical. Anyone with both can decrypt the resume.'
                          : 'This public link contains readable resume data in the URL fragment. Send it only to trusted recipients.')
                        : (sharePassword.trim()
                          ? '建议尽量通过不同渠道发送加密链接和密码；任何同时获得两者的人都可以解密简历。'
                          : '公开链接的 URL fragment 中包含可读取的简历数据，请仅发送给可信接收者。')}
                    </p>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        readOnly
                        value={generatedLink}
                        className="flex-1 bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-600 rounded px-2.5 py-1.5 text-[10px] font-mono text-slate-600 dark:text-slate-300 focus:outline-none"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="p-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? (isEn ? 'Copied' : '已复制') : (isEn ? '复制' : '复制')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-6 text-center text-slate-400 dark:text-slate-500 text-xs">
                {isEn ? 'Select a resume version on the left, then click "Share" to generate a privacy-preserving preview link.' : '选择左侧的一个版本并点击「在线分享」，在此生成隐私友好的预览链接。'}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Comparison Modal (Side-by-Side Diff View) */}
      {showCompareModal && comparisonDiffs && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[3px]" onClick={() => setShowCompareModal(false)} />
          
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    {isEn ? 'Matrix Resume Comparative Diff Analysis' : '版本差异对比'}
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {isEn 
                      ? `Comparing: Active Editor Resume VS ${comparisonDiffs.targetTitle}`
                      : `对比对象：当前编辑区简历 🆚 ${comparisonDiffs.targetTitle}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-3 py-1.5 bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                {isEn ? 'Close Diff View' : '关闭对比面板'}
              </button>
            </div>

            {/* Comparison Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20 dark:bg-slate-950/40 scrollbar-thin">
              {comparisonDiffs.diffList.every(d => d.status === 'identical') ? (
                <div className="border border-emerald-100 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20 rounded-xl p-8 text-center text-emerald-800 dark:text-emerald-300 flex flex-col items-center justify-center gap-2">
                  <Check className="w-8 h-8 text-emerald-500" />
                  <p className="text-xs font-bold">{isEn ? 'Both versions are identical' : '两个版本的简历模块与强调内容完全一致！'}</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {comparisonDiffs.diffList.map((diff, index) => {
                    if (diff.status === 'identical') return null;
                    
                    return (
                      <div key={index} className="border border-slate-200/80 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-850 shadow-sm overflow-hidden">
                        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800 flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            {diff.title}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            diff.status === 'modified' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-800/60' :
                            diff.status === 'added_in_target' ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800/60' :
                            'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-800/60'
                          }`}>
                            {diff.status === 'modified' ? (isEn ? 'Differences found' : '存在差异与强调变动') :
                             diff.status === 'added_in_target' ? (isEn ? 'Only in Target' : '仅存在于对比版本中') :
                             (isEn ? 'Only in Active' : '仅存在于当前编辑器中')}
                          </span>
                        </div>

                        {/* Side-by-Side Contents */}
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 text-xs font-mono">
                          {/* Active Current Editor */}
                          <div className="p-4 space-y-1">
                            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                              {isEn ? 'Active Current Editor' : '当前编辑区内容'}
                            </div>
                            <pre className="whitespace-pre-wrap font-sans text-slate-600 dark:text-slate-300 leading-relaxed text-[11px] bg-slate-50/30 dark:bg-slate-900/60 p-2.5 rounded border border-slate-100/40 dark:border-slate-800">
                              {diff.currContent.trim() || (isEn ? '(Section not present)' : '(当前版无该大板块)')}
                            </pre>
                          </div>

                          {/* Selected Target Version */}
                          <div className="p-4 space-y-1 bg-indigo-50/5 dark:bg-indigo-950/10">
                            <div className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1.5">
                              {comparisonDiffs.targetTitle}
                            </div>
                            <pre className="whitespace-pre-wrap font-sans text-slate-600 dark:text-slate-300 leading-relaxed text-[11px] bg-indigo-50/10 dark:bg-indigo-950/30 p-2.5 rounded border border-indigo-100/10 dark:border-indigo-900/30">
                              {diff.targetContent.trim() || (isEn ? '(Section not present)' : '(对比版无该大板块)')}
                            </pre>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
