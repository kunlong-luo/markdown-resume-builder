import { ResumeSettings } from '../types';

export const THEME_MAP = {
  blue: {
    accentText: 'text-blue-600 hover:text-blue-800',
    h2Accent: 'before:bg-blue-600',
    liAccent: 'before:bg-blue-500/50',
    blockquoteAccent: 'border-l-blue-600/20 bg-blue-50/50',
    badgeBg: 'bg-blue-50/60 border-blue-100/50 text-blue-700',
    iconColor: 'text-blue-500',
    topAccentColor: 'bg-blue-600',
    h2BadgeBg: 'bg-blue-50/40',
    h2BadgeBorder: 'border-l-[3.5px] border-blue-600',
    h2BadgeText: 'text-blue-850',
  },
  emerald: {
    accentText: 'text-emerald-600 hover:text-emerald-800',
    h2Accent: 'before:bg-emerald-600',
    liAccent: 'before:bg-emerald-500/50',
    blockquoteAccent: 'border-l-emerald-600/20 bg-emerald-50/50',
    badgeBg: 'bg-emerald-50/60 border-emerald-100/50 text-emerald-700',
    iconColor: 'text-emerald-500',
    topAccentColor: 'bg-emerald-600',
    h2BadgeBg: 'bg-emerald-50/40',
    h2BadgeBorder: 'border-l-[3.5px] border-emerald-600',
    h2BadgeText: 'text-emerald-850',
  },
  slate: {
    accentText: 'text-slate-700 hover:text-slate-900',
    h2Accent: 'before:bg-slate-700',
    liAccent: 'before:bg-slate-500/50',
    blockquoteAccent: 'border-l-slate-700/20 bg-slate-50/50',
    badgeBg: 'bg-slate-50 border-slate-200/50 text-slate-700',
    iconColor: 'text-slate-600',
    topAccentColor: 'bg-slate-700',
    h2BadgeBg: 'bg-slate-50/80',
    h2BadgeBorder: 'border-l-[3.5px] border-slate-700',
    h2BadgeText: 'text-slate-850',
  },
  indigo: {
    accentText: 'text-indigo-600 hover:text-indigo-800',
    h2Accent: 'before:bg-indigo-600',
    liAccent: 'before:bg-indigo-500/50',
    blockquoteAccent: 'border-l-indigo-600/20 bg-indigo-50/50',
    badgeBg: 'bg-indigo-50/60 border-indigo-100/50 text-indigo-700',
    iconColor: 'text-indigo-500',
    topAccentColor: 'bg-indigo-600',
    h2BadgeBg: 'bg-indigo-50/40',
    h2BadgeBorder: 'border-l-[3.5px] border-indigo-600',
    h2BadgeText: 'text-indigo-850',
  },
  crimson: {
    accentText: 'text-rose-600 hover:text-rose-800',
    h2Accent: 'before:bg-rose-600',
    liAccent: 'before:bg-rose-500/50',
    blockquoteAccent: 'border-l-rose-600/20 bg-rose-50/50',
    badgeBg: 'bg-rose-50/60 border-rose-100/50 text-rose-700',
    iconColor: 'text-rose-500',
    topAccentColor: 'bg-rose-600',
    h2BadgeBg: 'bg-rose-50/40',
    h2BadgeBorder: 'border-l-[3.5px] border-rose-600',
    h2BadgeText: 'text-rose-850',
  },
  amber: {
    accentText: 'text-amber-700 hover:text-amber-900',
    h2Accent: 'before:bg-amber-700',
    liAccent: 'before:bg-amber-500/50',
    blockquoteAccent: 'border-l-amber-700/20 bg-amber-50/50',
    badgeBg: 'bg-amber-50/60 border-amber-200/50 text-amber-800',
    iconColor: 'text-amber-600',
    topAccentColor: 'bg-amber-600',
    h2BadgeBg: 'bg-amber-50/40',
    h2BadgeBorder: 'border-l-[3.5px] border-amber-600',
    h2BadgeText: 'text-amber-900',
  },
  teal: {
    accentText: 'text-teal-600 hover:text-teal-800',
    h2Accent: 'before:bg-teal-600',
    liAccent: 'before:bg-teal-500/50',
    blockquoteAccent: 'border-l-teal-600/20 bg-teal-50/50',
    badgeBg: 'bg-teal-50/60 border-teal-100/50 text-teal-700',
    iconColor: 'text-teal-500',
    topAccentColor: 'bg-teal-600',
    h2BadgeBg: 'bg-teal-50/40',
    h2BadgeBorder: 'border-l-[3.5px] border-teal-600',
    h2BadgeText: 'text-teal-900',
  },
  bronze: {
    accentText: 'text-[rgb(141,96,55)] hover:text-[rgb(115,75,40)]',
    h2Accent: 'before:bg-[rgb(141,96,55)]',
    liAccent: 'before:bg-[rgb(141,96,55)]/50',
    blockquoteAccent: 'border-l-[rgb(141,96,55)]/20 bg-[rgb(253,249,245)]',
    badgeBg: 'bg-[rgb(253,249,245)] border-[rgb(243,230,215)] text-[rgb(141,96,55)]',
    iconColor: 'text-[rgb(141,96,55)]',
    topAccentColor: 'bg-[rgb(141,96,55)]',
    h2BadgeBg: 'bg-[rgb(253,249,245)]',
    h2BadgeBorder: 'border-l-[3.5px] border-[rgb(141,96,55)]',
    h2BadgeText: 'text-[rgb(115,75,40)]',
  },
  custom: {
    accentText: 'custom-accent-text',
    h2Accent: 'custom-h2-accent',
    liAccent: 'custom-li-accent',
    blockquoteAccent: 'custom-blockquote-accent',
    badgeBg: 'custom-badge-bg',
    iconColor: 'custom-icon-color',
    topAccentColor: 'custom-top-accent',
    h2BadgeBg: 'custom-h2-badge-bg',
    h2BadgeBorder: 'custom-h2-badge-border',
    h2BadgeText: 'custom-h2-badge-text',
  },
};

