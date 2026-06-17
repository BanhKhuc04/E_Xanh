const IMAGE_TOKEN_PATTERN = /^!\[([^\]]*)\]\(([^)]+)\)$/
const LEGACY_IMAGE_LINK_PATTERN = /^\[([^\]]*)\]\(([^)]+\/post-images\/[^)]+)\)$/
const INLINE_IMAGE_PATTERN = /!\[([^\]]*)\]\(([^)\s]+)\)/g
const INLINE_LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/g
const HEADING_PATTERN = /^\s*#{1,6}\s+/gm
const QUOTE_PATTERN = /^\s*>\s?/gm
const BULLET_PATTERN = /^\s*[-*]\s+/gm
const EMPHASIS_PATTERN = /(\*\*|__|\*|_)/g

export function generateBlockId() {
  return Math.random().toString(36).slice(2, 10)
}

export function createTextBlock(content = '') {
  return {
    id: generateBlockId(),
    type: 'text',
    content,
  }
}

export function createImageBlock(data = {}) {
  return {
    id: data.id || generateBlockId(),
    type: 'image',
    url: data.url || '',
    caption: data.caption || '',
    alt: data.alt || '',
  }
}

function buildQuoteMarkdown(content = '') {
  return String(content || '')
    .split('\n')
    .map((line) => `> ${line}`.trimEnd())
    .join('\n')
}

function legacyBlockToTextContent(block) {
  switch (block?.type) {
    case 'text':
      return block.content || ''
    case 'paragraph':
      return block.content || ''
    case 'heading':
      return block.content ? `### ${block.content}` : ''
    case 'quote':
      return buildQuoteMarkdown(block.content || '')
    case 'list':
      return Array.isArray(block.items)
        ? block.items.map((item) => `- ${String(item || '').trim()}`.trimEnd()).join('\n')
        : ''
    case 'link':
      if (block.url) {
        return `[${block.label || block.url}](${block.url})`
      }
      return block.label || ''
    default:
      return block?.content || ''
  }
}

function normalizeSingleBlock(block) {
  if (!block || typeof block !== 'object') return null

  if (block.type === 'image') {
    if (block.id && 'caption' in block && 'alt' in block && 'url' in block) {
      return block
    }

    return createImageBlock(block)
  }

  if (block.type === 'text') {
    if (block.id && typeof block.content === 'string') {
      return block
    }

    return {
      id: block.id || generateBlockId(),
      type: 'text',
      content: block.content || '',
    }
  }

  const content = legacyBlockToTextContent(block)
  return {
    id: block.id || generateBlockId(),
    type: 'text',
    content,
  }
}

export function normalizeEditorBlocks(blocks = [], fallbackContent = '', options = {}) {
  const { ensureAtLeastOne = true } = options
  const normalizedBlocks = Array.isArray(blocks)
    ? blocks.map(normalizeSingleBlock).filter(Boolean)
    : []

  if (normalizedBlocks.length > 0) {
    return normalizedBlocks
  }

  if (String(fallbackContent || '').trim()) {
    return [createTextBlock(String(fallbackContent).trim())]
  }

  return ensureAtLeastOne ? [createTextBlock()] : []
}

export function stripRichTextMarkdown(text = '') {
  return String(text || '')
    .replace(INLINE_IMAGE_PATTERN, '$1 ')
    .replace(INLINE_LINK_PATTERN, '$1')
    .replace(HEADING_PATTERN, '')
    .replace(QUOTE_PATTERN, '')
    .replace(BULLET_PATTERN, '')
    .replace(EMPHASIS_PATTERN, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim()
}

export function extractPlainTextFromBlocks(blocks = [], fallbackContent = '') {
  if (Array.isArray(blocks) && blocks.length > 0) {
    return blocks
      .map((block) => {
        if (block.type === 'image') {
          return block.caption || block.alt || ''
        }

        return stripRichTextMarkdown(legacyBlockToTextContent(block))
      })
      .filter(Boolean)
      .join('\n\n')
      .trim()
  }

  return stripRichTextMarkdown(fallbackContent)
}

export function countWords(text = '') {
  return String(text || '')
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .length
}

export function countImageBlocks(blocks = []) {
  if (!Array.isArray(blocks)) return 0
  return blocks.filter((block) => block?.type === 'image' && block.url).length
}

export function getImageCaption(block = {}) {
  return block.caption || block.alt || ''
}

export function buildRenderableFallbackBlocks(content = '') {
  const chunks = String(content || '')
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)

  return chunks.map((chunk) => {
    const imageMatch = chunk.match(IMAGE_TOKEN_PATTERN) || chunk.match(LEGACY_IMAGE_LINK_PATTERN)
    if (imageMatch) {
      return createImageBlock({
        caption: imageMatch[1],
        alt: imageMatch[1],
        url: imageMatch[2],
      })
    }

    return createTextBlock(chunk)
  })
}
