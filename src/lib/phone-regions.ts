import {
  PHONE_REGION_CALLING_CODES,
  PHONE_REGION_CODES,
  PRIORITY_PHONE_REGIONS,
  type PhoneRegionCode,
} from '../data/phone-regions';

export interface PhoneRegionOption {
  code: PhoneRegionCode;
  label: string;
  callingCodes: readonly string[];
  primaryCallingCode: string;
  searchText: string;
}

export interface PhoneRegionMatch {
  callingCode: string;
  regionCodes: PhoneRegionCode[];
  preferredRegionCode: PhoneRegionCode | null;
  nationalDigits: string;
  ambiguous: boolean;
}

const FRIENDLY_REGION_NAMES: Record<
  'zh' | 'en',
  Record<string, string>
> = {
  zh: {
    CN: '中国大陆',
    HK: '香港',
    MO: '澳门',
    TW: '台湾',
    SG: '新加坡',
    US: '美国',
    CA: '加拿大',
    GB: '英国',
    IE: '爱尔兰',
    AU: '澳大利亚',
    NZ: '新西兰',
  },
  en: {
    CN: 'Mainland China',
    HK: 'Hong Kong',
    MO: 'Macao',
    TW: 'Taiwan',
    SG: 'Singapore',
    US: 'United States',
    CA: 'Canada',
    GB: 'United Kingdom',
    IE: 'Ireland',
    AU: 'Australia',
    NZ: 'New Zealand',
  },
};

function normalizeLanguage(lang?: string): 'zh' | 'en' {
  return lang === 'en' ? 'en' : 'zh';
}

function getDisplayNames(lang: 'zh' | 'en') {
  try {
    return new Intl.DisplayNames([lang === 'zh' ? 'zh-Hans' : 'en'], {
      type: 'region',
    });
  } catch {
    return null;
  }
}

export function getPhoneRegionName(
  regionCode: PhoneRegionCode,
  lang?: string,
): string {
  const normalizedLang = normalizeLanguage(lang);
  const friendly = FRIENDLY_REGION_NAMES[normalizedLang][regionCode];
  if (friendly) return friendly;

  const displayNames = getDisplayNames(normalizedLang);
  return displayNames?.of(regionCode) || regionCode;
}

export function getPhoneRegionCallingCodes(
  regionCode: PhoneRegionCode,
): readonly string[] {
  return PHONE_REGION_CALLING_CODES[regionCode] ?? [];
}

export function getPrimaryPhoneCallingCode(
  regionCode: PhoneRegionCode,
): string {
  return getPhoneRegionCallingCodes(regionCode)[0] ?? '';
}

function getPriorityIndex(regionCode: string) {
  const index = PRIORITY_PHONE_REGIONS.indexOf(
    regionCode as (typeof PRIORITY_PHONE_REGIONS)[number],
  );
  return index < 0 ? Number.POSITIVE_INFINITY : index;
}

export function getPhoneRegionOptions(lang?: string): PhoneRegionOption[] {
  const normalizedLang = normalizeLanguage(lang);

  return PHONE_REGION_CODES
    .map((code) => {
      const callingCodes = getPhoneRegionCallingCodes(code);
      const label = getPhoneRegionName(code, normalizedLang);
      const primaryCallingCode = callingCodes[0] ?? '';

      return {
        code,
        label,
        callingCodes,
        primaryCallingCode,
        searchText: [
          label,
          code,
          ...callingCodes,
        ]
          .join(' ')
          .toLowerCase(),
      };
    })
    .sort((a, b) => {
      const priorityDelta =
        getPriorityIndex(a.code) - getPriorityIndex(b.code);
      if (Number.isFinite(priorityDelta) && priorityDelta !== 0) {
        return priorityDelta;
      }
      if (Number.isFinite(getPriorityIndex(a.code))) return -1;
      if (Number.isFinite(getPriorityIndex(b.code))) return 1;
      return a.label.localeCompare(b.label, normalizedLang);
    });
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

const CALLING_CODE_INDEX = (() => {
  const map = new Map<string, PhoneRegionCode[]>();

  for (const regionCode of PHONE_REGION_CODES) {
    for (const callingCode of getPhoneRegionCallingCodes(regionCode)) {
      const digits = onlyDigits(callingCode);
      if (!digits) continue;
      const regions = map.get(digits) ?? [];
      regions.push(regionCode);
      map.set(digits, regions);
    }
  }

  return Array.from(map.entries())
    .map(([digits, regionCodes]) => ({ digits, regionCodes }))
    .sort((a, b) => b.digits.length - a.digits.length);
})();

export function matchInternationalPhoneRegion(
  phone: string,
): PhoneRegionMatch | null {
  const trimmed = phone.trim();
  if (!trimmed.startsWith('+')) return null;

  const digits = onlyDigits(trimmed);
  if (!digits) return null;

  const exact = CALLING_CODE_INDEX.find(({ digits: codeDigits }) =>
    digits.startsWith(codeDigits),
  );
  if (!exact) return null;

  const regionCodes = [...exact.regionCodes].sort((a, b) => {
    const priorityDelta = getPriorityIndex(a) - getPriorityIndex(b);
    if (priorityDelta !== 0) return priorityDelta;
    return a.localeCompare(b);
  });

  return {
    callingCode: `+${exact.digits}`,
    regionCodes,
    preferredRegionCode: regionCodes[0] ?? null,
    nationalDigits: digits.slice(exact.digits.length),
    ambiguous: regionCodes.length > 1,
  };
}

export function normalizePhoneInput(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  const hasLeadingPlus = trimmed.startsWith('+');
  const cleaned = trimmed
    .replace(/[^\d+()\-. \s]/g, '')
    .replace(/(?!^)\+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (hasLeadingPlus && !cleaned.startsWith('+')) {
    return `+${cleaned}`;
  }

  return cleaned;
}

export function combineCallingCodeWithLocalNumber(
  regionCode: PhoneRegionCode,
  localNumber: string,
): string {
  const callingCode = getPrimaryPhoneCallingCode(regionCode);
  const normalizedLocal = normalizePhoneInput(localNumber)
    .replace(/^\+/, '')
    .trim();

  if (!callingCode) return normalizedLocal;
  if (!normalizedLocal) return callingCode;

  return `${callingCode} ${normalizedLocal}`;
}
