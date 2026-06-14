import { Link } from 'react-router-dom'

function RecentSavedPosts({ posts }) {
  return (
    <section className="account-panel">
      <div className="account-panel__header">
        <h2>Bài đã lưu gần đây</h2>
        <Link to="/bai-da-luu">Xem tất cả bài đã lưu</Link>
      </div>

      <div className="account-saved-posts">
        {posts.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Bạn chưa có bài viết đã lưu nào.</p>
        ) : posts.map((post) => (
          <article key={post.id || post.slug} className="account-saved-posts__item">
            <div>
              <span className="account-saved-posts__category">{post.category || 'Mẹo tiết kiệm'}</span>
              <h3>{post.title}</h3>
              <p>{post.savedAt || new Date().toLocaleDateString('vi-VN')}</p>
            </div>

            <Link to={post.type === 'community' ? `/cong-dong/${post.id}` : `/meo-tiet-kiem/${post.slug || post.id}`}>Đọc lại</Link>
          </article>
        ))}
      </div>
    </section>
  )
}

export default RecentSavedPosts
