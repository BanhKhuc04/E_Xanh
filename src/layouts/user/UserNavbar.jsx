import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getInitials, isValidImageUrl } from '../../utils/avatar'
import { isStaff } from '../../utils/permissions'
import BrandLogo from '../../components/common/BrandLogo'
import { userNavLinks } from '../../data/navigation'
import { usePostComposer } from '../../components/community/PostComposerContext'
import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../../services/userNotificationService'
import { supabase } from '../../lib/supabase'
import ThemeToggle from '../../components/ui/ThemeToggle'


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

function formatNotificationTime(dateString) {
  if (!dateString) return 'Vừa xong'

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'Vừa xong'

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(date)
}

function UserNavbar() {
  const navigate = useNavigate()

  const { openComposer } = usePostComposer()
  const menuRootRef = useRef(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const [notificationsSupported, setNotificationsSupported] = useState(true)
  const [notificationError, setNotificationError] = useState('')
  const canAccessAdmin = isStaff(currentUser)

  useEffect(() => {
    let unsubscribe

    async function loadUser() {
      try {
        const { getCurrentSession, ensureActiveProfileSession } = await import('../../services/authService')
        const session = await getCurrentSession()
        if (session?.user) {
          const { profile, allowed } = await ensureActiveProfileSession(session.user.id)
          if (!allowed) {
            setCurrentUser(null)
            setNotifications([])
            setUnreadCount(0)
            navigate('/dang-nhap', { state: { message: 'Phiên đăng nhập đã được kết thúc do trạng thái tài khoản thay đổi.' } })
            return
          }
          setCurrentUser(profile || {
            id: session.user.id,
            email: session.user.email,
            name: session.user.email,
          })
        } else {
          setCurrentUser(null)
          setNotifications([])
          setUnreadCount(0)
        }
      } catch (error) {
        console.error('Lỗi tải user navbar:', error)
        setCurrentUser(null)
        setNotifications([])
        setUnreadCount(0)
      }
    }

    async function initAuth() {
      await loadUser()
      const { onAuthStateChange } = await import('../../services/authService')
      unsubscribe = onAuthStateChange((event) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          loadUser()
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null)
          setIsOpen(false)
          setIsNotificationOpen(false)
        }
      })
    }

    initAuth()

    const handleProfileUpdate = () => loadUser()
    window.addEventListener('profileUpdated', handleProfileUpdate)

    return () => {
      if (unsubscribe && typeof unsubscribe.unsubscribe === 'function') {
        unsubscribe.unsubscribe()
      }
      window.removeEventListener('profileUpdated', handleProfileUpdate)
    }
  }, [navigate])

  useEffect(() => {
    let timerId
    let delay = 45000
    let cancelled = false

    async function loadNotifications(isInitial = false) {
      if (!currentUser?.id) return
      if (isInitial) setIsLoadingNotifications(true)

      const { data, error } = await getMyNotifications({ limit: 8 })
      if (cancelled) return

      if (error) {
        console.error('[UserNavbar] Lỗi tải notifications:', error)
        setNotificationError(error.message || 'Không thể tải thông báo.')
        delay = Math.min(delay * 2, 300000) // backoff up to 5 mins
      } else {
        setNotificationError('')
        delay = 45000 // reset delay
        setNotifications(data?.items ?? [])
        setUnreadCount(data?.unreadCount ?? 0)
        setNotificationsSupported(data?.supported ?? true)
      }

      if (isInitial) setIsLoadingNotifications(false)
      timerId = window.setTimeout(() => loadNotifications(false), delay)
    }

    loadNotifications(true)

    // Setup Supabase Realtime for Notifications
    let channel = null
    if (currentUser?.id) {
      channel = supabase.channel('public:notifications')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${currentUser.id}` },
          (payload) => {
            // Play a small sound or just reload notifications
            loadNotifications(false)
          }
        )
        .subscribe()
    }

    return () => {
      cancelled = true
      window.clearTimeout(timerId)
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [currentUser?.id])

  useEffect(() => {
    function handleClickOutside(event) {
      if (!menuRootRef.current?.contains(event.target)) {
        setIsOpen(false)
        setIsNotificationOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  async function handleLogout() {
    const { signOut } = await import('../../services/authService')
    await signOut()
    setIsOpen(false)
    setIsNotificationOpen(false)
    setIsMobileMenuOpen(false)
    navigate('/')
  }

  async function handleReadNotification(notification) {
    if (!notification?.id || notification.is_read) {
      if (notification?.action_url) {
        navigate(notification.action_url)
        setIsNotificationOpen(false)
      }
      return
    }

    const { error } = await markNotificationAsRead(notification.id)
    if (error) {
      console.error('[UserNavbar] Lỗi mark notification read:', error)
      return
    }

    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id ? { ...item, is_read: true } : item,
      ),
    )
    setUnreadCount((current) => Math.max(0, current - 1))

    if (notification.action_url) {
      navigate(notification.action_url)
      setIsNotificationOpen(false)
    }
  }

  async function handleMarkAllRead() {
    const { error } = await markAllNotificationsAsRead()
    if (error) {
      console.error('[UserNavbar] Lỗi mark all read:', error)
      return
    }

    setNotifications((current) => current.map((item) => ({ ...item, is_read: true })))
    setUnreadCount(0)
  }

  return (
    <header className="user-navbar">
      <div className="shell shell--wide user-navbar__inner">
        <BrandLogo to="/" size="medium" />

        <button
          className="user-navbar__mobile-toggle"
          aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
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

          {canAccessAdmin ? (
            <Link
              to="/admin"
              className="btn btn--secondary user-navbar__staff-link"
              onClick={() => {
                setIsOpen(false)
                setIsNotificationOpen(false)
                setIsMobileMenuOpen(false)
              }}
            >
              Quản trị
            </Link>
          ) : null}

          {currentUser ? (
            <div ref={menuRootRef} className="user-navbar__menu-group">
              <div className="user-navbar__notification-menu">
                <button
                  type="button"
                  className="user-navbar__notification-trigger"
                  onClick={() => {
                    setIsNotificationOpen((current) => !current)
                    setIsOpen(false)
                  }}
                  aria-expanded={isNotificationOpen}
                  aria-haspopup="true"
                  aria-label="Mở thông báo hệ thống"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 4a4 4 0 0 0-4 4v2.6c0 .7-.24 1.38-.67 1.93L6 14h12l-1.33-1.47A3 3 0 0 1 16 10.6V8a4 4 0 0 0-4-4Z" />
                    <path d="M10 18a2 2 0 0 0 4 0" />
                  </svg>
                  {unreadCount > 0 ? (
                    <span className="user-navbar__notification-badge">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  ) : null}
                </button>

                {isNotificationOpen ? (
                  <div className="user-navbar__notification-dropdown" role="menu" aria-label="Thông báo hệ thống">
                    <div className="user-navbar__notification-header">
                      <div className="user-navbar__notification-header-top">
                        <strong>Thông báo</strong>
                        {notificationsSupported ? (
                          <button 
                            type="button" 
                            onClick={handleMarkAllRead}
                            disabled={unreadCount === 0}
                            style={{ opacity: unreadCount === 0 ? 0.4 : 1, cursor: unreadCount === 0 ? 'not-allowed' : 'pointer' }}
                          >
                            Đánh dấu đã đọc
                          </button>
                        ) : null}
                      </div>
                      <p>Thông báo quản trị và cập nhật hệ thống dành cho tài khoản của bạn.</p>
                    </div>

                    {isLoadingNotifications ? (
                      <div className="user-navbar__notification-empty">Đang tải thông báo...</div>
                    ) : !notificationsSupported ? (
                      <div className="user-navbar__notification-empty">
                        Notification Center chưa sẵn sàng trên Supabase. Hãy apply migration mới để kích hoạt bảng `notifications`.
                      </div>
                    ) : notificationError ? (
                      <div className="user-navbar__notification-empty">{notificationError}</div>
                    ) : notifications.length === 0 ? (
                      <div className="user-navbar__notification-empty">Chưa có thông báo nào.</div>
                    ) : (
                      <div className="user-navbar__notification-list">
                        {notifications.map((notification) => (
                          <button
                            key={notification.id}
                            type="button"
                            className={`user-navbar__notification-item${notification.is_read ? '' : ' is-unread'}`}
                            onClick={() => handleReadNotification(notification)}
                          >
                            <div className="user-navbar__notification-copy">
                              <strong>{notification.title || 'Thông báo hệ thống'}</strong>
                              <p>{notification.message}</p>
                            </div>
                            <span>{formatNotificationTime(notification.created_at)}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="user-navbar__user-menu">
                <button
                  type="button"
                  className="navbar-avatar-btn"
                  onClick={() => {
                    setIsOpen((current) => !current)
                    setIsNotificationOpen(false)
                  }}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  aria-label="Mở menu tài khoản"
                >
                  {isValidImageUrl(currentUser.avatar_url) ? (
                    <img loading="lazy" src={currentUser.avatar_url}
                      alt={`Avatar của ${getShortName(currentUser.name, currentUser.email)}`}
                      className="navbar-avatar-img"
                    />
                  ) : (
                    <span className="navbar-avatar-fallback">{getInitials(currentUser.name || currentUser.email)}</span>
                  )}
                  <span className="navbar-user__name">{getShortName(currentUser.name, currentUser.email)}</span>
                </button>

                {isOpen ? (
                  <div className="user-navbar__dropdown" role="menu" aria-label="Menu tài khoản">
                    <Link
                      to="/tai-khoan"
                      className="user-navbar__dropdown-link"
                      onClick={() => { setIsOpen(false); setIsMobileMenuOpen(false) }}
                    >
                      Tài khoản của tôi
                    </Link>
                    <Link
                      to="/tai-khoan/cai-dat"
                      className="user-navbar__dropdown-link"
                      onClick={() => { setIsOpen(false); setIsMobileMenuOpen(false) }}
                    >
                      Cài đặt tài khoản
                    </Link>
                    <Link
                      to="/bai-da-luu"
                      className="user-navbar__dropdown-link"
                      onClick={() => { setIsOpen(false); setIsMobileMenuOpen(false) }}
                    >
                      Bài viết đã lưu
                    </Link>
                    {canAccessAdmin ? (
                      <Link
                        to="/admin"
                        className="user-navbar__dropdown-link user-navbar__dropdown-link--admin"
                        onClick={() => { setIsOpen(false); setIsMobileMenuOpen(false) }}
                      >
                        Quản trị hệ thống
                      </Link>
                    ) : null}
                    <Link
                      to="/lich-su-kiem-tra"
                      className="user-navbar__dropdown-link"
                      onClick={() => { setIsOpen(false); setIsMobileMenuOpen(false) }}
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
            </div>
          ) : (
            <Link to="/dang-nhap" className="btn btn--ghost user-navbar__login" onClick={() => setIsMobileMenuOpen(false)}>
              Đăng nhập
            </Link>
          )}

          <ThemeToggle />

          <button
            type="button"
            className="btn btn--primary user-navbar__publish"
            onClick={async () => {
              setIsMobileMenuOpen(false)
              await openComposer({ defaultType: 'community' })
            }}
          >
            Đăng bài
          </button>
        </div>
      </div>
    </header>
  )
}

export default UserNavbar
