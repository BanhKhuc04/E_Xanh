import { useState, useEffect } from 'react'
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import CommunityPostCard from '../../components/community/CommunityPostCard'
import MarkdownContent from '../../components/common/MarkdownContent'
import { getPostById } from '../../services/postService'
import { getCurrentSession, getCurrentUserProfile } from '../../services/authService'

function CommunityPostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  
  // We use this just to let CommunityPostCard manage its own UI states
  const [activeCommentPostId, setActiveCommentPostId] = useState(id)
  const [activeSharePostId, setActiveSharePostId] = useState(null)

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
          setCurrentUser(profile || { id: session.user.id, name: 'Người dùng', avatar_url: null })
        }
      } catch (e) {
        console.warn('Cannot fetch user for community post detail page:', e)
      }

      // Load post
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
            avatar: data.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${data.profiles?.name || 'U'}&background=c1d95c&color=fff`,
            time: new Date(data.published_at || data.created_at).toLocaleDateString('vi-VN'),
            role: data.profiles?.role === 'admin' ? 'Quản trị viên' : (data.profiles?.role === 'moderator' ? 'Điều hành viên' : 'Thành viên'),
            topic: data.type === 'community' ? 'Cộng đồng' : 'Mẹo tiết kiệm',
            category: 'Chia sẻ',
            title: data.title,
            excerpt: data.description || (data.content ? `${data.content.substring(0, 150)}...` : 'Chia sẻ từ cộng đồng E-XANH.'),
            image: data.image_url,
            content: data.content || '',
            likes: data.likes_count || 0,
            commentsCount: data.comments_count || 0,
            savedCount: data.saved_count || 0,
            shares: 0,
            isLiked,
            isSaved
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

  async function handleToggleComment(postId) {
    if (!currentUser) {
      navigate('/dang-nhap', { state: { message: 'Vui lòng đăng nhập để bình luận bài viết.' } })
      return
    }

    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null)
    } else {
      setActiveCommentPostId(postId)
      setActiveSharePostId(null)
    }
  }

  function handleToggleShare(postId) {
    setActiveSharePostId(prev => prev === postId ? null : postId)
    setActiveCommentPostId(null)
  }

  function handleCommentCountChange(count) {
    setPost(current => {
      if (!current) return current
      return { ...current, commentsCount: count }
    })
  }

  async function handleToggleLike() {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để thích bài viết.')
      return
    }
    
    if (!post) return
    const isCurrentlyLiked = post.isLiked

    setPost(current => {
      if (!current) return current
      return {
        ...current,
        isLiked: !isCurrentlyLiked,
        likes: isCurrentlyLiked ? current.likes - 1 : current.likes + 1,
      }
    })

    const { likePost, unlikePost } = await import('../../services/interactionService')
    const { error } = isCurrentlyLiked ? await unlikePost(post.id) : await likePost(post.id)

    if (error) {
      setPost(current => {
        if (!current) return current
        return {
          ...current,
          isLiked: isCurrentlyLiked,
          likes: isCurrentlyLiked ? current.likes + 1 : current.likes - 1,
        }
      })
      alert('Đã xảy ra lỗi, vui lòng thử lại sau.')
    }
  }

  async function handleToggleSave() {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để lưu bài viết.')
      return
    }

    if (!post) return
    const isCurrentlySaved = post.isSaved

    setPost(current => {
      if (!current) return current
      return {
        ...current,
        isSaved: !isCurrentlySaved,
        savedCount: isCurrentlySaved ? current.savedCount - 1 : current.savedCount + 1,
      }
    })

    const { savePost, unsavePost } = await import('../../services/interactionService')
    const { error } = isCurrentlySaved ? await unsavePost(post.id) : await savePost(post.id)

    if (error) {
      setPost(current => {
        if (!current) return current
        return {
          ...current,
          isSaved: isCurrentlySaved,
          savedCount: isCurrentlySaved ? current.savedCount + 1 : current.savedCount - 1,
        }
      })
      alert('Đã xảy ra lỗi, vui lòng thử lại sau.')
    }
  }

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
      <div className="container" style={{ padding: '20px 0', maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/cong-dong" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#4F8428', textDecoration: 'none', marginBottom: '24px', fontWeight: 'bold' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại Cộng đồng
        </Link>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải bài viết...</div>
        ) : !post ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Không tìm thấy bài viết!</div>
        ) : (
          <>
            <CommunityPostCard
              post={post}
              onToggleLike={handleToggleLike}
              onToggleSave={handleToggleSave}
              onToggleComment={handleToggleComment}
              onToggleShare={handleToggleShare}
              isCommentActive={activeCommentPostId === post.id}
              isShareActive={activeSharePostId === post.id}
              currentUser={currentUser}
              onCommentCountChange={handleCommentCountChange}
            />

            {post.content ? (
              <section className="post-side-card" style={{ marginTop: '20px' }}>
                <h2>Nội dung bài chia sẻ</h2>
                <MarkdownContent content={post.content} className="article-content__markdown" />
              </section>
            ) : null}
          </>
        )}
      </div>
    </div>
    </>
  )
}

export default CommunityPostDetailPage
