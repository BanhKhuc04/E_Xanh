const fs = require('fs');
const path = require('path');

const dir = 'd:/FPTU_VanhKhuc/Ki 5_Summer/E_Xanh/e-xanh/src/services';
fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.js')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/console\.error\((.*?),\s*([a-zA-Z0-9_]+)\)/g, (match, p1, p2) => {
        if (p2.includes('.message')) return match;
        return `console.error(${p1}, ${p2}?.message || ${p2})`;
    });
    fs.writeFileSync(filePath, content);
  }
});
