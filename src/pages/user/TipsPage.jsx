import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import PostCard from '../../components/posts/PostCard'
import PostFilterBar from '../../components/posts/PostFilterBar'
import PageHero from '../../components/common/PageHero'
import { pageHeroContent } from '../../data/pageHeroes'
import {
  featuredTopics,
  postCategories,
  postSortOptions,
  savedHighlights,
  todaySuggestion,
} from '../../data/posts'
import { getTipPosts } from '../../services/postService'
import '../../styles/tips.css'

function sortPosts(list, sortValue) {
  const next = [...list]

  if (sortValue === 'Nhiều lượt lưu') {
    return next.sort((a, b) => b.savedCount - a.savedCount)
  }

  if (sortValue === 'Nhiều tương tác') {
    return next.sort((a, b) => b.likes + b.comments - (a.likes + a.comments))
  }

  return next.sort((a, b) => new Date(b.date) - new Date(a.date))
}

function TipsPage() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [sortValue, setSortValue] = useState('Mới nhất')
  const [dbPosts, setDbPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // eslint-disable-next-line no-unused-vars
  const [errorMsg, setErrorMsg] = useState('')
  const location = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${location.pathname}`

  useEffect(() => {
    let isMounted = true
    async function loadPosts() {
      // Timeout fallback
      const timer = setTimeout(() => {
        if (isMounted && isLoading) setIsLoading(false)
      }, 4500)

      try {
        const { data, error } = await getTipPosts()
        if (error) throw error
        if (data && isMounted) {
          const categoryMap = {
            tip: 'Mẹo tiết kiệm',
            community: 'Cộng đồng',
            qa: 'Hỏi đáp',
            review: 'Review thiết bị'
          }

          const mapped = data.map(post => ({
            id: post.id || Math.random().toString(),
            title: post.title || 'Bài viết',
            slug: post.slug || '',
            author: post.profiles?.name || post.profiles?.email || 'Thành viên E-XANH',
            authorAvatar: post.profiles?.avatar_url || 'EX',
            category: categoryMap[post.type] || 'Mẹo tiết kiệm',
            status: 'published',
            image: post.image_url || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=260&fit=crop',
            description: post.description || '',
            content: post.content || '',
            likes: post.likes_count || 0,
            comments: post.comments_count || 0,
            savedCount: post.saved_count || 0,
            readTime: post.read_time || '3 phút',
            date: post.created_at ? new Date(post.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            commentItems: [],
          }))
          setDbPosts(mapped)
        }
      } catch (err) {
        console.error("Lỗi fetch posts:", err)
        if (isMounted) setErrorMsg('Không thể tải bài viết lúc này.')
      } finally {
        if (isMounted) setIsLoading(false)
        clearTimeout(timer)
      }
    }
    loadPosts()
    return () => { isMounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currentPosts = dbPosts

  const visiblePosts = sortPosts(
    currentPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'Tất cả' || post.category === selectedCategory
      const keyword = searchValue.trim().toLowerCase()
      const matchesSearch =
        keyword.length === 0 ||
        post.title.toLowerCase().includes(keyword) ||
        post.description.toLowerCase().includes(keyword) ||
        post.category.toLowerCase().includes(keyword)

      return matchesCategory && matchesSearch && post.status === 'published'
    }),
    sortValue,
  )

  return (
    <>
      <Helmet>
        <title>Mẹo tiết kiệm điện - E-XANH</title>
        <meta
          name="description"
          content="Tổng hợp mẹo tiết kiệm điện dễ áp dụng cho sinh viên, phòng trọ và ký túc xá."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Mẹo tiết kiệm điện - E-XANH" />
        <meta
          property="og:description"
          content="Khám phá các mẹo dùng điện thông minh, tiết kiệm chi phí và sống xanh hơn mỗi ngày."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://e-xanh.vercel.app/og-image-v2.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://e-xanh.vercel.app/og-image-v2.png" />
      </Helmet>
      
      <div className="tips-page">
      <PageHero {...pageHeroContent.tips} />

      <PostFilterBar
        searchValue={searchValue}
        selectedCategory={selectedCategory}
        sortValue={sortValue}
        categories={postCategories}
        sortOptions={postSortOptions}
        onSearchChange={setSearchValue}
        onCategoryChange={setSelectedCategory}
        onSortChange={setSortValue}
      />

      <div className="tips-layout">
        <div className="tips-layout__content">
          <div className="tips-post-grid">
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {visiblePosts.length === 0 ? (
            <div className="tips-empty-state">
              <strong>Không tìm thấy kết quả phù hợp</strong>
              <p>Hãy thử đổi từ khóa tìm kiếm hoặc chọn lại bộ lọc chủ đề.</p>
            </div>
          ) : null}
        </div>

        <aside className="tips-layout__sidebar">
          <section className="tips-side-card tips-side-card--suggestion">
            <h2>{todaySuggestion.title}</h2>
            <p>{todaySuggestion.content}</p>
          </section>

          <section className="tips-side-card">
            <h2>Chủ đề nổi bật</h2>
            <div className="tips-topic-list">
              {featuredTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  className="tips-topic-chip"
                  onClick={() => setSelectedCategory(topic === 'Thiết bị gia dụng' ? 'Thiết bị điện' : topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
          </section>

          <section className="tips-side-card">
            <h2>Bài viết được lưu nhiều</h2>
            <div className="tips-saved-list">
              {savedHighlights.map((item) => (
                <Link key={item.id} to={`/meo-tiet-kiem/${item.id}`} className="tips-saved-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <span className="tips-saved-item__icon">{item.icon}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.savedCount} lượt lưu</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="tips-side-card tips-side-card--cta">
            <span className="tips-side-card__cta-icon">✎</span>
            <h2>Bạn có mẹo hay?</h2>
            <p>
              Chia sẻ kinh nghiệm tiết kiệm điện của bạn để lan tỏa lối sống xanh đến
              cộng đồng.
            </p>
            <Link className="btn btn--light" to="/cong-dong">
              Đăng bài chia sẻ
            </Link>
          </section>
        </aside>
      </div>
    </div>
    </>
  )
}

export default TipsPage
