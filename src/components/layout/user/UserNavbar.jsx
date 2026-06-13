import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import BrandLogo from '../../common/BrandLogo'
import { userNavLinks } from '../../../data/navigation'
import {
  getCurrentSession,
  getCurrentUserProfile,
  onAuthStateChange,
  signOut,
} from '../../../services/authService'

function getShortName(name, email) {
  if (name) {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0]
    return `${parts[parts.length - 2]} ${parts[parts.length - 1]}`
  }
  if (email) {
    return email.split('@')[0]
  }
  return 'Người dùng'
}

function getAvatar(name, email, avatarUrl) {
  if (avatarUrl) return avatarUrl // Can be handled as img if we support it later

  if (name) {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  if (email) return email.slice(0, 2).toUpperCase()
  return 'EX'
}

function UserNavbar() {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadUser(session) {
      if (!session?.user) {
        if (isMounted) setCurrentUser(null)
        return
      }
      const profile = await getCurrentUserProfile(session.user.id)
      if (isMounted) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          name: profile?.name,
          avatar: getAvatar(profile?.name, session.user.email, profile?.avatar_url),
          role: profile?.role || 'user',
        })
      }
    }

    async function initAuth() {
      const session = await getCurrentSession()
      loadUser(session)
    }

    initAuth()

    const subscription = onAuthStateChange((event, session) => {
      loadUser(session)
    })

    return () => {
      isMounted = false
      subscription?.unsubscribe?.()
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  async function handleLogout() {
    await signOut()
    setIsOpen(false)
    navigate('/')
  }


  return (
    <header className="user-navbar">
      <div className="shell shell--wide user-navbar__inner">
        <BrandLogo to="/" size="medium" />

        {/* Mobile Menu Toggle Button */}
        <button 
          className="user-navbar__mobile-toggle"
          aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
          data-testid="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
            {isMobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <nav className={`user-navbar__links ${isMobileMenuOpen ? 'is-mobile-open' : ''}`} aria-label="Điều hướng người dùng">
          {userNavLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `user-navbar__link${isActive ? ' is-active' : ''}`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={`user-navbar__actions ${isMobileMenuOpen ? 'is-mobile-open' : ''}`}>
          {currentUser ? (
            <div ref={dropdownRef} className="user-navbar__user-menu">
              <button
                type="button"
                className="user-navbar__user-trigger"
                onClick={() => setIsOpen((current) => !current)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-label="Mở menu tài khoản"
              >
                <span className="user-navbar__avatar">{currentUser.avatar}</span>
                <span className="user-navbar__user-name">{getShortName(currentUser.name, currentUser.email)}</span>
              </button>

              {isOpen ? (
                <div className="user-navbar__dropdown" role="menu" aria-label="Menu tài khoản">
                  <Link
                    to="/tai-khoan"
                    className="user-navbar__dropdown-link"
                    onClick={() => { setIsOpen(false); setIsMobileMenuOpen(false); }}
                  >
                    Tài khoản của tôi
                  </Link>
                  <Link
                    to="/bai-da-luu"
                    className="user-navbar__dropdown-link"
                    onClick={() => { setIsOpen(false); setIsMobileMenuOpen(false); }}
                  >
                    Bài viết đã lưu
                  </Link>
                  <Link
                    to="/lich-su-kiem-tra"
                    className="user-navbar__dropdown-link"
                    onClick={() => { setIsOpen(false); setIsMobileMenuOpen(false); }}
                  >
                    Lịch sử kiểm tra
                  </Link>
                  <button
                    type="button"
                    className="user-navbar__dropdown-link user-navbar__dropdown-link--logout"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link to="/dang-nhap" className="btn btn--ghost user-navbar__login" onClick={() => setIsMobileMenuOpen(false)}>
              Đăng nhập
            </Link>
          )}

          <Link to="/dang-bai" className="btn btn--primary user-navbar__publish" onClick={() => setIsMobileMenuOpen(false)}>
            Đăng bài
          </Link>
        </div>
      </div>
    </header>
  )
}

export default UserNavbar
