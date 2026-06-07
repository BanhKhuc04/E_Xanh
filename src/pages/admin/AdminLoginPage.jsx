import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmail, getCurrentSession, getCurrentUserProfile, signOut } from '../../services/authService'

function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true
    async function checkExistingAuth() {
      const session = await getCurrentSession()
      if (session?.user) {
        const profile = await getCurrentUserProfile(session.user.id)
        if (profile && (profile.role === 'admin' || profile.role === 'moderator')) {
          if (isMounted) navigate('/admin')
        }
      }
    }
    checkExistingAuth()
    return () => { isMounted = false }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: authError } = await signInWithEmail({ email, password })

    if (authError) {
      setError('Email hoặc mật khẩu không chính xác.')
      setLoading(false)
      return
    }

    if (data?.user) {
      const profile = await getCurrentUserProfile(data.user.id)
      if (profile && (profile.role === 'admin' || profile.role === 'moderator')) {
        navigate('/admin')
      } else {
        await signOut()
        setError('Tài khoản này không có quyền truy cập khu vực quản trị.')
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f9fc', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '420px', width: '100%', padding: '32px', background: 'white', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#4f8428' }}>Đăng nhập quản trị E-XANH</h1>
          <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>Chỉ tài khoản có quyền admin hoặc moderator mới có thể truy cập khu vực quản trị.</p>
        </div>

        {error && <div style={{ padding: '12px', background: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>Email</span>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '15px' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>Mật khẩu</span>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '15px' }}
            />
          </label>

          <button type="submit" disabled={loading} className="btn btn--primary" style={{ marginTop: '8px', padding: '12px', width: '100%', borderRadius: '6px', cursor: 'pointer', border: 'none', background: '#4f8428', color: 'white', fontWeight: 600, fontSize: '15px' }}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link to="/" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>&larr; Quay về trang chủ</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage
