export const MARKDOWN_IMAGE_LIMIT = 5

const MARKDOWN_IMAGE_PATTERN = /!\[([^\]]*)\]\(([^)\s]+)\)/g

export function countMarkdownImages(content = '') {
  return Array.from(content.matchAll(MARKDOWN_IMAGE_PATTERN)).length
}

export function buildMarkdownImage(altText = 'Ảnh minh họa', url = '') {
  const safeAlt = (altText || '').replace(/[\][]/g, '').trim() || 'Ảnh minh họa'
  const safeUrl = (url || '').replace(/[()]/g, '').trim()
  return `![${safeAlt}](${safeUrl})`
}

export function isRenderableMarkdownImageUrl(url = '') {
  return /^(https?:\/\/|\/)/i.test(url.trim())
}

export function stripMarkdownToPlainText(content = '') {
  return content
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(MARKDOWN_IMAGE_PATTERN, '$1 ')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1')
    .replace(/[*_`>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getMarkdownExcerpt(content = '', fallback = '') {
  const plainText = stripMarkdownToPlainText(content)
  if (!plainText) return fallback
  if (plainText.length <= 160) return plainText
  return `${plainText.slice(0, 157).trim()}...`
}
