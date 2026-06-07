function ArticleHeader({ post }) {
  return (
    <header className="article-header">
      <span className="article-header__tag">{post.category}</span>
      <h1>{post.title}</h1>
      <p>{post.description}</p>

      <div className="article-header__meta">
        <div className="article-header__author">
          <span className="article-header__avatar">{post.author.slice(0, 2).toUpperCase()}</span>
          <div>
            <strong>{post.author}</strong>
            <span>
              {post.date} • {post.readTime}
            </span>
          </div>
        </div>

        <div className="article-header__stats">
          <span>{post.likes} thích</span>
          <span>{post.comments} bình luận</span>
          <span>{post.savedCount} lưu</span>
        </div>
      </div>
    </header>
  )
}

export default ArticleHeader
