function AdminTopDevices({ devices }) {
  const maxCount = devices[0]?.count ?? 1

  return (
    <div className="as-section-card">
      <h3>Thiết bị được kiểm tra nhiều nhất</h3>
      <div className="as-ranking">
        {devices.map((device, index) => (
          <div key={device.name} className="as-ranking__item">
            <span className="as-ranking__rank">{index + 1}</span>
            <span className="as-ranking__icon">{device.icon}</span>
            <div className="as-ranking__info">
              <div className="as-ranking__top">
                <span className="as-ranking__name">{device.name}</span>
                <span className="as-ranking__count">
                  {device.count.toLocaleString('vi-VN')} lượt
                </span>
              </div>
              <div className="as-ranking__bar-track">
                <div
                  className="as-ranking__bar-fill"
                  style={{ width: `${(device.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminTopDevices
