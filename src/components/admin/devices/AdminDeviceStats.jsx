function StatIcon({ icon }) {
  const icons = {
    total: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m13 3-7 10h5l-1 8 8-11h-5V3z" />
      </svg>
    ),
    active: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 12.5 10 15l7-7M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      </svg>
    ),
    high: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 9v4M12 17h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      </svg>
    ),
    tips: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
      </svg>
    ),
  }

  return icons[icon] ?? null
}

function AdminDeviceStats({ stats }) {
  return (
    <section className="ad-stats" aria-label="Thống kê thiết bị">
      {stats.map((item) => (
        <article
          key={item.label}
          className={`ad-stats__card ad-stats__card--${item.accent}`}
        >
          <span className="ad-stats__icon" aria-hidden="true">
            <StatIcon icon={item.icon} />
          </span>
          <div className="ad-stats__info">
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </div>
        </article>
      ))}
    </section>
  )
}

export default AdminDeviceStats
