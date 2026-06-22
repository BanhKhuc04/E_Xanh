const fs = require('fs')
const path = require('path')

const srcDir = path.join(__dirname, '..', 'src')

function walk(currentDir) {
  const files = fs.readdirSync(currentDir)
  for (const file of files) {
    const fullPath = path.join(currentDir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      walk(fullPath)
    } else if (fullPath.match(/\.(js|jsx)$/)) {
      let content = fs.readFileSync(fullPath, 'utf8')
      let originalContent = content

      // Replace btn--outline with btn--ghost
      content = content.replace(/btn--outline/g, 'btn--ghost')

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8')
        console.log(`Updated ${file}`)
      }
    }
  }
}

walk(srcDir)
console.log('Done standardizing buttons.')
