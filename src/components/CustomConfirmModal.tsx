import React from 'react';
import { X, AlertTriangle, Info, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

export function CustomConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
  type = 'warning'
}: CustomConfirmModalProps) {
  // Theme styling based on type
  const theme = {
    warning: {
      accent: 'from-amber-500 to-orange-500',
      iconBg: 'bg-amber-50 text-amber-600',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      btnConfirm: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/15',
    },
    danger: {
      accent: 'from-rose-500 to-red-600',
      iconBg: 'bg-rose-50 text-rose-600',
      icon: <AlertTriangle className="w-5 h-5 text-rose-500" />,
      btnConfirm: 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/15',
    },
    info: {
      accent: 'from-blue-500 to-indigo-500',
      iconBg: 'bg-blue-50 text-blue-600',
      icon: <Info className="w-5 h-5 text-blue-500" />,
      btnConfirm: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/15',
    }
  }[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col"
          >
            {/* Top decorative gradient line */}
            <div className={`h-1.5 bg-gradient-to-r ${theme.accent}`} />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg ${theme.iconBg}`}>
                  {theme.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-none">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="px-6 py-5">
              <p className="text-xs sm:text-sm text-slate-600 text-justify leading-relaxed whitespace-pre-line">
                {message}
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`px-5 py-2 text-white text-xs font-bold rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center cursor-pointer ${theme.btnConfirm}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
