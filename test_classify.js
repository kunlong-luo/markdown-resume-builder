function classifySubsequentLines(subsequent) {
  let subtitle = '';
  let phone = '';
  let email = '';
  let social = '';
  let experience = '';

  const isContactLine = (s) => {
    const clean = s.toLowerCase();
    if (clean.includes('@')) return true;
    if (/\d{7,}/.test(clean.replace(/[^\d]/g, ''))) return true;
    if (clean.includes('github') || clean.includes('gitee') || clean.includes('wechat') || clean.includes('微信') || clean.includes('博客') || clean.includes('blog') || clean.includes('linkedin') || clean.includes('http') || clean.includes('https') || clean.includes('电话') || clean.includes('邮箱') || clean.includes('tel:')) return true;
    return false;
  };

  const isExperienceLine = (s) => {
    const clean = s.toLowerCase();
    if (/年(工作|经验|研发|开发|设计|从业|管理|全栈|Java)/i.test(clean)) return true;
    if (/\b(years|yrs|exp|experience)\b/i.test(clean)) return true;
    return false;
  };

  const contactLines = [];
  const expLines = [];
  const otherLines = [];

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

  function parseContactString(contactStr) {
    const separatorRegex = /\s*[·|｜••,，;；\t]\s*|\s{2,}|\s+\/\s+|\s+-\s+|\s+—\s+/;
    const parts = contactStr.split(separatorRegex).map(p => p.trim()).filter(Boolean);
    let phone = '';
    let email = '';
    let social = '';

    const matchedIndices = new Set();

    parts.forEach((part, idx) => {
      const cleanPart = part.trim();
      if (!cleanPart) return;

      if (cleanPart.includes('@') && !cleanPart.includes('/') && !cleanPart.includes('github') && !cleanPart.includes('gitee')) {
        email = cleanPart.replace(/^(电子)?邮箱[:：\s]*/i, '').trim();
        matchedIndices.add(idx);
      } else if (
        /^\+?[0-9]{7,20}$/.test(cleanPart.replace(/[^\d+]/g, '')) || 
        /^(电话|手机|Tel|Mobile|Phone)[:：\s]*/i.test(cleanPart)
      ) {
        phone = cleanPart.replace(/^(电话|手机|Tel|Mobile|Phone)[:：\s]*/i, '').trim();
        matchedIndices.add(idx);
      }
    });

    parts.forEach((part, idx) => {
      if (matchedIndices.has(idx)) return;
      const cleanPart = part.trim();
      if (!social) {
        social = cleanPart;
      } else {
        social += ` · ${cleanPart}`;
      }
    });

    if (matchedIndices.size === 0 && parts.length > 0) {
      phone = parts[0] || '';
      email = parts[1] || '';
      social = parts.slice(2).join(' · ');
    }
    return { phone, email, social };
  }

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

  if (otherLines.length > 0) {
    subtitle = otherLines[0];
  } else if (expLines.length > 1) {
    // If no other lines, maybe subtitle was misclassified as experience?
    // Let's just use the first expLine if there are multiple.
  }

  if (expLines.length > 0) {
    experience = expLines[expLines.length - 1]; // Assume the last one is the actual experience string
  }

  return { subtitle, phone, email, social, experience, contactLines, expLines, otherLines };
}

console.log(classifySubsequentLines([
  'AIoT架构师 ｜ 后端技术负责人 ｜ 7年Java全栈实战',
  '18945723739 · kunlong_luo@163.com · GitHub：github.com/prairie-spark-iot',
  '7年工作经验'
]));
