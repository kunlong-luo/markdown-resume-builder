export function maskPrivacyData(markdown: string, isEn: boolean = false): string {
  let text = markdown;

  // 1. Mask Phone Numbers: standard 11-digit Chinese mobile or US/global styles
  text = text.replace(/(?:(?:\+|00)86\s*)?(1[3-9]\d)\d{4}(\d{4})/g, (match, p1, p2) => {
    return `${p1}****${p2}`;
  });
  text = text.replace(/(\+?\d{1,2}\s*\(?\d{3}\)?\s*)\d{3}(\s*-\s*\d{4})/g, (match, p1, p2) => {
    return `${p1}***${p2}`;
  });

  // 2. Mask Emails: e.g. kunlong@gmail.com -> k***@gmail.com
  text = text.replace(/([a-zA-Z0-9._%+-])[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, (match, p1, p2) => {
    return `${p1}***@${p2}`;
  });

  // 3. Mask name in the first `# 姓名` header
  text = text.replace(/^#\s+([^\n|｜]+)/m, (match, name) => {
    const trimmedName = name.trim();
    if (isEn) {
      return `# Candidate Profile`;
    } else {
      if (trimmedName.length <= 4) {
        const surname = trimmedName.charAt(0);
        return `# ${surname}先生/女士`;
      }
      return `# 某优秀求职者`;
    }
  });

  // 4. Mask schools and companies
  const companyWords = ['科技', '集团', '公司', '网络', '软件', '工业', '信息', '证券', '银行', '控股', '有限', '研究院', '技术', '工作室'];
  const schoolWords = ['大学', '学院', '中专', '大专', '高中', '中学'];
  
  text = text.replace(/\*\*([^*]+)\*\*/g, (match, content) => {
    const trimmed = content.trim();
    const isSchool = schoolWords.some(w => trimmed.includes(w)) || /university|college/i.test(trimmed);
    const isCompany = companyWords.some(w => trimmed.includes(w)) || /tech|corp|inc|group|ltd|corporation|dynamics/i.test(trimmed);

    if (isSchool) {
      if (isEn) {
        return `**Elite University**`;
      } else {
        if (trimmed.includes('北') || trimmed.includes('清') || trimmed.includes('复') || trimmed.includes('交') || trimmed.includes('九') || trimmed.includes('985') || trimmed.includes('211')) {
          return `**某 985 双一流高校**`;
        }
        return `**某知名高等院校**`;
      }
    }
    if (isCompany) {
      if (isEn) {
        return `**Leading Enterprise**`;
      } else {
        if (trimmed.includes('阿里') || trimmed.includes('腾讯') || trimmed.includes('字节') || trimmed.includes('美团') || trimmed.includes('百度') || trimmed.includes('网易') || trimmed.includes('大厂')) {
          return `**某头部互联网大厂**`;
        }
        return `**某知名科技企业**`;
      }
    }
    return match;
  });

  return text;
}
