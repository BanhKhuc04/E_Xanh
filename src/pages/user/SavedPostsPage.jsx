import { useMemo, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import PageHero from '../../components/common/PageHero'
import SavedPostCard from '../../components/posts/SavedPostCard'
import SavedPostsFilter from '../../components/posts/SavedPostsFilter'
import SavedSidebar from '../../components/posts/SavedSidebar'
import PageLoader from '../../components/common/PageLoader'
import EmptyState from '../../components/common/EmptyState'
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
  const [heroSrc, setHeroSrc] = useState(heroImage)
  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`

  useEffect(() => {
    async function loadSavedPosts() {
      const { getCurrentSession } = await import('../../services/authService')
      const session = await getCurrentSession()
      if (!session?.user) {
        return
      }
      const { getMySavedPosts } = await import('../../services/interactionService')
      const { data, error } = await getMySavedPosts()
      if (data) {
        setDbSavedPosts(data)
      } else {
        setDbSavedPosts([])
        if (error) console.error('Lỗi lấy bài lưu:', error.message)
      }
      setLoading(false)
    }
    loadSavedPosts()
  }, [])

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
    if (String(postId).length < 30) {
      setDbSavedPosts(prev => prev.filter(p => p.id !== postId))
      return
    }
    const { unsavePost } = await import('../../services/interactionService')
    const { error } = await unsavePost(postId)
    if (!error) {
      setDbSavedPosts(prev => prev.filter(p => p.id !== postId))
    } else {
      alert(error.message)
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
      <Helmet>
        <title>Bài viết đã lưu - E-XANH</title>
        <meta
          name="description"
          content="Quản lý và xem lại danh sách các bài viết mẹo tiết kiệm điện mà bạn đã lưu trên E-XANH."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Bài viết đã lưu - E-XANH" />
        <meta
          property="og:description"
          content="Quản lý và xem lại danh sách các bài viết mẹo tiết kiệm điện mà bạn đã lưu trên E-XANH."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://e-xanh.vercel.app/og-image-v2.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Helmet>

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
            <div className="saved-posts-grid">
              {visiblePosts.map((post) => (
                <SavedPostCard key={post.id} post={post} onUnsave={handleUnsave} />
              ))}
            </div>
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
    </div>
    </>
  )
}

export default SavedPostsPage
