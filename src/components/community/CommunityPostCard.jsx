import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getInitials, isValidImageUrl } from '../../utils/avatar'
import PostImage from '../common/PostImage'
import InlineCommentSection from './InlineCommentSection'

const HeartIcon = ({ isLiked }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78v0z" />
  </svg>
)

const CommentIcon = ({ isActive }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

const SaveIcon = ({ isSaved }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
)

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
)

function CommunityPostCard({
  post,
  onToggleLike,
  onToggleSave,
  onToggleComment,
  onToggleShare,
  isCommentActive,
  isShareActive,
  currentUser,
  onCommentCountChange,
  highlightCommentId = '',
}) {
  const [toast, setToast] = useState('')
  const shareRef = useRef(null)
  const navigate = useNavigate()

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input') || e.target.closest('textarea')) return
    navigate(`/cong-dong/${post.id}`)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (isShareActive && shareRef.current && !shareRef.current.contains(event.target)) {
        onToggleShare(null) // Đóng khi click ngoài
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isShareActive, onToggleShare])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const shareUrl = `${window.location.origin}/cong-dong/${post.id}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      showToast('Đã sao chép liên kết bài viết')
    } catch {
      showToast('Lỗi khi sao chép liên kết')
    }
    onToggleShare(null)
  }

  return (
    <article className="community-post-card" id={post.id} data-testid="community-post-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="community-post-card__header">
        <div className="community-post-card__author">
          <Link to={`/nguoi-dung/${post.authorId}`} onClick={(e) => e.stopPropagation()}>
            {isValidImageUrl(post.avatar) ? (
              <img
                src={post.avatar}
                alt={`Ảnh đại diện của ${post.author}`}
                width="40"
                height="40"
                loading="lazy"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="community-post-card__avatar-placeholder" style={{ width: 40, height: 40, borderRadius: '50%', background: '#c1d95c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {getInitials(post.author)}
              </div>
            )}
          </Link>
          <div>
            <Link to={`/nguoi-dung/${post.authorId}`} onClick={(e) => e.stopPropagation()} style={{ color: 'inherit', textDecoration: 'none' }}>
              <strong>{post.author}</strong>
            </Link>
            <span>
              {post.time} {post.role ? `• ${post.role}` : ''}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {currentUser && currentUser.id !== post.authorId && (
            <button
              type="button"
              onClick={async (e) => {
                e.stopPropagation()
                const reason = window.prompt('Nhập lý do báo cáo bài viết này:')
                if (reason === null) return
                if (!reason.trim()) {
                  alert('Vui lòng nhập lý do báo cáo.')
                  return
                }
                const { createReport } = await import('../../services/reportService')
                const { error } = await createReport({ postId: post.id, reason: reason.trim() })
                if (error) {
                  alert(error.message || 'Lỗi gửi báo cáo.')
                } else {
                  alert('Báo cáo bài viết thành công.')
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#e53935',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: '4px 8px'
              }}
            >
              Báo cáo bài viết
            </button>
          )}
          <span className="community-post-card__menu">...</span>
        </div>
      </div>

      <div className="community-post-card__tags">
        <span className="community-post-card__tag community-post-card__tag--primary">{post.topic}</span>
        <span className="community-post-card__tag">{post.category}</span>
      </div>

      <div className="community-post-card__body">
        <Link to={`/cong-dong/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }} data-testid="community-post-link">
          <h2 style={{ overflowWrap: 'anywhere', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.title}</h2>
          <p>{post.excerpt}</p>
        </Link>
      </div>

      {post.image ? (
        <div className="community-post-card__media">
          <Link to={`/cong-dong/${post.id}`}>
            <PostImage src={post.image} alt={post.title} variant="card" />
          </Link>
        </div>
      ) : null}

      {/* Buttons */}
      {(!post.status || post.status === 'approved') && (
        <div className="community-post-card__actions" style={{ position: 'relative' }}>
          <button
            type="button"
            className={post.isLiked ? 'is-active' : ''}
            onClick={(event) => {
              event.stopPropagation()
              onToggleLike(post.id)
            }}
          >
            <HeartIcon isLiked={post.isLiked} /> Thích {post.likes > 0 && post.likes}
          </button>
          <button
            type="button"
            className={`comment-toggle-btn ${isCommentActive ? 'is-active' : ''}`}
            onClick={(event) => {
              event.stopPropagation()
              onToggleComment(post.id)
            }}
          >
            <CommentIcon isActive={isCommentActive} /> Bình luận {post.commentsCount > 0 && post.commentsCount}
          </button>
          <button
            type="button"
            className={post.isSaved ? 'is-active' : ''}
            onClick={(event) => {
              event.stopPropagation()
              onToggleSave(post.id)
            }}
          >
            <SaveIcon isSaved={post.isSaved} /> {post.isSaved ? 'Đã lưu' : 'Lưu bài'}
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              handleCopyLink()
            }}
          >
            <ShareIcon /> Chia sẻ
          </button>
        </div>
      )}

      {isCommentActive && (
        <div style={{ marginTop: '16px' }} onClick={(event) => event.stopPropagation()}>
          <InlineCommentSection
            postId={post.id}
            currentUser={currentUser}
            initialCount={post.commentsCount}
            isOpen={isCommentActive}
            onCountChange={onCommentCountChange}
            highlightCommentId={highlightCommentId}
          />
        </div>
      )}

      {toast && (
        <div className="ui-toast">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          {toast}
        </div>
      )}
    </article>
  )
}

export default CommunityPostCard
