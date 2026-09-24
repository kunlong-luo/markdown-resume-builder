import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'motion/react';
import { CustomSlider } from '../ui/CustomSlider';
import { Tooltip } from '../ui/Tooltip';

interface ZoomControlsProps {
  zoomMode: 'fit' | number;
  calculatedZoom: number;
  onZoomChange: (zoom: 'fit' | number) => void;
  lang?: string;
}

export const ZoomControls: React.FC<ZoomControlsProps> = React.memo(({
  zoomMode,
  calculatedZoom,
  onZoomChange,
  lang = 'zh',
}) => {
  const isEn = lang === 'en';
  const t = isEn ? {
    zoomOut: 'Zoom Out',
    zoomIn: 'Zoom In',
    zoomFit: 'Fit',
  } : {
    zoomOut: '缩小',
    zoomIn: '放大',
    zoomFit: '自适应',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="absolute bottom-5 left-5 z-40 print:hidden hidden sm:flex items-center gap-2 h-10 px-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 shadow-[0_12px_32px_rgba(15,23,42,0.12),0_2px_6px_rgba(15,23,42,0.04)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)] rounded-2xl transition-all duration-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.16)] group"
    >
      <div className="flex items-center gap-1">
        <Tooltip content={t.zoomOut} side="top">
          <button 
            type="button"
            onClick={() => {
              const current = calculatedZoom;
              const next = Math.max(0.5, Math.round((current - 0.05) * 100) / 100);
              onZoomChange(next);
            }}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label={t.zoomOut}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
        
        <div className="flex items-center gap-2 px-1 w-24 md:w-32 transition-all">
          <CustomSlider
            min={0.5}
            max={1.5}
            step={0.05}
            value={calculatedZoom}
            onChange={(val) => onZoomChange(val)}
            colorTheme="indigo"
            size="sm"
          />
        </div>

        <Tooltip content={t.zoomIn} side="top">
          <button 
            type="button"
            onClick={() => {
              const current = calculatedZoom;
              const next = Math.min(1.5, Math.round((current + 0.05) * 100) / 100);
              onZoomChange(next);
            }}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label={t.zoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>

      <div className="h-4 w-[1px] bg-slate-200/80 dark:bg-slate-800" />

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onZoomChange('fit')}
          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
            zoomMode === 'fit' 
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 shadow-sm font-sans' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent font-sans'
          }`}
        >
          {t.zoomFit}
        </button>
        
        <button
          type="button"
          onClick={() => onZoomChange(1.0)}
          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
            zoomMode === 1.0 
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 shadow-sm font-sans' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent font-sans'
          }`}
        >
          100%
        </button>
      </div>

      <div className="h-4 w-[1px] bg-slate-200/80 dark:bg-slate-800" />

      <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 min-w-[36px] text-center pr-1 select-none">
        {Math.round(calculatedZoom * 100)}%
      </span>
    </motion.div>
  );
});
export default ZoomControls;
