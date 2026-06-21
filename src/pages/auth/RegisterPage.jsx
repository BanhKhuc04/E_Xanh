import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import SEO from '../../components/SEO'
import { signUpWithEmail } from '../../services/authService'
import { fetchBanners } from '../../services/bannerService'
import AuthLayout from '../../components/auth/AuthLayout'
import AuthHero from '../../components/auth/AuthHero'
import AuthModeSwitch from '../../components/auth/AuthModeSwitch'
import AuthGoogleButton from '../../components/auth/AuthGoogleButton'
import Toast from '../../components/common/Toast'
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
  const [isLoadingBanners, setIsLoadingBanners] = useState(true)
  const [toast, setToast] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessMode, setIsSuccessMode] = useState(false)
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

    const { error } = await signUpWithEmail({
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
      setErrorMessage(viError)
      setIsSubmitting(false)
      return
    }

    setErrorMessage('')
    setIsSuccessMode(true)
    setIsSubmitting(false)
  }

  return (
    <>
      <SEO title="Đăng ký" noIndex={true} />

      <AuthLayout
        hero={(
          <AuthHero
            badge="Cộng đồng sống xanh"
            title={<>Tham gia E-XANH để sống xanh hơn mỗi ngày</>}
            description="Tạo tài khoản để lưu bài viết, đăng chia sẻ với cộng đồng và theo dõi các dấu mốc tiết kiệm điện của riêng bạn trong một không gian gọn và dễ dùng."
            highlights={['Lưu nội dung hữu ích', 'Đăng bài chia sẻ', 'Cá nhân hóa trải nghiệm']}
            banners={banners}
            isLoadingBanners={isLoadingBanners}
          />
        )}
        form={(
          <section className="auth-form-panel auth-card">
            {isSuccessMode ? (
              <div className="auth-success-state">
                <div className="auth-success-state__icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h2>Kiểm tra email của bạn</h2>
                <p>
                  E-XANH đã gửi email xác nhận đến <strong>{form.email}</strong>.<br /><br />
                  Vui lòng mở email và bấm nút xác nhận để kích hoạt tài khoản.
                </p>
                <button
                  type="button"
                  className="btn btn--primary auth-submit"
                  onClick={() => navigate('/dang-nhap')}
                >
                  Đã hiểu, chuyển sang đăng nhập
                </button>
                <button
                  type="button"
                  className="auth-form__text-button"
                  onClick={async () => {
                    try {
                      const { supabase } = await import('../../lib/supabase')
                      await supabase.auth.resend({ type: 'signup', email: form.email })
                      setToast('Đã gửi lại email xác nhận!')
                    } catch {
                      setToast('Lỗi gửi lại email. Vui lòng thử lại sau.')
                    }
                  }}
                >
                  Gửi lại email xác nhận
                </button>
              </div>
            ) : (
              <>
                <div className="auth-form-panel__header auth-card__header">
                  <h2>Tạo tài khoản E-XANH</h2>
                  <p>Đăng ký để lưu bài viết, bình luận, đăng bài chia sẻ và theo dõi lịch sử kiểm tra tiền điện.</p>
                </div>

                <AuthModeSwitch active="register" />

                {errorMessage ? <div className="auth-card__message auth-card__message--error" role="alert" data-testid="register-error">{errorMessage}</div> : null}
                {successMessage ? <div className="auth-card__message auth-card__message--success">{successMessage}</div> : null}

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                  <label htmlFor="register-name">
                    <span>Họ và tên</span>
                    <input
                      id="register-name"
                      className="auth-input"
                      type="text"
                      value={form.name}
                      onChange={(event) => handleChange('name', event.target.value)}
                      placeholder="Nhập họ và tên"
                      autoComplete="name"
                    />
                  </label>

                  <label htmlFor="register-email">
                    <span>Email</span>
                    <input
                      id="register-email"
                      className="auth-input"
                      type="email"
                      value={form.email}
                      onChange={(event) => handleChange('email', event.target.value)}
                      placeholder="Nhập email của bạn"
                      autoComplete="email"
                    />
                  </label>

                  <label htmlFor="register-password">
                    <span>Mật khẩu</span>
                    <input
                      id="register-password"
                      className="auth-input"
                      type="password"
                      value={form.password}
                      onChange={(event) => handleChange('password', event.target.value)}
                      placeholder="Tạo mật khẩu"
                      autoComplete="new-password"
                    />
                  </label>

                  <label htmlFor="register-confirm">
                    <span>Xác nhận mật khẩu</span>
                    <input
                      id="register-confirm"
                      className="auth-input"
                      type="password"
                      value={form.confirmPassword}
                      onChange={(event) => handleChange('confirmPassword', event.target.value)}
                      placeholder="Nhập lại mật khẩu"
                      autoComplete="new-password"
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
                        onClick={(event) => event.stopPropagation()}
                      >
                        điều khoản sử dụng
                      </Link>{' '}
                      của E-XANH
                    </span>
                  </label>

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
                    {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                  </button>
                </form>

                <p className="auth-card__alternate">
                  Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link>
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
                    E-XANH cam kết bảo vệ dữ liệu cá nhân của bạn. Thông tin được mã hóa an toàn và không chia sẻ cho bên thứ ba.
                  </p>
                </div>
              </>
            )}
          </section>
        )}
      />

      <Toast message={toast} onClose={() => setToast('')} />
    </>
  )
}

export default RegisterPage
