import { FormItem, FormSection, ResumeFormModel } from './form-types';

export function isTimeString(s: string): boolean {
  const clean = s.replace(/[*_]/g, '').trim();
  if (/\b(?:19|20)\d{2}\b/.test(clean) || clean.includes('至今') || clean.includes('present') || clean.includes('Present') || clean.includes('毕业')) {
    return true;
  }
  return false;
}

export function cleanPart(s: string): string {
  let res = s.trim();
  // Strip outer markdown bold and italics
  while (
    (res.startsWith('**') && res.endsWith('**')) ||
    (res.startsWith('*') && res.endsWith('*')) ||
    (res.startsWith('__') && res.endsWith('__')) ||
    (res.startsWith('_') && res.endsWith('_'))
  ) {
    if (res.startsWith('**') && res.endsWith('**')) res = res.slice(2, -2).trim();
    else if (res.startsWith('*') && res.endsWith('*')) res = res.slice(1, -1).trim();
    else if (res.startsWith('__') && res.endsWith('__')) res = res.slice(2, -2).trim();
    else if (res.startsWith('_') && res.endsWith('_')) res = res.slice(1, -1).trim();
  }
  return res;
}

const DEGREE_REGEX = /^(本科|学士|硕士|博士|大专|高职|专科|中专|高中|双学士|研究生|PhD|Ph\.D|Master|Bachelor|Associate)$/i;
const DEGREE_EXTRACT_REGEX = /[（\(](本科|学士|硕士|博士|大专|高职|专科|双学士|研究生|PhD|Master|Bachelor)[）\)]/i;

export function splitItemTitle(titleStr: string): { org: string; role: string; time: string; degree?: string } {
  let clean = titleStr.trim();
  if (clean.startsWith('**') && clean.endsWith('**')) {
    clean = clean.slice(2, -2).trim();
  }
  
  // 1. Check for time range and extract it if explicitly present
  // Matches: 2024.03 — 至今, *2024.03 — 至今*, 2021.06 - 2024.02, 2018 - 2022, 2020.09 ~ 2024.06, etc.
  const TIME_PATTERN = /(?:\*|_)?(?:\b(?:19|20)\d{2}(?:[年\.\-\/]\d{1,2}(?:[月\.\-\/]\d{1,2})?|年?)?\s*(?:[-—–―~～至到\s]+)\s*(?:(?:19|20)\d{2}(?:[年\.\-\/]\d{1,2}(?:[月\.\-\/]\d{1,2})?|年?)?|至今|现在|present|Present|毕业)|(?:\b(?:19|20)\d{2}(?:[年\.\-\/]\d{1,2}(?:月)?)?)\s*(?:至今|现在|present|Present|毕业)|\b(?:19|20)\d{2}\s*[-—–―~～]\s*(?:19|20)\d{2}\b)(?:\*|_)?/i;
  
  let extractedTime = '';
  const timeMatch = clean.match(TIME_PATTERN);
  if (timeMatch && timeMatch.index !== undefined) {
    extractedTime = cleanPart(timeMatch[0]);
    // Remove the time from the string along with nearby delimiters
    clean = (clean.slice(0, timeMatch.index) + ' ' + clean.slice(timeMatch.index + timeMatch[0].length)).trim();
  }

  // 2. Split remainder by universal separators:
  // - Full/half-width pipe: | or ｜
  // - Full-width ideographic space: \u3000
  // - Middle dots / bullets: · or • or ● or ▪
  // - Slashes with spaces: / or ／
  // - Hyphens/dashes with spaces: - or — or – or ―
  // - Multiple spaces: \s{2,}
  const SEPARATOR_REGEX = /\s*[|｜\u3000]\s*|\s*[·•●▪]\s*|\s+[/／]\s+|\s+[-—–―]\s+|\s{2,}/;
  
  const rawParts = clean.split(SEPARATOR_REGEX).map(p => cleanPart(p)).filter(Boolean);

  let org = '';
  let role = '';
  let degree = '';
  let time = extractedTime;

  // If time wasn't found via regex, check if the last segment is a time string
  if (!time && rawParts.length > 1 && isTimeString(rawParts[rawParts.length - 1])) {
    time = rawParts.pop()!;
  }

  // 3. Process remaining segments
  if (rawParts.length === 1) {
    org = rawParts[0];
  } else if (rawParts.length === 2) {
    const p0 = rawParts[0];
    const p1 = rawParts[1];
    if (DEGREE_REGEX.test(p1)) {
      org = p0;
      degree = p1;
    } else if (DEGREE_REGEX.test(p0)) {
      degree = p0;
      role = p1;
    } else {
      org = p0;
      role = p1;
    }
  } else if (rawParts.length === 3) {
    const p0 = rawParts[0];
    const p1 = rawParts[1];
    const p2 = rawParts[2];
    if (DEGREE_REGEX.test(p1)) {
      org = p0;
      degree = p1;
      role = p2;
    } else if (DEGREE_REGEX.test(p2)) {
      org = p0;
      role = p1;
      degree = p2;
    } else {
      org = p0;
      role = `${p1} ｜ ${p2}`;
    }
  } else if (rawParts.length >= 4) {
    org = rawParts[0];
    if (DEGREE_REGEX.test(rawParts[1])) {
      degree = rawParts[1];
      role = rawParts.slice(2).join(' ｜ ');
    } else {
      role = rawParts.slice(1).join(' ｜ ');
    }
  }

  // 4. Secondary check: Extract embedded degree from parentheses (e.g. "计算机科学 (硕士)")
  if (!degree) {
    const roleMatch = role.match(DEGREE_EXTRACT_REGEX);
    if (roleMatch) {
      degree = roleMatch[1];
      role = role.replace(DEGREE_EXTRACT_REGEX, '').trim();
    } else {
      const orgMatch = org.match(DEGREE_EXTRACT_REGEX);
      if (orgMatch) {
        degree = orgMatch[1];
        org = org.replace(DEGREE_EXTRACT_REGEX, '').trim();
      }
    }
  }

  return { org, role, time, degree };
}

