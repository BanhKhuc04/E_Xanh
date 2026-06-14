import { useState } from 'react'
import { userRoleMap, userStatusMap } from '../../../data/adminUsers'

function AdminUserDrawer({
  user,
  onClose,
  onChangeStatus,
  onChangeRole,
}) {
  const [adminNote, setAdminNote] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  if (!user) return null

  const roleInfo = userRoleMap[user.role] ?? userRoleMap.user
  const statusInfo = userStatusMap[user.status] ?? userStatusMap.active
  const isLocked = user.status === 'locked'
  
  const handleRoleChange = async (e) => {
    setIsUpdating(true)
    await onChangeRole(user.id, e.target.value)
    setIsUpdating(false)
  }

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true)
    await onChangeStatus(user.id, newStatus)
    setIsUpdating(false)
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
          <h3>Chi tiết người dùng</h3>
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
            <span className="au-drawer__avatar">{user.avatar}</span>
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
              <span>{user.lastActive}</span>
            </div>
          </div>

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
            <span className="au-drawer__label">Hoạt động gần đây</span>
            <ul className="au-drawer__activity-list">
              {user.recentActivities.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </div>

          <div className="au-drawer__field">
            <span className="au-drawer__label">Ghi chú admin</span>
            <textarea
              className="au-drawer__note"
              rows="3"
              placeholder="Nhập ghi chú về người dùng này..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
          </div>
        </div>

        <div className="au-drawer__footer">
          {isLocked ? (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => handleStatusChange('active')}
              disabled={isUpdating}
            >
              Mở khóa
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--ghost au-drawer__lock-btn"
              onClick={() => handleStatusChange('locked')}
              disabled={isUpdating}
            >
              Khóa tài khoản
            </button>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Đổi vai trò:</span>
            <select
              value={user.role}
              onChange={handleRoleChange}
              disabled={isUpdating}
              style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="user">Người dùng</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="button" className="btn btn--ghost" onClick={() => alert('Tính năng đang phát triển')} title="Tính năng đang phát triển">
            Xem bài đã đăng
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => alert('Tính năng đang phát triển')} title="Tính năng đang phát triển">
            Xem bình luận
          </button>
        </div>
      </aside>
    </>
  )
}

export default AdminUserDrawer
