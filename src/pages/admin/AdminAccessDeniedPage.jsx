import { Link, useNavigate } from 'react-router-dom'
import { signOut } from '../../services/authService'

function AdminAccessDeniedPage() {
  const navigate = useNavigate()

  const handleLogoutAndSwitch = async () => {
    await signOut()
    navigate('/admin/dang-nhap')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f9fc', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '480px', width: '100%', padding: '40px', background: 'white', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '16px', color: '#d32f2f' }}>Từ chối truy cập</h1>
        <p style={{ color: '#444', fontSize: '16px', lineHeight: '1.5', marginBottom: '32px' }}>
          Tài khoản của bạn không có quyền vào khu vực quản trị. Vui lòng đăng nhập bằng tài khoản có quyền admin hoặc moderator.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/" className="btn btn--primary" style={{ padding: '12px', borderRadius: '6px', textDecoration: 'none', background: '#4f8428', color: 'white', fontWeight: 600 }}>
            Quay về trang chủ
          </Link>
          <button 
            type="button" 
            onClick={handleLogoutAndSwitch}
            style={{ padding: '12px', borderRadius: '6px', background: 'transparent', border: '1px solid #ddd', color: '#444', fontWeight: 600, cursor: 'pointer', fontSize: '15px' }}
          >
            Đăng nhập bằng tài khoản admin khác
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminAccessDeniedPage
