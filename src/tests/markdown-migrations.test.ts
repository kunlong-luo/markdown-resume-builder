import { describe, expect, it } from 'vitest';
import { migrateStoredMarkdown } from '../lib/markdown-migrations';

describe('stored Markdown migrations', () => {
  it('preserves ordinary user content while applying structural rewrites', () => {
    const input = [
      '# Candidate',
      '',
      'Worked at Example Company on a privacy-sensitive project.',
      '',
      'GitHub：github.com/example',
      '',
      '## 教育经历',
      'Example University',
    ].join('\n');

    const migrated = migrateStoredMarkdown(input);

    expect(migrated).toContain('Worked at Example Company on a privacy-sensitive project.');
    expect(migrated).toContain('https://github.com/example');
    expect(migrated).toContain('## 教育背景');
  });

  it('removes duplicate education sections without deleting unrelated sections', () => {
    const input = [
      '# Candidate',
      '',
      '## 教育背景',
      'School A',
      '',
      '## 项目经历',
      'Project A',
      '',
      '## 教育背景',
      'School B',
    ].join('\n');

    const migrated = migrateStoredMarkdown(input);

    expect(migrated.match(/## 教育背景/g)).toHaveLength(1);
    expect(migrated).toContain('## 项目经历');
    expect(migrated).toContain('Project A');
  });
});
