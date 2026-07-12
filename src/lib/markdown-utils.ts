export interface MarkdownSection {
  title: string;
  content: string;
}

/**
 * Splits a markdown string into a header (everything before the first ##)
 * and an array of sections (each starting with ##).
 */
export function splitMarkdownIntoSections(markdown: string): { header: string; sections: MarkdownSection[] } {
  const lines = markdown.split('\n');
  let headerLines: string[] = [];
  const sections: MarkdownSection[] = [];
  let currentSection: MarkdownSection | null = null;
  let foundFirstH2 = false;

  for (const line of lines) {
    if (line.trim().startsWith('## ')) {
      foundFirstH2 = true;
      if (currentSection) {
        sections.push({
          title: currentSection.title,
          content: currentSection.content.trim()
        });
      }
      currentSection = {
        title: line.replace('## ', '').trim(),
        content: line + '\n'
      };
    } else {
      if (!foundFirstH2) {
        headerLines.push(line);
      } else if (currentSection) {
        currentSection.content += line + '\n';
      }
    }
  }

  if (currentSection) {
    sections.push({
      title: currentSection.title,
      content: currentSection.content.trim()
    });
  }

  return {
    header: headerLines.join('\n').trim(),
    sections
  };
}

/**
 * Reconstructs the full markdown string from the header and ordered sections.
 */
export function joinSectionsIntoMarkdown(header: string, sections: MarkdownSection[]): string {
  let md = header.trim();
  if (md) {
    md += '\n\n';
  }
  
  sections.forEach((s) => {
    md += s.content + '\n\n';
  });
  
  return md.trim() + '\n';
}
