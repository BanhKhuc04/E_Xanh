import { Link } from 'react-router-dom'

function SavedSidebar({ folders, recentlyRead }) {
  return (
    <aside className="saved-sidebar">
      <section className="saved-sidebar__card">
        <h2>Thư mục lưu</h2>
        <div className="saved-sidebar__folders">
          {folders.map((folder) => (
            <button
              key={folder.id}
              type="button"
              className={`saved-sidebar__folder${folder.isActive ? ' is-active' : ''}`}
            >
              <span>{folder.label}</span>
              <strong>{folder.count}</strong>
            </button>
          ))}
        </div>
      </section>

      {recentlyRead && recentlyRead.length > 0 && (
        <section className="saved-sidebar__card">
          <h2>Bài đọc gần đây</h2>
          <div className="saved-sidebar__recent-list">
            {recentlyRead.map((post) => (
              <Link key={post.id} to={`/meo-tiet-kiem/${post.slug}`} className="saved-sidebar__recent-item">
                <img src={post.image} alt={post.title} />
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.recentReadAt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="saved-sidebar__card saved-sidebar__card--cta">
        <h2>Bạn có mẹo hay?</h2>
        <p>
          Chia sẻ bài viết của bạn với cộng đồng E-XANH để cùng nhau lan tỏa lối sống xanh.
        </p>
        <Link className="btn btn--light" to="/cong-dong">
          Đăng bài chia sẻ
        </Link>
      </section>
    </aside>
  )
}

export default SavedSidebar
