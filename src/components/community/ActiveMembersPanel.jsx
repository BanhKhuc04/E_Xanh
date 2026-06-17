import { Link } from 'react-router-dom'
import ActiveMemberAvatar from './ActiveMemberAvatar'

function ActiveMembersPanel({
  members = [],
  loading = false,
  error = '',
  className = '',
  title = 'Thành viên tích cực',
}) {
  const panelClassName = className ? className : ''

  return (
    <section className={panelClassName}>
      <h2 className="sidebar-title">{title}</h2>

      {loading ? (
        <div className="active-members-state">Đang tải thành viên...</div>
      ) : null}

      {!loading && error ? (
        <div className="active-members-state active-members-state--error">
          Chưa thể tải thành viên tích cực.
        </div>
      ) : null}

      {!loading && !error && members.length === 0 ? (
        <div className="active-members-state">
          <strong>Chưa có thành viên tích cực</strong>
          <span>Hãy là người đầu tiên chia sẻ bài viết.</span>
        </div>
      ) : null}

      {!loading && !error && members.length > 0 ? (
        <div className="active-members-list">
          {members.map((member, index) => (
            <article className="active-member" key={member.id}>
              <div className="active-member__rank">{index + 1}</div>

              <ActiveMemberAvatar
                src={member.avatarUrl}
                name={member.name}
              />

              <div className="active-member__info">
                <div className="active-member__name">
                  {member.id ? (
                    <Link to={`/nguoi-dung/${member.id}`} className="active-member__link">
                      {member.name}
                    </Link>
                  ) : (
                    member.name
                  )}
                </div>
                <div className="active-member__meta">
                  {member.postCount} bài viết
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default ActiveMembersPanel
