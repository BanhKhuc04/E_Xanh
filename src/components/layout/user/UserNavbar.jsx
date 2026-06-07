import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import BrandLogo from '../../common/BrandLogo'
import { userNavLinks } from '../../../data/navigation'
import {
  getAuthChangeEventName,
  getCurrentUser,
  logoutUser,
} from '../../../utils/authStorage'

function getShortName(name) {
  if (!name) {
    return 'Người dùng'
  }

  const parts = name.trim().split(/\s+/)

  if (parts.length === 1) {
    return parts[0]
  }

  return `${parts[parts.length - 2]} ${parts[parts.length - 1]}`
}

function UserNavbar() {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser())
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function syncUser() {
      setCurrentUser(getCurrentUser())
    }

    const authEventName = getAuthChangeEventName()

    window.addEventListener('storage', syncUser)
    window.addEventListener(authEventName, syncUser)

    return () => {
      window.removeEventListener('storage', syncUser)
      window.removeEventListener(authEventName, syncUser)
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

  function handleLogout() {
    logoutUser()
    setIsOpen(false)
    navigate('/')
  }

  return (
    <header className="user-navbar">
      <div className="shell shell--wide user-navbar__inner">
        <BrandLogo to="/" />

        <nav className="user-navbar__links" aria-label="Điều hướng người dùng">
          {userNavLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `user-navbar__link${isActive ? ' is-active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="user-navbar__actions">
          {currentUser ? (
            <div ref={dropdownRef} className="user-navbar__user-menu">
              <button
                type="button"
                className="user-navbar__user-trigger"
                onClick={() => setIsOpen((current) => !current)}
              >
                <span className="user-navbar__avatar">{currentUser.avatar ?? 'NA'}</span>
                <span className="user-navbar__user-name">{getShortName(currentUser.name)}</span>
              </button>

              {isOpen ? (
                <div className="user-navbar__dropdown">
                  <Link
                    to="/tai-khoan"
                    className="user-navbar__dropdown-link"
                    onClick={() => setIsOpen(false)}
                  >
                    Tài khoản của tôi
                  </Link>
                  <Link
                    to="/bai-da-luu"
                    className="user-navbar__dropdown-link"
                    onClick={() => setIsOpen(false)}
                  >
                    Bài viết đã lưu
                  </Link>
                  <Link
                    to="/lich-su-kiem-tra"
                    className="user-navbar__dropdown-link"
                    onClick={() => setIsOpen(false)}
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
            <Link to="/dang-nhap" className="btn btn--ghost user-navbar__login">
              Đăng nhập
            </Link>
          )}

          <Link to="/dang-bai" className="btn btn--primary user-navbar__publish">
            Đăng bài
          </Link>
        </div>
      </div>
    </header>
  )
}

export default UserNavbar
