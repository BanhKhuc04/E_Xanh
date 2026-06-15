function AdminTopSavedPosts({ posts }) {
  if (!posts.length) {
    return (
      <div className="as-section-card">
        <h3>Bài viết được lưu nhiều nhất</h3>
        <p>Chưa có đủ dữ liệu trong khoảng thời gian này.</p>
      </div>
    )
  }

  return (
    <div className="as-section-card">
      <h3>Bài viết được lưu nhiều nhất</h3>
      <div className="as-saved-list">
        {posts.map((post, index) => (
          <div key={post.title} className="as-saved-list__item">
            <span className="as-saved-list__rank">{index + 1}</span>
            <div className="as-saved-list__info">
              <span className="as-saved-list__title">{post.title}</span>
              <span className="as-saved-list__saves">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 5v16l7-5 7 5V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2Z" />
                </svg>
                {post.saves.toLocaleString('vi-VN')} lượt lưu
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminTopSavedPosts
