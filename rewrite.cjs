const fs = require('fs');
let code = fs.readFileSync('src/components/FormEditor.tsx', 'utf-8');

const sIdx = code.indexOf('<div id="form-sec-basic"');
const eIdx = code.indexOf('{localModel.sections.map((sec');

if (sIdx > -1 && eIdx > -1) {
  let before = code.slice(0, sIdx);
  let after = code.slice(eIdx);
  
  let repl = `<BasicInfoEditor
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
        />\n        `;
        
  let newCode = before + repl + after;
  newCode = newCode.replace(
    "import { FormTextareaToolbar } from './FormTextareaToolbar';",
    "import { FormTextareaToolbar } from './FormTextareaToolbar';\nimport { BasicInfoEditor } from './BasicInfoEditor';"
  );
  
  // Strip out handleBasicInfoChange
  newCode = newCode.replace(/const handleBasicInfoChange[\s\S]*?handleModelChange\(updated\);\s*};/g, '');
  newCode = newCode.replace(/const handleAddTag[\s\S]*?setTagInput\(''\);\s*};/g, '');
  newCode = newCode.replace(/const handleRemoveTag[\s\S]*?handleBasicInfoChange\('subtitle', newTags.join\(' ｜ '\)\);\s*};/g, '');
  newCode = newCode.replace(/const \[tagInput, setTagInput\] = useState\(''\);/g, '');
  
  fs.writeFileSync('src/components/FormEditor.tsx', newCode);
  console.log("Success");
} else {
  console.log("Failed", sIdx, eIdx);
}
