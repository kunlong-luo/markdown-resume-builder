export interface SelectOptionItem {
  value: string;
  label: string;
}

export const getDegreeOptions = (lang: 'zh' | 'en' = 'zh'): SelectOptionItem[] => [
  { value: '', label: '' },
  { value: '大专', label: lang === 'en' ? 'Associate' : '大专' },
  { value: '本科', label: lang === 'en' ? 'Bachelor' : '本科' },
  { value: '硕士', label: lang === 'en' ? 'Master' : '硕士' },
  { value: '博士', label: lang === 'en' ? 'PhD' : '博士' },
];

export const getJobStatusOptions = (lang: 'zh' | 'en' = 'zh'): SelectOptionItem[] => [
  { value: '', label: '' },
  { value: '在职-随时到岗', label: lang === 'en' ? 'Employed - Immediate' : '在职 - 随时到岗' },
  { value: '在职-考虑机会', label: lang === 'en' ? 'Employed - Open to Offers' : '在职 - 考虑机会' },
  { value: '在职-暂不考虑', label: lang === 'en' ? 'Employed - Not Looking' : '在职 - 暂不考虑' },
  { value: '离职-随时到岗', label: lang === 'en' ? 'Unemployed - Immediate' : '离职 - 随时到岗' },
  { value: '在校-寻找实习', label: lang === 'en' ? 'Student - Looking for Internship' : '在校 - 寻找实习' },
];

export const getPopularCities = (lang: 'zh' | 'en' = 'zh'): string[] => {
  return lang === 'en'
    ? ['Remote', 'San Francisco', 'New York', 'Seattle', 'London', 'Singapore']
    : ['北京', '上海', '深圳', '杭州', '广州', '成都', '远程'];
};
