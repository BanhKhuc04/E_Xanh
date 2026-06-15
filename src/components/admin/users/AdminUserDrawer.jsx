import { useEffect, useState } from 'react'
import { userRoleMap, userStatusMap } from '../../../data/adminUsers'

function AdminUserDrawer({
  user,
  onClose,
  onChangeStatus,
  onChangeRole,
  onSaveNote,
  onViewPosts,
  onViewComments,
  onDeactivate,
  canManageUsers,
  isBusy = false,
}) {
  const [adminNote, setAdminNote] = useState('')
  const [isSavingNote, setIsSavingNote] = useState(false)

  useEffect(() => {
    setAdminNote(user?.adminNote ?? '')
  }, [user])

  if (!user) return null

  const roleInfo = userRoleMap[user.role] ?? userRoleMap.user
  const statusInfo = userStatusMap[user.status] ?? userStatusMap.active
  const isLocked = ['locked', 'blocked'].includes(user.status)
  const isDeleted = user.status === 'deleted'

  async function handleSaveNote() {
    if (!onSaveNote) return

    setIsSavingNote(true)
    await onSaveNote(user.id, adminNote)
    setIsSavingNote(false)
  }

  return (
    <>
      <div
        className="au-drawer-overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="au-drawer" role="dialog" aria-label="Chi tiết người dùng">
        <div className="au-drawer__header">
          <div>
            <h3>Chi tiết người dùng</h3>
            <p className="au-drawer__hint">
              Theo dõi hành vi tài khoản, lưu ghi chú quản trị và thao tác quyền khi cần.
            </p>
          </div>
          <button
            type="button"
            className="au-drawer__close"
            onClick={onClose}
            aria-label="Đóng"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="au-drawer__body">
          <div className="au-drawer__profile">
            <span className="au-drawer__avatar">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="au-drawer__avatar-img" />
              ) : (
                user.avatar
              )}
            </span>
            <div>
              <strong>{user.name}</strong>
              <span className="au-drawer__email">{user.email}</span>
            </div>
          </div>

          <div className="au-drawer__badges">
            <span className={`au-role-badge ${roleInfo.className}`}>
              {roleInfo.label}
            </span>
            <span className={`au-status-badge ${statusInfo.className}`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="au-drawer__grid">
            <div className="au-drawer__field">
              <span className="au-drawer__label">Ngày tham gia</span>
              <span>{user.joinedAt}</span>
            </div>
            <div className="au-drawer__field">
              <span className="au-drawer__label">Lần hoạt động gần nhất</span>
              <span title={user.lastActiveFull}>{user.lastActive}</span>
            </div>
          </div>

          {(user.banReason || user.deletedAt) ? (
            <div className="au-drawer__field">
              <span className="au-drawer__label">Thông tin xử lý tài khoản</span>
              {user.banReason ? <span>Lý do khóa gần nhất: {user.banReason}</span> : null}
              {user.deletedAt ? <span>Vô hiệu hóa lúc: {new Date(user.deletedAt).toLocaleString('vi-VN')}</span> : null}
            </div>
          ) : null}

          <div className="au-drawer__metrics-grid">
            <div className="au-drawer__metric">
              <strong>{user.postsCount}</strong>
              <span>Bài viết</span>
            </div>
            <div className="au-drawer__metric">
              <strong>{user.commentsCount}</strong>
              <span>Bình luận</span>
            </div>
            <div className="au-drawer__metric">
              <strong>{user.savedCount}</strong>
              <span>Đã lưu</span>
            </div>
            <div className="au-drawer__metric">
              <strong>{user.electricityChecks}</strong>
              <span>Kiểm tra điện</span>
            </div>
          </div>

          <div className="au-drawer__field">
            <div className="au-drawer__section-head">
              <span className="au-drawer__label">Hoạt động gần đây</span>
              <button
                type="button"
                className="btn btn--ghost au-drawer__jump-btn"
                onClick={() => onViewPosts?.(user)}
              >
                Xem bài đã đăng
              </button>
            </div>
            <ul className="au-drawer__activity-list">
              {user.recentActivities.map((activity, index) => (
                <li key={`${user.id}-activity-${index}`}>{activity}</li>
              ))}
            </ul>
          </div>

          <div className="au-drawer__drawer-actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => onViewPosts?.(user)}
            >
              Xem bài đã đăng
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => onViewComments?.(user)}
            >
              Xem bình luận
            </button>
          </div>

          <div className="au-drawer__field">
            <span className="au-drawer__label">Ghi chú admin</span>
            <textarea
              className="au-drawer__note"
              rows="4"
              placeholder="Nhập ghi chú nội bộ về tài khoản này..."
              value={adminNote}
              onChange={(event) => setAdminNote(event.target.value)}
              disabled={!onSaveNote || isSavingNote}
            />
            <div className="au-drawer__note-actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={handleSaveNote}
                disabled={!onSaveNote || isSavingNote}
              >
                {isSavingNote ? 'Đang lưu...' : 'Lưu ghi chú'}
              </button>
            </div>
          </div>
        </div>

        <div className="au-drawer__footer">
          {canManageUsers ? (
            <>
              {isLocked ? (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => onChangeStatus(user)}
                  disabled={isBusy}
                >
                  {isBusy ? 'Đang xử lý...' : 'Mở khóa'}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn--ghost au-drawer__lock-btn"
                  onClick={() => onChangeStatus(user)}
                  disabled={isBusy || isDeleted}
                >
                  {isBusy ? 'Đang xử lý...' : 'Khóa tài khoản'}
                </button>
              )}

              <button
                type="button"
                className="btn btn--ghost au-drawer__deactivate-btn"
                onClick={() => onDeactivate?.(user)}
                disabled={isBusy || isDeleted}
              >
                {isDeleted ? 'Tài khoản đã vô hiệu hóa' : 'Vô hiệu hóa tài khoản'}
              </button>

              <label className="au-drawer__role-field">
                <span className="au-drawer__label">Đổi vai trò</span>
                <select
                  value={user.role}
                  onChange={(event) => onChangeRole(user, event.target.value)}
                  disabled={isBusy || isDeleted}
                >
                  <option value="user">Người dùng</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            </>
          ) : (
            <div className="au-drawer__readonly">
              Tài khoản moderator đang ở chế độ chỉ xem trên trang này. Chỉ admin mới được đổi role hoặc khóa tài khoản.
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default AdminUserDrawer
