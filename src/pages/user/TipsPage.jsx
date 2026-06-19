import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import PostCard from '../../components/posts/PostCard'
import PostFilterBar from '../../components/posts/PostFilterBar'
import PageLoader from '../../components/common/PageLoader'
import EmptyState from '../../components/common/EmptyState'
import PageHero from '../../components/common/PageHero'
import RelatedPostsSection from '../../components/posts/RelatedPostsSection'
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

const POSTS_PER_PAGE = 6

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
  const [currentPage, setCurrentPage] = useState(1)
  const location = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${location.pathname}`

  // If query params are present for category (e.g., from PostDetailPage)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const cat = params.get('category')
    if (cat && categories.includes(cat)) {
      setSelectedCategory(cat)
    }
  }, [location.search, categories])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchValue, selectedCategory, sortValue])

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
              type: post.type,
              author: post.profiles?.name || 'Thành viên E-XANH',
              authorId: post.author_id,
              authorAvatar: post.profiles?.avatar_url || '',
              category: post.categories?.name || 'Mẹo tiết kiệm',
              status: 'published',
              image: post.image_url || heroImage,
              description: post.description || 'Chưa có mô tả ngắn.',
              content: post.content || '',
              likes: post.likes_count || 0,
              comments: post.comments_count || 0,
              savedCount: post.saved_count || 0,
              views: post.views_count || 0,
              readTime: post.read_time || '3 phút',
              date: post.created_at ? new Date(post.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
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
  }, []) // Remove location.key from dependency array to prevent double fetching

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

  const totalPages = Math.ceil(visiblePosts.length / POSTS_PER_PAGE)
  const paginatedPosts = visiblePosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  )

  const suggestedPosts = dbPosts.slice(0, 3) // Latest 3 posts

  const handleClearFilter = () => {
    setSelectedCategory('Tất cả')
    setSearchValue('')
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    const listElement = document.getElementById('tips-list')
    if (listElement) {
      const y = listElement.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

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
      </Helmet>
      
      <div className="tips-page">
        <PageHero
          pageKey="tips"
          className="tips-page-hero"
          badge="Mẹo tiết kiệm điện"
          title="Cùng nhau tiết kiệm điện mỗi ngày"
          description="Khám phá những mẹo sử dụng điện thông minh, giảm chi phí và xây dựng lối sống xanh hơn."
          fallbackImage={heroImage}
          actions={
            <>
              <Link to="/dang-bai" className="btn btn--primary">
                Đăng bài chia sẻ
              </Link>
              <a href="#tips-list" className="btn btn--secondary" onClick={(e) => {
                e.preventDefault();
                document.getElementById('tips-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}>
                Khám phá ngay
              </a>
            </>
          }
        />

        <div id="tips-list">
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
        </div>

        <div className="tips-layout__content">
          <div className="tips-results-bar">
            <div>
              <strong>{visiblePosts.length}</strong> bài viết
              {selectedCategory !== 'Tất cả' && (
                <span> trong chủ đề <span className="highlight-category">"{selectedCategory}"</span></span>
              )}
              {searchValue && (
                <span> cho từ khóa <span className="highlight-category">"{searchValue}"</span></span>
              )}
            </div>
            
            {(selectedCategory !== 'Tất cả' || searchValue) && (
              <button className="tips-clear-filter" onClick={handleClearFilter}>
                Bỏ lọc <X size={14} />
              </button>
            )}
          </div>

          {errorMsg ? (
            <EmptyState
              icon="!"
              title="Không tải được dữ liệu"
              message={errorMsg}
            />
          ) : null}

          {!errorMsg && visiblePosts.length > 0 ? (
            <>
              <div className="tips-posts-grid">
                {paginatedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="tips-pagination">
                  <button 
                    className="tips-pagination__btn" 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} /> Trước
                  </button>
                  
                  <div className="tips-pagination__numbers">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        className={`tips-pagination__number ${currentPage === i + 1 ? 'is-active' : ''}`}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button 
                    className="tips-pagination__btn" 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                  >
                    Sau <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : null}

          {!errorMsg && visiblePosts.length === 0 ? (
            <div className="tips-empty-posts">
              <Search size={40} strokeWidth={1.5} color="#888" />
              <h3>Không tìm thấy bài viết</h3>
              <p>Chưa có nhiều mẹo trong chủ đề này. Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
              <button onClick={handleClearFilter} className="tips-btn-primary">
                Hiển thị tất cả
              </button>
            </div>
          ) : null}
        </div>

        {/* Suggested Section */}
        {suggestedPosts.length > 0 && (
          <div className="tips-suggested-section" style={{ marginTop: '40px' }}>
            <RelatedPostsSection title="Có thể bạn quan tâm" posts={suggestedPosts} compact={true} />
          </div>
        )}
      </div>
    </>
  )
}

export default TipsPage
