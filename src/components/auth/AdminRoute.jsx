import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { getCurrentSession, getCurrentUserProfile } from '../../services/authService'
import BrandLogo from '../../components/common/BrandLogo'

function AdminRoute() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function checkAuth() {
      const session = await getCurrentSession()
      if (!session?.user) {
        if (isMounted) setLoading(false)
        return
      }

      if (isMounted) setUser(session.user)
      const profile = await getCurrentUserProfile(session.user.id)
      
      if (isMounted) {
        if (profile && (profile.role === 'admin' || profile.role === 'moderator')) {
          setIsAdmin(true)
        }
        setLoading(false)
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <BrandLogo to="/admin" size="large" />
        <h2 style={{ marginTop: '24px' }}>Đang kiểm tra quyền truy cập...</h2>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/dang-nhap" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/admin/khong-co-quyen" replace />
  }

  return <Outlet />
}

export default AdminRoute
