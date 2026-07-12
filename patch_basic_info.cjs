const fs = require('fs');
const content = fs.readFileSync('src/components/FormEditor.tsx', 'utf-8');

// The block to replace
const startMarker = '<div id="form-sec-basic"';
// The end marker is right before localModel.sections.map
const endMarker = '      {localModel.sections.map((sec, secIndex) => {';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const before = content.slice(0, startIndex);
  const after = content.slice(endIndex);
  
  const replacement = `
      <BasicInfoEditor
        model={localModel}
        onChange={(newModel) => handleModelChange(newModel)}
        expanded={expandedSections['basic'] !== false}
        onToggleExpanded={() => {
          setExpandedSections(prev => ({
            ...prev,
            basic: prev['basic'] === false ? true : false
          }));
        }}
        showOptional={showOptionalBasic}
        onToggleOptional={() => setShowOptionalBasic(!showOptionalBasic)}
      />
      
`;
        
  // Note: we also need to add the import for BasicInfoEditor at the top
  const newContent = before + replacement + after;
  
  const finalContent = newContent.replace(
    "import { FormTextareaToolbar } from './FormTextareaToolbar';", 
    "import { FormTextareaToolbar } from './FormTextareaToolbar';\nimport { BasicInfoEditor } from './BasicInfoEditor';"
  );
  
  // also need to remove the unused handleBasicInfoChange, handleAddTag, handleRemoveTag from FormEditor
  // Let's just remove them cleanly
  const modifiedContent = finalContent
    .replace(/const handleBasicInfoChange = \([\s\S]*?handleModelChange\(updated\);\s*};\s*/, '')
    .replace(/const handleAddTag = \([\s\S]*?setTagInput\(''\);\s*};\s*/, '')
    .replace(/const handleRemoveTag = \([\s\S]*?handleBasicInfoChange\('subtitle', newTags\.join\(' ｜ '\)\);\s*};\s*/, '')
    .replace(/const \[tagInput, setTagInput\] = useState\(''\);\s*/, '');

  fs.writeFileSync('src/components/FormEditor.tsx', modifiedContent);
  console.log("Successfully replaced BasicInfoEditor in FormEditor.tsx");
} else {
  console.log("Failed to find markers", startIndex, endIndex);
}
