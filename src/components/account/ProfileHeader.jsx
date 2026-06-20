import { useState } from 'react'
import { Link } from 'react-router-dom'
import AvatarLightbox from '../common/AvatarLightbox'
import OptimizedImage from '../common/OptimizedImage'
import UserAvatar from '../common/UserAvatar'
import '../../styles/profile-cover.css'

function ProfileHeader({ user, onLogout }) {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false)
  const displayName = user?.name || user?.email || 'Thành viên E-XANH'

  return (
    <>
      <div className="profile-cover-section">
        {user.cover_url ? (
          <OptimizedImage src={user.cover_url} alt="Cover" className="profile-cover-img" ratio="auto" />
        ) : (
          <div className="profile-cover-img"></div>
        )}
      </div>

      <section className="account-profile-header">
        <div className="account-profile-header__identity">
          <UserAvatar
            src={user?.avatar_url}
            name={displayName}
            size="profile"
            withFrame={false}
            clickable
            className="account-profile-header__avatar"
            onClick={() => setIsAvatarOpen(true)}
          />

          <div className="account-profile-header__content">
            <h1>{user.name || 'Thành viên'}</h1>

            <div className="account-profile-header__meta">
              <span className="account-profile-header__badge">Thành viên E-XANH</span>
              <span>Tham gia từ 06/2024</span>
            </div>
          </div>
        </div>

        <div className="account-profile-header__actions">
          <Link to="/tai-khoan/cai-dat" className="btn btn--primary">
            Chỉnh sửa hồ sơ
          </Link>
          <button type="button" className="btn account-profile-header__logout" onClick={onLogout}>
            Đăng xuất
          </button>
        </div>
      </section>

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
