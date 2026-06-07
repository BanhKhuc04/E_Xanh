function StatIcon({ icon }) {
  const icons = {
    new: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 6h14v10H9l-4 3V6zM9 10h6M9 13h4" />
      </svg>
    ),
    reported: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 9v4M12 17h.01M5 3h14l-1.5 9L19 21H5l1.5-9L5 3Z" />
      </svg>
    ),
    hidden: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" />
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M3 3l18 18" />
      </svg>
    ),
    spam: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 9v4M12 17h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      </svg>
    ),
  }

  return icons[icon] ?? null
}

function AdminCommentStats({ stats }) {
  return (
    <section className="ac-stats" aria-label="Thống kê bình luận">
      {stats.map((item) => (
        <article
          key={item.label}
          className={`ac-stats__card ac-stats__card--${item.accent}`}
        >
          <span className="ac-stats__icon" aria-hidden="true">
            <StatIcon icon={item.icon} />
          </span>
          <div className="ac-stats__info">
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </div>
        </article>
      ))}
    </section>
  )
}

export default AdminCommentStats
