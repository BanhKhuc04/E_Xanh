import PostImage from '../common/PostImage'

function ArticleContent({ post }) {
  return (
    <section className="article-content">
      <figure className="article-content__cover" style={{ margin: 0 }}>
        <PostImage src={post.image} alt={post.title} variant="detail" />
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
