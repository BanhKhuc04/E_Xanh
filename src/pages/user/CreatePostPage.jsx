import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import CreatePostForm from '../../components/community/CreatePostForm'
import CreatePostSidebar from '../../components/community/CreatePostSidebar'
import { getCurrentSession, onAuthStateChange } from '../../services/authService'
import { createPost } from '../../services/postService'
import '../../styles/create-post.css'

function CreatePostPage() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const initialForm = {
    title: '',
    type: location.state?.defaultType || '',
    category: '',
    description: '',
    coverName: '',
    coverFile: null,
    coverPreview: '',
    content: '',
    tags: '',
  }

  const [form, setForm] = useState(initialForm)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [previewHighlight, setPreviewHighlight] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Khôi phục nháp khi mở trang
  useEffect(() => {
    try {
      const draftStr = localStorage.getItem('exanh_draft_post')
      if (draftStr) {
        const draft = JSON.parse(draftStr)
        // eslint-disable-next-line
        setForm(current => ({
          ...current,
          title: draft.title || '',
          type: draft.type || current.type,
          category: draft.category || '',
          description: draft.description || '',
          content: draft.content || '',
          tags: draft.tags || ''
        }))
        setInfoMessage('Đã tự động khôi phục bản nháp chưa gửi của bạn.')
      }
    } catch {
      console.warn('Lỗi khôi phục bản nháp')
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    async function loadAuth() {
      const session = await getCurrentSession()
      if (isMounted) {
        if (!session?.user) {
          navigate('/dang-nhap', { state: { from: location.pathname, message: "Vui lòng đăng nhập để đăng bài" } })
          return
        }
        setUser(session.user)
        setAuthLoading(false)
      }
    }
    loadAuth()

    const subscription = onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      isMounted = false
      subscription?.unsubscribe?.()
      if (form.coverPreview) {
        URL.revokeObjectURL(form.coverPreview)
      }
    }
  }, [form.coverPreview])

  useEffect(() => {
    if (!successMessage && !infoMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage('')
      setInfoMessage('')
      setPreviewHighlight(false)
    }, 4000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [infoMessage, successMessage])

  function handleChange(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
    setErrorMessage('')
  }

  function handleCoverChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Kích thước ảnh vượt quá 5MB. Vui lòng chọn ảnh nhẹ hơn.')
      return
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Định dạng ảnh không hợp lệ. Chỉ hỗ trợ JPG, PNG, WEBP.')
      return
    }

    if (form.coverPreview) {
      URL.revokeObjectURL(form.coverPreview)
    }

    const previewUrl = URL.createObjectURL(file)

    setForm((current) => ({
      ...current,
      coverName: file.name,
      coverFile: file,
      coverPreview: previewUrl,
    }))
    setErrorMessage('')
  }

  function handleSaveDraft() {
    setErrorMessage('')
    setSuccessMessage('')
    try {
      const draftToSave = {
        title: form.title,
        type: form.type,
        category: form.category,
        description: form.description,
        content: form.content,
        tags: form.tags
      }
      localStorage.setItem('exanh_draft_post', JSON.stringify(draftToSave))
      setInfoMessage('Đã lưu nháp')
    } catch {
      setErrorMessage('Không thể lưu bản nháp lúc này.')
    }
  }

  function handlePreview() {
    setErrorMessage('')
    setSuccessMessage('')
    setInfoMessage('Khung xem trước đã được cập nhật theo nội dung bạn đang nhập.')
    setPreviewHighlight(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setInfoMessage('')
    setPreviewHighlight(false)
    setErrorMessage('')
    setSuccessMessage('')

    if (!form.title.trim()) {
      setErrorMessage('Vui lòng nhập tiêu đề')
      return
    }

    if (!form.content.trim()) {
      setErrorMessage('Vui lòng nhập nội dung')
      return
    }

    if (form.content.trim().length < 50) {
      setErrorMessage('Nội dung bài viết cần tối thiểu 50 ký tự.')
      return
    }

    setIsSubmitting(true)
    const { error } = await createPost(form)
    
    if (error) {
      setErrorMessage(`Lỗi đăng bài: ${error.message}`)
      setIsSubmitting(false)
      return
    }

    // Gửi thành công: xoá nháp, reset form
    localStorage.removeItem('exanh_draft_post')
    setErrorMessage('')
    setSuccessMessage('Bài viết đã được gửi thành công và đang chờ duyệt!')
    setForm(initialForm)
    setIsSubmitting(false)
  }

  if (authLoading) {
    return <div className="create-post-page"><div className="shell" style={{ padding: '40px 0', textAlign: 'center' }}>Đang tải...</div></div>
  }

  if (authLoading) {
    return <div className="create-post-page"><div className="shell" style={{ padding: '40px 0', textAlign: 'center' }}>Đang tải...</div></div>
  }

  return (
    <div className="create-post-page">
      <section className="create-post-page__hero">
        <div className="create-post-page__hero-content">
          <span className="create-post-page__badge">Chia sẻ sống xanh</span>
          <h1>Đăng bài chia sẻ</h1>
          <p>
            Chia sẻ mẹo tiết kiệm điện, kinh nghiệm dùng thiết bị hoặc câu chuyện sống xanh của bạn với cộng đồng E-XANH.
          </p>
        </div>

        <div className="create-post-page__hero-visual">
          <img
            src='/images/fallback-green.jpg'
            alt="Minh họa người dùng đang viết bài chia sẻ sống xanh"
          />
        </div>
      </section>

      <section className="create-post-page__alert">
        <strong>Quy trình duyệt bài</strong>
        <p>
          Bài viết của bạn sẽ được gửi ở trạng thái Chờ duyệt. Admin sẽ kiểm tra nội dung trước khi hiển thị công khai.
        </p>
      </section>

      <div className="create-post-page__layout">
        <CreatePostForm
          form={form}
          errorMessage={errorMessage}
          successMessage={successMessage}
          infoMessage={infoMessage}
          onChange={handleChange}
          onCoverChange={handleCoverChange}
          onSaveDraft={handleSaveDraft}
          onPreview={handlePreview}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        <CreatePostSidebar form={form} previewHighlight={previewHighlight} />
      </div>
    </div>
  )
}

export default CreatePostPage
