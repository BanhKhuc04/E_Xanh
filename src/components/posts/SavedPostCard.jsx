import { Link } from 'react-router-dom'
import PostImage from '../common/PostImage'
import { resolvePostDetailRoute, resolvePostImageSource } from '../../utils/postMedia'

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
  const detailRoute = resolvePostDetailRoute(post)
  const imageSource = resolvePostImageSource(post)

  return (
    <article className="saved-post-card">
      <div className="saved-post-card__media">
        <PostImage src={imageSource} alt={`Ảnh bài viết ${post.title}`} variant="card" />
        <span className="saved-post-card__tag">{post.savedCategoryLabel || post.category}</span>
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
          <Link to={detailRoute} className="saved-post-card__read">
            Đọc lại
          </Link>
        </div>
      </div>
    </article>
  )
}

export default SavedPostCard
