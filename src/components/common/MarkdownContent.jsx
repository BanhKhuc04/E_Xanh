import { Fragment } from 'react'
import { isRenderableMarkdownImageUrl } from '../../utils/markdown'

function renderInlineTokens(text, keyPrefix) {
  const tokens = []
  const pattern = /(\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g
  let lastIndex = 0
  let match
  let index = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index))
    }

    if (match[2] && match[3]) {
      tokens.push(
        <a
          key={`${keyPrefix}-link-${index}`}
          href={match[3]}
          target="_blank"
          rel="noreferrer"
        >
          {match[2]}
        </a>
      )
    } else if (match[4]) {
      tokens.push(<strong key={`${keyPrefix}-strong-${index}`}>{match[4]}</strong>)
    } else if (match[5]) {
      tokens.push(<em key={`${keyPrefix}-em-${index}`}>{match[5]}</em>)
    } else if (match[6]) {
      tokens.push(<code key={`${keyPrefix}-code-${index}`}>{match[6]}</code>)
    }

    lastIndex = pattern.lastIndex
    index += 1
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex))
  }

  return tokens.length > 0 ? tokens : text
}

function renderParagraph(lines, key) {
  const text = lines.join(' ').trim()
  if (!text) return null
  return <p key={key}>{renderInlineTokens(text, key)}</p>
}

function renderQuote(lines, key) {
  const text = lines.map((line) => line.replace(/^>\s?/, '')).join(' ').trim()
  return (
    <blockquote key={key}>
      {renderInlineTokens(text, key)}
    </blockquote>
  )
}

function renderList(lines, key) {
  return (
    <ul key={key}>
      {lines.map((line, index) => (
        <li key={`${key}-item-${index}`}>
          {renderInlineTokens(line.replace(/^[-*]\s+/, '').trim(), `${key}-item-${index}`)}
        </li>
      ))}
    </ul>
  )
}

function renderImage(line, key) {
  const match = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/)
  if (!match) return null

  const [, altText, url] = match
  if (!isRenderableMarkdownImageUrl(url)) return null

  return (
    <figure key={key} className="markdown-content__figure">
      <img src={url} alt={altText || 'Ảnh minh họa bài viết'} loading="lazy" />
      {altText ? <figcaption>{altText}</figcaption> : null}
    </figure>
  )
}

function renderHeading(line, key) {
  const match = line.match(/^(#{1,3})\s+(.*)$/)
  if (!match) return null

  const level = Math.min(match[1].length, 3)
  const text = match[2].trim()

  if (level === 1) return <h2 key={key}>{renderInlineTokens(text, key)}</h2>
  if (level === 2) return <h3 key={key}>{renderInlineTokens(text, key)}</h3>
  return <h4 key={key}>{renderInlineTokens(text, key)}</h4>
}

function buildBlocks(content = '') {
  const normalized = content.replace(/\r\n/g, '\n').trim()
  if (!normalized) return []

  const lines = normalized.split('\n')
  const blocks = []
  let index = 0

  while (index < lines.length) {
    const currentLine = lines[index].trim()

    if (!currentLine) {
      index += 1
      continue
    }

    if (/^!\[([^\]]*)\]\(([^)\s]+)\)$/.test(currentLine)) {
      blocks.push({ type: 'image', lines: [currentLine] })
      index += 1
      continue
    }

    if (/^(#{1,3})\s+/.test(currentLine)) {
      blocks.push({ type: 'heading', lines: [currentLine] })
      index += 1
      continue
    }

    if (/^>\s?/.test(currentLine)) {
      const quoteLines = []
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim())
        index += 1
      }
      blocks.push({ type: 'quote', lines: quoteLines })
      continue
    }

    if (/^[-*]\s+/.test(currentLine)) {
      const listLines = []
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        listLines.push(lines[index].trim())
        index += 1
      }
      blocks.push({ type: 'list', lines: listLines })
      continue
    }

    const paragraphLines = []
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^!\[([^\]]*)\]\(([^)\s]+)\)$/.test(lines[index].trim()) &&
      !/^(#{1,3})\s+/.test(lines[index].trim()) &&
      !/^>\s?/.test(lines[index].trim()) &&
      !/^[-*]\s+/.test(lines[index].trim())
    ) {
      paragraphLines.push(lines[index].trim())
      index += 1
    }
    blocks.push({ type: 'paragraph', lines: paragraphLines })
  }

  return blocks
}

function MarkdownContent({ content, className = '' }) {
  const blocks = buildBlocks(content)

  if (!blocks.length) {
    return <p className="markdown-content__empty">Nội dung xem trước sẽ xuất hiện ở đây.</p>
  }

  return (
    <div className={['markdown-content', className].filter(Boolean).join(' ')}>
      {blocks.map((block, index) => {
        const key = `md-block-${index}`

        if (block.type === 'image') return renderImage(block.lines[0], key)
        if (block.type === 'heading') return renderHeading(block.lines[0], key)
        if (block.type === 'quote') return renderQuote(block.lines, key)
        if (block.type === 'list') return renderList(block.lines, key)
        return <Fragment key={key}>{renderParagraph(block.lines, key)}</Fragment>
      })}
    </div>
  )
}

export default MarkdownContent
