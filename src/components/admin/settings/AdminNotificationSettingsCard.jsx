import AdminToggle from './AdminToggle'

function AdminNotificationSettingsCard({ settings, values, onToggle, onSave }) {
  return (
    <div className="st-card">
      <h3 className="st-card__title">Thông báo hệ thống</h3>
      <div className="st-card__toggles">
        {settings.map((item) => (
          <AdminToggle
            key={item.key}
            checked={values[item.key]}
            onChange={(val) => onToggle(item.key, val)}
            label={item.label}
            description={item.description}
          />
        ))}
      </div>
      <div className="st-card__actions">
        <button type="button" className="btn btn--primary" onClick={onSave}>
          Cập nhật thông báo
        </button>
      </div>
    </div>
  )
}

export default AdminNotificationSettingsCard
