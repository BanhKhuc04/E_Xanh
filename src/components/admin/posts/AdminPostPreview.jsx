import { useState } from 'react'
import { postStatusMap } from '../../../data/adminPosts'

function AdminPostPreview({ post, onChangeStatus, onEditPost, onDeletePost, currentUserRole }) {
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
    <aside className="ap-preview" style={{ minWidth: 0, wordWrap: 'break-word', overflowWrap: 'anywhere' }}>
      <div className="ap-preview__scroll">
        {post.thumbnail && !post.thumbnail.includes('images.unsplash.com') ? (
          <img
            className="ap-preview__cover"
            src={post.thumbnail}
            alt={post.title}
            style={{ aspectRatio: '16/9', objectFit: 'cover', width: '100%', display: 'block' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {(!post.thumbnail || post.thumbnail.includes('images.unsplash.com')) && (
          <div className="ap-preview__cover-placeholder" style={{ width: '100%', height: '160px', background: 'rgba(234, 245, 157, 0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#4f8428' }}>
            <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 40, height: 40, stroke: 'currentColor', fill: 'none', strokeWidth: 1.5, marginBottom: 8 }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Ảnh bài viết</span>
          </div>
        )}

        <div className="ap-preview__body" style={{ minWidth: 0 }}>
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
            {(post.status === 'pending' || post.status === 'rejected' || post.status === 'hidden') && (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => { onChangeStatus(post.id, 'approved', adminNote); setAdminNote('') }}
              >
                {post.status === 'pending' ? 'Duyệt bài' : 'Duyệt lại'}
              </button>
            )}

            {post.status === 'pending' && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => { onChangeStatus(post.id, 'rejected', adminNote); setAdminNote('') }}
              >
                Từ chối
              </button>
            )}

            {(post.status === 'pending' || post.status === 'approved' || post.status === 'rejected') && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => { onChangeStatus(post.id, 'hidden', adminNote); setAdminNote('') }}
              >
                Ẩn bài
              </button>
            )}
            
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
              style={{ color: '#1976d2' }}
              onClick={() => onEditPost(post)}
            >
              Sửa bài
            </button>

            {currentUserRole === 'admin' && (
              <button
                type="button"
                className="btn btn--ghost"
                style={{ color: '#d32f2f' }}
                onClick={() => onDeletePost(post.id)}
              >
                Xóa bài
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default AdminPostPreview
