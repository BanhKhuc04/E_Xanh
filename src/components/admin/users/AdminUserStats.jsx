function StatIcon({ icon }) {
  const icons = {
    total: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3.5 20a5.5 5.5 0 0 1 11 0M14 20a4 4 0 0 1 6.5-3.1" />
      </svg>
    ),
    active: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20a7 7 0 0 1 14 0" />
        <path d="M15 8l2 2 4-4" />
      </svg>
    ),
    locked: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 13h14v8H5zM8 13V9a4 4 0 0 1 8 0v4M12 17v2" />
      </svg>
    ),
    staff: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.5 6.5l2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2" />
      </svg>
    ),
  }

  return icons[icon] ?? null
}

function AdminUserStats({ stats, isLoading = false }) {
  if (isLoading) {
    return (
      <section className="au-stats" aria-label="Thống kê người dùng đang tải">
        {Array.from({ length: 4 }).map((_, index) => (
          <article
            key={`user-stat-skeleton-${index}`}
            className="au-stats__card au-stats__card--skeleton"
            aria-hidden="true"
          >
            <span className="au-stats__icon au-stats__icon--skeleton" />
            <div className="au-stats__info">
              <p className="au-skeleton au-skeleton--text" />
              <strong className="au-skeleton au-skeleton--value" />
            </div>
          </article>
        ))}
      </section>
    )
  }

  return (
    <section className="au-stats" aria-label="Thống kê người dùng">
      {stats.map((item) => (
        <article
          key={item.label}
          className={`au-stats__card au-stats__card--${item.accent}`}
        >
          <span className="au-stats__icon" aria-hidden="true">
            <StatIcon icon={item.icon} />
          </span>
          <div className="au-stats__info">
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </div>
        </article>
      ))}
    </section>
  )
}

export default AdminUserStats
