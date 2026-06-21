import { useMemo, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SEO from '../../components/SEO'
import PageHero from '../../components/common/PageHero'
import SavedPostCard from '../../components/posts/SavedPostCard'
import SavedPostsFilter from '../../components/posts/SavedPostsFilter'
import SavedSidebar from '../../components/posts/SavedSidebar'
import PageLoader from '../../components/common/PageLoader'
import EmptyState from '../../components/common/EmptyState'
import Toast from '../../components/common/Toast'
import { pageHeroContent } from '../../data/pageHeroes'
import {
  savedFilterChips,
  savedSortOptions,
} from '../../data/mock/posts'
import heroImage from '../../assets/hero.png'
import { getRuntimeSetting } from '../../services/settingsService'
import { fetchFirstActiveBanner } from '../../services/bannerService'
import '../../styles/saved-posts.css'

function sortSavedPosts(items, sortValue) {
  const next = [...items]

  if (sortValue === 'Cũ nhất') {
    return next.reverse()
  }

  if (sortValue === 'Nhiều lượt thích') {
    return next.sort((a, b) => b.likes - a.likes)
  }

  return next
}

function SavedPostsPage() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('Tất cả')
  const [sortValue, setSortValue] = useState('Mới lưu nhất')
  
  const [dbSavedPosts, setDbSavedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMorePosts, setHasMorePosts] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [heroSrc, setHeroSrc] = useState(heroImage)
  const [toast, setToast] = useState('')
  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`

  useEffect(() => {
    async function loadSavedPosts() {
      if (page === 1) setLoading(true)
      else setIsLoadingMore(true)
      
      const { getCurrentSession } = await import('../../services/authService')
      const session = await getCurrentSession()
      if (!session?.user) {
        return
      }
      const { getMySavedPosts } = await import('../../services/interactionService')
      const { data, hasMore, error } = await getMySavedPosts(page, 12)
      if (data) {
        if (page === 1) {
          setDbSavedPosts(data)
        } else {
          setDbSavedPosts(prev => [...prev, ...data])
        }
        setHasMorePosts(hasMore)
      } else {
        if (page === 1) setDbSavedPosts([])
        if (error) console.error('Lỗi lấy bài lưu:', error.message)
      }
      setLoading(false)
      setIsLoadingMore(false)
    }
    loadSavedPosts()
  }, [page])

  useEffect(() => {
    async function loadHero() {
      const { data: banner } = await fetchFirstActiveBanner('saved-posts')
      if (banner?.image_url) {
        setHeroSrc(banner.image_url)
        return
      }

      const { data } = await getRuntimeSetting('saved_posts_hero_image', heroImage)
      if (typeof data === 'string' && data.trim()) {
        setHeroSrc(data)
        return
      }

      setHeroSrc(heroImage)
    }

    loadHero()
  }, [])

  async function handleUnsave(postId) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(postId))
    if (!isUUID) {
      setDbSavedPosts(prev => prev.filter(p => p.id !== postId))
      return
    }
    const { unsavePost } = await import('../../services/interactionService')
    const { error } = await unsavePost(postId)
    if (!error) {
      setDbSavedPosts(prev => prev.filter(p => p.id !== postId))
    } else {
      setToast(error.message)
    }
  }

  const visiblePosts = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase()

    const filtered = dbSavedPosts.filter((post) => {
      const matchesSearch =
        keyword.length === 0 ||
        post.title.toLowerCase().includes(keyword) ||
        post.author.toLowerCase().includes(keyword) ||
        post.category.toLowerCase().includes(keyword)

      const matchesFilter =
        selectedFilter === 'Tất cả' || post.category === selectedFilter

      return matchesSearch && matchesFilter
    })

    return sortSavedPosts(filtered, sortValue)
  }, [searchValue, selectedFilter, sortValue, dbSavedPosts])

  const stats = [
    { value: dbSavedPosts.length.toString(), label: 'bài đã lưu' },
    { value: dbSavedPosts.filter(p => p.category === 'Mẹo tiết kiệm').length.toString(), label: 'mẹo tiết kiệm' },
    { value: dbSavedPosts.filter(p => p.category === 'Cộng đồng').length.toString(), label: 'bài cộng đồng' },
  ]

  const dynamicFolders = [
    { id: 'all', label: 'Tất cả bài lưu', count: dbSavedPosts.length, isActive: selectedFilter === 'Tất cả' },
    { id: 'tip', label: 'Mẹo tiết kiệm', count: dbSavedPosts.filter(p => p.category === 'Mẹo tiết kiệm').length, isActive: selectedFilter === 'Mẹo tiết kiệm' },
    { id: 'community', label: 'Cộng đồng', count: dbSavedPosts.filter(p => p.category === 'Cộng đồng').length, isActive: selectedFilter === 'Cộng đồng' },
    { id: 'review', label: 'Review thiết bị', count: dbSavedPosts.filter(p => p.category === 'Review thiết bị').length, isActive: selectedFilter === 'Review thiết bị' },
  ]

  if (loading) {
    return <PageLoader message="Đang tải danh sách bài lưu..." />
  }

  return (
    <>
      <SEO title="Bài viết đã lưu" noIndex={true} />

      <div className="saved-posts-page">

      <PageHero
        {...pageHeroContent['saved-posts']}
        fallbackImage={heroSrc}
        className="saved-posts-page__hero"
      />

      <section className="saved-posts-stats">
        {stats.map((item) => (
          <article key={item.label} className="saved-posts-stats__card">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <SavedPostsFilter
        searchValue={searchValue}
        selectedFilter={selectedFilter}
        sortValue={sortValue}
        filters={savedFilterChips}
        sortOptions={savedSortOptions}
        onSearchChange={setSearchValue}
        onFilterChange={setSelectedFilter}
        onSortChange={setSortValue}
      />

        <div className="saved-posts-layout">
          <div className="saved-posts-layout__content">
            {visiblePosts.length > 0 ? (
              <>
                <div className="saved-posts-grid">
                  {visiblePosts.map((post) => (
                    <SavedPostCard key={post.id} post={post} onUnsave={handleUnsave} />
                  ))}
                </div>
                {hasMorePosts && (
                  <div className="saved-posts-load-more" style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                    <button 
                      className="btn btn--secondary" 
                      onClick={() => setPage(p => p + 1)} 
                      disabled={isLoadingMore}
                    >
                      {isLoadingMore ? 'Đang tải...' : 'Tải thêm bài đã lưu'}
                    </button>
                  </div>
                )}
              </>
            ) : (
            <EmptyState 
              icon="⌘"
              title="Bạn chưa lưu bài viết nào."
              message="Hãy lưu lại các mẹo hữu ích để xem lại khi cần."
              action={
                <Link className="btn btn--primary" to="/meo-tiet-kiem">
                  Khám phá mẹo tiết kiệm
                </Link>
              }
            />
          )}
        </div>

        <SavedSidebar folders={dynamicFolders} recentlyRead={[]} />
      </div>

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
    </>
  )
}

export default SavedPostsPage
