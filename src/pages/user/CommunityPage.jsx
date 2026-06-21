import { useMemo, useState, useEffect } from 'react'
import SEO from '../../components/SEO'
import { useLocation } from 'react-router-dom'
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

const COMMUNITY_TOPIC_LABELS = {
  qa: 'Hỏi đáp',
  community: 'Kinh nghiệm',
  review: 'Review thiết bị',
}

const COMMUNITY_CATEGORY_LABELS = {
  qa: 'Giải đáp',
  community: 'Chia sẻ',
  review: 'Đánh giá',
}

// Removed local sortCommunityPosts as we will sort on server side

function getEmptyStateContent(activeFilter) {
  if (activeFilter === 'Hỏi đáp') {
    return {
      title: 'Chưa có bài hỏi đáp nào',
      message: 'Khi thành viên đặt câu hỏi mới, nội dung sẽ xuất hiện ở đây để mọi người cùng hỗ trợ.',
      actionLabel: 'Đặt câu hỏi đầu tiên',
      defaultType: 'qa',
      actionKind: 'compose',
    }
  }

  if (activeFilter === 'Kinh nghiệm') {
    return {
      title: 'Chưa có bài chia sẻ kinh nghiệm nào',
      message: 'Hãy mở đầu bằng một mẹo thực tế để cộng đồng có thêm cảm hứng sống xanh mỗi ngày.',
      actionLabel: 'Viết bài kinh nghiệm',
      defaultType: 'community',
      actionKind: 'compose',
    }
  }

  if (activeFilter === 'Đã lưu nhiều') {
    return {
      title: 'Chưa có bài nào được lưu nhiều',
      message: 'Khi người dùng bắt đầu lưu lại các bài viết hữu ích, danh sách nổi bật sẽ hiện ở đây.',
      actionLabel: 'Xem tất cả bài viết',
      defaultType: 'community',
      actionKind: 'reset-filter',
    }
  }

  if (activeFilter === 'Nhiều tương tác') {
    return {
      title: 'Chưa có bài nào có tương tác nổi bật',
      message: 'Những bài viết được thích, bình luận và lưu nhiều sẽ được ưu tiên hiển thị tại đây.',
      actionLabel: 'Xem tất cả bài viết',
      defaultType: 'community',
      actionKind: 'reset-filter',
    }
  }

  return {
    title: 'Cộng đồng hiện chưa có bài viết nào',
    message: 'Hãy là người đầu tiên chia sẻ bí quyết sống xanh của bạn với mọi người nhé!',
    actionLabel: 'Viết bài chia sẻ đầu tiên',
    defaultType: 'community',
    actionKind: 'compose',
  }
}

