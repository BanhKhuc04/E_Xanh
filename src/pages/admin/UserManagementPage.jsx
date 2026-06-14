import { useState, useCallback, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { adminUserStats, userRoleMap, userStatusMap } from '../../data/adminUsers'
import AdminUserStats from '../../components/admin/users/AdminUserStats'
import AdminUserFilter from '../../components/admin/users/AdminUserFilter'
import AdminUserBulkAction from '../../components/admin/users/AdminUserBulkAction'
import AdminUserList from '../../components/admin/users/AdminUserList'
import AdminUserDrawer from '../../components/admin/users/AdminUserDrawer'
import { getAdminUsers, updateUserRole, updateUserStatus } from '../../services/adminUserService'
import { getCurrentSession, getCurrentUserProfile } from '../../services/authService'
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
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('Tất cả')
  const [status, setStatus] = useState('Tất cả')
  const [dateRange, setDateRange] = useState('Tất cả')
  const [selectedIds, setSelectedIds] = useState([])
  const [drawerUserId, setDrawerUserId] = useState(null)
  const [toast, setToast] = useState('')
  
  const [currentUserData, setCurrentUserData] = useState(null)
  const [accessDenied, setAccessDenied] = useState(false)

  const showToast = useCallback((message) => {
    setToast(message)
    setTimeout(() => setToast(''), 3000)
  }, [])

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setErrorMsg('')
    const { data, error } = await getAdminUsers()
    if (error) {
      console.error('Fetch users error:', error)
      setErrorMsg('Không thể tải dữ liệu người dùng. Vui lòng kiểm tra quyền truy cập.')
    } else if (data) {
      const mapped = data.map(u => ({
        id: u.id,
        name: u.name || 'Người dùng ẩn danh',
        email: u.email,
        role: u.role,
        status: u.status,
        joinedAt: new Date(u.created_at).toISOString().split('T')[0],
        avatar: u.avatar_url ? <img src={u.avatar_url} alt="avatar" style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%'}} /> : (u.name ? u.name.charAt(0).toUpperCase() : 'U'),
        postsCount: '-',
        commentsCount: '-',
        lastActive: '-',
        savedCount: '-',
        electricityChecks: '-',
        recentActivities: []
      }))
      setUsers(mapped)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    let isMounted = true
    async function init() {
      const session = await getCurrentSession()
      if (session?.user && isMounted) {
        const profile = await getCurrentUserProfile(session.user.id)
        if (profile?.role !== 'admin') {
          setAccessDenied(true)
          return
        }
        setCurrentUserData(profile)
        await fetchUsers()
      } else if (isMounted) {
        setAccessDenied(true)
      }
    }
    init()
    return () => { isMounted = false }
  }, [fetchUsers])

  if (accessDenied) {
    return <Navigate to="/admin/khong-co-quyen" replace />
  }

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
  }).sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt))

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

  const handleChangeStatus = async (id, newStatus) => {
    // Optimistic update
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)))

    const { error } = await updateUserStatus(id, newStatus, currentUserData.id)
    if (error) {
      showToast('Lỗi: ' + error.message)
      fetchUsers() // Rollback on error
      return
    }
    showToast(`Đã cập nhật trạng thái: ${userStatusMap[newStatus]?.label ?? newStatus}.`)
  }

  const handleChangeRole = async (id, newRole) => {
    // Check if trying to remove admin role
    const targetUser = users.find(u => u.id === id);
    if (targetUser && targetUser.role === 'admin' && newRole !== 'admin') {
        const adminCount = users.filter(u => u.role === 'admin').length;
        if (adminCount <= 1) {
            showToast('Lỗi: Không thể hạ quyền Admin duy nhất của hệ thống.');
            return;
        }
    }

    // Optimistic update
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)))

    const { error } = await updateUserRole(id, newRole, currentUserData.id)
    if (error) {
      showToast('Lỗi: ' + error.message)
      fetchUsers() // Rollback on error
      return
    }
    showToast(`Đã đổi vai trò: ${userRoleMap[newRole]?.label ?? newRole}.`)
  }

  const handleQuickToggleLock = (id) => {
    const user = users.find((u) => u.id === id)
    if (!user) return
    const newStatus = user.status === 'locked' ? 'active' : 'locked'
    handleChangeStatus(id, newStatus)
  }

  const handleBulkLock = async () => {
    setUsers((prev) => prev.map((u) => selectedIds.includes(u.id) ? { ...u, status: 'locked' } : u))
    for (const id of selectedIds) {
      await updateUserStatus(id, 'locked', currentUserData.id)
    }
    setSelectedIds([])
    showToast('Đã khóa các tài khoản đã chọn.')
  }

  const handleBulkUnlock = async () => {
    setUsers((prev) => prev.map((u) => selectedIds.includes(u.id) ? { ...u, status: 'active' } : u))
    for (const id of selectedIds) {
      await updateUserStatus(id, 'active', currentUserData.id)
    }
    setSelectedIds([])
    showToast('Đã mở khóa các tài khoản đã chọn.')
  }

  const handleBulkAssignRole = async () => {
    for (const id of selectedIds) {
      const user = users.find(u => u.id === id)
      if (user && user.role === 'user') {
        await updateUserRole(id, 'moderator', currentUserData.id)
      } else if (user && user.role === 'moderator') {
        await updateUserRole(id, 'user', currentUserData.id)
      }
    }
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
          <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#666' }}>
            <strong>* Lưu ý:</strong> Sau khi thay đổi vai trò (role), người dùng đó có thể cần đăng nhập lại để quyền mới có hiệu lực.
          </div>
        </div>
      </section>

      {isLoading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải danh sách người dùng...</div>
      ) : errorMsg ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#d32f2f', fontWeight: 'bold' }}>{errorMsg}</div>
      ) : (
        <>
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
            onFilter={() => alert('Bộ lọc đã được tự động áp dụng.')}
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
        </>
      )}

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
