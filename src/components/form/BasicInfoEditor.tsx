import React, { useState } from 'react';
import { User, Phone, Mail, Link, Layers, ChevronDown, ChevronUp, X, Code, Globe, Calendar, GraduationCap, Briefcase, MapPin, Activity } from 'lucide-react';
import { ResumeFormModel } from '../../lib/form-types';

interface BasicInfoEditorProps {
  model: ResumeFormModel;
  onChange: (model: ResumeFormModel) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
  showOptional: boolean;
  onToggleOptional: () => void;
  lang?: 'zh' | 'en';
}

const TRANSLATIONS = {
  zh: {
    basicInfo: '基本信息',
    basicDesc: '姓名、联系方式与个人标签',
    pinnedTop: '固定置顶',
    nameLabel: '姓名 (必填)',
    namePlaceholder: '例如：张三',
    phoneLabel: '手机号码 (必填)',
    phonePlaceholder: '例如：138 0000 0000',
    emailLabel: '电子邮箱 (必填)',
    emailPlaceholder: '例如：zhangsan@example.com',
    targetJobLabel: '求职意向 / 个人标签',
    tagPlaceholder: '输入标签后按回车添加',
    addBtn: '添加',
    socialLabel: '社交链接 (可选)',
    socialPlaceholder: '例如：GitHub: github.com/username ｜ Blog: blog.example.com',
    expLabel: '工作经验年限 (可选)',
    degreeLabel: '最高学历 (可选)',
    ageLabel: '年龄 / 出生年份 (可选)',
    agePlaceholder: '例如：28岁 或 1998年10月',
    cityLabel: '现居 / 意向城市 (可选)',
    cityPlaceholder: '例如：深圳',
    statusLabel: '求职状态 (可选)',
    customBtn: '自定义',
    presetBtn: '选择预设',
    addMoreBtn: '+ 添加社交链接、城市信息等可选字段',
    collapseBtn: '收起可选字段',
    customManual: '自定义手动输入...',
    schoolText: '硕士 或 本科',
  },
  en: {
    basicInfo: 'Basic Info',
    basicDesc: 'Name, contact info, and tags',
    pinnedTop: 'Pinned Top',
    nameLabel: 'Full Name (Required)',
    namePlaceholder: 'e.g., John Doe',
    phoneLabel: 'Phone Number (Required)',
    phonePlaceholder: 'e.g., +1 (123) 456-7890',
    emailLabel: 'Email Address (Required)',
    emailPlaceholder: 'e.g., john.doe@email.com',
    targetJobLabel: 'Job Target / Profile Tags',
    tagPlaceholder: 'Press Enter to add tag',
    addBtn: 'Add',
    socialLabel: 'Social Link / Website (Optional)',
    socialPlaceholder: 'e.g., GitHub: github.com/username ｜ Blog: blog.example.com',
    expLabel: 'Work Experience (Optional)',
    degreeLabel: 'Highest Degree (Optional)',
    ageLabel: 'Age / Birth Year (Optional)',
    agePlaceholder: 'e.g., 25 years old or 1999',
    cityLabel: 'Location / City (Optional)',
    cityPlaceholder: 'e.g., New York, NY',
    statusLabel: 'Job Search Status (Optional)',
    customBtn: 'Custom',
    presetBtn: 'Preset',
    addMoreBtn: '+ Add social, city, and other optional fields',
    collapseBtn: 'Hide optional fields',
    customManual: 'Enter custom value...',
    schoolText: 'e.g., Master or Bachelor',
  }
};

const getWorkYearsOptions = (l: 'zh' | 'en') => [
  { value: '', label: l === 'en' ? 'Hide / Not selected' : '不显示 / 未选择' },
  { value: '在校生/应届生', label: l === 'en' ? 'Student / New Graduate' : '在校生 / 应届生' },
  { value: '1年工作经验', label: l === 'en' ? '1 Year Experience' : '1年工作经验' },
  { value: '2年工作经验', label: l === 'en' ? '2 Years Experience' : '2年工作经验' },
  { value: '3年工作经验', label: l === 'en' ? '3 Years Experience' : '3年工作经验' },
  { value: '4年工作经验', label: l === 'en' ? '4 Years Experience' : '4年工作经验' },
  { value: '5年工作经验', label: l === 'en' ? '5 Years Experience' : '5年工作经验' },
  { value: '6年工作经验', label: l === 'en' ? '6 Years Experience' : '6年工作经验' },
  { value: '7年工作经验', label: l === 'en' ? '7 Years Experience' : '7年工作经验' },
  { value: '8年工作经验', label: l === 'en' ? '8 Years Experience' : '8年工作经验' },
  { value: '9年工作经验', label: l === 'en' ? '9 Years Experience' : '9年工作经验' },
  { value: '10年以上工作经验', label: l === 'en' ? '10+ Years Experience' : '10年以上工作经验' },
];