export function parseContactString(contactStr: string) {
  let remaining = contactStr.trim();
  let phone = '';
  let email = '';
  let social = '';

  // 1. Extract email first (standard emails with domain)
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = remaining.match(emailRegex);
  if (emailMatch) {
    email = emailMatch[0].trim();
    remaining = remaining.replace(emailRegex, '').trim();
  }

  // 2. Extract phone with prefixes if present
  const phonePrefixRegex = /(?:电话|手机|手机号|手机号码|电话号码|联系方式|联系电话|Tel|Mobile|Phone|Contact)[:：\s-]*((?:\+?\d{1,4}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{4}|\d{7,15})/i;
  const phonePrefixMatch = remaining.match(phonePrefixRegex);
  if (phonePrefixMatch) {
    phone = phonePrefixMatch[1].trim();
    remaining = remaining.replace(phonePrefixRegex, '').trim();
  } else {
    // Extract Chinese mobile, landline, or international alone without prefixes
    const phoneAloneRegex = /(?:\+?86[\s-]?)?1[3-9]\d(?:\s*-?\s*\d){8}|(?:0\d{2,3}-)?\d{7,8}|\b1[3-9]\d{10}\b|(?:\+?1[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/;
    const phoneMatch = remaining.match(phoneAloneRegex);
    if (phoneMatch) {
      phone = phoneMatch[0].trim();
      remaining = remaining.replace(phoneAloneRegex, '').trim();
    }
  }

  // 3. Process remaining parts as social / other information
  // Split remaining string by typical separators (but not single space or dash inside phone numbers)
  const separatorRegex = /\s*[·|｜••,，;；\t]\s*|\s{2,}|\s+\/\s+/;
  const parts = remaining.split(separatorRegex)
    .map(p => p.trim())
    .filter(Boolean)
    // Filter out parts that are just leftover separators/dashes
    .filter(p => !/^[-·|｜••,，;；\t/\\\s]+$/.test(p));

  social = parts.join(' · ');

  // 4. Fallback if still empty but original had content (just in case)
  if (!phone && !email && !social && contactStr.trim()) {
    const rawParts = contactStr.split(separatorRegex).map(p => p.trim()).filter(Boolean);
    if (rawParts.length > 0) {
      phone = rawParts[0] || '';
      email = rawParts[1] || '';
      social = rawParts.slice(2).join(' · ');
    }
  }

  return { phone, email, social };
}

export function classifySubsequentLines(subsequent: string[]): { subtitle: string; phone: string; email: string; social: string; experience: string } {
  let subtitle = '';
  let phone = '';
  let email = '';
  let social = '';
  let experience = '';

  const isContactLine = (s: string) => {
    const clean = s.toLowerCase();
    if (clean.includes('@')) return true;
    const hasDateRange = /(?:19|20)\d{2}(?:[\.\-\/]\d{1,2})?\s*[-—–~至到]/i.test(clean);
    if (!hasDateRange) {
      if (/^(?:电话|手机|手机号|手机号码|联系方式|联系电话|tel|mobile|phone|contact)[:：\s-]*[+0-9\s\-()]{7,25}/i.test(clean)) return true;
      if (/(?:\+?86[\s-]?)?1[3-9](?:[\s-]?\d){9}/.test(clean) && !/(?:经验|运营|负责|工作|年限|学校|学历|能力)/.test(clean)) return true;
      if (/^\+?[\d\s\-\(\)]{7,20}$/.test(clean.trim())) return true;
    }
    if (clean.includes('github') || clean.includes('gitee') || clean.includes('wechat') || clean.includes('微信') || clean.includes('博客') || clean.includes('blog') || clean.includes('linkedin') || clean.includes('http') || clean.includes('https') || clean.includes('电话') || clean.includes('手机') || clean.includes('邮箱') || clean.includes('tel') || clean.includes('phone') || clean.includes('mobile')) return true;
    return false;
  };

  const isExperienceLine = (s: string) => {
    const clean = s.toLowerCase();
    // 1. Years of experience / work keywords
    if (/年(?:工作|经验|研发|开发|设计|从业|管理|全栈|Java|开发经验|工作经验)/i.test(clean)) return true;
    if (/\b(years|yrs|exp|experience)\b/i.test(clean)) return true;
    // 2. Education degrees
    if (/本科|硕士|博士|大专|等学|中专|大专|学士|研究生|学位|phd|master|bachelor|associate/i.test(clean)) return true;
    // 3. Age
    if (/\d+岁|生于|出生于|19\d{2}年|20\d{2}年/.test(clean)) return true;
    // 4. Job search status
    if (/在职|离职|到岗|考虑|求职|寻找|随时到岗/i.test(clean)) return true;
    // 5. English ability & skills/credentials
    if (/英语能力|英语|语言|证书|资质|CET|四级|六级/i.test(clean)) return true;
    return false;
  };

  const contactLines: string[] = [];
  const expLines: string[] = [];
  const otherLines: string[] = [];

  subsequent.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed === '---' || trimmed === '***' || trimmed === '___') return;
    let stripped = trimmed
      .replace(/^[-*+•●▪■◆]\s+/, '')
      .replace(/^\d{1,2}[\.\)）]\s+/, '')
      .trim();

    if ((stripped.startsWith('**') && stripped.endsWith('**')) || (stripped.startsWith('__') && stripped.endsWith('__'))) {
      stripped = stripped.slice(2, -2).trim();
    } else if ((stripped.startsWith('*') && stripped.endsWith('*')) || (stripped.startsWith('_') && stripped.endsWith('_'))) {
      stripped = stripped.slice(1, -1).trim();
    }
    if (!stripped) return;

    if (isContactLine(stripped)) {
      contactLines.push(stripped);
    } else if (isExperienceLine(stripped)) {
      expLines.push(stripped);
    } else {
      const cleanOther = stripped.replace(/^(?:求职方向|求职意向|求职目标|目标岗位|应聘职位|应聘岗位|意向岗位)[:：\s]*/, '').trim();
      if (cleanOther) {
        otherLines.push(cleanOther);
      }
    }
  });

  if (contactLines.length > 0) {
    const parsed = parseContactString(contactLines[0]);
    phone = parsed.phone;
    email = parsed.email;
    social = parsed.social;
    
    if (contactLines.length > 1) {
      for (let i = 1; i < contactLines.length; i++) {
        const extraParsed = parseContactString(contactLines[i]);
        if (extraParsed.phone && !phone) phone = extraParsed.phone;
        if (extraParsed.email && !email) email = extraParsed.email;
        if (extraParsed.social) {
          social = social ? `${social} · ${extraParsed.social}` : extraParsed.social;
        }
      }
    }
  }

  if (expLines.length > 0) {
    experience = expLines.join(' ｜ ');
  }

  if (otherLines.length > 0) {
    subtitle = otherLines.join(' ｜ ');
  }

  return { subtitle, phone, email, social, experience };
}

