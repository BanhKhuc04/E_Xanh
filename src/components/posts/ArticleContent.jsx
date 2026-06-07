function ArticleContent({ post }) {
  return (
    <section className="article-content">
      <figure className="article-content__cover">
        <img src={post.image} alt={post.title} />
      </figure>

      <div className="article-content__body">
        {post.contentSections.map((section, index) => (
          <div key={section.heading} className="article-content__section">
            <h2>{section.heading}</h2>
            <p>{section.body}</p>

            {index === 0 ? (
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
