import fs from 'fs';
import path from 'path';

function walkDir(dir, filterExts) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath, filterExts));
    } else {
      if (!filterExts || filterExts.some(ext => file.endsWith(ext))) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const srcDir = path.join(process.cwd(), 'src');
const allFiles = walkDir(srcDir, ['.js', '.jsx', '.css', '.png', '.jpg', '.jpeg', '.svg', '.webp']);
const jsFiles = allFiles.filter(f => f.endsWith('.js') || f.endsWith('.jsx'));

// Check what is imported
const importedFiles = new Set();
// We also need to consider main.jsx importing styles
// We'll read all JS/JSX files and extract import paths
jsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Simple regex to match imports: import ... from '...' or import '...'
  const importRegex = /import\s+(?:(?:[\w*\s{},]*)\s+from\s+)?['"](.*?)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    // Resolve import path
    if (importPath.startsWith('.')) {
      try {
        const dir = path.dirname(file);
        let resolvedPath = path.resolve(dir, importPath);
        // Try to find the actual file by appending extensions if it doesn't have one
        if (!fs.existsSync(resolvedPath)) {
          if (fs.existsSync(resolvedPath + '.js')) resolvedPath += '.js';
          else if (fs.existsSync(resolvedPath + '.jsx')) resolvedPath += '.jsx';
          else if (fs.existsSync(resolvedPath + '/index.js')) resolvedPath += '/index.js';
          else if (fs.existsSync(resolvedPath + '/index.jsx')) resolvedPath += '/index.jsx';
        }
        importedFiles.add(resolvedPath);
      } catch(e){}
    }
  }
  
  // also check dynamic imports: import('...')
  const dynamicImportRegex = /import\(['"](.*?)['"]\)/g;
  while ((match = dynamicImportRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.')) {
      try {
        const dir = path.dirname(file);
        let resolvedPath = path.resolve(dir, importPath);
        if (!fs.existsSync(resolvedPath)) {
          if (fs.existsSync(resolvedPath + '.js')) resolvedPath += '.js';
          else if (fs.existsSync(resolvedPath + '.jsx')) resolvedPath += '.jsx';
          else if (fs.existsSync(resolvedPath + '/index.js')) resolvedPath += '/index.js';
          else if (fs.existsSync(resolvedPath + '/index.jsx')) resolvedPath += '/index.jsx';
        }
        importedFiles.add(resolvedPath);
      } catch(e){}
    }
  }
});

// also check index.html
const indexHtmlPath = path.join(process.cwd(), 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  const content = fs.readFileSync(indexHtmlPath, 'utf8');
  const srcRegex = /src=['"](.*?)['"]/g;
  const hrefRegex = /href=['"](.*?)['"]/g;
  let match;
  while ((match = srcRegex.exec(content)) !== null) {
    if (match[1].startsWith('/src/')) importedFiles.add(path.join(process.cwd(), match[1].substring(1)));
  }
  while ((match = hrefRegex.exec(content)) !== null) {
    if (match[1].startsWith('/src/')) importedFiles.add(path.join(process.cwd(), match[1].substring(1)));
  }
}

// Check which files are not imported
const unusedFiles = allFiles.filter(f => {
  // main.jsx is the entry point
  if (f.endsWith('main.jsx') || f.endsWith('main.js') || f.endsWith('router.jsx')) return false;
  return !importedFiles.has(f);
});

console.log(JSON.stringify(unusedFiles, null, 2));
