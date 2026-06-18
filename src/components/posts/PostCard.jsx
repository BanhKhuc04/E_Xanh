import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bookmark, Clock3, Heart, MessageCircle } from 'lucide-react'
import PostImage from '../common/PostImage'
import PostAuthorAvatar from './PostAuthorAvatar'
import './PostCard.css'

function PostCard({ post }) {
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const authorHref = post.authorId ? `/nguoi-dung/${post.authorId}` : null

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
        <PostImage src={post.image} alt={`${post.title} - mẹo tiết kiệm điện`} variant="card" aspect="16:9" />
        <span className="post-card-ui__category">{post.category}</span>
        <button 
          type="button" 
          className="post-card-ui__save-button" 
          aria-label={`Lưu bài ${post.title}`}
          onClick={handleToggleSave}
          style={{ opacity: isSaved ? 1 : undefined, background: isSaved ? '#4f8428' : undefined, color: isSaved ? '#fff' : undefined }}
        >
          <Bookmark size={16} strokeWidth={2.1} />
          <span>{isSaved ? 'Đã lưu' : 'Lưu'}</span>
        </button>
      </div>

      <div className="post-card-ui__body">
        <h3>{post.title}</h3>
        <p>{post.description || 'Khám phá mẹo tiết kiệm điện thực tế, gần gũi và dễ áp dụng trong sinh hoạt hằng ngày.'}</p>

        <div className="post-card-ui__meta">
          <div className="post-card-ui__author">
            <Link
              to={authorHref || '#'}
              className={`post-card-ui__author-link${authorHref ? '' : ' is-disabled'}`}
              onClick={(e) => {
                if (!authorHref) e.preventDefault()
              }}
              aria-disabled={authorHref ? undefined : 'true'}
            >
              <PostAuthorAvatar
                src={post.authorAvatar}
                name={post.author}
                size="md"
              />
              <div className="post-card-ui__author-copy">
                <strong>{post.author}</strong>
                <span>
                  <Clock3 size={13} strokeWidth={2} />
                  {post.date} · {post.readTime}
                </span>
              </div>
            </Link>
          </div>

          <div className="post-card-ui__stats">
            <span>
              <Heart size={14} strokeWidth={2.1} />
              {post.likes} lượt thích
            </span>
            <span>
              <MessageCircle size={14} strokeWidth={2.1} />
              {post.comments} bình luận
            </span>
            <span>
              <Bookmark size={14} strokeWidth={2.1} />
              {post.savedCount} lượt lưu
            </span>
          </div>
        </div>

        <Link className="post-card-ui__link" to={`/meo-tiet-kiem/${post.slug || post.id}`} data-testid="tip-card-link">
          <span>Đọc tiếp</span>
          <ArrowRight size={16} strokeWidth={2.2} />
        </Link>
      </div>
    </article>
  )
}

export default PostCard
