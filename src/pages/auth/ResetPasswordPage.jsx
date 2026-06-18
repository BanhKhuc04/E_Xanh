import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import BannerCarousel from '../../components/common/BannerCarousel'
import BrandLogo from '../../components/common/BrandLogo'
import { supabase } from '../../lib/supabase'
import { fetchBanners } from '../../services/bannerService'
import {
  EMAIL_PATTERN,
  PASSWORD_PATTERN,
  clearPasswordResetContext,
  getAuthCallbackParams,
  getPasswordResetContext,
  hasPasswordRecoveryParams,
  onAuthStateChange,
  requestPasswordReset,
  signOut,
  stripAuthParamsFromUrl,
  updateCurrentUserPassword,
} from '../../services/authService'
import '../../styles/auth.css'

const RESEND_COOLDOWN_SECONDS = 60
const SUCCESS_REDIRECT_DELAY_MS = 1400

function getRedirectTarget(context, sessionEmail = '') {
  if (
    context?.source === 'settings' &&
    context?.email &&
    sessionEmail &&
    context.email === sessionEmail.trim().toLowerCase()
  ) {
    return '/tai-khoan/cai-dat'
  }

  return '/dang-nhap'
}

function ResetPasswordPage() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`
  const [context] = useState(() => getPasswordResetContext())

  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  })
  const [fieldErrors, setFieldErrors] = useState({
    password: '',
    confirmPassword: '',
    email: '',
  })
  const [toast, setToast] = useState(null)
  const [banners, setBanners] = useState([])
  const [isCheckingRecovery, setIsCheckingRecovery] = useState(true)
  const [isRecoveryReady, setIsRecoveryReady] = useState(false)
  const [recoveryError, setRecoveryError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const [resetEmail, setResetEmail] = useState(() => context?.email || '')
  const [redirectTarget, setRedirectTarget] = useState(() =>
    context?.source === 'settings' ? '/tai-khoan/cai-dat' : '/dang-nhap',
  )

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

  useEffect(() => {
    let isMounted = true

    const markRecoveryReady = (session) => {
      if (!isMounted || !session?.user) return

      const sessionEmail = session.user.email?.trim().toLowerCase() || ''
      setResetEmail(sessionEmail || context?.email || '')
      setRedirectTarget(getRedirectTarget(context, sessionEmail))
      setRecoveryError('')
      setIsRecoveryReady(true)
      setIsCheckingRecovery(false)
      stripAuthParamsFromUrl()
    }

    const markRecoveryInvalid = () => {
      if (!isMounted) return

      setRecoveryError('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.')
      setIsRecoveryReady(false)
      setIsCheckingRecovery(false)
      stripAuthParamsFromUrl()
    }

    const subscription = onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        markRecoveryReady(session)
      }
    })

    async function resolveRecoverySession() {
      const params = getAuthCallbackParams()
      const hasRecoveryParamsInUrl = hasPasswordRecoveryParams()
      const hasCallbackError = Boolean(
        params.get('error') || params.get('error_code') || params.get('error_description'),
      )

      if (hasCallbackError) {
        markRecoveryInvalid()
        return
      }

      const { data, error } = await supabase.auth.getSession()
      if (!isMounted) return

      if (error) {
        markRecoveryInvalid()
        return
      }

      if (data?.session?.user && hasRecoveryParamsInUrl) {
        markRecoveryReady(data.session)
        return
      }

      if (!hasRecoveryParamsInUrl) {
        markRecoveryInvalid()
        return
      }

      window.setTimeout(async () => {
        if (!isMounted) return

        const { data: retriedData, error: retryError } = await supabase.auth.getSession()
        if (!isMounted) return

        if (retryError || !retriedData?.session?.user) {
          markRecoveryInvalid()
          return
        }

        markRecoveryReady(retriedData.session)
      }, 500)
    }

    resolveRecoverySession()

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [context])

  function showToast(message, tone = 'success') {
    setToast({ message, tone })
  }

  function validatePasswordForm() {
    const nextErrors = {
      password: '',
      confirmPassword: '',
      email: '',
    }

    if (!form.password) {
      nextErrors.password = 'Vui lòng nhập mật khẩu mới.'
    } else if (!PASSWORD_PATTERN.test(form.password)) {
      nextErrors.password = 'Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số.'
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới.'
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Mật khẩu xác nhận chưa khớp.'
    }

    setFieldErrors((current) => ({
      ...current,
      password: nextErrors.password,
      confirmPassword: nextErrors.confirmPassword,
    }))

    return !nextErrors.password && !nextErrors.confirmPassword
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!validatePasswordForm()) return

    setIsSubmitting(true)

    const { error } = await updateCurrentUserPassword(form.password)

    if (error) {
      showToast(error.message || 'Không thể cập nhật mật khẩu lúc này.', 'error')
      setIsSubmitting(false)
      return
    }

    clearPasswordResetContext()
    showToast('Mật khẩu đã được cập nhật thành công.', 'success')
    setIsSubmitting(false)

    window.setTimeout(async () => {
      if (redirectTarget === '/dang-nhap') {
        await signOut()
        navigate('/dang-nhap', {
          replace: true,
          state: { message: 'Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.' },
        })
        return
      }

      navigate('/tai-khoan/cai-dat', {
        replace: true,
        state: { message: 'Mật khẩu đã được cập nhật thành công.' },
      })
    }, SUCCESS_REDIRECT_DELAY_MS)
  }

  async function handleResendEmail() {
    const normalizedEmail = resetEmail.trim().toLowerCase()

    if (!normalizedEmail) {
      setFieldErrors((current) => ({
        ...current,
        email: 'Vui lòng nhập email để gửi lại liên kết.',
      }))
      return
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setFieldErrors((current) => ({
        ...current,
        email: 'Email không đúng định dạng.',
      }))
      return
    }

    setFieldErrors((current) => ({
      ...current,
      email: '',
    }))
    setIsResending(true)

    const { error } = await requestPasswordReset(normalizedEmail, {
      source: context?.source === 'settings' ? 'settings' : 'forgot-password',
    })

    if (error) {
      showToast('Không thể gửi lại email đặt lại mật khẩu lúc này. Vui lòng thử lại sau.', 'error')
      setIsResending(false)
      return
    }

    showToast('Đã gửi lại email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.', 'success')
    setCooldownRemaining(RESEND_COOLDOWN_SECONDS)
    setIsResending(false)
  }

  return (
    <>
      <Helmet>
        <title>Đặt lại mật khẩu - E-XANH</title>
        <meta
          name="description"
          content="Cập nhật mật khẩu mới cho tài khoản E-XANH sau khi xác minh bằng liên kết email."
        />
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
                <span className="auth-visual__chip">Bảo mật tài khoản</span>
              </div>

              <div className="auth-visual__content">
                <h1>
                  Tạo lại mật khẩu mới<br />
                  để tiếp tục trải nghiệm<br />
                  E-XANH an toàn
                </h1>
                <p>
                  Liên kết email chỉ dùng trong thời gian ngắn. Sau khi cập nhật thành công,
                  bạn sẽ được chuyển về đúng luồng đăng nhập hoặc cài đặt tài khoản.
                </p>
                <div className="auth-visual__inline-features">
                  <span>Tối thiểu 8 ký tự</span>
                  <span className="dot">•</span>
                  <span>Có chữ hoa, chữ thường, số</span>
                  <span className="dot">•</span>
                  <span>Không để màn trắng khi link lỗi</span>
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
              <h2>Đặt lại mật khẩu</h2>
              <p>
                Chọn một mật khẩu mới đủ mạnh để bảo vệ tài khoản E-XANH của bạn.
              </p>
            </div>

            {toast ? (
              <div className={`auth-card__toast auth-card__toast--${toast.tone || 'success'}`} role="status" aria-live="polite">
                {toast.message}
              </div>
            ) : null}

            {isCheckingRecovery ? (
              <div className="auth-recovery-state auth-recovery-state--loading" role="status" aria-live="polite">
                <div className="page-loader__spinner" style={{ margin: 0 }}></div>
                <div>
                  <strong>Đang xác minh liên kết đặt lại mật khẩu...</strong>
                  <p>Vui lòng đợi trong giây lát để E-XANH kiểm tra phiên khôi phục của bạn.</p>
                </div>
              </div>
            ) : null}

            {!isCheckingRecovery && !isRecoveryReady ? (
              <div className="auth-recovery-state auth-recovery-state--error" role="alert">
                <div>
                  <strong>{recoveryError}</strong>
                  <p>Bạn có thể yêu cầu một liên kết mới ngay tại đây mà không cần quay lại màn hình đăng nhập.</p>
                </div>

                <label htmlFor="reset-resend-email">
                  <span>Email</span>
                  <input
                    id="reset-resend-email"
                    type="email"
                    value={resetEmail}
                    onChange={(event) => {
                      setResetEmail(event.target.value)
                      setFieldErrors((current) => ({
                        ...current,
                        email: '',
                      }))
                    }}
                    placeholder="Nhập email để gửi lại liên kết"
                    autoComplete="email"
                  />
                  {fieldErrors.email ? <em className="auth-field__error">{fieldErrors.email}</em> : null}
                </label>

                <button
                  type="button"
                  className="btn btn--primary auth-form__submit"
                  disabled={isResending || cooldownRemaining > 0}
                  onClick={handleResendEmail}
                >
                  {isResending
                    ? 'Đang gửi email...'
                    : cooldownRemaining > 0
                      ? `Gửi lại sau ${cooldownRemaining}s`
                      : 'Gửi lại email đặt lại mật khẩu'}
                </button>

                <Link to="/dang-nhap" className="auth-form__text-link">
                  Quay lại đăng nhập
                </Link>
              </div>
            ) : null}

            {!isCheckingRecovery && isRecoveryReady ? (
              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <label htmlFor="reset-password">
                  <span>Mật khẩu mới</span>
                  <input
                    id="reset-password"
                    type="password"
                    value={form.password}
                    onChange={(event) => {
                      const nextValue = event.target.value
                      setForm((current) => ({
                        ...current,
                        password: nextValue,
                      }))
                      setFieldErrors((current) => ({
                        ...current,
                        password: '',
                      }))
                    }}
                    placeholder="Nhập mật khẩu mới"
                    autoComplete="new-password"
                  />
                  <small className="auth-field__hint">Ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số.</small>
                  {fieldErrors.password ? <em className="auth-field__error">{fieldErrors.password}</em> : null}
                </label>

                <label htmlFor="reset-password-confirm">
                  <span>Xác nhận mật khẩu mới</span>
                  <input
                    id="reset-password-confirm"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(event) => {
                      const nextValue = event.target.value
                      setForm((current) => ({
                        ...current,
                        confirmPassword: nextValue,
                      }))
                      setFieldErrors((current) => ({
                        ...current,
                        confirmPassword: '',
                      }))
                    }}
                    placeholder="Nhập lại mật khẩu mới"
                    autoComplete="new-password"
                  />
                  {fieldErrors.confirmPassword ? <em className="auth-field__error">{fieldErrors.confirmPassword}</em> : null}
                </label>

                <button type="submit" className="btn btn--primary auth-form__submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang cập nhật mật khẩu...' : 'Cập nhật mật khẩu'}
                </button>
              </form>
            ) : null}

            <p className="auth-card__alternate">
              Muốn đăng nhập lại ngay? <Link to="/dang-nhap">Về trang đăng nhập</Link>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}

export default ResetPasswordPage
