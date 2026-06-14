import { useState } from 'react'
import { commentStatusMap } from '../../../data/adminComments'

function formatTime(isoString) {
  const date = new Date(isoString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const mins = String(date.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${mins}`
}

function AdminCommentDrawer({ comment, onClose, onChangeStatus, onDelete }) {
  const [adminNote, setAdminNote] = useState('')

  if (!comment) return null

  const statusInfo =
    commentStatusMap[comment.status] ?? commentStatusMap.visible

  return (
    <>
      <div
        className="ac-drawer-overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="ac-drawer" role="dialog" aria-label="Chi tiết bình luận">
        <div className="ac-drawer__header">
          <h3>Chi tiết bình luận</h3>
          <button
            type="button"
            className="ac-drawer__close"
            onClick={onClose}
            aria-label="Đóng"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="ac-drawer__body">
          <div className="ac-drawer__user">
            <span className="ac-drawer__avatar">{comment.avatar}</span>
            <div>
              <strong>{comment.userName}</strong>
              <span className="ac-drawer__email">{comment.userEmail}</span>
            </div>
          </div>

          <div className="ac-drawer__field">
            <span className="ac-drawer__label">Thời gian bình luận</span>
            <span>{formatTime(comment.createdAt)}</span>
          </div>

          <div className="ac-drawer__field">
            <span className="ac-drawer__label">Nội dung bình luận</span>
            <div className="ac-drawer__content-block">{comment.content}</div>
          </div>

          <div className="ac-drawer__field">
            <span className="ac-drawer__label">Bài viết liên quan</span>
            <span className="ac-drawer__post-link">{comment.postTitle}</span>
          </div>

          <div className="ac-drawer__field">
            <span className="ac-drawer__label">Trạng thái hiện tại</span>
            <span className={`ac-badge ${statusInfo.className}`}>
              {statusInfo.label}
            </span>
          </div>

          {comment.reports > 0 && (
            <div className="ac-drawer__field">
              <span className="ac-drawer__label">Số lượt báo cáo</span>
              <span className="ac-drawer__reports">{comment.reports}</span>
            </div>
          )}

          <div className="ac-drawer__field">
            <span className="ac-drawer__label">Ghi chú admin</span>
            <textarea
              className="ac-drawer__note"
              rows="3"
              placeholder="Nhập ghi chú xử lý bình luận..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
          </div>
        </div>

        <div className="ac-drawer__footer">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => onChangeStatus(comment.id, 'hidden')}
          >
            Ẩn bình luận
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => onChangeStatus(comment.id, 'visible')}
          >
            Khôi phục
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => onChangeStatus(comment.id, 'spam')}
          >
            Đánh dấu spam
          </button>
          <button
            type="button"
            className="btn btn--secondary ac-drawer__delete-btn"
            onClick={() => onDelete(comment.id)}
          >
            Xóa bình luận
          </button>
          <button type="button" className="btn btn--secondary" disabled title="Tính năng đang phát triển" aria-disabled="true">
            Gửi email cảnh báo
          </button>
        </div>

      </aside>
    </>
  )
}

export default AdminCommentDrawer