export function getSectionCategory(title: string): 'work' | 'project' | 'edu' | 'default' {
  const t = title.trim();
  if (t.includes('教育') || t.includes('学校') || t.includes('本科') || t.includes('硕士') || t.includes('博士') || t.toLowerCase().includes('education') || t.toLowerCase().includes('academic')) {
    return 'edu';
  }
  if (t.includes('项目') || t.includes('产品') || t.includes('开源') || t.toLowerCase().includes('project') || t.toLowerCase().includes('portfolio')) {
    return 'project';
  }
  if (t.includes('工作') || t.includes('经历') || t.includes('实习') || t.toLowerCase().includes('work') || t.toLowerCase().includes('experience') || t.toLowerCase().includes('career')) {
    return 'work';
  }
  return 'default';
}

export function parseTextSectionToItems(text: string, category: 'edu' | 'work' | 'project'): FormItem[] {
  const lines = text.split('\n');
  const items: FormItem[] = [];
  let currentItem: FormItem | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if current line is an attribute of the existing currentItem (time, role/degree)
    if (currentItem && currentItem.org) {
      if (!currentItem.time && isTimeString(trimmed)) {
        currentItem.time = cleanPart(trimmed);
        continue;
      }
      if (category === 'edu' && (!currentItem.role || !currentItem.degree) && !trimmed.startsWith('- ') && !trimmed.startsWith('* ') && !trimmed.startsWith('### ')) {
        const cleanT = cleanPart(trimmed);
        const parts = cleanT.split(/[｜|　]|\s{2,}/).map(p => p.trim()).filter(Boolean);
        if (parts.length > 0) {
          if (parts.length === 1) {
            if (/大专|本科|硕士|博士|学士|双学位|高中|中专/.test(parts[0])) {
              currentItem.degree = parts[0];
            } else {
              currentItem.role = parts[0];
            }
          } else {
            // Find which part is degree
            const degIdx = parts.findIndex(p => /大专|本科|硕士|博士|学士|双学位|高中|中专/.test(p));
            if (degIdx !== -1) {
              currentItem.degree = parts[degIdx];
              const rest = parts.filter((_, idx) => idx !== degIdx);
              currentItem.role = rest.join(' · ');
            } else {
              currentItem.role = parts.join(' · ');
            }
          }
          continue;
        }
      }
      if ((category === 'work' || category === 'project') && !currentItem.role && !trimmed.startsWith('- ') && !trimmed.startsWith('* ') && !trimmed.startsWith('### ')) {
        if (trimmed.startsWith('**') || trimmed.includes('｜') || trimmed.includes('|')) {
          const cleanT = cleanPart(trimmed);
          currentItem.role = cleanT;
          continue;
        }
      }
    }

    let isHeader = false;

    if (trimmed.startsWith('### ')) {
      isHeader = true;
    } else if (trimmed.startsWith('**') && !trimmed.startsWith('- ') && !trimmed.startsWith('* ')) {
      isHeader = true;
    } else if (isTimeString(trimmed) && !trimmed.startsWith('- ') && !trimmed.startsWith('* ')) {
      isHeader = true;
    } else if (!trimmed.startsWith('- ') && !trimmed.startsWith('* ') && !trimmed.startsWith('>') && !trimmed.startsWith('1.') && !trimmed.startsWith('2.') && !trimmed.startsWith('3.')) {
      const lower = trimmed.toLowerCase();
      if (category === 'edu' && (lower.includes('大学') || lower.includes('学院') || lower.includes('学校') || lower.includes('university') || lower.includes('school') || lower.includes('college'))) {
        isHeader = true;
      } else if (category === 'work' && (lower.includes('公司') || lower.includes('集团') || lower.includes('中心') || lower.includes('co.,') || lower.includes('company') || lower.includes('corp') || lower.includes('inc') || lower.includes('科技') || lower.includes('工作室'))) {
        isHeader = true;
      } else if (category === 'project' && (lower.includes('系统') || lower.includes('平台') || lower.includes('软件') || lower.includes('项目') || lower.includes('app') || lower.includes('system') || lower.includes('platform') || lower.includes('引擎') || lower.includes('工具'))) {
        isHeader = true;
      }
    }

    if (isHeader) {
      if (currentItem) {
        items.push(currentItem);
      }
      
      const cleanLine = trimmed.replace(/^###\s+/, '');
      const { org, role, time, degree } = splitItemTitle(cleanLine);
      currentItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 5)}_${i}`,
        org,
        role: role || '',
        time: time || '',
        degree: degree || '',
        content: ''
      };
    } else {
      if (!currentItem) {
        currentItem = {
          id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 5)}_${i}`,
          org: category === 'edu' ? '教育背景' : (category === 'work' ? '工作经历' : '项目经历'),
          role: '',
          time: '',
          degree: '',
          content: ''
        };
      }
      
      currentItem.content += line + '\n';
    }
  }

  if (currentItem) {
    items.push(currentItem);
  }

  items.forEach(item => {
    item.content = item.content.trim();
  });

  return items;
}

