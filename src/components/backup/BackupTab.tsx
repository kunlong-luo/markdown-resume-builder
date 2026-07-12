import React from 'react';
import { DownloadCloud, UploadCloud, FileJson } from 'lucide-react';

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
      <div className="space-y-4">
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800 leading-relaxed space-y-1">
          <p className="font-bold flex items-center gap-1">
            {isEn ? '📦 What is the Full Configuration File (.json)?' : '📦 什么是完整配置文件 (.json)？'}
          </p>
          <p className="text-justify">
            {isEn ? (
              <>
                Compared to exporting pure Markdown text, the <strong>Full Configuration File (.json)</strong> packs your <strong>resume content and all customized layout options (fonts, theme colors, spacing fine-tuning, page guide lines, etc.)</strong> into a single JSON file. Importing this file on any browser or computer restores your format settings with 100% pixel-perfect fidelity.
              </>
            ) : (
              <>
                与单纯导出文本 (Markdown) 相比，<strong>完整配置文件 (.json)</strong> 会将您的 <strong>简历正文、所有的自定义排版设定（字体、主题颜色、无级微调间距、页面指南开关等）</strong> 打包存入一个文件中。在任何电脑、任何浏览器上导入此文件，即可百分百恢复您的一致排版。
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export Section */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg w-fit">
                <DownloadCloud className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-xs">
                {isEn ? 'Export Full Backup' : '一键导出备份配置'}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isEn 
                  ? 'Bundle current resume markdown, line heights, spacing increments, font family, margins, and advanced parameters into a single JSON.'
                  : '打包当前的简历正文、行高、微调间距、文字大小、纸张边距及所有高级渲染参数为单 JSON 备份。'}
              </p>
            </div>
            <button
              onClick={handleExportConfig}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/10 cursor-pointer"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>{isEn ? 'Generate & Download .json' : '生成并下载 .json 备份'}</span>
            </button>
          </div>

          {/* Drag & Drop Import Box */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all space-y-3 ${
              importDragActive
                ? 'border-indigo-500 bg-indigo-50/30'
                : 'border-slate-200 hover:border-indigo-400 bg-slate-50/30 hover:bg-indigo-50/10'
            }`}
          >
            <div className={`p-2 rounded-lg transition-colors ${importDragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs">
                {isEn ? 'Import Backup & Restore' : '导入备份文件恢复'}
              </h4>
              <p className="text-[10px] text-slate-400 max-w-[180px] mx-auto mt-1 leading-relaxed">
                {isEn 
                  ? 'Drag & drop your configuration backup (.json) here, or click to browse and upload.'
                  : '拖拽配置文件 (.json) 到此处，或点击浏览上传，将瞬间还原所有配置。'}
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

      {/* Aesthetic quote in footer */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[10px] text-slate-400 text-center leading-relaxed font-medium">
        {isEn 
          ? '🔒 Data Security Guarantee: All resume data is saved locally in your own browser cache. We never upload any details to any third-party external servers.'
          : '🔒 数据安全保障：所有简历数据均保存在您的本地浏览器缓存中，不会被上传到任何外部第三方服务器，安全无忧。'}
      </div>
    </div>
  );
}
