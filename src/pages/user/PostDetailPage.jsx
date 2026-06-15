import { Link, useParams, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import ArticleActions from '../../components/posts/ArticleActions'
import ArticleContent from '../../components/posts/ArticleContent'
import ArticleHeader from '../../components/posts/ArticleHeader'
import CommentSection from '../../components/posts/CommentSection'
import PostCard from '../../components/posts/PostCard'
import RelatedPosts from '../../components/posts/RelatedPosts'
import { getPostBySlug, getApprovedPosts } from '../../services/postService'
import { getInitials, isValidImageUrl } from '../../utils/avatar'
import '../../styles/post-detail.css'

function PostDetailPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [relatedPosts, setRelatedPosts] = useState([])

  useEffect(() => {
    async function loadPost() {
      setLoading(true)
      const { data, error } = await getPostBySlug(slug)
      if (!error && data) {
        const categoryMap = {
          tip: 'Mẹo tiết kiệm',
          community: 'Cộng đồng',
          qa: 'Hỏi đáp',
          review: 'Review thiết bị'
        }

        let isLiked = false
        let isSaved = false
        let isFollowing = false
        try {
          const { getCurrentSession } = await import('../../services/authService')
          const session = await getCurrentSession()
          if (session?.user) {
            const { isPostLiked, isPostSaved, checkFollowStatus } = await import('../../services/interactionService')
            const [likedRes, savedRes, followRes] = await Promise.all([
              isPostLiked(data.id),
              isPostSaved(data.id),
              checkFollowStatus(data.author_id)
            ])
            isLiked = likedRes.data || false
            isSaved = savedRes.data || false
            isFollowing = followRes.data || false
          }
        } catch(e) { console.error('Error fetching interaction status', e) }

        const postData = {
          id: data.id,
          author_id: data.author_id,
          title: data.title,
          slug: data.slug,
          type: data.type,
          author: data.profiles?.name || data.profiles?.email || 'Thành viên E-XANH',
          authorAvatar: data.profiles?.avatar_url || 'EX',
          authorBio: data.profiles?.bio || 'Thành viên cộng đồng E-XANH',
          category: categoryMap[data.type] || 'Cộng đồng',
          status: 'published',
          image: data.image_url,
          description: data.description || '',
          content: data.content || '',
          contentBlocks: data.content_blocks || [],
          contentSections: [
            {
              heading: 'Nội dung bài viết',
              body: data.content || ''
            }
          ],
          likes: data.likes_count || 0,
          comments: data.comments_count || 0,
          savedCount: data.saved_count || 0,
          readTime: data.read_time || '3 phút',
          date: new Date(data.created_at).toISOString().split('T')[0],
          commentItems: [],
          isLiked,
          isSaved,
          isFollowing
        }
        setPost(postData)

        // Fetch related posts based on type
        const { data: allPosts } = await getApprovedPosts()
        if (allPosts) {
          const related = allPosts
            .filter(p => p.type === data.type && p.id !== data.id)
            .slice(0, 6)
            .map(p => ({
              id: p.id,
              title: p.title,
              slug: p.slug,
              author: p.profiles?.name || 'Thành viên',
              authorId: p.author_id,
              authorAvatar: p.profiles?.avatar_url || 'EX',
              category: categoryMap[p.type] || 'Cộng đồng',
              status: 'published',
              image: p.image_url,
              description: p.description || '',
              likes: p.likes_count || 0,
              comments: p.comments_count || 0,
              savedCount: p.saved_count || 0,
              readTime: p.read_time || '3 phút',
              date: new Date(p.created_at).toISOString().split('T')[0],
            }))
          setRelatedPosts(related)
        }
      } else {
        setPost(null)
      }
      setLoading(false)
    }
    loadPost()
  }, [slug])

  if (loading) {
    return <div className="post-detail-page"><div className="shell" style={{ padding: '40px 0', textAlign: 'center' }}>Đang tải...</div></div>
  }

  if (!post) {
    return (
      <div className="post-detail-page">
        <section className="post-detail-empty">
          <span className="tips-hero__badge">Chi tiết bài viết</span>
          <h1>Không tìm thấy bài viết</h1>
          <p>Bài viết bạn đang tìm có thể đã bị xóa hoặc đường dẫn chưa chính xác.</p>
          <Link className="btn btn--primary" to="/meo-tiet-kiem">
            Quay lại mẹo tiết kiệm
          </Link>
        </section>
      </div>
    )
  }

  async function handleToggleLike() {
    const { getCurrentSession } = await import('../../services/authService')
    const session = await getCurrentSession()
    if (!session?.user) {
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
        likes: isCurrentlyLiked ? Math.max(0, current.likes - 1) : current.likes + 1,
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
          likes: isCurrentlyLiked ? current.likes + 1 : Math.max(0, current.likes - 1),
        }
      })
      alert('Đã xảy ra lỗi, vui lòng thử lại sau.')
    }
  }

  async function handleToggleSave() {
    const { getCurrentSession } = await import('../../services/authService')
    const session = await getCurrentSession()
    if (!session?.user) {
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
        savedCount: isCurrentlySaved ? Math.max(0, current.savedCount - 1) : current.savedCount + 1,
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
          savedCount: isCurrentlySaved ? current.savedCount + 1 : Math.max(0, current.savedCount - 1),
        }
      })
      alert('Đã xảy ra lỗi, vui lòng thử lại sau.')
    }
  }

  async function handleToggleFollow() {
    if (actionLoading) return
    const { getCurrentSession } = await import('../../services/authService')
    const session = await getCurrentSession()
    if (!session?.user) {
      alert('Vui lòng đăng nhập để theo dõi người dùng này.')
      return
    }
    
    if (session.user.id === post.author_id) {
      alert('Bạn không thể tự theo dõi chính mình.')
      return
    }

    setActionLoading(true)

    if (!post) return
    const isCurrentlyFollowing = post.isFollowing

    setPost(current => {
      if (!current) return current
      return {
        ...current,
        isFollowing: !isCurrentlyFollowing,
      }
    })

    const { followUser, unfollowUser } = await import('../../services/interactionService')
    const { error } = isCurrentlyFollowing ? await unfollowUser(post.author_id) : await followUser(post.author_id)

    if (error) {
      setPost(current => {
        if (!current) return current
        return {
          ...current,
          isFollowing: isCurrentlyFollowing,
        }
      })
      alert('Đã xảy ra lỗi, vui lòng thử lại sau.')
    }
    setActionLoading(false)
  }

  const sidebarRelated = relatedPosts.slice(0, 3)
  const bottomSuggested = relatedPosts.slice(3, 6)

  const isCommunity = post.type === 'community'
  const parentLink = isCommunity ? '/cong-dong' : '/meo-tiet-kiem'
  const parentName = isCommunity ? 'Cộng đồng' : 'Mẹo tiết kiệm'

  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`
  const OG_IMAGE = 'https://e-xanh.vercel.app/og-image-v2.png'

  return (
    <div className="post-detail-page">
      <Helmet>
        <title>{post.title ? `${post.title} — E-XANH` : 'Chi tiết bài viết — E-XANH'}</title>
        <meta name="description" content={post.description || `Đọc bài viết "${post.title}" trên E-XANH — nền tảng hỗ trợ sinh viên sử dụng điện thông minh và tiết kiệm điện.`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={post.title ? `${post.title} — E-XANH` : 'E-XANH'} />
        <meta property="og:description" content={post.description || 'Bài viết trên nền tảng E-XANH'} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={post.image || OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        {post.image && <meta name="twitter:image" content={post.image} />}
      </Helmet>
      <nav className="post-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span>/</span>
        <Link to={parentLink}>{parentName}</Link>
        <span>/</span>
        <span>Chi tiết bài viết</span>
      </nav>

      <div className="post-detail-layout">
        <article className="post-detail-main">
          <ArticleHeader post={post} />
          <ArticleContent post={post} />
          <ArticleActions 
            post={post} 
            onToggleLike={handleToggleLike} 
            onToggleSave={handleToggleSave} 
            onReport={async () => {
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
          />
          <CommentSection post={post} comments={post.commentItems.slice(0, 2)} />
        </article>

        <aside className="post-detail-sidebar">
          <section className="post-side-card post-side-card--author">
            {isValidImageUrl(post.authorAvatar) ? (
              <img
                src={post.authorAvatar}
                alt={`Ảnh đại diện của ${post.author}`}
                width="60"
                height="60"
                loading="lazy"
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px' }}
              />
            ) : (
              <span className="post-side-card__author-avatar" style={{ background: '#c1d95c', color: '#fff' }}>{getInitials(post.author)}</span>
            )}
            <h3>{post.author}</h3>
            <p>{post.authorBio}</p>
            <button 
              type="button" 
              className={`btn ${post.isFollowing ? 'btn--secondary' : 'btn--primary'} post-side-card__follow-btn`}
              onClick={handleToggleFollow}
              disabled={actionLoading}
              style={{ opacity: actionLoading ? 0.7 : 1 }}
            >
              {post.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
            </button>
          </section>

          {sidebarRelated.length > 0 ? (
            <RelatedPosts title="Bài viết liên quan" posts={sidebarRelated} compact />
          ) : (
            <section className="post-side-card">
              <h2>Bài viết liên quan</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Chưa có bài viết liên quan.</p>
            </section>
          )}

          <section className="post-side-card">
            <h2>Chủ đề nổi bật</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Đang cập nhật...</p>
          </section>

          <section className="post-side-card post-side-card--cta">
            <h2>Bạn có mẹo hay?</h2>
            <p>Chia sẻ kinh nghiệm tiết kiệm điện của bạn để lan tỏa lối sống xanh.</p>
            <Link className="btn btn--light" to="/dang-bai">
              Đăng bài chia sẻ
            </Link>
          </section>
        </aside>
      </div>

      <section className="post-detail-suggestions">
        <h2>Có thể bạn cũng thích</h2>
        {bottomSuggested.length > 0 ? (
          <div className="post-detail-suggestions__grid">
            {bottomSuggested.map((item) => (
              <PostCard key={item.id} post={item} />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px' }}>Chưa có bài viết đề xuất.</p>
        )}
      </section>
    </div>
  )
}

export default PostDetailPage
