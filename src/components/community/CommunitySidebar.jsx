import { Link } from 'react-router-dom'
import { usePostComposer } from './PostComposerContext'
import ActiveMembersPanel from './ActiveMembersPanel'

const DEFAULT_RULES = [
  'Tôn trọng lẫn nhau, không dùng từ ngữ công kích.',
  'Chỉ chia sẻ nội dung liên quan đến lối sống xanh, tiết kiệm năng lượng.',
  'Không spam hoặc quảng cáo sản phẩm sai mục đích.',
]

function CommunitySidebar({
  activeMembers = [],
  activeMembersLoading = false,
  activeMembersError = '',
  trendingTopics = [],
  popularCommunityPosts = [],
  communityRules = DEFAULT_RULES,
}) {
  const { openComposer } = usePostComposer()

  return (
    <aside className="community-sidebar-panel">
      <ActiveMembersPanel
        members={activeMembers}
        loading={activeMembersLoading}
        error={activeMembersError}
        className="community-sidebar-panel__card"
      />

      {trendingTopics.length > 0 ? (
        <section className="community-sidebar-panel__card">
          <h2>Chủ đề đang thảo luận</h2>
          <div className="community-sidebar-panel__topics">
            {trendingTopics.map((topic) => (
              <span key={topic}>{topic}</span>
            ))}
          </div>
        </section>
      ) : null}

      {communityRules.length > 0 ? (
        <section className="community-sidebar-panel__card community-sidebar-panel__card--rules">
          <h2>Quy tắc cộng đồng</h2>
          <ul>
            {communityRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {popularCommunityPosts.length > 0 ? (
        <section className="community-sidebar-panel__card">
          <h2>Bài viết được yêu thích</h2>
          <div className="community-sidebar-panel__popular">
            {popularCommunityPosts.map((post) => (
              <article key={post.id}>
                <strong>
                  <Link to={`/cong-dong/${post.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {post.title}
                  </Link>
                </strong>
                <span>{post.likes} thích · {post.commentsCount || post.comments || 0} bình luận</span>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="community-sidebar-panel__card community-sidebar-panel__card--cta">
        <h2>Có kinh nghiệm hay?</h2>
        <p>Chia sẻ bài viết của bạn với cộng đồng E-XANH để cùng lan tỏa lối sống xanh.</p>
        <button
          type="button"
          className="btn btn--light"
          onClick={() => openComposer({ defaultType: 'community' })}
        >
          Đăng bài ngay
        </button>
      </section>
    </aside>
  )
}

export default CommunitySidebar
