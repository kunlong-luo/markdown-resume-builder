import React from 'react';
import { getH2ClassName } from '../../lib/preview-utils';

// Static constants lifted out of render cycle to prevent repeated compilation and memory allocation overhead
const DATE_REGEX = /(?:(?:19|20)\d{2}[\.\-\/年\s]\d{1,2}|(?:19|20)\d{2})\s*(?:[\-—–―~～至到]|--+|\s+)\s*(?:(?:19|20)\d{2}[\.\-\/年\s]\d{1,2}|(?:19|20)\d{2}|至今|现在|present|Present)/gi;
const DIVIDER_REGEX = /[　]|[｜|·•]|\s{2,}/;
const SPLIT_REGEX = /[　]|\s*[|｜·•]\s*|\s{2,}/g;

const ROLE_KEYWORDS = [
  '架构师', '工程师', '开发', '负责人', '独立开发者', '开发者', '专家', '管理', '设计', '组长', 
  '经理', '总监', '合伙人', '实习生', '运营', '主持', '教师', '讲师', '核心开发', '核心成员',
  'Intern', 'Architect', 'Engineer', 'Developer', 'Lead', 'Manager', 'Consultant'
];

const EDU_KEYWORDS = [
  '大学', '学院', '学校', 'University', 'College', 'School', '学位', '本科', '硕士', '博士', 
  '大专', '中专', '高中', '初中', '小学', 'Bachelor', 'Master', 'PhD', 'MBA', '教育', '专业', 
  '学士', '学业', '在校', '主修', 'GPA'
];

function getChildrenText(children: any): string {
  let text = '';
  React.Children.forEach(children, (child) => {
    if (typeof child === 'string') {
      text += child;
    } else if (typeof child === 'number') {
      text += String(child);
    } else if (child && typeof child === 'object' && 'props' in child) {
      const props = (child as any).props;
      if (props && props.children) {
        text += getChildrenText(props.children);
      }
    }
  });
  return text;
}

function renderStructuralRow(
  children: any,
  sizeClasses: any,
  theme: any,
  defaultRender: () => React.ReactElement
): React.ReactElement {
  const textContent = getChildrenText(children).trim();

  let datePart = '';
  let mainText = textContent;
  
  const matches = textContent.match(DATE_REGEX);
  if (matches && matches.length > 0) {
    datePart = matches[0].trim();
    mainText = textContent.replace(DATE_REGEX, '').trim();
    mainText = mainText.replace(/[\*\s\(\)]+$/, '').trim();
    mainText = mainText.replace(/^[\*\s\(\)]+/, '').trim();
  }

  const hasDivider = DIVIDER_REGEX.test(mainText) || datePart !== '';
  const isShortLine = textContent.length < 150;

  if (hasDivider && isShortLine && (datePart || DIVIDER_REGEX.test(mainText))) {
    // Split segments
    const segments = mainText.split(SPLIT_REGEX).map(s => s.trim()).filter(Boolean);

    if (segments.length > 0) {
      let companyOrProject = segments[0] || '';
      let roleOrTitle = segments[1] || '';

      const isEdu = EDU_KEYWORDS.some(k => textContent.includes(k));

      if (segments.length >= 2) {
        const s0IsRole = ROLE_KEYWORDS.some(keyword => segments[0].includes(keyword));
        const s1IsRole = ROLE_KEYWORDS.some(keyword => segments[1].includes(keyword));

        if (s0IsRole && !s1IsRole) {
          companyOrProject = segments[1];
          roleOrTitle = segments[0];
        }
      }

      // Elegant premium typography for resume headers
      return (
        <div className={`flex flex-row items-baseline justify-between gap-4 border-b border-gray-100/60 pb-1.5 ${isEdu ? 'mt-6 mb-3' : 'mt-5 mb-1.5'} break-inside-avoid break-after-avoid w-full`}>
          <div className="flex flex-wrap items-baseline gap-x-2.5">
            {companyOrProject && (
              <span className={`font-bold text-gray-950 tracking-tight ${isEdu ? 'text-[14.5px] sm:text-[15px]' : 'text-xs sm:text-[13.0px]'}`}>
                {companyOrProject}
              </span>
            )}
            
            <div className="flex flex-wrap items-center gap-2 text-gray-600 font-medium text-[12.5px] sm:text-[13px]">
              {roleOrTitle && (
                <>
                  <span className="text-gray-300 select-none text-[10px]">•</span>
                  <span>{roleOrTitle}</span>
                </>
              )}

              {segments.slice(2).map((extra, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-gray-300 select-none text-[10px]">•</span>
                  <span>{extra}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {datePart && (
            <span className={`text-gray-500 font-bold font-mono whitespace-nowrap ml-auto tabular-nums ${isEdu ? 'text-[12.5px]' : 'text-[11px] sm:text-[11.5px]'}`}>
              {datePart}
            </span>
          )}
        </div>
      );
    }
  }

  return defaultRender();
}

export function createMarkdownComponents({
  headerInfo,
  sizeClasses,
  theme,
  settings,
}: {
  headerInfo: any;
  sizeClasses: any;
  theme: any;
  settings: any;
}) {
  return {
    h1: ({ node, ...props }: any) => headerInfo.hasHeader ? null : <h1 className={sizeClasses.h1} {...props} />,
    h2: ({ node, ...props }: any) => <h2 className={getH2ClassName(settings.fontSize, theme, settings.h2Style)} {...props} />,
    h3: ({ node, children, ...props }: any) => {
      return renderStructuralRow(children, sizeClasses, theme, () => (
        <h3 className={sizeClasses.h3} {...props}>{children}</h3>
      ));
    },
    p: ({ node, children, ...props }: any) => {
      return renderStructuralRow(children, sizeClasses, theme, () => (
        <p className={sizeClasses.p} {...props}>{children}</p>
      ));
    },
    ul: ({ node, ...props }: any) => <ul className={sizeClasses.ul} {...props} />,
    ol: ({ node, ...props }: any) => <ol className={sizeClasses.ol} {...props} />,
    li: ({ node, children, ...props }: any) => {
      return renderStructuralRow(children, sizeClasses, theme, () => (
        <li className={sizeClasses.li} {...props}>{children}</li>
      ));
    },
    strong: ({ node, ...props }: any) => <strong className="font-bold text-gray-900" {...props} />,
    em: ({ node, ...props }: any) => <em className="italic text-gray-500 font-normal" {...props} />,
    hr: ({ node, ...props }: any) => <hr className={sizeClasses.hr} {...props} />,
    a: ({ node, ...props }: any) => <a className={`${theme.accentText} font-medium transition-colors break-words underline underline-offset-2 decoration-gray-200 hover:decoration-current`} {...props} />,
    blockquote: ({ node, ...props }: any) => <blockquote className={`border-l-4 ${theme.blockquoteAccent} pl-4 py-1 italic text-gray-600 my-4 rounded-r-md break-inside-avoid`} {...props} />,
    table: ({ node, ...props }: any) => (
      <div className={sizeClasses.table}>
        <table className="w-full text-left border-collapse border-y border-gray-100/40" {...props} />
      </div>
    ),
    thead: ({ node, ...props }: any) => <thead className="hidden" {...props} />,
    tr: ({ node, ...props }: any) => <tr className="border-b border-gray-100/50 last:border-0 hover:bg-slate-50/30 transition-colors" {...props} />,
    th: ({ node, ...props }: any) => <th className={sizeClasses.th} {...props} />,
    td: ({ node, ...props }: any) => (
      <td 
        className={`${sizeClasses.td} [&:first-child]:font-bold [&:first-child]:text-gray-900 [&:first-child]:whitespace-nowrap [&:first-child]:w-[110px] [&:first-child]:border-r [&:first-child]:border-gray-100/60 [&:first-child]:pr-4 [&:last-child]:pl-4`} 
        {...props} 
      />
    ),
  };
}
