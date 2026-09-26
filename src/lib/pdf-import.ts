export const MAX_PDF_FILE_SIZE = 12 * 1024 * 1024;
export const MAX_PDF_PAGES = 20;

export type PdfParseabilityLevel = 'good' | 'review' | 'poor';

export interface PdfTextItemLike {
  str: string;
  transform?: ArrayLike<number>;
  width?: number;
  height?: number;
  hasEOL?: boolean;
}

export interface PdfParseabilityResult {
  score: number;
  level: PdfParseabilityLevel;
  emailFound: boolean;
  phoneFound: boolean;
  sectionHeadings: string[];
  replacementCharacterRatio: number;
  extractedCharacters: number;
  extractedLines: number;
  signals: string[];
}

export interface PdfExtractionResult {
  text: string;
  pageCount: number;
  parsedPageCount: number;
  parseability: PdfParseabilityResult;
  warnings: string[];
}

export class PdfImportError extends Error {
  constructor(
    public readonly code:
      | 'too-large'
      | 'invalid-pdf'
      | 'encrypted'
      | 'no-text'
      | 'parse-failed',
    message: string,
  ) {
    super(message);
    this.name = 'PdfImportError';
  }
}

const COMMON_SECTION_HEADINGS = [
  'experience',
  'work experience',
  'employment',
  'education',
  'skills',
  'projects',
  'summary',
  'profile',
  'certifications',
  'awards',
  '工作经历',
  '工作经验',
  '教育背景',
  '项目经历',
  '项目经验',
  '专业技能',
  '技能',
  '个人优势',
  '个人简介',
  '证书',
  '荣誉奖项',
];

function normalizedText(value: string) {
  return value.replace(/\u00a0/g, ' ').replace(/[ \t]+/g, ' ').trim();
}

function getItemPosition(item: PdfTextItemLike) {
  const transform = item.transform;
  return {
    x: transform && transform.length >= 6 ? Number(transform[4]) || 0 : 0,
    y: transform && transform.length >= 6 ? Number(transform[5]) || 0 : 0,
    height:
      item.height && Number.isFinite(item.height)
        ? Math.max(1, item.height)
        : transform && transform.length >= 4
          ? Math.max(
              1,
              Math.hypot(
                Number(transform[2]) || 0,
                Number(transform[3]) || 0,
              ),
            )
          : 10,
  };
}