function CommunityPage() {
  const { openComposer } = usePostComposer()
  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`
  const OG_IMAGE = 'https://e-xanh.vercel.app/og-image-v2.png'
  const [activeFilter, setActiveFilter] = useState('Tất cả')
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMorePosts, setHasMorePosts] = useState(false)
  const limit = 10
  const [totalPosts, setTotalPosts] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [toast, setToast] = useState('')
  const [activeMembers, setActiveMembers] = useState([])
  const [activeMembersLoading, setActiveMembersLoading] = useState(true)
  const [activeMembersError, setActiveMembersError] = useState('')

  const [activeCommentPostId, setActiveCommentPostId] = useState(null)
  const [activeSharePostId, setActiveSharePostId] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    async function loadData() {
      if (page === 1) setIsLoading(true)
      else setIsLoadingMore(true)

      let userId = currentUser?.id
      if (!userId && page === 1) {
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
      }

      try {
        const { getCommunityPosts, getTopActiveMembers } = await import('../../services/postService')
        
        const promises = [getCommunityPosts(page, limit, activeFilter)]
        if (page === 1) {
          promises.push(getTopActiveMembers(5))
        }

        const [postsResult, activeMembersResult] = await Promise.all(promises)
        const { data, count, error } = postsResult
        
        if (!error && data) {
          let likedMap = {}
          let savedMap = {}
          if (userId) {
            const { getUserInteractionMap } = await import('../../services/interactionService')
            const maps = await getUserInteractionMap(userId)
            likedMap = maps.likedMap
            savedMap = maps.savedMap
          }

          const formattedPosts = data.map(p => {
            const prefs = p.profiles?.user_preferences || {}
            const visibility = prefs.profile_visibility || 'public'
            
            let authorName = 'Thành viên E-XANH'
            let avatar = null
            
            const getRealName = () => {
              if (p.profiles?.name) return p.profiles.name
              if (p.profiles?.display_name) return p.profiles.display_name
              if (userId && p.author_id === userId) {
                 return currentUser?.name || 'Bạn'
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
              type: p.type,
              author: authorName,
              authorId: visibility === 'private' && p.author_id !== userId ? null : p.author_id,
              avatar: avatar,
              time: new Date(p.published_at || p.created_at).toLocaleDateString('vi-VN'),
              createdAt: p.created_at,
              publishedAt: p.published_at || p.created_at,
              role: p.profiles?.role === 'admin' ? 'Quản trị viên' : (p.profiles?.role === 'moderator' ? 'Điều hành viên' : null),
              topic: COMMUNITY_TOPIC_LABELS[p.type] || 'Cộng đồng',
              category: COMMUNITY_CATEGORY_LABELS[p.type] || 'Chia sẻ',
              title: p.title,
              excerpt: p.description || (p.content ? `${p.content.substring(0, 150)}...` : 'Chia sẻ mới từ cộng đồng E-XANH.'),
              image: p.image_url,
              cover_card_url: p.cover_card_url,
              cover_thumb_url: p.cover_thumb_url,
              cover_url: p.cover_url,
              likes: p.likes_count || 0,
              commentsCount: p.comments_count || 0,
              savedCount: p.saved_count || 0,
              interactionScore: (p.likes_count || 0) + (p.comments_count || 0) + (p.saved_count || 0),
              isLiked: !!likedMap[p.id],
              isSaved: !!savedMap[p.id]
            }
          })

          if (page === 1) {
            setPosts(formattedPosts)
            setTotalPosts(count || formattedPosts.length)
          } else {
            setPosts(prev => [...prev, ...formattedPosts])
          }
          
            setHasMorePosts(postsResult.hasMore)
        }

        if (page === 1 && activeMembersResult) {
          if (activeMembersResult.error) {
            console.error('[CommunityPage] active members error:', activeMembersResult.error)
            setActiveMembersError('Không thể tải thành viên tích cực.')
            setActiveMembers([])
          } else {
            setActiveMembers(activeMembersResult.data || [])
            setActiveMembersError('')
          }
          setActiveMembersLoading(false)
        }
      } catch (e) {
        console.error('Error fetching community posts:', e)
        if (page === 1) setActiveMembersError('Không thể tải thành viên tích cực.')
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    }
    loadData()
  }, [page, activeFilter, currentUser?.id, currentUser?.name])

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

  const emptyState = getEmptyStateContent(activeFilter)

  function handleFilterChange(filter) {
    setActiveFilter(filter)
    setPage(1)
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
      <SEO title="Cộng đồng sống xanh & Tiết kiệm điện" description="Tham gia cộng đồng E-XANH, nơi sinh viên và người trẻ chia sẻ kinh nghiệm sống xanh, mẹo tiết kiệm điện và lối sống bền vững." url={canonicalUrl} />
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
            totalPosts={totalPosts}
          />

          <section id="cong-dong-feed" className="community-page__posts">
            {isLoading ? (
              <SectionSkeleton count={3} height="200px" />
            ) : posts.length > 0 ? (
              posts.map((post) => (
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
                title={emptyState.title}
                message={emptyState.message}
                action={
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => {
                      if (emptyState.actionKind === 'reset-filter') {
                        handleFilterChange('Tất cả')
                        return
                      }

                      openComposer({ defaultType: emptyState.defaultType })
                    }}
                  >
                    {emptyState.actionLabel}
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
                onClick={() => setPage((current) => current + 1)}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? 'Đang tải...' : 'Xem thêm bài viết'}
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
