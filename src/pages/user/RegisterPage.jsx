import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signUpWithEmail } from '../../services/authService'
import '../../styles/auth.css'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
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

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      setSuccessMessage('')
      setErrorMessage('Vui lòng nhập họ và tên.')
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

    if (!form.password.trim()) {
      setSuccessMessage('')
      setErrorMessage('Vui lòng nhập mật khẩu.')
      return
    }

    if (form.password.trim().length < 6) {
      setSuccessMessage('')
      setErrorMessage('Mật khẩu cần tối thiểu 6 ký tự.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setSuccessMessage('')
      setErrorMessage('Xác nhận mật khẩu không khớp.')
      return
    }

    if (!form.agree) {
      setSuccessMessage('')
      setErrorMessage('Vui lòng đồng ý với điều khoản sử dụng của E-XANH.')
      return
    }

    const { data, error } = await signUpWithEmail({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    })

    if (error) {
      let viError = 'Đã xảy ra lỗi, vui lòng thử lại.'
      if (error.message.includes('already registered')) {
        viError = 'Email này đã được đăng ký.'
      } else if (error.message.includes('Password should be at least')) {
        viError = 'Mật khẩu phải có ít nhất 6 ký tự.'
      } else if (error.message) {
        viError = error.message
      }
      setErrorMessage(`Lỗi đăng ký: ${viError}`)
      return
    }

    setErrorMessage('')
    setSuccessMessage('Đăng ký thành công. Vui lòng kiểm tra email nếu hệ thống yêu cầu xác nhận.')

    window.setTimeout(() => {
      if (data?.session) {
        navigate('/tai-khoan')
      } else {
        navigate('/')
      }
    }, 2000)
  }


  return (
    <div className="auth-page">
      <div className="auth-layout">
        <section className="auth-visual">
          <div className="auth-visual__main">
            <div className="auth-visual__top">
              <div className="auth-visual__brand">
                <span className="auth-visual__logo">E</span>
                <strong>E-XANH</strong>
              </div>
              <span className="auth-visual__chip">Cộng đồng sống xanh</span>
            </div>

            <div className="auth-visual__content">
              <h1>
                Tham gia E-XANH<br />
                để sống xanh hơn<br />
                mỗi ngày
              </h1>
              <p>
                Một tài khoản E-XANH giúp bạn lưu bài viết, tham gia cộng đồng và theo dõi thói quen sử dụng điện cá nhân.
              </p>
              <div className="auth-visual__inline-features">
                 <span>Lưu bài viết</span>
                 <span className="dot">•</span>
                 <span>Bình luận</span>
                 <span className="dot">•</span>
                 <span>Theo dõi điện năng</span>
              </div>
            </div>
          </div>

          <div className="auth-carousel-placeholder">
            <span>Ảnh minh họa đang cập nhật</span>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card__header">
            <h2>Tạo tài khoản E-XANH</h2>
            <p>Đăng ký để lưu bài viết, bình luận, đăng bài chia sẻ và theo dõi lịch sử kiểm tra tiền điện.</p>
          </div>

          <div className="auth-card__switcher">
            <Link to="/dang-nhap">Đăng nhập</Link>
            <span className="is-active">Đăng ký</span>
          </div>

          {errorMessage ? <div className="auth-card__message auth-card__message--error">{errorMessage}</div> : null}
          {successMessage ? (
            <div className="auth-card__message auth-card__message--success">{successMessage}</div>
          ) : null}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              <span>Họ và tên</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => handleChange('name', event.target.value)}
                placeholder="Nhập họ và tên"
              />
            </label>

            <label>
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
                placeholder="Nhập email của bạn"
              />
            </label>

            <label>
              <span>Mật khẩu</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => handleChange('password', event.target.value)}
                placeholder="Tạo mật khẩu"
              />
            </label>

            <label>
              <span>Xác nhận mật khẩu</span>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(event) => handleChange('confirmPassword', event.target.value)}
                placeholder="Nhập lại mật khẩu"
              />
            </label>

            <label className="auth-form__checkbox">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(event) => handleChange('agree', event.target.checked)}
              />
              <span>
                Tôi đồng ý với{' '}
                <Link
                  to="/dieu-khoan"
                  className="auth-form__terms-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  điều khoản sử dụng
                </Link>{' '}
                của E-XANH
              </span>
            </label>

            <button type="submit" className="btn btn--primary auth-form__submit">
              Tạo tài khoản
            </button>
          </form>

          <p className="auth-card__alternate">
            Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link>
          </p>

          <div className="auth-note">
            <strong>Bảo mật thông tin</strong>
            <p>
              Khách chưa đăng nhập vẫn có thể xem bài viết và tính tiền điện. Đăng nhập giúp bạn lưu lại dữ liệu cá nhân hóa.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default RegisterPage
