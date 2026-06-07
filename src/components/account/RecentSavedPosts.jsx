import { Link } from 'react-router-dom'

function RecentSavedPosts({ posts }) {
  return (
    <section className="account-panel">
      <div className="account-panel__header">
        <h2>Bài đã lưu gần đây</h2>
        <Link to="/bai-da-luu">Xem tất cả bài đã lưu</Link>
      </div>

      <div className="account-saved-posts">
        {posts.map((post) => (
          <article key={post.slug} className="account-saved-posts__item">
            <div>
              <span className="account-saved-posts__category">{post.category}</span>
              <h3>{post.title}</h3>
              <p>{post.savedAt}</p>
            </div>

            <Link to={`/meo-tiet-kiem/${post.slug}`}>Đọc lại</Link>
          </article>
        ))}
      </div>
    </section>
  )
}

export default RecentSavedPosts
