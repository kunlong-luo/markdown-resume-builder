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
console.log(parseContactString("13800138000 · example@email.com · GitHub：..."));
console.log(parseContactString("18945723739 · kunlong_luo@163.com · GitHub：github.com/prairie-spark-iot"));
console.log(parseContactString("13812345678"));
console.log(parseContactString("18945723739"));
