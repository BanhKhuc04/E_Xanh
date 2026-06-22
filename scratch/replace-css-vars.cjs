const fs = require('fs')
const path = require('path')

const stylesDir = path.join(__dirname, '..', 'src', 'styles')
const cssFiles = fs.readdirSync(stylesDir).filter(f => f.endsWith('.css') && f !== 'global.css')

const EXACT_MAPPINGS = {
  '#eaf59d': 'var(--color-primary-50)',
  '#dced8a': 'var(--color-primary-100)',
  '#c1d95c': 'var(--color-primary-200)',
  '#80b155': 'var(--color-primary-300)',
  '#4f8428': 'var(--color-primary-400)',
  '#336a29': 'var(--color-primary-500)',
  '#173715': 'var(--color-text)',
  '#163912': 'var(--color-text)', // similar to text
  '#1a3315': 'var(--color-text)',
  '#12351f': 'var(--color-text)',
  '#2f7d32': 'var(--color-primary-500)', // approximate
  '#f8fafc': 'var(--color-surface-soft)',
  '#f3f4f6': 'var(--color-surface-soft)',
  '#f0f7e6': 'var(--color-primary-50)',
  '#e8f5e9': 'var(--color-primary-100)',
  '#a5d6a7': 'var(--color-primary-300)',
}

for (const file of cssFiles) {
  const filePath = path.join(stylesDir, file)
  let content = fs.readFileSync(filePath, 'utf8')
  let originalContent = content

  // Replace exact hex matches (case insensitive)
  for (const [hex, cssVar] of Object.entries(EXACT_MAPPINGS)) {
    const regex = new RegExp(hex, 'gi')
    content = content.replace(regex, cssVar)
  }

  // Replace background: #fff or background-color: #ffffff with var(--color-surface)
  content = content.replace(/background(-color)?\s*:\s*(#fff|#ffffff)([\s;!])/gi, 'background$1: var(--color-surface)$3')
  
  // Replace border: ... #fff with var(--color-surface)
  content = content.replace(/(border[^:]*:\s*[^;]+)(#fff|#ffffff)/gi, '$1var(--color-surface)')

  // Replace hardcoded shadows
  content = content.replace(/box-shadow\s*:\s*0\s+2px\s+8px\s+rgba\([^)]+\)/gi, 'box-shadow: var(--shadow-sm)')
  content = content.replace(/box-shadow\s*:\s*0\s+4px\s+12px\s+rgba\([^)]+\)/gi, 'box-shadow: var(--shadow-md)')
  content = content.replace(/box-shadow\s*:\s*0\s+8px\s+24px\s+rgba\([^)]+\)/gi, 'box-shadow: var(--shadow-lg)')

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`Updated ${file}`)
  }
}
console.log('Done CSS var replacement.')
