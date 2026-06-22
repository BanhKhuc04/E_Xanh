const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, 'src', 'styles');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace light green hex colors
  content = content.replace(/background:\s*#(?:fbfdf9|f6faea|f7faef|e8f2d5|f5f9ea|eef5df|eef6df|f8ffe8|eff6e1)\s*;/gi, 'background: var(--color-background);');
  
  // Replace off-white/white-translucent rgba colors with surface soft
  content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.(?:3[4-9]|[4-9]\d*)\)\s*;/gi, 'background: var(--color-surface-soft);');
  content = content.replace(/background:\s*rgba\(250,\s*252,\s*241,\s*0\.96\)\s*;/gi, 'background: var(--color-surface-soft);');

  // Replace primary tints (hardcoded green rgbas)
  content = content.replace(/background:\s*rgba\(234,\s*245,\s*157,\s*0\.(?:3|4|5|6)\d*\)\s*;/gi, 'background: var(--color-primary-soft);');
  content = content.replace(/background:\s*rgba\(193,\s*217,\s*92,\s*0\.(?:1|2|3|4|5|6)\d*\)\s*;/gi, 'background: var(--color-primary-soft);');
  content = content.replace(/background:\s*rgba\(128,\s*177,\s*85,\s*0\.(?:1|2|3)\d*\)\s*;/gi, 'background: var(--color-primary-glow);');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated light greens in ${path.basename(filePath)}`);
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
console.log('Deep Replace Refactoring complete.');
