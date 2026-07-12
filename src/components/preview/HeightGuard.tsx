import React from 'react';
import { Ruler, AlertTriangle, Info, Zap } from 'lucide-react';

interface HeightGuardProps {
  metrics: {
    isOver: boolean;
    overflowPercent: number;
  };
  targetPageLimit: number;
  setTargetPageLimit: (limit: 1 | 2 | 3) => void;
  onSmartAutoFit?: () => void;
  isAutoFitting?: boolean;
  lang?: string;
}

const TRANSLATIONS = {
  zh: {
    title: 'A4 高度警报器',
    autoFitting: '自动缩合中 ⚡',
    overflow: '内容溢出 ⚠️',
    nearLimit: '临近边界 ⚠️',
    perfectFit: '完美契合 ✅',
    targetLimit: '目标限制',
    pages: '页 A4',
    overflowWarningTitle: '内容已超出 {pages} 页高度！',
    overflowWarningDesc: '建议微调边距、行高、模块间距或字号，使其完美契合！',
    nearLimitDesc: '内容已非常接近分页线，打印时可能会多出尴尬的空白页。',
    perfectFitDesc: '当前布局紧凑，能够完美塞入所选页数，无跨页打印截断风险。',
    setTarget: '设定目标:',
    pageUnit: '页',
    autoFittingBtn: '正在智能微调压缩中...',
    autoFitBtn: '一键智能缩合页面',
    optimizeBtn: '智能优化排版间距'
  },
  en: {
    title: 'A4 Height Guard',
    autoFitting: 'Auto Fitting... ⚡',
    overflow: 'Overflow ⚠️',
    nearLimit: 'Near Limit ⚠️',
    perfectFit: 'Perfect Fit ✅',
    targetLimit: 'Target Limit',
    pages: 'A4 Page(s)',
    overflowWarningTitle: 'Content exceeds {pages} A4 page(s)!',
    overflowWarningDesc: 'Adjust margin, line height, spacing, or font size to make it fit.',
    nearLimitDesc: 'Very close to page boundary. Printing might spill over slightly.',
    perfectFitDesc: 'Perfect size. Fits within the target page count without spilling.',
    setTarget: 'Set Target:',
    pageUnit: 'Page(s)',
    autoFittingBtn: 'Optimizing spacing...',
    autoFitBtn: 'Auto-Fit to Page',
    optimizeBtn: 'Smart Optimize Spacing'
  }
};

export function HeightGuard({ 
  metrics, 
  targetPageLimit, 
  setTargetPageLimit, 
  onSmartAutoFit, 
  isAutoFitting,
  lang = 'zh'
}: HeightGuardProps) {
  const t = lang === 'en' ? TRANSLATIONS.en : TRANSLATIONS.zh;

  return (
    <div className="absolute bottom-5 right-5 z-40 max-w-[310px] w-full bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl rounded-2xl p-4 flex flex-col gap-3 select-none transition-all hover:bg-white print:hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t.title}</span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border transition-colors ${
          isAutoFitting
            ? 'bg-indigo-50 text-indigo-600 border-indigo-200 animate-pulse shadow-sm'
            : metrics.isOver 
              ? 'bg-red-50 text-red-600 border-red-200 animate-pulse shadow-sm shadow-red-500/10' 
              : metrics.overflowPercent > 92 
                ? 'bg-amber-50 text-amber-600 border-amber-200 shadow-sm' 
                : 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm'
        }`}>
          {isAutoFitting ? t.autoFitting : metrics.isOver ? t.overflow : metrics.overflowPercent > 92 ? t.nearLimit : t.perfectFit}
        </span>
      </div>

      {/* Height gauge visual */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-500">
            {t.targetLimit}: <strong className="text-slate-700">{targetPageLimit} {t.pages}</strong>
          </span>
          <span className="font-mono font-bold text-slate-600">
            {metrics.overflowPercent}%
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative border border-slate-150">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              metrics.isOver 
                ? 'bg-gradient-to-r from-rose-500 to-red-600 animate-pulse' 
                : metrics.overflowPercent > 92 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500' 
                  : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
            }`}
            style={{ width: `${Math.min(100, metrics.overflowPercent)}%` }}
          />
        </div>
      </div>

      {/* Warning messages if over */}
      {metrics.isOver ? (
        <div className="bg-red-50/70 border border-red-150 rounded-lg p-2.5 flex flex-col gap-1.5 animate-pulse">
          <div className="flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-[11px] font-bold text-red-700 leading-normal">
              {t.overflowWarningTitle.replace('{pages}', String(targetPageLimit))}
            </p>
          </div>
          <p className="text-[10px] text-red-500 leading-relaxed pl-5">
            {t.overflowWarningDesc}
          </p>
        </div>
      ) : metrics.overflowPercent > 92 ? (
        <div className="bg-amber-50/70 border border-amber-150 rounded-lg p-2 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700 leading-normal font-medium">
            {t.nearLimitDesc}
          </p>
        </div>
      ) : (
        <p className="text-[10px] text-slate-400 leading-relaxed text-center">
          {t.perfectFitDesc}
        </p>
      )}

      {/* Target limit selector */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-0.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.setTarget}</span>
        <div className="bg-slate-100 p-0.5 rounded-md flex items-center">
          {([1, 2, 3] as const).map(p => (
            <button
              key={p}
              onClick={() => setTargetPageLimit(p)}
              className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer ${
                targetPageLimit === p 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {p}{t.pageUnit}
            </button>
          ))}
        </div>
      </div>

      {/* Smart tuning button */}
      {onSmartAutoFit && (
        <button
          onClick={onSmartAutoFit}
          disabled={isAutoFitting}
          className={`flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-[0.98] cursor-pointer ${
            isAutoFitting
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : metrics.isOver 
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/10 shadow-md' 
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/40'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${isAutoFitting ? 'animate-spin text-slate-400' : metrics.isOver ? 'animate-bounce text-yellow-300' : 'text-indigo-600'}`} />
          <span>{isAutoFitting ? t.autoFittingBtn : metrics.isOver ? t.autoFitBtn : t.optimizeBtn}</span>
        </button>
      )}
    </div>
  );
}
