import AdminToggle from './AdminToggle'

function AdminSecuritySettingsCard({ security, onToggle, onSave }) {
  return (
    <div className="st-card">
      <h3 className="st-card__title">Bảo mật admin</h3>

      <div className="st-card__field">
        <label className="st-card__label">Đổi mật khẩu</label>
        <input
          type="password"
          className="st-card__input"
          placeholder="Nhập mật khẩu mới..."
          autoComplete="new-password"
        />
      </div>

      <div className="st-card__toggles">
        <AdminToggle
          checked={security.twoFactor}
          onChange={(val) => onToggle('twoFactor', val)}
          label="Bật xác minh 2 bước"
          description="Yêu cầu mã xác nhận khi đăng nhập từ thiết bị mới."
        />
        <AdminToggle
          checked={security.autoLogout}
          onChange={(val) => onToggle('autoLogout', val)}
          label="Tự động đăng xuất sau 30 phút không hoạt động"
          description="Bảo vệ tài khoản khi rời khỏi máy tính."
        />
      </div>

      <div className="st-card__field">
        <span className="st-card__label">Lịch sử đăng nhập gần đây</span>
        <ul className="st-login-history">
          {security.loginHistory.map((entry, i) => (
            <li key={i}>
              <span className="st-login-history__time">{entry.time}</span>
              <span className="st-login-history__action">{entry.action}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="st-card__actions">
        <button type="button" className="btn btn--primary" onClick={onSave}>
          Cập nhật bảo mật
        </button>
      </div>
    </div>
  )
}

export default AdminSecuritySettingsCard
