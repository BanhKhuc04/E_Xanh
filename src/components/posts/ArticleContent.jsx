import OptimizedImage from '../common/OptimizedImage'
import MarkdownContent from '../common/MarkdownContent'
import PostBlockRenderer from '../community/PostBlockRenderer'

function ArticleContent({ post }) {
  const hasBlocks = post.contentBlocks && post.contentBlocks.length > 0;

  return (
    <section className="article-content">
      {post.image ? (
        <figure className="article-content__cover" style={{ margin: 0 }}>
          <OptimizedImage
            src={post.image}
            variants={{
              detail: post.cover_detail_url,
              card: post.cover_card_url,
              thumb: post.cover_thumb_url
            }}
            alt={post.title}
            ratio="16/9"
            loading="eager"
            fetchPriority="high"
          />
        </figure>
      ) : null}

      <div className="article-content__body" style={{ marginTop: '24px' }}>
        <div className="article-content__surface">
          {hasBlocks ? (
            <PostBlockRenderer blocks={post.contentBlocks} fallbackContent={post.content} />
          ) : (
            (Array.isArray(post.contentSections) ? post.contentSections : []).map((section, index) => (
              <div key={section.heading} className="article-content__section">
                <h2>{section.heading}</h2>
                <MarkdownContent content={section.body} className="article-content__markdown" />

                {index === 0 && post.quickTip ? (
                  <div className="article-quick-tip">
                    <div>
                      <strong>Mẹo nhanh</strong>
                      <p>{post.quickTip}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default ArticleContent
