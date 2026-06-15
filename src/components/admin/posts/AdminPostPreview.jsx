import { useState } from 'react'
import { postStatusMap } from '../../../data/mock/adminPosts'
import PostImage from '../../common/PostImage'
import PostBlockRenderer from '../../community/PostBlockRenderer'

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
        <PostImage className="ap-preview__cover" src={post.thumbnail} alt={post.title} variant="card" />

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
            <div className="ap-preview__content-block" style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
              <PostBlockRenderer blocks={post.contentBlocks} fallbackContent={post.contentPreview} />
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
            {(post.status === 'pending' || post.status === 'rejected' || post.status === 'blocked') && (
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
                onClick={() => { onChangeStatus(post.id, 'blocked', adminNote); setAdminNote('') }}
              >
                Khóa bài
              </button>
            )}
            
            <button
              type="button"
              className="btn btn--secondary"
              disabled
              title="Tính năng đang phát triển"
              aria-disabled="true"
              title="Tính năng đang phát triển"
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
