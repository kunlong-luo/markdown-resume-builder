const fs = require('fs');

let content = fs.readFileSync('src/components/FormEditor.tsx', 'utf-8');

const lines = content.split('\n');

// Find start line
const startLineIdx = lines.findIndex(line => line.includes('// --- Types ---'));
// Find end line
const endLineIdx = lines.findIndex(line => line.includes('// --- Component ---'));

if (startLineIdx !== -1 && endLineIdx !== -1) {
  const newImports = `import { FormItem, FormSection, ResumeFormModel } from '../lib/form-types';
import { parseMarkdownToForm, parseFormToMarkdown, getSectionCategory } from '../lib/markdown-parser';
import { FormTextareaToolbar } from './FormTextareaToolbar';

interface FormEditorProps {
  value: string;
  onChange: (value: string, immediate?: boolean) => void;
}
`;

  const before = lines.slice(0, startLineIdx).join('\n');
  const after = lines.slice(endLineIdx + 1).join('\n');
  
  fs.writeFileSync('src/components/FormEditor.tsx', before + '\n' + newImports + '\n' + after);
  console.log('Successfully updated FormEditor.tsx');
} else {
  console.log('Could not find start or end index:', startLineIdx, endLineIdx);
}
