import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Clock3, Heart, MessageCircle } from 'lucide-react'
import SmartImage from '../media/SmartImage'
import PostAuthorAvatar from './PostAuthorAvatar'

function PostCard({ post }) {
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const authorHref = post.authorId ? `/nguoi-dung/${post.authorId}` : null
  const postUrl = `/meo-tiet-kiem/${post.slug || post.id}`

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
    e.preventDefault() 
    e.stopPropagation() // prevent navigating via overlay link
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
    <article className="tips-post-card" data-testid="tip-card">
      <Link to={postUrl} className="tips-post-card__overlay-link" aria-label={`Đọc chi tiết: ${post.title}`} />
      
      <div className="tips-post-card__media">
        <SmartImage src={post.image} alt={`${post.title} - mẹo tiết kiệm điện`} ratio="16/9" priority={false} />
        <span className="tips-post-card__badge">{post.category}</span>
        <button 
          type="button" 
          className="tips-post-card__save-btn" 
          aria-label={`Lưu bài ${post.title}`}
          onClick={handleToggleSave}
          style={{ opacity: isSaved ? 1 : undefined, background: isSaved ? '#4f8428' : undefined, color: isSaved ? '#fff' : undefined }}
        >
          <Bookmark size={16} strokeWidth={2.1} />
        </button>
      </div>

      <div className="tips-post-card__body">
        <h3 className="tips-post-card__title">{post.title}</h3>
        <p className="tips-post-card__desc">{post.description || 'Khám phá mẹo tiết kiệm điện thực tế, gần gũi và dễ áp dụng trong sinh hoạt hằng ngày.'}</p>

        <div className="tips-post-card__footer">
          <Link
            to={authorHref || '#'}
            className="tips-post-card__author"
            onClick={(e) => {
              if (!authorHref) {
                e.preventDefault()
                e.stopPropagation()
              } else {
                e.stopPropagation()
              }
            }}
          >
            <PostAuthorAvatar
              src={post.authorAvatar}
              name={post.author}
              size="sm"
              className="tips-post-card__avatar"
            />
            <div className="tips-post-card__author-info">
              <span className="tips-post-card__author-name">{post.author}</span>
              <span className="tips-post-card__author-time">
                <Clock3 size={12} strokeWidth={2.5} style={{marginRight: '3px', verticalAlign: '-1px'}} />
                {post.date} · {post.readTime}
              </span>
            </div>
          </Link>

          <div className="tips-post-card__stats">
            <span className="tips-post-card__stat">
              <Heart size={16} strokeWidth={2} />
              {post.likes}
            </span>
            <span className="tips-post-card__stat">
              <MessageCircle size={16} strokeWidth={2} />
              {post.comments}
            </span>
            <span className="tips-post-card__stat">
              <Bookmark size={16} strokeWidth={2} />
              {post.savedCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default PostCard
