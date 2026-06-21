import { Globe, KeyRound, LockKeyhole } from 'lucide-react'
import { formatRoleLabel } from './utils'

export default function SecuritySettingsSection({
  accountEmail,
  currentUser,
  sendingPasswordReset,
  passwordResetCooldown,
  handleSendPasswordResetEmail,
}) {
  return (
    <div className="settings-stack">
      <section className="settings-section-card">
        <div className="settings-section-card__header">
          <div>
            <span className="settings-section-card__eyebrow">Đổi mật khẩu</span>
            <h2>Bảo mật tài khoản</h2>
          </div>
          <KeyRound size={22} />
        </div>

        <div className="settings-security-card">
          <p className="settings-security-card__copy">
            Để bảo mật tài khoản, E-XANH sẽ gửi liên kết đặt lại mật khẩu về email của bạn.
          </p>

          <div className="settings-summary-list">
            <div>
              <span>Email nhận liên kết</span>
              <strong>{accountEmail || 'Chưa xác định'}</strong>
            </div>
          </div>

          <div className="settings-form__actions">
            <button
              type="button"
              className="btn btn--primary"
              disabled={sendingPasswordReset || passwordResetCooldown > 0}
              onClick={handleSendPasswordResetEmail}
            >
              {sendingPasswordReset
                ? 'Đang gửi email...'
                : passwordResetCooldown > 0
                  ? `Gửi lại sau ${passwordResetCooldown}s`
                  : 'Gửi email đổi mật khẩu'}
            </button>
          </div>
        </div>
      </section>

      <div className="settings-split">
        <section className="settings-section-card">
          <div className="settings-section-card__header">
            <div>
              <span className="settings-section-card__eyebrow">Phiên đăng nhập</span>
              <h2>Thông tin phiên hiện tại</h2>
            </div>
            <LockKeyhole size={22} />
          </div>

          <div className="settings-summary-list">
            <div>
              <span>Email đăng nhập</span>
              <strong>{accountEmail || currentUser?.email}</strong>
            </div>
            <div>
              <span>Vai trò</span>
              <strong>{formatRoleLabel(currentUser?.role)}</strong>
            </div>
            <div>
              <span>Trạng thái hồ sơ</span>
              <strong>{currentUser?.status === 'active' ? 'Đang hoạt động' : currentUser?.status}</strong>
            </div>
          </div>
        </section>

        <section className="settings-section-card">
          <div className="settings-section-card__header">
            <div>
              <span className="settings-section-card__eyebrow">Tự động đăng xuất</span>
              <h2>Tính năng đang chờ hoàn thiện</h2>
            </div>
            <Globe size={22} />
          </div>

          <div className="settings-disabled-panel">
            <span className="settings-badge settings-badge--muted">Sắp ra mắt</span>
            <p>
              Hệ thống hiện chưa có luồng tự động đăng xuất cho tài khoản người dùng thường,
              nên mục này được khóa để tránh tạo cảm giác đã hoạt động.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
