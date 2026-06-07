import { Link } from 'react-router-dom'
import { formatCurrency, formatHistoryDate, formatKwh } from '../../data/electricity'

function RecentElectricityHistory({ history }) {
  return (
    <section className="electricity-history">
      <div className="electricity-history__header">
        <h2>Lịch sử kiểm tra gần đây</h2>
        <Link to="/lich-su-kiem-tra">Xem lịch sử đầy đủ</Link>
      </div>
      <div className="electricity-history__table">
        <div className="electricity-history__head">
          <span>Ngày</span>
          <span>Thiết bị</span>
          <span>Tiêu thụ</span>
          <span>Thành tiền</span>
        </div>

        {history.map((item) => (
          <div key={item.id} className="electricity-history__row">
            <span>{formatHistoryDate(item.checkedAt ?? item.date)}</span>
            <span>{item.deviceCount} thiết bị</span>
            <span>{formatKwh(item.totalKwh)}</span>
            <strong>{formatCurrency(item.estimatedCost)}</strong>
          </div>
        ))}
      </div>
      <p className="electricity-history__note">
        Đăng nhập để lưu lại lịch sử kiểm tra tiền điện của bạn.
      </p>
    </section>
  )
}

export default RecentElectricityHistory
