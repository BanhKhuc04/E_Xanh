import AdminToggle from './AdminToggle'

function AdminContentSettingsCard({ settings, values, onToggle }) {
  return (
    <div className="st-card">
      <h3 className="st-card__title">Cấu hình duyệt nội dung</h3>
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
    </div>
  )
}

export default AdminContentSettingsCard
