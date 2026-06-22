const fs = require('fs');
const path = require('path');

function walk(d) {
  let r = [];
  if (!fs.existsSync(d)) return r;
  fs.readdirSync(d).forEach(f => {
    let fp = path.join(d, f);
    if (fs.statSync(fp).isDirectory()) {
      r = r.concat(walk(fp));
    } else if (fp.endsWith('.jsx')) {
      r.push(fp);
    }
  });
  return r;
}

const files = walk('src/pages/admin').concat(walk('src/components/admin'));
let out = [];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const lines = c.split('\n');
  
  lines.forEach((l, i) => {
    if (l.includes('to=\"#\"') || l.includes('href=\"#\"') || l.includes('to=\"\"') || l.includes('href=\"\"')) {
       out.push(f + ':' + (i+1) + ' ' + l.trim());
    }
  });
});

console.log(out.join('\n'));
