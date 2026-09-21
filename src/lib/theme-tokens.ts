/**
 * Unified Theme Tokens & Design System Constants
 * 统一颜色 Token 与组件样式设计系统
 */

export const THEME_TOKENS = {
  // Surface backgrounds
  surface: {
    base: 'bg-slate-50 dark:bg-[#070a13]',
    card: 'bg-white dark:bg-slate-900',
    cardSubtle: 'bg-slate-50/80 dark:bg-slate-850/60',
    panel: 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl',
    previewCanvas: 'bg-slate-100/70 dark:bg-[#090d16]',
    modal: 'bg-white dark:bg-slate-900',
    popover: 'bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl',
  },

  // Borders & Dividers
  border: {
    subtle: 'border-slate-100 dark:border-slate-800/80',
    default: 'border-slate-200/90 dark:border-slate-750',
    active: 'border-indigo-500 dark:border-indigo-400',
    hover: 'hover:border-slate-300 dark:hover:border-slate-600',
  },

  // Typography Colors
  text: {
    primary: 'text-slate-900 dark:text-slate-100',
    secondary: 'text-slate-700 dark:text-slate-300',
    muted: 'text-slate-500 dark:text-slate-400',
    subtle: 'text-slate-400 dark:text-slate-500',
    inverse: 'text-white dark:text-slate-900',
  },

  // Form Controls
  input: {
    base: 'bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500',
    focus: 'focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 outline-none',
    error: 'border-rose-400 dark:border-rose-500 focus:ring-rose-400/30 dark:focus:ring-rose-500/30',
    disabled: 'bg-slate-100/70 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border-slate-200/60 dark:border-slate-800 cursor-not-allowed',
  },

  // Interactive Buttons
  button: {
    primary: 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm shadow-indigo-600/20',
    secondary: 'bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs',
    ghost: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800',
    danger: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/60',
  },

  // Badges & Indicators
  badge: {
    indigo: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60',
    amber: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60',
    rose: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60',
  },

  // Color Theme Accent Map
  themeAccents: {
    indigo: {
      checked: 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200/50 dark:shadow-none',
      ring: 'focus-visible:ring-indigo-500/30',
      track: 'bg-indigo-600 focus-visible:ring-indigo-500/30',
      fill: 'bg-indigo-600',
    },
    blue: {
      checked: 'bg-blue-600 border-blue-600 text-white shadow-blue-200/50 dark:shadow-none',
      ring: 'focus-visible:ring-blue-500/30',
      track: 'bg-blue-600 focus-visible:ring-blue-500/30',
      fill: 'bg-blue-600',
    },
    emerald: {
      checked: 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-200/50 dark:shadow-none',
      ring: 'focus-visible:ring-emerald-500/30',
      track: 'bg-emerald-600 focus-visible:ring-emerald-500/30',
      fill: 'bg-emerald-500',
    },
    rose: {
      checked: 'bg-rose-600 border-rose-600 text-white shadow-rose-200/50 dark:shadow-none',
      ring: 'focus-visible:ring-rose-500/30',
      track: 'bg-rose-600 focus-visible:ring-rose-500/30',
      fill: 'bg-rose-500',
    },
    slate: {
      checked: 'bg-slate-800 dark:bg-slate-700 border-slate-800 dark:border-slate-600 text-white shadow-slate-200/50 dark:shadow-none',
      ring: 'focus-visible:ring-slate-500/30',
      track: 'bg-slate-800 dark:bg-slate-700 focus-visible:ring-slate-500/30',
      fill: 'bg-slate-700',
    }
  }
} as const;
