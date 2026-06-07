function AdminSystemStatusCard({ statuses }) {
  return (
    <div className="st-card">
      <h3 className="st-card__title">Trạng thái hệ thống</h3>
      <div className="st-status-list">
        {statuses.map((item) => (
          <div key={item.label} className="st-status-list__item">
            <span className="st-status-list__label">{item.label}</span>
            <span
              className={`st-badge ${item.ok ? 'st-badge--active' : 'st-badge--warning'}`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminSystemStatusCard
