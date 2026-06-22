const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, 'src', 'styles');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace background: #fff or background-color: #ffffff
  content = content.replace(/background:\s*#(?:fff|ffffff)\s*;/gi, 'background: var(--color-surface);');
  content = content.replace(/background-color:\s*#(?:fff|ffffff)\s*;/gi, 'background-color: var(--color-surface);');
  
  // Replace color: #173715 with var(--color-text)
  content = content.replace(/color:\s*#173715\s*;/gi, 'color: var(--color-text);');
  
  // Replace rgba(255,255,255,0.8+) style transparent surfaces.
  content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.[89]\w*\)\s*;/gi, 'background: var(--color-surface-soft);');

  // Some components use #fff for text. But we shouldn't blindly replace color: #fff because it might be primary buttons.
  // Instead, replace color: #fff where it might mean color-surface. Wait, color: #fff means white text. It's usually fine to stay white if it's on a dark background (like a dark header).
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${path.basename(filePath)}`);
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
console.log('CSS Refactoring complete.');