export const FONT_FAMILY_CLASSES = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono text-[12px]',
};

// Helper parser to intelligently layout the resume header
export function parseResumeHeader(markdown: string) {
  const lines = markdown.split('\n');
  let name = '';
  let titles: string[] = [];
  let contacts: string[] = [];
  let experience = '';
  let h1Index = -1;
  let foundH1 = false;

  // Locate the name (H1)
  for (let i = 0; i < Math.min(lines.length, 12); i++) {
    const line = lines[i].trim();
    if (line.startsWith('# ')) {
      name = line.substring(2).trim();
      foundH1 = true;
      h1Index = i;
      break;
    }
  }

  if (foundH1) {
    let bodyStartIndex = h1Index + 1;
    // Inspect next non-empty lines for profile information
    for (let i = h1Index + 1; i < Math.min(lines.length, h1Index + 8); i++) {
      const line = lines[i].trim();
      if (line.startsWith('##')) {
        bodyStartIndex = i;
        break;
      }
      if (line === '') {
        continue;
      }

      // Check content types
      const hasSeparators = line.includes('｜') || line.includes('|') || line.includes('·') || line.includes('•') || line.includes('●') || line.includes('▪') || line.includes('■') || line.includes('◆') || line.includes('・');
      const isContact = line.includes('@') || /^\d{11}/.test(line) || /\d{3,4}-\d{7,8}/.test(line) || line.toLowerCase().includes('github') || line.toLowerCase().includes('gitee') || line.toLowerCase().includes('wechat') || line.includes('微信') || line.toLowerCase().includes('linkedin') || line.includes('领英');

      if (isContact || hasSeparators) {
        if (isContact) {
          // Comprehensive contact splitter regex supporting all dots, pipes, slashes, double spaces, and standard punctuation delimiters
          const contactSeparatorRegex = /[·•●▪■◆・|｜,，;；\t]|\s{2,}|\s+\/\s+|\s+-\s+|\s+—\s+/;
          contacts = line.split(contactSeparatorRegex).map(c => c.trim()).filter(Boolean);
        } else if (line.includes('｜') || line.includes('|') || line.includes('·') || line.includes('•') || line.includes('●') || line.includes('▪') || line.includes('■') || line.includes('◆') || line.includes('・')) {
          // Split title line using separators
          titles = line.split(/[｜|·•●▪■◆・]|\s{2,}/).map(t => t.trim()).filter(Boolean);
        }
        bodyStartIndex = i + 1;
      } else if (line.includes('经验') || line.includes('工作') || /^\d+年/.test(line)) {
        experience = line;
        bodyStartIndex = i + 1;
      } else {
        // If titles list is empty, treat as title list, otherwise keep in body
        if (titles.length === 0) {
          titles = [line];
          bodyStartIndex = i + 1;
        } else {
          break;
        }
      }
    }

    const bodyMarkdown = lines.slice(bodyStartIndex).join('\n');
    return {
      hasHeader: true,
      name,
      titles,
      contacts,
      experience,
      bodyMarkdown,
    };
  }

  return {
    hasHeader: false,
    name: '',
    titles: [],
    contacts: [],
    experience: '',
    bodyMarkdown: markdown,
  };
}

