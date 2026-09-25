import { describe, expect, it } from 'vitest';
import {
  deserializeShareState,
  getSharePayloadFromLocation,
  serializeShareState,
} from '../lib/share-utils';
import type { ResumeSettings } from '../types';

const settings: ResumeSettings = {
  themeColor: 'indigo',
  fontSize: 'standard',
  fontFamily: 'sans',
  margin: 'standard',
  layoutMode: 'split',
  h2Style: 'accent-line',
  topAccentLine: true,
  lineHeight: 1.6,
  blockGap: 1,
  letterSpacing: 0,
  showPageBreakLine: true,
  templateLayout: 'single',
  lang: 'zh',
};

describe('privacy-preserving share links', () => {
  it('prefers fragment payloads and keeps legacy query links compatible', () => {
    expect(
      getSharePayloadFromLocation('?share=legacy', '#share=fragment'),
    ).toBe('fragment');

    expect(
      getSharePayloadFromLocation('?share=legacy', ''),
    ).toBe('legacy');
  });

  it('round-trips share state without requiring a backend', () => {
    const encoded = serializeShareState({
      markdown: '# Candidate\n\nPrivate resume content',
      settings,
      passwordHash: 'client-side-code',
    });

    const decoded = deserializeShareState(encoded);

    expect(decoded?.markdown).toBe('# Candidate\n\nPrivate resume content');
    expect(decoded?.settings.themeColor).toBe('indigo');
    expect(decoded?.passwordHash).toBe('client-side-code');
  });
});
