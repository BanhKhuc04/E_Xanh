import { useState } from 'react'
import { Link } from 'react-router-dom'
import PostCard from '../../components/posts/PostCard'
import PostFilterBar from '../../components/posts/PostFilterBar'
import {
  featuredTopics,
  postCategories,
  postSortOptions,
  posts,
  savedHighlights,
  todaySuggestion,
} from '../../data/posts'
import '../../styles/tips.css'

function sortPosts(list, sortValue) {
  const next = [...list]

  if (sortValue === 'Nhiều lượt lưu') {
    return next.sort((a, b) => b.savedCount - a.savedCount)
  }

  if (sortValue === 'Nhiều tương tác') {
    return next.sort((a, b) => b.likes + b.comments - (a.likes + a.comments))
  }

  return next.sort((a, b) => b.id - a.id)
}

function TipsPage() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [sortValue, setSortValue] = useState('Mới nhất')

  const visiblePosts = sortPosts(
    posts.filter((post) => {
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
    <div className="tips-page">
      <section className="tips-hero">
        <div className="tips-hero__content">
          <span className="tips-hero__badge">Thư viện mẹo tiết kiệm điện</span>
          <h1>Mẹo tiết kiệm điện</h1>
          <p>
            Khám phá các mẹo sử dụng điện thông minh, dễ áp dụng và phù hợp với đời
            sống hằng ngày.
          </p>
        </div>

        <div className="tips-hero__visual">
          <img
            src="https://lh3.googleusercontent.com/aida/AP1WRLuN-xlTzAvJ2YABiTMep4m7AmleqctohMTuoKlE9fbpDfOurOPpxlPDVFqJTzSKKW1EzA8pNxTUs6Fpx-q6aAd-3rDINQAB6l2wPmKnH8GXWFFE13z8viDR6LRyXWbHWDxbEWOIPA-IJPjhJcnAjr60C0csDBkONsodp0qr5dzDZScorKpmiUIHRtXntOk4E6i4wU5ZPbxC_man3Q9XsaBAhbolMgSWryFn2rKce48bpFdIoHM7ZOfnYJn_"
            alt="Không gian học tập xanh với các mẹo tiết kiệm điện"
          />
        </div>
      </section>

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
              <strong>Chưa có bài viết phù hợp</strong>
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
                <article key={item.id} className="tips-saved-item">
                  <span className="tips-saved-item__icon">{item.icon}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.savedCount} lượt lưu</p>
                  </div>
                </article>
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
  )
}

export default TipsPage
