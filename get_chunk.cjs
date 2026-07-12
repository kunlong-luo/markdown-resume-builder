const fs = require('fs');
const content = fs.readFileSync('src/components/FormEditor.tsx', 'utf-8');
const startIndex = content.indexOf('  const handleBasicInfoChange = ');
const endIndex = content.indexOf('  const handleSectionTitleChange = ');
console.log(content.slice(startIndex, endIndex));
