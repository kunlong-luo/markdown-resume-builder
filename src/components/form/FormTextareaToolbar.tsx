import React from 'react';
import { Heading1, Heading2, Bold, Italic, List, ListOrdered, Link, Table, Type, Scissors } from 'lucide-react';
import { formatChineseEnglishSpacing } from '../../lib/format-utils';

interface FormTextareaToolbarProps {
  textareaId: string;
  value: string;
  onChange: (newValue: string) => void;
}

export function FormTextareaToolbar({ textareaId, value, onChange }: FormTextareaToolbarProps) {
  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    let replacement = syntax;
    if (start !== end) {
      const selected = text.substring(start, end);
      if (syntax.includes('text')) {
        replacement = syntax.replace('text', selected);
      } else {
        replacement = syntax + selected;
      }
    }

    onChange(before + replacement + after);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  return (
    <div className="flex items-center flex-wrap gap-1 px-3 py-1.5 bg-slate-100/90 border border-slate-200 rounded-t-lg select-none">
      <button
        type="button"
        onClick={() => insertMarkdown('# text')}
        className="p-1 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded transition-colors text-[10px] font-semibold flex items-center gap-0.5 cursor-pointer"
        title="插入大标题 H1"
      >
        <Heading1 className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => insertMarkdown('## text')}
        className="p-1 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded transition-colors text-[10px] font-semibold flex items-center gap-0.5 cursor-pointer"
        title="插入中标题 H2"
      >
        <Heading2 className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-3.5 bg-slate-300 mx-1"></div>
      <button
        type="button"
        onClick={() => insertMarkdown('**text**')}
        className="p-1 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded transition-colors cursor-pointer"
        title="加粗 **text**"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => insertMarkdown('*text*')}
        className="p-1 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded transition-colors cursor-pointer"
        title="斜体 *text*"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-3.5 bg-slate-300 mx-1"></div>
      <button
        type="button"
        onClick={() => {
          const currentTextarea = document.getElementById(textareaId) as HTMLTextAreaElement;
          const startsWithNewLine = !currentTextarea || currentTextarea.selectionStart === 0 || currentTextarea.value[currentTextarea.selectionStart - 1] === '\n';
          insertMarkdown(startsWithNewLine ? '- text' : '\n- text');
        }}
        className="p-1 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded transition-colors cursor-pointer"
        title="无序列表项 - text"
      >
        <List className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => {
          const currentTextarea = document.getElementById(textareaId) as HTMLTextAreaElement;
          const startsWithNewLine = !currentTextarea || currentTextarea.selectionStart === 0 || currentTextarea.value[currentTextarea.selectionStart - 1] === '\n';
          insertMarkdown(startsWithNewLine ? '1. text' : '\n1. text');
        }}
        className="p-1 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded transition-colors cursor-pointer"
        title="有序列表项 1. text"
      >
        <ListOrdered className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => insertMarkdown('[text](url)')}
        className="p-1 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded transition-colors cursor-pointer"
        title="超链接 [text](url)"
      >
        <Link className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => insertMarkdown('\n| 表头1 | 表头2 |\n| ----- | ----- |\n| 内容1 | 内容2 |\n')}
        className="p-1 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded transition-colors cursor-pointer"
        title="插入表格 | 表头1 | 表头2 |"
      >
        <Table className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => insertMarkdown('\n<!-- pagebreak -->\n')}
        className="p-1 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded transition-colors cursor-pointer"
        title="插入强制分页符 <!-- pagebreak -->"
      >
        <Scissors className="w-3.5 h-3.5 text-amber-600" />
      </button>
      <div className="w-px h-3.5 bg-slate-300 mx-1"></div>
      <button
        type="button"
        onClick={() => {
          const formatted = formatChineseEnglishSpacing(value);
          onChange(formatted);
        }}
        className="px-2 py-0.5 hover:bg-indigo-100 hover:text-indigo-800 text-indigo-600 rounded transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1"
        title="一键优化该输入框内的中英文与数字空格排版"
      >
        <Type className="w-3 h-3" />
        <span>中英排版</span>
      </button>
    </div>
  );
}
