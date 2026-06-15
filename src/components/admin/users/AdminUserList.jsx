import { userRoleMap, userStatusMap } from '../../../data/mock/adminUsers'

function AdminUserList({
  users,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onViewDetail,
  onQuickToggleLock,
  onQuickDeactivate,
  isBusy = false,
  canManageUsers = true,
}) {
  const allSelected =
    users.length > 0 && users.every((u) => selectedIds.includes(u.id))

  return (
    <div className="au-list">
      <div className="au-list__header">
        <label className="au-list__check-all">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onSelectAll}
            aria-label="Chọn tất cả người dùng"
          />
          <span>Chọn tất cả</span>
        </label>
        <span className="au-list__total">{users.length} người dùng</span>
      </div>

      {users.length === 0 && (
        <div className="au-list__empty">
          <p>Không tìm thấy người dùng phù hợp.</p>
        </div>
      )}

      <div className="au-list__items">
        {users.map((user) => {
          const roleInfo = userRoleMap[user.role] ?? userRoleMap.user
          const statusInfo = userStatusMap[user.status] ?? userStatusMap.active
          const isLocked = ['locked', 'blocked'].includes(user.status)
          const isDeleted = user.status === 'deleted'

          return (
            <article key={user.id} className="au-list__card">
              <div className="au-list__card-top">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(user.id)}
                  onChange={() => onToggleSelect(user.id)}
                  aria-label={`Chọn ${user.name}`}
                  className="au-list__checkbox"
                />

                <span className="au-list__avatar">{user.avatar}</span>

                <div className="au-list__user">
                  <strong>{user.name}</strong>
                  <span className="au-list__email">{user.email}</span>
                </div>

                <span className={`au-role-badge ${roleInfo.className}`}>
                  {roleInfo.label}
                </span>

                <span className={`au-status-badge ${statusInfo.className}`}>
                  {statusInfo.label}
                </span>
              </div>

              <div className="au-list__card-bottom">
                <div className="au-list__metrics">
                  <span title="Bài đã đăng">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 4h10l4 4v12H5z" />
                    </svg>
                    {user.postsCount} bài
                  </span>
                  <span title="Bình luận">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 6h14v10H9l-4 3V6z" />
                    </svg>
                    {user.commentsCount} bình luận
                  </span>
                  <span className="au-list__last-active" title="Lần hoạt động gần nhất">
                    {user.lastActive}
                  </span>
                </div>

                <div className="au-list__actions">
                  <button
                    type="button"
                    className="au-list__action-btn"
                    onClick={() => onViewDetail(user.id)}
                    disabled={isBusy}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    type="button"
                    className={`au-list__action-btn au-list__action-btn--subtle${isLocked ? ' au-list__action-btn--unlock' : ''}`}
                    onClick={() => onQuickToggleLock(user.id)}
                    disabled={isBusy || !canManageUsers || isDeleted}
                  >
                    {isLocked ? 'Mở khóa' : 'Khóa'}
                  </button>
                  <button
                    type="button"
                    className="au-list__action-btn au-list__action-btn--danger"
                    onClick={() => onQuickDeactivate(user.id)}
                    disabled={isBusy || !canManageUsers || isDeleted}
                  >
                    {isDeleted ? 'Đã vô hiệu hóa' : 'Vô hiệu hóa'}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export default AdminUserList
