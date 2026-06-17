import { buildRenderableFallbackBlocks, getImageCaption } from '../../utils/postBlocks'

function renderInlineText(text = '', keyPrefix) {
  const nodes = []
  const pattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\))/g
  let lastIndex = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    if (match[2]) {
      nodes.push(<strong key={`${keyPrefix}-bold-${match.index}`}>{match[2]}</strong>)
    } else if (match[3]) {
      nodes.push(<em key={`${keyPrefix}-italic-${match.index}`}>{match[3]}</em>)
    } else if (match[4] && match[5]) {
      nodes.push(
        <a
          key={`${keyPrefix}-link-${match.index}`}
          href={match[5]}
          target="_blank"
          rel="noopener noreferrer"
          className="post-blocks__anchor"
        >
          {match[4]}
        </a>,
      )
    }

    lastIndex = pattern.lastIndex
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

function parseTextContent(content = '') {
  const lines = String(content || '').replace(/\r\n/g, '\n').split('\n')
  const parsedBlocks = []
  let paragraphBuffer = []
  let listBuffer = []
  let quoteBuffer = []

  function flushParagraph() {
    if (paragraphBuffer.length === 0) return
    parsedBlocks.push({
      type: 'paragraph',
      content: paragraphBuffer.join('\n').trim(),
    })
    paragraphBuffer = []
  }

  function flushList() {
    if (listBuffer.length === 0) return
    parsedBlocks.push({
      type: 'list',
      items: [...listBuffer],
    })
    listBuffer = []
  }

  function flushQuote() {
    if (quoteBuffer.length === 0) return
    parsedBlocks.push({
      type: 'quote',
      content: quoteBuffer.join('\n').trim(),
    })
    quoteBuffer = []
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      flushParagraph()
      flushList()
      flushQuote()
      continue
    }

    if (/^#{1,6}\s+/.test(trimmed)) {
      flushParagraph()
      flushList()
      flushQuote()
      parsedBlocks.push({
        type: 'heading',
        content: trimmed.replace(/^#{1,6}\s+/, ''),
      })
      continue
    }

    if (/^-\s+/.test(trimmed)) {
      flushParagraph()
      flushQuote()
      listBuffer.push(trimmed.replace(/^-\s+/, ''))
      continue
    }

    if (/^>\s?/.test(trimmed)) {
      flushParagraph()
      flushList()
      quoteBuffer.push(trimmed.replace(/^>\s?/, ''))
      continue
    }

    flushList()
    flushQuote()
    paragraphBuffer.push(line)
  }

  flushParagraph()
  flushList()
  flushQuote()

  return parsedBlocks
}

function renderTextBlock(block, keyPrefix, variant) {
  const parsedBlocks = parseTextContent(block.content || '')

  return parsedBlocks.map((item, index) => {
    const childKey = `${keyPrefix}-${item.type}-${index}`

    if (item.type === 'heading') {
      return (
        <h3 key={childKey} className={`post-blocks__heading post-blocks__heading--${variant}`}>
          {renderInlineText(item.content, childKey)}
        </h3>
      )
    }

    if (item.type === 'list') {
      return (
        <ul key={childKey} className="post-blocks__list">
          {item.items.map((listItem, listIndex) => (
            <li key={`${childKey}-${listIndex}`}>{renderInlineText(listItem, `${childKey}-${listIndex}`)}</li>
          ))}
        </ul>
      )
    }

    if (item.type === 'quote') {
      return (
        <blockquote key={childKey} className="post-blocks__quote">
          {item.content.split('\n').map((line, lineIndex) => (
            <span key={`${childKey}-line-${lineIndex}`}>
              {renderInlineText(line, `${childKey}-line-${lineIndex}`)}
              {lineIndex < item.content.split('\n').length - 1 ? <br /> : null}
            </span>
          ))}
        </blockquote>
      )
    }

    return (
      <p key={childKey} className="post-blocks__paragraph">
        {item.content.split('\n').map((line, lineIndex) => (
          <span key={`${childKey}-line-${lineIndex}`}>
            {renderInlineText(line, `${childKey}-line-${lineIndex}`)}
            {lineIndex < item.content.split('\n').length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    )
  })
}

function renderLegacyBlock(block) {
  switch (block.type) {
    case 'paragraph':
      return <p key={block.id} className="post-blocks__paragraph">{block.content}</p>
    case 'heading':
      return <h3 key={block.id} className="post-blocks__heading post-blocks__heading--detail">{block.content}</h3>
    case 'quote':
      return <blockquote key={block.id} className="post-blocks__quote">{block.content}</blockquote>
    case 'list':
      return (
        <ul key={block.id} className="post-blocks__list">
          {(block.items || []).map((item, index) => (
            <li key={`${block.id}-${index}`}>{item}</li>
          ))}
        </ul>
      )
    case 'image': {
      const caption = getImageCaption(block)
      return (
        <figure key={block.id} className="post-blocks__figure">
          <div className="post-blocks__image-frame">
            <img src={block.url} alt={caption || 'Ảnh minh họa'} className="post-blocks__image" loading="lazy" />
          </div>
          {caption ? <figcaption>{caption}</figcaption> : null}
        </figure>
      )
    }
    case 'link':
      return (
        <p key={block.id} className="post-blocks__paragraph">
          <a href={block.url} target="_blank" rel="noopener noreferrer" className="post-blocks__anchor">
            {block.label || block.url}
          </a>
        </p>
      )
    default:
      return null
  }
}

function PostBlockRenderer({ blocks, fallbackContent, variant = 'detail' }) {
  const renderableBlocks = Array.isArray(blocks) && blocks.length > 0
    ? blocks
    : buildRenderableFallbackBlocks(fallbackContent)

  return (
    <div className={`post-blocks post-blocks--${variant}`}>
      {renderableBlocks.map((block, index) => {
        if (block.type === 'text') {
          return renderTextBlock(block, block.id || `text-${index}`, variant)
        }

        if (block.type === 'image') {
          const caption = getImageCaption(block)
          return (
            <figure key={block.id || `image-${index}`} className="post-blocks__figure">
              <div className="post-blocks__image-frame">
                <img
                  src={block.url}
                  alt={caption || 'Ảnh minh họa'}
                  className="post-blocks__image"
                  loading="lazy"
                />
              </div>
              {caption ? <figcaption>{caption}</figcaption> : null}
            </figure>
          )
        }

        return renderLegacyBlock(block)
      })}
    </div>
  )
}

export default PostBlockRenderer
