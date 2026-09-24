import { 
  LucideIcon, 
  Briefcase, 
  GraduationCap, 
  FolderKanban, 
  UserCheck, 
  Layers, 
  Trophy, 
  FileText, 
  Target 
} from 'lucide-react';

export type SectionCategory = 'work' | 'edu' | 'project' | 'strengths' | 'skills' | 'awards' | 'custom';

export interface SectionTheme {
  category: SectionCategory;
  name: string;
  icon: LucideIcon;
  badge: string;
  subtitle: string;
  iconColor: string;
  iconBg: string;
  dot: string;
  border: string;
  hoverBorder: string;
  badgeBg: string;
  bg: string;
  accentRing: string;
}

export function getSectionTheme(title: string, lang = 'zh'): SectionTheme {
  const isEn = lang === 'en';
  const t = (title || '').trim().toLowerCase();

  // 1. 工作经历 / 实习经历 (经典蓝 Blue)
  if (
    t.includes('工作') || t.includes('实习') || t.includes('experience') || 
    t.includes('work') || t.includes('career') || t.includes('employment') || 
    t.includes('job')
  ) {
    return {
      category: 'work',
      name: 'work',
      icon: Briefcase,
      badge: isEn ? (t.includes('intern') ? 'Internship' : 'Work') : (t.includes('实习') ? '实习经历' : '工作经历'),
      subtitle: isEn ? 'Company, role, duration & accomplishments' : '公司名称、职位角色与工作成果',
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-50 dark:bg-blue-950/60',
      dot: 'bg-blue-500',
      border: 'border-blue-200/60 dark:border-blue-800/50',
      hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-600',
      badgeBg: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200/70 dark:border-blue-800/60',
      bg: 'bg-white dark:bg-slate-850',
      accentRing: 'ring-blue-100 dark:ring-blue-950/60'
    };
  }

  // 2. 教育背景 / 学术经历 (学术紫 Purple)
  if (
    t.includes('教育') || t.includes('学校') || t.includes('学历') || 
    t.includes('academic') || t.includes('education') || t.includes('university') || 
    t.includes('college') || t.includes('degree')
  ) {
    return {
      category: 'edu',
      name: 'edu',
      icon: GraduationCap,
      badge: isEn ? 'Education' : '教育背景',
      subtitle: isEn ? 'Institution, degree, major & academic record' : '院校名称、学历专业与就读表现',
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-50 dark:bg-purple-950/60',
      dot: 'bg-purple-500',
      border: 'border-purple-200/60 dark:border-purple-800/50',
      hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-600',
      badgeBg: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200/70 dark:border-purple-800/60',
      bg: 'bg-white dark:bg-slate-850',
      accentRing: 'ring-purple-100 dark:ring-purple-950/60'
    };
  }

  // 3. 项目经历 / 作品集 (活力绿 Emerald)
  if (
    t.includes('项目') || t.includes('产品') || t.includes('作品') || 
    t.includes('project') || t.includes('portfolio')
  ) {
    return {
      category: 'project',
      name: 'project',
      icon: FolderKanban,
      badge: isEn ? 'Project' : '项目经历',
      subtitle: isEn ? 'Project name, role & key deliverables' : '项目名称、担任角色与核心产出',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      dot: 'bg-emerald-500',
      border: 'border-emerald-200/60 dark:border-emerald-800/50',
      hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-600',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/60',
      bg: 'bg-white dark:bg-slate-850',
      accentRing: 'ring-emerald-100 dark:ring-emerald-950/60'
    };
  }

  // 4. 技能与优势复合标题 (蓝绿色 Teal)
  if ((t.includes('技能') || t.includes('skill')) && (t.includes('优势') || t.includes('strength'))) {
    return {
      category: 'strengths',
      name: 'skills_and_strengths',
      icon: Target,
      badge: isEn ? 'Skills & Strengths' : '技能与优势',
      subtitle: isEn ? 'Core competencies, skillsets & personal highlights' : '核心技术、熟练程度与个人亮点',
      iconColor: 'text-teal-600 dark:text-teal-400',
      iconBg: 'bg-teal-50 dark:bg-teal-950/60',
      dot: 'bg-teal-500',
      border: 'border-teal-200/60 dark:border-teal-800/50',
      hoverBorder: 'hover:border-teal-300 dark:hover:border-teal-600',
      badgeBg: 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200/70 dark:border-teal-800/60',
      bg: 'bg-white dark:bg-slate-850',
      accentRing: 'ring-teal-100 dark:ring-teal-950/60'
    };
  }

  // 5. 个人优势 / 自我评价 / 个人亮点 / 总结 (暖琥珀金 Amber)
  if (
    t.includes('优势') || t.includes('评价') || t.includes('亮点') || 
    t.includes('总结') || t.includes('关于我') || t.includes('自我介绍') || 
    t.includes('summary') || t.includes('strength') || t.includes('highlight') || 
    t.includes('profile') || t.includes('about') || t.includes('objective')
  ) {
    const badgeLabel = isEn 
      ? (t.includes('summary') ? 'Summary' : t.includes('about') ? 'About Me' : t.includes('highlight') ? 'Highlights' : 'Strengths')
      : (t.includes('评价') ? '自我评价' : t.includes('总结') ? '个人总结' : t.includes('亮点') ? '个人亮点' : t.includes('关于我') || t.includes('介绍') ? '关于我' : '个人优势');
    return {
      category: 'strengths',
      name: 'strengths',
      icon: UserCheck,
      badge: badgeLabel,
      subtitle: isEn ? 'Summary, strengths & key highlights' : '综合总结、核心特长与个人亮点',
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-950/60',
      dot: 'bg-amber-500',
      border: 'border-amber-200/60 dark:border-amber-800/50',
      hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-600',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/70 dark:border-amber-800/60',
      bg: 'bg-white dark:bg-slate-850',
      accentRing: 'ring-amber-100 dark:ring-amber-950/60'
    };
  }

  // 6. 专业技能 / 核心技能 / 技术栈 / 工具 (科技青 Cyan)
  if (
    t.includes('技能') || t.includes('技术') || t.includes('专长') || 
    t.includes('skill') || t.includes('tech') || t.includes('stack') || 
    t.includes('tool') || t.includes('competenc')
  ) {
    const badgeLabel = isEn 
      ? (t.includes('tech') ? 'Tech Stack' : 'Skills')
      : (t.includes('技术') ? '技术栈' : t.includes('特长') || t.includes('专长') ? '技能特长' : '专业技能');
    return {
      category: 'skills',
      name: 'skills',
      icon: Layers,
      badge: badgeLabel,
      subtitle: isEn ? 'Core competencies, toolchain & tech stack' : '核心技术栈、工具链与熟练程度',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      iconBg: 'bg-cyan-50 dark:bg-cyan-950/60',
      dot: 'bg-cyan-500',
      border: 'border-cyan-200/60 dark:border-cyan-800/50',
      hoverBorder: 'hover:border-cyan-300 dark:hover:border-cyan-600',
      badgeBg: 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border-cyan-200/70 dark:border-cyan-800/60',
      bg: 'bg-white dark:bg-slate-850',
      accentRing: 'ring-cyan-100 dark:ring-cyan-950/60'
    };
  }

  // 7. 荣誉奖项 / 资质证书 / 竞赛经历 (玫瑰红 Rose)
  if (
    t.includes('荣誉') || t.includes('奖项') || t.includes('证书') || 
    t.includes('资质') || t.includes('竞赛') || t.includes('获奖') || 
    t.includes('award') || t.includes('honor') || t.includes('cert') || 
    t.includes('competition') || t.includes('license')
  ) {
    const badgeLabel = isEn
      ? (t.includes('cert') ? 'Certificates' : 'Awards')
      : (t.includes('证书') || t.includes('资质') ? '资质证书' : '荣誉奖项');
    return {
      category: 'awards',
      name: 'awards',
      icon: Trophy,
      badge: badgeLabel,
      subtitle: isEn ? 'Certificates, competitions & honors' : '资质证书、专业竞赛与荣誉表彰',
      iconColor: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-50 dark:bg-rose-950/60',
      dot: 'bg-rose-500',
      border: 'border-rose-200/60 dark:border-rose-800/50',
      hoverBorder: 'hover:border-rose-300 dark:hover:border-rose-600',
      badgeBg: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200/70 dark:border-rose-800/60',
      bg: 'bg-white dark:bg-slate-850',
      accentRing: 'ring-rose-100 dark:ring-rose-950/60'
    };
  }

  // 8. 常规 / 其他模块 (中性石板灰 Slate)
  return {
    category: 'custom',
    name: 'custom',
    icon: FileText,
    badge: isEn ? 'Section' : '常规模块',
    subtitle: isEn ? 'Custom section content & styling' : '自定义板块内容与排版',
    iconColor: 'text-slate-500 dark:text-slate-400',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    dot: 'bg-slate-400',
    border: 'border-slate-200/80 dark:border-slate-750',
    hoverBorder: 'hover:border-slate-350 dark:hover:border-slate-700',
    badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700',
    bg: 'bg-white dark:bg-slate-850',
    accentRing: 'ring-slate-100 dark:ring-slate-800'
  };
}

export function getPresetTheme(type: 'work' | 'project' | 'edu' | 'skills' | 'summary' | 'custom_text' | 'custom_items', lang = 'zh'): SectionTheme {
  const isEn = lang === 'en';
  switch (type) {
    case 'summary':
      return getSectionTheme(isEn ? 'Summary' : '个人优势', lang);
    case 'skills':
      return getSectionTheme(isEn ? 'Skills' : '专业技能', lang);
    case 'work':
      return getSectionTheme(isEn ? 'Work Experience' : '工作经历', lang);
    case 'project':
      return getSectionTheme(isEn ? 'Projects' : '项目经历', lang);
    case 'edu':
      return getSectionTheme(isEn ? 'Education' : '教育背景', lang);
    case 'custom_text':
    case 'custom_items':
    default:
      return getSectionTheme(isEn ? 'Custom Section' : '自定义模块', lang);
  }
}
