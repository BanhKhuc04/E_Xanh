import { useState } from 'react'
import { Link } from 'react-router-dom'
import { commentStatusMap } from '../../../data/mock/adminComments'

function formatTime(isoString) {
  const date = new Date(isoString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const mins = String(date.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${mins}`
}

function AdminCommentDrawer({ comment, onClose, onChangeStatus, onDelete, onSendNotification, onSaveAdminNote, isBusy }) {
  const [adminNote, setAdminNote] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)

  // Sync admin note when comment changes
  if (comment && adminNote === '' && comment.adminNote && !noteSaved) {
    setAdminNote(comment.adminNote)
  }

  if (!comment) return null

  const statusInfo =
    commentStatusMap[comment.status] ?? commentStatusMap.visible

  const isHiddenOrSpamOrDeleted = ['hidden', 'spam', 'deleted'].includes(comment.status)
  const postUrl = comment.postId ? `/cong-dong/${comment.postId}?comment=${comment.id}` : null

  function handleSaveNote() {
    onSaveAdminNote(comment.id, adminNote)
    setNoteSaved(true)
  }

  function handleClose() {
    setAdminNote('')
    setNoteSaved(false)
    onClose()
  }

  return (
    <>
      <div
        className="ac-drawer-overlay"
        onClick={handleClose}
        aria-hidden="true"
      />
      <aside className="ac-drawer" role="dialog" aria-label="Chi tiết bình luận">
        <div className="ac-drawer__header">
          <h3>Chi tiết bình luận</h3>
          <button
            type="button"
            className="ac-drawer__close"
            onClick={handleClose}
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
            {postUrl ? (
              <Link to={postUrl} className="ac-drawer__post-link" style={{ color: 'var(--color-primary, #4f8428)', textDecoration: 'underline' }}>
                {comment.postTitle} →
              </Link>
            ) : (
              <span className="ac-drawer__post-link">{comment.postTitle}</span>
            )}
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
              onChange={(e) => { setAdminNote(e.target.value); setNoteSaved(false) }}
            />
            <button
              type="button"
              className="btn btn--ghost"
              style={{ marginTop: '8px', fontSize: '0.85rem' }}
              onClick={handleSaveNote}
              disabled={isBusy}
            >
              {noteSaved ? '✓ Đã lưu ghi chú' : 'Lưu ghi chú'}
            </button>
          </div>
        </div>

        <div className="ac-drawer__footer">
          {comment.status !== 'hidden' && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => onChangeStatus(comment.id, 'hidden')}
              disabled={isBusy}
            >
              Ẩn bình luận
            </button>
          )}

          {isHiddenOrSpamOrDeleted && (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => onChangeStatus(comment.id, 'visible')}
              disabled={isBusy}
            >
              Khôi phục
            </button>
          )}

          {comment.status !== 'spam' && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => onChangeStatus(comment.id, 'spam')}
              disabled={isBusy}
            >
              Đánh dấu spam
            </button>
          )}

          <button
            type="button"
            className="btn btn--secondary ac-drawer__delete-btn"
            onClick={() => onDelete(comment.id)}
            disabled={isBusy}
          >
            Xóa bình luận
          </button>

          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => onSendNotification(comment.id)}
            disabled={isBusy}
            style={{ color: '#e67e22' }}
          >
            ⚠ Gửi thông báo cảnh báo
          </button>
        </div>

      </aside>
    </>
  )
}

export default AdminCommentDrawer
