import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CommunityFilterBar from '../../components/community/CommunityFilterBar'
import CommunityPostCard from '../../components/community/CommunityPostCard'
import CommunitySidebar from '../../components/community/CommunitySidebar'
import PostComposer from '../../components/community/PostComposer'
import {
  activeMembers,
  communityFilters,
  communityHero,
  communityRules,
  popularCommunityPosts,
  trendingTopics,
} from '../../data/community'
import '../../styles/community.css'

function sortCommunityPosts(posts, activeFilter) {
  const items = [...posts]

  if (activeFilter === 'Mới nhất') {
    return items.sort((first, second) => new Date(second.publishedAt || second.time) - new Date(first.publishedAt || first.time))
  }

  if (activeFilter === 'Nhiều tương tác') {
    return items.sort(
      (first, second) =>
        second.likes + second.commentsCount + second.shares -
        (first.likes + first.commentsCount + first.shares),
    )
  }

  if (activeFilter === 'Hỏi đáp' || activeFilter === 'Kinh nghiệm') {
    return items.filter((post) => post.topic === activeFilter)
  }

  if (activeFilter === 'Đã lưu nhiều') {
    return items.sort((first, second) => second.savedCount - first.savedCount)
  }

  return items
}

function CommunityPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('Tất cả')
  const [posts, setPosts] = useState([])
  const [visibleCount, setVisibleCount] = useState(3)
  const [isLoading, setIsLoading] = useState(true)

  const [activeCommentPostId, setActiveCommentPostId] = useState(null)
  const [activeSharePostId, setActiveSharePostId] = useState(null)
  const [commentsByPost, setCommentsByPost] = useState({})
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    async function loadData() {
      // Load user
      let userId = null
      try {
        const { getCurrentSession, getCurrentUserProfile } = await import('../../services/authService')
        const session = await getCurrentSession()
        if (session?.user) {
          userId = session.user.id
          const profile = await getCurrentUserProfile(session.user.id)
          setCurrentUser(profile || { id: session.user.id, name: 'Người dùng', avatar_url: null })
        }
      } catch (e) {
        console.warn('Cannot fetch user for community page:', e)
      }

      // Load posts
      try {
        const { getCommunityPosts } = await import('../../services/postService')
        const { data, error } = await getCommunityPosts()
        
        if (!error && data) {
          let likedMap = {}
          let savedMap = {}
          if (userId) {
            const { supabase } = await import('../../lib/supabase')
            const [{ data: likes }, { data: saves }] = await Promise.all([
              supabase.from('post_likes').select('post_id').eq('user_id', userId),
              supabase.from('saved_posts').select('post_id').eq('user_id', userId)
            ])
            likes?.forEach(l => likedMap[l.post_id] = true)
            saves?.forEach(s => savedMap[s.post_id] = true)
          }

          const formattedPosts = data.map(p => ({
            id: p.id,
            author: p.profiles?.name || 'Ẩn danh',
            avatar: p.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${p.profiles?.name || 'U'}&background=c1d95c&color=fff`,
            time: new Date(p.published_at || p.created_at).toLocaleDateString('vi-VN'),
            publishedAt: p.published_at || p.created_at,
            role: p.profiles?.role === 'admin' ? 'Quản trị viên' : (p.profiles?.role === 'moderator' ? 'Điều hành viên' : 'Thành viên'),
            topic: p.type === 'community' ? 'Cộng đồng' : 'Mẹo tiết kiệm',
            category: 'Chia sẻ',
            title: p.title,
            excerpt: p.description || p.content?.substring(0, 150) + '...',
            image: p.image_url,
            likes: p.likes_count || 0,
            commentsCount: p.comments_count || 0,
            savedCount: p.saved_count || 0,
            shares: 0,
            isLiked: !!likedMap[p.id], 
            isSaved: !!savedMap[p.id]  
          }))
          setPosts(formattedPosts)
        }
      } catch (e) {
        console.error('Error fetching community posts:', e)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredPosts = useMemo(
    () => sortCommunityPosts(posts, activeFilter),
    [activeFilter, posts],
  )

  const visiblePosts = filteredPosts.slice(0, visibleCount)
  const hasMorePosts = filteredPosts.length > visibleCount

  function handleFilterChange(filter) {
    setActiveFilter(filter)
    setVisibleCount(3)
  }

  async function handleToggleLike(postId) {
    if (!currentUser) {
      navigate('/dang-nhap', { state: { message: 'Vui lòng đăng nhập để thích bài viết.' } })
      return
    }

    const postToUpdate = posts.find(p => p.id === postId)
    if (!postToUpdate) return
    const isCurrentlyLiked = postToUpdate.isLiked

    // Optimistic UI update
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) return post
        return {
          ...post,
          isLiked: !isCurrentlyLiked,
          likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1,
        }
      })
    )

    const { likePost, unlikePost } = await import('../../services/interactionService')
    const { error } = isCurrentlyLiked ? await unlikePost(postId) : await likePost(postId)

    if (error) {
      // Revert on error
      setPosts((current) =>
        current.map((post) => {
          if (post.id !== postId) return post
          return {
            ...post,
            isLiked: isCurrentlyLiked,
            likes: isCurrentlyLiked ? post.likes + 1 : post.likes - 1,
          }
        })
      )
      alert('Đã xảy ra lỗi, vui lòng thử lại sau.')
    }
  }

  async function handleToggleSave(postId) {
    if (!currentUser) {
      navigate('/dang-nhap', { state: { message: 'Vui lòng đăng nhập để lưu bài viết.' } })
      return
    }

    const postToUpdate = posts.find(p => p.id === postId)
    if (!postToUpdate) return
    const isCurrentlySaved = postToUpdate.isSaved

    // Optimistic UI update
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) return post
        return {
          ...post,
          isSaved: !isCurrentlySaved,
          savedCount: isCurrentlySaved ? post.savedCount - 1 : post.savedCount + 1,
        }
      })
    )

    const { savePost, unsavePost } = await import('../../services/interactionService')
    const { error } = isCurrentlySaved ? await unsavePost(postId) : await savePost(postId)

    if (error) {
      // Revert on error
      setPosts((current) =>
        current.map((post) => {
          if (post.id !== postId) return post
          return {
            ...post,
            isSaved: isCurrentlySaved,
            savedCount: isCurrentlySaved ? post.savedCount + 1 : post.savedCount - 1,
          }
        })
      )
      alert('Đã xảy ra lỗi, vui lòng thử lại sau.')
    }
  }

  async function handleToggleComment(postId) {
    if (!currentUser) {
      navigate('/dang-nhap', { state: { message: 'Vui lòng đăng nhập để bình luận bài viết.' } })
      return
    }

    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null)
      return
    }

    setActiveCommentPostId(postId)
    setActiveSharePostId(null)

    if (!commentsByPost[postId]) {
      const { getCommentsByPost } = await import('../../services/commentService')
      const { data } = await getCommentsByPost(postId)
      if (data) {
        setCommentsByPost(prev => ({ ...prev, [postId]: data }))
      }
    }
  }

  function handleToggleShare(postId) {
    setActiveSharePostId(prev => prev === postId ? null : postId)
    setActiveCommentPostId(null)
  }

  async function handleAddComment(postId, content) {
    if (!currentUser) return false
    
    const { createComment } = await import('../../services/commentService')
    const { data, error } = await createComment(postId, content)

    if (error || !data) {
      return false
    }

    setCommentsByPost(prev => {
      const existing = prev[postId] || []
      return {
        ...prev,
        [postId]: [data, ...existing]
      }
    })
    
    setPosts((current) =>
      current.map((post) => {
        if (post.id === postId) {
          return { ...post, commentsCount: post.commentsCount + 1 }
        }
        return post
      })
    )
    return true
  }

  return (
    <div className="community-page">
      <section className="community-page__hero">
        <div className="community-page__hero-content">
          <span className="community-page__badge">{communityHero.badge}</span>
          <h1>{communityHero.title}</h1>
          <p>{communityHero.description}</p>

          <div className="community-page__hero-actions">
            <Link className="btn btn--primary" to="/dang-bai" state={{ defaultType: 'community' }} data-testid="community-write-post-button">
              Viết bài chia sẻ
            </Link>
            <a className="btn btn--secondary" href="#cong-dong-feed">
              Khám phá bài viết
            </a>
          </div>
        </div>

        <div className="community-page__hero-visual">
          <img src={communityHero.image} alt="Nhóm sinh viên đang chia sẻ kinh nghiệm sống xanh" />
        </div>
      </section>

      <div className="community-page__layout">
        <div className="community-page__feed">
          <PostComposer />

          <CommunityFilterBar
            filters={communityFilters}
            activeFilter={activeFilter}
            onChange={handleFilterChange}
          />

          <section id="cong-dong-feed" className="community-page__posts">
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải bài viết...</div>
            ) : visiblePosts.length > 0 ? (
              visiblePosts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  onToggleLike={handleToggleLike}
                  onToggleSave={handleToggleSave}
                  onToggleComment={handleToggleComment}
                  onToggleShare={handleToggleShare}
                  onAddComment={handleAddComment}
                  isCommentActive={activeCommentPostId === post.id}
                  isShareActive={activeSharePostId === post.id}
                  postComments={commentsByPost[post.id]}
                  currentUser={currentUser}
                />
              ))
            ) : (
              <div className="community-page__empty" style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '12px', border: '1px dashed #c1d95c', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#4F8428" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <h2 style={{ color: '#173715', fontSize: '1.25rem', margin: '0' }}>Cộng đồng hiện chưa có bài viết nào</h2>
                <p style={{ color: '#555', margin: '0', maxWidth: '300px' }}>Hãy là người đầu tiên chia sẻ bí quyết sống xanh của bạn với mọi người nhé!</p>
                <Link className="btn btn--primary" to="/dang-bai" style={{ marginTop: '8px' }}>
                  Viết bài chia sẻ đầu tiên
                </Link>
              </div>
            )}
          </section>

          {hasMorePosts ? (
            <div className="community-page__more">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setVisibleCount((current) => current + 2)}
              >
                Xem thêm bài viết
              </button>
            </div>
          ) : null}
        </div>

        <CommunitySidebar
          activeMembers={activeMembers}
          trendingTopics={trendingTopics}
          popularCommunityPosts={popularCommunityPosts}
          communityRules={communityRules}
        />
      </div>
    </div>
  )
}

export default CommunityPage
