import { useEffect, useMemo, useState } from 'react'
import { getInitials, isValidImageUrl } from '../../utils/avatar'
import { createComment, getCommentsByPost } from '../../services/commentService'

function formatRelativeTime(value) {
  if (!value) return 'Vừa xong'

  const createdAt = new Date(value)
  const diffInSeconds = Math.floor((Date.now() - createdAt.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Vừa xong'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`

  return createdAt.toLocaleDateString('vi-VN')
}

function InlineCommentSection({
  postId,
  currentUser,
  initialCount = 0,
  isOpen = true,
  onCountChange,
  variant = 'inline',
  title,
}) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loadedPostId, setLoadedPostId] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadComments() {
      if (!isOpen || !postId) return
      if (loadedPostId === postId) return

      setLoading(true)
      const { data, error: fetchError } = await getCommentsByPost(postId)

      if (!isMounted) return

      if (fetchError) {
        setError(fetchError.message || 'Không thể tải bình luận.')
      } else {
        setComments(data || [])
        setLoadedPostId(postId)
        setError('')
      }

      setLoading(false)
    }

    loadComments()

    return () => {
      isMounted = false
    }
  }, [isOpen, loadedPostId, postId])

  const totalCount = useMemo(
    () => Math.max(comments.length, initialCount),
    [comments.length, initialCount],
  )

  useEffect(() => {
    if (typeof onCountChange === 'function') {
      onCountChange(totalCount)
    }
  }, [onCountChange, totalCount])

  async function handleSubmit() {
    const trimmed = content.trim()
    if (!trimmed) {
      setError('Bình luận không được để trống.')
      return
    }

    if (!currentUser) {
      setError('Vui lòng đăng nhập để bình luận.')
      return
    }

    if (trimmed.length > 1000) {
      setError('Bình luận tối đa 1000 ký tự.')
      return
    }

    setSubmitting(true)
    setError('')

    const { data, error: createError } = await createComment(postId, trimmed)
    if (createError || !data) {
      setError(createError?.message || 'Không thể gửi bình luận.')
      setSubmitting(false)
      return
    }

    setComments((current) => [data, ...current])
    setContent('')
    setSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <section className={`inline-comments inline-comments--${variant}`}>
      {title ? (
        <div className="inline-comments__heading">
          <h2>{title}</h2>
          <span>{totalCount} bình luận</span>
        </div>
      ) : null}

      <div className="inline-comments__composer">
        {isValidImageUrl(currentUser?.avatar_url) ? (
          <img
            src={currentUser.avatar_url}
            alt={`Ảnh đại diện của ${currentUser.name || 'bạn'}`}
            className="inline-comments__avatar"
          />
        ) : (
          <span className="inline-comments__avatar inline-comments__avatar--fallback">
            {getInitials(currentUser?.name || currentUser?.email || 'EX')}
          </span>
        )}

        <div className="inline-comments__form">
          <textarea
            rows={variant === 'detail' ? 4 : 2}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={1000}
            placeholder={currentUser ? 'Viết bình luận của bạn...' : 'Đăng nhập để tham gia thảo luận'}
            disabled={!currentUser || submitting}
          />

          <div className="inline-comments__form-footer">
            <div className="inline-comments__meta">
              <span>{content.length}/1000 ký tự</span>
              {error ? <span className="inline-comments__error">{error}</span> : null}
            </div>

            <button
              type="button"
              className="btn btn--primary"
              onClick={handleSubmit}
              disabled={!currentUser || !content.trim() || submitting}
            >
              {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
            </button>
          </div>
        </div>
      </div>

      <div className="inline-comments__list">
        {loading ? <p className="inline-comments__state">Đang tải bình luận...</p> : null}
        {!loading && comments.length === 0 ? (
          <p className="inline-comments__state">Chưa có bình luận nào. Hãy là người đầu tiên bắt đầu cuộc trò chuyện.</p>
        ) : null}

        {!loading
          ? comments.map((comment) => (
              <article key={comment.id} className="inline-comments__item">
                {isValidImageUrl(comment.avatar) ? (
                  <img
                    src={comment.avatar}
                    alt={`Ảnh đại diện của ${comment.author}`}
                    className="inline-comments__item-avatar"
                  />
                ) : (
                  <span className="inline-comments__item-avatar inline-comments__item-avatar--fallback">
                    {getInitials(comment.author)}
                  </span>
                )}

                <div className="inline-comments__bubble">
                  <div className="inline-comments__item-meta">
                    <strong>{comment.author}</strong>
                    <span>{formatRelativeTime(comment.createdAt)}</span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </article>
            ))
          : null}
      </div>
    </section>
  )
}

export default InlineCommentSection
