import React from 'react';
import { DownloadCloud, UploadCloud, FileJson, ShieldAlert } from 'lucide-react';

interface BackupTabProps {
  handleExportConfig: () => void;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  importDragActive: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImportConfig: (file: File) => void;
  lang?: string;
}

export function BackupTab({
  handleExportConfig,
  handleDrag,
  handleDrop,
  importDragActive,
  fileInputRef,
  handleImportConfig,
  lang
}: BackupTabProps) {
  const isEn = lang === 'en';

  return (
    <div className="space-y-6 h-full flex flex-col justify-between">
      <div className="space-y-5">
        {/* Informational Card */}
        <div className="bg-indigo-50/40 border border-indigo-100/50 rounded-xl p-4.5 text-xs text-slate-700 leading-relaxed space-y-1.5 shadow-sm">
          <p className="font-bold text-slate-900 flex items-center gap-1.5 text-[12px]">
            <span>📦</span>
            <span>{isEn ? 'What is the Full Configuration File (.json)?' : '什么是 JSON 配置文件？'}</span>
          </p>
          <p className="text-slate-500 text-justify text-[11px] font-medium leading-relaxed">
            {isEn ? (
              <>
                Compared to exporting pure Markdown text, the <strong>Full Configuration File (.json)</strong> packs your <strong>resume content and all customized layout options (fonts, theme colors, spacing fine-tuning, page guide lines, etc.)</strong> into a single JSON file. Importing this file on any browser or computer restores your format settings with 100% pixel-perfect fidelity.
              </>
            ) : (
              <>
                JSON 备份包含简历全部文字及自定义排版参数（如字体、行高、页边距、主题色等）。在任意设备导入此文件，即可 100% 像素级还原您的简历与排版。
              </>
            )}
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Export Section */}
          <div className="border border-slate-200/80 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between space-y-5 hover:border-slate-300 transition-all duration-200">
            <div className="space-y-2.5">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl w-fit border border-indigo-100/30">
                <DownloadCloud className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-xs">
                {isEn ? 'Export Full Backup' : '导出 JSON 备份'}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                {isEn 
                  ? 'Bundle current resume markdown, line heights, spacing increments, font family, margins, and advanced parameters into a single JSON.'
                  : '打包并下载当前的简历文字与全部排版参数。'}
              </p>
            </div>
            <button
              onClick={handleExportConfig}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/10 cursor-pointer"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>{isEn ? 'Generate & Download .json' : '导出 .json 备份'}</span>
            </button>
          </div>

          {/* Drag & Drop Import Box */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all space-y-3.5 ${
              importDragActive
                ? 'border-indigo-500 bg-indigo-50/40 shadow-sm'
                : 'border-slate-200 hover:border-indigo-400 bg-slate-50/20 hover:bg-indigo-50/10'
            }`}
          >
            <div className={`p-2.5 rounded-xl transition-colors border ${importDragActive ? 'bg-indigo-100 text-indigo-600 border-indigo-200' : 'bg-white text-slate-500 border-slate-100 shadow-sm'}`}>
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs">
                {isEn ? 'Import Backup & Restore' : '导入 JSON 恢复'}
              </h4>
              <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto mt-1 leading-relaxed font-medium">
                {isEn 
                  ? 'Drag & drop your configuration backup (.json) here, or click to browse and upload.'
                  : '拖拽备份文件 (.json) 到此处或点击上传，瞬间还原简历排版。'}
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImportConfig(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Security Info Panel */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 px-4 text-[10px] text-slate-500 flex items-center justify-center gap-2 font-medium">
        <ShieldAlert className="w-4 h-4 text-emerald-500 shrink-0" />
        <span className="leading-relaxed">
          {isEn 
            ? '🔒 Data Security Guarantee: All resume data is saved locally in your own browser cache. We never upload any details to any third-party external servers.'
            : '安全保障：所有简历数据均保存在您本地浏览器的缓存中，绝不上传服务器。'}
        </span>
      </div>
    </div>
  );
}
