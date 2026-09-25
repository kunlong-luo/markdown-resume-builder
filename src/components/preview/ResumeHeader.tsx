
import React, { useMemo } from 'react';
import { 
  Mail, MessageSquare, Phone, Globe, User, 
  Briefcase, GraduationCap, Calendar, MapPin, Clock, Award, CheckCircle2 
} from 'lucide-react';
import { parseBasicInfoMetadata, BasicInfoItem } from '../../lib/preview-utils';

interface ResumeHeaderProps {
  headerInfo: {
    name: string;
    titles: string[];
    experience: string;
    contacts: string[];
  };
  theme: any;
  lang?: 'zh' | 'en';
}

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

function parseWebUrl(value: string): URL | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const hasHttpScheme = /^https?:\/\//i.test(trimmed);
  if (!hasHttpScheme) {
    const hostCandidate = trimmed.split(/[/?#]/, 1)[0];
    if (!hostCandidate.includes('.')) return null;
  }

  try {
    const url = new URL(hasHttpScheme ? trimmed : `https://${trimmed}`);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url;
  } catch {
    return null;
  }
}

function hostnameMatches(url: URL | null, domain: string): boolean {
  if (!url) return false;
  const hostname = url.hostname.toLowerCase().replace(/\.$/, '');
  const normalizedDomain = domain.toLowerCase();
  return hostname === normalizedDomain || hostname.endsWith(`.${normalizedDomain}`);
}

export const ResumeHeader = React.memo(function ResumeHeader({ headerInfo, theme, lang = 'zh' }: ResumeHeaderProps) {
  const basicInfoItems = useMemo(() => {
    return parseBasicInfoMetadata(headerInfo.experience, lang);
  }, [headerInfo.experience, lang]);

  const renderBasicInfoIcon = (item: BasicInfoItem) => {
    switch (item.type) {
      case 'exp':
        return <Briefcase className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
      case 'degree':
        return <GraduationCap className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
      case 'age':
        return <Calendar className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
      case 'location':
        return <MapPin className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
      case 'status':
        if (item.statusType === 'available') {
          return <CheckCircle2 className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
        }
        return <Clock className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
      case 'other':
      default:
        return <Award className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
    }
  };

  return (
    <div className="border-b border-gray-200/80 pb-5 mb-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
        <div className="flex-1 min-w-0 space-y-2">
          {/* Candidate Name */}
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {headerInfo.name}
          </h1>
          
          {/* Target Job Titles / Roles (求职意向/核心职能) */}
          {headerInfo.titles.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {headerInfo.titles.map((title, idx) => (
                <span 
                  key={idx}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11.5px] font-semibold border transition-colors shadow-2xs ${theme.badgeBg}`}
                >
                  {title}
                </span>
              ))}
            </div>
          )}

          {/* Structured Basic Information Bar (个人核心基础信息条 - Zero-Pill 去药丸化排版) */}
          {basicInfoItems.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11.5px] sm:text-[12px] text-gray-650 font-medium pt-0.5">
              {basicInfoItems.map((item, idx) => (
                <React.Fragment key={item.key || idx}>
                  {idx > 0 && (
                    <span className="text-gray-300 font-light select-none -mx-1">·</span>
                  )}
                  <div className="inline-flex items-center gap-1.5 shrink-0 text-gray-750 hover:text-gray-950 transition-colors">
                    <span className="flex items-center justify-center shrink-0">
                      {renderBasicInfoIcon(item)}
                    </span>
                    <span className="tracking-tight">{item.text}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
        
        {/* Contacts - Vertically Aligned */}
        {headerInfo.contacts.length > 0 && (
          <div className="flex flex-col items-start gap-1.5 text-[11.5px] text-gray-600 font-medium sm:ml-auto sm:self-start shrink-0 min-w-0 sm:pt-1">

            {headerInfo.contacts.map((contact, idx) => {
              let icon = null;
              const contactLower = contact.toLowerCase();
              const isEmail = contact.includes('@');

              const mdLinkMatch = contact.match(/\[([^\]]*)\]\(([^)]+)\)/);
              let rawUrl = '';
              if (mdLinkMatch) {
                rawUrl = mdLinkMatch[2].trim();
              } else {
                rawUrl = contact
                  .replace(/^(?:GitHub|Gitee|LinkedIn|领英|Blog|博客|主页|Website|个人主页|代码仓库)[:：\s]*/i, '')
                  .replace(/^<|>$/g, '')
                  .trim();
              }

              const parsedUrl = parseWebUrl(rawUrl);
              const hasGithubCom = hostnameMatches(parsedUrl, 'github.com');
              const hasGiteeCom = hostnameMatches(parsedUrl, 'gitee.com');
              const hasLinkedinCom = hostnameMatches(parsedUrl, 'linkedin.com');

              const isGithubLabel = contactLower.includes('github');
              const isLinkedinLabel = contactLower.includes('linkedin') || contactLower.includes('领英');
              const isWechat = contactLower.includes('wechat') || contactLower.includes('微信') || contactLower.includes('wx');
              const digitsOnly = contact.replace(/[^\d]/g, '');
              const isPhone = !isEmail && (
                /电话|手机|tel|phone|mobile/i.test(contact) ||
                /(?:\+?86[\s-]?)?1[3-9](?:[\s-]?\d){9}/.test(contact) ||
                /\d{3,4}[\s-]?\d{7,8}/.test(contact) ||
                /^\+?[\d\s\-\(\)]{7,20}$/.test(contact.trim()) ||
                (digitsOnly.length >= 7 && digitsOnly.length <= 15)
              );
              const isUrl = !isEmail && !isPhone && Boolean(parsedUrl);
              const isAddress = !isEmail && !isPhone && !isWechat && !isGithubLabel && !isLinkedinLabel && (
                /^(?:地址|住址|常住地|现居地|现住址|籍贯|address|location)[:：\s]*/i.test(contact)
              );

              if (isEmail) {
                icon = <Mail className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
              } else if (isGithubLabel || hasGithubCom) {
                icon = <GitHubIcon className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
              } else if (isLinkedinLabel || hasLinkedinCom) {
                icon = <User className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
              } else if (isWechat) {
                icon = <MessageSquare className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
              } else if (isPhone) {
                icon = <Phone className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
              } else if (isAddress) {
                icon = <MapPin className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
              } else {
                icon = <Globe className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
              }

              let href = '';
              let displayText = contact;

              if (isEmail) {
                const cleanEmail = contact.replace(/^(?:邮箱|email|mail)[:：\s]*/i, '').trim();
                href = `mailto:${cleanEmail}`;
                displayText = cleanEmail || contact;
              } else if (isAddress) {
                displayText = contact.replace(/^(?:地址|住址|常住地|现居地|现住址|籍贯|address|location)[:：\s]*/i, '').trim() || contact;
              } else if (isPhone) {
                const cleanPhone = contact.replace(/^(?:电话|手机|手机号|手机号码|联系方式|联系电话|tel|phone|mobile)[:：\s]*/i, '').trim();
                href = `tel:${cleanPhone.replace(/[^\d+]/g, '')}`;
                displayText = cleanPhone || contact;
              } else if (isWechat) {
                const cleanWechat = contact.replace(/^(?:微信|wechat|wx)[:：\s]*/i, '').trim();
                displayText = cleanWechat || contact;
              } else if (hasLinkedinCom && parsedUrl) {
                href = parsedUrl.href;
                const handle = parsedUrl.pathname
                  .replace(/^\/(?:in\/)?/i, '')
                  .replace(/\/$/, '')
                  .trim();
                displayText = mdLinkMatch?.[1]?.trim() || (handle ? `in/${handle}` : 'LinkedIn');
              } else if (hasGithubCom && parsedUrl) {
                href = parsedUrl.href;
                const cleanHandle = parsedUrl.pathname.replace(/^\//, '').replace(/\/$/, '').trim();
                displayText = mdLinkMatch?.[1]?.trim() || cleanHandle || 'GitHub';
              } else if (isUrl && parsedUrl) {
                href = parsedUrl.href;
                if (mdLinkMatch?.[1]) {
                  displayText = mdLinkMatch[1].trim();
                } else if (hasGiteeCom) {
                  const giteeHandle = parsedUrl.pathname.replace(/^\//, '').replace(/\/$/, '').trim();
                  displayText = giteeHandle || 'Gitee';
                } else {
                  displayText = `${parsedUrl.hostname}${parsedUrl.pathname}`.replace(/\/$/, '');
                }
              }

              return (
                <div key={idx} className="flex items-center gap-2 hover:text-gray-950 transition-colors w-full sm:w-auto">
                  <span className="w-4 h-4 flex items-center justify-center shrink-0">
                    {icon}
                  </span>
                  {href ? (
                    <a 
                      href={href} 
                      target={isEmail || isPhone ? undefined : "_blank"} 
                      rel={isEmail || isPhone ? undefined : "noopener noreferrer"}
                      className="hover:underline underline-offset-2 break-all"
                    >
                      {displayText}
                    </a>
                  ) : (
                    <span className="break-all">{displayText}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