function shouldInsertSpace(previous: string, next: string) {
  if (!previous || !next) return false;
  if (/\s$/.test(previous) || /^\s/.test(next)) return false;
  if (/^[,.;:!?，。；：！？、)\]}]/.test(next)) return false;
  if (/[([{（【]$/.test(previous)) return false;

  const previousLast = previous.at(-1) ?? '';
  const nextFirst = next[0] ?? '';
  const isCjk = (char: string) =>
    /[\u3400-\u9fff\uf900-\ufaff]/.test(char);

  if (isCjk(previousLast) && isCjk(nextFirst)) return false;
  return true;
}

export function textItemsToLines(items: PdfTextItemLike[]): string[] {
  const usable = items
    .map((item, index) => {
      const text = normalizedText(item.str ?? '');
      if (!text) return null;
      return {
        index,
        text,
        hasEOL: Boolean(item.hasEOL),
        ...getItemPosition(item),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (usable.length === 0) return [];

  const rows: Array<{
    y: number;
    tolerance: number;
    items: typeof usable;
  }> = [];

  for (const item of usable) {
    const tolerance = Math.max(2, Math.min(5, item.height * 0.35));
    let row = rows.find(
      (candidate) =>
        Math.abs(candidate.y - item.y) <=
        Math.max(candidate.tolerance, tolerance),
    );

    if (!row) {
      row = { y: item.y, tolerance, items: [] };
      rows.push(row);
    }

    row.items.push(item);
    row.y =
      row.items.reduce((sum, current) => sum + current.y, 0) /
      row.items.length;
    row.tolerance = Math.max(row.tolerance, tolerance);
  }

  rows.sort((a, b) => b.y - a.y);

  return rows
    .map((row) => {
      row.items.sort((a, b) => {
        if (Math.abs(a.x - b.x) > 0.5) return a.x - b.x;
        return a.index - b.index;
      });

      let line = '';
      for (const item of row.items) {
        if (shouldInsertSpace(line, item.text)) line += ' ';
        line += item.text;
      }
      return normalizedText(line);
    })
    .filter(Boolean);
}

export function analyzePdfParseability(
  text: string,
  pageCount: number,
): PdfParseabilityResult {
  const normalized = text.replace(/\r\n?/g, '\n').trim();
  const lines = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const lower = normalized.toLowerCase();
  const extractedCharacters = normalized.replace(/\s/g, '').length;

  const emailFound =
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(normalized);
  const phoneFound =
    /(?:\+?\d[\d\s().-]{7,}\d)/.test(normalized) ||
    /(?:1[3-9]\d[ -]?\d{4}[ -]?\d{4})/.test(normalized);

  const sectionHeadings = COMMON_SECTION_HEADINGS.filter((heading) => {
    const escaped = heading.replace(/[.*+?^$()|[\]\\{}]/g, '\\$&');
    return new RegExp(
      '(?:^|\\n)\\s*(?:[#>*-]+\\s*)?' +
        escaped +
        '\\s*(?::|：)?\\s*(?:$|\\n)',
      'im',
    ).test(lower);
  });

  const replacementCount = (normalized.match(/�/g) ?? []).length;
  const replacementCharacterRatio =
    extractedCharacters > 0 ? replacementCount / extractedCharacters : 1;

  let score = 0;
  if (extractedCharacters >= 350) score += 40;
  else if (extractedCharacters >= 120) score += 26;
  else if (extractedCharacters >= 40) score += 12;

  if (emailFound) score += 12;
  if (phoneFound) score += 10;

  if (sectionHeadings.length >= 4) score += 20;
  else if (sectionHeadings.length >= 2) score += 14;
  else if (sectionHeadings.length === 1) score += 6;

  if (replacementCharacterRatio < 0.002) score += 10;
  else if (replacementCharacterRatio < 0.01) score += 5;

  const averageCharactersPerPage =
    pageCount > 0 ? extractedCharacters / pageCount : extractedCharacters;
  if (averageCharactersPerPage >= 250) score += 8;
  else if (averageCharactersPerPage >= 100) score += 4;

  score = Math.max(0, Math.min(100, score));

  const signals: string[] = [];
  if (extractedCharacters < 80) signals.push('very-little-text');
  if (!emailFound) signals.push('email-not-detected');
  if (!phoneFound) signals.push('phone-not-detected');
  if (sectionHeadings.length < 2) signals.push('few-section-headings');
  if (replacementCharacterRatio >= 0.01) {
    signals.push('encoding-noise');
  }
  if (pageCount > 6) signals.push('long-document');

  const level: PdfParseabilityLevel =
    score >= 78 ? 'good' : score >= 48 ? 'review' : 'poor';

  return {
    score,
    level,
    emailFound,
    phoneFound,
    sectionHeadings,
    replacementCharacterRatio,
    extractedCharacters,
    extractedLines: lines.length,
    signals,
  };
}

function assertPdfFile(file: File) {
  if (file.size > MAX_PDF_FILE_SIZE) {
    throw new PdfImportError(
      'too-large',
      'PDF exceeds the local import size limit.',
    );
  }
}

export async function extractResumeTextFromPdf(
  file: File,
): Promise<PdfExtractionResult> {
  assertPdfFile(file);

  const prefix = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const signature = String.fromCharCode(...prefix);
  if (signature !== '%PDF-') {
    throw new PdfImportError(
      'invalid-pdf',
      'The selected file is not a valid PDF.',
    );
  }

  try {
    const [pdfjsLib, workerModule] = await Promise.all([
      import('pdfjs-dist'),
      import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
    ]);

    pdfjsLib.GlobalWorkerOptions.workerSrc = workerModule.default;

    const bytes = new Uint8Array(await file.arrayBuffer());
    const loadingTask = pdfjsLib.getDocument({ data: bytes });
    const pdf = await loadingTask.promise;

    try {
      const parsedPageCount = Math.min(pdf.numPages, MAX_PDF_PAGES);
      const pages: string[] = [];

      for (
        let pageNumber = 1;
        pageNumber <= parsedPageCount;
        pageNumber += 1
      ) {
        const page = await pdf.getPage(pageNumber);
        const pageContent = await page.getTextContent();
        const items: PdfTextItemLike[] = [];

        for (const rawItem of pageContent.items) {
          if (
            typeof rawItem === 'object' &&
            rawItem !== null &&
            'str' in rawItem &&
            typeof rawItem.str === 'string'
          ) {
            items.push({
              str: rawItem.str,
              transform:
                'transform' in rawItem ? rawItem.transform : undefined,
              width: 'width' in rawItem ? rawItem.width : undefined,
              height: 'height' in rawItem ? rawItem.height : undefined,
              hasEOL: 'hasEOL' in rawItem ? rawItem.hasEOL : undefined,
            });
          }
        }

        const pageText = textItemsToLines(items).join('\n');
        if (pageText.trim()) pages.push(pageText);
      }

      const text = pages.join('\n\n').trim();
      if (!text || text.replace(/\s/g, '').length < 12) {
        throw new PdfImportError(
          'no-text',
          'No usable text layer was found in this PDF.',
        );
      }

      const warnings: string[] = [];
      if (pdf.numPages > MAX_PDF_PAGES) {
        warnings.push('page-limit');
      }

      return {
        text,
        pageCount: pdf.numPages,
        parsedPageCount,
        parseability: analyzePdfParseability(text, pdf.numPages),
        warnings,
      };
    } finally {
      await loadingTask.destroy();
    }
  } catch (error) {
    if (error instanceof PdfImportError) throw error;

    const name =
      typeof error === 'object' && error !== null && 'name' in error
        ? String(error.name)
        : '';

    if (name === 'PasswordException') {
      throw new PdfImportError(
        'encrypted',
        'Password-protected PDFs cannot be imported yet.',
      );
    }

    console.warn('[pdf-import] PDF extraction failed:', error);
    throw new PdfImportError(
      'parse-failed',
      'The PDF could not be parsed in this browser.',
    );
  }
}
