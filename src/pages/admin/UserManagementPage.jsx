import { useState, useCallback } from 'react'
import {
  adminUsers as initialUsers,
  adminUserStats,
  userRoleMap,
  userStatusMap,
} from '../../data/adminUsers'
import AdminUserStats from '../../components/admin/users/AdminUserStats'
import AdminUserFilter from '../../components/admin/users/AdminUserFilter'
import AdminUserBulkAction from '../../components/admin/users/AdminUserBulkAction'
import AdminUserList from '../../components/admin/users/AdminUserList'
import AdminUserDrawer from '../../components/admin/users/AdminUserDrawer'
import '../../styles/admin-users.css'

const roleLabelToKey = {
  'Người dùng': 'user',
  Moderator: 'moderator',
  Admin: 'admin',
}

const statusLabelToKey = {
  'Đang hoạt động': 'active',
  'Bị khóa': 'locked',
  'Chờ xác minh': 'pending',
}

function UserManagementPage() {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('Tất cả')
  const [status, setStatus] = useState('Tất cả')
  const [dateRange, setDateRange] = useState('Tất cả')
  const [selectedIds, setSelectedIds] = useState([])
  const [drawerUserId, setDrawerUserId] = useState(null)
  const [toast, setToast] = useState('')

  const showToast = useCallback((message) => {
    setToast(message)
    setTimeout(() => setToast(''), 2500)
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      search === '' ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())

    const matchRole =
      role === 'Tất cả' || user.role === roleLabelToKey[role]

    const matchStatus =
      status === 'Tất cả' || user.status === statusLabelToKey[status]

    let matchDate = true
    if (dateRange !== 'Tất cả') {
      const joined = new Date(user.joinedAt)
      const now = new Date()
      if (dateRange === 'Hôm nay') {
        matchDate = joined.toDateString() === now.toDateString()
      } else if (dateRange === '7 ngày qua') {
        const weekAgo = new Date(now)
        weekAgo.setDate(weekAgo.getDate() - 7)
        matchDate = joined >= weekAgo
      } else if (dateRange === 'Tháng này') {
        matchDate =
          joined.getMonth() === now.getMonth() &&
          joined.getFullYear() === now.getFullYear()
      }
    }

    return matchSearch && matchRole && matchStatus && matchDate
  })

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const handleSelectAll = () => {
    const allFilteredIds = filteredUsers.map((u) => u.id)
    const allSelected = allFilteredIds.every((id) => selectedIds.includes(id))
    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !allFilteredIds.includes(id)),
      )
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...allFilteredIds])])
    }
  }

  const handleChangeStatus = (id, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
    )
    showToast(
      `Đã cập nhật người dùng: ${userStatusMap[newStatus]?.label ?? newStatus}.`,
    )
  }

  const handleChangeRole = (id, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)),
    )
    showToast(
      `Đã đổi vai trò: ${userRoleMap[newRole]?.label ?? newRole}.`,
    )
  }

  const handleQuickToggleLock = (id) => {
    const user = users.find((u) => u.id === id)
    if (!user) return
    const newStatus = user.status === 'locked' ? 'active' : 'locked'
    handleChangeStatus(id, newStatus)
  }

  const handleBulkLock = () => {
    setUsers((prev) =>
      prev.map((u) =>
        selectedIds.includes(u.id) ? { ...u, status: 'locked' } : u,
      ),
    )
    setSelectedIds([])
    showToast('Đã khóa các tài khoản đã chọn.')
  }

  const handleBulkUnlock = () => {
    setUsers((prev) =>
      prev.map((u) =>
        selectedIds.includes(u.id) ? { ...u, status: 'active' } : u,
      ),
    )
    setSelectedIds([])
    showToast('Đã mở khóa các tài khoản đã chọn.')
  }

  const handleBulkAssignRole = () => {
    setUsers((prev) =>
      prev.map((u) =>
        selectedIds.includes(u.id) && u.role === 'user'
          ? { ...u, role: 'moderator' }
          : selectedIds.includes(u.id) && u.role === 'moderator'
            ? { ...u, role: 'user' }
            : u,
      ),
    )
    setSelectedIds([])
    showToast('Đã cập nhật vai trò cho các tài khoản đã chọn.')
  }

  const handleReset = () => {
    setSearch('')
    setRole('Tất cả')
    setStatus('Tất cả')
    setDateRange('Tất cả')
    setSelectedIds([])
  }

  const drawerUser = users.find((u) => u.id === drawerUserId) ?? null

  return (
    <div className="au-page page">
      <section className="au-page__hero">
        <span className="page-badge page-badge--soft">
          Hồ sơ thành viên
        </span>
        <div className="au-page__hero-copy">
          <h2>Quản lý người dùng</h2>
          <p>
            Theo dõi tài khoản, phân quyền và xử lý người dùng vi phạm trong
            hệ thống E-XANH.
          </p>
        </div>
      </section>

      <AdminUserStats stats={adminUserStats} />

      <AdminUserFilter
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        status={status}
        onStatusChange={setStatus}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onFilter={() => {}}
        onReset={handleReset}
      />

      <AdminUserBulkAction
        selectedCount={selectedIds.length}
        onBulkLock={handleBulkLock}
        onBulkUnlock={handleBulkUnlock}
        onBulkAssignRole={handleBulkAssignRole}
      />

      <AdminUserList
        users={filteredUsers}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
        onViewDetail={(id) => setDrawerUserId(id)}
        onQuickToggleLock={handleQuickToggleLock}
      />

      <AdminUserDrawer
        user={drawerUser}
        onClose={() => setDrawerUserId(null)}
        onChangeStatus={handleChangeStatus}
        onChangeRole={handleChangeRole}
      />

      {toast && (
        <div className="au-toast" role="alert" aria-live="assertive">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 12.5 10 15l7-7M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  )
}

export default UserManagementPage
