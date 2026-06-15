import { Link } from 'react-router-dom'

function ArticleHeader({ post }) {
  return (
    <header className="article-header">
      <span className="article-header__tag">{post.category}</span>
      <h1>{post.title}</h1>
      <p>{post.description}</p>

      <div className="article-header__meta">
        <div className="article-header__author">
          <Link to={`/nguoi-dung/${post.author_id || post.authorId}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'inherit', textDecoration: 'none' }}>
            <span className="article-header__avatar">{post.author.slice(0, 2).toUpperCase()}</span>
            <div>
              <strong>{post.author}</strong>
              <span style={{ display: 'block', color: 'var(--color-text-muted)' }}>
                {post.date} • {post.readTime}
              </span>
            </div>
          </Link>
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
