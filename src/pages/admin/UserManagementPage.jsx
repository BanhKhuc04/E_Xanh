import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AdminUserStats from '../../components/admin/users/AdminUserStats'
import AdminUserFilter from '../../components/admin/users/AdminUserFilter'
import AdminUserBulkAction from '../../components/admin/users/AdminUserBulkAction'
import AdminUserList from '../../components/admin/users/AdminUserList'
import AdminUserDrawer from '../../components/admin/users/AdminUserDrawer'
import {
  getAdminUsers,
  isDeletedUserStatus,
  isBlockedUserStatus,
  saveAdminUserNote,
  updateUserRole,
  updateUserStatus,
} from '../../services/adminUserService'
import { getCurrentSession, getCurrentUserProfile } from '../../services/authService'
import { isStaff } from '../../utils/permissions'
import '../../styles/admin-users.css'

const roleLabelToKey = {
  'Người dùng': 'user',
  Moderator: 'moderator',
  Admin: 'admin',
}

function emptyDialog() {
  return {
    type: '',
    title: '',
    description: '',
    confirmLabel: '',
    users: [],
    nextRole: '',
    nextStatus: '',
    reason: 'vi-pham-noi-quy',
    noteToUser: '',
  }
}

function UserManagementPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState([])
  const [warnings, setWarnings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('Tất cả')
  const [status, setStatus] = useState('Tất cả')
  const [dateRange, setDateRange] = useState('Tất cả')
  const [selectedIds, setSelectedIds] = useState([])
  const [drawerUserId, setDrawerUserId] = useState(null)
  const [toast, setToast] = useState(null)
  const [currentUserData, setCurrentUserData] = useState(null)
  const [accessDenied, setAccessDenied] = useState(false)
  const [actionBusy, setActionBusy] = useState(false)
  const [dialog, setDialog] = useState(emptyDialog())
  const toastTimeoutRef = useRef(null)

  const canManageUsers = currentUserData?.role === 'admin'

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ message, tone })
    window.clearTimeout(toastTimeoutRef.current)
    toastTimeoutRef.current = window.setTimeout(() => setToast(null), 3200)
  }, [])

  useEffect(() => {
    return () => {
      window.clearTimeout(toastTimeoutRef.current)
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setErrorMsg('')

    const { data, error } = await getAdminUsers()
    if (error) {
      console.error('[UserManagement] Fetch users error:', error)
      setUsers([])
      setStats([])
      setWarnings([])
      setErrorMsg(error.message || 'Không thể tải dữ liệu người dùng.')
      setIsLoading(false)
      return
    }

    setUsers(data?.users ?? [])
    setStats(data?.stats ?? [])
    setWarnings(data?.warnings ?? [])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function init() {
      const session = await getCurrentSession()
      if (!session?.user) {
        if (isMounted) {
          setAccessDenied(true)
        }
        return
      }

      const profile = await getCurrentUserProfile(session.user.id)
      if (!isMounted) return

      if (!isStaff(profile)) {
        setAccessDenied(true)
        return
      }

      setCurrentUserData(profile)
      await fetchUsers()
    }

    init()

    return () => {
      isMounted = false
    }
  }, [fetchUsers])

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const matchSearch =
          search === '' ||
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())

        const matchRole =
          role === 'Tất cả' || user.role === roleLabelToKey[role]

        const matchStatus =
          status === 'Tất cả' ||
          (status === 'Bị khóa'
            ? isBlockedUserStatus(user.status)
            : status === 'Đang hoạt động'
              ? user.status === 'active'
              : status === 'Chờ xác minh'
                ? user.status === 'pending'
                : status === 'Đã vô hiệu hóa'
                  ? isDeletedUserStatus(user.status)
                : true)

        let matchDate = true
        if (dateRange !== 'Tất cả') {
          const joined = new Date(user.joinedAtValue)
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
      .sort((left, right) => new Date(right.joinedAtValue) - new Date(left.joinedAtValue))
  }, [dateRange, role, search, status, users])

  if (accessDenied) {
    return <Navigate to="/admin/khong-co-quyen" replace />
  }

  const handleToggleSelect = (id) => {
    setSelectedIds((previous) =>
      previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id],
    )
  }

  const handleSelectAll = () => {
    const allFilteredIds = filteredUsers.map((user) => user.id)
    const allSelected = allFilteredIds.every((id) => selectedIds.includes(id))

    if (allSelected) {
      setSelectedIds((previous) => previous.filter((id) => !allFilteredIds.includes(id)))
      return
    }

    setSelectedIds((previous) => [...new Set([...previous, ...allFilteredIds])])
  }

  const handleReset = () => {
    setSearch('')
    setRole('Tất cả')
    setStatus('Tất cả')
    setDateRange('Tất cả')
    setSelectedIds([])
  }

  const drawerUser = users.find((user) => user.id === drawerUserId) ?? null

  function closeDialog() {
    setDialog(emptyDialog())
  }

  function openStatusDialog(user) {
    if (!canManageUsers) {
      showToast('Trang này đang ở chế độ chỉ xem với moderator.', 'warning')
      return
    }

    const nextStatus = isBlockedUserStatus(user.status) ? 'active' : 'locked'
    setDialog({
      type: 'status',
      title: nextStatus === 'active' ? 'Xác nhận mở khóa tài khoản' : 'Xác nhận khóa tài khoản',
      description:
        nextStatus === 'active'
          ? `Bạn sắp mở khóa tài khoản của ${user.name}. Người dùng sẽ nhận được thông báo trong khu vực tài khoản.`
          : `Bạn sắp khóa tài khoản của ${user.name}. Hãy chọn lý do và ghi chú rõ ràng để người dùng nhận được thông báo phù hợp.`,
      confirmLabel: nextStatus === 'active' ? 'Xác nhận mở khóa' : 'Xác nhận khóa',
      users: [user],
      nextRole: '',
      nextStatus,
      reason: nextStatus === 'active' ? 'mo-khoa' : 'vi-pham-noi-quy',
      noteToUser: '',
    })
  }

  function openDeactivateDialog(user) {
    if (!canManageUsers) {
      showToast('Chỉ admin mới được vô hiệu hóa tài khoản.', 'warning')
      return
    }

    setDialog({
      type: 'deactivate',
      title: 'Xác nhận vô hiệu hóa tài khoản',
      description: `Bạn sắp vô hiệu hóa tài khoản của ${user.name}. Tài khoản sẽ không thể tiếp tục đăng nhập và dữ liệu liên quan vẫn được giữ lại.`,
      confirmLabel: 'Xác nhận vô hiệu hóa',
      users: [user],
      nextRole: '',
      nextStatus: 'deleted',
      reason: 'vo-hieu-hoa-tai-khoan',
      noteToUser: '',
    })
  }

  function openRoleDialog(user, nextRole) {
    if (!canManageUsers) {
      showToast('Chỉ admin mới được thay đổi vai trò tài khoản.', 'warning')
      return
    }

    if (!nextRole || user.role === nextRole) {
      return
    }

    setDialog({
      type: 'role',
      title: 'Xác nhận cập nhật vai trò',
      description: `Bạn sắp đổi vai trò của ${user.name} từ "${user.role}" sang "${nextRole}".`,
      confirmLabel: 'Xác nhận đổi vai trò',
      users: [user],
      nextRole,
      nextStatus: '',
      reason: 'cap-nhat-vai-tro',
      noteToUser: '',
    })
  }

  function openBulkStatusDialog(nextStatus) {
    if (!canManageUsers) {
      showToast('Chỉ admin mới được thay đổi trạng thái hàng loạt.', 'warning')
      return
    }

    const selectedUsers = users.filter((user) => selectedIds.includes(user.id))
    if (selectedUsers.length === 0) {
      showToast('Bạn chưa chọn người dùng nào.', 'warning')
      return
    }

    setDialog({
      type: nextStatus === 'active' ? 'bulk-unlock' : 'bulk-lock',
      title: nextStatus === 'active' ? 'Xác nhận mở khóa hàng loạt' : 'Xác nhận khóa hàng loạt',
      description: `Bạn sắp ${nextStatus === 'active' ? 'mở khóa' : 'khóa'} ${selectedUsers.length} tài khoản đã chọn.`,
      confirmLabel: nextStatus === 'active' ? 'Mở khóa đã chọn' : 'Khóa đã chọn',
      users: selectedUsers,
      nextRole: '',
      nextStatus,
      reason: nextStatus === 'active' ? 'mo-khoa-hang-loat' : 'vi-pham-noi-quy',
      noteToUser: '',
    })
  }

  function openBulkRoleDialog() {
    if (!canManageUsers) {
      showToast('Chỉ admin mới được gán vai trò hàng loạt.', 'warning')
      return
    }

    const selectedUsers = users.filter(
      (user) => selectedIds.includes(user.id) && user.role === 'user',
    )

    if (selectedUsers.length === 0) {
      showToast('Bulk role hiện chỉ áp dụng cho các tài khoản đang là user.', 'warning')
      return
    }

    setDialog({
      type: 'bulk-role',
      title: 'Xác nhận gán moderator',
      description: `Bạn sắp chuyển ${selectedUsers.length} tài khoản user thành moderator.`,
      confirmLabel: 'Xác nhận gán moderator',
      users: selectedUsers,
      nextRole: 'moderator',
      nextStatus: '',
      reason: 'phan-cong-moderator',
      noteToUser: '',
    })
  }

  function openBulkDeactivateDialog() {
    if (!canManageUsers) {
      showToast('Chỉ admin mới được vô hiệu hóa hàng loạt.', 'warning')
      return
    }

    const selectedUsers = users.filter((user) => selectedIds.includes(user.id))
    if (selectedUsers.length === 0) {
      showToast('Bạn chưa chọn người dùng nào.', 'warning')
      return
    }

    setDialog({
      type: 'bulk-deactivate',
      title: 'Xác nhận vô hiệu hóa hàng loạt',
      description: `Bạn sắp vô hiệu hóa ${selectedUsers.length} tài khoản đã chọn.`,
      confirmLabel: 'Vô hiệu hóa đã chọn',
      users: selectedUsers,
      nextRole: '',
      nextStatus: 'deleted',
      reason: 'vo-hieu-hoa-hang-loat',
      noteToUser: '',
    })
  }

  async function handleConfirmDialog() {
    if (!dialog.type || !currentUserData) return

    setActionBusy(true)
    const actionWarnings = []

    try {
      if (dialog.type === 'status') {
        const targetUser = dialog.users[0]
        const { error, warnings: resultWarnings } = await updateUserStatus({
          userId: targetUser.id,
          newStatus: dialog.nextStatus,
          currentUser: currentUserData,
          reason: dialog.reason,
          noteToUser: dialog.noteToUser,
        })

        if (error) {
          showToast(error.message, 'error')
          return
        }

        actionWarnings.push(...(resultWarnings ?? []))
        showToast(
          dialog.nextStatus === 'active'
            ? 'Đã mở khóa tài khoản.'
            : 'Đã khóa tài khoản và gửi thông báo cho người dùng.',
        )
      }

      if (dialog.type === 'role') {
        const targetUser = dialog.users[0]
        const { error, warnings: resultWarnings } = await updateUserRole({
          userId: targetUser.id,
          newRole: dialog.nextRole,
          currentUser: currentUserData,
          reason: dialog.reason,
          noteToUser: dialog.noteToUser,
        })

        if (error) {
          showToast(error.message, 'error')
          return
        }

        actionWarnings.push(...(resultWarnings ?? []))
        showToast('Đã cập nhật vai trò người dùng.')
      }

      if (dialog.type === 'bulk-lock' || dialog.type === 'bulk-unlock' || dialog.type === 'bulk-deactivate') {
        for (const user of dialog.users) {
          const { error, warnings: resultWarnings } = await updateUserStatus({
            userId: user.id,
            newStatus: dialog.nextStatus,
            currentUser: currentUserData,
            reason: dialog.reason,
            noteToUser: dialog.noteToUser,
          })

          if (error) {
            showToast(`${user.name}: ${error.message}`, 'error')
            return
          }

          actionWarnings.push(...(resultWarnings ?? []))
        }

        showToast(
          dialog.type === 'bulk-unlock'
            ? 'Đã mở khóa các tài khoản đã chọn.'
            : dialog.type === 'bulk-deactivate'
              ? 'Đã vô hiệu hóa các tài khoản đã chọn.'
              : 'Đã khóa các tài khoản đã chọn.',
        )
        setSelectedIds([])
      }

      if (dialog.type === 'deactivate') {
        const targetUser = dialog.users[0]
        const { error, warnings: resultWarnings } = await updateUserStatus({
          userId: targetUser.id,
          newStatus: dialog.nextStatus,
          currentUser: currentUserData,
          reason: dialog.reason,
          noteToUser: dialog.noteToUser,
        })

        if (error) {
          showToast(error.message, 'error')
          return
        }

        actionWarnings.push(...(resultWarnings ?? []))
        showToast('Đã vô hiệu hóa tài khoản và gửi thông báo cho người dùng.')
      }

      if (dialog.type === 'bulk-role') {
        for (const user of dialog.users) {
          const { error, warnings: resultWarnings } = await updateUserRole({
            userId: user.id,
            newRole: dialog.nextRole,
            currentUser: currentUserData,
            reason: dialog.reason,
            noteToUser: dialog.noteToUser,
          })

          if (error) {
            showToast(`${user.name}: ${error.message}`, 'error')
            return
          }

          actionWarnings.push(...(resultWarnings ?? []))
        }

        showToast('Đã cập nhật vai trò cho các tài khoản đã chọn.')
        setSelectedIds([])
      }

      closeDialog()
      await fetchUsers()

      if (actionWarnings.length > 0) {
        setWarnings((current) => [...new Set([...current, ...actionWarnings])])
      }
    } finally {
      setActionBusy(false)
    }
  }

  async function handleSaveNote(userId, note) {
    if (!currentUserData) return

    setActionBusy(true)
    const { error, warnings: noteWarnings } = await saveAdminUserNote({
      userId,
      note,
      currentUser: currentUserData,
    })
    setActionBusy(false)

    if (error) {
      showToast(error.message, 'error')
      return
    }

    setUsers((current) =>
      current.map((user) => (user.id === userId ? { ...user, adminNote: note } : user)),
    )
    if (noteWarnings?.length) {
      setWarnings((current) => [...new Set([...current, ...noteWarnings])])
    }
    showToast('Đã lưu ghi chú.')
  }

  function handleViewPosts(user) {
    setDrawerUserId(null)
    navigate(`/admin/quan-ly-bai-viet?authorId=${encodeURIComponent(user.id)}&authorName=${encodeURIComponent(user.name)}`)
  }

  function handleViewComments(user) {
    setDrawerUserId(null)
    navigate(`/admin/quan-ly-binh-luan?userId=${encodeURIComponent(user.id)}&userName=${encodeURIComponent(user.name)}`)
  }

  return (
    <div className="au-page page">
      <section className="au-page__hero">
        <span className="page-badge page-badge--soft">
          Hồ sơ thành viên
        </span>
        <div className="au-page__hero-copy">
          <h2>Quản lý người dùng</h2>
          <p>
            Theo dõi tài khoản, phân quyền, khóa vi phạm và kiểm tra phản hồi hệ thống theo dữ liệu thật từ Supabase.
          </p>
          <div className="au-page__hint">
            Sau khi đổi vai trò, người dùng có thể cần đăng nhập lại để quyền mới có hiệu lực.
          </div>
        </div>
      </section>

      <AdminUserStats stats={stats} isLoading={isLoading} />

      {warnings.length > 0 ? (
        <section className="au-alert au-alert--warning" aria-live="polite">
          <strong>Cần kiểm tra thêm trên Supabase:</strong>
          <ul>
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {errorMsg ? (
        <section className="au-alert au-alert--error" aria-live="assertive">
          <strong>Không thể tải dữ liệu người dùng.</strong>
          <p>{errorMsg}</p>
        </section>
      ) : null}

      <AdminUserFilter
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        status={status}
        onStatusChange={setStatus}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onFilter={() => showToast('Bộ lọc đã được áp dụng tự động.', 'warning')}
        onReset={handleReset}
      />

      {canManageUsers ? (
        <AdminUserBulkAction
          selectedCount={selectedIds.length}
          onBulkLock={() => openBulkStatusDialog('locked')}
          onBulkUnlock={() => openBulkStatusDialog('active')}
          onBulkAssignRole={openBulkRoleDialog}
          onBulkDeactivate={openBulkDeactivateDialog}
          isBusy={actionBusy}
        />
      ) : null}

      {isLoading ? (
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '24px' }}>
            <div style={{ height: '90px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ height: '90px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ height: '90px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ height: '90px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          </div>
          <div style={{ height: '60px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', marginBottom: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ height: '60px', background: 'rgba(255,255,255,0.7)', borderRadius: '12px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ height: '60px', background: 'rgba(255,255,255,0.7)', borderRadius: '12px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ height: '60px', background: 'rgba(255,255,255,0.7)', borderRadius: '12px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          </div>
        </div>
      ) : (
        <AdminUserList
          users={filteredUsers}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onViewDetail={(id) => setDrawerUserId(id)}
          onQuickToggleLock={(id) => {
            const targetUser = users.find((user) => user.id === id)
            if (targetUser) {
              openStatusDialog(targetUser)
            }
          }}
          onQuickDeactivate={(id) => {
            const targetUser = users.find((user) => user.id === id)
            if (targetUser) {
              openDeactivateDialog(targetUser)
            }
          }}
          isBusy={actionBusy}
          canManageUsers={canManageUsers}
        />
      )}

      {!isLoading && !errorMsg && filteredUsers.length === 0 ? (
        <section className="au-alert au-alert--empty">
          <strong>Không có dữ liệu phù hợp.</strong>
          <p>Hãy đổi bộ lọc hoặc kiểm tra lại dữ liệu `profiles` trên Supabase.</p>
        </section>
      ) : null}

      <AdminUserDrawer
        user={drawerUser}
        onClose={() => setDrawerUserId(null)}
        onChangeStatus={openStatusDialog}
        onChangeRole={openRoleDialog}
        onSaveNote={handleSaveNote}
        onViewPosts={handleViewPosts}
        onViewComments={handleViewComments}
        onDeactivate={openDeactivateDialog}
        canManageUsers={canManageUsers}
        isBusy={actionBusy}
      />

      {dialog.type ? (
        <div className="au-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="user-action-dialog-title">
          <div className="au-modal">
            <div className="au-modal__header">
              <div>
                <h3 id="user-action-dialog-title">{dialog.title}</h3>
                <p>{dialog.description}</p>
              </div>
              <button type="button" className="au-modal__close" onClick={closeDialog} aria-label="Đóng hộp thoại">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="au-modal__body">
              <div className="au-modal__target-list">
                {dialog.users.map((user) => (
                  <div key={user.id} className="au-modal__target-item">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                ))}
              </div>

              <label className="au-modal__field">
                <span>Lý do thao tác</span>
                <select
                  value={dialog.reason}
                  onChange={(event) => setDialog((current) => ({ ...current, reason: event.target.value }))}
                >
                  <option value="vi-pham-noi-quy">Vi phạm nội quy</option>
                  <option value="spam-quang-cao">Spam / quảng cáo</option>
                  <option value="ho-tro-he-thong">Hỗ trợ hệ thống</option>
                  <option value="cap-nhat-vai-tro">Cập nhật vai trò</option>
                  <option value="phan-cong-moderator">Phân công moderator</option>
                  <option value="mo-khoa">Mở khóa thủ công</option>
                  <option value="vo-hieu-hoa-tai-khoan">Vô hiệu hóa tài khoản</option>
                </select>
              </label>

              <label className="au-modal__field">
                <span>Ghi chú gửi cho người dùng</span>
                <textarea
                  rows="4"
                  placeholder="Nhập nội dung thông báo để user nhìn thấy trong chuông notification..."
                  value={dialog.noteToUser}
                  onChange={(event) => setDialog((current) => ({ ...current, noteToUser: event.target.value }))}
                />
              </label>
            </div>

            <div className="au-modal__footer">
              <button type="button" className="btn btn--ghost" onClick={closeDialog} disabled={actionBusy}>
                Hủy
              </button>
              <button type="button" className="btn btn--primary" onClick={handleConfirmDialog} disabled={actionBusy}>
                {actionBusy ? 'Đang xử lý...' : dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className={`au-toast au-toast--${toast.tone || 'success'}`} role="alert" aria-live="assertive">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 12.5 10 15l7-7M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          </svg>
          {toast.message}
        </div>
      ) : null}
    </div>
  )
}

export default UserManagementPage
