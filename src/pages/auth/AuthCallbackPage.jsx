import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SEO from '../../components/SEO'
import { supabase } from '../../lib/supabase'

function AuthCallbackPage() {
  const navigate = useNavigate()
  const hasProcessed = useRef(false)

  useEffect(() => {
    async function processCallback() {
      if (hasProcessed.current) return
      hasProcessed.current = true

      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session) {
          navigate('/dang-nhap', { state: { message: 'Đăng nhập Google thất bại. Vui lòng thử lại.' } })
          return
        }

        const user = session.user
        
        // Kiểm tra profile
        const { syncUserProfile, ensureActiveProfileSession } = await import('../../services/authService')
        const { error: profileError } = await syncUserProfile(user)
        
        if (profileError) {
          console.error('Lỗi thiết lập profile:', profileError)
          navigate('/dang-nhap', { state: { message: 'Lỗi thiết lập tài khoản. Vui lòng thử lại.' } })
          return
        }

        const { profile, allowed, message } = await ensureActiveProfileSession(user.id)
        if (!allowed) {
          navigate('/dang-nhap', { state: { message: message || 'Tài khoản của bạn đã bị vô hiệu hóa.' } })
          return
        }

        if (profile?.role === 'admin' || profile?.role === 'moderator') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } catch (err) {
        console.error('Callback xử lý thất bại:', err)
        navigate('/dang-nhap', { state: { message: 'Đã xảy ra lỗi không xác định.' } })
      }
    }

    processCallback()
  }, [navigate])

  return (
    <>
      <SEO title="Đang xử lý" noIndex={true} />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f9fcf0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#fff', padding: '24px 32px', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
          <div className="page-loader__spinner" style={{ margin: 0 }}></div>
          <p style={{ margin: 0, fontWeight: 500, color: '#333' }}>Đang thiết lập tài khoản E-XANH của bạn...</p>
        </div>
      </div>
    </>
  )
}

export default AuthCallbackPage
