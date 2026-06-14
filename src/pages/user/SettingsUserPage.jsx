import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getCurrentSession, getCurrentUserProfile, signOut } from '../../services/authService'
import AccountSettingsCard from '../../components/account/AccountSettingsCard'
import EditProfileModal from '../../components/account/EditProfileModal'
import ChangePasswordModal from '../../components/account/ChangePasswordModal'
import '../../styles/account.css'

function getAvatar(name, email, avatarUrl) {
  if (avatarUrl) return avatarUrl
  if (name) {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  if (email) return email.split('@')[0].slice(0, 2).toUpperCase()
  return 'EX'
}

function SettingsUserPage() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`

  useEffect(() => {
    let isMounted = true

    async function loadUser() {
      const session = await getCurrentSession()
      if (!session?.user) {
        if (isMounted) navigate('/dang-nhap', { state: { from: pathname }, replace: true })
        return
      }
      const profile = await getCurrentUserProfile(session.user.id)
      if (isMounted) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          name: profile?.name || session.user.email.split('@')[0],
          avatar: getAvatar(profile?.name, session.user.email, profile?.avatar_url),
          avatar_url: profile?.avatar_url || '',
          role: profile?.role || 'user',
          bio: profile?.bio,
          created_at: profile?.created_at,
        })
        setLoading(false)
      }
    }

    loadUser()

    const handleProfileUpdate = () => loadUser()
    window.addEventListener('profileUpdated', handleProfileUpdate)

    return () => {
      isMounted = false
      window.removeEventListener('profileUpdated', handleProfileUpdate)
    }
  }, [navigate, pathname])

  if (loading) {
    return <div className="account-page"><div className="shell" style={{ padding: '40px 0', textAlign: 'center' }}>Đang tải...</div></div>
  }

  return (
    <>
      <Helmet>
        <title>Cài đặt tài khoản - E-XANH</title>
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="account-page">
        <div className="account-page__breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>{'>'}</span>
          <Link to="/tai-khoan">Tài khoản</Link>
          <span>{'>'}</span>
          <span>Cài đặt</span>
        </div>

        <div className="account-panel">
          <div className="account-panel__header">
            <h2>Thiết lập hồ sơ</h2>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn--primary" onClick={() => setIsEditModalOpen(true)}>
              Chỉnh sửa thông tin và Ảnh đại diện
            </button>
            <button type="button" className="btn btn--secondary" onClick={() => setIsPasswordModalOpen(true)}>
              Đổi mật khẩu
            </button>
          </div>
        </div>

        <div className="account-layout">
          <div className="account-layout__main" style={{ gridColumn: '1 / -1', maxWidth: '640px', width: '100%' }}>
            <AccountSettingsCard />
          </div>
        </div>

        {isEditModalOpen && (
          <EditProfileModal 
            user={currentUser} 
            onClose={() => setIsEditModalOpen(false)} 
            onSuccess={() => setIsEditModalOpen(false)} 
          />
        )}

        {isPasswordModalOpen && (
          <ChangePasswordModal 
            onClose={() => setIsPasswordModalOpen(false)} 
            onSuccess={() => {
              setIsPasswordModalOpen(false)
              alert('Đổi mật khẩu thành công!')
            }} 
          />
        )}
      </div>
    </>
  )
}

export default SettingsUserPage
