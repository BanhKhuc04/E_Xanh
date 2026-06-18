import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Bookmark, Lightbulb, PenSquare, ArrowRight, Wind, Laptop, PlugZap, Leaf, Box, Search } from 'lucide-react'
import PostCard from '../../components/posts/PostCard'
import PostFilterBar from '../../components/posts/PostFilterBar'
import PageLoader from '../../components/common/PageLoader'
import EmptyState from '../../components/common/EmptyState'
import { getCategories, getTipPosts } from '../../services/postService'
import heroImage from '../../assets/hero.png'
import '../../styles/tips.css'

const PREDEFINED_CATEGORIES = [
  'Tất cả',
  'Điều hòa',
  'Laptop',
  'Thiết bị điện',
  'Thói quen',
  'Tủ lạnh'
]

const postSortOptions = [
  'Mới nhất',
  'Lưu nhiều nhất',
  'Xem nhiều nhất',
  'Phù hợp nhất'
]

function getTopicIcon(topicName) {
  switch (topicName) {
    case 'Điều hòa': return <Wind size={18} />
    case 'Laptop': return <Laptop size={18} />
    case 'Thiết bị điện': return <PlugZap size={18} />
    case 'Thói quen': return <Leaf size={18} />
    case 'Tủ lạnh': return <Box size={18} />
    default: return <Lightbulb size={18} />
  }
}

function sortPosts(list, sortValue, searchValue) {
  const next = [...list]

  if (sortValue === 'Lưu nhiều nhất') {
    return next.sort((a, b) => b.savedCount - a.savedCount)
  }

  if (sortValue === 'Xem nhiều nhất') {
    return next.sort((a, b) => b.views - a.views)
  }

  if (sortValue === 'Phù hợp nhất' && searchValue) {
    const keyword = searchValue.toLowerCase()
    return next.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(keyword) ? 1 : 0
      const bTitleMatch = b.title.toLowerCase().includes(keyword) ? 1 : 0
      if (aTitleMatch !== bTitleMatch) return bTitleMatch - aTitleMatch
      return b.savedCount - a.savedCount
    })
  }

  return next.sort((a, b) => new Date(b.date) - new Date(a.date))
}

function TipsPage() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [sortValue, setSortValue] = useState('Mới nhất')
  const [dbPosts, setDbPosts] = useState([])
  const [categories, setCategories] = useState(PREDEFINED_CATEGORIES)
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
          let fetchedCategories = PREDEFINED_CATEGORIES;
          if (!catsRes.error && catsRes.data) {
            const dbCats = catsRes.data.map((category) => category.name)
            fetchedCategories = Array.from(new Set([...PREDEFINED_CATEGORIES, ...dbCats]))
          }
          setCategories(fetchedCategories)

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
              views: post.views_count || Math.floor(Math.random() * 100),
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

  const visiblePosts = sortPosts(
    dbPosts.filter((post) => {
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
    searchValue
  )

  const dynamicSavedHighlights = useMemo(() => {
    return [...dbPosts].sort((a, b) => b.savedCount - a.savedCount).slice(0, 3)
  }, [dbPosts])

  const featuredTopicsWithCounts = useMemo(() => {
    const counts = {}
    dbPosts.forEach(post => {
      if (post.category) {
        counts[post.category] = (counts[post.category] || 0) + 1
      }
    })
    
    let topTopics = PREDEFINED_CATEGORIES.filter(c => c !== 'Tất cả').map(name => ({
      name,
      count: counts[name] || 0
    }))
    
    topTopics.sort((a, b) => b.count - a.count)
    return topTopics.slice(0, 6)
  }, [dbPosts])

  const dynamicTodaySuggestion = useMemo(() => {
    if (dbPosts.length === 0) return {
      title: 'Tắt thiết bị khi không sử dụng',
      content: 'Rút sạc, tắt đèn và TV khi rời phòng để giảm điện năng tiêu thụ không cần thiết.',
      tag: 'Thói quen',
      slug: ''
    }
    const daySeed = new Date().toISOString().slice(0, 10)
    const suggestionIndex = Array.from(daySeed).reduce(
      (total, char) => total + char.charCodeAt(0),
      0,
    ) % dbPosts.length
    const randomPost = dbPosts[suggestionIndex]
    
    return {
      title: randomPost.title,
      content: randomPost.description || 'Khám phá mẹo hữu ích này để giúp bạn tiết kiệm năng lượng và chi phí mỗi ngày.',
      tag: randomPost.category,
      slug: randomPost.slug || randomPost.id
    }
  }, [dbPosts])

  if (isLoading) {
    return <PageLoader message="Đang tải dữ liệu mẹo tiết kiệm..." />
  }

  const totalSaves = dbPosts.reduce((acc, p) => acc + p.savedCount, 0)

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
      </Helmet>
      
      <div className="tips-page">
        <section className="tips-hero-compact">
          <div className="tips-hero-compact__content">
            <h1>Mẹo tiết kiệm điện</h1>
            <p>Khám phá các cách sử dụng điện thông minh, tiết kiệm chi phí và sống xanh hơn mỗi ngày.</p>
            <div className="tips-hero-compact__stats">
              <div className="tips-stat-item">
                <strong>{dbPosts.length}</strong>
                <span>Mẹo hữu ích</span>
              </div>
              <div className="tips-stat-divider" />
              <div className="tips-stat-item">
                <strong>{categories.length - 1}</strong>
                <span>Chủ đề</span>
              </div>
              <div className="tips-stat-divider" />
              <div className="tips-stat-item">
                <strong>{totalSaves}</strong>
                <span>Bài được lưu</span>
              </div>
            </div>
          </div>
        </section>

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

        <div className="tips-explore-grid">
          <div className="tips-explore-card tips-card--suggestion">
            <div className="tips-card__header-icon">
              <Lightbulb size={24} strokeWidth={2} />
            </div>
            <div className="tips-card__content">
              <div className="tips-card__meta">
                <span className="tips-card__tag">{dynamicTodaySuggestion.tag}</span>
                <span className="tips-card__label">Gợi ý hôm nay</span>
              </div>
              <h3>{dynamicTodaySuggestion.title}</h3>
              <p>{dynamicTodaySuggestion.content}</p>
              {dynamicTodaySuggestion.slug ? (
                <Link to={`/meo-tiet-kiem/${dynamicTodaySuggestion.slug}`} className="tips-btn-outline">
                  Xem mẹo <ArrowRight size={16} />
                </Link>
              ) : (
                <button className="tips-btn-outline" disabled>
                  Đang cập nhật <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="tips-explore-card tips-card--cta">
            <div className="tips-card__cta-icon">
              <PenSquare size={28} strokeWidth={2} />
            </div>
            <div className="tips-card__cta-text">
              <h3>Bạn có mẹo tiết kiệm điện?</h3>
              <p>Chia sẻ kinh nghiệm của bạn để lan tỏa lối sống xanh đến cộng đồng.</p>
            </div>
            <Link to="/dang-bai" className="tips-btn-primary">
              Đăng bài chia sẻ
            </Link>
          </div>

          <div className="tips-explore-card tips-card--topics">
            <h3>Chủ đề nổi bật</h3>
            <div className="tips-topic-grid">
              {featuredTopicsWithCounts.map((topic) => (
                <button
                  key={topic.name}
                  className={`tips-topic-card-mini ${selectedCategory === topic.name ? 'is-active' : ''}`}
                  onClick={() => setSelectedCategory(topic.name)}
                >
                  <span className="topic-icon">{getTopicIcon(topic.name)}</span>
                  <div className="topic-info">
                    <span className="topic-name">{topic.name}</span>
                    <span className="topic-count">{topic.count} bài</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="tips-explore-card tips-card--saved">
            <h3>Bài viết được lưu nhiều</h3>
            <div className="tips-saved-list-new">
              {dynamicSavedHighlights.length > 0 ? (
                dynamicSavedHighlights.map((post, index) => (
                  <Link key={post.id} to={`/meo-tiet-kiem/${post.slug}`} className="tips-saved-item-new">
                    <div className={`saved-rank saved-rank--${index + 1}`}>{index + 1}</div>
                    <div className="saved-details">
                      <h4>{post.title}</h4>
                      <span><Bookmark size={12} style={{ display: 'inline', marginRight: '4px' }}/> {post.savedCount} lượt lưu</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="tips-empty-saved">
                  <Bookmark size={32} strokeWidth={1.5} />
                  <p>Chưa có nhiều dữ liệu lưu. Các bài được yêu thích sẽ xuất hiện tại đây.</p>
                </div>
              )}
            </div>
          </div>
        </div>

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

          {!errorMsg && visiblePosts.length > 0 ? (
            <div className="tips-post-grid">
              {visiblePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : null}

          {!errorMsg && visiblePosts.length === 0 ? (
            <EmptyState 
              icon={<Search size={32} />}
              title="Không tìm thấy kết quả phù hợp"
              message="Hãy thử đổi từ khóa tìm kiếm hoặc chọn lại bộ lọc chủ đề. Các mẹo mới sẽ sớm được cập nhật."
            />
          ) : null}
        </div>
      </div>
    </>
  )
}

export default TipsPage
