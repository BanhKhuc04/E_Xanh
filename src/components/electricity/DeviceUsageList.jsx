import { formatKwh } from '../../data/electricity'

function DeviceUsageList({ devices, onRemove }) {
  return (
    <div className="device-usage-list">
      {devices.map((device) => (
        <article key={device.id} className={`device-usage-item device-usage-item--${device.tone}`}>
          <div className="device-usage-item__meta">
            <h3>{device.name}</h3>
            <p>
              {device.power}W • {device.hoursPerDay}h/ngày • {device.daysPerMonth} ngày
            </p>
          </div>

          <div className="device-usage-item__actions">
            <strong>{formatKwh(device.kwh)}</strong>
            <button type="button" onClick={() => onRemove(device.id)}>
              Xóa
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

export default DeviceUsageList
