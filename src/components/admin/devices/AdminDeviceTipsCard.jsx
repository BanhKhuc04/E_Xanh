function AdminDeviceTipsCard({ tips }) {
  return (
    <aside className="ad-tips-card">
      <div className="ad-tips-card__header">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
        </svg>
        <h3>Gợi ý tiết kiệm nổi bật</h3>
      </div>
      <ul className="ad-tips-card__list">
        {tips.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    </aside>
  )
}

export default AdminDeviceTipsCard
