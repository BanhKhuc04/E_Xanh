import { Link } from 'react-router-dom'
import { getInitials, isValidImageUrl } from '../../utils/avatar'
import '../../styles/profile-cover.css'

function ProfileHeader({ user, onLogout }) {
  return (
    <>
      <div className="profile-cover-section">
        {user.cover_url ? (
          <img src={user.cover_url} alt="Cover" className="profile-cover-img" />
        ) : (
          <div className="profile-cover-img"></div>
        )}
      </div>

      <section className="account-profile-header">
        <div className="account-profile-header__identity">
          {isValidImageUrl(user.avatar_url) ? (
            <img src={user.avatar_url} alt="Avatar" className="account-profile-header__avatar" style={{ objectFit: 'cover' }} />
          ) : (
            <div className="account-profile-header__avatar">{getInitials(user.name || user.email)}</div>
          )}

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
    </>
  )
}

export default ProfileHeader
