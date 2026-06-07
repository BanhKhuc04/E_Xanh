import { Link } from 'react-router-dom'
import './PostCard.css'

function getAuthorInitials(author) {
  return author
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function PostCard({ post }) {
  return (
    <article className="post-card-ui">
      <div className="post-card-ui__media">
        {post.image ? (
          <img 
            src={post.image} 
            alt={post.title} 
            style={{ aspectRatio: '16/9', objectFit: 'cover', width: '100%', display: 'block' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        <div className="post-card-ui__placeholder" style={{ display: post.image ? 'none' : 'flex', aspectRatio: '16/9', width: '100%', background: 'rgba(234, 245, 157, 0.4)', alignItems: 'center', justifyContent: 'center', color: '#4f8428' }}>
          <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 32, height: 32, stroke: 'currentColor', fill: 'none', strokeWidth: 1.5 }}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <span className="post-card-ui__category">{post.category}</span>
        <button type="button" className="post-card-ui__save-button" aria-label={`Lưu bài ${post.title}`}>
          Lưu
        </button>
      </div>

      <div className="post-card-ui__body">
        <h3>{post.title}</h3>
        <p>{post.description}</p>

        <div className="post-card-ui__meta">
          <div className="post-card-ui__author">
            <span className="post-card-ui__avatar">{getAuthorInitials(post.author)}</span>
            <div>
              <strong>{post.author}</strong>
              <span>
                {post.date} • {post.readTime}
              </span>
            </div>
          </div>

          <div className="post-card-ui__stats">
            <span>{post.likes} thích</span>
            <span>{post.comments} bình luận</span>
            <span>{post.savedCount} lưu</span>
          </div>
        </div>

        <Link className="post-card-ui__link" to={`/meo-tiet-kiem/${post.slug}`}>
          Đọc tiếp
        </Link>
      </div>
    </article>
  )
}

export default PostCard
