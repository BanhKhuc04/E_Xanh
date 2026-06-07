import { useState, useCallback, useEffect } from 'react'
import { adminPostStats } from '../../data/adminPosts'
import AdminPostStats from '../../components/admin/posts/AdminPostStats'
import AdminPostFilter from '../../components/admin/posts/AdminPostFilter'
import AdminPostBulkAction from '../../components/admin/posts/AdminPostBulkAction'
import AdminPostList from '../../components/admin/posts/AdminPostList'
import AdminPostPreview from '../../components/admin/posts/AdminPostPreview'
import { getAllAdminPosts, updatePostStatus } from '../../services/postService'
import '../../styles/admin-posts.css'

const statusLabelToKey = {
  'Chờ duyệt': 'pending',
  'Đã duyệt': 'approved',
  'Bị từ chối': 'rejected',
  'Đã ẩn': 'hidden',
}

function PostApprovalPage() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Tất cả')
  const [status, setStatus] = useState('Tất cả')
  const [dateRange, setDateRange] = useState('Tất cả')
  const [selectedIds, setSelectedIds] = useState([])
  const [activePostId, setActivePostId] = useState(null)
  const [toast, setToast] = useState('')

  const showToast = useCallback((message) => {
    setToast(message)
    setTimeout(() => setToast(''), 2500)
  }, [])

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true)
      setErrorMsg('')
      const { data, error } = await getAllAdminPosts()
      if (error) {
        console.error('Fetch posts error:', error)
        setErrorMsg('Không tải được bài viết từ Supabase. Kiểm tra RLS hoặc quyền admin.')
        showToast('Lỗi tải dữ liệu: ' + error.message)
      } else if (data) {
        const mapped = data.map(post => ({
          id: post.id,
          title: post.title,
          author: post.profiles?.name || 'Người dùng ẩn danh',
          type: post.type,
          category: post.type,
          submittedAt: new Date(post.created_at).toISOString().split('T')[0],
          status: post.status,
          thumbnail: post.image_url || 'https://images.unsplash.com/photo-1631545806609-3c480b4bb12a?w=400&h=260&fit=crop',
          description: post.description || '',
          contentPreview: post.content || '',
          likes: post.likes_count || 0,
          comments: post.comments_count || 0,
        }))
        setPosts(mapped)
      }
      setIsLoading(false)
    }
    fetchPosts()
  }, [showToast])

  const filteredPosts = posts.filter((post) => {
    const matchSearch =
      search === '' ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.author.toLowerCase().includes(search.toLowerCase())

    const matchCategory =
      category === 'Tất cả' || post.category === category

    const matchStatus =
      status === 'Tất cả' || post.status === statusLabelToKey[status]

    let matchDate = true
    if (dateRange !== 'Tất cả') {
      const submitted = new Date(post.submittedAt)
      const now = new Date()
      if (dateRange === 'Hôm nay') {
        matchDate = submitted.toDateString() === now.toDateString()
      } else if (dateRange === '7 ngày qua') {
        const weekAgo = new Date(now)
        weekAgo.setDate(weekAgo.getDate() - 7)
        matchDate = submitted >= weekAgo
      } else if (dateRange === 'Tháng này') {
        matchDate =
          submitted.getMonth() === now.getMonth() &&
          submitted.getFullYear() === now.getFullYear()
      }
    }

    return matchSearch && matchCategory && matchStatus && matchDate
  })

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const handleSelectAll = () => {
    const allFilteredIds = filteredPosts.map((p) => p.id)
    const allSelected = allFilteredIds.every((id) => selectedIds.includes(id))
    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !allFilteredIds.includes(id)),
      )
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...allFilteredIds])])
    }
  }

  const handleViewPost = (id) => {
    setActivePostId(id)
  }

  const handleChangeStatus = async (id, newStatus, adminNote = null) => {
    const { error } = await updatePostStatus(id, newStatus, adminNote)
    if (error) {
      showToast('Tài khoản hiện tại chưa có quyền admin. Hãy cập nhật role = admin trong bảng profiles.')
      return
    }
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
    )
    showToast('Đã cập nhật trạng thái bài viết.')
  }

  const handleBulkApprove = async () => {
    for (const id of selectedIds) {
      await updatePostStatus(id, 'approved')
    }
    setPosts((prev) =>
      prev.map((p) =>
        selectedIds.includes(p.id) ? { ...p, status: 'approved' } : p,
      ),
    )
    setSelectedIds([])
    showToast('Đã duyệt các bài viết đã chọn.')
  }

  const handleBulkReject = async () => {
    for (const id of selectedIds) {
      await updatePostStatus(id, 'rejected')
    }
    setPosts((prev) =>
      prev.map((p) =>
        selectedIds.includes(p.id) ? { ...p, status: 'rejected' } : p,
      ),
    )
    setSelectedIds([])
    showToast('Đã từ chối các bài viết đã chọn.')
  }

  const handleReset = () => {
    setSearch('')
    setCategory('Tất cả')
    setStatus('Tất cả')
    setDateRange('Tất cả')
    setSelectedIds([])
  }

  const activePost = posts.find((p) => p.id === activePostId) ?? null

  return (
    <div className="ap-page page">
      <section className="ap-page__hero">
        <span className="page-badge page-badge--soft">Kiểm duyệt nội dung</span>
        <div className="ap-page__hero-copy">
          <h2>Duyệt bài viết</h2>
          <p>
            Kiểm tra và xử lý các bài viết người dùng gửi lên trước khi hiển
            thị công khai.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải dữ liệu...</div>
      ) : errorMsg ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#dc3545', fontWeight: 'bold' }}>
          {errorMsg}
        </div>
      ) : posts.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          Chưa có bài viết nào cần duyệt.
        </div>
      ) : (
        <>
          <AdminPostStats stats={adminPostStats} />

          <AdminPostFilter
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            status={status}
            onStatusChange={setStatus}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onFilter={() => {}}
            onReset={handleReset}
          />

          <AdminPostBulkAction
            selectedCount={selectedIds.length}
            onBulkApprove={handleBulkApprove}
            onBulkReject={handleBulkReject}
          />

          <section className="ap-page__workspace">
            <AdminPostList
              posts={filteredPosts}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
              activePostId={activePostId}
              onViewPost={handleViewPost}
            />
            <AdminPostPreview
              post={activePost}
              onChangeStatus={handleChangeStatus}
            />
          </section>
        </>
      )}

      {toast && (
        <div className="ap-toast" role="alert" aria-live="assertive">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 12.5 10 15l7-7M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  )
}

export default PostApprovalPage
