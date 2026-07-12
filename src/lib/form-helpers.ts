
import { FormItem, FormSection } from './form-types';

export const getPresetSection = (presetType: string): Omit<FormSection, 'id'> => {
  let title = '';
  let type: 'text' | 'items' = 'items';
  let textValue = '';
  let items: FormItem[] = [];

  const now = Date.now();

  switch (presetType) {
    case 'work':
      title = '工作经历';
      type = 'items';
      items = [{
        id: `item_${now}_1`,
        org: '企业或公司名称',
        role: '职位角色',
        time: '2023.01 — 至今',
        content: '- **工作职责**：负责并主导...\n- **关键业绩**：攻克了...\n- **量化结果**：带来了...% 提升'
      }];
      break;
    case 'project':
      title = '项目经验';
      type = 'items';
      items = [{
        id: `item_${now}_1`,
        org: '项目名称',
        role: '项目角色',
        time: '2024.01 — 2024.06',
        content: '- **[Situation]**：描述项目产生的背景，当前面临的主要性能瓶颈和业务需求\n- **[Task]**：明确你在项目里负责攻克的核心模块以及设立的具体调优指标\n- **[Action]**：详细写你主导了什么架构改造，使用了哪些优化手段、设计模式和高并发组件\n- **[Result]**：列出项目上线后的最终量化成效，比如核心响应延迟降低...%，QPS提升...% 或者是按期高质量交付'
      }];
      break;
    case 'edu':
      title = '教育背景';
      type = 'items';
      items = [{
        id: `item_${now}_1`,
        org: '学校或研究机构名称',
        degree: '本科',
        role: '专业或学科名称',
        time: '2020.09 — 2024.06',
        content: '- **在校成绩**：绩点 GPA 3.8/4.0，获得一等奖学金\n- **学术经历**：主修计算机网络、高级数据结构、算法分析等核心领域'
      }];
      break;
    case 'skills':
      title = '专业技能';
      type = 'text';
      textValue = '- **前端开发**：熟练掌握 React, TypeScript, Tailwind CSS, Next.js 等主流工程技术栈\n- **后端技术**：熟练掌握 Node.js / Java / Go 开发，对 Redis 缓存设计和高并发场景处理有实践心得\n- **工程素养**：注重团队规范协作，熟练掌握 CI/CD 与 Git 工作流体系';
      break;
    case 'summary':
      title = '个人总结 / 自味评价';
      type = 'text';
      textValue = '具备 X 年专业互联网项目实践经验，热衷技术攻关与效率改善。具备良好的团队协作、跨领域沟通素养以及持续深耕的业务理解力，能承受高强度的技术攻关。';
      break;
    case 'custom_text':
      title = '自定义文本模块';
      type = 'text';
      textValue = '- 优势要点描述 1\n- 优势要点描述 2';
      break;
    case 'custom_items':
      title = '自定义经历模块';
      type = 'items';
      items = [{
        id: `item_${now}_1`,
        org: '组织或项目名称',
        role: '担任角色',
        time: '2024.01 — 至今',
        content: '- 核心细节内容描述 1\n- 核心细节内容描述 2'
      }];
      break;
  }

  return { title, type, textValue, items };
};

export const getStarTemplate = (sectionTitle: string): Partial<FormItem> => {
  const category = sectionTitle.includes('教育') || sectionTitle.includes('学校') || sectionTitle.includes('本科') || sectionTitle.includes('硕士') || sectionTitle.includes('博士') || sectionTitle.toLowerCase().includes('education') || sectionTitle.toLowerCase().includes('academic') ? 'edu' :
                   sectionTitle.includes('项目') || sectionTitle.includes('产品') || sectionTitle.includes('开源') || sectionTitle.toLowerCase().includes('project') || sectionTitle.toLowerCase().includes('portfolio') ? 'project' :
                   sectionTitle.includes('工作') || sectionTitle.includes('经历') || sectionTitle.includes('实习') || sectionTitle.toLowerCase().includes('work') || sectionTitle.toLowerCase().includes('experience') || sectionTitle.toLowerCase().includes('career') ? 'work' : 'default';

  if (category === 'edu') {
    return { 
      gpa: '绩点 GPA 3.8/4.0，连续三年专业前 5%',
      courses: '数据结构与算法分析、计算机网络、操作系统、分布式架构设计',
      honors: '国家奖学金、校一等奖学金',
      content: '- **科研学术**：参与省重点实验室项目，负责核心模块 design\n- **校园实践**：担任计算机协会会长，成功筹备 3 场全校算法挑战赛' 
    };
  } else if (category === 'project') {
    return { content: `- **[Situation 业务背景]**：在并发量达万级时，原有支付系统出现大面积卡顿和高耗时问题，导致订单流失率上升了 12%\n- **[Task 核心任务]**：作为主程负责链路重构，在 2 个月内完成性能调优，将平均延迟控制在 300ms 以内\n- **[Action 关键行动]**：1. 使用 Spring Cloud 核心组件做微服务拆分；2. 优化慢 SQL 并对热点数据进行 Redis 强缓存设计\n- **[Result 实际产出]**：核心响应耗时从 3.5s 降至 0.2s，双十一并发高峰零故障，核心订单转化率提升 14%` };
  } else if (category === 'work') {
    return { content: `- **核心职责**：负责公司核心电商交易链路、购物车及结算服务模块 of 研发，参与高可用高并发方案设计\n- **技术攻坚**：主导了慢查询治理、Redis 缓存雪崩应对以及非对称加密优化，将全链路安全性与吞吐性能大幅提升\n- **量化结果**：所负责模块接口平均耗时减少 35%，核心接口吞吐量 QPS 提升 120%，保障了大促期间平稳无故障运行` };
  } else {
    return { content: `- **职责范围**：负责组织或项目的日常运营与核心模块编写，带领团队高效协作\n- **工作行动**：1. 采用新框架重构核心业务流；2. 制定每周 Code Review 规范与开发文档沉淀\n- **具体成效**：项目周期缩短了 20%，团队新人上手熟练度及日常交付质量明显提升` };
  }
};
