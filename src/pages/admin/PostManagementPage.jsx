import { useState, useCallback, useEffect } from 'react'
import { adminPostStats } from '../../data/adminPosts'
import AdminPostStats from '../../components/admin/posts/AdminPostStats'
import AdminPostFilter from '../../components/admin/posts/AdminPostFilter'
import AdminPostBulkAction from '../../components/admin/posts/AdminPostBulkAction'
import AdminPostList from '../../components/admin/posts/AdminPostList'
import AdminPostPreview from '../../components/admin/posts/AdminPostPreview'
import { getAllAdminPosts, updatePostStatus, createPost, updatePost, deletePost } from '../../services/postService'
import { getCurrentSession, getCurrentUserProfile } from '../../services/authService'
import '../../styles/admin-posts.css'

const statusLabelToKey = {
  'Chờ duyệt': 'pending',
  'Đã duyệt': 'approved',
  'Bị từ chối': 'rejected',
  'Đã khóa': 'blocked',
}

function PostManagementPage() {
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
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [userRole, setUserRole] = useState(null)

  // States for Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    type: 'Mẹo tiết kiệm',
    status: 'pending'
  })
  const [formLoading, setFormLoading] = useState(false)

  const showToast = useCallback((message) => {
    setToast(message)
    setTimeout(() => setToast(''), 2500)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function fetchPostsData() {
      if (isMounted) setIsLoading(true)
      setErrorMsg('')
      
      // Load user role first
      const session = await getCurrentSession()
      if (session?.user && isMounted) {
         const profile = await getCurrentUserProfile(session.user.id)
         if (profile) setUserRole(profile.role)
      }

      const { data, error } = await getAllAdminPosts()
      if (error) {
        console.error('Fetch posts error:', error)
        if (isMounted) {
          setErrorMsg('Không tải được bài viết từ Supabase. Kiểm tra RLS hoặc quyền admin.')
          showToast('Lỗi tải dữ liệu: ' + error.message)
        }
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
        if (isMounted) setPosts(mapped)
      }
      if (isMounted) setIsLoading(false)
    }

    fetchPostsData()

    return () => { isMounted = false }
  }, [showToast, refreshTrigger])

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
      showToast('Tài khoản hiện tại không có quyền duyệt bài này.')
      return
    }
    showToast('Đã cập nhật trạng thái bài viết.')
    setRefreshTrigger(prev => prev + 1)
  }

  const handleBulkApprove = async () => {
    for (const id of selectedIds) {
      await updatePostStatus(id, 'approved')
    }
    setSelectedIds([])
    showToast('Đã duyệt các bài viết đã chọn.')
    setRefreshTrigger(prev => prev + 1)
  }

  const handleBulkReject = async () => {
    for (const id of selectedIds) {
      await updatePostStatus(id, 'rejected')
    }
    setSelectedIds([])
    showToast('Đã từ chối các bài viết đã chọn.')
    setRefreshTrigger(prev => prev + 1)
  }

  const handleReset = () => {
    setSearch('')
    setCategory('Tất cả')
    setStatus('Tất cả')
    setDateRange('Tất cả')
    setSelectedIds([])
  }

  // --- CRUD Handlers ---
  const handleOpenAdd = () => {
    setEditingPost(null)
    setFormData({
      title: '',
      description: '',
      content: '',
      type: 'tip',
      status: 'approved'
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (post) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      description: post.description,
      content: post.contentPreview,
      type: post.type,
      status: post.status
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPost(null)
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    if (!formData.title.trim() || !formData.content.trim()) {
      showToast('Vui lòng nhập đầy đủ Tiêu đề và Nội dung.')
      setFormLoading(false)
      return
    }

    if (editingPost) {
      const { error } = await updatePost(editingPost.id, formData)
      if (error) {
        showToast('Lỗi khi cập nhật bài viết: ' + error.message)
      } else {
        showToast('Cập nhật thành công.')
        handleCloseModal()
        setRefreshTrigger(prev => prev + 1)
      }
    } else {
      const { error } = await createPost(formData)
      if (error) {
        showToast('Lỗi khi thêm bài viết: ' + error.message)
      } else {
        showToast('Thêm bài viết thành công.')
        handleCloseModal()
        setRefreshTrigger(prev => prev + 1)
      }
    }
    setFormLoading(false)
  }

  const handleDeletePost = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return

    const { error } = await deletePost(id)
    if (error) {
      showToast('Lỗi xóa bài (có thể bạn không đủ quyền Admin): ' + error.message)
    } else {
      showToast('Đã xóa bài viết.')
      if (activePostId === id) setActivePostId(null)
      setRefreshTrigger(prev => prev + 1)
    }
  }

  const activePost = posts.find((p) => p.id === activePostId) ?? null

  return (
    <div className="ap-page page" style={{ position: 'relative' }}>
      <section className="ap-page__hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="page-badge page-badge--soft">Kiểm duyệt & Quản lý</span>
          <div className="ap-page__hero-copy">
            <h2>Quản lý bài viết</h2>
            <p>Kiểm tra, duyệt, thêm mới, hoặc chỉnh sửa các bài viết trên hệ thống.</p>
          </div>
        </div>
        <button className="btn btn--primary" onClick={handleOpenAdd}>
          + Tạo bài viết mới
        </button>
      </section>

      {isLoading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải dữ liệu...</div>
      ) : errorMsg ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#dc3545', fontWeight: 'bold' }}>
          {errorMsg}
        </div>
      ) : posts.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          Chưa có bài viết nào trên hệ thống.
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
              onEditPost={handleOpenEdit}
              onDeletePost={handleDeletePost}
              currentUserRole={userRole}
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

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: 'white', padding: '24px', borderRadius: '8px', 
            width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h3 style={{ marginBottom: '16px' }}>{editingPost ? 'Sửa bài viết' : 'Thêm bài viết mới'}</h3>
            <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <strong>Tiêu đề</strong>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </label>
              
              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <strong>Thể loại</strong>
                <select 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value="tip">Mẹo tiết kiệm</option>
                  <option value="community">Cộng đồng</option>
                  <option value="qa">Hỏi đáp</option>
                  <option value="review">Review thiết bị</option>
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <strong>Trạng thái</strong>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="rejected">Bị từ chối</option>
                  <option value="blocked">Đã khóa</option>
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <strong>Mô tả ngắn</strong>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows="2"
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <strong>Nội dung</strong>
                <textarea 
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  required 
                  rows="6"
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={handleCloseModal} className="btn btn--ghost" style={{ border: '1px solid #ccc' }}>
                  Hủy
                </button>
                <button type="submit" disabled={formLoading} className="btn btn--primary">
                  {formLoading ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostManagementPage
