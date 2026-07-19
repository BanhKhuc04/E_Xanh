import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import SEO from '../../components/SEO'
import PostCard from '../../components/posts/PostCard'
import PostFilterBar from '../../components/posts/PostFilterBar'
import PageLoader from '../../components/common/PageLoader'
import EmptyState from '../../components/common/EmptyState'
import PageHero from '../../components/common/PageHero'
import RelatedPostsSection from '../../components/posts/RelatedPostsSection'
import { getCategories, getTipPosts } from '../../services/postService'
import { useAuth } from '../../contexts/AuthContext'
import heroImage from '../../assets/hero.png'
import { manualPosts } from '../../data/manualPosts'
import '../../styles/tips.css'

// Ảnh fallback theo danh mục — dùng khi bài viết không có ảnh riêng
const CATEGORY_FALLBACK_IMAGES = {
  'Điều hòa':      '/images/bai-viet-01.png',
  'Laptop':        '/images/bai-viet-13.png',
  'Tủ lạnh':       '/images/bai-viet-21.png',
  'Thiết bị điện': '/images/bai-viet-28.png',
  'Thói quen':     '/images/bai-viet-38.png',
  'Mẹo chung':     '/images/bai-viet-48.png',
}

function getCategoryImage(category) {
  return CATEGORY_FALLBACK_IMAGES[category] || heroImage
}


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
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [page, setPage] = useState(1)
  const [hasMorePosts, setHasMorePosts] = useState(false)
  const location = useLocation()
  
  const params = new URLSearchParams(location.search)
  const cat = params.get('category')
  const [prevCat, setPrevCat] = useState(cat)
  if (cat !== prevCat) {
    setPrevCat(cat)
    if (cat && categories.includes(cat)) {
      setSelectedCategory(cat)
    }
  }

  const [prevFilters, setPrevFilters] = useState({ searchValue, selectedCategory })
  if (
    searchValue !== prevFilters.searchValue || 
    selectedCategory !== prevFilters.selectedCategory
  ) {
    setPrevFilters({ searchValue, selectedCategory })
    setPage(1)
    setDbPosts([]) // Xóa post cũ khi đổi filter
  }

  const canonicalUrl = `https://e-xanh.vercel.app${location.pathname}`

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      if (isMounted) {
        if (page === 1) setIsLoading(true)
        else setIsLoadingMore(true)
        setErrorMsg('')
      }

      try {
        const [postsRes, catsRes] = await Promise.all([
          getTipPosts({ page, limit: POSTS_PER_PAGE, category: selectedCategory, search: searchValue }),
          page === 1 ? getCategories() : Promise.resolve({ data: null, error: null }),
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
              const mapped = postsRes.data.map((post, index) => {
                const categoryName = post.categories?.name || 'Mẹo tiết kiệm'
                return {
                  id: post.id || post.slug || `tip-${index}`,
                  title: post.title || 'Bài viết',
                  slug: post.slug || '',
                  type: post.type,
                  author: post.profiles?.name || 'Thành viên E-XANH',
                  authorId: post.author_id,
                  authorAvatar: post.profiles?.avatar_url || '',
                  category: categoryName,
                  status: 'published',
                  image: post.cover_card_url || post.cover_url || post.image_url || getCategoryImage(categoryName),
                  description: post.description || 'Chưa có mô tả ngắn.',
                  content: post.content || '',
                  likes: post.likes_count || 0,
                  comments: post.comments_count || 0,
                  savedCount: post.saved_count || 0,
                  views: post.views_count || 0,
                  readTime: post.read_time || '3 phút',
                  date: post.created_at ? new Date(post.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                }
              })
            if (page === 1) {
              setDbPosts(mapped)
            } else {
              setDbPosts(prev => [...prev, ...mapped])
            }
            setHasMorePosts(postsRes.hasMore)
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
          setIsLoadingMore(false)
        }
      }
    }

    loadData()

    return () => { isMounted = false }
  }, [page, selectedCategory, searchValue])

  // Chuẩn hoá manualPosts sang cùng shape với dbPosts
  const normalizedManual = useMemo(() => {
    return manualPosts.map((p) => ({
      id: `manual-${p.id}`,
      title: p.title,
      slug: p.slug,
      type: p.type || 'tip',
      author: p.author,
      authorId: null,
      authorAvatar: '',
      category: p.category,
      status: 'published',
      image: p.image || getCategoryImage(p.category),
      description: p.description,
      content: p.content,
      likes: p.likes || 0,
      comments: p.comments || 0,
      savedCount: p.savedCount || 0,
      views: 0,
      readTime: p.readTime || '3 phút đọc',
      date: p.date || '',
    }))
  }, [])

  // Merge: bài Supabase trước, bài thủ công sau (bỏ bài trùng slug)
  const dbSlugs = new Set(dbPosts.map((p) => p.slug))
  const mergedPosts = [
    ...dbPosts,
    ...normalizedManual.filter((p) => !dbSlugs.has(p.slug)),
  ]

  // Áp dụng filter category + search lên toàn bộ merged
  const filteredMerged = mergedPosts.filter((post) => {
    const matchCat =
      selectedCategory === 'Tất cả' || post.category === selectedCategory
    const matchSearch = !searchValue ||
      post.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      post.description.toLowerCase().includes(searchValue.toLowerCase())
    return matchCat && matchSearch
  })

  const visiblePosts = sortPosts(filteredMerged, sortValue, searchValue)

  const suggestedPosts = [] // No longer statically suggested here


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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Trang chủ",
        "item": "https://e-xanh.vercel.app/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Mẹo tiết kiệm điện hiệu quả",
        "item": "https://e-xanh.vercel.app/meo-tiet-kiem"
      }
    ]
  }

  return (
    <>
      <SEO 
        title="Mẹo tiết kiệm điện hiệu quả" 
        description="Tổng hợp mẹo tiết kiệm điện dễ áp dụng cho sinh viên, phòng trọ và ký túc xá." 
        url={canonicalUrl} 
        schema={breadcrumbSchema}
      />
      
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
              <motion.div 
                className="tips-posts-grid"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {visiblePosts.map((post) => (
                  <motion.div
                    key={post.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </motion.div>

              {hasMorePosts && (
                <div className="tips-pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                  <button 
                    className="btn btn--primary" 
                    onClick={() => setPage(p => p + 1)} 
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? 'Đang tải...' : 'Tải thêm'}
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
