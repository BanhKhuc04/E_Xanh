import { useState } from 'react'
import { postStatusMap } from '../../../data/adminPosts'

function AdminPostPreview({ post, onChangeStatus }) {
  const [adminNote, setAdminNote] = useState('')

  if (!post) {
    return (
      <aside className="ap-preview ap-preview--empty">
        <div className="ap-preview__placeholder">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 4h10l4 4v12H5zM9 12l2 2 4-4M15 4v4h4" />
          </svg>
          <p>Chọn một bài viết để xem trước</p>
          <span>Bấm nút &quot;Xem&quot; ở danh sách bên trái</span>
        </div>
      </aside>
    )
  }

  const statusInfo = postStatusMap[post.status] ?? postStatusMap.pending

  return (
    <aside className="ap-preview">
      <div className="ap-preview__scroll">
        <img
          className="ap-preview__cover"
          src={post.thumbnail}
          alt={post.title}
        />

        <div className="ap-preview__body">
          <span className="ap-preview__category">{post.type}</span>
          <h3 className="ap-preview__title">{post.title}</h3>

          <div className="ap-preview__meta">
            <span>
              <strong>Tác giả:</strong> {post.author}
            </span>
            <span>
              <strong>Ngày gửi:</strong> {post.submittedAt}
            </span>
          </div>

          <div className="ap-preview__section">
            <h4>Mô tả ngắn</h4>
            <p>{post.description}</p>
          </div>

          <div className="ap-preview__section">
            <h4>Nội dung xem trước</h4>
            <div className="ap-preview__content-block">
              {post.contentPreview}
            </div>
          </div>

          <div className="ap-preview__status-row">
            <span>Trạng thái hiện tại:</span>
            <span className={`ap-badge ${statusInfo.className}`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="ap-preview__section">
            <h4>Ghi chú admin</h4>
            <textarea
              className="ap-preview__note"
              rows="3"
              placeholder="Nhập ghi chú cho bài viết này..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
          </div>

          <div className="ap-preview__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => onChangeStatus(post.id, 'approved')}
            >
              Duyệt bài
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => onChangeStatus(post.id, 'rejected')}
            >
              Từ chối
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {}}
            >
              Xem chi tiết
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => onChangeStatus(post.id, 'hidden')}
            >
              Ẩn bài
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default AdminPostPreview
