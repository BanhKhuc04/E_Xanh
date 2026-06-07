function AdminContentTypeChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  const segments = data.reduce((acc, item) => {
    const startDeg = acc.length > 0 ? acc[acc.length - 1].startDeg + acc[acc.length - 1].deg : 0
    const deg = (item.value / total) * 360
    return [...acc, { ...item, startDeg, deg }]
  }, [])

  const conicGradient = segments
    .map((s) => `${s.color} ${s.startDeg}deg ${s.startDeg + s.deg}deg`)
    .join(', ')

  return (
    <div className="as-chart-card">
      <div className="as-chart-card__header">
        <h3>Tỷ lệ loại nội dung</h3>
      </div>

      <div className="as-donut-wrapper">
        <div
          className="as-donut"
          style={{ background: `conic-gradient(${conicGradient})` }}
        >
          <div className="as-donut__center">
            <strong>186</strong>
            <span>bài</span>
          </div>
        </div>

        <ul className="as-donut__legend">
          {data.map((item) => (
            <li key={item.label}>
              <span
                className="as-donut__legend-dot"
                style={{ background: item.color }}
              />
              <span className="as-donut__legend-label">{item.label}</span>
              <strong>{item.value}%</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AdminContentTypeChart
