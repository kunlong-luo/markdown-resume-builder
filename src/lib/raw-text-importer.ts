/**
 * Utility to parse unformatted / raw text copied from job boards or plain text documents
 * into clean, structured Markdown resume format.
 */

export function parseRawTextToResumeMarkdown(rawText: string): string {
  if (!rawText || rawText.trim() === '') return '';

  const lines = rawText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) return '';

  let name = '';
  let phone = '';
  let email = '';
  let role = '';
  let github = '';

  const phoneRegex = /(?:\+?86)?\s*(1[3-9]\d{9})/;
  const emailRegex = /([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/;
  const githubRegex = /(?:github\.com\/([a-zA-Z0-9_-]+)|git@github\.com:([a-zA-Z0-9_-]+))/i;

  const remainingLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect phone
    if (!phone && phoneRegex.test(line)) {
      const match = line.match(phoneRegex);
      if (match) phone = match[1];
    }

    // Detect email
    if (!email && emailRegex.test(line)) {
      const match = line.match(emailRegex);
      if (match) email = match[1];
    }

    // Detect github
    if (!github && githubRegex.test(line)) {
      const match = line.match(githubRegex);
      if (match) github = `https://github.com/${match[1] || match[2]}`;
    }

    // Name detection: first short line that doesn't contain phone/email/numbers
    if (!name && i < 4 && line.length >= 2 && line.length <= 15 && !/\d/.test(line) && !line.includes('@')) {
      name = line;
      continue;
    }

    // Candidate for target role if line has role keywords
    if (!role && i < 6 && (line.includes('工程师') || line.includes('开发') || line.includes('主管') || line.includes('经理') || line.includes('专家') || line.includes('Developer') || line.includes('Engineer') || line.includes('Designer'))) {
      role = line;
      continue;
    }

    remainingLines.push(line);
  }

  name = name || '求职者姓名';

  // Build header contacts
  const contacts: string[] = [];
  if (phone) contacts.push(phone);
  if (email) contacts.push(email);
  if (github) contacts.push(`[GitHub](${github})`);

  let markdown = `# ${name}\n`;
  if (role) {
    markdown += `> **${role}**\n`;
  }
  if (contacts.length > 0) {
    markdown += `${contacts.join(' | ')}\n\n`;
  } else {
    markdown += `138-0000-0000 | your_email@example.com | 城市\n\n`;
  }

  // Section classifiers
  const isEduHeader = (s: string) => /^(教育背景|教育经历|学术背景|学习经历|学历背景|Education)/i.test(s);
  const isWorkHeader = (s: string) => /^(工作经历|工作经验|职业经历|从业经历|实习经历|Work Experience)/i.test(s);
  const isProjectHeader = (s: string) => /^(项目经历|项目经验|代表项目|开源项目|主要项目|Projects|Project Experience)/i.test(s);
  const isSkillHeader = (s: string) => /^(专业技能|技术栈|核心技能|技能特长|技能清单|Skills|Technical Skills)/i.test(s);
  const isAdvantageHeader = (s: string) => /^(个人优势|核心优势|自我评价|个人总结|Summary|About Me)/i.test(s);

  let currentSection = '';
  const sections: { title: string; lines: string[] }[] = [];
  let currentLines: string[] = [];

  for (const line of remainingLines) {
    let matchedTitle = '';
    if (isEduHeader(line)) matchedTitle = '教育背景';
    else if (isWorkHeader(line)) matchedTitle = '工作经历';
    else if (isProjectHeader(line)) matchedTitle = '项目经历';
    else if (isSkillHeader(line)) matchedTitle = '专业技能';
    else if (isAdvantageHeader(line)) matchedTitle = '个人优势';

    if (matchedTitle) {
      if (currentSection || currentLines.length > 0) {
        sections.push({ title: currentSection || '个人简介', lines: currentLines });
      }
      currentSection = matchedTitle;
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentSection || currentLines.length > 0) {
    sections.push({ title: currentSection || '经历概述', lines: currentLines });
  }

  // If no sections were identified, format into clean bullet items
  if (sections.length === 0 || (sections.length === 1 && !currentSection)) {
    markdown += `## 个人简介\n`;
    for (const l of remainingLines) {
      markdown += `- ${l.replace(/^[-*•\d.]\s*/, '')}\n`;
    }
    return markdown;
  }

  // Render parsed sections
  for (const sec of sections) {
    markdown += `## ${sec.title}\n\n`;
    let inSubItem = false;

    for (let i = 0; i < sec.lines.length; i++) {
      const line = sec.lines[i];

      // Detect sub-title like "XX公司 | 职位 | 2020-2023"
      const dateMatch = line.match(/(?:19|20)\d{2}[\.\-\/年\s]\d{1,2}/);
      const isHeaderLine = (dateMatch && line.length < 60) || (!line.startsWith('-') && !line.startsWith('•') && line.length < 40 && (line.includes('公司') || line.includes('科技') || line.includes('大学') || line.includes('学院') || line.includes('系统') || line.includes('平台')));

      if (isHeaderLine) {
        markdown += `### ${line.replace(/^###?\s*/, '')}\n`;
        inSubItem = true;
      } else {
        const cleanedBullet = line.replace(/^[•⁃－—–·●▪■◆\-\*\+]\s*/, '').replace(/^\d+[\.\、]\s*/, '');
        if (cleanedBullet.trim()) {
          markdown += `- ${cleanedBullet}\n`;
        }
      }
    }
    markdown += `\n`;
  }

  return markdown.trim() + '\n';
}
