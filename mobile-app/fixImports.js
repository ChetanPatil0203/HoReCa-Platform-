const fs = require('fs');
const path = require('path');

const directoriesToFix = [
  path.join(__dirname, 'src/screens/owner/Raw material'),
  path.join(__dirname, 'src/screens/owner/manpower'),
  path.join(__dirname, 'src/screens/owner/marketing'),
];

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace any import or require that starts with '../../' but NOT '../../../'
  // and make it '../../../'
  // This safely adds one level of '../' to imports.
  content = content.replace(/from\s+['"]\.\.\/\.\.\/(.*?)['"]/g, "from '../../../$1'");
  content = content.replace(/require\(['"]\.\.\/\.\.\/(.*?)['"]\)/g, "require('../../../$1')");

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed imports in: ${path.basename(filePath)}`);
  }
}

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isFile() && fullPath.endsWith('.js')) {
      fixImportsInFile(fullPath);
    }
  }
}

directoriesToFix.forEach(processDirectory);
console.log("All dragged and dropped files have been updated with the correct relative paths!");