export function cleanMarkdown(markdown: string): string {
  if (!markdown) return '';
  let processed = markdown;
  // Fix bold with space after opening asterisks, e.g., "** 10+**" -> "**10+**" (limited to single line)
  processed = processed.replace(/\*\*\s+([^\*\n]+?)\s*\*\*/g, '**$1**');
  // Fix bold with space before closing asterisks, e.g., "**10+ **" -> "**10+**" (limited to single line)
  processed = processed.replace(/\*\*\s*([^\*\n]+?)\s+\*\*/g, '**$1**');
  // Fix italic with space after/before asterisks, e.g., "* text*" -> "*text*" or "*text *" -> "*text*" (limited to single line)
  processed = processed.replace(/(?<!\*)\*\s+([^\*\n]+?)\s*\*(?!\*)/g, '*$1*');
  processed = processed.replace(/(?<!\*)\*\s*([^\*\n]+?)\s+\*(?!\*)/g, '*$1*');

  // Ensure bold (**...**) has surrounding spaces if adjacent to non-whitespace characters (essential for CJK/Chinese text parsing, limited to single line)
  processed = processed.replace(/(?<!\*)\*\*([^\*\n]+?)\*\*(?!\*)/g, (match, content, offset, string) => {
    const charBefore = offset > 0 ? string[offset - 1] : '';
    const matchEndIndex = offset + match.length;
    const charAfter = matchEndIndex < string.length ? string[matchEndIndex] : '';

    const needSpaceBefore = charBefore && !/\s/.test(charBefore);
    const needSpaceAfter = charAfter && !/\s/.test(charAfter);

    return `${needSpaceBefore ? ' ' : ''}**${content}**${needSpaceAfter ? ' ' : ''}`;
  });

  // Ensure italic (*...*) has surrounding spaces if adjacent to non-whitespace characters (limited to single line)
  processed = processed.replace(/(?<!\*)\*([^\*\n]+?)\*(?!\*)/g, (match, content, offset, string) => {
    const charBefore = offset > 0 ? string[offset - 1] : '';
    const matchEndIndex = offset + match.length;
    const charAfter = matchEndIndex < string.length ? string[matchEndIndex] : '';

    const needSpaceBefore = charBefore && !/\s/.test(charBefore);
    const needSpaceAfter = charAfter && !/\s/.test(charAfter);

    return `${needSpaceBefore ? ' ' : ''}*${content}*${needSpaceAfter ? ' ' : ''}`;
  });

  // Detect and split lines that contain bullet points or list markers in the middle of a single line
  // e.g., "Title - Bullet content" -> "Title\n- Bullet content"
  // Preceded by space, Chinese character, or asterisks. Followed by a Chinese character or a word/letter (excluding numeric date ranges).
  // Note: We only split on dash-like markers (-, –, —, －) here to prevent breaking inline lists separated by dots (·, •, ●, etc.) or contact details.
  processed = processed.replace(/(?<!\n|^)(?<=\s|[\u4e00-\u9fa5]|\*\*\*|\*\*|\*)\s*[-–—－]\s*(?=[\u4e00-\u9fa5]|[a-zA-Z]{2,})/g, '\n- ');

  // Ensure list items immediately following normal text lines are separated by a blank line 
  // to prevent them from merging into a single line in Markdown rendering.
  // Also normalize any non-standard bullet characters (like •, ⁃, －, etc.) or missing spaces after bullets.
  const lines = processed.split('\n');
  const adjustedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    let isList = false;
    let normalizedLine = line;
    
    // 1. Check for standard markdown list markers
    const standardUnorderedMatch = trimmed.match(/^([-\*\+])\s+(.*)/);
    const standardOrderedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    
    if (standardUnorderedMatch) {
      if (!trimmed.startsWith('---') && !trimmed.startsWith('***') && !trimmed.startsWith('___')) {
        isList = true;
      }
    } else if (standardOrderedMatch) {
      isList = true;
    } else {
      // 2. Check for non-standard bullets or missing space after standard ones
      const anyBulletMatch = trimmed.match(/^([•⁃－—–·●▪■◆\-\*\+])\s*(.*)/);
      if (anyBulletMatch) {
        const bullet = anyBulletMatch[1];
        const content = anyBulletMatch[2];
        
        const isNegativeNumber = bullet === '-' && /^\d/.test(content);
        const isHr = (bullet === '-' || bullet === '*') && trimmed.replace(new RegExp('\\' + bullet, 'g'), '').trim() === '';
        const isBoldOrItalic = (bullet === '*' && (content.startsWith('*') || !content.includes('*')));
        
        if (!isNegativeNumber && !isHr && !isBoldOrItalic && content.trim() !== '') {
          isList = true;
          const leadingSpaces = line.match(/^(\s*)/)?.[1] || '';
          normalizedLine = `${leadingSpaces}- ${content}`;
        }
      }
    }
    
    // If it is a list item, check if we need to insert a blank line before it
    if (isList && i > 0) {
      const prevLine = adjustedLines[adjustedLines.length - 1];
      const prevTrimmed = prevLine ? prevLine.trim() : '';
      
      if (prevTrimmed !== '') {
        const isPrevList = /^(?:[-\*\+]\s|\d+\.\s)/.test(prevTrimmed);
        const isPrevHeading = prevTrimmed.startsWith('#');
        const isPrevBlockquote = prevTrimmed.startsWith('>');
        const isPrevHr = /^(?:-{3,}|\*{3,}|\_{3,})$/.test(prevTrimmed);
        
        if (!isPrevList && !isPrevHeading && !isPrevBlockquote && !isPrevHr) {
          adjustedLines.push('');
        }
      }
    }
    
    adjustedLines.push(normalizedLine);
  }
  processed = adjustedLines.join('\n');

  return processed;
}

