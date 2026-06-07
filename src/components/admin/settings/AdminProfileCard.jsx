function AdminProfileCard({ profile }) {
  return (
    <div className="st-card st-profile-card">
      <div className="st-profile-card__top">
        <span className="st-profile-card__avatar">{profile.avatar}</span>
        <div className="st-profile-card__info">
          <strong>{profile.name}</strong>
          <span className="st-profile-card__role">{profile.role}</span>
        </div>
      </div>

      <div className="st-profile-card__details">
        <div className="st-profile-card__row">
          <span>Email</span>
          <span>{profile.email}</span>
        </div>
        <div className="st-profile-card__row">
          <span>Trạng thái</span>
          <span className="st-badge st-badge--active">{profile.status}</span>
        </div>
      </div>

      <div className="st-card__actions">
        <button type="button" className="btn btn--primary">
          Chỉnh sửa hồ sơ
        </button>
        <button type="button" className="btn btn--ghost st-logout-btn">
          Đăng xuất
        </button>
      </div>
    </div>
  )
}

export default AdminProfileCard
