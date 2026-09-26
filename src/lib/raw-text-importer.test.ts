import { describe, expect, it } from 'vitest';
import { parseRawTextToResumeMarkdown } from './raw-text-importer';

describe('raw text resume import', () => {
  it('detects international phone numbers from pasted resume text', () => {
    const result = parseRawTextToResumeMarkdown(
      [
        'Alex Morgan',
        '+44 20 7946 0958 | alex@example.com',
        'Software Engineer',
        'Experience',
        'Example Ltd',
      ].join('\n'),
    );

    expect(result).toContain('+44 20 7946 0958');
    expect(result).toContain('alex@example.com');
  });

  it('does not inject a China-specific phone placeholder when none exists', () => {
    const result = parseRawTextToResumeMarkdown(
      ['Alex Morgan', 'alex@example.com', 'Software Engineer'].join('\n'),
    );

    expect(result).not.toContain('138-0000-0000');
  });
});