export const getH2ClassName = (
  fontSize: 'compact' | 'standard' | 'relaxed',
  theme: any,
  style: 'accent-line' | 'modern-badge' | 'minimal-clean'
) => {
  const sizeMap = {
    compact: {
      text: 'text-[12px] tracking-widest mt-4 mb-2.5 pb-1',
      bottomLine: 'before:w-8 before:h-[1.5px]',
      badgePadding: 'px-2 py-0.5 rounded'
    },
    standard: {
      text: 'text-[13.5px] tracking-widest mt-6 mb-3 pb-1.5',
      bottomLine: 'before:w-10 before:h-[2px]',
      badgePadding: 'px-2.5 py-1 rounded'
    },
    relaxed: {
      text: 'text-[15px] tracking-widest mt-8 mb-4 pb-2',
      bottomLine: 'before:w-12 before:h-[2px]',
      badgePadding: 'px-3 py-1.5 rounded'
    }
  }[fontSize];

  const base = `font-bold text-gray-950 uppercase break-after-avoid ${sizeMap.text}`;

  if (style === 'accent-line') {
    return `${base} border-b border-gray-200 relative before:content-[''] before:absolute before:left-0 before:bottom-[-1px] ${sizeMap.bottomLine} ${theme.h2Accent}`;
  } else if (style === 'modern-badge') {
    return `${base} ${theme.h2BadgeBg} ${theme.h2BadgeBorder} ${theme.h2BadgeText} ${sizeMap.badgePadding} block w-full`;
  } else {
    // minimal-clean
    return `${base} border-b border-gray-200`;
  }
};

export function parseH2Sections(md: string) {
  const lines = md.split('\n');
  const sectionsList: { title: string; rawTitleLine: string; content: string }[] = [];
  
  let currentTitle = '';
  let currentRawLine = '';
  let currentLinesList: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
      if (currentRawLine || currentLinesList.length > 0) {
        sectionsList.push({
          title: currentTitle,
          rawTitleLine: currentRawLine,
          content: currentLinesList.join('\n')
        });
      }
      currentRawLine = line;
      currentTitle = trimmed.replace(/^##\s+/, '');
      currentLinesList = [];
    } else {
      currentLinesList.push(line);
    }
  }

  if (currentRawLine || currentLinesList.length > 0) {
    sectionsList.push({
      title: currentTitle,
      rawTitleLine: currentRawLine,
      content: currentLinesList.join('\n')
    });
  }
  return sectionsList;
}

