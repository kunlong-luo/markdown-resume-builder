
import React from 'react';
import { Mail, Code, MessageSquare, Phone, Globe, User } from 'lucide-react';

interface ResumeHeaderProps {
  headerInfo: {
    name: string;
    titles: string[];
    experience: string;
    contacts: string[];
  };
  theme: any;
}

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export function ResumeHeader({ headerInfo, theme }: ResumeHeaderProps) {
  return (
    <div className="border-b border-gray-200/80 pb-5 mb-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2.5">
            {headerInfo.name}
          </h1>
          
          {/* Titles badges */}
          {headerInfo.titles.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              {headerInfo.titles.map((title, idx) => (
                <span 
                  key={idx}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold border transition-colors ${theme.badgeBg}`}
                >
                  {title}
                </span>
              ))}
              {headerInfo.experience && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-600 border border-gray-200/50">
                  {headerInfo.experience}
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Contacts */}
        {headerInfo.contacts.length > 0 && (
          <div className="flex flex-col sm:items-end gap-1.5 text-[11.5px] text-gray-600 font-medium">
            {headerInfo.contacts.map((contact, idx) => {
              let icon = null;
              const contactLower = contact.toLowerCase();
              const isEmail = contact.includes('@');
              const isGithub = contactLower.includes('github');
              const isLinkedin = contactLower.includes('linkedin') || contactLower.includes('领英');
              const isWechat = contactLower.includes('wechat') || contactLower.includes('微信') || contactLower.includes('wx');
              const isPhone = /^\d{11}/.test(contact) || contact.includes('1') && contact.length >= 11;
              const isUrl = contactLower.includes('http') || contactLower.includes('.com') || contactLower.includes('.org') || contactLower.includes('.net');
              
              if (isEmail) {
                icon = <Mail className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
              } else if (isGithub) {
                icon = <GitHubIcon className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
              } else if (isLinkedin) {
                icon = <User className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
              } else if (isWechat) {
                icon = <MessageSquare className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
              } else if (isPhone) {
                icon = <Phone className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
              } else if (isUrl) {
                icon = <Globe className={`w-3.5 h-3.5 ${theme.iconColor}`} />;
              } else {
                icon = <div className={`w-1.5 h-1.5 rounded-full ${theme.iconColor}`} />;
              }
              
              return (
                <div key={idx} className="flex items-center gap-1.5 hover:text-gray-950 transition-colors">
                  {icon}
                  <span>{contact}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
