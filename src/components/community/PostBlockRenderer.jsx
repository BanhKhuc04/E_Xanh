function PostBlockRenderer({ blocks, fallbackContent, variant = 'detail' }) {
  if (blocks && blocks.length > 0) {
    return (
      <div className={`post-blocks post-blocks--${variant}`}>
        {blocks.map((block) => {
          switch (block.type) {
            case 'paragraph':
              return (
                <p key={block.id} className="post-blocks__paragraph">
                  {block.content}
                </p>
              )
            case 'heading':
              return (
                <h2 key={block.id} className="post-blocks__heading">
                  {block.content}
                </h2>
              )
            case 'quote':
              return (
                <blockquote key={block.id} className="post-blocks__quote">
                  {block.content}
                </blockquote>
              )
            case 'list':
              return (
                <ul key={block.id} className="post-blocks__list">
                  {(block.items || []).map((item, index) => (
                    <li key={`${block.id}-${index}`}>{item}</li>
                  ))}
                </ul>
              )
            case 'image':
              return (
                <figure key={block.id} className="post-blocks__figure">
                  <img src={block.url} alt={block.alt || 'Ảnh minh họa'} className="post-blocks__image" loading="lazy" />
                  {block.alt ? <figcaption>{block.alt}</figcaption> : null}
                </figure>
              )
            case 'link':
              return (
                <div key={block.id} className="post-blocks__link">
                  <a href={block.url} target="_blank" rel="noopener noreferrer" className="btn btn--secondary btn--small">
                    {block.label || 'Xem thêm'} ↗
                  </a>
                </div>
              )
            default:
              return null
          }
        })}
      </div>
    )
  }

  const parseMarkdownContent = (text) => {
    if (!text) return null;
    const paragraphs = text.split(/\n\n+/);
    
    return paragraphs.map((pText, i) => {
      // Split by markdown image or legacy link that contains /post-images/
      const parts = pText.split(/(!?\[[^\]]*\]\([^)]+\))/g);
      
      return (
        <p key={i} className="post-blocks__paragraph">
          {parts.map((part, j) => {
            const match = part.match(/^(!?)\[([^\]]*)\]\(([^)]+)\)$/);
            if (match) {
              const isImage = match[1] === '!';
              const alt = match[2];
              const url = match[3];
              
              if (isImage || url.includes('/post-images/')) {
                return (
                  <figure key={j} className="post-blocks__figure" style={{ margin: '16px 0' }}>
                    <img src={url} alt={alt || 'Ảnh'} className="post-blocks__image" loading="lazy" style={{ maxWidth: '100%', borderRadius: '16px', objectFit: 'cover' }} />
                    {alt && <figcaption style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px', textAlign: 'center' }}>{alt}</figcaption>}
                  </figure>
                );
              } else {
                return <a key={j} href={url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary-500)', textDecoration: 'underline' }}>{alt || url}</a>;
              }
            }
            return part.split('\n').map((line, k, arr) => (
               <span key={k}>{line}{k < arr.length - 1 && <br />}</span>
            ));
          })}
        </p>
      );
    });
  };

  return (
    <div className={`post-blocks post-blocks--${variant} fallback-content`}>
      {parseMarkdownContent(fallbackContent)}
    </div>
  )
}

export default PostBlockRenderer
