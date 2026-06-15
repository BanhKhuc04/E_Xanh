import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Eye, EyeOff } from 'lucide-react'

function ChangePasswordModal({ onClose, onSuccess }) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.')
      setSuccess('')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.')
      setSuccess('')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
    
    if (updateError) {
      setError(updateError.message || 'Lỗi khi cập nhật mật khẩu.')
      setLoading(false)
      return
    }

    setSuccess('Cập nhật mật khẩu thành công.')
    
    setTimeout(() => {
      onSuccess()
    }, 1200)
  }

  return (
    <div className="account-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="change-password-title">
      <div className="account-modal" style={{ maxWidth: '480px' }}>
        <div className="account-modal__header">
          <h2 id="change-password-title">Đổi mật khẩu</h2>
          <p>Tạo mật khẩu mới an toàn cho tài khoản của bạn</p>
          <button 
            type="button" 
            className="account-modal__close" 
            onClick={onClose}
            aria-label="Đóng đổi mật khẩu"
            disabled={loading}
          >
            ✕
          </button>
        </div>
        
        <div className="account-modal__body">
          <form onSubmit={handleSubmit} className="account-modal__form">
            {success && <div className="account-modal__success">{success}</div>}
            {error && <div className="account-modal__main-error">{error}</div>}
            
            <div className="account-modal__field">
              <label htmlFor="new-password">Mật khẩu mới *</label>
              <div className="account-modal__password-field">
                <input 
                  id="new-password"
                  type={showPassword ? "text" : "password"} 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  disabled={loading}
                  placeholder="Nhập mật khẩu mới"
                />
                <button 
                  type="button" 
                  className="account-modal__password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <small>Nên dùng ít nhất 6 ký tự, gồm chữ và số.</small>
            </div>

            <div className="account-modal__field">
              <label htmlFor="confirm-password">Xác nhận mật khẩu *</label>
              <div className="account-modal__password-field">
                <input 
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  disabled={loading}
                  placeholder="Nhập lại mật khẩu mới"
                />
                <button 
                  type="button" 
                  className="account-modal__password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="account-modal__actions">
          <button 
            type="button" 
            className="btn account-modal__secondary" 
            onClick={onClose} 
            disabled={loading}
          >
            Hủy
          </button>
          <button 
            type="button" 
            className="btn account-modal__primary" 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordModal
