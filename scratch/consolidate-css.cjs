const fs = require('fs')
const path = require('path')

const srcDir = path.join(__dirname, '..', 'src')
const stylesDir = path.join(srcDir, 'styles')
const globalCssPath = path.join(stylesDir, 'global.css')

const filesToConsolidate = [
  'toast.css',
  'loading.css',
  'theme-toggle.css',
  'version-notice.css',
  'responsive-fix.css' // It's imported in global.css
]

let globalCssContent = fs.readFileSync(globalCssPath, 'utf8')

// Remove @import "./responsive-fix.css";
globalCssContent = globalCssContent.replace(/@import\s+["']\.\/responsive-fix\.css["'];/g, '')

for (const cssFile of filesToConsolidate) {
  const filePath = path.join(stylesDir, cssFile)
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8')
    globalCssContent += `\n/* --- Consolidate: ${cssFile} --- */\n` + content
    fs.unlinkSync(filePath)
    console.log(`Deleted ${cssFile}`)
  }
}

fs.writeFileSync(globalCssPath, globalCssContent, 'utf8')
console.log('Appended to global.css')

// Now find and remove imports in JSX
function walk(currentDir) {
  const files = fs.readdirSync(currentDir)
  for (const file of files) {
    const fullPath = path.join(currentDir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      walk(fullPath)
    } else if (fullPath.match(/\.(js|jsx)$/)) {
      let content = fs.readFileSync(fullPath, 'utf8')
      let modified = false
      
      for (const cssFile of filesToConsolidate) {
        // Match import statement like: import '../../styles/toast.css'
        const regex = new RegExp(`import\\s+['"][^'"]*${cssFile}['"]\\s*\\n?`, 'g')
        if (regex.test(content)) {
          content = content.replace(regex, '')
          modified = true
          console.log(`Removed import of ${cssFile} from ${file}`)
        }
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8')
      }
    }
  }
}

walk(srcDir)
console.log('Done CSS consolidation.')
