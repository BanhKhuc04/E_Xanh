import { useState } from 'react'
import { updateProfile } from '../../services/profileService'
import { isValidImageUrl } from '../../utils/avatar'

function EditProfileModal({ user, onClose, onSuccess }) {
  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Tên hiển thị không được để trống.')
      return
    }

    setLoading(true)
    setError('')

    const updates = {
      name: name.trim(),
      bio: bio.trim(),
      avatar_url: avatarUrl.trim()
    }

    const { error: updateError } = await updateProfile(updates)
    if (updateError) {
      setError(updateError.message || 'Đã xảy ra lỗi khi cập nhật.')
      setLoading(false)
      return
    }

    // Trigger event for UserNavbar
    window.dispatchEvent(new Event('profileUpdated'))
    onSuccess()
  }

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '16px', color: '#173715' }}>Chỉnh sửa hồ sơ</h2>
        {error && <p style={{ color: '#e53935', fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Tên hiển thị *</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="input" 
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Tiểu sử (Bio)</label>
            <textarea 
              value={bio} 
              onChange={e => setBio(e.target.value)} 
              className="input" 
              rows="3"
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', resize: 'vertical' }}
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>URL Ảnh đại diện</label>
            <input 
              type="url" 
              value={avatarUrl} 
              onChange={e => setAvatarUrl(e.target.value)} 
              className="input" 
              placeholder="https://..."
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
              disabled={loading}
            />
            {avatarUrl && isValidImageUrl(avatarUrl) && (
              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>Xem trước ảnh</p>
                <img src={avatarUrl} alt="Preview" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; setError('URL Ảnh không hợp lệ hoặc không tải được.'); }} onLoad={(e) => { e.target.style.display = 'inline-block'; setError(''); }} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" className="btn" onClick={onClose} disabled={loading} style={{ background: '#eee', color: '#333' }}>
              Hủy
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfileModal
