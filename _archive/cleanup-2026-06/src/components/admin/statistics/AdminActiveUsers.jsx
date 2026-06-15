function AdminActiveUsers({ users }) {
  return (
    <div className="as-section-card">
      <h3>Người dùng tích cực</h3>
      <div className="as-active-users">
        {users.map((user, index) => (
          <div key={user.name} className="as-active-users__item">
            <span className="as-active-users__rank">{index + 1}</span>
            <span className="as-active-users__avatar">{user.avatar}</span>
            <div className="as-active-users__info">
              <strong>{user.name}</strong>
              <span>{user.posts} bài viết</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminActiveUsers
