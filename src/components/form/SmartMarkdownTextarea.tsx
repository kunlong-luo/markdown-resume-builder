import React, { useRef, useEffect } from 'react';

interface SmartMarkdownTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  minRows?: number;
}

export function SmartMarkdownTextarea({
  value,
  onChange,
  minRows = 3,
  className = '',
  id,
  placeholder,
  ...rest
}: SmartMarkdownTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand height to fit content smoothly without jarring scrollbars
  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const computedLineHeight = 20;
    const minHeight = minRows * computedLineHeight + 20;
    const targetHeight = Math.max(el.scrollHeight, minHeight);
    el.style.height = `${targetHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const { selectionStart, selectionEnd } = target;

    // Handle Tab key: Indent (2 spaces) or Outdent with Shift
    if (e.key === 'Tab') {
      e.preventDefault();
      const before = value.substring(0, selectionStart);
      const after = value.substring(selectionEnd);
      const indent = '  ';

      if (e.shiftKey) {
        // Outdent: remove up to 2 leading spaces before cursor
        if (before.endsWith('  ')) {
          const newText = before.slice(0, -2) + after;
          onChange(newText);
          requestAnimationFrame(() => {
            target.selectionStart = target.selectionEnd = selectionStart - 2;
          });
        }
      } else {
        // Indent
        const newText = before + indent + after;
        onChange(newText);
        requestAnimationFrame(() => {
          target.selectionStart = target.selectionEnd = selectionStart + 2;
        });
      }
      return;
    }

    // Handle Enter key: Smart bullet list & numbered list continuation
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      const textBeforeCursor = value.substring(0, selectionStart);
      const currentLineStart = textBeforeCursor.lastIndexOf('\n') + 1;
      const currentLine = textBeforeCursor.substring(currentLineStart);

      // Unordered list prefix: "- ", "* ", or indented "  - "
      const bulletMatch = currentLine.match(/^(\s*)([-*])\s+/);
      // Ordered list prefix: "1. ", "2. ", or indented "  1. "
      const numMatch = currentLine.match(/^(\s*)(\d+)\.\s+/);

      if (bulletMatch) {
        const fullBullet = bulletMatch[0];
        const contentAfterBullet = currentLine.substring(fullBullet.length).trim();

        // If line contains ONLY the bullet symbol, user pressed Enter to exit list
        if (contentAfterBullet === '') {
          e.preventDefault();
          const beforeLine = value.substring(0, currentLineStart);
          const afterCursor = value.substring(selectionEnd);
          const newText = beforeLine + afterCursor;
          onChange(newText);
          requestAnimationFrame(() => {
            target.selectionStart = target.selectionEnd = currentLineStart;
          });
          return;
        }

        // Auto-insert next bullet item
        e.preventDefault();
        const insertText = '\n' + fullBullet;
        const newText = value.substring(0, selectionStart) + insertText + value.substring(selectionEnd);
        onChange(newText);
        requestAnimationFrame(() => {
          const newPos = selectionStart + insertText.length;
          target.selectionStart = target.selectionEnd = newPos;
        });
        return;
      }

      if (numMatch) {
        const indent = numMatch[1];
        const num = parseInt(numMatch[2], 10);
        const fullNumPrefix = numMatch[0];
        const contentAfter = currentLine.substring(fullNumPrefix.length).trim();

        // If line contains ONLY the number prefix, exit ordered list
        if (contentAfter === '') {
          e.preventDefault();
          const beforeLine = value.substring(0, currentLineStart);
          const afterCursor = value.substring(selectionEnd);
          const newText = beforeLine + afterCursor;
          onChange(newText);
          requestAnimationFrame(() => {
            target.selectionStart = target.selectionEnd = currentLineStart;
          });
          return;
        }

        // Auto-increment numbered list
        e.preventDefault();
        const nextNum = num + 1;
        const insertText = `\n${indent}${nextNum}. `;
        const newText = value.substring(0, selectionStart) + insertText + value.substring(selectionEnd);
        onChange(newText);
        requestAnimationFrame(() => {
          const newPos = selectionStart + insertText.length;
          target.selectionStart = target.selectionEnd = newPos;
        });
        return;
      }
    }
  };

  return (
    <textarea
      ref={textareaRef}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      rows={minRows}
      placeholder={placeholder}
      className={`resize-none overflow-hidden transition-[height] duration-75 ${className}`}
      {...rest}
    />
  );
}
