export const getWordCount = (text: string) => {
  if (!text) return 0;
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
  const englishText = text.replace(/[\u4e00-\u9fa5]/g, ' ');
  const englishWords = englishText.trim().split(/\s+/).filter(Boolean);
  return chineseChars.length + englishWords.length;
};
