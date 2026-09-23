import { describe, it, expect } from 'vitest';
import {
  isTimeString,
  cleanPart,
  splitItemTitle,
  formatPhoneNumber,
  parseContactString,
  classifySubsequentLines,
  getSectionCategory,
  parseExperienceField,
  serializeExperienceField,
  parseMarkdownToForm,
  parseFormToMarkdown
} from '../lib/markdown-parser';

describe('markdown-parser', () => {
  describe('isTimeString', () => {
    it('should identify valid time strings', () => {
      expect(isTimeString('2021.09 - 2025.06')).toBe(true);
      expect(isTimeString('2023.03 — 至今')).toBe(true);
      expect(isTimeString('2020 - Present')).toBe(true);
      expect(isTimeString('2022年毕业')).toBe(true);
      expect(isTimeString('高级前端工程师')).toBe(false);
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format Chinese 11-digit mobile numbers with spaces', () => {
      expect(formatPhoneNumber('13800138000')).toBe('138 0013 8000');
    });

    it('should format +86 prefix numbers', () => {
      expect(formatPhoneNumber('+8613800138000')).toBe('+86 138 0013 8000');
    });

    it('should format landline numbers', () => {
      expect(formatPhoneNumber('01088888888')).toBe('010-88888888');
      expect(formatPhoneNumber('057188888888')).toBe('0571-88888888');
    });

    it('should format US numbers', () => {
      expect(formatPhoneNumber('2125551234')).toBe('(212) 555-1234');
    });
  });

  describe('splitItemTitle', () => {
    it('should parse org, degree, role and time', () => {
      const res = splitItemTitle('浙江大学 ｜ 硕士 ｜ 计算机科学与技术 ｜ *2021.09 — 2024.06*');
      expect(res.org).toBe('浙江大学');
      expect(res.degree).toBe('硕士');
      expect(res.role).toBe('计算机科学与技术');
      expect(res.time).toContain('2021.09 — 2024.06');
    });

    it('should parse company and role with time', () => {
      const res = splitItemTitle('阿里巴巴 ｜ 资深前端开发专家 ｜ 2021.06 - 至今');
      expect(res.org).toBe('阿里巴巴');
      expect(res.role).toBe('资深前端开发专家');
      expect(res.time).toBe('2021.06 - 至今');
    });
  });

  describe('parseContactString', () => {
    it('should extract email, phone and social accounts', () => {
      const parsed = parseContactString('13800138000 · test@example.com · github.com/user · 微信: mywechat');
      expect(parsed.email).toBe('test@example.com');
      expect(parsed.phone).toBe('138 0013 8000');
      expect(parsed.wechat).toBe('mywechat');
      expect(parsed.social).toContain('github.com/user');
    });
  });

  describe('parseExperienceField & serializeExperienceField', () => {
    it('should parse experience tags correctly', () => {
      const parsed = parseExperienceField('5年经验 ｜ 硕士 ｜ 28岁 ｜ 杭州 / 上海 ｜ 在职-随时到岗');
      expect(parsed.workYears).toBe('5年经验');
      expect(parsed.degree).toBe('硕士');
      expect(parsed.age).toBe('28');
      expect(parsed.city).toContain('杭州');
      expect(parsed.jobStatus).toBe('在职-随时到岗');
    });

    it('should serialize experience correctly', () => {
      const serialized = serializeExperienceField({
        workYears: '3年经验',
        degree: '本科',
        age: '25',
        city: '北京',
        jobStatus: '随时到岗'
      });
      expect(serialized).toBe('3年经验 ｜ 本科 ｜ 25 ｜ 北京 ｜ 随时到岗');
    });
  });

  describe('Bi-directional Markdown <-> Form roundtrip', () => {
    it('should parse markdown and serialize back preserving key data', () => {
      const sampleMd = `# 张三
高级全栈工程师
138 0013 8000 · zhangsan@example.com · github.com/zhangsan · 微信: zhangsan_dev
5年经验 ｜ 硕士 ｜ 28 ｜ 杭州 ｜ 随时到岗

## 工作经历

### 字节跳动 ｜ 资深前端工程师 ｜ *2022.03 — 至今*
- 负责抖音电商核心结算架构升级
- 优化前端性能与监控指标

## 教育背景

### 浙江大学 ｜ 硕士 ｜ 计算机科学 ｜ *2019.09 — 2022.03*
- **在校表现**：GPA 3.9 / 专业前 5%
- **主修课程**：分布式计算、高级算法
`;

      const form = parseMarkdownToForm(sampleMd);
      expect(form.name).toBe('张三');
      expect(form.subtitle).toBe('高级全栈工程师');
      expect(form.phone).toBe('138 0013 8000');
      expect(form.email).toBe('zhangsan@example.com');
      expect(form.sections.length).toBe(2);

      const generatedMd = parseFormToMarkdown(form);
      expect(generatedMd).toContain('# 张三');
      expect(generatedMd).toContain('## 工作经历');
      expect(generatedMd).toContain('字节跳动');
      expect(generatedMd).toContain('## 教育背景');
      expect(generatedMd).toContain('浙江大学');
    });
  });
});
