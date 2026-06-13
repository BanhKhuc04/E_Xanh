import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import SavedPostCard from '../../components/posts/SavedPostCard'
import SavedPostsFilter from '../../components/posts/SavedPostsFilter'
import SavedSidebar from '../../components/posts/SavedSidebar'
import {
  savedFilterChips,
  savedFolderSummary,
  savedPosts,
  savedRecentlyRead,
  savedSortOptions,
} from '../../data/posts'
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
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('Tất cả')
  const [sortValue, setSortValue] = useState('Mới lưu nhất')
  
  const [dbSavedPosts, setDbSavedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`

  useEffect(() => {
    async function loadSavedPosts() {
      const { getCurrentSession } = await import('../../services/authService')
      const session = await getCurrentSession()
      if (!session?.user) {
        navigate('/dang-nhap', { state: { message: 'Vui lòng đăng nhập để xem bài đã lưu' } })
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
        selectedFilter === 'Tất cả' || post.savedType === selectedFilter

      return matchesSearch && matchesFilter
    })

    return sortSavedPosts(filtered, sortValue)
  }, [searchValue, selectedFilter, sortValue, dbSavedPosts])

  const stats = [
    { value: dbSavedPosts.length.toString(), label: 'bài đã lưu' },
    { value: dbSavedPosts.filter(p => p.category === 'Mẹo tiết kiệm').length.toString(), label: 'mẹo tiết kiệm' },
    { value: dbSavedPosts.filter(p => p.category === 'Cộng đồng').length.toString(), label: 'bài cộng đồng' },
  ]

  if (loading) {
    return <div className="saved-posts-page"><div style={{ padding: '60px', textAlign: 'center', color: '#666' }}>Đang tải...</div></div>
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
        <meta property="og:image" content="https://e-xanh.vercel.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Helmet>

      <div className="saved-posts-page">
        <nav className="saved-posts-page__breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span>/</span>
        <span>Bài đã lưu</span>
      </nav>

      <section className="saved-posts-hero">
        <div className="saved-posts-hero__content">
          <span className="saved-posts-hero__badge">Kho nội dung cá nhân</span>
          <h1>Bài viết đã lưu</h1>
          <p>
            Lưu lại những mẹo tiết kiệm điện, kinh nghiệm sống xanh và bài viết hữu ích để xem lại bất cứ lúc nào.
          </p>
        </div>

        <div className="saved-posts-hero__visual">
          <img
            src='/images/fallback-green.jpg'
            alt="Người dùng đang xem lại bài viết đã lưu trên laptop"
          />
        </div>
      </section>

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
            <section className="saved-posts-empty">
              <span className="saved-posts-empty__icon">⌘</span>
              <h2>Bạn chưa lưu bài viết nào.</h2>
              <p>Hãy lưu lại các mẹo hữu ích để xem lại khi cần.</p>
              <Link className="btn btn--primary" to="/meo-tiet-kiem">
                Khám phá mẹo tiết kiệm
              </Link>
            </section>
          )}
        </div>

        <SavedSidebar folders={savedFolderSummary} recentlyRead={savedRecentlyRead} />
      </div>
    </div>
    </>
  )
}

export default SavedPostsPage
