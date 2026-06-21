import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import BrandLogo from '../../components/common/BrandLogo'

function UserRoute() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const location = useLocation()

  useEffect(() => {
    let isMounted = true

    async function checkAuth() {
      try {
        const { getCurrentSession, ensureActiveProfileSession } = await import('../../services/authService')
        const session = await getCurrentSession()
        
        if (!session?.user) {
          if (isMounted) {
            setUser(null)
            setLoading(false)
          }
          return
        }

        const { allowed } = await ensureActiveProfileSession(session.user.id)
        if (isMounted) {
          if (allowed) {
            setUser(session.user)
          } else {
            setUser(null)
            // State message can be passed via navigate, but here we just sign out
          }
          setLoading(false)
        }
      } catch (err) {
        console.error("UserRoute error:", err)
        if (isMounted) setLoading(false)
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <BrandLogo to="/" size="large" />
        <h2 style={{ marginTop: '24px', color: '#666', fontSize: '1.2rem', fontWeight: 500 }}>Đang kiểm tra thông tin...</h2>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/dang-nhap" state={{ from: location.pathname, message: 'Vui lòng đăng nhập để xem trang này.' }} replace />
  }

  return <Outlet />
}

export default UserRoute
