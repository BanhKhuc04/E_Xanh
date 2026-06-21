import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { getCurrentSession, getCurrentUserProfile, signOut } from '../../services/authService'
import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../../services/userNotificationService'

const topbarMeta = [
  {
    match: '/admin/cai-dat-giao-dien',
    eyebrow: 'Giao diện công khai',
    title: 'Cài đặt giao diện',
    description: 'Quản lý hero, banner và thông báo website hiển thị công khai ngoài E-XANH.',
  },
  {
    match: '/admin/thong-bao-he-thong',
    eyebrow: 'Thông báo nội bộ',
    title: 'Thông báo hệ thống',
    description: 'Gửi thông báo nội bộ tới người dùng và quản lý lịch sử gửi.',
  },
  {
    match: '/admin/quan-ly-bai-viet',
    eyebrow: 'Nội dung cộng đồng',
    title: 'Quản lý bài viết',
    description: 'Xem, duyệt và cập nhật trạng thái bài viết trong hệ thống E-XANH.',
  },
  {
    match: '/admin/quan-ly-binh-luan',
    eyebrow: 'Moderation',
    title: 'Quản lý bình luận',
    description: 'Theo dõi các bình luận cần xử lý, gửi cảnh báo và quản lý moderation.',
  },
  {
    match: '/admin/quan-ly-nguoi-dung',
    eyebrow: 'Thành viên nền tảng',
    title: 'Quản lý người dùng',
    description: 'Theo dõi trạng thái tài khoản, phân quyền và xử lý các trường hợp đặc biệt.',
  },
  {
    match: '/admin/quan-ly-thiet-bi',
    eyebrow: 'Dữ liệu thiết bị',
    title: 'Quản lý thiết bị điện',
    description: 'Quản lý danh mục thiết bị và dữ liệu hỗ trợ công cụ kiểm tra điện năng.',
  },
  {
    match: '/admin/thong-ke',
    eyebrow: 'Phân tích dữ liệu',
    title: 'Thống kê hệ thống',
    description: 'Theo dõi tăng trưởng cộng đồng, bài viết và tín hiệu vận hành quan trọng.',
  },
  {
    match: '/admin/cai-dat',
    eyebrow: 'Hạ tầng vận hành',
    title: 'Cài đặt hệ thống',
    description: 'Điều chỉnh thông tin nền tảng, bảo mật, notification và trạng thái dịch vụ.',
  },
  {
    match: '/admin',
    eyebrow: 'Bảng điều khiển',
    title: 'Tổng quan quản trị',
    description: 'Theo dõi hoạt động và nội dung mới nhất trên E-XANH.',
  },
]

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="currentColor">
      <path d="M9 19a3 3 0 0 0 6 0M6 16h12l-1.5-2.5V10a4.5 4.5 0 1 0-9 0v3.5L6 16Z" />
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9.5 9a2.5 2.5 0 1 1 4 2c-.8.6-1.5 1.2-1.5 2.5M12 17h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  )
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

function getMetaByPathname(pathname) {
  return topbarMeta.find((item) => pathname === item.match || pathname.startsWith(`${item.match}/`)) ?? topbarMeta[topbarMeta.length - 1]
}

