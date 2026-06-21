import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bookmark, Heart, Link2, MessageCircle, UserRound } from 'lucide-react'
import { getInitials, isValidImageUrl, normalizeAvatarUrl } from '../../utils/avatar'
import InlineCommentSection from './InlineCommentSection'
import OptimizedImage from '../common/OptimizedImage'

const COMMUNITY_IMAGE_FALLBACK = '/og-image-v2.png'

function copyTextUsingExecCommand(text) {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.setAttribute('readonly', '')
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  textArea.style.pointerEvents = 'none'
  document.body.appendChild(textArea)
  textArea.select()

  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    document.body.removeChild(textArea)
  }
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await Promise.race([
        navigator.clipboard.writeText(text),
        new Promise((_, reject) => {
          window.setTimeout(() => reject(new Error('clipboard-timeout')), 400)
        }),
      ])
      return true
    } catch {
      return copyTextUsingExecCommand(text)
    }
  }

  return copyTextUsingExecCommand(text)
}

/* ── Placeholder khi bài không có ảnh ── */
function ImagePlaceholder() {
  return (
    <div className="pc-image-placeholder" aria-hidden="true">
      <svg viewBox="0 0 64 64" width="46" height="46" fill="none">
        {/* Leaf */}
        <path
          d="M32 7C17 7 9 20 9 35c0 11 7 19 15 21 2-11 8-19 18-23-8 6-12 14-12 23 9-2 15-10 15-21 0-15-4-25-13-28z"
          fill="rgba(79,132,40,0.25)"
          stroke="rgba(79,132,40,0.48)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bolt */}
        <path
          d="M36 25l-8 13h7l-2 10 10-14h-7l2-9z"
          fill="rgba(79,132,40,0.5)"
          stroke="rgba(79,132,40,0.6)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>
      <span>Bài chia sẻ cộng đồng</span>
    </div>
  )
}

/* ── Avatar placeholder chữ cái ── */
function AvatarPlaceholder({ name }) {
  return (
    <div className="pc-avatar-placeholder">
      <span className="pc-avatar-placeholder__icon" aria-hidden="true">
        <UserRound size={18} strokeWidth={2.1} />
      </span>
      {getInitials(name)}
    </div>
  )
}

function AuthorAvatar({ src, name }) {
  const [failed, setFailed] = useState(false)
  const normalizedSrc = normalizeAvatarUrl(src)

  if (!normalizedSrc || !isValidImageUrl(normalizedSrc) || failed) {
    return <AvatarPlaceholder name={name} />
  }

  return (
    <img
      src={normalizedSrc}
      alt={`Ảnh đại diện của ${name}`}
      className="community-post-card__avatar-img"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

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
  const toastTimeoutRef = useRef(null)
  const navigate = useNavigate()

  // Đảm bảo không hiển thị "Ẩn danh" khi có authorId
  const authorName = post.author || (post.authorId ? 'Thành viên E-XANH' : 'Ẩn danh')
  const imageUrl = post.cover_card_url || post.cover_url || post.image_url || post.image
  const hasImage = isValidImageUrl(imageUrl)

  const handleCardClick = (e) => {
    if (
      e.target.closest('button') ||
      e.target.closest('a') ||
      e.target.closest('input') ||
      e.target.closest('textarea')
    ) return
    navigate(`/cong-dong/${post.id}`)
  }

  useEffect(() => {
    if (!isShareActive) return
    const handleOutside = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        onToggleShare(null)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [isShareActive, onToggleShare])

  const showToast = (msg) => {
    window.clearTimeout(toastTimeoutRef.current)
    setToast(msg)
    toastTimeoutRef.current = window.setTimeout(() => setToast(''), 6000)
  }

  useEffect(() => () => {
    window.clearTimeout(toastTimeoutRef.current)
  }, [])

  const handleSaveLink = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const shareUrl = `${window.location.origin}/cong-dong/${post.id}`

    try {
      const copied = await copyTextToClipboard(shareUrl)
      showToast(copied ? 'Đã lưu liên kết' : 'Không thể lưu liên kết')
    } catch {
      showToast('Không thể lưu liên kết')
    }
  }

  const authorProfilePath = post.authorId ? `/nguoi-dung/${post.authorId}` : ''

  return (
    <article
      className="community-post-card community-card"
      id={post.id}
      data-testid="community-post-card"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* ══════════ GRID 2 CỘT ══════════ */}
      <div className="community-post-card__grid">

        {/* ── Cột trái: nội dung ── */}
        <div className="community-post-card__left">

          {/* Header: avatar + tên + ngày */}
          <div className="community-post-card__header">
            <div className="community-post-card__author">
              {authorProfilePath ? (
                <Link to={authorProfilePath} onClick={(e) => e.stopPropagation()} className="community-post-card__avatar-link">
                  <AuthorAvatar src={post.avatar} name={authorName} />
                </Link>
              ) : (
                <span className="community-post-card__avatar-link" aria-label={authorName}>
                  <AuthorAvatar src={post.avatar} name={authorName} />
                </span>
              )}
              <div className="community-post-card__author-info">
                {authorProfilePath ? (
                  <Link
                    to={authorProfilePath}
                    onClick={(e) => e.stopPropagation()}
                    className="community-post-card__author-name"
                  >
                    {authorName}
                  </Link>
                ) : (
                  <span className="community-post-card__author-name">{authorName}</span>
                )}
                <span className="community-post-card__date">
                  {post.time}{post.role ? ` · ${post.role}` : ''}
                </span>
              </div>
            </div>

            {/* Nút báo cáo */}
            {currentUser && currentUser.id !== post.authorId && (
              <button
                type="button"
                className="community-post-card__report-btn"
                onClick={async (e) => {
                  e.stopPropagation()
                  const reason = window.prompt('Nhập lý do báo cáo bài viết này:')
                  if (!reason?.trim()) return
                  const { createReport } = await import('../../services/reportService')
                  const { error } = await createReport({ postId: post.id, reason: reason.trim() })
                  showToast(error ? (error.message || 'Lỗi gửi báo cáo.') : 'Đã gửi báo cáo thành công.')
                }}
              >
                Báo cáo
              </button>
            )}
          </div>

          {/* Tags */}
          <div className="community-post-card__tags">
            {post.topic && (
              <span className="community-post-card__tag community-post-card__tag--primary">
                {post.topic}
              </span>
            )}
            {post.category && (
              <span className="community-post-card__tag">{post.category}</span>
            )}
          </div>

          {/* Tiêu đề + excerpt */}
          <div className="community-post-card__body">
            <Link
              to={`/cong-dong/${post.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
              data-testid="community-post-link"
            >
              <h2 className="community-post-card__title">{post.title}</h2>
              <p className="community-post-card__excerpt">{post.excerpt}</p>
            </Link>
          </div>

          {/* Footer: Reactions Summary + Actions */}
          {(!post.status || post.status === 'approved') && (
            <div className="community-post-card__footer">
              <div className="post-stats">
                <span>{post.likes} lượt thích</span>
                <span>{post.commentsCount} bình luận</span>
              </div>

              <div className="post-actions">
                <button
                  type="button"
                  className={`post-action-btn${post.isLiked ? ' is-active is-liked' : ''}`}
                  onClick={(e) => { e.stopPropagation(); onToggleLike(post.id) }}
                >
                  <Heart size={18} strokeWidth={2.2} fill={post.isLiked ? "currentColor" : "none"} />
                  <span>Thích</span>
                </button>

                <button
                  type="button"
                  className={`post-action-btn comment-toggle-btn${isCommentActive ? ' is-active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); onToggleComment(post.id) }}
                >
                  <MessageCircle size={18} strokeWidth={2.2} />
                  <span>Bình luận</span>
                </button>

                <button
                  type="button"
                  className={`post-action-btn${post.isSaved ? ' is-active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); onToggleSave(post.id) }}
                >
                  <Bookmark size={18} strokeWidth={2.2} fill={post.isSaved ? "currentColor" : "none"} />
                  <span>Lưu bài</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Cột phải: ảnh + pill Chia sẻ ── */}
        <div className="community-post-card__right community-card__media" ref={shareRef}>
          <div
            className="community-post-card__image-wrap"
          >
            {hasImage ? (
              <OptimizedImage
                src={imageUrl || COMMUNITY_IMAGE_FALLBACK}
                variants={{
                  card: post.cover_card_url,
                  thumb: post.cover_thumb_url
                }}
                alt={post.title}
                className="community-post-card__image"
                ratio="16/9"
                objectFit="cover"
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>

          {/* Pill lưu liên kết — góc trên phải */}
          {(!post.status || post.status === 'approved') && (
            <button
              type="button"
              className="share-pill community-post-card__share-pill"
              onClick={handleSaveLink}
              title="Lưu liên kết bài viết"
            >
              <Link2 size={16} strokeWidth={2.2} />
              <span>Lưu liên kết</span>
            </button>
          )}
        </div>

      </div>
      {/* ══════════ END GRID ══════════ */}

      {/* Bình luận — full-width bên dưới */}
      {isCommentActive && (
        <div className="community-post-card__comments" onClick={(e) => e.stopPropagation()}>
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

      {/* Toast */}
      {toast && (
        <div className="ui-toast toast" role="status" aria-live="polite">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          {toast}
        </div>
      )}
    </article>
  )
}

export default CommunityPostCard
