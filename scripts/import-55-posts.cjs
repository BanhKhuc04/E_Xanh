/**
 * import-55-posts.cjs
 * Đọc file Excel từ zip đã extract, copy ảnh, tạo manualPosts.js
 * Chạy: node scripts/import-55-posts.cjs
 */

const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const EXCEL_PATH = path.join('D:\\FPTU_VanhKhuc\\Ki 5_Summer\\E_Xanh\\e-xanh-55-extracted', 'bai-viet-55.xlsx')
const OUTPUT_PATH = path.join(ROOT, 'src', 'data', 'manualPosts.js')
const IMG_SRC = path.join('D:\\FPTU_VanhKhuc\\Ki 5_Summer\\E_Xanh\\e-xanh-55-extracted', 'public', 'images')
const IMG_DST = path.join(ROOT, 'public', 'images')

// ── 1. Copy ảnh ──────────────────────────────────────────────────────────────
if (!fs.existsSync(IMG_DST)) fs.mkdirSync(IMG_DST, { recursive: true })
const imgs = fs.readdirSync(IMG_SRC)
imgs.forEach((f) => {
  fs.copyFileSync(path.join(IMG_SRC, f), path.join(IMG_DST, f))
})
console.log(`✅ Đã copy ${imgs.length} ảnh → public/images/`)

// ── 2. Đọc Excel ─────────────────────────────────────────────────────────────
const wb = XLSX.readFile(EXCEL_PATH)
const ws = wb.Sheets['Bài viết (điền vào đây)']
const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })

// row[0] = headers, row[1] = mô tả, row[2..] = dữ liệu
const dataRows = raw.slice(2)
const posts = []

for (const row of dataRows) {
  const title = String(row[1] || '').trim()
  if (!title) continue

  posts.push({
    id: Number(row[0]),
    title,
    slug: String(row[2] || '').trim(),
    description: String(row[3] || '').trim(),
    category: String(row[4] || 'Mẹo chung').trim(),
    type: String(row[5] || 'tip').trim(),
    image: String(row[6] || '').trim(),
    author: String(row[7] || 'E-XANH Team').trim(),
    date: String(row[8] || '').trim(),
    readTime: String(row[9] || '5 phút đọc').trim(),
    likes: Number(row[10]) || 0,
    comments: Number(row[11]) || 0,
    savedCount: Number(row[12]) || 0,
    content: String(row[13] || '').trim(),
  })
}

console.log(`✅ Đọc được ${posts.length} bài viết từ Excel`)

const totalSaved = posts.reduce((s, p) => s + p.savedCount, 0)
const totalLikes = posts.reduce((s, p) => s + p.likes, 0)
const totalComments = posts.reduce((s, p) => s + p.comments, 0)

console.log(`   Likes: ${totalLikes} | Comments: ${totalComments} | Saved: ${totalSaved}`)

// ── 3. Ghi file JS ───────────────────────────────────────────────────────────
const jsContent = `// AUTO-GENERATED từ bai-viet-55.xlsx — KHÔNG SỬA TAY FILE NÀY
// Để cập nhật: node scripts/import-55-posts.cjs
// Cập nhật lúc: ${new Date().toLocaleString('vi-VN')}
// Tổng: ${posts.length} bài | Lưu: ${totalSaved} | Thích: ${totalLikes}

export const manualPosts = ${JSON.stringify(posts, null, 2)}

export function getPostsByCategory(category) {
  if (category === 'Tất cả') return manualPosts
  return manualPosts.filter((p) => p.category === category)
}

export function getFeaturedManualPosts(limit = 3) {
  return [...manualPosts].sort((a, b) => b.likes - a.likes).slice(0, limit)
}

export function getManualPostBySlug(slug) {
  return manualPosts.find((p) => p.slug === slug)
}

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

fs.writeFileSync(OUTPUT_PATH, jsContent, 'utf8')
console.log(`✅ Đã ghi: src/data/manualPosts.js`)
console.log(`🎉 Hoàn tất!`)
