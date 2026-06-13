import { Link } from 'react-router-dom'
import { getImageUrl } from '../../utils/imageUrl'

function getAuthorBadge(author) {
  return author
    .split(' ')
    .filter(Boolean)
    .slice(0, 1)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function SavedPostCard({ post, onUnsave }) {
  return (
    <article className="saved-post-card">
      <div className="saved-post-card__media">
        <img
          src={getImageUrl(post.image, 640)}
          alt={`Ảnh bài viết ${post.title}`}
          width="640"
          height="360"
          loading="lazy"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/fallback-green.jpg'; }}
        />
        <span className="saved-post-card__tag">{post.savedCategoryLabel}</span>
        <button 
          type="button" 
          className="saved-post-card__bookmark" 
          aria-label={`Bỏ lưu bài ${post.title}`}
          onClick={() => onUnsave && onUnsave(post.id)}
          style={{ opacity: 1, background: '#4f8428', color: '#fff' }}
        >
          Đã lưu
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
          <button 
            type="button" 
            className="saved-post-card__remove"
            onClick={() => onUnsave && onUnsave(post.id)}
          >
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
