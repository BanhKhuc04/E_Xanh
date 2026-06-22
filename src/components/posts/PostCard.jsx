import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Clock3, Heart, MessageCircle } from 'lucide-react'
import OptimizedImage from '../common/OptimizedImage'
import PostAuthorAvatar from './PostAuthorAvatar'
import Toast from '../common/Toast'

function PostCard({ post, onToggleLike }) {
  const [isSaved, setIsSaved] = useState(post?.isSaved || false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLiked, setIsLiked] = useState(post?.isLiked || false)
  const [likesCount, setLikesCount] = useState(post?.likes || 0)
  const [isLiking, setIsLiking] = useState(false)
  const [toast, setToast] = useState(null)
  
  const authorHref = post?.authorId ? `/nguoi-dung/${post.authorId}` : null
  const postUrl = `/meo-tiet-kiem/${post?.slug || post?.id}`

  // Sync state if props change
  useEffect(() => {
    if (post?.isSaved !== undefined) setIsSaved(post.isSaved)
    if (post?.isLiked !== undefined) setIsLiked(post.isLiked)
    if (post?.likes !== undefined) setLikesCount(post.likes)
  }, [post?.isSaved, post?.isLiked, post?.likes])

  useEffect(() => {
    async function checkSaved() {
      if (!post?.id || post?.isSaved !== undefined) return
      // Skip check for mock IDs (UUID length is 36)
      if (String(post.id).length < 30) return
      
      const { isPostSaved } = await import('../../services/interactionService')
      const { data } = await isPostSaved(post.id)
      if (data) setIsSaved(true)
    }
    checkSaved()
  }, [post?.id, post?.isSaved])

  async function handleToggleSave(e) {
    e.preventDefault() 
    e.stopPropagation() // prevent navigating via overlay link
    if (isSaving) return

    setIsSaving(true)
    const { savePost, unsavePost } = await import('../../services/interactionService')
    
    if (!post?.id || String(post.id).length < 30) {
      setToast({ type: 'warning', message: 'Chức năng lưu bài chỉ hỗ trợ bài viết thật trên hệ thống.' })
      setIsSaving(false)
      return
    }

    if (isSaved) {
      const { error } = await unsavePost(post.id)
      if (!error) setIsSaved(false)
      else setToast({ type: 'error', message: error.message })
    } else {
      const { error } = await savePost(post.id)
      if (!error) setIsSaved(true)
      else setToast({ type: 'error', message: error.message })
    }
    setIsSaving(false)
  }

  async function handleToggleLikeClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (isLiking) return

    if (onToggleLike) {
      return onToggleLike(post.id)
    }

    setIsLiking(true)
    const { likePost, unlikePost } = await import('../../services/interactionService')
    
    if (!post?.id || String(post.id).length < 30) {
      setToast({ type: 'warning', message: 'Chức năng thích chỉ hỗ trợ bài viết thật trên hệ thống.' })
      setIsLiking(false)
      return
    }

    if (isLiked) {
      setLikesCount(prev => Math.max(0, prev - 1))
      setIsLiked(false)
      const { error } = await unlikePost(post.id)
      if (error) {
        setLikesCount(prev => prev + 1)
        setIsLiked(true)
        setToast({ type: 'error', message: error.message })
      }
    } else {
      setLikesCount(prev => prev + 1)
      setIsLiked(true)
      const { error } = await likePost(post.id)
      if (error) {
        setLikesCount(prev => Math.max(0, prev - 1))
        setIsLiked(false)
        setToast({ type: 'error', message: error.message })
      }
    }
    setIsLiking(false)
  }

  return (
    <>
      <article className="tips-post-card" data-testid="tip-card">
        <Link to={postUrl} className="tips-post-card__overlay-link" aria-label={`Đọc chi tiết: ${post?.title}`} />
        
        <div className="tips-post-card__media">
          <OptimizedImage src={post?.cover_card_url || post?.cover_url || post?.image} variants={post?.variants} alt={`${post?.title} - mẹo tiết kiệm điện`} ratio="16/9" loading="lazy" />
          <span className="tips-post-card__badge">{post?.category}</span>
          <button 
            type="button" 
            className="tips-post-card__save-btn" 
            aria-label={`Lưu bài ${post?.title}`}
            onClick={handleToggleSave}
            style={{ opacity: isSaved ? 1 : undefined, background: isSaved ? '#4f8428' : undefined, color: isSaved ? '#fff' : undefined }}
          >
            <Bookmark size={16} strokeWidth={2.1} />
          </button>
        </div>

        <div className="tips-post-card__body">
          <h3 className="tips-post-card__title">{post?.title}</h3>
          <p className="tips-post-card__desc">{post?.description || 'Khám phá mẹo tiết kiệm điện thực tế, gần gũi và dễ áp dụng trong sinh hoạt hằng ngày.'}</p>

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
                src={post?.authorAvatar}
                name={post?.author}
                size="sm"
                className="tips-post-card__avatar"
              />
              <div className="tips-post-card__author-info">
                <span className="tips-post-card__author-name">{post?.author}</span>
                <span className="tips-post-card__author-time">
                  <Clock3 size={12} strokeWidth={2.5} style={{marginRight: '3px', verticalAlign: '-1px'}} />
                  {post?.date} · {post?.readTime}
                </span>
              </div>
            </Link>

            <div className="tips-post-card__stats">
              <button 
                type="button" 
                className={`tips-post-card__stat-btn tips-post-card__stat ${isLiked ? 'is-liked' : ''}`}
                onClick={handleToggleLikeClick}
                aria-label={isLiked ? "Bỏ thích" : "Thích"}
                style={{ zIndex: 2, position: 'relative' }}
              >
                <Heart size={16} strokeWidth={2.5} fill={isLiked ? "currentColor" : "none"} />
                {likesCount}
              </button>
              <span className="tips-post-card__stat">
                <MessageCircle size={16} strokeWidth={2} />
                {post?.comments}
              </span>
              <span className="tips-post-card__stat">
                <Bookmark size={16} strokeWidth={2} />
                {post?.savedCount}
              </span>
            </div>
          </div>
        </div>
      </article>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </>
  )
}

export default PostCard
