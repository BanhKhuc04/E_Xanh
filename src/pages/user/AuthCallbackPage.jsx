import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
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
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, status')
          .eq('id', user.id)
          .single()
          
        if (profileError && profileError.code !== 'PGRST116') {
          // Lỗi khác ngoài việc không tìm thấy profile
          throw profileError
        }

        if (!profile) {
          // Tạo profile mới
          const email = user.email
          let name = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0]
          const avatar_url = user.user_metadata?.avatar_url || null

          const { error: insertError } = await supabase.from('profiles').insert({
            id: user.id,
            email,
            name,
            avatar_url,
            role: 'user',
            status: 'active'
          })
          
          if (insertError) {
            console.error('Lỗi tạo profile:', insertError)
            navigate('/dang-nhap', { state: { message: 'Lỗi thiết lập tài khoản. Vui lòng thử lại.' } })
            return
          }
          
          navigate('/')
        } else {
          // Đã có profile
          if (profile.status === 'locked' || profile.status === 'blocked' || profile.status === 'deleted') {
            await supabase.auth.signOut()
            navigate('/dang-nhap', { state: { message: 'Tài khoản của bạn đã bị vô hiệu hóa.' } })
            return
          }

          if (profile.role === 'admin' || profile.role === 'moderator') {
            navigate('/admin')
          } else {
            navigate('/')
          }
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
      <Helmet>
        <title>Đang xử lý - E-XANH</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
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
