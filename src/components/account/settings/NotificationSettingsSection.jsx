import { Bell } from 'lucide-react'
import { NOTIFICATION_SWITCHES } from './constants'
import ToggleRow from './ToggleRow'

export default function NotificationSettingsSection({
  notificationForm,
  setNotificationForm,
  handleSaveNotifications,
  savingNotifications,
}) {
  return (
    <div className="settings-stack">
      <section className="settings-section-card">
        <div className="settings-section-card__header">
          <div>
            <span className="settings-section-card__eyebrow">Notification Center nội bộ</span>
            <h2>Chỉ giữ lại các tùy chọn đã có backend thật</h2>
          </div>
          <Bell size={22} />
        </div>

        <div className="settings-switch-list">
          {NOTIFICATION_SWITCHES.map((item) => (
            <ToggleRow
              key={item.key}
              label={item.label}
              description={item.description}
              checked={Boolean(notificationForm[item.key])}
              disabled={!item.enabled}
              badge={item.enabled ? '' : 'Sắp ra mắt'}
              onChange={() => {
                if (!item.enabled) return
                setNotificationForm((current) => ({
                  ...current,
                  [item.key]: !current[item.key],
                }))
              }}
            />
          ))}
        </div>

        <div className="settings-callout">
          <strong>Những mục bị khóa sẽ không hiển thị toggle giả.</strong>
          <span>
            Hiện tại E-XANH mới có luồng notification nội bộ ổn định cho hệ thống và điều tiết bình luận.
            Các loại khác sẽ chỉ bật khi backend phát thông báo theo tùy chọn cá nhân đã hoàn thiện.
          </span>
        </div>

        <div className="settings-form__actions">
          <button type="button" className="btn btn--primary" onClick={handleSaveNotifications} disabled={savingNotifications}>
            {savingNotifications ? 'Đang lưu...' : 'Lưu cài đặt thông báo'}
          </button>
        </div>
      </section>
    </div>
  )
}
