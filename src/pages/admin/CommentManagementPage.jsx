import { useState, useCallback, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  commentStatusMap,
} from '../../data/mock/adminComments'
import AdminCommentStats from '../../components/admin/comments/AdminCommentStats'
import AdminCommentFilter from '../../components/admin/comments/AdminCommentFilter'
import AdminCommentBulkAction from '../../components/admin/comments/AdminCommentBulkAction'
import AdminCommentList from '../../components/admin/comments/AdminCommentList'
import AdminCommentDrawer from '../../components/admin/comments/AdminCommentDrawer'
import '../../styles/admin-comments.css'

const statusLabelToKey = {
  'Đang hiển thị': 'visible',
  'Đã ẩn': 'hidden',
  'Bị báo cáo': 'reported',
  Spam: 'spam',
  'Đã xóa': 'deleted',
}

function normalizeIdentity(value) {
  return String(value || '').trim().toLowerCase()
}

function CommentManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Tất cả')
  const [postFilter, setPostFilter] = useState('Tất cả')
  const [dateRange, setDateRange] = useState('Tất cả')
  const [selectedIds, setSelectedIds] = useState([])
  const [drawerCommentId, setDrawerCommentId] = useState(null)
  const [toast, setToast] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState(null)
  const [actionBusy, setActionBusy] = useState(false)
  const userFilterId = searchParams.get('userId') || ''
  const userFilterName = searchParams.get('userName') || ''

  const loadComments = useCallback(async () => {
    setLoading(true)
    const { getAllCommentsAdmin } = await import('../../services/interactionService')
    const { data } = await getAllCommentsAdmin()
    if (data) {
      setComments(data.map(c => ({
        id: c.id,
        userId: c.user_id,
        postId: c.post_id,
        content: c.content,
        userName: c.profiles?.name || c.profiles?.email || 'N/A',
        userAvatar: c.profiles?.avatar_url || '',
        avatar: (c.profiles?.name || c.profiles?.email || 'U').charAt(0).toUpperCase(),
        postTitle: c.posts?.title || 'Không rõ',
        createdAt: c.created_at,
        status: c.status || 'visible',
        reports: c.reports?.length || 0,
        adminNote: c.admin_note || '',
        moderationReason: c.moderation_reason || '',
      })))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ message, tone })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const postTitles = useMemo(
    () => [...new Set(comments.map((c) => c.postTitle))],
    [comments],
  )

  const matchedCommentsForUser = useMemo(() => {
    if (!userFilterId) return []

    const normalizedFilterId = normalizeIdentity(userFilterId)
    return comments.filter((comment) => normalizeIdentity(comment.userId) === normalizedFilterId)
  }, [comments, userFilterId])

  // Compute real stats from actual data
  const computedStats = useMemo(() => {
    const visible = comments.filter(c => c.status === 'visible').length
    const hidden = comments.filter(c => c.status === 'hidden').length
    const spam = comments.filter(c => c.status === 'spam').length
    const reported = comments.filter(c => c.status === 'reported').length
    const deleted = comments.filter(c => c.status === 'deleted').length

    return [
      { label: 'Đang hiển thị', value: visible, icon: 'new', accent: 'success' },
      { label: 'Bị báo cáo', value: reported, icon: 'reported', accent: 'warning' },
      { label: 'Đã ẩn', value: hidden, icon: 'hidden', accent: 'muted' },
      { label: 'Spam / Đã xóa', value: spam + deleted, icon: 'spam', accent: 'highlight' },
    ]
  }, [comments])

  const filteredComments = comments.filter((comment) => {
    const matchUserId =
      userFilterId === '' || normalizeIdentity(comment.userId) === normalizeIdentity(userFilterId)

    const matchSearch =
      search === '' ||
      comment.content.toLowerCase().includes(search.toLowerCase()) ||
      comment.userName.toLowerCase().includes(search.toLowerCase()) ||
      comment.postTitle.toLowerCase().includes(search.toLowerCase())

    const matchStatus =
      status === 'Tất cả' || comment.status === statusLabelToKey[status]

    const matchPost =
      postFilter === 'Tất cả' || comment.postTitle === postFilter

    let matchDate = true
    if (dateRange !== 'Tất cả') {
      const created = new Date(comment.createdAt)
      const now = new Date()
      if (dateRange === 'Hôm nay') {
        matchDate = created.toDateString() === now.toDateString()
      } else if (dateRange === '7 ngày qua') {
        const weekAgo = new Date(now)
        weekAgo.setDate(weekAgo.getDate() - 7)
        matchDate = created >= weekAgo
      } else if (dateRange === 'Tháng này') {
        matchDate =
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear()
      }
    }

    return matchUserId && matchSearch && matchStatus && matchPost && matchDate
  })

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const handleSelectAll = () => {
    const allFilteredIds = filteredComments.map((c) => c.id)
    const allSelected = allFilteredIds.every((id) => selectedIds.includes(id))
    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !allFilteredIds.includes(id)),
      )
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...allFilteredIds])])
    }
  }

  // Confirm dialog helper
  function openConfirm({ title, description, confirmLabel, onConfirm, isDanger = false }) {
    setConfirmDialog({ title, description, confirmLabel, onConfirm, isDanger })
  }

  function closeConfirm() {
    setConfirmDialog(null)
  }

  const handleChangeStatus = async (id, newStatus) => {
    const actionLabels = {
      hidden: 'ẩn',
      spam: 'đánh dấu spam',
      visible: 'khôi phục',
    }

    const isDanger = newStatus !== 'visible'

    openConfirm({
      title: `Xác nhận ${actionLabels[newStatus] || 'cập nhật'} bình luận`,
      description: `Bạn chắc chắn muốn ${actionLabels[newStatus] || 'cập nhật'} bình luận này?${isDanger ? ' Bình luận sẽ không hiển thị công khai.' : ' Bình luận sẽ hiển thị lại cho người dùng.'}`,
      confirmLabel: `Xác nhận ${actionLabels[newStatus] || 'cập nhật'}`,
      isDanger,
      onConfirm: async () => {
        setActionBusy(true)
        const { getCurrentSession } = await import('../../services/authService')
        const session = await getCurrentSession()
        const adminId = session?.user?.id || null

        const { updateCommentStatusAdminFull } = await import('../../services/interactionService')
        const { error } = await updateCommentStatusAdminFull(id, newStatus, adminId)

        if (!error) {
          setComments((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
          )
          showToast(`Đã ${actionLabels[newStatus] || 'cập nhật'} bình luận.`)

          // Send notification for hide/spam actions
          if (newStatus === 'hidden' || newStatus === 'spam') {
            const comment = comments.find(c => c.id === id)
            if (comment) {
              const { sendCommentNotification } = await import('../../services/interactionService')
              await sendCommentNotification(comment.userId, comment.content, newStatus, comment.postTitle, id)
            }
          }
        } else {
          showToast('Lỗi: ' + error.message, 'error')
        }
        setActionBusy(false)
        closeConfirm()
      },
    })
  }

  const handleDelete = async (id) => {
    openConfirm({
      title: 'Xác nhận xóa bình luận',
      description: 'Bạn chắc chắn muốn xóa bình luận này? Bình luận sẽ bị xóa mềm và không hiển thị công khai.',
      confirmLabel: 'Xác nhận xóa',
      isDanger: true,
      onConfirm: async () => {
        setActionBusy(true)
        const { deleteCommentAdmin, sendCommentNotification } = await import('../../services/interactionService')
        const { error } = await deleteCommentAdmin(id)
        if (error) {
          showToast('Lỗi xóa: ' + error.message, 'error')
        } else {
          const comment = comments.find(c => c.id === id)
          setComments((prev) => prev.map(c => c.id === id ? { ...c, status: 'deleted' } : c))
          setDrawerCommentId(null)
          showToast('Đã xóa mềm bình luận.')

          if (comment) {
            await sendCommentNotification(comment.userId, comment.content, 'deleted', comment.postTitle, id)
          }
        }
        setActionBusy(false)
        closeConfirm()
      },
    })
  }

  const handleSendNotification = async (id) => {
    const comment = comments.find(c => c.id === id)
    if (!comment) return

    setActionBusy(true)
    const { sendCommentNotification } = await import('../../services/interactionService')
    const { error } = await sendCommentNotification(comment.userId, comment.content, 'warning', comment.postTitle, id)
    if (!error) {
      showToast('Đã gửi thông báo cảnh báo cho người dùng.')
    } else {
      showToast(error.message || 'Không thể gửi thông báo cảnh báo.', 'error')
    }
    setActionBusy(false)
  }

  const handleSaveAdminNote = async (id, note) => {
    const { updateCommentAdminNote } = await import('../../services/interactionService')
    const { error } = await updateCommentAdminNote(id, note)
    if (!error) {
      setComments(prev => prev.map(c => c.id === id ? { ...c, adminNote: note } : c))
      showToast('Đã lưu ghi chú admin.')
    } else {
      showToast('Lỗi lưu ghi chú: ' + error.message, 'error')
    }
  }

  const handleBulkAction = async (action) => {
    const actionLabels = { hidden: 'ẩn', spam: 'đánh dấu spam', visible: 'khôi phục', deleted: 'xóa mềm' }

    openConfirm({
      title: `${actionLabels[action] ? actionLabels[action].charAt(0).toUpperCase() + actionLabels[action].slice(1) : 'Cập nhật'} ${selectedIds.length} bình luận`,
      description: `Bạn chắc chắn muốn ${actionLabels[action] || 'cập nhật'} ${selectedIds.length} bình luận đã chọn?`,
      confirmLabel: `Xác nhận ${actionLabels[action]}`,
      isDanger: action !== 'visible',
      onConfirm: async () => {
        setActionBusy(true)
        const { getCurrentSession } = await import('../../services/authService')
        const session = await getCurrentSession()
        const adminId = session?.user?.id || null

        if (action === 'deleted') {
          const { deleteCommentAdmin } = await import('../../services/interactionService')
          for (const id of selectedIds) {
            await deleteCommentAdmin(id)
          }
        } else {
          const { updateCommentStatusAdminFull } = await import('../../services/interactionService')
          for (const id of selectedIds) {
            await updateCommentStatusAdminFull(id, action, adminId)
          }
        }

        setComments((prev) =>
          prev.map((c) =>
            selectedIds.includes(c.id) ? { ...c, status: action } : c,
          ),
        )
        setSelectedIds([])
        showToast(`Đã ${actionLabels[action]} ${selectedIds.length} bình luận.`)
        setActionBusy(false)
        closeConfirm()
      },
    })
  }

  const handleReset = () => {
    setSearch('')
    setStatus('Tất cả')
    setPostFilter('Tất cả')
    setDateRange('Tất cả')
    setSelectedIds([])
  }

  const drawerComment =
    comments.find((c) => c.id === drawerCommentId) ?? null

  if (loading) {
    return (
      <div className="ac-page page">
        <section className="ac-page__hero">
          <span className="page-badge page-badge--soft">Thảo luận cộng đồng</span>
          <div className="ac-page__hero-copy">
            <h2>Quản lý bình luận</h2>
            <p>Kiểm tra, ẩn hoặc xử lý các bình luận trong cộng đồng E-XANH.</p>
          </div>
        </section>
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '24px' }}>
            <div style={{ height: '100px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ height: '100px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ height: '100px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ height: '100px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          </div>
          <div style={{ height: '60px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', marginBottom: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ height: '120px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ height: '120px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ac-page page">
      <section className="ac-page__hero">
        <span className="page-badge page-badge--soft">
          Thảo luận cộng đồng
        </span>
        <div className="ac-page__hero-copy">
          <h2>Quản lý bình luận</h2>
          <p>
            Kiểm tra, ẩn hoặc xử lý các bình luận trong cộng đồng E-XANH.
          </p>
        </div>
      </section>

      {userFilterId ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '20px',
          padding: '14px 18px',
          borderRadius: '18px',
          background: 'rgba(234, 245, 157, 0.32)',
          border: '1px solid rgba(79, 132, 40, 0.12)',
        }}>
          <span>
            Đang lọc bình luận theo người dùng: <strong>{userFilterName || userFilterId}</strong>
            {` • Tìm thấy ${matchedCommentsForUser.length} bình luận khớp user này trong hệ thống`}
          </span>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setSearchParams({})}
          >
            Xóa bộ lọc này
          </button>
        </div>
      ) : null}

      {userFilterId && matchedCommentsForUser.length > 0 && filteredComments.length === 0 ? (
        <div style={{
          marginBottom: '20px',
          padding: '14px 18px',
          borderRadius: '18px',
          background: 'rgba(255, 247, 214, 0.72)',
          border: '1px solid rgba(196, 146, 29, 0.18)',
          color: '#6c5310',
        }}>
          Người dùng này có <strong>{matchedCommentsForUser.length}</strong> bình luận trong hệ thống, nhưng đang không hiện ra vì bộ lọc trạng thái, bài viết hoặc thời gian hiện tại.
        </div>
      ) : null}

      <AdminCommentStats stats={computedStats} />

      <AdminCommentFilter
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        postFilter={postFilter}
        onPostFilterChange={setPostFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        postTitles={postTitles}
        onReset={handleReset}
        onRefresh={loadComments}
      />

      <AdminCommentBulkAction
        selectedCount={selectedIds.length}
        onBulkHide={() => handleBulkAction('hidden')}
        onBulkSpam={() => handleBulkAction('spam')}
        onBulkRestore={() => handleBulkAction('visible')}
        onBulkDelete={() => handleBulkAction('deleted')}
        isBusy={actionBusy}
      />

      <AdminCommentList
        comments={filteredComments}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
        onViewDetail={(id) => setDrawerCommentId(id)}
        onQuickHide={(id) => handleChangeStatus(id, 'hidden')}
        onQuickSpam={(id) => handleChangeStatus(id, 'spam')}
        onQuickRestore={(id) => handleChangeStatus(id, 'visible')}
      />

      <AdminCommentDrawer
        comment={drawerComment}
        onClose={() => setDrawerCommentId(null)}
        onChangeStatus={handleChangeStatus}
        onDelete={handleDelete}
        onSendNotification={handleSendNotification}
        onSaveAdminNote={handleSaveAdminNote}
        isBusy={actionBusy}
      />

      {/* Confirm Dialog */}
      {confirmDialog ? (
        <div className="ac-modal-overlay" role="dialog" aria-modal="true">
          <div className="ac-modal">
            <div className="ac-modal__header">
              <h3>{confirmDialog.title}</h3>
              <button type="button" className="ac-modal__close" onClick={closeConfirm} aria-label="Đóng">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="ac-modal__body">
              <p>{confirmDialog.description}</p>
            </div>
            <div className="ac-modal__footer">
              <button type="button" className="btn btn--ghost" onClick={closeConfirm} disabled={actionBusy}>
                Hủy
              </button>
              <button
                type="button"
                className={`btn ${confirmDialog.isDanger ? 'btn--danger' : 'btn--primary'}`}
                onClick={confirmDialog.onConfirm}
                disabled={actionBusy}
              >
                {actionBusy ? 'Đang xử lý...' : confirmDialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className={`ac-toast ac-toast--${toast.tone || 'success'}`} role="alert" aria-live="assertive">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 12.5 10 15l7-7M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          </svg>
          {toast.message}
        </div>
      ) : null}
    </div>
  )
}

export default CommentManagementPage
