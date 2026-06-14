const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, 'src/services')
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'))

for (const file of files) {
  const filePath = path.join(dir, file)
  let content = fs.readFileSync(filePath, 'utf-8')
  
  if (content.includes('console.error')) {
    if (!content.includes('import { logError }')) {
      content = `import { logError } from '../utils/logger'\n` + content
    }
    content = content.replace(/console\.error\(/g, 'logError(')
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`Updated ${file}`)
  }
}
