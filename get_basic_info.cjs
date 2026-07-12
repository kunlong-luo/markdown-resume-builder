const fs = require('fs');
const content = fs.readFileSync('src/components/FormEditor.tsx', 'utf-8');
const startIndex = content.indexOf('<div id="form-sec-basic"');
const endIndex = content.indexOf('          {localModel.sections.map((sec, secIdx) => (');
console.log(content.slice(startIndex, endIndex));
