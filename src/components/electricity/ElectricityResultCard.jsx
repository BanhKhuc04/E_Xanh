import { formatCurrency, formatKwh } from '../../data/electricity'

function ElectricityResultCard({ summary }) {
  return (
    <section id="ket-qua-dien" className="electricity-result-card">
      <span className="electricity-result-card__eyebrow">Tiền điện dự kiến</span>
      <div className="electricity-result-card__price">{formatCurrency(summary.estimatedCost)}</div>
      <p>Dựa trên đơn giá điện sinh hoạt tạm tính 2.400đ/kWh.</p>

      <div className="electricity-result-card__stats">
        <div>
          <span>Tổng điện năng</span>
          <strong>{formatKwh(summary.totalKwh)}</strong>
        </div>
        <div>
          <span>Thiết bị tốn nhất</span>
          <strong>{summary.topDevice?.name ?? 'Chưa có'}</strong>
        </div>
        <div>
          <span>Có thể tiết kiệm</span>
          <strong>{summary.savingRange}</strong>
        </div>
      </div>
    </section>
  )
}

export default ElectricityResultCard
