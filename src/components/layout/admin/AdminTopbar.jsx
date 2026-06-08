import { useState, useEffect, useRef } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { getPendingPostsOverview } from '../../../services/adminStatsService'

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

function AdminTopbar() {
  const location = useLocation()
  const meta = topbarMeta[location.pathname] ?? topbarMeta['/admin']

  const [adminName, setAdminName] = useState('Admin E-XANH')
  const [adminInitials, setAdminInitials] = useState('AD')
  const [adminRole, setAdminRole] = useState('Quản trị hệ thống')

  const [showBellMenu, setShowBellMenu] = useState(false)
  const [showHelpMenu, setShowHelpMenu] = useState(false)
  
  const [pendingCount, setPendingCount] = useState(0)
  const [pendingPosts, setPendingPosts] = useState([])

  const bellRef = useRef(null)
  const helpRef = useRef(null)

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

  useEffect(() => {
    let isMounted = true
    async function loadPending() {
      const result = await getPendingPostsOverview()
      if (isMounted) {
        setPendingCount(result.count)
        setPendingPosts(result.posts)
      }
    }
    loadPending()
    return () => { isMounted = false }
  }, [location.pathname]) // Refresh pending posts when navigating

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

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__summary">
        <p className="admin-topbar__eyebrow">{meta.eyebrow}</p>
        <h1>{meta.title}</h1>
        <span>{meta.description}</span>
      </div>

      <div className="admin-topbar__actions" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Nút Chuông */}
        <div style={{ position: 'relative' }} ref={bellRef}>
          <button 
            type="button" 
            className="admin-topbar__icon-button" 
            aria-label="Thông báo"
            onClick={() => {
              setShowBellMenu(!showBellMenu)
              setShowHelpMenu(false)
            }}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', color: '#666' }}
          >
            <BellIcon />
            {pendingCount > 0 && (
              <span style={{ position: 'absolute', top: 4, right: 4, background: '#e53935', color: '#fff', fontSize: '10px', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pendingCount}
              </span>
            )}
          </button>
          
          {showBellMenu && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '320px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100, overflow: 'hidden', border: '1px solid #eee' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #eee', background: '#fafafa', fontWeight: 'bold' }}>
                Thông báo mới
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {pendingPosts.length > 0 ? (
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {pendingPosts.map(post => (
                      <li key={post.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f5f5f5' }}>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          Bài mới: {post.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          Bởi {post.profiles?.name || 'Ẩn danh'} - Đang chờ duyệt
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ padding: '32px 16px', textAlign: 'center', color: '#888', fontSize: '14px' }}>
                    Không có thông báo mới
                  </div>
                )}
              </div>
              {pendingCount > 0 && (
                <div style={{ padding: '12px', borderTop: '1px solid #eee', textAlign: 'center', background: '#fafafa' }}>
                  <Link 
                    to="/admin/quan-ly-bai-viet" 
                    style={{ fontSize: '13px', color: '#4f8428', fontWeight: 500, textDecoration: 'none' }}
                    onClick={() => setShowBellMenu(false)}
                  >
                    Xem tất cả ({pendingCount})
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nút Help */}
        <div style={{ position: 'relative' }} ref={helpRef}>
          <button 
            type="button" 
            className="admin-topbar__icon-button" 
            aria-label="Trợ giúp"
            onClick={() => {
              setShowHelpMenu(!showHelpMenu)
              setShowBellMenu(false)
            }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', color: '#666' }}
          >
            <HelpIcon />
          </button>
          
          {showHelpMenu && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '280px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100, border: '1px solid #eee' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #eee', background: '#fafafa', fontWeight: 'bold' }}>
                Trợ giúp nhanh
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: '12px 0', fontSize: '13px', color: '#555' }}>
                <li style={{ padding: '8px 16px' }}>• <strong>Dashboard:</strong> xem thống kê tổng quan.</li>
                <li style={{ padding: '8px 16px' }}>• <strong>Quản lý bài viết:</strong> duyệt, thêm, sửa bài.</li>
                <li style={{ padding: '8px 16px' }}>• <strong>Quản lý người dùng:</strong> chỉ Admin mới được cấp quyền.</li>
                <li style={{ padding: '8px 16px' }}>• <em>Lưu ý:</em> Sau khi đổi role, người dùng có thể cần đăng nhập lại để cập nhật quyền hạn.</li>
              </ul>
              <div style={{ padding: '12px', borderTop: '1px solid #eee', textAlign: 'center', background: '#fafafa' }}>
                <Link 
                  to="/admin/quan-ly-bai-viet" 
                  style={{ fontSize: '13px', color: '#4f8428', fontWeight: 500, textDecoration: 'none' }}
                  onClick={() => setShowHelpMenu(false)}
                >
                  Đi tới Quản lý bài viết
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="admin-topbar__profile" style={{ marginLeft: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="admin-topbar__avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#4f8428', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
            {adminInitials}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <strong style={{ fontSize: '14px', color: '#333' }}>{adminName}</strong>
            <small style={{ fontSize: '12px', color: '#888' }}>{adminRole}</small>
          </div>
          <button 
            type="button" 
            onClick={async () => {
              const { signOut } = await import('../../../services/authService')
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