export function parseMarkdownToForm(md: string): ResumeFormModel {
  const model: ResumeFormModel = {
    name: '',
    subtitle: '',
    phone: '',
    email: '',
    social: '',
    experience: '',
    sections: []
  };

  const lines = md.split('\n');
  let currentSection: FormSection | null = null;
  let currentItem: FormItem | null = null;
  
  const headerLines: string[] = [];
  let foundFirstH2 = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('## ')) {
      foundFirstH2 = true;
      const title = trimmed.substring(3).trim();
      
      if (currentSection) {
        if (currentItem) {
          currentSection.items.push(currentItem);
          currentItem = null;
        }
        model.sections.push(currentSection);
      }

      currentSection = {
        id: `sec_${i}_${Math.random().toString(36).substring(2, 7)}`,
        title,
        type: 'text',
        textValue: '',
        items: []
      };
      continue;
    }

    if (!foundFirstH2) {
      headerLines.push(line);
      continue;
    }

    if (currentSection) {
      if (trimmed.startsWith('### ')) {
        currentSection.type = 'items';
        if (currentItem) {
          currentSection.items.push(currentItem);
        }
        const itemTitle = trimmed.substring(4).trim();
        let { org, role, time, degree } = splitItemTitle(itemTitle);

        // Look ahead for subsequent lines defining role or date (common in resumes where role & date are on lines 2 & 3)
        let nextIdx = i + 1;
        while (nextIdx < lines.length && nextIdx <= i + 4) {
          const nextTrimmed = lines[nextIdx].trim();
          if (!nextTrimmed) {
            nextIdx++;
            continue;
          }
          if (nextTrimmed.startsWith('#') || nextTrimmed.startsWith('- ') || nextTrimmed.startsWith('* ') || nextTrimmed.startsWith('>')) {
            break;
          }

          // Check if next line is a time string, e.g. **2024.01 — 2026.02**
          if (!time && isTimeString(nextTrimmed)) {
            time = cleanPart(nextTrimmed);
            i = nextIdx;
            nextIdx++;
            continue;
          }

          // Check if next line is bold role/details line, e.g. **跨境电商亚马逊运营｜Amazon 美国站**
          const isBoldOrDetails = (nextTrimmed.startsWith('**') && nextTrimmed.endsWith('**')) || nextTrimmed.includes('｜') || nextTrimmed.includes('|');
          if (isBoldOrDetails && (!role || !time)) {
            const parsed = splitItemTitle(nextTrimmed);
            if (!role && parsed.org && !isTimeString(nextTrimmed)) {
              role = parsed.role ? `${parsed.org} · ${parsed.role}` : parsed.org;
            } else if (!role && parsed.role) {
              role = parsed.role;
            }
            if (!time && parsed.time) {
              time = parsed.time;
            }
            if (!degree && parsed.degree) {
              degree = parsed.degree;
            }
            i = nextIdx;
            nextIdx++;
            continue;
          }

          break;
        }

        currentItem = {
          id: `item_${i}_${Math.random().toString(36).substring(2, 7)}`,
          org,
          role,
          time,
          degree,
          content: ''
        };
      } else {
        if (currentSection.type === 'items') {
          if (currentItem) {
            currentItem.content += line + '\n';
          }
        } else {
          currentSection.textValue += line + '\n';
        }
      }
    }
  }

  if (currentSection) {
    if (currentItem) {
      currentSection.items.push(currentItem);
    }
    model.sections.push(currentSection);
  }

  let nameIndex = -1;
  for (let i = 0; i < headerLines.length; i++) {
    const hl = headerLines[i].trim();
    if (/^#\s+[^\#]/.test(hl) || /^#[^\#\s]+/.test(hl)) {
      model.name = hl.replace(/^#+\s*/, '').replace(/[\*\_]+/g, '').trim();
      nameIndex = i;
      break;
    } else if (hl && nameIndex === -1 && !hl.startsWith('- ') && !hl.startsWith('* ') && !hl.startsWith('+ ')) {
      model.name = hl.replace(/[\*\_]+/g, '').trim();
      nameIndex = i;
    }
  }

  const subsequent: string[] = [];
  for (let i = 0; i < headerLines.length; i++) {
    if (i === nameIndex) continue;
    const hl = headerLines[i].trim();
    if (hl) {
      const cleanedHl = hl
        .replace(/^[-*+•●▪■◆]\s+/, '')
        .replace(/^\d{1,2}[\.\)）]\s+/, '')
        .trim();
      if (cleanedHl) {
        subsequent.push(cleanedHl);
      }
    }
  }

  const classified = classifySubsequentLines(subsequent);
  model.subtitle = classified.subtitle;
  model.phone = classified.phone;
  model.email = classified.email;
  model.social = classified.social;
  model.experience = classified.experience;

  const parsedExp = parseExperienceField(classified.experience);
  model.workYears = parsedExp.workYears;
  model.degree = parsedExp.degree;
  model.city = parsedExp.city;
  model.jobStatus = parsedExp.jobStatus;
  model.age = parsedExp.age;

  model.sections.forEach(sec => {
    const category = getSectionCategory(sec.title);
    if (sec.type === 'text') {
      sec.textValue = sec.textValue.trim();
      if (category === 'work' || category === 'project' || category === 'edu') {
        if (sec.textValue === '') {
          sec.type = 'items';
        } else {
          const parsedItems = parseTextSectionToItems(sec.textValue, category);
          if (parsedItems.length > 0) {
            sec.items = parsedItems;
            sec.type = 'items';
            sec.textValue = '';
          }
          // If no items parsed, preserve sec.type = 'text' gracefully rather than injecting fake items
        }
      }
    }

    if (sec.type === 'items') {
      sec.items.forEach(item => {
        let content = item.content.trim();
        if (category === 'edu') {
          const lines = content.split('\n');
          const remainingLines: string[] = [];
          for (const line of lines) {
            const t = line.trim();
            if (t.match(/^- \*\*(学业成绩|在校表现|成绩|学术成绩|GPA \/ Performance|GPA|Performance)\*\*[:：\s]/)) {
              item.gpa = t.replace(/^- \*\*(学业成绩|在校表现|成绩|学术成绩|GPA \/ Performance|GPA|Performance)\*\*[:：\s]*/, '').trim();
            } else if (t.match(/^- \*\*(主修课程|核心课程|课程|Core Courses|Courses)\*\*[:：\s]/)) {
              item.courses = t.replace(/^- \*\*(主修课程|核心课程|课程|Core Courses|Courses)\*\*[:：\s]*/, '').trim();
            } else if (t.match(/^- \*\*(荣誉成就|荣誉|实践成就|校园成就|Honors & Awards|Honors|Awards)\*\*[:：\s]/)) {
              item.honors = t.replace(/^- \*\*(荣誉成就|荣誉|实践成就|校园成就|Honors & Awards|Honors|Awards)\*\*[:：\s]*/, '').trim();
            } else {
              remainingLines.push(line);
            }
          }
          item.content = remainingLines.join('\n').trim();
        } else {
          item.content = content;
        }
      });
    }
  });

  return model;
}

export function parseExperienceField(expString: string) {
  let workYears = '';
  let degree = '';
  let city = '';
  let jobStatus = '';
  let age = '';

  if (!expString) return { workYears, degree, city, jobStatus, age };

  const parts = expString.split(/[｜|·•]/).map(p => p.trim()).filter(Boolean);
  
  parts.forEach(p => {
    const pl = p.toLowerCase();
    if (/年(?:工作|经验|研发|开发|设计|从业|全栈|Java)/i.test(pl) || pl.includes('经验') || /^\d+\s*(?:year|yr|exp)/i.test(pl)) {
      workYears = p;
    } else if (/本科|硕士|博士|大专|等学|中专|大专|学士|研究生|学位|phd|master|bachelor|associate/i.test(pl)) {
      degree = p;
    } else if (/岁|生于|19\d{2}|20\d{2}/.test(pl)) {
      age = p;
    } else if (/在职|离职|到岗|考虑|求职|寻找/i.test(pl)) {
      jobStatus = p;
    } else {
      if (!city) {
        city = p;
      } else {
        city += ' · ' + p;
      }
    }
  });

  return { workYears, degree, city, jobStatus, age };
}

export function serializeExperienceField(fields: { workYears?: string; degree?: string; city?: string; jobStatus?: string; age?: string }): string {
  const parts: string[] = [];
  if (fields.workYears?.trim()) parts.push(fields.workYears.trim());
  if (fields.degree?.trim()) parts.push(fields.degree.trim());
  if (fields.age?.trim()) parts.push(fields.age.trim());
  if (fields.city?.trim()) parts.push(fields.city.trim());
  if (fields.jobStatus?.trim()) parts.push(fields.jobStatus.trim());
  return parts.join(' ｜ ');
}

export function generateContactString(phone: string, email: string, social: string): string {
  const parts: string[] = [];
  if (phone && phone.trim()) parts.push(phone.trim());
  if (email && email.trim()) parts.push(email.trim());
  if (social && social.trim()) parts.push(social.trim());
  return parts.join(' · ');
}

export function parseFormToMarkdown(model: ResumeFormModel): string {
  let md = '';
  
  if (model.name) {
    md += `# ${model.name}\n`;
  }
  if (model.subtitle) {
    md += `${model.subtitle}\n`;
  }
  
  const contactStr = generateContactString(model.phone, model.email, model.social);
  if (contactStr) {
    md += `${contactStr}\n`;
  }
  
  const expStr = serializeExperienceField({
    workYears: model.workYears,
    degree: model.degree,
    city: model.city,
    jobStatus: model.jobStatus,
    age: model.age
  }) || model.experience;

  if (expStr) {
    md += `${expStr}\n`;
  }
  
  md += '\n';

  model.sections.forEach(sec => {
    md += `## ${sec.title}\n`;
    
    if (sec.type === 'items') {
      md += '\n';
      sec.items.forEach(item => {
        let titleParts: string[] = [];
        if (item.org && item.org.trim()) titleParts.push(item.org.trim());
        if (item.degree && item.degree.trim()) titleParts.push(item.degree.trim());
        if (item.role && item.role.trim()) titleParts.push(item.role.trim());
        if (item.time && item.time.trim()) {
          let t = item.time.trim();
          if (!t.startsWith('*')) t = `*${t}*`;
          titleParts.push(t);
        }

        const itemTitle = titleParts.join(' ｜ ');
        md += `### ${itemTitle}\n`;
        
        const category = getSectionCategory(sec.title);
        if (category === 'edu') {
          const isEnglish = !/[\u4e00-\u9fa5]/.test(sec.title);
          
          if (item.gpa && item.gpa.trim()) {
            md += isEnglish 
              ? `- **GPA / Performance**: ${item.gpa.trim()}\n`
              : `- **在校表现**：${item.gpa.trim()}\n`;
          }
          if (item.courses && item.courses.trim()) {
            md += isEnglish
              ? `- **Core Courses**: ${item.courses.trim()}\n`
              : `- **主修课程**：${item.courses.trim()}\n`;
          }
          if (item.honors && item.honors.trim()) {
            md += isEnglish
              ? `- **Honors & Awards**: ${item.honors.trim()}\n`
              : `- **荣誉成就**：${item.honors.trim()}\n`;
          }
          if (item.content && item.content.trim()) {
            md += `${item.content.trim()}\n`;
          }
          md += '\n';
        } else {
          if (item.content) {
            md += `${item.content.trim()}\n\n`;
          } else {
            md += '\n';
          }
        }
      });
    } else {
      if (sec.textValue) {
        md += `${sec.textValue}\n\n`;
      } else {
        md += '\n';
      }
    }
  });

  return md.trim() + '\n';
}
