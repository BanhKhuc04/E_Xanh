import { Link } from 'react-router-dom'

function AuthModeSwitch({ active = 'login' }) {
  return (
    <div className="auth-mode-switch" role="tablist" aria-label="Chuyển đổi đăng nhập và đăng ký">
      <Link
        to="/dang-nhap"
        className={`auth-mode-switch__btn${active === 'login' ? ' is-active' : ''}`}
        aria-current={active === 'login' ? 'page' : undefined}
      >
        Đăng nhập
      </Link>
      <Link
        to="/dang-ky"
        className={`auth-mode-switch__btn${active === 'register' ? ' is-active' : ''}`}
        aria-current={active === 'register' ? 'page' : undefined}
      >
        Đăng ký
      </Link>
    </div>
  )
}

export default AuthModeSwitch
