import { describe, expect, it } from 'vitest';
import {
  getSafeAnalyticsPath,
  isDoNotTrackEnabled,
  isOfficialAnalyticsContext,
} from '../lib/analytics';

describe('privacy-friendly analytics', () => {
  it('only enables analytics on the official hosted app', () => {
    expect(isOfficialAnalyticsContext('kunlong-luo.github.io', '/resume-craft/')).toBe(true);
    expect(isOfficialAnalyticsContext('kunlong-luo.github.io', '/resume-craft/shared')).toBe(true);
    expect(isOfficialAnalyticsContext('localhost', '/resume-craft/')).toBe(false);
    expect(isOfficialAnalyticsContext('example.com', '/resume-craft/')).toBe(false);
  });

  it('normalizes share URLs without exposing the share payload', () => {
    const payload = 'private-resume-payload';
    const path = getSafeAnalyticsPath(
      '/resume-craft/',
      `?share=${encodeURIComponent(payload)}&utm_source=test`,
    );

    expect(path).toBe('/resume-craft/shared');
    expect(path).not.toContain(payload);
    expect(path).not.toContain('share=');
  });

  it('keeps normal app paths and ignores ordinary query data', () => {
    expect(getSafeAnalyticsPath('/resume-craft/', '?utm_source=github')).toBe('/resume-craft/');
  });

  it('respects Do Not Track values', () => {
    expect(isDoNotTrackEnabled({ doNotTrack: '1' })).toBe(true);
    expect(isDoNotTrackEnabled({ doNotTrack: 'yes' })).toBe(true);
    expect(isDoNotTrackEnabled({ doNotTrack: '0' })).toBe(false);
    expect(isDoNotTrackEnabled({ doNotTrack: null })).toBe(false);
  });
});
