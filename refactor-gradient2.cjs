const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, 'src', 'styles');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // We want to replace any background that includes `rgba(255, 255, 255, 0.98)` or similar inside a linear-gradient.
  // The safest way is to replace the whole line if it matches linear-gradient and rgba(255, 255, 255
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.includes('linear-gradient') && line.includes('rgba(255, 255, 255')) {
      lines[i] = line.replace(/background:\s*linear-gradient\(.*?\);/g, 'background: var(--bg-panel);');
    }
  }
  content = lines.join('\n');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated gradients in ${path.basename(filePath)}`);
  }
}

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.css')) {
      replaceInFile(fullPath);
    }
  }
}

scanDir(cssDir);
console.log('Gradient Refactoring 2 complete.');
