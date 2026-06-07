function CommunityIcon({ icon }) {
  const icons = {
    heart: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21C12 21 4 13.5 4 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 2.5C20 13.5 12 21 12 21Z" />
      </svg>
    ),
    comment: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 6h14v10H9l-4 3V6z" />
      </svg>
    ),
    bookmark: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 5v16l7-5 7 5V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2Z" />
      </svg>
    ),
    share: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.6 13.5l6.8 3.9M15.4 6.6l-6.8 3.9" />
      </svg>
    ),
  }
  return icons[icon] ?? null
}

function AdminCommunityStats({ stats }) {
  return (
    <div className="as-section-card">
      <h3>Tương tác cộng đồng</h3>
      <div className="as-community-grid">
        {stats.map((item) => (
          <div key={item.label} className="as-community-grid__card">
            <span className="as-community-grid__icon">
              <CommunityIcon icon={item.icon} />
            </span>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminCommunityStats
