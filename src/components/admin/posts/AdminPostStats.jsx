function StatIcon({ icon }) {
  const icons = {
    pending: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      </svg>
    ),
    approved: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 12.5 10 15l7-7M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      </svg>
    ),
    rejected: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 9l6 6M15 9l-6 6M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      </svg>
    ),
    today: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      </svg>
    ),
  }

  return icons[icon] ?? null
}

function AdminPostStats({ stats }) {
  return (
    <section className="ap-stats" aria-label="Thống kê bài viết">
      {stats.map((item) => (
        <article
          key={item.label}
          className={`ap-stats__card ap-stats__card--${item.accent}`}
        >
          <span className="ap-stats__icon" aria-hidden="true">
            <StatIcon icon={item.icon} />
          </span>
          <div className="ap-stats__info">
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </div>
        </article>
      ))}
    </section>
  )
}

export default AdminPostStats
