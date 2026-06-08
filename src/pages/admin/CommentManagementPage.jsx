import { useState, useCallback, useMemo, useEffect } from 'react'
import {
  adminCommentStats,
  commentStatusMap,
} from '../../data/adminComments'
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
}

function CommentManagementPage() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Tất cả')
  const [postFilter, setPostFilter] = useState('Tất cả')
  const [dateRange, setDateRange] = useState('Tất cả')
  const [selectedIds, setSelectedIds] = useState([])
  const [drawerCommentId, setDrawerCommentId] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    async function loadComments() {
      const { getAllCommentsAdmin } = await import('../../services/interactionService')
      const { data } = await getAllCommentsAdmin()
      if (data) {
        setComments(data.map(c => ({
          id: c.id,
          content: c.content,
          userName: c.profiles?.name || c.profiles?.email || 'N/A',
          userAvatar: c.profiles?.avatar_url || 'EX',
          postTitle: c.posts?.title || 'Không rõ',
          createdAt: c.created_at,
          status: c.status,
          reports: c.reports_count || 0,
        })))
      }
      setLoading(false)
    }
    loadComments()
  }, [])

  const showToast = useCallback((message) => {
    setToast(message)
    setTimeout(() => setToast(''), 2500)
  }, [])

  const postTitles = useMemo(
    () => [...new Set(comments.map((c) => c.postTitle))],
    [comments],
  )

  const filteredComments = comments.filter((comment) => {
    const matchSearch =
      search === '' ||
      comment.content.toLowerCase().includes(search.toLowerCase()) ||
      comment.userName.toLowerCase().includes(search.toLowerCase())

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

    return matchSearch && matchStatus && matchPost && matchDate
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

  const handleChangeStatus = async (id, newStatus) => {
    if (String(id).length < 30) {
      // Mock data
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
      )
      showToast(`Đã cập nhật bình luận: ${commentStatusMap[newStatus]?.label ?? newStatus}.`)
      return
    }

    const { updateCommentStatusAdmin } = await import('../../services/interactionService')
    const { error } = await updateCommentStatusAdmin(id, newStatus)
    if (!error) {
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
      )
      showToast(`Đã cập nhật bình luận: ${commentStatusMap[newStatus]?.label ?? newStatus}.`)
    } else {
      showToast('Lỗi: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (String(id).length > 30) {
      const { deleteCommentAdmin } = await import('../../services/interactionService')
      const { error } = await deleteCommentAdmin(id)
      if (error) {
        showToast('Lỗi xóa: ' + error.message)
        return
      }
    }

    setComments((prev) => prev.filter((c) => c.id !== id))
    setDrawerCommentId(null)
    showToast('Đã xóa bình luận.')
  }

  const handleBulkHide = async () => {
    const { updateCommentStatusAdmin } = await import('../../services/interactionService')
    for (const id of selectedIds) {
      if (String(id).length > 30) await updateCommentStatusAdmin(id, 'hidden')
    }
    setComments((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.id) ? { ...c, status: 'hidden' } : c,
      ),
    )
    setSelectedIds([])
    showToast('Đã ẩn các bình luận đã chọn.')
  }

  const handleBulkSpam = async () => {
    const { updateCommentStatusAdmin } = await import('../../services/interactionService')
    for (const id of selectedIds) {
      if (String(id).length > 30) await updateCommentStatusAdmin(id, 'spam')
    }
    setComments((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.id) ? { ...c, status: 'spam' } : c,
      ),
    )
    setSelectedIds([])
    showToast('Đã đánh dấu spam các bình luận đã chọn.')
  }

  const handleBulkRestore = async () => {
    const { updateCommentStatusAdmin } = await import('../../services/interactionService')
    for (const id of selectedIds) {
      if (String(id).length > 30) await updateCommentStatusAdmin(id, 'visible')
    }
    setComments((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.id) ? { ...c, status: 'visible' } : c,
      ),
    )
    setSelectedIds([])
    showToast('Đã khôi phục các bình luận đã chọn.')
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
        <div style={{ padding: '60px', textAlign: 'center', color: '#666' }}>
          Đang tải bình luận...
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

      <AdminCommentStats stats={adminCommentStats} />

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
        onFilter={() => {}}
        onReset={handleReset}
      />

      <AdminCommentBulkAction
        selectedCount={selectedIds.length}
        onBulkHide={handleBulkHide}
        onBulkSpam={handleBulkSpam}
        onBulkRestore={handleBulkRestore}
      />

      <AdminCommentList
        comments={filteredComments}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
        onViewDetail={(id) => setDrawerCommentId(id)}
        onQuickHide={(id) => handleChangeStatus(id, 'hidden')}
        onQuickSpam={(id) => handleChangeStatus(id, 'spam')}
      />

      <AdminCommentDrawer
        comment={drawerComment}
        onClose={() => setDrawerCommentId(null)}
        onChangeStatus={handleChangeStatus}
        onDelete={handleDelete}
      />

      {toast && (
        <div className="ac-toast" role="alert" aria-live="assertive">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 12.5 10 15l7-7M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  )
}

export default CommentManagementPage
