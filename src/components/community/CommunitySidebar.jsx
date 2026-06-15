import { usePostComposer } from './PostComposerContext'

function CommunitySidebar({
  activeMembers = [],
  trendingTopics = [],
  popularCommunityPosts = [],
  communityRules = [
    'Tôn trọng lẫn nhau, không dùng từ ngữ công kích.',
    'Chỉ chia sẻ nội dung liên quan đến lối sống xanh, tiết kiệm năng lượng.',
    'Không spam hoặc quảng cáo sản phẩm sai mục đích.',
  ],
}) {
  const { openComposer } = usePostComposer()

  return (
    <aside className="community-sidebar-panel">
      {activeMembers && activeMembers.length > 0 && (
        <section className="community-sidebar-panel__card">
          <h2>Thành viên tích cực</h2>
          <div className="community-sidebar-panel__members">
            {activeMembers.map((member) => (
              <article key={member.id} className="community-sidebar-panel__member">
                <img src={member.avatar} alt={member.name} />
                <div>
                  <strong>{member.name}</strong>
                  <span>{member.contribution}</span>
                </div>
                <em>{member.badge}</em>
              </article>
            ))}
          </div>
        </section>
      )}

      {trendingTopics && trendingTopics.length > 0 && (
        <section className="community-sidebar-panel__card">
          <h2>Chủ đề đang thảo luận</h2>
          <div className="community-sidebar-panel__topics">
            {trendingTopics.map((topic) => (
              <span key={topic}>{topic}</span>
            ))}
          </div>
        </section>
      )}

      {communityRules && communityRules.length > 0 && (
        <section className="community-sidebar-panel__card community-sidebar-panel__card--rules">
          <h2>Quy tắc cộng đồng</h2>
          <ul>
            {communityRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>
      )}

      {popularCommunityPosts && popularCommunityPosts.length > 0 && (
        <section className="community-sidebar-panel__card">
          <h2>Bài viết được yêu thích</h2>
          <div className="community-sidebar-panel__popular">
            {popularCommunityPosts.map((post) => (
              <article key={post.id}>
                <strong>{post.title}</strong>
                <span>
                  {post.likes} thích • {post.comments} bình luận
                </span>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="community-sidebar-panel__card community-sidebar-panel__card--cta">
        <h2>Có kinh nghiệm hay?</h2>
        <p>
          Chia sẻ bài viết của bạn với cộng đồng E-XANH để cùng nhau lan tỏa lối sống xanh.
        </p>
        <button type="button" className="btn btn--light" onClick={() => openComposer({ defaultType: 'community' })}>
          Đăng bài ngay
        </button>
      </section>
    </aside>
  )
}

export default CommunitySidebar
