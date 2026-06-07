import { Link } from 'react-router-dom'

function CommunityPreview({ community }) {
  return (
    <section className="home-section">
      <div className="community-preview">
        <div className="community-preview__feed">
          <div className="home-section__header home-section__header--stacked">
            <div>
              <h2>Hoạt động cộng đồng</h2>
              <p>{community.activityNote}</p>
            </div>
          </div>

          <div className="community-preview__posts">
            {community.posts.map((post) => (
              <article key={post.author} className="community-preview__post">
                <div className="community-preview__post-top">
                  <div className="community-preview__author">
                    <span className={`home-avatar home-avatar--${post.tone}`}>
                      {post.initials}
                    </span>
                    <div>
                      <strong>{post.author}</strong>
                      <span>{post.time}</span>
                    </div>
                  </div>

                  <span className="community-preview__pill">{post.type}</span>
                </div>

                <p>{post.content}</p>

                <div className="community-preview__actions">
                  <span>{post.likes} thích</span>
                  <span>{post.comments} bình luận</span>
                  <span>Lưu bài</span>
                </div>
              </article>
            ))}
          </div>

          <Link className="btn community-preview__button" to="/cong-dong">
            Xem cộng đồng
          </Link>
        </div>

        <aside className="community-preview__sidebar">
          <section className="community-preview__members">
            <h3>Thành viên tích cực</h3>
            <ul>
              {community.members.map((member) => (
                <li key={member.name}>
                  <span className={`community-preview__rank community-preview__rank--${member.rank}`}>
                    {member.rank}
                  </span>
                  <div>
                    <strong>{member.name}</strong>
                    <span>{member.points}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="community-preview__cta">
            <h3>Có kinh nghiệm hay?</h3>
            <p>Chia sẻ mẹo tiết kiệm điện của bạn để giúp nhiều người hơn.</p>
            <Link className="btn btn--light" to="/cong-dong">
              Đăng bài ngay
            </Link>
          </section>
        </aside>
      </div>
    </section>
  )
}

export default CommunityPreview
