function AdminActivityChart({ data }) {
  const maxValue = Math.max(
    1,
    ...data.flatMap((d) => [d.posts, d.comments, d.saves, d.checks]),
  )

  const legend = [
    { label: 'Bài viết', color: '#336A29' },
    { label: 'Bình luận', color: '#80B155' },
    { label: 'Lượt lưu bài', color: '#C1D95C' },
    { label: 'Lượt kiểm tra điện', color: '#EAF59D' },
  ]

  return (
    <div className="as-chart-card">
      <div className="as-chart-card__header">
        <h3>Lượt hoạt động theo ngày</h3>
        <div className="as-chart-card__legend">
          {legend.map((item) => (
            <span key={item.label} className="as-chart-card__legend-item">
              <span
                className="as-chart-card__legend-dot"
                style={{ background: item.color }}
              />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="as-bar-chart">
        {data.map((day) => (
          <div key={day.day} className="as-bar-chart__col">
            <div className="as-bar-chart__bars">
              <div
                className="as-bar-chart__bar"
                style={{
                  height: `${(day.checks / maxValue) * 100}%`,
                  background: '#EAF59D',
                }}
                title={`Kiểm tra điện: ${day.checks}`}
              />
              <div
                className="as-bar-chart__bar"
                style={{
                  height: `${(day.saves / maxValue) * 100}%`,
                  background: '#C1D95C',
                }}
                title={`Lưu bài: ${day.saves}`}
              />
              <div
                className="as-bar-chart__bar"
                style={{
                  height: `${(day.comments / maxValue) * 100}%`,
                  background: '#80B155',
                }}
                title={`Bình luận: ${day.comments}`}
              />
              <div
                className="as-bar-chart__bar"
                style={{
                  height: `${(day.posts / maxValue) * 100}%`,
                  background: '#336A29',
                }}
                title={`Bài viết: ${day.posts}`}
              />
            </div>
            <span className="as-bar-chart__label">{day.day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminActivityChart
