import { FormItem, FormSection, ResumeFormModel } from './form-types';

export function isTimeString(s: string): boolean {
  const clean = s.replace(/[*_]/g, '').trim();
  if (/\d{4}/.test(clean) || clean.includes('至今') || clean.includes('present') || clean.includes('Present') || clean.includes('毕业')) {
    return true;
  }
  return false;
}

export function cleanPart(s: string): string {
  let res = s.trim();
  if (res.startsWith('**') && res.endsWith('**')) {
    res = res.slice(2, -2).trim();
  }
  if (res.startsWith('*') && res.endsWith('*')) {
    res = res.slice(1, -1).trim();
  }
  if (res.startsWith('__') && res.endsWith('__')) {
    res = res.slice(2, -2).trim();
  }
  if (res.startsWith('_') && res.endsWith('_')) {
    res = res.slice(1, -1).trim();
  }
  return res;
}

export function splitItemTitle(titleStr: string): { org: string; role: string; time: string; degree?: string } {
  let clean = titleStr.trim();
  if (clean.startsWith('**') && clean.endsWith('**')) {
    clean = clean.slice(2, -2).trim();
  }
  
  const parts = clean.split(/[｜|　]|\s{2,}/).map(p => p.trim()).filter(Boolean);

  if (parts.length === 0) {
    return { org: '', role: '', time: '', degree: '' };
  }

  if (parts.length === 1) {
    return { org: cleanPart(parts[0]), role: '', time: '', degree: '' };
  }

  if (parts.length === 2) {
    const p0 = cleanPart(parts[0]);
    const p1 = cleanPart(parts[1]);
    if (isTimeString(parts[1])) {
      return { org: p0, role: '', time: p1, degree: '' };
    } else {
      return { org: p0, role: p1, time: '', degree: '' };
    }
  }

  if (parts.length === 3) {
    const p0 = cleanPart(parts[0]);
    const p1 = cleanPart(parts[1]);
    const p2 = cleanPart(parts[2]);
    
    if (isTimeString(parts[2])) {
      // Could be org | role | time
      const isDegree = /本科|硕士|博士|大专|高中|中专|学士|研究生|PhD|Master|Bachelor|Associate/i.test(p1);
      if (isDegree) {
        return { org: p0, degree: p1, role: '', time: p2 };
      }
      return { org: p0, role: p1, time: p2, degree: '' };
    } else {
      // Could be org | degree | role
      return { org: p0, degree: p1, role: p2, time: '' };
    }
  }

  if (parts.length === 4) {
    return {
      org: cleanPart(parts[0]),
      degree: cleanPart(parts[1]),
      role: cleanPart(parts[2]),
      time: cleanPart(parts[3])
    };
  }

  const lastIdx = parts.length - 1;
  const lastPart = parts[lastIdx];
  if (isTimeString(lastPart)) {
    return {
      org: cleanPart(parts[0]),
      degree: cleanPart(parts[1]),
      role: parts.slice(2, lastIdx).map(p => cleanPart(p)).join(' ｜ '),
      time: cleanPart(lastPart)
    };
  } else {
    return {
      org: cleanPart(parts[0]),
      degree: cleanPart(parts[1]),
      role: parts.slice(2).map(p => cleanPart(p)).join(' ｜ '),
      time: ''
    };
  }
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
  const phonePrefixRegex = /(?:电话|手机|手机号|手机号码|电话号码|联系方式|联系电话|Tel|Mobile|Phone|Contact)[:：\s-]*((?:\+?86[\s-]?)?1[3-9]\d(?:\s*-?\s*\d){8}|(?:0\d{2,3}-)?\d{7,8})/i;
  const phonePrefixMatch = remaining.match(phonePrefixRegex);
  if (phonePrefixMatch) {
    phone = phonePrefixMatch[1].trim();
    remaining = remaining.replace(phonePrefixRegex, '').trim();
  } else {
    // Extract Chinese mobile or standard landline alone without prefixes
    const phoneAloneRegex = /(?:\+?86[\s-]?)?1[3-9]\d(?:\s*-?\s*\d){8}|(?:0\d{2,3}-)?\d{7,8}/;
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
    if (/\d{7,}/.test(clean.replace(/[^\d]/g, ''))) return true;
    if (clean.includes('github') || clean.includes('gitee') || clean.includes('wechat') || clean.includes('微信') || clean.includes('博客') || clean.includes('blog') || clean.includes('linkedin') || clean.includes('http') || clean.includes('https') || clean.includes('电话') || clean.includes('手机') || clean.includes('邮箱') || clean.includes('tel:') || clean.includes('phone') || clean.includes('mobile')) return true;
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
    return false;
  };

  const contactLines: string[] = [];
  const expLines: string[] = [];
  const otherLines: string[] = [];

  subsequent.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (isContactLine(trimmed)) {
      contactLines.push(trimmed);
    } else if (isExperienceLine(trimmed)) {
      expLines.push(trimmed);
    } else {
      otherLines.push(trimmed);
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
      
      if (category === 'edu' && !currentItem.role && !currentItem.degree && !trimmed.startsWith('- ') && !trimmed.startsWith('* ')) {
        const parts = trimmed.split(/[｜|　]|\s{2,}/).map(p => p.trim()).filter(Boolean);
        if (parts.length > 0) {
          if (parts.length === 1) {
            currentItem.role = cleanPart(parts[0]);
          } else {
            currentItem.degree = cleanPart(parts[0]);
            currentItem.role = cleanPart(parts[1]);
          }
          continue;
        }
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
        const { org, role, time, degree } = splitItemTitle(itemTitle);
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
    if (hl.startsWith('# ')) {
      model.name = hl.replace('# ', '').trim();
      nameIndex = i;
      break;
    } else if (hl && nameIndex === -1) {
      model.name = hl;
      nameIndex = i;
    }
  }

  const subsequent: string[] = [];
  for (let i = 0; i < headerLines.length; i++) {
    if (i === nameIndex) continue;
    const hl = headerLines[i].trim();
    if (hl) {
      const cleanedHl = hl.replace(/^[-*•\s+]+\s*/, '').replace(/^\d{1,2}[\.\s)）:：、]+\s*/, '').trim();
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
          } else {
            const defaultItem: FormItem = {
              id: `item_fallback_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              org: category === 'edu' ? '毕业院校' : (category === 'work' ? '公司/企业' : '项目名称'),
              role: category === 'edu' ? '所学专业' : (category === 'work' ? '职务角色' : '担当角色'),
              time: '至今',
              content: sec.textValue,
              degree: category === 'edu' ? '学历学位' : ''
            };
            sec.items = [defaultItem];
            sec.type = 'items';
            sec.textValue = '';
          }
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

        const itemTitle = titleParts.join('　');
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
