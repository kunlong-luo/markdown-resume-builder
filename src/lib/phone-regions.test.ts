import { describe, expect, it } from 'vitest';
import {
  combineCallingCodeWithLocalNumber,
  getPhoneRegionName,
  getPhoneRegionOptions,
  matchInternationalPhoneRegion,
  normalizePhoneInput,
} from './phone-regions';

describe('international phone region foundation', () => {
  it('prioritizes core Chinese- and English-speaking regions', () => {
    const options = getPhoneRegionOptions('zh');
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

  it('provides friendly bilingual names for priority regions', () => {
    expect(getPhoneRegionName('CN', 'zh')).toBe('中国大陆');
    expect(getPhoneRegionName('HK', 'zh')).toBe('香港');
    expect(getPhoneRegionName('TW', 'zh')).toBe('台湾');
    expect(getPhoneRegionName('GB', 'en')).toBe('United Kingdom');
    expect(getPhoneRegionName('AU', 'en')).toBe('Australia');
  });

  it('matches independent international calling codes', () => {
    expect(matchInternationalPhoneRegion('+852 9123 4567')).toMatchObject({
      callingCode: '+852',
      regionCodes: ['HK'],
      preferredRegionCode: 'HK',
      nationalDigits: '91234567',
      ambiguous: false,
    });

    expect(matchInternationalPhoneRegion('+44 20 7946 0958')).toMatchObject({
      callingCode: '+44',
      regionCodes: ['GB'],
      preferredRegionCode: 'GB',
      ambiguous: false,
    });
  });

  it('keeps shared +1 calling-code numbers explicitly ambiguous', () => {
    const match = matchInternationalPhoneRegion('+1 416 555 0123');

    expect(match?.callingCode).toBe('+1');
    expect(match?.regionCodes).toEqual(expect.arrayContaining(['US', 'CA']));
    expect(match?.preferredRegionCode).toBe('US');
    expect(match?.ambiguous).toBe(true);
  });

  it('uses a more specific NANP code when the dataset provides one', () => {
    expect(matchInternationalPhoneRegion('+1 787 555 1234')).toMatchObject({
      callingCode: '+1787',
      regionCodes: ['PR'],
      preferredRegionCode: 'PR',
      ambiguous: false,
    });
  });

  it('does not rewrite local trunk prefixes without enough context', () => {
    expect(normalizePhoneInput('020 7946 0958')).toBe('020 7946 0958');
    expect(normalizePhoneInput('+44 (0)20 7946 0958')).toBe(
      '+44 (0)20 7946 0958',
    );
  });

  it('combines an explicit region code without guessing local numbering rules', () => {
    expect(combineCallingCodeWithLocalNumber('CN', '138 0013 8000')).toBe(
      '+86 138 0013 8000',
    );
    expect(combineCallingCodeWithLocalNumber('NZ', '021 123 4567')).toBe(
      '+64 021 123 4567',
    );
  });
});
