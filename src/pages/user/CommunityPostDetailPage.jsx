import { useState, useEffect } from 'react'
import { useParams, Link, useLocation, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import PostBlockRenderer from '../../components/community/PostBlockRenderer'
import OptimizedImage from '../../components/common/OptimizedImage'
import UserAvatar from '../../components/common/UserAvatar'
import { getPostById } from '../../services/postService'
import { getCurrentSession, getCurrentUserProfile } from '../../services/authService'
import InlineCommentSection from '../../components/community/InlineCommentSection'
import './CommunityPostDetailPage.css'

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return true
  }

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
  } finally {
    document.body.removeChild(textArea)
  }
}

// SVG Icons
const HeartIcon = ({ isLiked }) => (
  <svg viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)
const CommentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)
const SaveIcon = ({ isSaved }) => (
  <svg viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
)
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
)

function CommunityPostDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [searchParams] = useSearchParams()
  const highlightCommentId = searchParams.get('comment') || ''
  
  const [isCommentActive, setIsCommentActive] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`
  const SITE_URL = 'https://e-xanh.vercel.app'
  const fallbackOgImage = `${SITE_URL}/og-image-v2.png`

  useEffect(() => {
    async function loadData() {
      let userId = null
      try {
        const session = await getCurrentSession()
        if (session?.user) {
          userId = session.user.id
          const profile = await getCurrentUserProfile(session.user.id)
          setCurrentUser(profile || { id: session.user.id, name: 'Người dùng', avatar_url: null, role: profile?.role })
        }
      } catch (e) {
        console.warn('Cannot fetch user for community post detail page:', e)
      }

      try {
        const { data, error } = await getPostById(id)
        if (!error && data) {
          let isLiked = false
          let isSaved = false
          if (userId) {
            const { isPostLiked, isPostSaved } = await import('../../services/interactionService')
            const [likedRes, savedRes] = await Promise.all([
              isPostLiked(id),
              isPostSaved(id)
            ])
            isLiked = likedRes.data || false
            isSaved = savedRes.data || false
          }

          const formattedPost = {
            id: data.id,
            author: data.profiles?.name || 'Ẩn danh',
            authorId: data.author_id,
            avatar: data.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${data.profiles?.name || 'U'}&background=c1d95c&color=fff`,
            time: new Date(data.published_at || data.created_at).toLocaleDateString('vi-VN'),
            role: data.profiles?.role === 'admin' ? 'Quản trị viên' : (data.profiles?.role === 'moderator' ? 'Điều hành viên' : 'Thành viên'),
            topic: data.type === 'community' ? 'Cộng đồng' : 'Mẹo tiết kiệm',
            category: 'Chia sẻ',
            title: data.title,
            excerpt: data.description || (data.content ? `${data.content.substring(0, 150)}...` : 'Chia sẻ từ cộng đồng E-XANH.'),
            image: data.cover_detail_url || data.cover_url || data.image_url,
            cover_detail_url: data.cover_detail_url,
            cover_card_url: data.cover_card_url,
            cover_thumb_url: data.cover_thumb_url,
            content: data.content || '',
            content_blocks: data.content_blocks || [],
            likes: data.likes_count || 0,
            commentsCount: data.comments_count || 0,
            savedCount: data.saved_count || 0,
            shares: 0,
            isLiked,
            isSaved,
            status: data.status,
            rejection_count: data.rejection_count || 0,
            rejection_reason: data.rejection_reason || ''
          }
          setPost(formattedPost)
        }
      } catch (e) {
        console.error('Error fetching post:', e)
      }

      setIsLoading(false)
    }
    loadData()
  }, [id])

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  const checkLogin = (featureName) => {
    if (!currentUser) {
      showToast(`Bạn cần đăng nhập để ${featureName}.`)
      return false
    }
    return true
  }

  async function handleToggleComment() {
    if (!checkLogin('bình luận')) return
    setIsCommentActive(!isCommentActive)
  }

  function handleToggleShare() {
    if (post.status !== 'approved') {
      showToast('Bài viết chưa công khai nên không thể chia sẻ.')
      return
    }
    
    const shareUrl = `${window.location.origin}/cong-dong/${post.id}`
    copyTextToClipboard(shareUrl).then((copied) => {
      showToast(copied ? 'Đã sao chép liên kết' : 'Không thể sao chép liên kết')
    }).catch(() => {
      showToast('Không thể sao chép liên kết')
    })
  }

  function handleCommentCountChange(count) {
    setPost(current => {
      if (!current) return current
      return { ...current, commentsCount: count }
    })
  }

  async function handleToggleLike() {
    if (!checkLogin('thích bài viết')) return
    if (!post) return

    const isCurrentlyLiked = post.isLiked
    setPost(current => ({
      ...current,
      isLiked: !isCurrentlyLiked,
      likes: isCurrentlyLiked ? current.likes - 1 : current.likes + 1,
    }))

    const { likePost, unlikePost } = await import('../../services/interactionService')
    const { error } = isCurrentlyLiked ? await unlikePost(post.id) : await likePost(post.id)

    if (error) {
      setPost(current => ({
        ...current,
        isLiked: isCurrentlyLiked,
        likes: isCurrentlyLiked ? current.likes + 1 : current.likes - 1,
      }))
      showToast('Đã xảy ra lỗi, vui lòng thử lại.')
    }
  }

  async function handleToggleSave() {
    if (!checkLogin('lưu bài viết')) return
    if (!post) return

    const isCurrentlySaved = post.isSaved
    setPost(current => ({
      ...current,
      isSaved: !isCurrentlySaved,
      savedCount: isCurrentlySaved ? current.savedCount - 1 : current.savedCount + 1,
    }))

    const { savePost, unsavePost } = await import('../../services/interactionService')
    const { error } = isCurrentlySaved ? await unsavePost(post.id) : await savePost(post.id)

    if (error) {
      setPost(current => ({
        ...current,
        isSaved: isCurrentlySaved,
        savedCount: isCurrentlySaved ? current.savedCount + 1 : current.savedCount - 1,
      }))
      showToast('Đã xảy ra lỗi, vui lòng thử lại.')
    }
  }

  const isAuthor = currentUser?.id === post?.authorId
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'moderator'
  const canView = post?.status === 'approved' || isAuthor || isAdmin

  return (
    <>
      <Helmet>
        <title>{post ? `${post.title} - E-XANH` : 'Chi tiết bài viết - E-XANH'}</title>
        <meta name="description" content={post ? post.excerpt : 'Xem chi tiết bài viết trên cộng đồng E-XANH.'} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={post ? `${post.title} - E-XANH` : 'Chi tiết bài viết - E-XANH'} />
        <meta property="og:description" content={post ? post.excerpt : 'Xem chi tiết bài viết trên cộng đồng E-XANH.'} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={post?.image || fallbackOgImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Helmet>

      <div className="community-page">
        <div className="container" style={{ padding: '20px 0' }}>
          <Link to="/cong-dong" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#4F8428', textDecoration: 'none', fontWeight: 'bold' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại Cộng đồng
          </Link>

          {isLoading ? (
            <div className="community-detail-container">
              <div className="community-skeleton-header">
                <div className="community-skeleton-avatar"></div>
                <div className="community-skeleton-meta">
                  <div className="community-skeleton-text" style={{ width: '120px' }}></div>
                  <div className="community-skeleton-text" style={{ width: '80px', height: '12px' }}></div>
                </div>
              </div>
              <div className="community-skeleton-text title"></div>
              <div className="community-skeleton-image"></div>
              <div className="community-skeleton-text" style={{ width: '100%' }}></div>
              <div className="community-skeleton-text" style={{ width: '90%' }}></div>
              <div className="community-skeleton-text" style={{ width: '95%' }}></div>
              <div className="community-skeleton-text" style={{ width: '60%' }}></div>
            </div>
          ) : !post ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <h2>Không tìm thấy bài viết!</h2>
              <p>Bài viết có thể đã bị xóa hoặc không tồn tại.</p>
            </div>
          ) : !canView ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <h2>Không có quyền truy cập</h2>
              <p>Bạn không có quyền xem bài viết này hoặc bài viết chưa được công khai.</p>
              <Link to="/" className="btn btn--primary" style={{ marginTop: '16px' }}>Về trang chủ</Link>
            </div>
          ) : (
            <div className="community-detail-container">
              {post.status !== 'approved' && (
                <div style={{ background: '#fff3cd', color: '#856404', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', borderLeft: '4px solid #ffeeba' }}>
                  <strong>Lưu ý:</strong> Bài viết này chưa được công khai. Chỉ bạn và quản trị viên mới có thể xem.
                </div>
              )}

              <div className="community-detail__header">
                <Link to={`/nguoi-dung/${post.authorId}`} className="community-detail__avatar-link">
                  <UserAvatar src={post.avatar} name={post.author} size="lg" className="community-detail__avatar" withFrame={false} />
                </Link>
                <div className="community-detail__meta">
                  <h3>
                    <Link to={`/nguoi-dung/${post.authorId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {post.author}
                    </Link>
                    {post.role !== 'Thành viên' && <span className="community-detail__role">{post.role}</span>}
                  </h3>
                  <p>{post.time}</p>
                </div>
              </div>

              <div className="community-detail__tags">
                <span className="community-detail__tag community-detail__tag--primary">{post.topic}</span>
                <span className="community-detail__tag">{post.category}</span>
              </div>

              <h1 className="community-detail__title">{post.title}</h1>

              {post.image && (
                <div className="community-detail__image-wrapper">
                  <OptimizedImage 
                    src={post.image} 
                    variants={{
                      detail: post.cover_detail_url,
                      card: post.cover_card_url,
                      thumb: post.cover_thumb_url
                    }}
                    alt={post.title} 
                    className="community-detail__image" 
                    ratio="auto"
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
              )}

              {post.content || (post.content_blocks && post.content_blocks.length > 0) ? (
                <div className="community-detail__content">
                  <PostBlockRenderer blocks={post.content_blocks} fallbackContent={post.content} />
                </div>
              ) : null}

              <div className="community-detail__actions">
                <button 
                  type="button" 
                  className={`community-detail__action-btn ${post.isLiked ? 'is-active' : ''}`}
                  onClick={handleToggleLike}
                >
                  <HeartIcon isLiked={post.isLiked} /> Thích {post.likes > 0 && post.likes}
                </button>
                <button 
                  type="button" 
                  className={`community-detail__action-btn ${isCommentActive ? 'is-active' : ''}`}
                  onClick={handleToggleComment}
                >
                  <CommentIcon /> Bình luận {post.commentsCount > 0 && post.commentsCount}
                </button>
                <button 
                  type="button" 
                  className={`community-detail__action-btn ${post.isSaved ? 'is-active' : ''}`}
                  onClick={handleToggleSave}
                >
                  <SaveIcon isSaved={post.isSaved} /> {post.isSaved ? 'Đã lưu' : 'Lưu bài'}
                </button>
                <button 
                  type="button" 
                  className="community-detail__action-btn"
                  onClick={handleToggleShare}
                >
                  <ShareIcon /> Chia sẻ
                </button>
              </div>

              {isCommentActive && (
                <div style={{ marginTop: '24px' }}>
                  <InlineCommentSection
                    postId={post.id}
                    currentUser={currentUser}
                    initialCount={post.commentsCount}
                    isOpen={isCommentActive}
                    onCountChange={handleCommentCountChange}
                    highlightCommentId={highlightCommentId}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {toastMsg && (
        <div className="ui-toast toast" role="status" aria-live="polite">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          {toastMsg}
        </div>
      )}
    </>
  )
}

export default CommunityPostDetailPage
