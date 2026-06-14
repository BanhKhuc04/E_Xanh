import { useNavigate } from 'react-router-dom'

function MyPostsList({ posts }) {
  const navigate = useNavigate()

  function handleView(post) {
    if (post.type === 'community') {
      navigate(`/cong-dong/${post.id}`)
    } else {
      navigate(`/meo-tiet-kiem/${post.slug || post.id}`)
    }
  }

  function handleEdit() {
    // alert('Tính năng chỉnh sửa bài viết đang phát triển!')
  }

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
              <button type="button" onClick={() => handleView(post)}>Xem</button>
              <button className="btn btn--secondary btn--small" disabled title="Tính năng đang phát triển" aria-disabled="true">Chỉnh sửa</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MyPostsList
