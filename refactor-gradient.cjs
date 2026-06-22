const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, 'src', 'styles');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Since multi-line matching is tricky, let's normalize newlines and spaces temporarily, or just use a generic regex for linear-gradient with white values.
  
  // Replace simple white/light linear gradients with var(--bg-panel)
  content = content.replace(/background:\s*linear-gradient\([^)]*rgba\(255,\s*255,\s*255,\s*0\.9[0-9]\)[^)]*\)\s*;/g, 'background: var(--bg-panel);');
  
  // Replace hardcoded light hex backgrounds like linear-gradient(..., #f6faea)
  content = content.replace(/background:\s*linear-gradient\([^)]*#(?:f6faea|fbfdf9|eff6e1)[^)]*\)\s*;/gi, 'background: var(--bg-shell);');
  
  // Specific regex for multi-line user-shell background in layout.css
  // background:\s*radial-gradient[^{]+linear-gradient[^{]+;
  // It's safer to just replace any background that includes radial-gradient followed by linear-gradient with #f6faea or var(--color-surface-soft)
  content = content.replace(/background:\s*radial-gradient\([^;]+linear-gradient\([^;]+#f6faea[^;]+;/gi, 'background: var(--bg-shell);');
  content = content.replace(/background:\s*radial-gradient\([^;]+linear-gradient\([^;]+var\(--color-surface-soft\)[^;]+;/gi, 'background: var(--bg-panel);');
  content = content.replace(/background:\s*radial-gradient\([^;]+linear-gradient\([^;]+#eff6e1[^;]+;/gi, 'background: var(--bg-auth);');

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
console.log('Gradient Refactoring complete.');
