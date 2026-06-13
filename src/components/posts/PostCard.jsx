import { useEffect, useState } from 'react'
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
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function checkSaved() {
      if (!post?.id) return
      // Skip check for mock IDs (UUID length is 36)
      if (String(post.id).length < 30) return
      
      const { isPostSaved } = await import('../../services/interactionService')
      const { data } = await isPostSaved(post.id)
      if (data) setIsSaved(true)
    }
    checkSaved()
  }, [post?.id])

  async function handleToggleSave(e) {
    e.preventDefault() // prevent navigating if it's inside a link or just clicking button
    if (isSaving) return
    if (!post?.id || String(post.id).length < 30) {
      alert('Chức năng lưu bài chỉ hỗ trợ bài viết thật trên hệ thống.')
      return
    }

    setIsSaving(true)
    const { savePost, unsavePost } = await import('../../services/interactionService')
    
    if (isSaved) {
      const { error } = await unsavePost(post.id)
      if (!error) setIsSaved(false)
      else alert(error.message)
    } else {
      const { error } = await savePost(post.id)
      if (!error) setIsSaved(true)
      else alert(error.message)
    }
    setIsSaving(false)
  }

  return (
    <article className="post-card-ui" data-testid="tip-card">
      <div className="post-card-ui__media">
        {post.image ? (
          <img 
            src={post.image} 
            alt={`${post.title} - mẹo tiết kiệm điện`}
            width="640"
            height="360"
            loading="lazy"
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
        <button 
          type="button" 
          className="post-card-ui__save-button" 
          aria-label={`Lưu bài ${post.title}`}
          onClick={handleToggleSave}
          style={{ opacity: isSaved ? 1 : undefined, background: isSaved ? '#4f8428' : undefined, color: isSaved ? '#fff' : undefined }}
        >
          {isSaved ? 'Đã lưu' : 'Lưu'}
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

        <Link className="post-card-ui__link" to={`/meo-tiet-kiem/${post.slug}`} data-testid="tip-card-link">
          Đọc tiếp
        </Link>
      </div>
    </article>
  )
}

export default PostCard
