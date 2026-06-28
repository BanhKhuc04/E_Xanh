import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import SEO from '../../components/SEO'
import { submitContactForm } from '../../services/contactService'
import '../../styles/static-pages.css'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ContactPage() {
  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`
  const OG_IMAGE = 'https://e-xanh.vercel.app/og-image-v2.png'

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'Góp ý giao diện',
    content: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [toast, setToast] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)

  const faqs = [
    { q: 'Tôi có cần đăng nhập để kiểm tra tiền điện không?', a: 'Không bắt buộc, nhưng đăng nhập giúp bạn lưu lại lịch sử kiểm tra để theo dõi về sau.' },
    { q: 'Kết quả tính tiền điện có chính xác tuyệt đối không?', a: 'Kết quả được tính theo biểu giá bậc thang mới nhất của EVN, tuy nhiên có thể lệch nhỏ do làm tròn số hoặc các yếu tố khác trong hóa đơn thực tế.' },
    { q: 'Tôi có thể đăng bài chia sẻ mẹo tiết kiệm điện không?', a: 'Hoàn toàn được! Bạn hãy đăng nhập và truy cập trang Cộng đồng để chia sẻ bài viết của mình.' }
  ]

  function handleChange(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
    setErrorMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      setErrorMessage('Vui lòng nhập họ tên.')
      return
    }

    if (!form.email.trim()) {
      setErrorMessage('Vui lòng nhập email.')
      return
    }

    if (!emailPattern.test(form.email.trim())) {
      setErrorMessage('Email không hợp lệ.')
      return
    }

    if (!form.content.trim()) {
      setErrorMessage('Vui lòng nhập nội dung.')
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await submitContactForm({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.content
      })

      if (error) {
        setErrorMessage('Có lỗi xảy ra khi gửi liên hệ: ' + error.message)
        setIsSubmitting(false)
        return
      }

      setErrorMessage('')
      setToast('Cảm ơn bạn đã liên hệ. E-XANH sẽ phản hồi trong 24–48 giờ làm việc.')
      setForm({ name: '', email: '', subject: 'Góp ý giao diện', content: '' })
      setIsSubmitting(false)
      setTimeout(() => setToast(''), 3000)
    } catch (err) {
      setErrorMessage('Lỗi hệ thống: ' + err.message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="static-page">
      <SEO title="Liên hệ" description="Liên hệ với đội ngũ E-XANH để gửi góp ý, báo lỗi, hợp tác hoặc nhận hỗ trợ tài khoản. Chúng tôi phản hồi trong 24 giờ." url={canonicalUrl} />
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

          {errorMessage ? <div className="static-page__message static-page__message--error" role="alert" data-testid="contact-error">{errorMessage}</div> : null}

          {toast && (
            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, background: '#4caf50', color: '#fff', padding: '12px 20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} role="alert">
              {toast}
            </div>
          )}

          <form className="static-page__contact-form" onSubmit={handleSubmit} noValidate>
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
              <button type="submit" className="btn btn--primary static-form__submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
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
                <strong>exanh.official@gmail.com</strong>
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
              {faqs.map((faq, index) => (
                <article 
                  key={index} 
                  className={`faq-item ${activeFaq === index ? 'faq-item--active' : ''}`}
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  style={{ cursor: 'pointer', padding: '12px 16px', borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                    {faq.q}
                    <span style={{ transform: activeFaq === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                  </div>
                  {activeFaq === index && (
                    <div style={{ marginTop: '12px', color: '#555', lineHeight: '1.5' }}>
                      {faq.a}
                    </div>
                  )}
                </article>
              ))}
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
