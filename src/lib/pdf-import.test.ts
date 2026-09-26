import { describe, expect, it } from 'vitest';
import {
  analyzePdfParseability,
  textItemsToLines,
  type PdfTextItemLike,
} from './pdf-import';

describe('PDF import helpers', () => {
  it('rebuilds lines from positioned PDF text items', () => {
    const items: PdfTextItemLike[] = [
      { str: 'Chen', transform: [1, 0, 0, 12, 120, 700], height: 12 },
      { str: 'Alex', transform: [1, 0, 0, 12, 72, 700], height: 12 },
      { str: 'Experience', transform: [1, 0, 0, 11, 72, 660], height: 11 },
      { str: 'Senior Engineer', transform: [1, 0, 0, 10, 72, 640], height: 10 },
    ];

    expect(textItemsToLines(items)).toEqual([
      'Alex Chen',
      'Experience',
      'Senior Engineer',
    ]);
  });

  it('does not force spaces between adjacent CJK text fragments', () => {
    const items: PdfTextItemLike[] = [
      { str: '工作', transform: [1, 0, 0, 12, 72, 700], height: 12 },
      { str: '经历', transform: [1, 0, 0, 12, 100, 700], height: 12 },
    ];

    expect(textItemsToLines(items)).toEqual(['工作经历']);
  });

  it('reports strong extraction signals for machine-readable resume text', () => {
    const result = analyzePdfParseability(
      [
        'Alex Chen',
        'alex@example.com | +1 555 123 4567',
        'Summary',
        'Software engineer focused on distributed systems and reliable products.',
        'Experience',
        'Example Corp | Senior Engineer | 2022 - Present',
        'Led platform modernization and improved reliability across production systems.',
        'Skills',
        'TypeScript React Python SQL Kubernetes',
        'Education',
        'Example University | B.S. Computer Science | 2018 - 2022',
      ].join('\n'),
      1,
    );

    expect(result.level).toBe('good');
    expect(result.score).toBeGreaterThanOrEqual(78);
    expect(result.emailFound).toBe(true);
    expect(result.phoneFound).toBe(true);
    expect(result.sectionHeadings).toEqual(
      expect.arrayContaining(['summary', 'experience', 'skills', 'education']),
    );
  });

  it('flags a nearly empty extraction for manual review', () => {
    const result = analyzePdfParseability('Resume', 1);

    expect(result.level).toBe('poor');
    expect(result.signals).toContain('very-little-text');
    expect(result.signals).toContain('email-not-detected');
    expect(result.signals).toContain('few-section-headings');
  });
});
