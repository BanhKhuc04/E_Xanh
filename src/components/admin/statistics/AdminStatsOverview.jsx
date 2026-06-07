function StatIcon({ icon }) {
  const icons = {
    posts: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4h10l4 4v12H5z" />
        <path d="M9 8h2M9 12h6M9 16h4" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3.5 20a5.5 5.5 0 0 1 11 0M14 20a4 4 0 0 1 6.5-3.1" />
      </svg>
    ),
    electricity: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m13 3-7 10h5l-1 8 8-11h-5V3z" />
      </svg>
    ),
    comments: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 6h14v10H9l-4 3V6z" />
        <path d="M9 10h6M9 13h4" />
      </svg>
    ),
  }
  return icons[icon] ?? null
}

function AdminStatsOverview({ stats }) {
  return (
    <section className="as-overview" aria-label="Thống kê tổng quan">
      {stats.map((item) => (
        <article
          key={item.label}
          className={`as-overview__card as-overview__card--${item.accent}`}
        >
          <span className="as-overview__icon" aria-hidden="true">
            <StatIcon icon={item.icon} />
          </span>
          <div className="as-overview__info">
            <p>{item.label}</p>
            <strong>{item.value}</strong>
            <span className="as-overview__change">
              {item.change} {item.changeLabel}
            </span>
          </div>
        </article>
      ))}
    </section>
  )
}

export default AdminStatsOverview
