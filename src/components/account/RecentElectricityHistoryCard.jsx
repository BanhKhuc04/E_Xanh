import { Link } from 'react-router-dom'

function RecentElectricityHistoryCard({ histories, formatCurrency, formatHistoryDate, formatKwh }) {
  return (
    <section className="account-side-card">
      <h2>Lịch sử kiểm tra tiền điện</h2>

      {histories.length > 0 ? (
        <div className="account-history-list">
          {histories.map((item) => (
            <article key={item.id} className="account-history-list__item">
              <div>
                <strong>{formatHistoryDate(item.checkedAt ?? item.date)}</strong>
                <span>{formatKwh(item.totalKwh)}</span>
              </div>
              <em>{formatCurrency(item.estimatedCost)}</em>
            </article>
          ))}
        </div>
      ) : (
        <p className="account-side-card__empty">Bạn chưa có lịch sử kiểm tra nào.</p>
      )}

      <Link to="/lich-su-kiem-tra" className="btn account-side-card__button">
        Xem lịch sử đầy đủ
      </Link>
    </section>
  )
}

export default RecentElectricityHistoryCard
