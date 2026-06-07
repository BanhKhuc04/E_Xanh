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
        <img src={post.image} alt={post.title} />
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
