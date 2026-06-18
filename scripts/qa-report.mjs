import fs from 'node:fs'
import path from 'node:path'

const resultsPath = process.argv[2] || 'test-results/results.json'
const outputPath = process.argv[3] || 'test-results/QA_REPORT.md'

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Không tìm thấy file kết quả: ${filePath}`)
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function flattenSpecs(suites = [], parents = []) {
  const rows = []
  for (const suite of suites) {
    const nextParents = [...parents, suite.title].filter(Boolean)
    if (suite.specs) {
      for (const spec of suite.specs) {
        for (const test of spec.tests || []) {
          for (const result of test.results || []) {
            rows.push({
              titlePath: [...nextParents, spec.title].filter(Boolean),
              projectName: test.projectName || '',
              expectedStatus: test.expectedStatus || '',
              status: result.status || '',
              duration: result.duration || 0,
              errors: result.errors || [],
              attachments: result.attachments || [],
              stdout: result.stdout || [],
              stderr: result.stderr || [],
            })
          }
        }
      }
    }
    rows.push(...flattenSpecs(suite.suites || [], nextParents))
  }
  return rows
}

function severityFromFailure(row) {
  const text = [row.titlePath.join(' > '), ...row.errors.map((e) => e.message || '')].join('\n')
  if (/màn trắng|white screen|HTTP status|404|500|page errors|JS page errors|admin|auth|đăng nhập/i.test(text)) return 'Critical'
  if (/BAD_COVER_IMAGE_RATIO|BROKEN_OR_NOT_LOADED_IMAGE|ảnh|image|console errors|failed network|tràn ngang|overflow/i.test(text)) return 'High'
  if (/accessibility|axe|toast|button|click|feedback/i.test(text)) return 'Medium'
  return 'Low'
}

function cleanError(error) {
  const message = error.message || String(error)
  return message
    .replace(/\u001b\[[0-9;]*m/g, '')
    .split('\n')
    .slice(0, 18)
    .join('\n')
}

function groupBySeverity(failures) {
  const order = ['Critical', 'High', 'Medium', 'Low']
  const groups = Object.fromEntries(order.map((key) => [key, []]))
  failures.forEach((row) => groups[severityFromFailure(row)].push(row))
  return { order, groups }
}

const json = readJson(resultsPath)
const rows = flattenSpecs(json.suites || [])
const passed = rows.filter((row) => row.status === 'passed').length
const skipped = rows.filter((row) => row.status === 'skipped').length
const failed = rows.filter((row) => !['passed', 'skipped'].includes(row.status))
const { order, groups } = groupBySeverity(failed)

const lines = []
lines.push('# QA Report - E-XANH')
lines.push('')
lines.push(`- Tổng lượt test: ${rows.length}`)
lines.push(`- Pass: ${passed}`)
lines.push(`- Fail/Flaky/Timeout: ${failed.length}`)
lines.push(`- Skip: ${skipped}`)
lines.push(`- Nguồn dữ liệu: \`${resultsPath}\``)
lines.push('')

if (failed.length === 0) {
  lines.push('## Kết luận')
  lines.push('')
  lines.push('Không phát hiện lỗi fail trong bộ test hiện tại. Vẫn nên xem `playwright-report` để kiểm tra ảnh chụp và các test bị skip do thiếu tài khoản test.')
} else {
  lines.push('## Danh sách lỗi cần xử lý')
  lines.push('')
  for (const severity of order) {
    const items = groups[severity]
    if (!items.length) continue
    lines.push(`## ${severity}`)
    lines.push('')
    items.forEach((row, index) => {
      const title = row.titlePath.join(' > ')
      lines.push(`### ${index + 1}. ${title}`)
      lines.push('')
      lines.push(`- Project/viewport: ${row.projectName || 'unknown'}`)
      lines.push(`- Status: ${row.status}`)
      lines.push(`- Duration: ${Math.round(row.duration / 1000)}s`)
      if (row.errors.length) {
        lines.push('- Lỗi chính:')
        lines.push('')
        lines.push('```txt')
        lines.push(cleanError(row.errors[0]))
        lines.push('```')
      }
      const usefulAttachments = row.attachments.filter((item) => item.path)
      if (usefulAttachments.length) {
        lines.push('- Bằng chứng:')
        usefulAttachments.forEach((item) => {
          lines.push(`  - ${item.name}: \`${path.relative(process.cwd(), item.path)}\``)
        })
      }
      lines.push('')
    })
  }
}

lines.push('## Cách đọc report')
lines.push('')
lines.push('- `Critical`: route chết, màn trắng, auth/admin lỗi, HTTP 404/500 hoặc JS page error.')
lines.push('- `High`: ảnh méo/sai tỉ lệ, ảnh không load, layout tràn ngang, console/network lỗi nặng.')
lines.push('- `Medium`: nút có phản hồi sai/thiếu feedback, accessibility, thao tác nhỏ.')
lines.push('- `Low`: lỗi còn lại hoặc cần kiểm tra thủ công thêm.')
lines.push('')
lines.push('Mở HTML report bằng: `npm run test:qa:report`.')

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${lines.join('\n')}\n`, 'utf8')
console.log(`Đã tạo ${outputPath}`)
