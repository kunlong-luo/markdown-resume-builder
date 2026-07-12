import React, { useState, useEffect, useMemo } from 'react';
import { 
  Folder, FolderOpen, GitCompare, Share2, Lock, Eye, EyeOff, Copy, Check, QrCode, Trash2, Plus, ArrowRight, Download, Info, Shield, ShieldCheck
} from 'lucide-react';
import { ResumeSettings, ResumeDraft } from '../../types';
import { generateShareUrl, ShareState } from '../../lib/share-utils';
import { splitMarkdownIntoSections } from '../../lib/markdown-utils';

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

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('resume-matrix');
      if (saved) {
        setMatrixVersions(JSON.parse(saved));
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
        localStorage.setItem('resume-matrix', JSON.stringify(defaultSeeds));
        setMatrixVersions(defaultSeeds);
      }
    } catch (e) {
      console.error('Error loading resume matrix', e);
    }
  }, [lang]);

  const saveMatrix = (updated: ResumeDraft[]) => {
    localStorage.setItem('resume-matrix', JSON.stringify(updated));
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
    showToast(isEn ? 'New targeted version folder created!' : '成功创建新的一职一简历版本文件夹！');
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
  const handleGenerateShare = (version: ResumeDraft) => {
    setSelectedVersionIdForShare(version.id);
    const state: ShareState = {
      markdown: version.markdown,
      settings: version.settings,
      passwordHash: sharePassword.trim() || undefined
    };
    const url = generateShareUrl(state);
    setGeneratedLink(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    showToast(isEn ? 'Share link copied!' : '专属分享链接已成功复制！');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 h-full flex flex-col text-slate-700">
      
      {/* Upper Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1 overflow-y-auto pr-1">
        
        {/* Left Side: Versions List */}
        <div className="space-y-3.5 flex flex-col">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-indigo-500" />
              <span>{isEn ? 'Targeted Resume Folders' : '我的简历文件夹矩阵'}</span>
            </h4>
            
            {!isCreatingVersion && (
              <button
                onClick={() => setIsCreatingVersion(true)}
                className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-3 h-3" />
                <span>{isEn ? 'New Version' : '建立新岗位版'}</span>
              </button>
            )}
          </div>

          {isCreatingVersion && (
            <form onSubmit={handleCreateVersion} className="flex gap-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/60 animate-in fade-in slide-in-from-top-1 duration-200">
              <input
                type="text"
                placeholder={isEn ? "e.g., Python Backend Dev" : "输入简历版本说明 (如: AI算法岗/全栈合伙人)..."}
                value={newVersionName}
                onChange={(e) => setNewVersionName(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                {isEn ? 'Create' : '创建'}
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingVersion(false)}
                className="px-2.5 py-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs rounded-lg transition-colors"
              >
                {isEn ? 'Cancel' : '取消'}
              </button>
            </form>
          )}

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[300px] scrollbar-thin">
            {matrixVersions.map((version) => {
              const isSelectedForShare = selectedVersionIdForShare === version.id;
              return (
                <div
                  key={version.id}
                  onClick={() => handleLoadVersion(version)}
                  className={`group p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isSelectedForShare
                      ? 'border-indigo-500 bg-indigo-50/30 shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="min-w-0 pr-4 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Folder className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform shrink-0" />
                      <span className="font-bold text-slate-800 text-xs truncate">
                        {version.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {isEn ? 'Saved at' : '更新于'}: {version.timestamp} · {version.markdown.length} Chars
                    </p>
                  </div>

                  {/* Actions inside matrix item */}
                  <div className="flex items-center gap-1.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleGenerateShare(version)}
                      className="p-1 px-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                      title={isEn ? "Generate exclusive share page" : "生成专属外链分享"}
                    >
                      <Share2 className="w-3 h-3" />
                      <span>{isEn ? 'Share' : '分享'}</span>
                    </button>
                    <button
                      onClick={(e) => handleDeleteVersion(version.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
        <div className="space-y-4 flex flex-col bg-slate-50/30 p-4 rounded-xl border border-slate-100/60">
          
          {/* Section 1: Comparison Selector */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <GitCompare className="w-4 h-4 text-emerald-500" />
              <span>{isEn ? 'One-Click Matrix Comparison' : '版本模块极速对比'}</span>
            </h4>
            <div className="flex gap-2">
              <select
                value={compareWithId}
                onChange={(e) => setCompareWithId(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
              >
                <option value="">-- {isEn ? 'Select version to compare' : '选择要对比的版本'} --</option>
                {matrixVersions.map(v => (
                  <option key={v.id} value={v.id}>{v.title}</option>
                ))}
              </select>
              {compareWithId && (
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-sm shadow-emerald-600/10"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Compare' : '查看对比'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 2: Link Share & Password Lock */}
          <div className="border-t border-slate-100 pt-3.5 space-y-3 flex-1 flex flex-col justify-end">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-indigo-500" />
              <span>{isEn ? 'Share Link & Password Security' : '分享配置与密码安全锁'}</span>
            </h4>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                {isEn ? 'Optional Password Challenge (Password Lock)' : '设置独立访问密码锁 (留空即公开访问)'}
              </label>
              <div className="flex gap-1.5 relative">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={isEn ? "Leave empty for public access" : "设置4-12位招聘官访问密码"}
                  value={sharePassword}
                  onChange={(e) => {
                    setSharePassword(e.target.value);
                    if (selectedVersionIdForShare) {
                      const ver = matrixVersions.find(v => v.id === selectedVersionIdForShare);
                      if (ver) handleGenerateShare(ver);
                    }
                  }}
                  className="flex-1 bg-white border border-slate-200 rounded-lg pl-8 pr-8 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {generatedLink ? (
              <div className="p-3 bg-indigo-50/50 border border-indigo-100/80 rounded-xl space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2 text-indigo-800 text-[11px] font-bold">
                  {sharePassword.trim() ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{isEn ? 'Password Lock Active!' : '已启用高安全性密码防泄漏锁！'}</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>{isEn ? 'Public link generated.' : '已生成极速公开分享外链。'}</span>
                    </>
                  )}
                </div>

                {/* QR Code and URL Row */}
                <div className="flex items-center gap-4">
                  {/* QR Code using public API */}
                  <div className="bg-white p-1 rounded-lg border border-slate-100 shadow-sm shrink-0 flex flex-col items-center justify-center gap-1">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(generatedLink)}`}
                      alt="HR QR Code"
                      referrerPolicy="no-referrer"
                      className="w-[85px] h-[85px] rounded"
                    />
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{isEn ? 'HR Scan' : 'HR扫码预览'}</span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                      {isEn 
                        ? 'Recruiters can preview this responsive H5 resume directly, download PDF, or print, securely on any device.' 
                        : 'HR 扫码或点击链接即可在线免登录直观预览响应式 H5 简历，或点击打印生成 PDF 档案。'}
                    </p>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        readOnly
                        value={generatedLink}
                        className="flex-1 bg-white border border-slate-200/60 rounded px-2 py-1 text-[10px] font-mono text-slate-500 focus:outline-none"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="p-1 px-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? (isEn ? 'Copied' : '已复制') : (isEn ? 'Copy' : '复制')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center text-slate-400 text-xs">
                {isEn ? 'Select a resume version left, then click "Share" to generate exclusive HR outer link' : '请在左侧选择版本并点击「分享」，在此实时生成独立加密的 HR 在线二维码与链接'}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Comparison Modal (Side-by-Side Diff View) */}
      {showCompareModal && comparisonDiffs && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setShowCompareModal(false)} />
          
          <div className="relative bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-indigo-600 animate-pulse" />
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    {isEn ? 'Matrix Resume Comparative Diff Analysis' : '简历矩阵模块多版本一键对比'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {isEn 
                      ? `Comparing: Active Editor Resume VS ${comparisonDiffs.targetTitle}`
                      : `对比对象：当前编辑区简历 🆚 ${comparisonDiffs.targetTitle}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-3 py-1.5 bg-slate-200/60 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                {isEn ? 'Close Diff View' : '关闭对比面板'}
              </button>
            </div>

            {/* Comparison Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20">
              {comparisonDiffs.diffList.every(d => d.status === 'identical') ? (
                <div className="border border-emerald-100 bg-emerald-50/20 rounded-xl p-8 text-center text-emerald-800 flex flex-col items-center justify-center gap-2">
                  <Check className="w-8 h-8 text-emerald-500" />
                  <p className="text-xs font-bold">{isEn ? 'Both versions are identical' : '两个版本的简历模块与强调内容完全一致！'}</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {comparisonDiffs.diffList.map((diff, index) => {
                    if (diff.status === 'identical') return null; // Only show modified or unique modules for extreme focus!
                    
                    return (
                      <div key={index} className="border border-slate-200/80 rounded-xl bg-white shadow-sm overflow-hidden">
                        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            {diff.title}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            diff.status === 'modified' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            diff.status === 'added_in_target' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                            'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            {diff.status === 'modified' ? (isEn ? 'Differences found' : '存在差异与强调变动') :
                             diff.status === 'added_in_target' ? (isEn ? 'Only in Target' : '仅存在于对比版本中') :
                             (isEn ? 'Only in Active' : '仅存在于当前编辑器中')}
                          </span>
                        </div>

                        {/* Side-by-Side Contents */}
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-xs font-mono">
                          {/* Active Current Editor */}
                          <div className="p-4 space-y-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                              {isEn ? 'Active Current Editor' : '当前编辑区内容'}
                            </div>
                            <pre className="whitespace-pre-wrap font-sans text-slate-600 leading-relaxed text-[11px] bg-slate-50/30 p-2.5 rounded border border-slate-100/40">
                              {diff.currContent.trim() || (isEn ? '(Section not present)' : '(当前版无该大板块)')}
                            </pre>
                          </div>

                          {/* Selected Target Version */}
                          <div className="p-4 space-y-1 bg-indigo-50/5">
                            <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1.5">
                              {comparisonDiffs.targetTitle}
                            </div>
                            <pre className="whitespace-pre-wrap font-sans text-slate-600 leading-relaxed text-[11px] bg-indigo-50/10 p-2.5 rounded border border-indigo-100/10">
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
