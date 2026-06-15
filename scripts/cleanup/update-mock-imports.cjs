const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(process.cwd(), 'src'), function(filePath) {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = content
      .replace(/\/data\/posts/g, '/data/mock/posts')
      .replace(/\/data\/adminPosts/g, '/data/mock/adminPosts')
      .replace(/\/data\/adminComments/g, '/data/mock/adminComments')
      .replace(/\/data\/adminDevices/g, '/data/mock/adminDevices')
      .replace(/\/data\/adminStatistics/g, '/data/mock/adminStatistics')
      .replace(/\/data\/adminUsers/g, '/data/mock/adminUsers');
    if (updated !== content) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log('Updated imports in: ' + filePath);
    }
  }
});
