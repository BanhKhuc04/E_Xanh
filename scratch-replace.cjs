const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src', function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Check if the file still has the incorrectly modified UserNavbar.jsx
    if (filePath.includes('UserNavbar.jsx')) {
      // The multi replace tool previously corrupted UserNavbar.jsx.
      // I should revert it from git but wait, the workspace might not be tracked, or I can fix it.
      // First, let's just do the replace.
    }

    if (content.includes('frameMode="ring"')) {
      content = content.replace(/frameMode="ring"/g, 'withFrame={false}');
      changed = true;
    }
    if (content.includes('frameMode="profile"')) {
      content = content.replace(/frameMode="profile"/g, 'withFrame={true}');
      changed = true;
    }
    if (content.includes('frameMode=')) {
      content = content.replace(/frameMode=\{.*?\}/g, 'withFrame={false}');
      changed = true;
    }
    
    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log('Updated ' + filePath);
    }
  }
});
