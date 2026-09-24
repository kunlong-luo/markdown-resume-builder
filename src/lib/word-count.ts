export const getWordCount = (text: string): number => {
  if (!text || !text.trim()) return 0;

  // 1. Clean markdown tokens, headings, bullets, links
  let clean = text
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*|__|\*|_|`|>|---|\*\*\*/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*+•]\s+/gm, '');

  // 2. Count CJK characters (1 Chinese character = 1 word)
  const cjkMatches = clean.match(/[\u4e00-\u9fa5\u3040-\u30ff\u3400-\u4dbf]/g) || [];

  // 3. Match English words & Number tokens (e.g., "2026", "50%", "React", "Node.js")
  // Exclude all punctuation marks (ASCII & CJK punctuation)
  const nonCjkText = clean.replace(/[\u4e00-\u9fa5\u3040-\u30ff\u3400-\u4dbf]/g, ' ');
  const wordOrNumberMatches = nonCjkText.match(/[a-zA-Z0-9]+(?:['’.-][a-zA-Z0-9]+)*%?/g) || [];

  return cjkMatches.length + wordOrNumberMatches.length;
};
