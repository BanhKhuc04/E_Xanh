import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { loginUser } from '../../utils/authStorage'
import '../../styles/auth.css'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function createDemoUser(email, name = 'Nguyễn Văn A', avatar = 'NA') {
  return {
    id: 'user-001',
    name,
    email,
    role: 'user',
    avatar,
  }
}

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
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

  function finishLogin(user) {
    loginUser(user)
    setErrorMessage('')
    setSuccessMessage('Đăng nhập thành công.')

    window.setTimeout(() => {
      navigate('/')
    }, 700)
  }

  function handleSubmit(event) {
    event.preventDefault()

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

    finishLogin(createDemoUser(form.email.trim()))
  }

  function handleSocialLogin(provider) {
    const socialUser =
      provider === 'google'
        ? createDemoUser('nguyenvana@email.com', 'Nguyễn Văn A', 'NA')
        : createDemoUser('nguyenvana@github.com', 'Nguyễn Văn A', 'NA')

    finishLogin(socialUser)
  }

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <section className="auth-visual">
          <div className="auth-visual__top">
            <div className="auth-visual__brand">
              <span className="auth-visual__logo">E</span>
              <strong>E-XANH</strong>
            </div>
            <span className="auth-visual__chip">Cộng đồng sống xanh</span>
          </div>

          <div className="auth-visual__content">
            <h1>Tham gia E-XANH để sống xanh hơn mỗi ngày</h1>
            <p>
              Lưu lại mẹo tiết kiệm điện, chia sẻ kinh nghiệm, bình luận và theo dõi lịch sử kiểm tra tiền điện của bạn.
            </p>
          </div>

          <div className="auth-visual__benefits">
            <article>Lưu bài viết hữu ích</article>
            <article>Bình luận và tương tác</article>
            <article>Theo dõi tiền điện hằng tháng</article>
          </div>

          <div className="auth-visual__image">
            <img
              src="https://lh3.googleusercontent.com/aida/AP1WRLsyEXL8ygmkoBTmM7-tshvP-VQ4Z1sLXWVXyINN3y95prhrS-VUoerLyPXpIb7lsjyob8ZDfxxaq_XUsWGHXh4P411TzVXhV3i4-nxVYXFrJFGOBDmHONL5nCKnjnWoGp4OtdnMpYlKtKmhkgTIU_5yWU9mkwn-p_6STtwjQeW_RwnZWX3tuTnB28QsabrL990mkLkesFOYSp7_NacW-Z-CbeGbNLz3MKQwfzHFmNiKDu4PbVXOkSTPPND9"
              alt="Minh họa đăng nhập E-XANH"
            />
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card__header">
            <h2>Chào mừng trở lại</h2>
            <p>Đăng nhập để tiếp tục hành trình sống xanh cùng E-XANH.</p>
          </div>

          <div className="auth-card__switcher">
            <span className="is-active">Đăng nhập</span>
            <Link to="/dang-ky">Đăng ký</Link>
          </div>

          {errorMessage ? <div className="auth-card__message auth-card__message--error">{errorMessage}</div> : null}
          {successMessage ? (
            <div className="auth-card__message auth-card__message--success">{successMessage}</div>
          ) : null}

          <form className="auth-form" onSubmit={handleSubmit}>
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
                placeholder="Nhập mật khẩu"
              />
            </label>

            <div className="auth-form__row">
              <label className="auth-form__checkbox">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(event) => handleChange('remember', event.target.checked)}
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>

              <button type="button" className="auth-form__link-button">
                Quên mật khẩu?
              </button>
            </div>

            <button type="submit" className="btn btn--primary auth-form__submit">
              Đăng nhập
            </button>
          </form>

          <p className="auth-card__alternate">
            Chưa có tài khoản? <Link to="/dang-ky">Tạo tài khoản ngay</Link>
          </p>

          <div className="auth-card__divider">hoặc</div>

          <div className="auth-card__socials">
            <button type="button" onClick={() => handleSocialLogin('google')}>
              Đăng nhập với Google
            </button>
            <button type="button" onClick={() => handleSocialLogin('github')}>
              Đăng nhập với GitHub
            </button>
          </div>

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

export default LoginPage