function AdminTopbar() {
  const location = useLocation()
  const meta = useMemo(() => getMetaByPathname(location.pathname), [location.pathname])
  const [adminName, setAdminName] = useState('Admin E-XANH')
  const [adminInitials, setAdminInitials] = useState('AD')
  const [adminRole, setAdminRole] = useState('Quản trị hệ thống')
  const [showBellMenu, setShowBellMenu] = useState(false)
  const [showHelpMenu, setShowHelpMenu] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const [notificationError, setNotificationError] = useState('')
  const [notificationsSupported, setNotificationsSupported] = useState(true)

  const bellRef = useRef(null)
  const helpRef = useRef(null)

  useEffect(() => {
    async function loadAdmin() {
      const session = await getCurrentSession()
      if (!session?.user) return

      const profile = await getCurrentUserProfile(session.user.id)
      if (!profile) return

      const name = profile.name || session.user.email || 'Admin E-XANH'
      const roleLabel = profile.role === 'admin' ? 'Quản trị viên' : 'Điều hành viên'

      setAdminName(name)
      setAdminInitials(name.slice(0, 2).toUpperCase())
      setAdminRole(roleLabel)
    }

    loadAdmin()
  }, [])

  useEffect(() => {
    let cancelled = false
    let timerId
    let delay = 45000

    async function loadNotifications(isInitial = false) {
      if (isInitial) setLoadingNotifications(true)
      const { data, error } = await getMyNotifications({ limit: 8 })

      if (cancelled) return

      if (error) {
        setNotificationError(error.message || 'Không thể tải thông báo.')
        delay = Math.min(delay * 2, 300000)
      } else {
        setNotificationError('')
        delay = 45000
        setNotifications(data?.items ?? [])
        setUnreadCount(data?.unreadCount ?? 0)
        setNotificationsSupported(data?.supported ?? true)
      }

      if (isInitial) setLoadingNotifications(false)
      timerId = window.setTimeout(() => loadNotifications(false), delay)
    }

    loadNotifications(true)

    return () => {
      cancelled = true
      window.clearTimeout(timerId)
    }
  }, [location.pathname])

  useEffect(() => {
    function handleClickOutside(event) {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setShowBellMenu(false)
      }
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setShowHelpMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleReadNotification(notification) {
    if (notification?.id && !notification.is_read) {
      const { error } = await markNotificationAsRead(notification.id)
      if (!error) {
        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id ? { ...item, is_read: true } : item,
          ),
        )
        setUnreadCount((current) => Math.max(0, current - 1))
      }
    }

    if (notification?.action_url) {
      window.location.assign(notification.action_url)
    }
  }

  async function handleMarkAllRead() {
    const { error } = await markAllNotificationsAsRead()
    if (error) {
      setNotificationError(error.message || 'Không thể đánh dấu tất cả đã đọc.')
      return
    }

    setNotifications((current) => current.map((item) => ({ ...item, is_read: true })))
    setUnreadCount(0)
  }

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__summary">
        <p className="admin-topbar__eyebrow">{meta.eyebrow}</p>
        <h1>{meta.title}</h1>
        <span>{meta.description}</span>
      </div>

      <div className="admin-topbar__actions" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/" className="admin-topbar__website-link" aria-label="Xem website thường">
          <GlobeIcon />
          <span>Xem website</span>
        </Link>

        <div style={{ position: 'relative' }} ref={bellRef}>
          <button
            type="button"
            className="admin-topbar__icon-button"
            aria-label="Thông báo hệ thống"
            onClick={() => {
              setShowBellMenu((current) => !current)
              setShowHelpMenu(false)
            }}
          >
            <BellIcon />
            {unreadCount > 0 ? (
              <span className="admin-topbar__dot-badge">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            ) : null}
          </button>

          {showBellMenu ? (
            <div className="admin-topbar__dropdown">
              <div className="admin-topbar__dropdown-header">
                <div className="admin-topbar__dropdown-header-top">
                  <strong>Chuông thông báo</strong>
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
                <p>Thông báo nội bộ gửi tới tài khoản quản trị hiện tại.</p>
              </div>

              <div className="admin-topbar__dropdown-body">
                {loadingNotifications ? (
                  <div className="admin-topbar__dropdown-empty">Đang tải thông báo...</div>
                ) : !notificationsSupported ? (
                  <div className="admin-topbar__dropdown-empty">Schema notification center chưa sẵn sàng trên Supabase.</div>
                ) : notificationError ? (
                  <div className="admin-topbar__dropdown-empty">{notificationError}</div>
                ) : notifications.length === 0 ? (
                  <div className="admin-topbar__dropdown-empty">Chưa có thông báo nào.</div>
                ) : (
                  <div className="admin-topbar__notification-list">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        className={`admin-topbar__notification-item${notification.is_read ? '' : ' is-unread'}`}
                        onClick={() => handleReadNotification(notification)}
                      >
                        <div>
                          <strong>{notification.title}</strong>
                          <p>{notification.message}</p>
                        </div>
                        <span>{formatNotificationTime(notification.created_at)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div style={{ position: 'relative' }} ref={helpRef}>
          <button
            type="button"
            className="admin-topbar__icon-button"
            aria-label="Trợ giúp"
            onClick={() => {
              setShowHelpMenu((current) => !current)
              setShowBellMenu(false)
            }}
          >
            <HelpIcon />
          </button>

          {showHelpMenu ? (
            <div className="admin-topbar__dropdown admin-topbar__dropdown--compact">
              <div className="admin-topbar__dropdown-header">
                <div>
                  <strong>Trợ giúp nhanh</strong>
                  <p>Những việc quản trị nên kiểm tra trong ca làm việc hiện tại.</p>
                </div>
              </div>

              <ul className="admin-topbar__help-list">
                <li>Chuông thông báo ở đây lấy trực tiếp từ bảng `notifications` của Supabase.</li>
                <li>Trang Thông báo hệ thống chỉ hoạt động đầy đủ khi có cả `notifications` và `notification_batches`.</li>
                <li>Thông báo website ở Cài đặt giao diện là loại công khai, không đi vào chuông user/admin.</li>
              </ul>
            </div>
          ) : null}
        </div>

        <div className="admin-topbar__profile" style={{ marginLeft: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="admin-topbar__avatar">
            {adminInitials}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <strong style={{ fontSize: '14px', color: '#333' }}>{adminName}</strong>
            <small style={{ fontSize: '12px', color: '#888' }}>{adminRole}</small>
          </div>
          <button
            type="button"
            onClick={async () => {
              await signOut()
              window.location.href = '/dang-nhap'
            }}
            style={{ marginLeft: '16px', background: 'transparent', border: '1px solid #ddd', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', color: '#d32f2f', fontWeight: 500 }}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  )
}

export default AdminTopbar
