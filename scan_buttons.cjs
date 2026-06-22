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
  let inBtn = false;
  let btnStr = '';
  let ln = 0;
  const lines = c.split('\n');
  
  lines.forEach((l, i) => {
    if (l.includes('<button') && !l.includes('</button>')) {
      inBtn = true;
      btnStr = l;
      ln = i+1;
    } else if (inBtn && l.includes('</button>')) {
      inBtn = false;
      btnStr += '\n' + l;
      if (!btnStr.includes('onClick') && !btnStr.includes('type=\"submit\"') && !c.includes('onSubmit=')) {
        out.push(f + ':' + ln + '\n' + btnStr);
      }
    } else if (inBtn) {
      btnStr += '\n' + l;
    } else if (l.includes('<button') && l.includes('</button>')) {
      if (!l.includes('onClick') && !l.includes('type=\"submit\"') && !c.includes('onSubmit=')) {
        out.push(f + ':' + (i+1) + ' ' + l.trim());
      }
    }
    
    // Also find empty handlers or alerts
    if (l.match(/onClick=\{\(\)\s*=>\s*\{\s*\}\}/) || l.includes('onClick={() => alert') || l.includes('onClick={() => console.log')) {
       out.push("DUMMY HANDLER: " + f + ':' + (i+1) + ' ' + l.trim());
    }
  });
});

console.log(out.join('\n\n'));
