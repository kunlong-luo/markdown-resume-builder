
import React from 'react';
import { motion } from 'motion/react';
import { AnalysisResult } from '../../lib/resume-checker-utils';

interface ScoreDisplayProps {
  analysis: AnalysisResult;
  scoreBadge: {
    label: string;
    color: string;
    text: string;
  };
}

export function ScoreDisplay({ analysis, scoreBadge }: ScoreDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Score Ring Display */}
      <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl p-5 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-2 right-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${scoreBadge.color}`}>
            {scoreBadge.label}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          {/* Visual Gauge */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                cx="56" 
                cy="56" 
                r="46" 
                className="stroke-slate-100" 
                strokeWidth="8" 
                fill="transparent" 
              />
              <motion.circle 
                cx="56" 
                cy="56" 
                r="46" 
                className={
                  analysis.score >= 90 ? 'stroke-emerald-500' :
                  analysis.score >= 75 ? 'stroke-blue-500' : 'stroke-rose-500'
                }
                strokeWidth="8.5" 
                fill="transparent" 
                strokeDasharray={289}
                initial={{ strokeDashoffset: 289 }}
                animate={{ strokeDashoffset: 289 - (289 * analysis.score) / 100 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-slate-800 tracking-tighter">
                {analysis.score}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score分</span>
            </div>
          </div>

          <div className="mt-2 space-y-1">
            <p className="text-xs font-semibold text-slate-700">简历竞争力得分</p>
            <p className="text-[11px] text-slate-400 px-3">
              根据基本信息完整度、行业动词数量、量化成果比例、格式残留等方面智能演算
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl p-3 text-center transition-colors">
          <p className="text-[10px] font-semibold text-slate-400 mb-0.5">量化成果指标</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className={`text-lg font-black ${analysis.metricCount >= 5 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {analysis.metricCount}
            </span>
            <span className="text-[10px] text-slate-400">个</span>
          </div>
        </div>
        <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl p-3 text-center transition-colors">
          <p className="text-[10px] font-semibold text-slate-400 mb-0.5">强行动词数</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-lg font-black text-blue-600">
              {analysis.foundVerbsCount}
            </span>
            <span className="text-[10px] text-slate-400">个</span>
          </div>
        </div>
      </div>
    </div>
  );
}
