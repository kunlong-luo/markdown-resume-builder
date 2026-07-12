
import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { IssueItem } from '../../lib/resume-checker-utils';

interface DiagnosticListProps {
  issues: IssueItem[];
}

export function DiagnosticList({ issues }: DiagnosticListProps) {
  return (
    <div className="space-y-4">
      {/* Diagnostics Title */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">诊断报告 ({issues.length}项)</span>
      </div>

      {/* Diagnostic Issues List */}
      <div className="space-y-3">
        {issues.map((issue, idx) => {
          let icon = null;
          let bgClass = '';
          let borderClass = '';
          let textClass = '';

          if (issue.type === 'error') {
            icon = <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
            bgClass = 'bg-rose-50/40';
            borderClass = 'border-rose-100';
            textClass = 'text-rose-900';
          } else if (issue.type === 'warning') {
            icon = <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
            bgClass = 'bg-amber-50/30';
            borderClass = 'border-amber-100/70';
            textClass = 'text-amber-900';
          } else {
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
            bgClass = 'bg-emerald-50/20';
            borderClass = 'border-emerald-100/50';
            textClass = 'text-emerald-950';
          }

          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-3.5 border rounded-xl flex items-start gap-3 transition-shadow hover:shadow-sm ${bgClass} ${borderClass}`}
            >
              {icon}
              <div className="flex-1 space-y-1">
                <p className={`text-xs font-bold ${textClass}`}>{issue.title}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed text-justify">{issue.desc}</p>
                {issue.fixable && issue.onFix && (
                  <button
                    onClick={issue.onFix}
                    className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-[10px] font-bold rounded transition-all cursor-pointer shadow-sm shadow-blue-600/10"
                  >
                    <Zap className="w-2.5 h-2.5" />
                    <span>一键智能修正</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
