import { Link } from 'react-router-dom'
import { useState } from 'react'
import '../../styles/static-pages.css'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'Góp ý giao diện',
    content: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  function handleChange(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
    setErrorMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      setSuccessMessage('')
      setErrorMessage('Vui lòng nhập họ tên.')
      return
    }

    if (!form.email.trim()) {
      setSuccessMessage('')
      setErrorMessage('Vui lòng nhập email.')
      return
    }

    if (!emailPattern.test(form.email.trim())) {
      setSuccessMessage('')
      setErrorMessage('Email không hợp lệ.')
      return
    }

    if (!form.content.trim()) {
      setSuccessMessage('')
      setErrorMessage('Vui lòng nhập nội dung.')
      return
    }

    setErrorMessage('')
    setSuccessMessage('Cảm ơn bạn đã liên hệ. E-XANH sẽ phản hồi trong 24–48 giờ làm việc.')
  }

  return (
    <div className="static-page">
      <div className="static-page__breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span>{'>'}</span>
        <span>Liên hệ</span>
      </div>

      <section className="static-page__hero static-page__hero--contact">
        <div className="static-page__hero-content static-page__hero-content--centered">
          <h1>Liên hệ với E-XANH</h1>
          <p>
            Bạn có câu hỏi, góp ý hoặc muốn hợp tác cùng E-XANH? Hãy gửi thông tin cho chúng tôi.
          </p>
        </div>
      </section>

      <div className="static-page__contact-layout">
        <section className="static-page__contact-form-card">
          <h2>Gửi tin nhắn cho chúng tôi</h2>

          {errorMessage ? <div className="static-page__message static-page__message--error">{errorMessage}</div> : null}
          {successMessage ? (
            <div className="static-page__message static-page__message--success">{successMessage}</div>
          ) : null}

          <form className="static-page__contact-form" onSubmit={handleSubmit}>
            <div className="static-page__form-row">
              <label>
                <span>Họ và tên</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  placeholder="Nhập họ và tên của bạn"
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  placeholder="Ví dụ: email@domain.com"
                />
              </label>
            </div>

            <label>
              <span>Chủ đề</span>
              <select value={form.subject} onChange={(event) => handleChange('subject', event.target.value)}>
                <option>Góp ý giao diện</option>
                <option>Báo lỗi hệ thống</option>
                <option>Hợp tác truyền thông</option>
                <option>Hỗ trợ tài khoản</option>
                <option>Khác</option>
              </select>
            </label>

            <label>
              <span>Nội dung tin nhắn</span>
              <textarea
                rows="8"
                value={form.content}
                onChange={(event) => handleChange('content', event.target.value)}
                placeholder="Nhập nội dung chi tiết..."
              />
            </label>

            <div className="static-page__contact-actions">
              <span>Chúng tôi thường phản hồi trong vòng 24h</span>
              <button type="submit" className="btn btn--primary">
                Gửi liên hệ
              </button>
            </div>
          </form>
        </section>

        <div className="static-page__contact-side">
          <section className="static-page__contact-card">
            <h2>Thông tin hỗ trợ</h2>
            <div className="static-page__contact-info">
              <div>
                <span>Email</span>
                <strong>support@exanh.vn</strong>
              </div>
              <div>
                <span>Khu vực</span>
                <strong>Hà Nội, Việt Nam</strong>
              </div>
              <div>
                <span>Thời gian hỗ trợ</span>
                <strong>08:00 – 18:00</strong>
              </div>
              <div>
                <span>Kênh cộng đồng</span>
                <strong>Facebook, TikTok</strong>
              </div>
            </div>
          </section>

          <section className="static-page__contact-card">
            <h2>Câu hỏi thường gặp</h2>
            <div className="static-page__faq">
              <article>Tôi có cần đăng nhập để kiểm tra tiền điện không?</article>
              <article>Kết quả tính tiền điện có chính xác tuyệt đối không?</article>
              <article>Tôi có thể đăng bài chia sẻ mẹo tiết kiệm điện không?</article>
            </div>
          </section>
        </div>
      </div>

      <section className="static-page__cta">
        <h2>Cùng E-XANH lan tỏa thói quen dùng điện thông minh</h2>
        <div className="static-page__cta-actions">
          <Link className="btn btn--secondary" to="/cong-dong">
            Tham gia cộng đồng
          </Link>
          <Link className="btn btn--primary" to="/dang-bai">
            Đăng bài chia sẻ
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
