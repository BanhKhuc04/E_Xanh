const fs = require('fs');
const path = require('path');

function walk(d) {
  let r = [];
  if (!fs.existsSync(d)) return r;
  fs.readdirSync(d).forEach(f => {
    let fp = path.join(d, f);
    if (fs.statSync(fp).isDirectory()) {
      r = r.concat(walk(fp));
    } else if (fp.endsWith('.jsx') || fp.endsWith('.tsx')) {
      r.push(fp);
    }
  });
  return r;
}

const dirs = ['src/pages/admin', 'src/components/admin', 'src/layouts/admin'];
let files = [];
dirs.forEach(d => files = files.concat(walk(d)));

let issues = [];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const lines = c.split('\n');
  
  // Also track multiline buttons
  let inButton = false;
  let buttonContent = '';
  let buttonStartLine = 0;

  lines.forEach((l, i) => {
    // Single line checks for placeholders
    if (l.includes('onClick={() => {}}') || 
        l.includes('onClick={() => console.log') || 
        l.includes('alert(') || 
        l.includes('onClick={() => alert(') ||
        l.includes('to=\"#\"') ||
        l.includes('href=\"#\"')
    ) {
      issues.push(`[Trình giữ chỗ] ${f}:${i + 1} -> ${l.trim()}`);
    }

    // Multiline button check
    if (l.includes('<button') && !l.includes('</button>')) {
      inButton = true;
      buttonStartLine = i + 1;
      buttonContent = l;
    } else if (inButton && l.includes('</button>')) {
      inButton = false;
      buttonContent += '\n' + l;
      if (!buttonContent.includes('onClick') && !buttonContent.includes('type=\"submit\"') && !c.includes('onSubmit')) {
        issues.push(`[Thiếu Event/Submit] ${f}:${buttonStartLine} -> Multiline button without onClick or type="submit"`);
      }
      buttonContent = '';
    } else if (inButton) {
      buttonContent += '\n' + l;
    } else if (l.includes('<button') && l.includes('</button>')) {
      // Single line button
      if (!l.includes('onClick') && !l.includes('type=\"submit\"') && !c.includes('onSubmit')) {
        issues.push(`[Thiếu Event/Submit] ${f}:${i + 1} -> ${l.trim()}`);
      }
    }
  });
});

console.log(issues.join('\n'));
