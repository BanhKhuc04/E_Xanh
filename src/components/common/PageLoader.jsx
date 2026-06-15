import '../../styles/loading.css'

function PageLoader({ message = 'Đang tải dữ liệu...' }) {
  return (
    <div className="page-loader">
      <div className="page-loader__spinner"></div>
      <p>{message}</p>
    </div>
  )
}

export default PageLoader