const getDegreeOptions = (l: 'zh' | 'en') => [
  { value: '', label: l === 'en' ? 'Hide / Not selected' : '不显示 / 未选择' },
  { value: '大专', label: l === 'en' ? 'Associate' : '大专' },
  { value: '本科', label: l === 'en' ? 'Bachelor' : '本科' },
  { value: '硕士', label: l === 'en' ? 'Master' : '硕士' },
  { value: '博士', label: l === 'en' ? 'PhD' : '博士' },
];

const getJobStatusOptions = (l: 'zh' | 'en') => [
  { value: '', label: l === 'en' ? 'Hide / Not selected' : '不显示 / 未选择' },
  { value: '在职-随时到岗', label: l === 'en' ? 'Employed - Immediate' : '在职 - 随时到岗' },
  { value: '在职-考虑机会', label: l === 'en' ? 'Employed - Open to Offers' : '在职 - 考虑机会' },
  { value: '在职-暂不考虑', label: l === 'en' ? 'Employed - Not Looking' : '在职 - 暂不考虑' },
  { value: '离职-随时到岗', label: l === 'en' ? 'Unemployed - Immediate' : '离职 - 随时到岗' },
  { value: '在校生-寻实习', label: l === 'en' ? 'Student - Looking for Internship' : '在校生 - 寻实习' },
];

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export function BasicInfoEditor({ model, onChange, expanded, onToggleExpanded, showOptional, onToggleOptional, lang = 'zh' }: BasicInfoEditorProps) {
  const [tagInput, setTagInput] = useState('');
  
  const activeLang = lang === 'en' ? 'en' : 'zh';
  const t = TRANSLATIONS[activeLang];
  const workYearsOptions = getWorkYearsOptions(activeLang);
  const degreeOptions = getDegreeOptions(activeLang);
  const jobStatusOptions = getJobStatusOptions(activeLang);

  const [customWorkYears, setCustomWorkYears] = useState(() => {
    return !!model.workYears && !getWorkYearsOptions(lang === 'en' ? 'en' : 'zh').some(o => o.value === model.workYears);
  });
  const [customDegree, setCustomDegree] = useState(() => {
    return !!model.degree && !getDegreeOptions(lang === 'en' ? 'en' : 'zh').some(o => o.value === model.degree);
  });
  const [customJobStatus, setCustomJobStatus] = useState(() => {
    return !!model.jobStatus && !getJobStatusOptions(lang === 'en' ? 'en' : 'zh').some(o => o.value === model.jobStatus);
  });

  React.useEffect(() => {
    const l = lang === 'en' ? 'en' : 'zh';
    if (model.workYears && !getWorkYearsOptions(l).some(o => o.value === model.workYears)) {
      setCustomWorkYears(true);
    }
    if (model.degree && !getDegreeOptions(l).some(o => o.value === model.degree)) {
      setCustomDegree(true);
    }
    if (model.jobStatus && !getJobStatusOptions(l).some(o => o.value === model.jobStatus)) {
      setCustomJobStatus(true);
    }
  }, [model.workYears, model.degree, model.jobStatus, lang]);
  
  const handleBasicInfoChange = (field: keyof Omit<ResumeFormModel, 'sections'>, newVal: string) => {
    onChange({
      ...model,
      [field]: newVal
    });
  };

  const handleStructuredFieldChange = (field: 'workYears' | 'degree' | 'age' | 'city' | 'jobStatus', value: string) => {
    const updatedModel = {
      ...model,
      [field]: value
    };
    
    // Compute consolidated experience string
    const parts: string[] = [];
    if (updatedModel.workYears?.trim()) parts.push(updatedModel.workYears.trim());
    if (updatedModel.degree?.trim()) parts.push(updatedModel.degree.trim());
    if (updatedModel.age?.trim()) parts.push(updatedModel.age.trim());
    if (updatedModel.city?.trim()) parts.push(updatedModel.city.trim());
    if (updatedModel.jobStatus?.trim()) parts.push(updatedModel.jobStatus.trim());
    
    updatedModel.experience = parts.join(' ｜ ');
    
    onChange(updatedModel);
  };

  const handleAddTag = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    
    const tags = model.subtitle ? model.subtitle.split(/[｜|]/).map(t => t.trim()).filter(Boolean) : [];
    if (tags.includes(trimmed)) {
      setTagInput('');
      return;
    }
    
    const newTags = [...tags, trimmed];
    handleBasicInfoChange('subtitle', newTags.join(' ｜ '));
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const tags = model.subtitle ? model.subtitle.split(/[｜|]/).map(t => t.trim()).filter(Boolean) : [];
    const newTags = tags.filter(t => t !== tagToRemove);
    handleBasicInfoChange('subtitle', newTags.join(' ｜ '));
  };

  const tags = model.subtitle ? model.subtitle.split(/[｜|]/).map(t => t.trim()).filter(Boolean) : [];

  return (
    <div 
      id="form-sec-basic" 
      className={`rounded-xl overflow-hidden scroll-mt-20 transition-all duration-300 ${
        expanded 
          ? 'tactile-card shadow-[0_16px_36px_rgba(30,41,59,0.06),0_3px_10px_rgba(30,41,59,0.03)] border-indigo-200/50 scale-[1.002] ring-1 ring-indigo-50/50 mb-5' 
          : 'bg-slate-50/60 border border-slate-200/50 shadow-[0_2px_6px_rgba(30,41,59,0.015)] opacity-85 hover:opacity-100 scale-[0.995] hover:scale-100 mb-3'
      }`}
    >
      <div 
        className={`flex items-center justify-between p-4 bg-gradient-to-r cursor-pointer transition-colors ${
          expanded 
            ? 'from-indigo-50/40 to-slate-50 border-b border-indigo-100/40 hover:from-indigo-50/60 hover:to-slate-100/60' 
            : 'from-slate-50/80 to-slate-100/30 border-b border-slate-200/40 hover:from-slate-100/60 hover:to-slate-100/90'
        }`}
        onClick={onToggleExpanded}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{t.basicInfo}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{t.basicDesc}</p>
          </div>
        </div>
        <div className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>
      
      {expanded && (
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{t.nameLabel}</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400"><User className="w-4 h-4" /></span>
                <input 
                  type="text" 
                  value={model.name || ''}
                  onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm font-semibold tactile-input"
                  placeholder={t.namePlaceholder}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{t.phoneLabel}</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400"><Phone className="w-4 h-4" /></span>
                <input 
                  type="text" 
                  value={model.phone || ''}
                  onChange={(e) => handleBasicInfoChange('phone', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm tactile-input font-mono"
                  placeholder={t.phonePlaceholder}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{t.emailLabel}</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400"><Mail className="w-4 h-4" /></span>
                <input 
                  type="email" 
                  value={model.email || ''}
                  onChange={(e) => handleBasicInfoChange('email', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm tactile-input font-mono"
                  placeholder={t.emailPlaceholder}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{t.targetJobLabel}</label>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-50/75 text-blue-700 border border-blue-100/80 rounded-md shadow-sm group"
                    >
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)}
                        className="text-blue-400 hover:text-blue-700 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-slate-400"><Layers className="w-4 h-4" /></span>
                  <input 
                    type="text" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="w-full pl-9 pr-3 py-2 text-sm tactile-input"
                    placeholder={t.tagPlaceholder}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddTag()}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg transition-all border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.02),inset_0_1.5px_2px_rgba(255,255,255,0.95)] cursor-pointer active:translate-y-px"
                >
                  {t.addBtn}
                </button>
              </div>
            </div>
            
            {showOptional && (
              <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100 mt-2">
                <div className="space-y-2">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{t.socialLabel}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">
                      {(() => {
                        const tLower = (model.social || '').toLowerCase();
                        if (tLower.includes('github')) return <GitHubIcon className="w-4 h-4" />;
                        if (tLower.includes('blog') || tLower.includes('web') || tLower.includes('http')) return <Globe className="w-4 h-4" />;
                        return <Link className="w-4 h-4" />;
                      })()}
                    </span>
                    <input 
                      type="text" 
                      value={model.social || ''}
                      onChange={(e) => handleBasicInfoChange('social', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm tactile-input font-mono"
                      placeholder={t.socialPlaceholder}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 工作经验年限 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.expLabel}</label>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomWorkYears(!customWorkYears);
                          if (customWorkYears) {
                            handleStructuredFieldChange('workYears', '');
                          }
                        }}
                        className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer transition-colors"
                      >
                        {customWorkYears ? t.presetBtn : t.customBtn}
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400"><Briefcase className="w-4 h-4" /></span>
                      {customWorkYears ? (
                        <input 
                          type="text" 
                          value={model.workYears || ''}
                          onChange={(e) => handleStructuredFieldChange('workYears', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm tactile-input"
                          placeholder={t.expLabel}
                        />
                      ) : (
                        <div className="relative">
                          <select
                             value={model.workYears || ''}
                             onChange={(e) => {
                               if (e.target.value === '__custom__') {
                                 setCustomWorkYears(true);
                               } else {
                                 handleStructuredFieldChange('workYears', e.target.value);
                               }
                             }}
                             className="w-full pl-9 pr-8 py-2 text-sm tactile-input appearance-none cursor-pointer"
                           >
                            {workYearsOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                            <option value="__custom__">{t.customManual}</option>
                          </select>
                          <span className="absolute right-3 top-3 pointer-events-none text-slate-400">
                            <ChevronDown className="w-4 h-4" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 最高学历 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.degreeLabel}</label>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomDegree(!customDegree);
                          if (customDegree) {
                            handleStructuredFieldChange('degree', '');
                          }
                        }}
                        className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer transition-colors"
                      >
                        {customDegree ? t.presetBtn : t.customBtn}
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400"><GraduationCap className="w-4 h-4" /></span>
                      {customDegree ? (
                        <input 
                          type="text" 
                          value={model.degree || ''}
                          onChange={(e) => handleStructuredFieldChange('degree', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm tactile-input"
                          placeholder={t.schoolText}
                        />
                      ) : (
                        <div className="relative">
                          <select
                            value={model.degree || ''}
                            onChange={(e) => {
                              if (e.target.value === '__custom__') {
                                setCustomDegree(true);
                              } else {
                                handleStructuredFieldChange('degree', e.target.value);
                              }
                            }}
                            className="w-full pl-9 pr-8 py-2 text-sm tactile-input appearance-none cursor-pointer"
                          >
                            {degreeOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                            <option value="__custom__">{t.customManual}</option>
                          </select>
                          <span className="absolute right-3 top-3 pointer-events-none text-slate-400">
                            <ChevronDown className="w-4 h-4" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 年龄 / 出生年份 */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{t.ageLabel}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400"><Calendar className="w-4 h-4" /></span>
                      <input 
                        type="text" 
                        value={model.age || ''}
                        onChange={(e) => handleStructuredFieldChange('age', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm tactile-input"
                        placeholder={t.agePlaceholder}
                      />
                    </div>
                  </div>

                  {/* 现居 / 意向城市 */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{t.cityLabel}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400"><MapPin className="w-4 h-4" /></span>
                      <input 
                        type="text" 
                        value={model.city || ''}
                        onChange={(e) => handleStructuredFieldChange('city', e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm tactile-input"
                        placeholder={t.cityPlaceholder}
                      />
                    </div>
                  </div>

                  {/* 求职状态 */}
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t.statusLabel}</label>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomJobStatus(!customJobStatus);
                          if (customJobStatus) {
                            handleStructuredFieldChange('jobStatus', '');
                          }
                        }}
                        className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer transition-colors"
                      >
                        {customJobStatus ? t.presetBtn : t.customBtn}
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400"><Activity className="w-4 h-4" /></span>
                      {customJobStatus ? (
                        <input 
                          type="text" 
                          value={model.jobStatus || ''}
                          onChange={(e) => handleStructuredFieldChange('jobStatus', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm tactile-input"
                          placeholder={t.statusLabel}
                        />
                      ) : (
                        <div className="relative">
                          <select
                            value={model.jobStatus || ''}
                            onChange={(e) => {
                              if (e.target.value === '__custom__') {
                                setCustomJobStatus(true);
                              } else {
                                handleStructuredFieldChange('jobStatus', e.target.value);
                              }
                            }}
                            className="w-full pl-9 pr-8 py-2 text-sm tactile-input appearance-none cursor-pointer"
                          >
                            {jobStatusOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                            <option value="__custom__">{t.customManual}</option>
                          </select>
                          <span className="absolute right-3 top-3 pointer-events-none text-slate-400">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!showOptional && (
              <div className="md:col-span-2 pt-2">
                <button
                  type="button"
                  onClick={onToggleOptional}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
                >
                  {t.addMoreBtn}
                </button>
              </div>
            )}
            
            {showOptional && (
              <div className="md:col-span-2 text-right">
                <button
                  type="button"
                  onClick={onToggleOptional}
                  className="text-xs text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
                >
                  {t.collapseBtn}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
