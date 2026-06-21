import { useState } from 'react'
import { Link } from 'react-router-dom'
import AvatarLightbox from '../common/AvatarLightbox'
import OptimizedImage from '../common/OptimizedImage'
import UserAvatar from '../common/UserAvatar'
import '../../styles/profile-cover.css'
function ProfileHeader({ user, onLogout, stats }) {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false)
  const displayName = user?.name || user?.email || 'Thành viên E-XANH'

  return (
    <>
      <div className="profile-card">
        <div className="profile-cover">
          {user.cover_url ? (
            <OptimizedImage src={user.cover_url} alt="Cover" ratio="auto" />
          ) : (
            <div className="profile-cover-img"></div>
          )}
        </div>

        <div className="profile-body">
          <div className="profile-identity-row">
            <div className="profile-identity-left">
              <UserAvatar
                src={user?.avatar_url}
                name={displayName}
                size="profile"
                withFrame={false}
                clickable
                className="profile-avatar"
                onClick={() => setIsAvatarOpen(true)}
              />

              <div className="profile-text">
                <h1 className="profile-name">{user.name || 'Thành viên'}</h1>
                <div className="profile-meta">
                  <span className="profile-badge">Thành viên E-XANH</span>
                  <span>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Tham gia từ 06/2024
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <Link to="/tai-khoan/cai-dat" className="btn btn--primary">
                Chỉnh sửa hồ sơ
              </Link>
              <button type="button" className="btn btn--secondary profile-logout" onClick={onLogout}>
                Đăng xuất
              </button>
            </div>
          </div>

          {stats && stats.length > 0 && (
            <div className="profile-stats">
              {stats.map((item) => (
                <div key={item.label} className="profile-stat">
                  <span className="profile-stat-value">{item.value}</span>
                  <span className="profile-stat-label">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AvatarLightbox
        open={isAvatarOpen}
        onClose={() => setIsAvatarOpen(false)}
        src={user?.avatar_url}
        name={displayName}
      />
    </>
  )
}

export default ProfileHeader
