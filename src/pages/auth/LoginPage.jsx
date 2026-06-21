import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import SEO from '../../components/SEO'
import { EMAIL_PATTERN, signInWithEmail, ensureActiveProfileSession, logAdminLogin } from '../../services/authService'
import { fetchBanners } from '../../services/bannerService'
import { supabase } from '../../lib/supabase'
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
  const [isLoadingBanners, setIsLoadingBanners] = useState(true)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mfaRequired, setMfaRequired] = useState(false)
  const [mfaCode, setMfaCode] = useState('')
  const [mfaFactorId, setMfaFactorId] = useState(null)
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
  const isCaptchaDisabled = import.meta.env.VITE_DISABLE_CAPTCHA === 'true'

  useEffect(() => {
    async function load() {
      const { data } = await fetchBanners('auth', true)
      if (data) setBanners(data)
      setIsLoadingBanners(false)
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

    if (!isCaptchaDisabled) {
      if (!turnstileToken) {
        setSuccessMessage('')
        setErrorMessage('Vui lòng xác minh bạn là người.')
        return
      }

      const verifyUrl = import.meta.env.VITE_CAPTCHA_VERIFY_URL
      if (!verifyUrl) {
        setSuccessMessage('')
        setErrorMessage('Hệ thống thiếu API/Edge Function để verify CAPTCHA. Vui lòng bổ sung VITE_CAPTCHA_VERIFY_URL hoặc set VITE_DISABLE_CAPTCHA=true.')
        return
      }

      setIsSubmitting(true)

      try {
        const verifyRes = await fetch(verifyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: turnstileToken }),
        })
        const verifyData = await verifyRes.json()
        if (!verifyData.success) {
          setErrorMessage('Xác minh CAPTCHA thất bại. Vui lòng thử lại.')
          setIsSubmitting(false)
          return
        }
      } catch (err) {
        console.error('Lỗi verify CAPTCHA:', err)
        setErrorMessage('Lỗi kết nối khi xác minh CAPTCHA.')
        setIsSubmitting(false)
        return
      }
    } else {
      setIsSubmitting(true)
    }

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

    if (data?.user) {
      const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (!mfaError && mfaData?.nextLevel === 'aal2' && mfaData?.currentLevel === 'aal1') {
        const { data: factorsData } = await supabase.auth.mfa.listFactors()
        const totpFactor = factorsData?.totp?.find(f => f.status === 'verified')
        if (totpFactor) {
          setMfaFactorId(totpFactor.id)
          setMfaRequired(true)
          setIsSubmitting(false)
          setErrorMessage('')
          return
        }
      }

      await completeLogin(data.user)
    } else {
      setIsSubmitting(false)
    }
  }

  async function completeLogin(user) {
    let role = 'user'
    try {
      const { profile, allowed, message } = await ensureActiveProfileSession(user.id)
      if (profile && profile.role) {
        role = profile.role
      }

      if (!allowed) {
        if (role === 'admin' || role === 'moderator') {
          await logAdminLogin(user.id, false)
        }
        setErrorMessage(message)
        setIsSubmitting(false)
        return
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin profile:', err)
    }

    if (role === 'admin' || role === 'moderator') {
      await logAdminLogin(user.id, true)
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

  async function handleVerifyMfa(event) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    if (!mfaCode || mfaCode.length < 6) {
      setErrorMessage('Vui lòng nhập mã 6 số.')
      return
    }

    setIsSubmitting(true)
    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: mfaFactorId,
    })

    if (challengeError) {
      setErrorMessage('Lỗi tạo challenge: ' + challengeError.message)
      setIsSubmitting(false)
      return
    }

    const { error } = await supabase.auth.mfa.verify({
      factorId: mfaFactorId,
      challengeId: challengeData.id,
      code: mfaCode,
    })

    if (error) {
      setErrorMessage('Mã 2FA không chính xác.')
      setIsSubmitting(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await completeLogin(user)
    } else {
      setErrorMessage('Lỗi xác thực người dùng.')
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SEO title="Đăng nhập" noIndex={true} />

      <AuthLayout
        hero={(
          <AuthHero
            badge="Cộng đồng sống xanh"
            title={<>Tham gia E-XANH để sống xanh hơn mỗi ngày</>}
            description="Một tài khoản E-XANH giúp bạn lưu bài viết, tham gia cộng đồng và theo dõi thói quen sử dụng điện cá nhân một cách gọn gàng, sáng rõ và dễ quay lại."
            highlights={['Lưu bài viết', 'Bình luận & chia sẻ', 'Theo dõi điện năng']}
            banners={banners}
            isLoadingBanners={isLoadingBanners}
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
            <h2 className="auth-box__title">{mfaRequired ? 'Xác minh 2 bước' : 'Đăng nhập vào tài khoản'}</h2>
            <p className="auth-box__subtitle">
              {mfaRequired 
                ? 'Nhập mã 6 số từ ứng dụng Authenticator của bạn để tiếp tục.' 
                : 'Chào mừng bạn quay trở lại với cộng đồng E-XANH.'}
            </p>

            {mfaRequired ? (
              <form className="auth-form" onSubmit={handleVerifyMfa} noValidate>
                <div className="auth-form__group">
                  <label htmlFor="mfaCode" className="auth-form__label">
                    Mã 2FA (6 số)
                  </label>
                  <input
                    type="text"
                    id="mfaCode"
                    name="mfaCode"
                    className="auth-form__input"
                    placeholder="Ví dụ: 123456"
                    value={mfaCode}
                    onChange={(e) => {
                      setMfaCode(e.target.value)
                      setErrorMessage('')
                    }}
                    disabled={isSubmitting}
                  />
                </div>
                {errorMessage && <div className="auth-form__error">{errorMessage}</div>}
                {successMessage && <div className="auth-form__success">{successMessage}</div>}

                <button
                  type="submit"
                  className={`btn btn--primary auth-form__submit ${isSubmitting ? 'btn--loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang xác minh...' : 'Xác minh'}
                </button>
                <button
                  type="button"
                  className="btn btn--outline"
                  style={{ width: '100%', marginTop: '8px' }}
                  onClick={() => {
                    setMfaRequired(false)
                    setMfaCode('')
                    setErrorMessage('')
                    supabase.auth.signOut()
                  }}
                  disabled={isSubmitting}
                >
                  Quay lại đăng nhập
                </button>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <div className="auth-form__group">
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
                </div>
              </form>
            )}

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
