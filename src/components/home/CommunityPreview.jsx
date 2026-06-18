import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Bookmark,
  Heart,
  MessageCircle,
  Share2,
  UserRound,
} from 'lucide-react'
import ActiveMembersPanel from '../community/ActiveMembersPanel'
import { usePostComposer } from '../community/PostComposerContext'
import { getInitials, isValidImageUrl, normalizeAvatarUrl } from '../../utils/avatar'
import PostImage from '../common/PostImage'

/* ── Tính thời gian tương đối ── */
function getTimeAgo(dateString) {
  const diff = Math.floor((Date.now() - new Date(dateString)) / 1000)
  if (diff < 60) return 'Vừa xong'
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`
  return new Date(dateString).toLocaleDateString('vi-VN')
}

/* ── Placeholder ảnh xanh nhạt ── */
function ImagePlaceholder() {
  return (
    <div className="pc-image-placeholder pc-image-placeholder--sm" aria-hidden="true">
      <svg viewBox="0 0 48 48" width="34" height="34" fill="none">
        <path
          d="M24 4C14 4 7 14 7 25c0 8 5 14 11 16 1-8 6-14 14-17-7 5-10 11-10 17 6-2 11-8 11-16 0-11-3-19-9-21z"
          fill="rgba(79,132,40,0.25)"
          stroke="rgba(79,132,40,0.45)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path d="M27 18l-6 9h5l-2 8 8-11h-6l1-6z" fill="rgba(79,132,40,0.48)" />
      </svg>
      <span>Bài chia sẻ cộng đồng</span>
    </div>
  )
}

function PreviewAuthorAvatar({ src, name }) {
  const [failed, setFailed] = useState(false)
  const normalizedSrc = normalizeAvatarUrl(src)

  if (!normalizedSrc || !isValidImageUrl(normalizedSrc) || failed) {
    return (
      <span
        className="community-composer__avatar--fallback community-preview__avatar-fallback"
        style={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}
      >
        <span className="community-preview__avatar-icon" aria-hidden="true">
          <UserRound size={16} strokeWidth={2.1} />
        </span>
        {getInitials(name)}
      </span>
    )
  }

  return (
    <img
      src={normalizedSrc}
      alt={name}
      className="community-post-card__avatar-img"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

function CommunityPreview() {
  const { openComposer } = usePostComposer()
  const [posts, setPosts] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [membersLoading, setMembersLoading] = useState(true)
  const [membersError, setMembersError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const { getRecentCommunityPosts, getTopActiveMembers } = await import('../../services/postService')
        const [postsRes, membersRes] = await Promise.all([
          getRecentCommunityPosts(3),
          getTopActiveMembers(3),
        ])
        if (postsRes.error) throw postsRes.error
        if (postsRes.data) setPosts(postsRes.data)
        if (membersRes.error) {
          console.error('[CommunityPreview] active members error:', membersRes.error)
          setMembersError('Không thể tải thành viên tích cực.')
          setMembers([])
        } else if (membersRes.data) {
          setMembers(membersRes.data)
          setMembersError('')
        }
      } catch (err) {
        console.error('Lỗi tải dữ liệu cộng đồng:', err)
        setMembersError('Không thể tải thành viên tích cực.')
      } finally {
        setLoading(false)
        setMembersLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section className="home-section">
      <div className="community-preview">

        {/* ════ Feed bài viết ════ */}
        <div className="community-preview__feed">
          <div className="home-section__header home-section__header--stacked">
            <div>
              <h2>Hoạt động cộng đồng</h2>
              <p>Nơi trao đổi, chia sẻ và thảo luận về các vấn đề tiết kiệm năng lượng</p>
            </div>
          </div>

          <div className="community-preview__posts">
            {loading ? (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '20px' }}>
                Đang tải...
              </p>
            ) : posts.length === 0 ? (
              <div className="community-preview__empty">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="var(--color-primary-500)" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <p>Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!</p>
              </div>
            ) : (
              posts.map((post) => {
                const prefs = post.profiles?.user_preferences || {}
                const visibility = prefs.profile_visibility || 'public'
                
                const getRealName = () => {
                  if (post.profiles?.name) return post.profiles.name
                  if (post.profiles?.display_name) return post.profiles.display_name
                  return 'Thành viên E-XANH'
                }

                const authorName = visibility === 'public' ? getRealName() : 'Thành viên E-XANH'
                const avatarUrl = visibility === 'public' ? post.profiles?.avatar_url || null : null

                const hasImage = post.image_url?.startsWith('http')

                return (
                  <article key={post.id} className="community-preview__post community-card">
                    {/* Grid 2 cột */}
                    <div className="community-preview__post-grid">

                      {/* Cột trái */}
                      <div className="community-preview__post-left">
                        <div className="community-post-card__author">
                          <Link to={`/nguoi-dung/${post.author_id}`} onClick={(e) => e.stopPropagation()} className="community-post-card__avatar-link">
                            <PreviewAuthorAvatar src={avatarUrl} name={authorName} />
                          </Link>
                          <div className="community-post-card__author-info">
                            <Link
                              to={`/nguoi-dung/${post.author_id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="community-post-card__author-name"
                            >
                              {authorName}
                            </Link>
                            <span className="community-post-card__date">
                              {getTimeAgo(post.created_at)}
                            </span>
                          </div>
                        </div>

                        {/* Excerpt */}
                        <Link to={`/cong-dong/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <p className="community-preview__excerpt">
                            {post.description ||
                              (post.content
                                ? post.content.substring(0, 180) + (post.content.length > 180 ? '…' : '')
                                : '')}
                          </p>
                        </Link>

                        {/* Footer: Reactions Summary + Actions */}
                        <div className="community-post-card__footer">
                          <div className="post-stats">
                            <span>{post.likes_count || 0} lượt thích</span>
                            <span>{post.comments_count || 0} bình luận</span>
                          </div>

                          <div className="post-actions">
                            <Link to={`/cong-dong/${post.id}`} className="post-action-btn" style={{ textDecoration: 'none' }}>
                              <Heart size={18} strokeWidth={2.2} />
                              <span>Thích</span>
                            </Link>

                            <Link to={`/cong-dong/${post.id}`} className="post-action-btn" style={{ textDecoration: 'none' }}>
                              <MessageCircle size={18} strokeWidth={2.2} />
                              <span>Bình luận</span>
                            </Link>

                            <Link to={`/cong-dong/${post.id}`} className="post-action-btn" style={{ textDecoration: 'none' }}>
                              <Bookmark size={18} strokeWidth={2.2} />
                              <span>Lưu bài</span>
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Cột phải: ảnh */}
                      <div className="community-preview__post-image-col community-card__media">
                        <Link
                          to={`/cong-dong/${post.id}`}
                          className="community-preview__post-image-wrap"
                          tabIndex={-1}
                          aria-hidden="true"
                        >
                          {hasImage ? (
                            <PostImage
                              src={post.image_url}
                              alt={post.title || 'Ảnh bài viết'}
                              className="community-preview__post-image"
                              variant="thumbnail"
                              aspect="16:9"
                            />
                          ) : (
                            <ImagePlaceholder />
                          )}
                        </Link>
                        {/* Pill nhỏ */}
                        <Link
                          to={`/cong-dong/${post.id}`}
                          className="share-pill community-preview__share-pill"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Share2 size={16} strokeWidth={2.2} />
                          <span>Chia sẻ</span>
                        </Link>
                      </div>

                    </div>
                  </article>
                )
              })
            )}
          </div>

          <Link className="btn community-preview__button" to="/cong-dong">
            Xem cộng đồng
          </Link>
        </div>

        {/* ════ Sidebar ════ */}
        <aside className="community-preview__sidebar">

          {/* Thành viên tích cực */}
          <ActiveMembersPanel
            members={members}
            loading={membersLoading}
            error={membersError}
            className="community-preview__members"
          />

          {/* CTA */}
          <section className="community-preview__cta">
            <h3>Có kinh nghiệm hay?</h3>
            <p>Chia sẻ mẹo tiết kiệm điện của bạn để giúp nhiều người hơn.</p>
            <button
              type="button"
              className="btn btn--light"
              onClick={() => openComposer({ defaultType: 'community' })}
            >
              Đăng bài ngay
            </button>
          </section>
        </aside>

      </div>
    </section>
  )
}

export default CommunityPreview
