import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { Helmet } from 'react-helmet-async'
import { signUpWithEmail } from '../../services/authService'
import { fetchBanners } from '../../services/bannerService'
import BannerCarousel from '../../components/common/BannerCarousel'
import BrandLogo from '../../components/common/BrandLogo'
import '../../styles/auth.css'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

function RegisterPage() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [banners, setBanners] = useState([])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessMode, setIsSuccessMode] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
  const isCaptchaDisabled = import.meta.env.VITE_DISABLE_CAPTCHA === 'true'

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

    if (!passwordPattern.test(form.password)) {
      setSuccessMessage('')
      setErrorMessage('Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số.')
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

    if (!isCaptchaDisabled && !turnstileToken) {
      setSuccessMessage('')
      setErrorMessage('Vui lòng xác minh bạn là người.')
      return
    }

    setIsSubmitting(true)

    const { data, error } = await signUpWithEmail({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    })

    if (error) {
      let viError = 'Không thể kết nối máy chủ. Vui lòng thử lại.'
      if (error.message.includes('already registered')) {
        viError = 'Email này đã được đăng ký.'
      } else if (error.message.includes('Password should be at least') || error.message.includes('weak')) {
        viError = 'Mật khẩu chưa đủ mạnh.'
      } else if (error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('format')) {
        viError = 'Email không hợp lệ.'
      } else if (error.message) {
        viError = error.message
      }
      setErrorMessage(`${viError}`)
      setIsSubmitting(false)
      return
    }

    setErrorMessage('')
    setIsSuccessMode(true)
    setIsSubmitting(false)
  }


  return (
    <>
      <Helmet>
        <title>Đăng ký - E-XANH</title>
        <meta name="description" content="Tạo tài khoản E-XANH để tham gia cộng đồng và lưu các mẹo tiết kiệm điện." />
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
          {isSuccessMode ? (
            <div className="auth-success-state" style={{ textAlign: 'center', padding: '32px 16px' }}>
              <div style={{ width: '64px', height: '64px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#16a34a' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h2 style={{ fontSize: '1.5rem', color: '#1a1a1a', marginBottom: '16px' }}>Kiểm tra email của bạn</h2>
              <p style={{ color: '#4b5563', lineHeight: '1.6', marginBottom: '32px' }}>
                E-XANH đã gửi email xác nhận đến <strong style={{ color: '#4f8428' }}>{form.email}</strong>.<br/><br/>
                Vui lòng mở email và bấm nút xác nhận để kích hoạt tài khoản.
              </p>
              <button 
                type="button"
                className="btn btn--primary" 
                style={{ width: '100%', marginBottom: '16px' }}
                onClick={() => navigate('/dang-nhap')}
              >
                Đã hiểu, chuyển sang đăng nhập
              </button>
              <button 
                type="button"
                className="btn btn--secondary" 
                style={{ width: '100%', border: 'none', background: 'transparent' }}
                onClick={async () => {
                  try {
                    const { supabase } = await import('../../lib/supabase')
                    await supabase.auth.resend({ type: 'signup', email: form.email })
                    alert('Đã gửi lại email xác nhận!')
                  } catch (e) {
                    alert('Lỗi gửi lại email. Vui lòng thử lại sau.')
                  }
                }}
              >
                Gửi lại email xác nhận
              </button>
            </div>
          ) : (
            <>
              <div className="auth-card__header">
                <h2>Tạo tài khoản E-XANH</h2>
                <p>Đăng ký để lưu bài viết, bình luận, đăng bài chia sẻ và theo dõi lịch sử kiểm tra tiền điện.</p>
              </div>

              <div className="auth-card__switcher">
                <Link to="/dang-nhap">Đăng nhập</Link>
                <span className="is-active">Đăng ký</span>
              </div>

          {errorMessage ? <div className="auth-card__message auth-card__message--error" role="alert" data-testid="register-error">{errorMessage}</div> : null}
          {successMessage ? (
            <div className="auth-card__message auth-card__message--success">{successMessage}</div>
          ) : null}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="register-name">
              <span>Họ và tên</span>
              <input
                id="register-name"
                type="text"
                value={form.name}
                onChange={(event) => handleChange('name', event.target.value)}
                placeholder="Nhập họ và tên"
              />
            </label>

            <label htmlFor="register-email">
              <span>Email</span>
              <input
                id="register-email"
                type="email"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
                placeholder="Nhập email của bạn"
              />
            </label>

            <label htmlFor="register-password">
              <span>Mật khẩu</span>
              <input
                id="register-password"
                type="password"
                value={form.password}
                onChange={(event) => handleChange('password', event.target.value)}
                placeholder="Tạo mật khẩu"
              />
            </label>

            <label htmlFor="register-confirm">
              <span>Xác nhận mật khẩu</span>
              <input
                id="register-confirm"
                type="password"
                value={form.confirmPassword}
                onChange={(event) => handleChange('confirmPassword', event.target.value)}
                placeholder="Nhập lại mật khẩu"
              />
            </label>

            <label className="auth-form__checkbox" htmlFor="register-agree">
              <input
                id="register-agree"
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

            {!isCaptchaDisabled && (
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
            )}
            {/* TODO: Gửi turnstileToken lên backend/Supabase Edge Function để verify an toàn hơn */}

            <button type="submit" className="btn btn--primary auth-form__submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>

            <p className="auth-card__alternate">
              Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link>
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
                  E-XANH cam kết bảo vệ dữ liệu cá nhân của bạn. Thông tin được mã hóa an toàn và không chia sẻ cho bên thứ ba.
                </p>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
    </>
  )
}

export default RegisterPage
