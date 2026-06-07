function ProfileHeader({ user, onLogout }) {
  return (
    <section className="account-profile-header">
      <div className="account-profile-header__identity">
        <div className="account-profile-header__avatar">{user.avatar ?? 'NA'}</div>

        <div className="account-profile-header__content">
          <h1>{user.name}</h1>
          <p>{user.email}</p>

          <div className="account-profile-header__meta">
            <span className="account-profile-header__badge">Thành viên E-XANH</span>
            <span>Tham gia từ 06/2024</span>
          </div>
        </div>
      </div>

      <div className="account-profile-header__actions">
        <button type="button" className="btn btn--primary">
          Chỉnh sửa hồ sơ
        </button>
        <button type="button" className="btn account-profile-header__secondary">
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
