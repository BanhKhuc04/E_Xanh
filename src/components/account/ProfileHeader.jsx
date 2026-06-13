import { getInitials, isValidImageUrl } from '../../utils/avatar'

function ProfileHeader({ user, onEditClick, onPasswordClick, onLogout }) {
  return (
    <section className="account-profile-header">
      <div className="account-profile-header__identity">
        {isValidImageUrl(user.avatar_url) ? (
          <img src={user.avatar_url} alt="Avatar" className="account-profile-header__avatar" style={{ objectFit: 'cover' }} />
        ) : (
          <div className="account-profile-header__avatar">{getInitials(user.name || user.email)}</div>
        )}

        <div className="account-profile-header__content">
          <h1>{user.name || 'Thành viên'}</h1>
          <p>{user.email}</p>

          <div className="account-profile-header__meta">
            <span className="account-profile-header__badge">Thành viên E-XANH</span>
            <span>Tham gia từ 06/2024</span>
          </div>
        </div>
      </div>

      <div className="account-profile-header__actions">
        <button type="button" className="btn btn--primary" onClick={onEditClick}>
          Chỉnh sửa hồ sơ
        </button>
        <button type="button" className="btn account-profile-header__secondary" onClick={onPasswordClick}>
          Đổi mật khẩu
        </button>
        <button type="button" className="btn account-profile-header__logout" onClick={onLogout}>
          Đăng xuất
        </button>
      </div>
    </section>
  )
}

export default ProfileHeader
