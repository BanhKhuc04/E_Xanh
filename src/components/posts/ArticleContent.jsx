function ArticleContent({ post }) {
  return (
    <section className="article-content">
      <figure className="article-content__cover" style={{ margin: 0 }}>
        {post.image ? (
          <img 
            src={post.image} 
            alt={post.title} 
            style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {(!post.image) && (
          <div className="article-content__placeholder" style={{ display: 'flex', aspectRatio: '16/9', width: '100%', background: 'rgba(234, 245, 157, 0.4)', alignItems: 'center', justifyContent: 'center', color: '#4f8428' }}>
            <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 48, height: 48, stroke: 'currentColor', fill: 'none', strokeWidth: 1.5 }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </figure>

      <div className="article-content__body" style={{ marginTop: '24px' }}>
        {(Array.isArray(post.contentSections) ? post.contentSections : []).map((section, index) => (
          <div key={section.heading} className="article-content__section">
            <h2>{section.heading}</h2>
            <div style={{ whiteSpace: 'pre-line' }}>{section.body}</div>

            {index === 0 && post.quickTip ? (
              <div className="article-quick-tip">
                <div>
                  <strong>Mẹo nhanh</strong>
                  <p>{post.quickTip}</p>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}

export default ArticleContent
