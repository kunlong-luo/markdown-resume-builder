import type { ResumeTemplate } from '../data';

export interface TemplatePresentation {
  name: string;
  category: string;
  description: string;
  tags: string[];
  language: string;
}

type TemplatePresentationPair = {
  zh: TemplatePresentation;
  en: TemplatePresentation;
};

const TEMPLATE_PRESENTATION: Record<string, TemplatePresentationPair> = {
  ai_backend: {
    zh: {
      name: 'AI 后端工程师',
      category: '研发开发',
      description: '突出高并发后端、AI Agent、RAG 与分布式系统项目成果。',
      tags: ['AI / LLM', '后端架构', '资深社招'],
      language: '中文',
    },
    en: {
      name: 'AI Backend Developer',
      category: 'Engineering',
      description: 'Highlights backend architecture, AI agents, RAG, and distributed systems impact.',
      tags: ['AI / LLM', 'Backend', 'Experienced'],
      language: 'Chinese',
    },
  },
  frontend: {
    zh: {
      name: 'AI 前端工程师',
      category: '研发开发',
      description: '强调 React / TypeScript、AI 应用前端和全栈工程化能力。',
      tags: ['React', 'TypeScript', 'AI 应用'],
      language: '中文',
    },
    en: {
      name: 'AI Frontend Developer',
      category: 'Engineering',
      description: 'Focused on React, TypeScript, AI application interfaces, and full-stack delivery.',
      tags: ['React', 'TypeScript', 'AI Apps'],
      language: 'Chinese',
    },
  },
  pm_lead: {
    zh: {
      name: '技术产品经理 / 研发总监',
      category: '产品管理',
      description: '兼顾技术理解、产品规划、团队协作与业务结果的管理型模板。',
      tags: ['产品战略', '技术管理', '团队协作'],
      language: '中文',
    },
    en: {
      name: 'Technical PM / Engineering Director',
      category: 'Product & Leadership',
      description: 'Balances technical depth, product strategy, leadership, and business outcomes.',
      tags: ['Strategy', 'Leadership', 'Technical PM'],
      language: 'Chinese',
    },
  },
  operations: {
    zh: {
      name: '产品运营 / 用户增长',
      category: '产品运营',
      description: '适合增长、活动、内容和商业化运营，强化数据指标与业务影响。',
      tags: ['用户增长', '活动运营', '数据驱动'],
      language: '中文',
    },
    en: {
      name: 'Product Operations / Growth',
      category: 'Operations & Growth',
      description: 'Built for growth, campaigns, content, and monetization with measurable outcomes.',
      tags: ['Growth', 'Operations', 'Metrics'],
      language: 'Chinese',
    },
  },
  campus: {
    zh: {
      name: '应届生 / 校园研发',
      category: '应届生求职',
      description: '突出教育背景、实习、项目、竞赛和可迁移技术能力。',
      tags: ['应届生', '实习', '项目经历'],
      language: '中文',
    },
    en: {
      name: 'Graduate / Campus Engineering',
      category: 'Graduate',
      description: 'Emphasizes education, internships, projects, awards, and transferable engineering skills.',
      tags: ['Graduate', 'Internship', 'Projects'],
      language: 'Chinese',
    },
  },
  english: {
    zh: {
      name: '英文简历 / Global CV',
      category: '海外求职',
      description: '英文标准简历结构，强调 impact、技术领导力与国际化表达。',
      tags: ['English CV', 'Global', 'Impact'],
      language: 'English',
    },
    en: {
      name: 'English CV / Global Standard',
      category: 'Global',
      description: 'A global English CV emphasizing measurable impact, technical leadership, and clarity.',
      tags: ['English CV', 'Global', 'Impact'],
      language: 'English',
    },
  },
};

export function getTemplatePresentation(
  template: ResumeTemplate,
  lang: 'zh' | 'en',
): TemplatePresentation {
  const presentation = TEMPLATE_PRESENTATION[template.id]?.[lang];
  if (presentation) return presentation;

  return {
    name: template.name,
    category: template.category,
    description:
      lang === 'en'
        ? 'A ready-to-edit resume template.'
        : '一份可直接编辑使用的简历模板。',
    tags: [],
    language: lang === 'en' ? 'Mixed' : '混合',
  };
}

export function getTemplatePreview(content: string) {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const name =
    lines.find((line) => line.startsWith('# '))?.replace(/^#\s+/, '') ??
    'Resume';

  const nameIndex = lines.findIndex((line) => line.startsWith('# '));
  const subtitle =
    lines
      .slice(Math.max(0, nameIndex + 1))
      .find(
        (line) =>
          !line.startsWith('#') &&
          !line.startsWith('- ') &&
          !line.startsWith('* '),
      ) ?? '';

  const sections = lines
    .filter((line) => line.startsWith('## '))
    .slice(0, 4)
    .map((line) => line.replace(/^##\s+/, ''));

  const firstBullet =
    lines
      .find((line) => line.startsWith('- '))
      ?.replace(/^[-*]\s+/, '')
      .replace(/\*\*/g, '') ?? '';

  return { name, subtitle, sections, firstBullet };
}
