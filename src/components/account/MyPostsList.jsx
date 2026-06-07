function MyPostsList({ posts }) {
  return (
    <section className="account-panel">
      <div className="account-panel__header">
        <h2>Bài viết của tôi</h2>
      </div>

      <div className="account-my-posts">
        {posts.map((post) => (
          <article key={post.title} className="account-my-posts__item">
            <div className="account-my-posts__content">
              <div className="account-my-posts__top">
                <h3>{post.title}</h3>
                <span
                  className={`account-my-posts__status ${
                    post.status === 'Đã duyệt' ? 'is-approved' : 'is-pending'
                  }`}
                >
                  {post.status}
                </span>
              </div>

              <div className="account-my-posts__meta">
                <span>{post.likes} thích</span>
                <span>{post.comments} bình luận</span>
              </div>
            </div>

            <div className="account-my-posts__actions">
              <button type="button">Xem</button>
              <button type="button">Chỉnh sửa</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MyPostsList
