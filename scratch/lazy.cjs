const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'src')

function walk(currentDir) {
  const files = fs.readdirSync(currentDir)
  for (const file of files) {
    const fullPath = path.join(currentDir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      walk(fullPath)
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8')
      
      // We don't want to lazy load the auth illustrations or hero images
      if (fullPath.includes('ForgotPasswordPage.jsx') || 
          fullPath.includes('ResetPasswordPage.jsx') ||
          fullPath.includes('HeroMedia.jsx') ||
          fullPath.includes('OptimizedImage.jsx') || 
          fullPath.includes('SmartImage.jsx')) {
          continue;
      }

      // Find <img ...> that doesn't have loading="lazy" or loading={...}
      let modified = false
      const newContent = content.replace(/<img\s+([^>]+)>/g, (match, attrs) => {
        if (!attrs.includes('loading=')) {
          modified = true
          // Just add loading="lazy" right after <img
          return `<img loading="lazy" ${attrs}>`
        }
        return match
      })

      if (modified) {
        fs.writeFileSync(fullPath, newContent, 'utf8')
        console.log('Modified:', fullPath)
      }
    }
  }
}

walk(dir)
console.log('Done.')
