import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isStaff } from '../../utils/permissions'
import BrandLogo from '../../components/common/BrandLogo'

function AdminRoute() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function checkAuth() {
      const timeoutId = setTimeout(() => {
        if (isMounted && loading) {
          setLoading(false)
        }
      }, 6000)

      try {
        const { getCurrentSession, ensureActiveProfileSession } = await import('../../services/authService')
        const session = await getCurrentSession()
        if (!session?.user) {
          if (isMounted) setLoading(false)
          clearTimeout(timeoutId)
          return
        }

        if (isMounted) setUser(session.user)
        const { profile, allowed } = await ensureActiveProfileSession(session.user.id)
        
        if (isMounted) {
          if (allowed && isStaff(profile)) {
            setIsAdmin(true)
          } else if (!allowed) {
            setUser(null)
          }
          setLoading(false)
        }
      } catch (err) {
        console.error("AdminRoute error:", err)
        if (isMounted) setLoading(false)
      } finally {
        clearTimeout(timeoutId)
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [loading])

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
    return (
      <div style={{ padding: '40px', textAlign: 'center', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <BrandLogo to="/" size="large" />
        <h2 style={{ marginTop: '24px', color: 'var(--color-error)' }}>Từ chối truy cập</h2>
        <p style={{ marginTop: '12px' }}>Bạn không có quyền truy cập vào khu vực này.</p>
      </div>
    )
  }

  return <Outlet />
}

export default AdminRoute
