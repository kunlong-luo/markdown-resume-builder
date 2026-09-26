import { describe, expect, it } from 'vitest';
import {
  analyzePhoneNumber,
  findPhoneCandidate,
  getPhoneRegionOptions,
  normalizePhoneForResume,
} from './phone-utils';

describe('international phone utilities', () => {
  it('normalizes mainland China mobile numbers with a selected region', () => {
    expect(normalizePhoneForResume('13800138000', 'CN')).toBe(
      '+86 138 0013 8000',
    );
  });

  it('normalizes Hong Kong, Macao, and Taiwan numbers', () => {
    expect(normalizePhoneForResume('91234567', 'HK')).toBe('+852 9123 4567');
    expect(normalizePhoneForResume('66123456', 'MO')).toBe('+853 6612 3456');
    expect(normalizePhoneForResume('0912 345 678', 'TW')).toBe(
      '+886 912 345 678',
    );
  });

  it('normalizes North American, UK, and Australian numbers', () => {
    expect(normalizePhoneForResume('4155550123', 'US')).toBe(
      '+1 415 555 0123',
    );
    expect(normalizePhoneForResume('4165550123', 'CA')).toBe(
      '+1 416 555 0123',
    );
    expect(normalizePhoneForResume('020 7946 0958', 'GB')).toBe(
      '+44 20 7946 0958',
    );
    expect(normalizePhoneForResume('02 9374 4000', 'AU')).toBe(
      '+61 2 9374 4000',
    );
  });

  it('detects a pasted international number without a selected region', () => {
    const analysis = analyzePhoneNumber('+65 6123 4567');

    expect(analysis.isInternational).toBe(true);
    expect(analysis.country).toBe('SG');
    expect(analysis.isPossible).toBe(true);
    expect(analysis.display).toBe('+65 6123 4567');
  });

  it('finds international phone numbers in imported resume text', () => {
    const found = findPhoneCandidate(
      'Alex Chen | alex@example.com | +44 20 7946 0958 | London',
    );

    expect(found?.country).toBe('GB');
    expect(found?.display).toBe('+44 20 7946 0958');
  });

  it('provides global region options with common Chinese and English markets prioritized', () => {
    const options = getPhoneRegionOptions('en');
    const codes = options.map((option) => option.code);

    expect(options.length).toBeGreaterThan(200);
    expect(codes).toEqual(
      expect.arrayContaining([
        'CN',
        'HK',
        'MO',
        'TW',
        'SG',
        'US',
        'CA',
        'GB',
        'IE',
        'AU',
        'NZ',
        'DE',
        'FR',
      ]),
    );

    expect(options.slice(0, 11).map((option) => option.code)).toEqual([
      'CN',
      'HK',
      'MO',
      'TW',
      'SG',
      'US',
      'CA',
      'GB',
      'IE',
      'AU',
      'NZ',
    ]);
  });
  it('does not guess a country for a bare local phone candidate', () => {
    const found = findPhoneCandidate('Contact: 2125551234');

    expect(found?.raw).toBe('2125551234');
    expect(found?.country).toBeUndefined();
    expect(found?.isInternational).toBe(false);
  });

});
