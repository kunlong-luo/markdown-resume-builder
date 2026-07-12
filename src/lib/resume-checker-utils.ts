
import { formatChineseEnglishSpacing } from './format-utils';
import { parseMarkdownToForm } from './markdown-parser';

export interface IssueItem {
  type: 'error' | 'warning' | 'success';
  title: string;
  desc: string;
  fixable?: boolean;
  onFix?: () => void;
}

export interface AnalysisResult {
  score: number;
  issues: IssueItem[];
  hasPlaceholders: boolean;
  metricCount: number;
  foundVerbsCount: number;
}

export function analyzeResume(markdown: string, onUpdateMarkdown: (newMarkdown: string, immediate?: boolean) => void): AnalysisResult {
  const issues: IssueItem[] = [];
  let score = 100;

  // 1. Check Name (H1)
  const hasH1 = markdown.trim().split('\n').some(line => line.startsWith('# '));
  if (hasH1) {
    issues.push({
      type: 'success',
      title: '基本信息：姓名标题已设置',
      desc: '简历顶部包含 # 姓名 格式的一级标题，利于系统和HR检索。'
    });
  } else {
    score -= 20;
    issues.push({
      type: 'error',
      title: '基本信息：缺失姓名一级标题',
      desc: '简历最顶部应该使用「# 您的姓名」作为标题。',
      fixable: true,
      onFix: () => {
        onUpdateMarkdown('# 张三\n' + markdown, true);
      }
    });
  }

  // 2. Check Contact details
  const hasEmail = markdown.includes('@') && !markdown.includes('your-email') && !markdown.includes('your.email');
  const hasPhone = /(?:1[3-9]\d{9})/.test(markdown) && !markdown.includes('13800000000') && !markdown.includes('13812345678');

  if (hasEmail) {
    issues.push({
      type: 'success',
      title: '联系方式：电子邮箱有效',
      desc: '已包含有效的邮箱联系方式。'
    });
  } else {
    score -= 10;
    issues.push({
      type: 'warning',
      title: '联系方式：邮箱缺失或为默认占位符',
      desc: '简历中未找到或含有默认的邮箱地址。电子邮箱是HR发出面试通知的核心渠道。',
      fixable: true,
      onFix: () => {
        const lines = markdown.split('\n');
        const h1Idx = lines.findIndex(l => l.startsWith('# '));
        if (h1Idx !== -1) {
          lines.splice(h1Idx + 1, 0, '13812345678 ｜ your.email@email.com ｜ github.com/yourgithub');
          onUpdateMarkdown(lines.join('\n'), true);
        } else {
          onUpdateMarkdown('your.email@email.com\n' + markdown, true);
        }
      }
    });
  }

  if (hasPhone) {
    issues.push({
      type: 'success',
      title: '联系方式：手机号有效',
      desc: '已包含有效的电话联系方式。'
    });
  } else {
    score -= 10;
    issues.push({
      type: 'warning',
      title: '联系方式：手机号缺失或为占位符',
      desc: '简历中没有包含常规手机号格式或使用了模版默认手机号。',
    });
  }

  // 3. Template leftovers/placeholders check
  const placeholders = [
    '13800000000', '13812345678', 'your-email', 'your.email', 'yourgithub', 
    '【请在此处', '请替换', '[请填写', '某某公司', '某某大学', 'xxxx', 'XXXX'
  ];
  const foundPlaceholders = placeholders.filter(p => markdown.includes(p));
  
  if (foundPlaceholders.length === 0) {
    issues.push({
      type: 'success',
      title: '内容合规：未发现模版残留文本',
      desc: '简历中的占位文本和模版标签已全部替换完毕。'
    });
  } else {
    score -= (foundPlaceholders.length * 8);
    issues.push({
      type: 'error',
      title: `内容警告：存在 ${foundPlaceholders.length} 处模版残留`,
      desc: `检测到模版残留字段: ${foundPlaceholders.map(p => `"${p}"`).join(', ')}。请尽快将它们修改为您自己的真实信息！`,
    });
  }

  // 4. Quantifiable metrics evaluation
  const metricWords = ['%', '％', '万', '亿', '倍', '提升', '增长', '降低', '优化', '减少', '节省', '达到'];
  let metricCount = 0;
  const lines = markdown.split('\n');
  lines.forEach(line => {
    let lineHasMetric = false;
    if (/\d+(?:\.\d+)?(?:%|万|亿|倍)/.test(line)) lineHasMetric = true;
    metricWords.forEach(w => {
      if (line.includes(w)) lineHasMetric = true;
    });
    if (lineHasMetric) metricCount++;
  });

  if (metricCount >= 5) {
    issues.push({
      type: 'success',
      title: `量化成果：丰富 (${metricCount} 处数据指标)`,
      desc: '您的简历在职责和项目中融入了丰富的数据指标和成果描述，非常专业且具说服力！'
    });
  } else if (metricCount >= 1) {
    score -= 5;
    issues.push({
      type: 'warning',
      title: `量化成果：稍显薄弱 (${metricCount} 处指标)`,
      desc: '简历中包含了一些数据或动词，但较少。建议补充具体业绩，如：「高并发处理提升30%」、「研发周期缩短2周」等。'
    });
  } else {
    score -= 15;
    issues.push({
      type: 'error',
      title: '量化成果：极度匮乏 (无数据支持)',
      desc: '未检测到具体的业务指标或量化结果。优秀的简历遵循 STAR 法则，必须包含具体的数值（如百分比、资金、效率提升等）来证明成效。'
    });
  }

  // 5. Action Verbs analysis
  const actionVerbs = ['负责', '主导', '重构', '重写', '设计', '架构', '编写', '实现', '优化', '搭建', '协调', '落地', '推行', '维护'];
  const foundVerbs = actionVerbs.filter(v => markdown.includes(v));
  if (foundVerbs.length >= 6) {
    issues.push({
      type: 'success',
      title: `专业动词：表现极佳 (已使用 ${foundVerbs.length} 个强动词)`,
      desc: '使用了丰富的专业行动词汇（如：' + foundVerbs.slice(0, 5).join('、') + ' 等），能很好地展示您的专业度。'
    });
  } else if (foundVerbs.length >= 2) {
    score -= 5;
    issues.push({
      type: 'warning',
      title: `专业动词：建议补充 (仅发现 ${foundVerbs.length} 个动词)`,
      desc: `建议更多地使用强有力的行动词汇（例如：重构、主导、独立设计、优化等）作为每项工作描述的开头，避免单一使用「负责」或「做过」。`
    });
  } else {
    score -= 15;
    issues.push({
      type: 'error',
      title: '专业动词：动作描述苍白',
      desc: '简历中几乎没有检测到专业的行业行动词汇。请在工作/项目经历开头使用诸如「搭建...」、「重构...」、「主导研发...」来彰显专业深度。'
    });
  }

  // 6. Page split control
  const charCount = markdown.length;
  const hasPageBreak = /<!--\s*pagebreak\s*-->/gi.test(markdown);
  if (charCount > 2200) {
    if (hasPageBreak) {
      issues.push({
        type: 'success',
        title: '排版控制：已使用分页符',
        desc: '简历字数较多，但您已经明智地使用了 <!-- pagebreak --> 标签来控制打印分页，避免了打印时产生跨页截断。'
      });
    } else {
      score -= 10;
      issues.push({
        type: 'warning',
        title: '排版警告：建议插入分页符',
        desc: '当前简历总字数较多，如果直接打印为 PDF 可能会产生无章法的自动截断。建议在一页纸写不下的合适段落之后，点击编辑工具栏的剪刀按钮插入「<!-- pagebreak -->」进行优雅的手动分页。',
        fixable: true,
        onFix: () => {
          const lines = markdown.split('\n');
          let insertIdx = -1;
          for (let i = Math.floor(lines.length * 0.45); i < lines.length; i++) {
            if (lines[i].trim().startsWith('## ')) {
              insertIdx = i;
              break;
            }
          }
          if (insertIdx !== -1) {
            lines.splice(insertIdx, 0, '<!-- pagebreak -->');
            onUpdateMarkdown(lines.join('\n'), true);
          } else {
            onUpdateMarkdown(markdown + '\n\n<!-- pagebreak -->\n', true);
          }
        }
      });
    }
  } else {
    issues.push({
      type: 'success',
      title: '排版控制：字数适中 (一页精简版)',
      desc: '简历长度适宜，通常可以完美放入一页 A4 纸内，符合绝大多数招聘官的阅读习惯。'
    });
  }

  // 7. Subjective Pronoun Audit
  const pronounRegex = /[我他她它你][们]?|自己/g;
  const pronounMatches = markdown.match(pronounRegex) || [];
  const pronounCount = pronounMatches.length;

  if (pronounCount > 0) {
    score -= Math.min(15, pronounCount * 3);
    issues.push({
      type: 'warning',
      title: `主观人称：检测到 ${pronounCount} 处主观代词 (我/自己)`,
      desc: '简历应采用第三人称客观视角叙述。请尽量避免使用“我”、“自己”、“我们”等主观代词，直接以“负责...”、“主导...”等动词开头。',
      fixable: true,
      onFix: () => {
        let fixed = markdown;
        fixed = fixed.replace(/^-\s*我负责了/gm, '- 负责');
        fixed = fixed.replace(/^-\s*我负责/gm, '- 负责');
        fixed = fixed.replace(/^-\s*我自己主导了/gm, '- 主导');
        fixed = fixed.replace(/^-\s*我自己主导/gm, '- 主导');
        fixed = fixed.replace(/^-\s*我主导了/gm, '- 主导');
        fixed = fixed.replace(/^-\s*我主导/gm, '- 主导');
        fixed = fixed.replace(/^-\s*我完成了/gm, '- 完成');
        fixed = fixed.replace(/^-\s*我完成/gm, '- 完成');
        fixed = fixed.replace(/^-\s*我参与了/gm, '- 参与');
        fixed = fixed.replace(/^-\s*我参与/gm, '- 参与');
        fixed = fixed.replace(/^-\s*我/gm, '- ');
        fixed = fixed.replace(/^-\s*自己/gm, '- ');
        fixed = fixed.replace(/^-\s*我们/gm, '- ');
        onUpdateMarkdown(fixed, true);
      }
    });
  } else {
    issues.push({
      type: 'success',
      title: '主观人称：符合客观书写规范',
      desc: '未包含主观的人称代词（我/自己），通篇采用客观的第三人称或动词开头，非常符合招聘规范。'
    });
  }

  // 8. CJK Spacing Audit
  const formattedText = formatChineseEnglishSpacing(markdown);
  const missingSpacesCount = formattedText.length - markdown.length;

  if (missingSpacesCount > 0) {
    score -= 10;
    issues.push({
      type: 'warning',
      title: `排版美化：发现 ${missingSpacesCount} 处中英/数字缺少空格`,
      desc: '中英文、数字混排时，在它们之间添加一个半角空格是标准的专业排版规范（例如：“React开发” 优化为 “React 开发”），能极大提升视觉易读性。',
      fixable: true,
      onFix: () => {
        onUpdateMarkdown(formattedText, true);
      }
    });
  } else {
    issues.push({
      type: 'success',
      title: '排版美化：中英混排格式完美',
      desc: '简历中的中文、英文以及数字之间均有标准的半角空格分隔，视觉排版极其舒适和专业。'
    });
  }

  // 9. ATS Compatibility Check
  const hasEmojis = /[\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu.test(markdown);
  const hasTables = /\|.+\|.+\|/g.test(markdown);

  if (hasEmojis || hasTables) {
    score -= 5;
    let descParts: string[] = [];
    if (hasEmojis) descParts.push('检测到简历中含有彩色表情符号或生僻图形。大厂 ATS（申请人跟踪系统）机器读取时可能将其识别为乱码或导致周围文本解析错误，建议仅使用常规列表圆点「-」或「·」作为前缀。');
    if (hasTables) descParts.push('检测到含有 Markdown 复杂表格排版。ATS 在解析表格内的文字时，经常会出现多行文字横向串行、错乱或文字被自动忽略的问题，建议将表格重构为标准的项目经历条目描述。');
    issues.push({
      type: 'warning',
      title: 'ATS 友好度：检测到潜在解析风险',
      desc: descParts.join(' ')
    });
  } else {
    issues.push({
      type: 'success',
      title: 'ATS 友好度：完美通过机器预审',
      desc: '简历中没有生僻彩色图标或多栏复杂表格，这能确保大厂 ATS 简历初筛系统百分百正常解析您的工作经历和关键词。'
    });
  }

  // 10. English Verb Tense Verification
  const model = parseMarkdownToForm(markdown);
  let pastTenseInconsistency = false;
  let checkedRolesCount = 0;
  const offendingOrgs: string[] = [];
  const englishPresentRegex = /^\s*-\s*\b(develop|lead|manage|create|build|optimize|implement|design|write|coordinate|maintain|support|solve|analyze|execute|deploy|integrate)\b/i;

  model.sections.forEach(sec => {
    if (sec.type === 'items') {
      sec.items.forEach(item => {
        const hasEnglishBullets = /-\s*[a-zA-Z]{3,}/.test(item.content);
        if (hasEnglishBullets && item.time) {
          const isPastExperience = !/(至今|现在|present|Present|now)/i.test(item.time);
          if (isPastExperience) {
            checkedRolesCount++;
            const lines = item.content.split('\n');
            const hasPresentVerb = lines.some(line => englishPresentRegex.test(line));
            if (hasPresentVerb) {
              pastTenseInconsistency = true;
              if (item.org && !offendingOrgs.includes(item.org)) {
                offendingOrgs.push(item.org);
              }
            }
          }
        }
      });
    }
  });

  if (pastTenseInconsistency) {
    score -= 5;
    issues.push({
      type: 'warning',
      title: '时态规范：已结束经历建议采用过去式动词',
      desc: `检测到已结束的工作/项目经历（如：${offendingOrgs.join('、')}）的英文描述中含有现在时行动词（例如：Develop, Lead）。根据专业英文简历规范，已经结束的经历中所有行为条目应当统一使用过去式动词开头（例如：将 Develop 改为 Developed，Lead 改为 Led）。`
    });
  } else if (checkedRolesCount > 0) {
    issues.push({
      type: 'success',
      title: '时态规范：英文经历动作时态高度一致',
      desc: '所有已结束经历的英文动作条目均正确采用过去式行动词，时态规范完美，彰显出极佳的求职专业度。'
    });
  }
  
  const finalScore = Math.max(25, Math.min(100, score));

  const sortedIssues = [...issues].sort((a, b) => {
    const priority = { error: 0, warning: 1, success: 2 };
    return priority[a.type] - priority[b.type];
  });

  return {
    score: finalScore,
    issues: sortedIssues,
    hasPlaceholders: foundPlaceholders.length > 0,
    metricCount,
    foundVerbsCount: foundVerbs.length
  };
}
