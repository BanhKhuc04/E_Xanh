import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { Helmet } from 'react-helmet-async'
import { EMAIL_PATTERN, signInWithEmail, ensureActiveProfileSession } from '../../services/authService'
import { fetchBanners } from '../../services/bannerService'
import AuthLayout from '../../components/auth/AuthLayout'
import AuthHero from '../../components/auth/AuthHero'
import AuthModeSwitch from '../../components/auth/AuthModeSwitch'
import AuthGoogleButton from '../../components/auth/AuthGoogleButton'
import '../../styles/auth.css'

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

    if (!form.email.trim()) {
      setSuccessMessage('')
      setErrorMessage('Vui lòng nhập email.')
      return
    }

    if (!EMAIL_PATTERN.test(form.email.trim())) {
      setSuccessMessage('')
      setErrorMessage('Email không hợp lệ.')
      return
    }

    if (!form.password.trim()) {
      setSuccessMessage('')
      setErrorMessage('Vui lòng nhập mật khẩu.')
      return
    }

    if (!isCaptchaDisabled && !turnstileToken) {
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

      <AuthLayout
        hero={(
          <AuthHero
            badge="Cộng đồng sống xanh"
            title={<>Tham gia E-XANH để sống xanh hơn mỗi ngày</>}
            description="Một tài khoản E-XANH giúp bạn lưu bài viết, tham gia cộng đồng và theo dõi thói quen sử dụng điện cá nhân một cách gọn gàng, sáng rõ và dễ quay lại."
            highlights={['Lưu bài viết', 'Bình luận & chia sẻ', 'Theo dõi điện năng']}
            banners={banners}
          />
        )}
        form={(
          <section className="auth-form-panel auth-card">
            <div className="auth-form-panel__header auth-card__header">
              <h2>Chào mừng trở lại</h2>
              <p>Đăng nhập để tiếp tục hành trình sống xanh cùng E-XANH.</p>
            </div>

            <AuthModeSwitch active="login" />

            {errorMessage ? <div className="auth-card__message auth-card__message--error" role="alert" data-testid="login-error">{errorMessage}</div> : null}
            {successMessage ? <div className="auth-card__message auth-card__message--success">{successMessage}</div> : null}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="login-email">
                <span>Email</span>
                <input
                  id="login-email"
                  className="auth-input"
                  type="email"
                  value={form.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  placeholder="Nhập email của bạn"
                  autoComplete="email"
                />
              </label>

              <label htmlFor="login-password">
                <span>Mật khẩu</span>
                <input
                  id="login-password"
                  className="auth-input"
                  type="password"
                  value={form.password}
                  onChange={(event) => handleChange('password', event.target.value)}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
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

                <Link to="/quen-mat-khau" className="auth-form__text-link">
                  Quên mật khẩu?
                </Link>
              </div>

              {!isCaptchaDisabled ? (
                <div className="auth-form__captcha">
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
              ) : null}

              <button type="submit" className="btn btn--primary auth-form__submit auth-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>

            <p className="auth-card__alternate">
              Chưa có tài khoản? <Link to="/dang-ky">Tạo tài khoản ngay</Link>
            </p>

            <div className="auth-card__divider" />

            <div className="auth-card__socials auth-card__socials--single">
              <AuthGoogleButton
                onClick={async () => {
                  const { signInWithGoogle } = await import('../../services/authService')
                  signInWithGoogle()
                }}
              />
            </div>

            <div className="auth-security-note auth-note">
              <strong>Bảo mật thông tin</strong>
              <p>
                Khách chưa đăng nhập vẫn có thể xem bài viết và tính tiền điện. Đăng nhập giúp bạn lưu lại dữ liệu cá nhân hóa.
              </p>
            </div>
          </section>
        )}
      />
    </>
  )
}

export default LoginPage