export function smartAutoFit(settings: ResumeSettings, onChangeSettings: (key: keyof ResumeSettings, value: any) => void) {
  let adjusted = false;

  if (settings.margin === 'relaxed') {
    onChangeSettings('margin', 'standard');
    adjusted = true;
  } else if (settings.margin === 'standard') {
    onChangeSettings('margin', 'compact');
    adjusted = true;
  } else if (settings.blockGap > 0.8) {
    onChangeSettings('blockGap', Math.max(0.6, Number((settings.blockGap - 0.15).toFixed(2))));
    adjusted = true;
  } else if (settings.lineHeight > 1.45) {
    onChangeSettings('lineHeight', Math.max(1.35, Number((settings.lineHeight - 0.1).toFixed(2))));
    adjusted = true;
  } else if (settings.fontSize === 'relaxed') {
    onChangeSettings('fontSize', 'standard');
    adjusted = true;
  } else if (settings.fontSize === 'standard') {
    onChangeSettings('fontSize', 'compact');
    adjusted = true;
  } else if (settings.blockGap > 0.4) {
    onChangeSettings('blockGap', Math.max(0.3, Number((settings.blockGap - 0.1).toFixed(2))));
    adjusted = true;
  } else if (settings.lineHeight > 1.25) {
    onChangeSettings('lineHeight', Math.max(1.2, Number((settings.lineHeight - 0.05).toFixed(2))));
    adjusted = true;
  }

  if (!adjusted) {
    onChangeSettings('margin', 'compact');
    onChangeSettings('blockGap', 0.4);
    onChangeSettings('lineHeight', 1.3);
    onChangeSettings('fontSize', 'compact');
  }
}

export function getSizeClasses(fontSize: string, theme: any) {
  const map = {
    compact: {
      h1: 'text-2xl font-black text-gray-955 tracking-tight mb-2',
      h3: 'text-[12px] font-bold text-gray-950 mt-3 mb-1 break-after-avoid',
      p: 'text-[11.5px] text-gray-750 leading-[1.5] mb-1.5 text-justify break-inside-avoid',
      ul: 'list-none p-0 m-0 mb-2 space-y-0.5',
      ol: 'list-decimal list-outside ml-4 mb-2 text-[11.5px] text-gray-750',
      li: `text-[11.5px] text-gray-755 leading-[1.5] text-justify relative pl-3 before:content-[''] before:absolute before:left-0 before:top-[6px] before:w-1 before:h-1 ${theme.liAccent} before:rounded-full break-inside-avoid`,
      th: 'text-[11.5px] border-b-2 border-gray-100 py-1 pr-4 font-semibold text-gray-950 whitespace-nowrap',
      td: 'text-[11.5px] py-1.5 pr-4 text-gray-755 leading-[1.5]',
      table: 'w-full mb-2 break-inside-avoid',
      hr: 'my-4 border-gray-100',
    },
    standard: {
      h1: 'text-3xl font-black text-gray-955 tracking-tight mb-3',
      h3: 'text-[13px] font-bold text-gray-955 mt-4.5 mb-1 break-after-avoid',
      p: 'text-[12.5px] text-gray-750 leading-[1.65] mb-2 text-justify break-inside-avoid',
      ul: 'list-none p-0 m-0 mb-3 space-y-1',
      ol: 'list-decimal list-outside ml-4 mb-3 text-[12.5px] text-gray-755',
      li: `text-[12.5px] text-gray-755 leading-[1.65] text-justify relative pl-3.5 before:content-[''] before:absolute before:left-0 before:top-[7.5px] before:w-1 before:h-1 ${theme.liAccent} before:rounded-full break-inside-avoid`,
      th: 'text-[12.5px] border-b-2 border-gray-200 py-1.5 pr-4 font-semibold text-gray-955 whitespace-nowrap',
      td: 'text-[12.5px] py-2 pr-4 text-gray-755 leading-[1.65]',
      table: 'w-full mb-3 break-inside-avoid',
      hr: 'my-5 border-gray-100',
    },
    relaxed: {
      h1: 'text-4xl font-black text-gray-955 tracking-tight mb-4',
      h3: 'text-[14px] font-bold text-gray-955 mt-5.5 mb-1.5 break-after-avoid',
      p: 'text-[13.5px] text-gray-755 leading-[1.8] mb-3 text-justify break-inside-avoid',
      ul: 'list-none p-0 m-0 mb-4 space-y-1.5',
      ol: 'list-decimal list-outside ml-4 mb-4 text-[13.5px] text-gray-755',
      li: `text-[13.5px] text-gray-755 leading-[1.8] text-justify relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1 before:h-1 ${theme.liAccent} before:rounded-full break-inside-avoid`,
      th: 'text-[13.5px] border-b-2 border-gray-200 py-2 pr-4 font-semibold text-gray-955 whitespace-nowrap',
      td: 'text-[13.5px] py-2.5 pr-4 text-gray-755 leading-[1.8]',
      table: 'w-full mb-4 break-inside-avoid',
      hr: 'my-6 border-gray-100',
    }
  };
  return (map as any)[fontSize];
}
