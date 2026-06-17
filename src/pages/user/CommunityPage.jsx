import { useMemo, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import CommunityFilterBar from '../../components/community/CommunityFilterBar'
import CommunityPostCard from '../../components/community/CommunityPostCard'
import CommunitySidebar from '../../components/community/CommunitySidebar'
import PostComposer from '../../components/community/PostComposer'
import PageHero from '../../components/common/PageHero'
import SectionSkeleton from '../../components/common/SectionSkeleton'
import EmptyState from '../../components/common/EmptyState'
import { pageHeroContent } from '../../data/pageHeroes'
import { usePostComposer } from '../../components/community/PostComposerContext'
import '../../styles/community.css'

const communityFilters = [
  'Tất cả',
  'Mới nhất',
  'Nhiều tương tác',
  'Hỏi đáp',
  'Kinh nghiệm',
  'Đã lưu nhiều',
]

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
  const { openComposer } = usePostComposer()
  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`
  const OG_IMAGE = 'https://e-xanh.vercel.app/og-image-v2.png'
  const [activeFilter, setActiveFilter] = useState('Tất cả')
  const [posts, setPosts] = useState([])
  const [visibleCount, setVisibleCount] = useState(3)
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [activeMembers, setActiveMembers] = useState([])
  const [activeMembersLoading, setActiveMembersLoading] = useState(true)
  const [activeMembersError, setActiveMembersError] = useState('')

  const [activeCommentPostId, setActiveCommentPostId] = useState(null)
  const [activeSharePostId, setActiveSharePostId] = useState(null)
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
        const { getCommunityPosts, getTopActiveMembers } = await import('../../services/postService')
        const [{ data, error }, activeMembersResult] = await Promise.all([
          getCommunityPosts(),
          getTopActiveMembers(5),
        ])
        
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

          const formattedPosts = data.map(p => {
            const prefs = p.profiles?.user_preferences || {}
            const visibility = prefs.profile_visibility || 'public'
            
            let authorName = 'Thành viên E-XANH'
            let avatar = null
            
            // Logic lấy tên: name -> display_name -> email prefix (nếu chính chủ) -> Thành viên E-XANH
            const getRealName = () => {
              if (p.profiles?.name) return p.profiles.name
              if (p.profiles?.display_name) return p.profiles.display_name
              if (userId && p.author_id === userId) {
                 // Không có email trong profiles public thông thường trừ khi session
                 // Ở đây ta không có email user khác nên chỉ dùng "Thành viên E-XANH"
                 return 'Thành viên E-XANH'
              }
              return 'Thành viên E-XANH'
            }

            if (visibility === 'public' || (visibility === 'authenticated' && userId)) {
              authorName = getRealName()
              avatar = p.profiles?.avatar_url || null
            } else if (visibility === 'private' && p.author_id === userId) {
              authorName = getRealName()
              avatar = p.profiles?.avatar_url || null
            } else if (visibility === 'private' || (visibility === 'authenticated' && !userId)) {
              authorName = 'Thành viên E-XANH'
              avatar = null
            }

            return {
              id: p.id,
              author: authorName,
              authorId: visibility === 'private' && p.author_id !== userId ? null : p.author_id,
              avatar: avatar,
              time: new Date(p.published_at || p.created_at).toLocaleDateString('vi-VN'),
              publishedAt: p.published_at || p.created_at,
              role: p.profiles?.role === 'admin' ? 'Quản trị viên' : (p.profiles?.role === 'moderator' ? 'Điều hành viên' : null),
              topic: p.type === 'qa' ? 'Hỏi đáp' : (p.type === 'community' ? 'Kinh nghiệm' : 'Mẹo tiết kiệm'),
              category: 'Chia sẻ',
              title: p.title,
              excerpt: p.description || (p.content ? `${p.content.substring(0, 150)}...` : 'Chia sẻ mới từ cộng đồng E-XANH.'),
              image: p.image_url,
              likes: p.likes_count || 0,
              commentsCount: p.comments_count || 0,
              savedCount: p.saved_count || 0,
              shares: 0,
              isLiked: !!likedMap[p.id],
              isSaved: !!savedMap[p.id]
            }
          })
          setPosts(formattedPosts)
        }

        if (activeMembersResult?.error) {
          console.error('[CommunityPage] active members error:', activeMembersResult.error)
          setActiveMembersError('Không thể tải thành viên tích cực.')
          setActiveMembers([])
        } else {
          setActiveMembers(activeMembersResult?.data || [])
          setActiveMembersError('')
        }
      } catch (e) {
        console.error('Error fetching community posts:', e)
        setActiveMembersError('Không thể tải thành viên tích cực.')
      } finally {
        setIsLoading(false)
        setActiveMembersLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    function handleComposerSuccess(event) {
      setToast(event.detail?.message || 'Bài viết đã được gửi thành công!')
      window.setTimeout(() => setToast(''), 4000)
    }

    window.addEventListener('postComposerSuccess', handleComposerSuccess)
    return () => {
      window.removeEventListener('postComposerSuccess', handleComposerSuccess)
    }
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

  const showToastMsg = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const checkLogin = (featureName) => {
    if (!currentUser) {
      showToastMsg(`Bạn cần đăng nhập để ${featureName}.`)
      return false
    }
    return true
  }

  async function handleToggleLike(postId) {
    if (!checkLogin('thích bài viết')) return

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
      showToastMsg('Đã xảy ra lỗi, vui lòng thử lại.')
    }
  }

  async function handleToggleSave(postId) {
    if (!checkLogin('lưu bài viết')) return

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
      showToastMsg('Đã xảy ra lỗi, vui lòng thử lại.')
    }
  }

  async function handleToggleComment(postId) {
    if (!checkLogin('bình luận')) return

    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null)
      return
    }

    setActiveCommentPostId(postId)
    setActiveSharePostId(null)
  }

  function handleToggleShare(postId) {
    setActiveSharePostId(prev => prev === postId ? null : postId)
    setActiveCommentPostId(null)
  }

  function handleCommentCountChange(postId, count) {
    setPosts((current) =>
      current.map((post) => {
        if (post.id === postId) {
          return { ...post, commentsCount: count }
        }
        return post
      })
    )
  }

  const dynamicTrendingTopics = useMemo(() => {
    const topics = new Set()
    posts.forEach(p => {
      if (p.topic) topics.add(p.topic)
      if (p.category) topics.add(p.category)
    })
    return Array.from(topics).slice(0, 5)
  }, [posts])

  const dynamicPopularPosts = useMemo(() => {
    return [...posts].sort((a, b) => b.likes - a.likes).slice(0, 5)
  }, [posts])

  return (
    <div className="community-page">
      <Helmet>
        <title>Cộng đồng — E-XANH</title>
        <meta name="description" content="Tham gia cộng đồng E-XANH, nơi sinh viên và người trẻ chia sẻ kinh nghiệm sống xanh, mẹo tiết kiệm điện và lối sống bền vững." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Cộng đồng E-XANH — Chia sẻ kinh nghiệm sống xanh" />
        <meta property="og:description" content="Cộng đồng nơi sinh viên chia sẻ mẹo tiết kiệm điện, kinh nghiệm sống xanh và các bí quyết giảm chi phí điện." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <PageHero
        {...pageHeroContent.community}
        actions={(
          <>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => openComposer({ defaultType: 'community' })}
              data-testid="community-write-post-button"
            >
              Viết bài chia sẻ
            </button>
            <a className="btn btn--secondary" href="#cong-dong-feed">
              Khám phá bài viết
            </a>
          </>
        )}
      />

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
              <SectionSkeleton count={3} height="200px" />
            ) : visiblePosts.length > 0 ? (
              visiblePosts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  onToggleLike={handleToggleLike}
                  onToggleSave={handleToggleSave}
                  onToggleComment={handleToggleComment}
                  onToggleShare={handleToggleShare}
                  isCommentActive={activeCommentPostId === post.id}
                  isShareActive={activeSharePostId === post.id}
                  currentUser={currentUser}
                  onCommentCountChange={(count) => handleCommentCountChange(post.id, count)}
                />
              ))
            ) : (
              <EmptyState 
                icon="💬"
                title="Cộng đồng hiện chưa có bài viết nào"
                message="Hãy là người đầu tiên chia sẻ bí quyết sống xanh của bạn với mọi người nhé!"
                action={
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => openComposer({ defaultType: 'community' })}
                  >
                    Viết bài chia sẻ đầu tiên
                  </button>
                }
              />
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
          activeMembersLoading={activeMembersLoading}
          activeMembersError={activeMembersError}
          trendingTopics={dynamicTrendingTopics}
          popularCommunityPosts={dynamicPopularPosts}
        />
      </div>

      {toast ? (
        <div className="ui-toast" role="status" aria-live="polite">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      ) : null}
    </div>
  )
}

export default CommunityPage
