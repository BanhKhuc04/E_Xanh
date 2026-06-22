const fs = require('fs')
const path = require('path')

const srcDir = path.join(__dirname, '..', 'src')
const stylesDir = path.join(srcDir, 'styles')

const cssFiles = fs.readdirSync(stylesDir).filter(f => f.endsWith('.css'))
const importedCss = new Set()

function walk(currentDir) {
  const files = fs.readdirSync(currentDir)
  for (const file of files) {
    const fullPath = path.join(currentDir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      walk(fullPath)
    } else if (fullPath.match(/\.(js|jsx)$/)) {
      const content = fs.readFileSync(fullPath, 'utf8')
      for (const cssFile of cssFiles) {
        if (content.includes(`/${cssFile}`) || content.includes(`'${cssFile}'`) || content.includes(`"${cssFile}"`) || content.includes(cssFile)) {
          importedCss.add(cssFile)
        }
      }
    }
  }
}

walk(srcDir)

console.log('Unused CSS files:')
for (const cssFile of cssFiles) {
  if (!importedCss.has(cssFile)) {
    console.log(cssFile)
  }
}
