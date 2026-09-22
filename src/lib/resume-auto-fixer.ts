import { formatChineseEnglishSpacing } from './format-utils';

export interface AutoCleanResult {
  cleanedMarkdown: string;
  hasChanges: boolean;
  fixesCount: number;
  details: {
    missingSpacesFixed: number;
    consecutiveBlankLinesFixed: number;
    trailingSpacesFixed: number;
    asteriskSpacingFixed: number;
  };
}

/**
 * Automatically inspects and formats markdown resume content:
 * 1. Chinese-English and Number half-width spacing (e.g. "React开发" -> "React 开发")
 * 2. Compresses excessive blank lines (reduces 3+ consecutive line breaks to standard 2)
 * 3. Trims invisible trailing whitespace on each line
 * 4. Fixes common list punctuation and bullet spaces (e.g. "-text" -> "- text")
 */
export function autoFormatAndCleanResume(markdown: string): AutoCleanResult {
  let text = markdown;
  let missingSpacesFixed = 0;
  let consecutiveBlankLinesFixed = 0;
  let trailingSpacesFixed = 0;
  let asteriskSpacingFixed = 0;

  // 1. Chinese-English Spacing
  const spaced = formatChineseEnglishSpacing(text);
  if (spaced !== text) {
    missingSpacesFixed = Math.max(1, spaced.length - text.length);
    text = spaced;
  }

  // 2. Fix bullet formatting like "-text" -> "- text" (excluding "---" or "--")
  const bulletNormalized = text.replace(/^(\s*[-*+])([^\s\-*+])/gm, (match, p1, p2) => {
    asteriskSpacingFixed++;
    return `${p1} ${p2}`;
  });
  text = bulletNormalized;

  // 3. Compress redundant blank lines (>=3 down to 2)
  const lineCompressed = text.replace(/\n{3,}/g, () => {
    consecutiveBlankLinesFixed++;
    return '\n\n';
  });
  text = lineCompressed;

  // 4. Remove trailing spaces on lines
  const linesTrimmed = text.split('\n').map(line => {
    const trimmed = line.trimEnd();
    if (trimmed.length < line.length) {
      trailingSpacesFixed++;
    }
    return trimmed;
  }).join('\n');
  text = linesTrimmed;

  const fixesCount = missingSpacesFixed + consecutiveBlankLinesFixed + trailingSpacesFixed + asteriskSpacingFixed;

  return {
    cleanedMarkdown: text,
    hasChanges: text !== markdown,
    fixesCount,
    details: {
      missingSpacesFixed,
      consecutiveBlankLinesFixed,
      trailingSpacesFixed,
      asteriskSpacingFixed
    }
  };
}
