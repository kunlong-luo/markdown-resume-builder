export function formatChineseEnglishSpacing(text: string): string {
  // Protect markdown code blocks, inline code, HTML comments/tags, and URLs in parentheses
  const parts = text.split(/(```[\s\S]*?```|`[^`\n]*`|<[^>]+>|\((?:https?|ftp):\/\/[^\s)]+|\((?:https?:\/\/[^\s)]+|[.\/\w_#-]+[^\s)]*)\))/g);
  
  const formattedParts = parts.map((part, index) => {
    if (index % 2 === 1) {
      // Protected part - return as is
      return part;
    }
    let s = part;
    // CJK characters followed by Alphanumeric
    s = s.replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, '$1 $2');
    // Alphanumeric followed by CJK characters
    s = s.replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, '$1 $2');
    return s;
  });
  
  return formattedParts.join('');
}
