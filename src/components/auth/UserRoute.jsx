import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import BrandLogo from '../common/BrandLogo'

function UserRoute() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const location = useLocation()

  useEffect(() => {
    let isMounted = true

    async function checkAuth() {
      try {
        const { getCurrentSession } = await import('../../services/authService')
        const session = await getCurrentSession()
        if (isMounted) {
          setUser(session?.user || null)
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
