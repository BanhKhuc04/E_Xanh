import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CommunityFilterBar from '../../components/community/CommunityFilterBar'
import CommunityPostCard from '../../components/community/CommunityPostCard'
import CommunitySidebar from '../../components/community/CommunitySidebar'
import PostComposer from '../../components/community/PostComposer'
import {
  activeMembers,
  communityFilters,
  communityHero,
  communityPosts,
  communityRules,
  popularCommunityPosts,
  trendingTopics,
} from '../../data/community'
import '../../styles/community.css'

function sortCommunityPosts(posts, activeFilter) {
  const items = [...posts]

  if (activeFilter === 'Mới nhất') {
    return items.sort((first, second) => new Date(second.publishedAt) - new Date(first.publishedAt))
  }

  if (activeFilter === 'Nhiều tương tác') {
    return items.sort(
      (first, second) =>
        second.likes + second.commentsCount + second.shares -
        (first.likes + first.commentsCount + first.shares),
    )
  }

  if (activeFilter === 'Hỏi đáp' || activeFilter === 'Kinh nghiệm') {
    return items.filter((post) => post.topic === activeFilter)
  }

  if (activeFilter === 'Đã lưu nhiều') {
    return items.sort((first, second) => second.savedCount - first.savedCount)
  }

  return items
}

function CommunityPage() {
  const [activeFilter, setActiveFilter] = useState('Tất cả')
  const [posts, setPosts] = useState(communityPosts)
  const [visibleCount, setVisibleCount] = useState(3)

  const filteredPosts = useMemo(
    () => sortCommunityPosts(posts, activeFilter),
    [activeFilter, posts],
  )

  const visiblePosts = filteredPosts.slice(0, visibleCount)
  const hasMorePosts = filteredPosts.length > visibleCount

  function handleFilterChange(filter) {
    setActiveFilter(filter)
    setVisibleCount(3)
  }

  function handleToggleLike(postId) {
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) {
          return post
        }

        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        }
      }),
    )
  }

  function handleToggleSave(postId) {
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) {
          return post
        }

        return {
          ...post,
          isSaved: !post.isSaved,
          savedCount: post.isSaved ? post.savedCount - 1 : post.savedCount + 1,
        }
      }),
    )
  }

  return (
    <div className="community-page">
      <section className="community-page__hero">
        <div className="community-page__hero-content">
          <span className="community-page__badge">{communityHero.badge}</span>
          <h1>{communityHero.title}</h1>
          <p>{communityHero.description}</p>

          <div className="community-page__hero-actions">
            <Link className="btn btn--primary" to="/dang-bai">
              Viết bài chia sẻ
            </Link>
            <a className="btn btn--secondary" href="#cong-dong-feed">
              Khám phá bài viết
            </a>
          </div>
        </div>

        <div className="community-page__hero-visual">
          <img src={communityHero.image} alt="Nhóm sinh viên đang chia sẻ kinh nghiệm sống xanh" />
        </div>
      </section>

      <div className="community-page__layout">
        <div className="community-page__feed">
          <PostComposer />

          <CommunityFilterBar
            filters={communityFilters}
            activeFilter={activeFilter}
            onChange={handleFilterChange}
          />

          <section id="cong-dong-feed" className="community-page__posts">
            {visiblePosts.length > 0 ? (
              visiblePosts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  onToggleLike={handleToggleLike}
                  onToggleSave={handleToggleSave}
                />
              ))
            ) : (
              <div className="community-page__empty">
                <span>CHAT</span>
                <h2>Chưa có bài viết nào trong cộng đồng.</h2>
                <Link className="btn btn--primary" to="/dang-bai">
                  Trở thành người chia sẻ đầu tiên
                </Link>
              </div>
            )}
          </section>

          {hasMorePosts ? (
            <div className="community-page__more">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setVisibleCount((current) => current + 2)}
              >
                Xem thêm bài viết
              </button>
            </div>
          ) : null}
        </div>

        <CommunitySidebar
          activeMembers={activeMembers}
          trendingTopics={trendingTopics}
          popularCommunityPosts={popularCommunityPosts}
          communityRules={communityRules}
        />
      </div>
    </div>
  )
}

export default CommunityPage
