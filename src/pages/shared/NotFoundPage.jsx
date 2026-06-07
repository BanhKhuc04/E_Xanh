import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found__card">
        <span className="page-badge">404</span>
        <h1>Không tìm thấy trang</h1>
        <p>Đường dẫn bạn mở chưa được khai báo hoặc đang được đổi cấu trúc.</p>
        <Link className="btn btn--primary" to="/">
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
