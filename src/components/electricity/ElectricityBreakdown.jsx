import { formatKwh } from '../../data/electricity'

function ElectricityBreakdown({ items }) {
  return (
    <section className="electricity-breakdown">
      <h3>Phân bổ tiêu thụ</h3>
      <div className="electricity-breakdown__list">
        {items.map((item, index) => (
          <div key={item.id} className="electricity-breakdown__item">
            <div className="electricity-breakdown__row">
              <span>{item.name}</span>
              <span>
                {formatKwh(item.kwh)} • {item.percent}%
              </span>
            </div>
            <div className="electricity-breakdown__bar">
              <span
                className={`electricity-breakdown__fill electricity-breakdown__fill--${index % 3}`}
                style={{ width: `${item.percent}%` }}
              ></span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ElectricityBreakdown
