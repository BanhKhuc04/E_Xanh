function AdminDataInsights({ insights }) {
  return (
    <aside className="as-insights-card">
      <div className="as-insights-card__header">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
        </svg>
        <h3>Gợi ý từ dữ liệu</h3>
      </div>
      <ul className="as-insights-card__list">
        {insights.map((insight, index) => (
          <li key={index}>{insight}</li>
        ))}
      </ul>
    </aside>
  )
}

export default AdminDataInsights
