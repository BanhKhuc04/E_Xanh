import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const topbarMeta = {
  '/admin': {
    eyebrow: 'Bảng điều khiển',
    title: 'Tổng quan quản trị',
    description: 'Theo dõi hoạt động và nội dung mới nhất trên E-XANH.',
  },
  '/admin/duyet-bai-viet': {
    eyebrow: 'Kiểm duyệt nội dung',
    title: 'Duyệt bài viết',
    description: 'Xem nhanh những bài viết đang chờ duyệt và ưu tiên xử lý.',
  },
  '/admin/quan-ly-binh-luan': {
    eyebrow: 'Thảo luận cộng đồng',
    title: 'Quản lý bình luận',
    description: 'Theo dõi bình luận mới, bình luận cần xem và phản hồi nổi bật.',
  },
  '/admin/quan-ly-nguoi-dung': {
    eyebrow: 'Hồ sơ thành viên',
    title: 'Quản lý người dùng',
    description: 'Nắm bắt mức độ hoạt động và hỗ trợ các tài khoản trong hệ thống.',
  },
  '/admin/quan-ly-thiet-bi': {
    eyebrow: 'Dữ liệu thiết bị',
    title: 'Quản lý thiết bị điện',
    description: 'Cập nhật danh mục thiết bị và công suất tham chiếu cho công cụ tính điện.',
  },
  '/admin/thong-ke': {
    eyebrow: 'Phân tích hệ thống',
    title: 'Thống kê',
    description: 'Tổng hợp xu hướng sử dụng, nội dung được quan tâm và tăng trưởng cộng đồng.',
  },
  '/admin/cai-dat': {
    eyebrow: 'Cấu hình nền tảng',
    title: 'Cài đặt',
    description: 'Điều chỉnh các thiết lập quản trị để vận hành E-XANH ổn định hơn.',
  },
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12ZM19 19l-3.5-3.5" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 19a3 3 0 0 0 6 0M6 16h12l-1.5-2.5V10a4.5 4.5 0 1 0-9 0v3.5L6 16Z" />
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9.5 9a2.5 2.5 0 1 1 4 2c-.8.6-1.5 1.2-1.5 2.5M12 17h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
    </svg>
  )
}

function AdminTopbar() {
  const location = useLocation()
  const meta = topbarMeta[location.pathname] ?? topbarMeta['/admin']

  const [adminName, setAdminName] = useState('Admin E-XANH')
  const [adminInitials, setAdminInitials] = useState('AD')
  const [adminRole, setAdminRole] = useState('Quản trị hệ thống')

  useEffect(() => {
    async function loadAdmin() {
      const { getCurrentSession, getCurrentUserProfile } = await import('../../../services/authService')
      const session = await getCurrentSession()
      if (session?.user) {
        const profile = await getCurrentUserProfile(session.user.id)
        if (profile) {
          const name = profile.name || session.user.email || 'Admin E-XANH'
          setAdminName(name)
          setAdminInitials(name.slice(0, 2).toUpperCase())
          setAdminRole(profile.role === 'admin' ? 'Quản trị viên' : 'Điều hành viên')
        }
      }
    }
    loadAdmin()
  }, [])

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__summary">
        <p className="admin-topbar__eyebrow">{meta.eyebrow}</p>
        <h1>{meta.title}</h1>
        <span>{meta.description}</span>
      </div>

      <div className="admin-topbar__actions">
        <label className="admin-topbar__search">
          <span className="admin-topbar__search-icon">
            <SearchIcon />
          </span>
          <input type="text" placeholder="Tìm kiếm trong quản trị..." />
        </label>

        <button type="button" className="admin-topbar__icon-button" aria-label="Thông báo">
          <BellIcon />
          <span className="admin-topbar__dot" aria-hidden="true"></span>
        </button>

        <button type="button" className="admin-topbar__icon-button" aria-label="Trợ giúp">
          <HelpIcon />
        </button>

        <div className="admin-topbar__profile">
          <span className="admin-topbar__avatar">{adminInitials}</span>
          <div>
            <strong>{adminName}</strong>
            <small>{adminRole}</small>
          </div>
          <button 
            type="button" 
            onClick={async () => {
              const { signOut } = await import('../../../services/authService')
              await signOut()
              window.location.href = '/dang-nhap'
            }}
            style={{ marginLeft: '16px', background: 'transparent', border: '1px solid #ddd', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  )
}

export default AdminTopbar
