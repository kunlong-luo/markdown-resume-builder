/**
 * Apply deterministic, non-destructive migrations to persisted Markdown.
 *
 * Migrations must never infer that user content is disposable from names,
 * companies, languages, or other resume text. Only structural rewrites that
 * preserve the user's content belong here.
 */
export function migrateStoredMarkdown(markdown: string): string {
  let md = markdown;

  // Normalize redundant "GitHub:" labels before GitHub URLs.
  md = md.replace(/GitHub[：:]\s*(https?:\/\/|github\.com\/)/gi, (_match, prefix: string) => {
    return prefix.startsWith('http') ? prefix : `https://${prefix}`;
  });

  // Rename the legacy education heading to the current convention.
  md = md.replace(/## 教育经历/g, '## 教育背景');

  // De-duplicate repeated education sections without touching unrelated content.
  const sections = md.split('\n## ');
  const seenEducationTitles = new Set<string>();
  const cleanSections: string[] = [];

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    if (i === 0) {
      cleanSections.push(section);
      continue;
    }

    const title = section.split('\n')[0].trim();
    const normalizedTitle = title.toLowerCase();
    const isEducationSection =
      title.includes('教育') ||
      title.includes('学校') ||
      normalizedTitle.includes('education');

    if (isEducationSection) {
      if (seenEducationTitles.has(normalizedTitle)) {
        continue;
      }
      seenEducationTitles.add(normalizedTitle);
    }

    cleanSections.push(`## ${section}`);
  }

  return cleanSections.join('\n').replace(/\n{3,}/g, '\n\n');
}
