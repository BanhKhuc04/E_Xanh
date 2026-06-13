import { useState } from 'react'
import { updateProfile } from '../../services/profileService'
import { getInitials, isValidImageUrl } from '../../utils/avatar'

function EditProfileModal({ user, onClose, onSuccess }) {
  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Tên hiển thị không được để trống.')
      setSuccess('')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

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

    setSuccess('Cập nhật hồ sơ thành công.')
    
    // Trigger event for UserNavbar and ProfileHeader
    window.dispatchEvent(new Event('profileUpdated'))
    
    // Wait a bit to show the success message before closing
    setTimeout(() => {
      onSuccess()
    }, 1200)
  }

  return (
    <div className="account-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
      <div className="account-modal">
        <div className="account-modal__header">
          <h2 id="edit-profile-title">Chỉnh sửa hồ sơ</h2>
          <p>Cập nhật thông tin cá nhân và ảnh đại diện của bạn</p>
          <button 
            type="button" 
            className="account-modal__close" 
            onClick={onClose} 
            aria-label="Đóng chỉnh sửa hồ sơ"
            disabled={loading}
          >
            ✕
          </button>
        </div>
        
        <div className="account-modal__body">
          <div className="account-modal__avatar-preview">
            {avatarUrl && isValidImageUrl(avatarUrl) ? (
              <img 
                src={avatarUrl} 
                alt="Avatar preview" 
                className="account-modal__avatar-circle"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} 
                onLoad={(e) => { e.target.style.display = 'block'; if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'none'; }} 
              />
            ) : (
              <div className="account-modal__avatar-circle">
                {getInitials(name || user?.email || 'A')}
              </div>
            )}
            {avatarUrl && isValidImageUrl(avatarUrl) && (
              <div className="account-modal__avatar-circle" style={{ display: 'none' }}>
                 {getInitials(name || user?.email || 'A')}
              </div>
            )}
            
            <label>Ảnh đại diện</label>
            <p>Dán URL ảnh để xem trước</p>
          </div>

          <form onSubmit={handleSubmit} className="account-modal__form">
            {success && <div className="account-modal__success">{success}</div>}
            {error && <div className="account-modal__main-error">{error}</div>}
            
            <div className="account-modal__field">
              <label htmlFor="profile-name">Tên hiển thị *</label>
              <input 
                id="profile-name"
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                disabled={loading}
              />
              {!name.trim() && <div className="account-modal__error">Tên không được để trống</div>}
            </div>

            <div className="account-modal__field">
              <label htmlFor="profile-bio">Tiểu sử (Bio)</label>
              <textarea 
                id="profile-bio"
                value={bio} 
                onChange={e => setBio(e.target.value)} 
                disabled={loading}
                placeholder="Giới thiệu ngắn về bạn..."
              />
            </div>

            <div className="account-modal__field">
              <label htmlFor="profile-avatar">URL Ảnh đại diện</label>
              <input 
                id="profile-avatar"
                type="url" 
                value={avatarUrl} 
                onChange={e => setAvatarUrl(e.target.value)} 
                placeholder="https://example.com/avatar.jpg"
                disabled={loading}
              />
              <small>Dùng ảnh vuông sẽ hiển thị đẹp nhất.</small>
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
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProfileModal
