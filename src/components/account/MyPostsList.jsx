import { useNavigate, Link } from 'react-router-dom'
import PostImage from '../common/PostImage'
import './MyPostsList.css'
import { resolvePostImageSource } from '../../utils/postMedia'

function formatDate(dateString) {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'approved': return 'Đã duyệt'
    case 'pending': return 'Chờ duyệt'
    case 'rejected': return 'Bị từ chối'
    case 'Đã duyệt': return 'Đã duyệt'
    case 'Chờ duyệt': return 'Chờ duyệt'
    default: return status || 'Chờ duyệt'
  }
}

function getStatusClass(status) {
  if (status === 'Đã duyệt' || status === 'approved') return 'is-approved'
  if (status === 'rejected') return 'is-rejected'
  return 'is-pending'
}

function getPostTypeLabel(type) {
  switch (type) {
    case 'community': return 'Cộng đồng'
    case 'qa': return 'Hỏi đáp'
    case 'review': return 'Review thiết bị'
    case 'tip': return 'Mẹo tiết kiệm'
    default: return 'Bài viết'
  }
}

function getPostSummary(post) {
  const rawText = post.excerpt || post.description || post.content || ''
  const compact = String(rawText).replace(/\s+/g, ' ').trim()
  if (!compact) {
    return 'Bài viết chia sẻ kinh nghiệm và góc nhìn thực tế cùng cộng đồng E-XANH.'
  }
  return compact.length > 160 ? `${compact.slice(0, 157)}...` : compact
}

/* ─── Skeleton Loading ─────────────────────────────────────────────────────── */
function SkeletonCards({ count = 3 }) {
  return (
    <div className="my-posts-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="my-posts-skeleton__card">
          <div className="my-posts-skeleton__content">
            <div className="my-posts-skeleton__line my-posts-skeleton__line--title" />
            <div className="my-posts-skeleton__line my-posts-skeleton__line--title-short" />
            <div className="my-posts-skeleton__line my-posts-skeleton__line--text" />
            <div className="my-posts-skeleton__line my-posts-skeleton__line--text-short" />
            <div className="my-posts-skeleton__line my-posts-skeleton__line--btn" />
          </div>
          <div className="my-posts-skeleton__image" />
        </div>
      ))}
    </div>
  )
}

/* ─── Empty State ──────────────────────────────────────────────────────────── */
function EmptyState({ isPublicView }) {
  return (
    <div className="my-posts-empty">
      <div className="my-posts-empty__icon">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>
      <h3>{isPublicView ? 'Chưa có bài viết công khai' : 'Chưa có bài viết nào'}</h3>
      <p>
        {isPublicView
          ? 'Người dùng này chưa đăng bài viết nào.'
          : 'Hãy chia sẻ kiến thức và kinh nghiệm tiết kiệm điện với cộng đồng.'}
      </p>
      {!isPublicView && (
        <Link to="/dang-bai" className="btn btn--primary btn--small">
          Viết bài đầu tiên
        </Link>
      )}
    </div>
  )
}

/* ─── Public Post Card ─────────────────────────────────────────────────────── */
function PublicCard({ post, onView }) {
  const dateStr = formatDate(post.created_at)
  const summary = getPostSummary(post)
  const typeLabel = getPostTypeLabel(post.type)

  return (
    <article className="public-post-card">
      <div className="public-post-card__content">
        <div className="public-post-card__top">
          <span className="public-post-card__type">{typeLabel}</span>
          <h3>{post.title}</h3>
          <p className="public-post-card__excerpt">{summary}</p>
        </div>
        <div className="public-post-card__meta">
          <span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {post.likes_count || post.likes || 0} thích
          </span>
          <span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            {post.comments_count || post.comments || 0} bình luận
          </span>
          {dateStr && (
            <span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {dateStr}
            </span>
          )}
        </div>
        <div className="public-post-card__actions">
          <button type="button" className="btn btn--primary btn--small" onClick={() => onView(post)}>
            Xem bài viết
          </button>
        </div>
      </div>
      <div className="public-post-card__thumbnail" onClick={() => onView(post)}>
        <PostImage
          src={resolvePostImageSource(post)}
          alt={post.title}
          variant="thumbnail"
          aspect="16:9"
        />
      </div>
    </article>
  )
}

/* ─── Private Post Card ────────────────────────────────────────────────────── */
function PrivateCard({ post, onView }) {
  const dateStr = formatDate(post.created_at)
  const statusLabel = getStatusLabel(post.status)
  const statusClass = getStatusClass(post.status)
  const rejectionCount = post.rejection_count || 1
  const canResubmit = post.status === 'rejected' && rejectionCount < 3
  const summary = getPostSummary(post)
  const typeLabel = getPostTypeLabel(post.type)

  return (
    <article className="private-post-card">
      <div className="private-post-card__content">
        <div className="private-post-card__header">
          <div className="private-post-card__headline">
            <span className="private-post-card__type">{typeLabel}</span>
            <h3>{post.title}</h3>
          </div>
          <div className="private-post-card__status-area">
            <span className={`private-post-card__status ${statusClass}`}>
              {statusLabel}
            </span>
            {post.status === 'rejected' && (
              <span className="private-post-card__rejection-count">
                Bị từ chối: {rejectionCount}/3
              </span>
            )}
          </div>
        </div>

        {post.status === 'rejected' && post.rejection_reason && (
          <div className="private-post-card__rejection-reason">
            <strong>Lý do:</strong> {post.rejection_reason}
          </div>
        )}

        {post.status === 'rejected' && rejectionCount >= 3 && (
          <div className="private-post-card__rejection-max">
            Bài viết đã bị từ chối quá 3 lần và không thể nộp lại.
          </div>
        )}

        <p className="private-post-card__excerpt">{summary}</p>

        <div className="private-post-card__meta">
          <span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {post.likes_count || post.likes || 0} thích
          </span>
          <span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            {post.comments_count || post.comments || 0} bình luận
          </span>
          {dateStr && (
            <span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {dateStr}
            </span>
          )}
        </div>
      </div>

      <div className="private-post-card__thumbnail" onClick={() => onView(post)}>
        <PostImage
          src={resolvePostImageSource(post)}
          alt={post.title}
          variant="thumbnail"
          aspect="16:9"
        />
      </div>

      <div className="private-post-card__actions">
        <button type="button" className="btn btn--primary btn--small" onClick={() => onView(post)}>
          Xem bài viết
        </button>
        {canResubmit && (
          <button className="btn btn--secondary btn--small" disabled title="Tính năng đang phát triển" aria-disabled="true">
            Chỉnh sửa/Nộp lại
          </button>
        )}
        {post.status !== 'rejected' && (
          <button className="btn btn--secondary btn--small" disabled title="Tính năng đang phát triển" aria-disabled="true">
            Chỉnh sửa
          </button>
        )}
      </div>
    </article>
  )
}

/* ─── Main Component ───────────────────────────────────────────────────────── */
function MyPostsList({ posts, isPublicView = false, loading = false }) {
  const navigate = useNavigate()

  const displayPosts = isPublicView ? posts.filter(p => p.status === 'approved') : posts

  function handleView(post) {
    if (post.type === 'community') {
      navigate(`/cong-dong/${post.id}`)
    } else {
      navigate(`/meo-tiet-kiem/${post.slug || post.id}`)
    }
  }

  return (
    <section className="account-panel">
      <div className="account-panel__header">
        <h2>{isPublicView ? 'Bài viết đã đăng' : 'Bài viết của tôi'}</h2>
      </div>

      {loading ? (
        <SkeletonCards count={3} />
      ) : displayPosts.length === 0 ? (
        <EmptyState isPublicView={isPublicView} />
      ) : (
        <div className="my-posts-list">
          {displayPosts.map((post) =>
            isPublicView ? (
              <PublicCard key={post.id || post.title} post={post} onView={handleView} />
            ) : (
              <PrivateCard key={post.id || post.title} post={post} onView={handleView} />
            )
          )}
        </div>
      )}
    </section>
  )
}

export default MyPostsList
