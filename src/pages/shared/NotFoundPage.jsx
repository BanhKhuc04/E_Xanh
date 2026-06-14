import { Link } from 'react-router-dom'
import BrandLogo from '../../components/common/BrandLogo'

function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found__card">
        <BrandLogo to="/" size="large" />
        <span className="page-badge" style={{ marginTop: '16px' }}>404</span>
        <h1>Không tìm thấy trang</h1>
        <p>Đường dẫn bạn mở chưa được khai báo hoặc đang được đổi cấu trúc.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
          <Link className="btn btn--primary" to="/">
            Về trang chủ
          </Link>
          <Link className="btn btn--secondary" to="/meo-tiet-kiem">
            Khám phá mẹo tiết kiệm
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
