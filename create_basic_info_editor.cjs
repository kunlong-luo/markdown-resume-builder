const fs = require('fs');

const content = `import React, { useState } from 'react';
import { User, Phone, Mail, Link, Layers, ChevronDown, ChevronUp, X } from 'lucide-react';
import { ResumeFormModel } from '../lib/form-types';

interface BasicInfoEditorProps {
  model: ResumeFormModel;
  onChange: (model: ResumeFormModel) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
  showOptional: boolean;
  onToggleOptional: () => void;
}

export function BasicInfoEditor({ model, onChange, expanded, onToggleExpanded, showOptional, onToggleOptional }: BasicInfoEditorProps) {
  const [tagInput, setTagInput] = useState('');
  
  const handleBasicInfoChange = (field: keyof Omit<ResumeFormModel, 'sections'>, newVal: string) => {
    onChange({
      ...model,
      [field]: newVal
    });
  };

  const handleAddTag = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    
    const tags = model.subtitle ? model.subtitle.split('｜').map(t => t.trim()).filter(Boolean) : [];
    if (tags.includes(trimmed)) {
      setTagInput('');
      return;
    }
    
    const newTags = [...tags, trimmed];
    handleBasicInfoChange('subtitle', newTags.join(' ｜ '));
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const tags = model.subtitle ? model.subtitle.split('｜').map(t => t.trim()).filter(Boolean) : [];
    const newTags = tags.filter(t => t !== tagToRemove);
    handleBasicInfoChange('subtitle', newTags.join(' ｜ '));
  };

  const tags = model.subtitle ? model.subtitle.split('｜').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div id="form-sec-basic" className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden scroll-mt-20">
      <div 
        className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={onToggleExpanded}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">基本信息</h3>
            <p className="text-xs text-slate-500 mt-0.5">姓名、联系方式与个人标签</p>
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
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">姓名 (必填)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400"><User className="w-4 h-4" /></span>
                <input 
                  type="text" 
                  value={model.name || ''}
                  onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm font-semibold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="例如：张三"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">手机号码 (必填)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400"><Phone className="w-4 h-4" /></span>
                <input 
                  type="text" 
                  value={model.phone || ''}
                  onChange={(e) => handleBasicInfoChange('phone', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  placeholder="例如：138 0000 0000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">电子邮箱 (必填)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400"><Mail className="w-4 h-4" /></span>
                <input 
                  type="email" 
                  value={model.email || ''}
                  onChange={(e) => handleBasicInfoChange('email', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  placeholder="例如：zhangsan@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">求职意向 / 个人标签</label>
              
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
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="输入标签后按回车添加"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddTag()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors border border-slate-200 cursor-pointer"
                >
                  添加
                </button>
              </div>
            </div>
            
            {showOptional && (
              <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100 mt-2">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">社交链接 (可选)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400"><Link className="w-4 h-4" /></span>
                    <input 
                      type="text" 
                      value={model.social || ''}
                      onChange={(e) => handleBasicInfoChange('social', e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                      placeholder="例如：GitHub: github.com/username ｜ Blog: blog.example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">工作经验 / 城市信息 (可选)</label>
                  <input 
                    type="text" 
                    value={model.experience || ''}
                    onChange={(e) => handleBasicInfoChange('experience', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="例如：5年工作经验 ｜ 深圳"
                  />
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
                  + 添加社交链接、城市信息等可选字段
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
                  收起可选字段
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('src/components/BasicInfoEditor.tsx', content);
