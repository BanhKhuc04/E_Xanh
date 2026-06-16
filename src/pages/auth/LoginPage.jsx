import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { Helmet } from 'react-helmet-async'
import { signInWithEmail, ensureActiveProfileSession } from '../../services/authService'
import { fetchBanners } from '../../services/bannerService'
import BannerCarousel from '../../components/common/BannerCarousel'
import BrandLogo from '../../components/common/BrandLogo'
import '../../styles/auth.css'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname, state } = location
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`

  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [errorMessage, setErrorMessage] = useState(state?.message || '')
  const [successMessage, setSuccessMessage] = useState('')
  const [banners, setBanners] = useState([])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

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

    if (!turnstileToken) {
      setSuccessMessage('')
      setErrorMessage('Vui lòng xác minh bạn là người.')
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
        const { profile, allowed, message } = await ensureActiveProfileSession(data.user.id)
        if (profile && profile.role) {
          role = profile.role
        }

        if (!allowed) {
          setErrorMessage(message)
          setIsSubmitting(false)
          return
        }
      } catch (err) {
        console.error('Lỗi khi lấy thông tin profile:', err)
      }
    }

    setErrorMessage('')
    setSuccessMessage('Đăng nhập thành công.')
    setIsSubmitting(false)

    window.setTimeout(() => {
      if (state?.from) {
        navigate(state.from)
      } else if (role === 'admin' || role === 'moderator') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    }, 700)
  }


  return (
    <>
      <Helmet>
        <title>Đăng nhập - E-XANH</title>
        <meta name="description" content="Đăng nhập vào E-XANH để khám phá thêm nhiều mẹo tiết kiệm điện." />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

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

                <button type="button" className="auth-form__link-button" disabled title="Tính năng đang phát triển" aria-disabled="true">
                  Quên mật khẩu?
                </button>
              </div>

              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center' }}>
                <Turnstile
                  siteKey={turnstileSiteKey || '1x00000000000000000000AA'}
                  onSuccess={(token) => {
                    setTurnstileToken(token)
                    setErrorMessage('')
                  }}
                  onError={() => setErrorMessage('Lỗi xác minh. Vui lòng tải lại trang.')}
                  onExpire={() => setTurnstileToken('')}
                  options={{ theme: 'light' }}
                />
              </div>
              {/* TODO: Gửi turnstileToken lên backend/Supabase Edge Function để verify an toàn hơn */}

              <button type="submit" className="btn btn--primary auth-form__submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>

            <p className="auth-card__alternate">
              Chưa có tài khoản? <Link to="/dang-ky">Tạo tài khoản ngay</Link>
            </p>

            <div className="auth-card__divider"></div>

            <div className="auth-card__socials" style={{ gridTemplateColumns: '1fr' }}>
              <button
                type="button"
                onClick={async () => {
                  const { signInWithGoogle } = await import('../../services/authService')
                  signInWithGoogle()
                }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', fontSize: '1rem', color: '#444' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Tiếp tục với Google
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
    </>
  )
}

export default LoginPage
