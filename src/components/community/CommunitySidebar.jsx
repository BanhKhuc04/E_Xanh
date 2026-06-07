import { Link } from 'react-router-dom'

function CommunitySidebar({
  activeMembers,
  trendingTopics,
  popularCommunityPosts,
  communityRules,
}) {
  return (
    <aside className="community-sidebar-panel">
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

      <section className="community-sidebar-panel__card">
        <h2>Chủ đề đang thảo luận</h2>
        <div className="community-sidebar-panel__topics">
          {trendingTopics.map((topic) => (
            <span key={topic}>{topic}</span>
          ))}
        </div>
      </section>

      <section className="community-sidebar-panel__card community-sidebar-panel__card--rules">
        <h2>Quy tắc cộng đồng</h2>
        <ul>
          {communityRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

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

      <section className="community-sidebar-panel__card community-sidebar-panel__card--cta">
        <h2>Có kinh nghiệm hay?</h2>
        <p>
          Chia sẻ bài viết của bạn với cộng đồng E-XANH để cùng nhau lan tỏa lối sống xanh.
        </p>
        <Link className="btn btn--light" to="/dang-bai">
          Đăng bài ngay
        </Link>
      </section>
    </aside>
  )
}

export default CommunitySidebar
