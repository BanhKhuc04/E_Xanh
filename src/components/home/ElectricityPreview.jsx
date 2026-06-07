import { Link } from 'react-router-dom'
import { electricityPreview } from '../../data/home'

function ElectricityPreview() {
  return (
    <section className="home-section">
      <div className="electricity-preview">
        <div className="electricity-preview__content">
          <span className="electricity-preview__eyebrow">{electricityPreview.eyebrow}</span>
          <h2>{electricityPreview.title}</h2>
          <p>{electricityPreview.description}</p>
          <Link className="btn electricity-preview__button" to="/kiem-tra-tien-dien">
            Ước tính ngay
          </Link>
        </div>

        <div className="electricity-preview__card">
          <div className="electricity-preview__card-header">
            <strong>Mô phỏng nhanh</strong>
            <span>Ví dụ</span>
          </div>

          <div className="electricity-preview__list">
            {electricityPreview.devices.map((device) => (
              <article key={device.name} className="electricity-preview__device">
                <div className="electricity-preview__device-icon">{device.icon}</div>
                <div>
                  <h3>{device.name}</h3>
                  <p>{device.usage}</p>
                </div>
                <strong>{device.cost}</strong>
              </article>
            ))}
          </div>

          <div className="electricity-preview__summary">
            <div>
              <span>Tổng cộng dự kiến</span>
              <strong>{electricityPreview.total}</strong>
            </div>
            <div className="electricity-preview__progress">
              <span style={{ width: electricityPreview.progress }}></span>
            </div>
            <small>{electricityPreview.budgetNote}</small>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ElectricityPreview
