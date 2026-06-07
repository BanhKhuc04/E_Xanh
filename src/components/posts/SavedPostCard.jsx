import { Link } from 'react-router-dom'

function getAuthorBadge(author) {
  return author
    .split(' ')
    .filter(Boolean)
    .slice(0, 1)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function SavedPostCard({ post }) {
  return (
    <article className="saved-post-card">
      <div className="saved-post-card__media">
        <img src={post.image} alt={post.title} />
        <span className="saved-post-card__tag">{post.savedCategoryLabel}</span>
        <button type="button" className="saved-post-card__bookmark" aria-label={`Bỏ lưu bài ${post.title}`}>
          Lưu
        </button>
      </div>

      <div className="saved-post-card__body">
        <h3>{post.title}</h3>

        <div className="saved-post-card__meta">
          <span className="saved-post-card__author-badge">{getAuthorBadge(post.author)}</span>
          <span>{post.author}</span>
          <span>•</span>
          <span>{post.savedAt}</span>
        </div>

        <div className="saved-post-card__actions">
          <button type="button" className="saved-post-card__remove">
            Bỏ lưu
          </button>
          <Link to={`/meo-tiet-kiem/${post.slug}`} className="saved-post-card__read">
            Đọc lại
          </Link>
        </div>
      </div>
    </article>
  )
}

export default SavedPostCard
