import { postStatusMap } from '../../../data/adminPosts'

function AdminPostList({
  posts,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  activePostId,
  onViewPost,
}) {
  const allSelected =
    posts.length > 0 && posts.every((p) => selectedIds.includes(p.id))

  return (
    <div className="ap-list">
      <div className="ap-list__header">
        <label className="ap-list__check-all">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={() => onSelectAll()}
            aria-label="Chọn tất cả bài viết"
          />
          <span>Chọn tất cả</span>
        </label>
        <span className="ap-list__total">{posts.length} bài viết</span>
      </div>

      {posts.length === 0 && (
        <div className="ap-list__empty">
          <p>Không tìm thấy bài viết phù hợp.</p>
        </div>
      )}

      <ul className="ap-list__items">
        {posts.map((post) => {
          const statusInfo = postStatusMap[post.status] ?? postStatusMap.pending
          const isActive = activePostId === post.id

          return (
            <li
              key={post.id}
              className={`ap-list__item${isActive ? ' is-active' : ''}`}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(post.id)}
                onChange={() => onToggleSelect(post.id)}
                aria-label={`Chọn bài "${post.title}"`}
                className="ap-list__checkbox"
              />

              <img
                className="ap-list__thumb"
                src={post.thumbnail}
                alt=""
                loading="lazy"
              />

              <div className="ap-list__content">
                <h4 className="ap-list__title">{post.title}</h4>
                <div className="ap-list__meta">
                  <span>{post.author}</span>
                  <span className="ap-list__separator">·</span>
                  <span>{post.type}</span>
                  <span className="ap-list__separator">·</span>
                  <span>{post.submittedAt}</span>
                </div>
                <div className="ap-list__footer">
                  <span
                    className={`ap-badge ${statusInfo.className}`}
                  >
                    {statusInfo.label}
                  </span>
                  <span className="ap-list__engagement">
                    <span title="Lượt thích">♥ {post.likes}</span>
                    <span title="Bình luận">💬 {post.comments}</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="ap-list__view-btn"
                onClick={() => onViewPost(post.id)}
              >
                Xem
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default AdminPostList
