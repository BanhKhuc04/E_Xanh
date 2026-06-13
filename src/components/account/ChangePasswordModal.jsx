import { useState } from 'react'
import { supabase } from '../../lib/supabase'

function ChangePasswordModal({ onClose, onSuccess }) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.')
      return
    }

    setLoading(true)
    setError('')

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
    
    if (updateError) {
      setError(updateError.message || 'Lỗi khi cập nhật mật khẩu.')
      setLoading(false)
      return
    }

    onSuccess()
  }

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '16px', color: '#173715' }}>Đổi mật khẩu</h2>
        {error && <p style={{ color: '#e53935', fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Mật khẩu mới *</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              className="input" 
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
              disabled={loading}
              placeholder="Tối thiểu 6 ký tự"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Nhập lại mật khẩu *</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              className="input" 
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
              disabled={loading}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" className="btn" onClick={onClose} disabled={loading} style={{ background: '#eee', color: '#333' }}>
              Hủy
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePasswordModal
