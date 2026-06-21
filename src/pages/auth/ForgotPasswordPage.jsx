import { useEffect, useState } from 'react'
import SEO from '../../components/SEO'
import { Link, useLocation } from 'react-router-dom'
import BannerCarousel from '../../components/common/BannerCarousel'
import BrandLogo from '../../components/common/BrandLogo'
import { fetchBanners } from '../../services/bannerService'
import { EMAIL_PATTERN, requestPasswordReset } from '../../services/authService'
import '../../styles/auth.css'

const RESEND_COOLDOWN_SECONDS = 60
const NEUTRAL_SUCCESS_MESSAGE = 'Nếu email này đã được đăng ký, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.'

function ForgotPasswordPage() {
  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [toast, setToast] = useState(null)
  const [banners, setBanners] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  useEffect(() => {
    async function load() {
      const { data } = await fetchBanners('auth', true)
      if (data) setBanners(data)
    }

    load()
  }, [])

  useEffect(() => {
    if (!toast) return undefined

    const timer = window.setTimeout(() => {
      setToast(null)
    }, 3600)

    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (cooldownRemaining <= 0) return undefined

    const timer = window.setInterval(() => {
      setCooldownRemaining((current) => (current <= 1 ? 0 : current - 1))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [cooldownRemaining])

  function showToast(message, tone = 'success') {
    setToast({ message, tone })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      setEmailError('Vui lòng nhập email.')
      return
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setEmailError('Email không đúng định dạng.')
      return
    }

    setEmailError('')
    setIsSubmitting(true)

    const { error } = await requestPasswordReset(normalizedEmail, {
      source: 'forgot-password',
    })

    if (error) {
      showToast('Không thể gửi email đặt lại mật khẩu lúc này. Vui lòng thử lại sau.', 'error')
      setIsSubmitting(false)
      return
    }

    showToast(NEUTRAL_SUCCESS_MESSAGE, 'success')
    setCooldownRemaining(RESEND_COOLDOWN_SECONDS)
    setIsSubmitting(false)
  }

  return (
    <>
      <SEO title="Quên mật khẩu" noIndex={true} />

      <div className="auth-page">
        <div className="auth-layout">
          <section className="auth-visual">
            <div className="auth-visual__main">
              <div className="auth-visual__top">
                <div className="auth-visual__brand" style={{ marginBottom: '8px' }}>
                  <BrandLogo to="/" size="auth" />
                </div>
                <span className="auth-visual__chip">Khôi phục tài khoản</span>
              </div>

              <div className="auth-visual__content">
                <h1>
                  Khôi phục quyền truy cập<br />
                  vào tài khoản E-XANH<br />
                  thật an toàn
                </h1>
                <p>
                  Nhập email bạn đã dùng để đăng ký. Nếu địa chỉ đó tồn tại trong hệ thống,
                  E-XANH sẽ gửi hướng dẫn đặt lại mật khẩu về hộp thư của bạn.
                </p>
                <div className="auth-visual__inline-features">
                  <span>Không lộ thông tin tài khoản</span>
                  <span className="dot">•</span>
                  <span>Liên kết có thời hạn</span>
                  <span className="dot">•</span>
                  <span>Điền lại trong vài phút</span>
                </div>
              </div>
            </div>

            <div className="auth-carousel-placeholder" style={{ padding: 0, overflow: 'hidden' }}>
              {banners.length > 0 ? (
                <BannerCarousel banners={banners} />
              ) : (
                <img src="/assets/images/auth-illustration.png" alt="Minh họa E-XANH" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
          </section>

          <section className="auth-card">
            <div className="auth-card__header">
              <h2>Quên mật khẩu</h2>
              <p>
                Chúng tôi sẽ gửi một liên kết đặt lại mật khẩu về email của bạn nếu tài khoản đã được đăng ký.
              </p>
            </div>

            {toast ? (
              <div className={`auth-card__toast auth-card__toast--${toast.tone || 'success'}`} role="status" aria-live="polite">
                {toast.message}
              </div>
            ) : null}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="forgot-password-email">
                <span>Email</span>
                <input
                  id="forgot-password-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setEmailError('')
                  }}
                  placeholder="Nhập email đã đăng ký"
                  autoComplete="email"
                />
                {emailError ? <em className="auth-field__error">{emailError}</em> : null}
              </label>

              <button
                type="submit"
                className="btn btn--primary auth-form__submit"
                disabled={isSubmitting || cooldownRemaining > 0}
              >
                {isSubmitting
                  ? 'Đang gửi email...'
                  : cooldownRemaining > 0
                    ? `Gửi lại sau ${cooldownRemaining}s`
                    : 'Gửi email đặt lại mật khẩu'}
              </button>
            </form>

            <p className="auth-card__alternate">
              Nhớ lại mật khẩu rồi? <Link to="/dang-nhap">Quay lại đăng nhập</Link>
            </p>

            <div className="auth-note auth-note--left">
              <strong>Vì sao thông báo trung tính?</strong>
              <p>
                E-XANH không xác nhận email có tồn tại hay không trên màn hình này để giảm nguy cơ dò quét tài khoản.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default ForgotPasswordPage
