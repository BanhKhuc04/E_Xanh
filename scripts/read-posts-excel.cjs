/**
 * read-posts-excel.js
 * Chạy: node scripts/read-posts-excel.js
 * Script này đọc file bai-viet-template.xlsx và tạo ra src/data/manualPosts.js
 */

const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const ROOT = path.resolve(__dirname, '..')
const EXCEL_PATH = path.join(ROOT, 'bai-viet-template.xlsx')
const OUTPUT_PATH = path.join(ROOT, 'src', 'data', 'manualPosts.js')

if (!fs.existsSync(EXCEL_PATH)) {
  console.error('❌ Không tìm thấy file:', EXCEL_PATH)
  process.exit(1)
}

const wb = XLSX.readFile(EXCEL_PATH)
const ws = wb.Sheets['Bài viết (điền vào đây)']
const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })

// raw[0] = headers, raw[1] = mô tả cột, raw[2+] = dữ liệu
const dataRows = raw.slice(2)

const posts = []
for (const row of dataRows) {
  const title = String(row[1] || '').trim()
  // Bỏ qua hàng trống hoặc hàng ví dụ
  if (!title || title.startsWith('Ví dụ')) continue

  const id = Number(row[0]) || posts.length + 1
  const slug = String(row[2] || '').trim() || slugify(title)

  posts.push({
    id,
    title,
    slug,
    description: String(row[3] || '').trim(),
    category: String(row[4] || 'Mẹo chung').trim(),
    type: String(row[5] || 'tip').trim(),
    image:
      String(row[6] || '').trim() ||
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    author: String(row[7] || 'E-XANH Team').trim(),
    date: String(row[8] || '').trim(),
    readTime: String(row[9] || '5 phút đọc').trim(),
    likes: Number(row[10]) || 0,
    comments: Number(row[11]) || 0,
    savedCount: Number(row[12]) || 0,
    content: String(row[13] || '').trim(),
  })
}

if (posts.length === 0) {
  console.log(
    '⚠️  Chưa có bài nào được điền. Hãy điền vào file Excel rồi chạy lại script này.'
  )
  process.exit(0)
}

// Tạo file JS output
const jsOutput = `// AUTO-GENERATED từ bai-viet-template.xlsx
// Chạy lại: node scripts/read-posts-excel.js để cập nhật sau mỗi lần sửa Excel
// Tổng: ${posts.length} bài viết - Cập nhật lúc: ${new Date().toLocaleString('vi-VN')}

export const manualPosts = ${JSON.stringify(posts, null, 2)}

/**
 * Lọc bài theo danh mục
 * @param {string} category - 'Tất cả' | 'Điều hòa' | 'Laptop' | 'Tủ lạnh' | 'Thiết bị điện' | 'Thói quen' | 'Mẹo chung'
 */
export function getPostsByCategory(category) {
  if (category === 'Tất cả') return manualPosts
  return manualPosts.filter((p) => p.category === category)
}

/**
 * Lấy bài nổi bật (nhiều likes nhất)
 */
export function getFeaturedManualPosts(limit = 3) {
  return [...manualPosts].sort((a, b) => b.likes - a.likes).slice(0, limit)
}

/**
 * Lấy bài theo slug
 */
export function getManualPostBySlug(slug) {
  return manualPosts.find((p) => p.slug === slug)
}

/**
 * Lấy bài theo loại
 */
export function getPostsByType(type) {
  return manualPosts.filter((p) => p.type === type)
}

export const manualPostStats = {
  total: manualPosts.length,
  totalLikes: manualPosts.reduce((s, p) => s + p.likes, 0),
  totalComments: manualPosts.reduce((s, p) => s + p.comments, 0),
  totalSaved: manualPosts.reduce((s, p) => s + p.savedCount, 0),
}
`

fs.writeFileSync(OUTPUT_PATH, jsOutput, 'utf8')
console.log(`✅ Đã tạo ${OUTPUT_PATH}`)
console.log(`📊 Tổng cộng: ${posts.length} bài viết`)
