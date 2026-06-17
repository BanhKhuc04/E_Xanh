import { Link } from 'react-router-dom'
import { Bookmark, Clock3, Heart, MessageCircle } from 'lucide-react'
import PostAuthorAvatar from './PostAuthorAvatar'

function ArticleHeader({ post }) {
  const authorHref = post.author_id || post.authorId
    ? `/nguoi-dung/${post.author_id || post.authorId}`
    : null

  return (
    <header className="article-header">
      <span className="article-header__tag">{post.category}</span>
      <h1>{post.title}</h1>
      <p>{post.description}</p>

      <div className="article-header__meta">
        <div className="article-header__author">
          <Link
            to={authorHref || '#'}
            className={`article-header__author-link${authorHref ? '' : ' is-disabled'}`}
            onClick={(e) => {
              if (!authorHref) e.preventDefault()
            }}
            aria-disabled={authorHref ? undefined : 'true'}
          >
            <PostAuthorAvatar
              src={post.authorAvatar}
              name={post.author}
              size="lg"
            />
            <div className="article-header__author-copy">
              <strong>{post.author}</strong>
              <span>
                <Clock3 size={14} strokeWidth={2} />
                {post.date} · {post.readTime}
              </span>
            </div>
          </Link>
        </div>

        <div className="article-header__stats">
          <span>
            <Heart size={15} strokeWidth={2.1} />
            {post.likes} lượt thích
          </span>
          <span>
            <MessageCircle size={15} strokeWidth={2.1} />
            {post.comments} bình luận
          </span>
          <span>
            <Bookmark size={15} strokeWidth={2.1} />
            {post.savedCount} lượt lưu
          </span>
        </div>
      </div>
    </header>
  )
}

export default ArticleHeader
