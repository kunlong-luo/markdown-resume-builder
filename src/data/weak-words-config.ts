export interface WeakWordReplacement {
  word: string;
  translation: string;
}

export interface WeakWordConfig {
  id: string;
  pattern: RegExp | string;
  isRegex: boolean;
  weakText: string;
  desc: string;
  replacements: WeakWordReplacement[];
}

export const WEAK_WORDS_CONFIG: WeakWordConfig[] = [
  {
    id: 'responsible_for',
    pattern: /\b(?:responsible\s+for)\b/gi,
    isRegex: true,
    weakText: 'responsible for',
    desc: '弱代动词，缺乏成就导向。建议以强动词开头，突出业务或技术担当。',
    replacements: [
      { word: 'Spearheaded', translation: '主导 / 牵头' },
      { word: 'Orchestrated', translation: '统筹 / 规划' },
      { word: 'Led', translation: '带领 / 负责' },
      { word: 'Executed', translation: '执行 / 落地' },
      { word: 'Directed', translation: '指导 / 组织' }
    ]
  },
  {
    id: 'helped',
    pattern: /\b(?:helped)\b/gi,
    isRegex: true,
    weakText: 'helped',
    desc: '口语化动词。建议使用强调跨团队协作与推进力的动词。',
    replacements: [
      { word: 'Collaborated with', translation: '协同 / 协作' },
      { word: 'Facilitated', translation: '推进 / 促进' },
      { word: 'Supported', translation: '配合 / 支持' },
      { word: 'Empowered', translation: '赋能 / 助力' },
      { word: 'Coordinated', translation: '协调 / 联络' }
    ]
  },
  {
    id: 'worked_on',
    pattern: /\b(?:worked\s+on)\b/gi,
    isRegex: true,
    weakText: 'worked on',
    desc: '描述过于平淡。应使用展现工程落地或系统设计能力的动词。',
    replacements: [
      { word: 'Engineered', translation: '研发 / 设计' },
      { word: 'Architected', translation: '架构 / 设计' },
      { word: 'Developed', translation: '开发 / 实现' },
      { word: 'Constructed', translation: '搭建 / 构建' },
      { word: 'Implemented', translation: '实现 / 交付' }
    ]
  },
  {
    id: 'managed',
    pattern: /\b(?:managed)\b/gi,
    isRegex: true,
    weakText: 'managed',
    desc: '词义略显宽泛，建议根据具体管理与协调职责使用更精准的词汇。',
    replacements: [
      { word: 'Orchestrated', translation: '统筹 / 协调' },
      { word: 'Steered', translation: '把控 / 推进' },
      { word: 'Supervised', translation: '管理 / 监督' },
      { word: 'Organized', translation: '组织 / 安排' },
      { word: 'Chaired', translation: '主持 / 牵头' }
    ]
  },
  {
    id: 'improved',
    pattern: /\b(?:improved)\b/gi,
    isRegex: true,
    weakText: 'improved',
    desc: '含义泛化，建议用能够体现性能、质量或效率提升的动词。',
    replacements: [
      { word: 'Optimized', translation: '优化 / 调优' },
      { word: 'Enhanced', translation: '提升 / 增强' },
      { word: 'Upgraded', translation: '升级 / 迭代' },
      { word: 'Refined', translation: '重构 / 完善' },
      { word: 'Streamlined', translation: '精简 / 提效' }
    ]
  },
  {
    id: 'used',
    pattern: /\b(?:used)\b/gi,
    isRegex: true,
    weakText: 'used',
    desc: '单纯使用工具缺乏技术深度。用展现工程落地或技术集成的词汇。',
    replacements: [
      { word: 'Leveraged', translation: '运用 / 借助' },
      { word: 'Integrated', translation: '集成 / 整合' },
      { word: 'Deployed', translation: '部署 / 落地' },
      { word: 'Adopted', translation: '引入 / 采纳' },
      { word: 'Configured', translation: '配置 / 定制' }
    ]
  },
  {
    id: 'assisted',
    pattern: /\b(?:assisted)\b/gi,
    isRegex: true,
    weakText: 'assisted',
    desc: '略显被动。强调个人在项目中的具体担当与关键技术产出。',
    replacements: [
      { word: 'Partnered with', translation: '联合 / 协同' },
      { word: 'Contributed to', translation: '参与 / 贡献' },
      { word: 'Co-authored', translation: '共同编写' },
      { word: 'Delivered', translation: '协助交付' }
    ]
  },
  // Chinese weak words
  {
    id: 'fuzela',
    pattern: '负责了',
    isRegex: false,
    weakText: '负责了',
    desc: '高频泛用词，建议根据具体角色换成更精准的业务担当或技术主导动词。',
    replacements: [
      { word: '主导了', translation: '强调主导把控' },
      { word: '统筹了', translation: '强调全局协调' },
      { word: '推进了', translation: '强调落地执行' },
      { word: '完成了', translation: '强调闭环交付' },
      { word: '落地了', translation: '强调成果达成' }
    ]
  },
  {
    id: 'fuze',
    pattern: '负责',
    isRegex: false,
    weakText: '负责',
    desc: '句首口水词，直接用强动词开篇更具冲击力。',
    replacements: [
      { word: '主导', translation: '核心主导地位' },
      { word: '统筹', translation: '全局协调规划' },
      { word: '牵头', translation: '组织协同' },
      { word: '研发', translation: '技术开发' }
    ]
  },
  {
    id: 'zuoguo',
    pattern: '做过',
    isRegex: false,
    weakText: '做过',
    desc: '口语化严重，缺乏专业职场仪式感。建议替换为标准化项目描述。',
    replacements: [
      { word: '设计并开发了', translation: '系统研发' },
      { word: '实施落地了', translation: '闭环推进' },
      { word: '重构并交付了', translation: '工程攻坚' },
      { word: '搭建了', translation: '从0到1构建' }
    ]
  },
  {
    id: 'xiele',
    pattern: '写了',
    isRegex: false,
    weakText: '写了',
    desc: '描述单薄。建议使用展现工程架构与设计水平的词汇。',
    replacements: [
      { word: '封装了', translation: '模块/组件封装' },
      { word: '编写了', translation: '规范书写' },
      { word: '沉淀了', translation: '文档/规范沉淀' },
      { word: '设计了', translation: '架构/体系设计' },
      { word: '独立完成了', translation: '独立担当' }
    ]
  },
  {
    id: 'gaijinle',
    pattern: '改进了',
    isRegex: false,
    weakText: '改进了',
    desc: '含义较为泛化，建议用能够量化、具有提效意味的成就动词。',
    replacements: [
      { word: '优化了', translation: '性能/体验优化' },
      { word: '重构了', translation: '架构升级' },
      { word: '提升了', translation: '效率/指标提升' },
      { word: '迭代了', translation: '版本演进' },
      { word: '解决了', translation: '攻坚排障' }
    ]
  }
];
