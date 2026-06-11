import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { signInWithEmail, getCurrentUserProfile } from '../../services/authService'
import { fetchBanners } from '../../services/bannerService'
import BannerCarousel from '../../components/common/BannerCarousel'
import BrandLogo from '../../components/common/BrandLogo'
import '../../styles/auth.css'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [banners, setBanners] = useState([])

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await fetchBanners('auth', true)
      if (data) setBanners(data)
    }
    load()
  }, [])

  function handleChange(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
    setErrorMessage('')
  }

  async function handleSubmit(event) {
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

    setIsSubmitting(true)

    const { data, error } = await signInWithEmail({
      email: form.email.trim(),
      password: form.password,
    })

    if (error) {
      let viError = 'Email hoặc mật khẩu không đúng.'
      if (error.message && !error.message.includes('Invalid login credentials')) {
        viError = `Lỗi đăng nhập: ${error.message}`
      }
      setErrorMessage(viError)
      setIsSubmitting(false)
      return
    }

    let role = 'user'
    if (data?.user) {
      try {
        const profile = await getCurrentUserProfile(data.user.id)
        if (profile && profile.role) {
          role = profile.role
        }
      } catch (err) {
        console.error('Lỗi khi lấy thông tin profile:', err)
      }
    }

    setErrorMessage('')
    setSuccessMessage('Đăng nhập thành công.')
    setIsSubmitting(false)

    window.setTimeout(() => {
      if (role === 'admin' || role === 'moderator') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    }, 700)
  }


  return (
    <div className="auth-page">
      <div className="auth-layout">
        <section className="auth-visual">
          <div className="auth-visual__main">
            <div className="auth-visual__top">
              <div className="auth-visual__brand" style={{ marginBottom: '8px' }}>
                <BrandLogo to="/" size="auth" />
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

          <div className="auth-carousel-placeholder" style={{ padding: 0, overflow: 'hidden' }}>
            {banners.length > 0 ? (
              <BannerCarousel banners={banners} />
            ) : (
              <span style={{ display: 'grid', placeItems: 'center', height: '100%' }}>Ảnh minh họa đang cập nhật</span>
            )}
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

          {errorMessage ? <div className="auth-card__message auth-card__message--error" role="alert" data-testid="login-error">{errorMessage}</div> : null}
          {successMessage ? (
            <div className="auth-card__message auth-card__message--success">{successMessage}</div>
          ) : null}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="login-email">
              <span>Email</span>
              <input
                id="login-email"
                type="email"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
                placeholder="Nhập email của bạn"
              />
            </label>

            <label htmlFor="login-password">
              <span>Mật khẩu</span>
              <input
                id="login-password"
                type="password"
                value={form.password}
                onChange={(event) => handleChange('password', event.target.value)}
                placeholder="Nhập mật khẩu"
              />
            </label>

            <div className="auth-form__row">
              <label className="auth-form__checkbox" htmlFor="login-remember">
                <input
                  id="login-remember"
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

            <button type="submit" className="btn btn--primary auth-form__submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="auth-card__alternate">
            Chưa có tài khoản? <Link to="/dang-ky">Tạo tài khoản ngay</Link>
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

export default LoginPage
