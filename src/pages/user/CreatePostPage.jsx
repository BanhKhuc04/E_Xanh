import { useEffect, useState } from 'react'
import CreatePostForm from '../../components/community/CreatePostForm'
import CreatePostSidebar from '../../components/community/CreatePostSidebar'
import '../../styles/create-post.css'

const initialForm = {
  title: '',
  type: '',
  category: '',
  description: '',
  coverName: '',
  content: '',
  tags: '',
}

function CreatePostPage() {
  const [form, setForm] = useState(initialForm)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [previewHighlight, setPreviewHighlight] = useState(false)

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

    setForm((current) => ({
      ...current,
      coverName: file?.name ?? '',
    }))
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

  function handleSubmit() {
    setInfoMessage('')
    setPreviewHighlight(false)

    if (!form.title.trim()) {
      setSuccessMessage('')
      setErrorMessage('Vui lòng nhập tiêu đề bài viết.')
      return
    }

    if (!form.content.trim()) {
      setSuccessMessage('')
      setErrorMessage('Vui lòng nhập nội dung bài viết.')
      return
    }

    if (form.content.trim().length < 50) {
      setSuccessMessage('')
      setErrorMessage('Nội dung bài viết cần tối thiểu 50 ký tự.')
      return
    }

    setErrorMessage('')
    setSuccessMessage('Bài viết đã được gửi và đang chờ duyệt.')
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
