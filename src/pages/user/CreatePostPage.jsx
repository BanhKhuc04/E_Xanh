import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import CreatePostForm from '../../components/community/CreatePostForm'
import CreatePostSidebar from '../../components/community/CreatePostSidebar'
import { getCurrentSession, onAuthStateChange } from '../../services/authService'
import { createPost } from '../../services/postService'
import '../../styles/create-post.css'

function CreatePostPage() {
  const location = useLocation()
  
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
  
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function loadAuth() {
      const session = await getCurrentSession()
      if (isMounted) {
        setUser(session?.user || null)
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
    }, 3000)

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
    setInfoMessage('Bản nháp của bạn đã được lưu tạm trên biểu mẫu.')
  }

  function handlePreview() {
    setErrorMessage('')
    setSuccessMessage('')
    setInfoMessage('Khung xem trước đã được cập nhật theo nội dung bạn đang nhập.')
    setPreviewHighlight(true)
  }

  async function handleSubmit() {
    setInfoMessage('')
    setPreviewHighlight(false)
    setErrorMessage('')
    setSuccessMessage('')

    if (!form.title.trim()) {
      setErrorMessage('Vui lòng nhập tiêu đề bài viết.')
      return
    }

    if (!form.content.trim()) {
      setErrorMessage('Vui lòng nhập nội dung bài viết.')
      return
    }

    if (form.content.trim().length < 50) {
      setErrorMessage('Nội dung bài viết cần tối thiểu 50 ký tự.')
      return
    }

    const { error } = await createPost(form)
    
    if (error) {
      setErrorMessage(`Lỗi đăng bài: ${error.message}`)
      return
    }

    setErrorMessage('')
    setSuccessMessage('Bài viết đã được gửi và đang chờ duyệt.')
    setForm(initialForm)
  }

  if (authLoading) {
    return <div className="create-post-page"><div className="shell" style={{ padding: '40px 0', textAlign: 'center' }}>Đang tải...</div></div>
  }

  if (!user) {
    return (
      <div className="create-post-page">
        <section className="create-post-page__hero">
          <div className="create-post-page__hero-content" style={{ textAlign: 'center', margin: '0 auto' }}>
            <h1>Bạn cần đăng nhập để đăng bài chia sẻ.</h1>
            <p style={{ marginBottom: '20px' }}>Vui lòng đăng nhập để tham gia chia sẻ bài viết với cộng đồng E-XANH.</p>
            <Link to="/dang-nhap" className="btn btn--primary">Đăng nhập ngay</Link>
          </div>
        </section>
      </div>
    )
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
            src="https://lh3.googleusercontent.com/aida/AP1WRLtpJjTm__j83GOUfzCEatime_6k6N8-w8fEefsiI-Lus8iHT_b61LMTmM_Bcc69Plh848bFko5xaHVs6fv2BcN74fwRsoAhlOJ1ZkP618NwsrjgLSz-wL3FwzkvkVxAOKv5wvq-5nB67EqoDEZlvRerY746S-L3WOKa-spymW1X9bOGvTnYMh-eB12O39CbwEv3QROuBbdreSnfwktdHuA_mr29o-RssSGB1pvcgZX0YrgcElfsy5qjgVci"
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
        />

        <CreatePostSidebar form={form} previewHighlight={previewHighlight} />
      </div>
    </div>
  )
}

export default CreatePostPage
