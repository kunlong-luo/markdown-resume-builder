import { describe, it, expect } from 'vitest';
import { extractKeywordsFromJd, analyzeResumeMatch } from '../lib/ats-utils';

describe('ats-utils', () => {
  it('should extract tech keywords from job description', () => {
    const jd = `
      We are looking for a Senior Fullstack Engineer proficient in React, TypeScript, Node.js and PostgreSQL.
      Experience with Docker, Kubernetes, CI/CD, and Microservices is a big plus.
      熟悉高并发、性能优化与微服务架构。
    `;
    const keywords = extractKeywordsFromJd(jd);
    expect(keywords).toContain('React');
    expect(keywords).toContain('TypeScript');
    expect(keywords).toContain('Node.js');
    expect(keywords).toContain('PostgreSQL');
    expect(keywords).toContain('Docker');
    expect(keywords).toContain('高并发');
    expect(keywords).toContain('性能优化');
  });

  it('should calculate match score and find missing keywords', () => {
    const resume = `
      # 张三
      熟练使用 React, TypeScript 和 Docker 开发微服务系统，负责性能优化与架构设计。
    `;
    const jdKeywords = ['React', 'TypeScript', 'Docker', 'Kubernetes', 'Go'];
    const result = analyzeResumeMatch(resume, jdKeywords);
    
    expect(result.matched).toContain('React');
    expect(result.matched).toContain('TypeScript');
    expect(result.matched).toContain('Docker');
    expect(result.missing).toContain('Kubernetes');
    expect(result.missing).toContain('Go');
    expect(result.score).toBe(60);
  });
});
