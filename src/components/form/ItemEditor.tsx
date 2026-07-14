import React from 'react';
import { Sparkles, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { FormItem } from '../../lib/form-types';
import { FormTextareaToolbar } from './FormTextareaToolbar';
import { MonthRangePicker } from './MonthRangePicker';

interface ItemEditorProps {
  item: FormItem;
  index: number;
  totalItems: number;
  category: string;
  onFieldChange: (field: any, value: string) => void;
  onContentChange: (content: string) => void;
  onMove: (direction: 'up' | 'down') => void;
  onDelete: () => void;
  onInsertStarTemplate: () => void;
  lang?: string;
}

const TRANSLATIONS = {
  zh: {
    periodLabel: '起止时间',
    gpaLabel: '学业成绩 / 绩点 (可选)',
    gpaPlaceholder: '如：绩点 3.8/4.0，专业前 5%',
    coursesLabel: '主修 / 核心课程 (可选)',
    coursesPlaceholder: '如：数据结构、计算机网络',
    honorsLabel: '荣誉与奖项 (可选)',
    honorsPlaceholder: '如：国家奖学金、竞赛一等奖',
    eduSuppLabel: '补充描述 (可选)',
    eduSuppPlaceholder: '如有其他校园经历或社团活动可在此处填写（支持 Markdown）',
    moveUp: '上移此条经历',
    moveDown: '下移此条经历',
    deleteItem: '删除此条经历',
    categories: {
      default: {
        orgLabel: '经历单位 / 组织名称',
        orgPlaceholder: '如：腾讯科技、某开源项目组',
        roleLabel: '职务 / 角色 / 专业',
        rolePlaceholder: '如：高级前端开发、核心贡献者',
        timePlaceholder: '如：2023.06 - 至今',
        contentLabel: '职责与产出',
        contentPlaceholder: `- **核心职责**：描述你负责的主导模块、要解决的核心问题\n- **量化结果**：列出清晰可证明的业务成效或量化数据\n- **项目收益**：项目顺利上线，得到了部门领导和用户的肯定`,
        starTitle: '导入 STAR 描述示例',
      },
      edu: {
        orgLabel: '毕业学校 / 培养机构',
        orgPlaceholder: '如：北京大学、清华大学',
        roleLabel: '专业与学位 (或培养类型)',
        rolePlaceholder: '如：计算机科学与技术 (硕士)',
        timePlaceholder: '如：2020.09 - 2024.06',
        contentLabel: '在校表现 / 主修课程 / 荣誉成就',
        contentPlaceholder: `- **学业成绩**：绩点 GPA 3.8/4.0，专业前 5%\n- **主修课程**：高级数据结构、算法设计、操作系统、分布式计算\n- **荣誉成就**：国家奖学金、算法竞赛一等奖`,
        starTitle: '导入学术履历模板',
      },
      project: {
        orgLabel: '项目名称',
        orgPlaceholder: '如：高并发支付系统、微服务架构重构',
        roleLabel: '项目角色 / 担当职责',
        rolePlaceholder: '如：核心研发、架构师',
        timePlaceholder: '如：2024.01 - 2024.04',
        contentLabel: '项目详述与调优产出 (支持 STAR)',
        contentPlaceholder: `- **[Situation 业务背景]**：高并发下面临什么性能瓶颈\n- **[Task 核心任务]**：你负责攻克什么模块、调优指标\n- **[Action 关键行动]**：你做了什么核心技术方案、架构重构\n- **[Result 实际产出]**：响应延迟缩短 %，QPS 提升`,
        starTitle: '导入 STAR 项目模板',
      },
      work: {
        orgLabel: '公司 / 企业名称',
        orgPlaceholder: '如：腾讯科技、字节跳动',
        roleLabel: '职务名称 / 所属团队',
        rolePlaceholder: '如：高级前端开发工程师',
        timePlaceholder: '如：2022.06 - 至今',
        contentLabel: '工作职责与量化产出',
        contentPlaceholder: `- **核心职责**：负责并主导...模块研发\n- **关键业绩**：攻克了...技术难关\n- **量化结果**：提升了...% 吞吐量或降低了故障率`,
        starTitle: '导入 STAR 工作模板',
      }
    }
  },
  en: {
    periodLabel: 'Period',
    gpaLabel: 'Academic / GPA (Optional)',
    gpaPlaceholder: 'e.g. GPA 3.8/4.0, Top 5%',
    coursesLabel: 'Major Courses (Optional)',
    coursesPlaceholder: 'e.g. Data Structures, Computer Networks',
    honorsLabel: 'Honors & Awards (Optional)',
    honorsPlaceholder: 'e.g. National Scholarship, First Prize',
    eduSuppLabel: 'Supplemental Description (Optional)',
    eduSuppPlaceholder: 'Additional campus experiences or activities (Markdown supported)',
    moveUp: 'Move item up',
    moveDown: 'Move item down',
    deleteItem: 'Delete this item',
    categories: {
      default: {
        orgLabel: 'Organization / Company Name',
        orgPlaceholder: 'e.g. Acme Corp, Open Source Group',
        roleLabel: 'Role / Title / Major',
        rolePlaceholder: 'e.g. Lead Frontend Developer, Contributor',
        timePlaceholder: 'e.g. 2023.06 - Present',
        contentLabel: 'Responsibilities & Deliverables',
        contentPlaceholder: `- **Key Responsibilities**: Describe the module you owned and key problems solved\n- **Quantifiable Results**: Highlight clear, measurable business metrics or technical improvements\n- **Impact**: Delivered smoothly, receiving recognition from leadership and clients`,
        starTitle: 'Import highly professional STAR description template',
      },
      edu: {
        orgLabel: 'Institution Name',
        orgPlaceholder: 'e.g. Harvard University',
        roleLabel: 'Major & Degree',
        rolePlaceholder: 'e.g. M.S. in Computer Science',
        timePlaceholder: 'e.g. 2020.09 - 2024.06',
        contentLabel: 'Academic Performance / Courses / Honors',
        contentPlaceholder: `- **Academic Performance**: GPA 3.8/4.0, Top 5% of class\n- **Core Courses**: Advanced Data Structures, Algorithms, Distributed Systems\n- **Honors**: Dean's List, First Prize in Hackathon`,
        starTitle: 'Import high-caliber academic education template',
      },
      project: {
        orgLabel: 'Project Name',
        orgPlaceholder: 'e.g. High-Concurrency Payment System',
        roleLabel: 'Project Role / Contribution',
        rolePlaceholder: 'e.g. Lead Architect, Core Developer',
        timePlaceholder: 'e.g. 2024.01 - 2024.04',
        contentLabel: 'Project Details & Quantifiable Outcomes (STAR)',
        contentPlaceholder: `- **[Situation]**: Bottleneck faced under high concurrent traffic\n- **[Task]**: Target optimization metrics and your primary assignment\n- **[Action]**: Core architectural designs, optimization strategies, and solutions applied\n- **[Result]**: Reduced latency by %, improved QPS capability to `,
        starTitle: 'Import professional STAR project template',
      },
      work: {
        orgLabel: 'Company / Enterprise Name',
        orgPlaceholder: 'e.g. Google, Microsoft',
        roleLabel: 'Role Title / Team',
        rolePlaceholder: 'e.g. Senior Frontend Engineer',
        timePlaceholder: 'e.g. 2022.06 - Present',
        contentLabel: 'Responsibilities & Deliverables (STAR)',
        contentPlaceholder: `- **Key Responsibilities**: Spearheaded the design and development of ...\n- **Core Achievements**: Resolved ... critical latency bugs\n- **Quantifiable Results**: Enhanced throughput by ...% or decreased incident frequency by ...%`,
        starTitle: 'Import professional STAR work experience template',
      }
    }
  }
};

export function ItemEditor({
  item, index, totalItems, category,
  onFieldChange, onContentChange, onMove, onDelete, onInsertStarTemplate,
  lang = 'zh'
}: ItemEditorProps) {
  const dict = lang === 'en' ? TRANSLATIONS.en : TRANSLATIONS.zh;
  
  // Safely find the category config
  const catKey = (category in dict.categories) ? (category as 'edu' | 'project' | 'work') : 'default';
  const cat = dict.categories[catKey];

  return (
    <div className="p-4 border border-slate-200/60 rounded-xl bg-gradient-to-br from-white to-slate-50/60 relative space-y-3 transition-all group/item shadow-[0_2px_6px_rgba(15,23,42,0.01),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(15,23,42,0.03),inset_0_1.5px_2px_rgba(255,255,255,0.95)]">
      <div className="absolute right-3 top-3 flex items-center gap-1 opacity-40 group-hover/item:opacity-100 transition-opacity">
        <button type="button" onClick={onInsertStarTemplate} className="p-1 hover:bg-amber-50 text-amber-600 rounded transition-colors cursor-pointer" title={cat.starTitle}>
          <Sparkles className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => onMove('up')} disabled={index === 0} className={`p-1 rounded transition-colors ${index === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:bg-white hover:text-slate-800 cursor-pointer'}`} title={dict.moveUp}>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => onMove('down')} disabled={index === totalItems - 1} className={`p-1 rounded transition-colors ${index === totalItems - 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:bg-white hover:text-slate-800 cursor-pointer'}`} title={dict.moveDown}>
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={onDelete} className="p-1 hover:bg-red-50 text-red-500 hover:text-red-700 rounded transition-colors cursor-pointer" title={dict.deleteItem}>
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 pr-24">
        <div className="flex-1 min-w-0">
          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{cat.orgLabel}</label>
          <input type="text" value={item.org || ''} onChange={(e) => onFieldChange('org', e.target.value)} className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-800 tactile-input" placeholder={cat.orgPlaceholder} />
        </div>
        <div className="flex-1 min-w-0">
          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{cat.roleLabel}</label>
          <input type="text" value={item.role || ''} onChange={(e) => onFieldChange('role', e.target.value)} className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-800 tactile-input" placeholder={cat.rolePlaceholder} />
        </div>
        <div className="w-full md:w-[220px] shrink-0">
          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{dict.periodLabel}</label>
          <MonthRangePicker
            value={item.time || ''}
            onChange={(val) => onFieldChange('time', val)}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-800 tactile-input font-mono"
            placeholder={cat.timePlaceholder}
            lang={lang}
          />
        </div>
      </div>

      {category === 'edu' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{dict.gpaLabel}</label>
            <input type="text" value={item.gpa || ''} onChange={(e) => onFieldChange('gpa', e.target.value)} className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-800 tactile-input" placeholder={dict.gpaPlaceholder} />
          </div>
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{dict.coursesLabel}</label>
            <input type="text" value={item.courses || ''} onChange={(e) => onFieldChange('courses', e.target.value)} className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-800 tactile-input" placeholder={dict.coursesPlaceholder} />
          </div>
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{dict.honorsLabel}</label>
            <input type="text" value={item.honors || ''} onChange={(e) => onFieldChange('honors', e.target.value)} className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-800 tactile-input" placeholder={dict.honorsPlaceholder} />
          </div>
        </div>
      )}

      <div>
        <div className="mb-1">
          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            {category === 'edu' ? dict.eduSuppLabel : cat.contentLabel}
          </label>
        </div>
        <div className="flex flex-col mt-1">
          <FormTextareaToolbar textareaId={item.id} value={item.content} onChange={onContentChange} lang={lang} />
          <textarea id={item.id} value={item.content} onChange={(e) => onContentChange(e.target.value)} rows={category === 'edu' ? 3 : 5} className="w-full p-2.5 text-xs font-mono leading-relaxed bg-slate-50/10 border border-slate-200/80 rounded-b-lg rounded-t-none border-t-0 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 shadow-[inset_0_1.5px_3px_rgba(15,23,42,0.04)] focus:shadow-none transition-all duration-200" placeholder={category === 'edu' ? dict.eduSuppPlaceholder : cat.contentPlaceholder} />
        </div>
      </div>
    </div>
  );
}
