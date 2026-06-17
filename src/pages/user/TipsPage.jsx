import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Bookmark, Flame, Lightbulb, PenSquare } from 'lucide-react'
import PostCard from '../../components/posts/PostCard'
import PostFilterBar from '../../components/posts/PostFilterBar'
import PageHero from '../../components/common/PageHero'
import PageLoader from '../../components/common/PageLoader'
import EmptyState from '../../components/common/EmptyState'
import { pageHeroContent } from '../../data/pageHeroes'
import { getCategories, getTipPosts } from '../../services/postService'
import heroImage from '../../assets/hero.png'
import '../../styles/tips.css'

const postSortOptions = [
  'Mới nhất',
  'Nhiều lượt lưu',
  'Nhiều tương tác',
]

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
  const [categories, setCategories] = useState(['Tất cả'])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const location = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${location.pathname}`

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      if (isMounted) {
        setIsLoading(true)
        setErrorMsg('')
      }

      try {
        const [postsRes, catsRes] = await Promise.all([
          getTipPosts(),
          getCategories(),
        ])

        if (postsRes.error) {
          throw postsRes.error
        }

        if (isMounted) {
          if (!catsRes.error && catsRes.data) {
            setCategories(['Tất cả', ...catsRes.data.map((category) => category.name)])
          }

          if (postsRes.data) {
            const mapped = postsRes.data.map((post, index) => ({
              id: post.id || post.slug || `tip-${index}`,
              title: post.title || 'Bài viết',
              slug: post.slug || '',
              author: post.profiles?.name || 'Thành viên E-XANH',
              authorId: post.author_id,
              authorAvatar: post.profiles?.avatar_url || '',
              category: post.categories?.name || 'Mẹo tiết kiệm',
              status: 'published',
              image: post.image_url || heroImage,
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
        }
      } catch (err) {
        console.error('Lỗi fetch data:', err)

        if (isMounted) {
          setDbPosts([])
          setErrorMsg('Không thể tải bài viết lúc này.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => { isMounted = false }
  }, [location.key])

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

  const dynamicSavedHighlights = useMemo(() => {
    return [...dbPosts].sort((a, b) => b.savedCount - a.savedCount).slice(0, 3)
  }, [dbPosts])

  const dynamicFeaturedTopics = useMemo(() => {
    const topics = new Set()
    dbPosts.forEach(p => p.category && topics.add(p.category))
    return Array.from(topics).slice(0, 4)
  }, [dbPosts])

  const dynamicTodaySuggestion = useMemo(() => {
    if (dbPosts.length === 0) return { title: 'Mẹo hôm nay', content: 'Hãy luôn tắt các thiết bị điện khi không sử dụng để tiết kiệm năng lượng.' }
    const randomPost = dbPosts[Math.floor(Math.random() * dbPosts.length)]
    return { title: 'Gợi ý cho bạn', content: randomPost.title }
  }, [dbPosts])

  if (isLoading) {
    return <PageLoader message="Đang tải dữ liệu mẹo tiết kiệm..." />
  }

  return (
    <>
      <Helmet>
        <title>Mẹo tiết kiệm - E-XANH</title>
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
        <PageHero {...pageHeroContent.tips} className="tips-hero" />

        <PostFilterBar
          searchValue={searchValue}
          selectedCategory={selectedCategory}
          sortValue={sortValue}
          categories={categories}
          sortOptions={postSortOptions}
          onSearchChange={setSearchValue}
          onCategoryChange={setSelectedCategory}
          onSortChange={setSortValue}
        />

        <div className="tips-layout">
          <section className="tips-layout__sidebar">
            <section className="tips-side-card tips-side-card--suggestion">
              <h2>{dynamicTodaySuggestion.title}</h2>
              <p>{dynamicTodaySuggestion.content}</p>
            </section>

            {dynamicFeaturedTopics.length > 0 && (
              <section className="tips-side-card">
                <h2>Chủ đề nổi bật</h2>
                <div className="tips-topic-list">
                  {dynamicFeaturedTopics.map((topic) => (
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
            )}

            {dynamicSavedHighlights.length > 0 && (
              <section className="tips-side-card">
                <h2>Bài viết được lưu nhiều</h2>
                <div className="tips-saved-list">
                  {dynamicSavedHighlights.map((item, index) => (
                    <Link key={item.id} to={`/meo-tiet-kiem/${item.slug || item.id}`} className="tips-saved-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <span className="tips-saved-item__icon" aria-hidden="true">
                        {index === 0 ? <Flame size={18} strokeWidth={2.1} /> : index === 1 ? <Bookmark size={18} strokeWidth={2.1} /> : <Lightbulb size={18} strokeWidth={2.1} />}
                      </span>
                      <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>{item.title}</h3>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>{item.savedCount} lượt lưu</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section className="tips-side-card tips-side-card--cta">
              <span className="tips-side-card__cta-icon" aria-hidden="true">
                <PenSquare size={26} strokeWidth={2.1} />
              </span>
              <h2>Bạn có mẹo hay?</h2>
              <p>
                Chia sẻ kinh nghiệm tiết kiệm điện của bạn để lan tỏa lối sống xanh đến
                cộng đồng.
              </p>
              <Link className="btn btn--light" to="/cong-dong">
                Đăng bài chia sẻ
              </Link>
            </section>
          </section>

          <div className="tips-layout__content">
            <div className="tips-results-bar">
              <div>
                <strong>{visiblePosts.length}</strong>
                <span> mẹo đang hiển thị</span>
              </div>
              <p>
                Kho bài viết được sắp theo dạng thư viện để bạn dễ duyệt nhanh nhiều mẹo hơn.
              </p>
            </div>

            {errorMsg ? (
              <EmptyState
                icon="!"
                title="Không tải được dữ liệu"
                message={errorMsg}
              />
            ) : null}

            <div className="tips-post-grid">
              {visiblePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {!errorMsg && visiblePosts.length === 0 ? (
              <EmptyState 
                icon="!"
                title="Không tìm thấy kết quả phù hợp"
                message="Hãy thử đổi từ khóa tìm kiếm hoặc chọn lại bộ lọc chủ đề."
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default TipsPage
