import { useState, useEffect } from 'react'
import { getDashboardStats } from '../../services/adminStatsService'
import AdminStatsOverview from '../../components/admin/statistics/AdminStatsOverview'
import AdminTimeFilter from '../../components/admin/statistics/AdminTimeFilter'
import '../../styles/admin-statistics.css'

function StatisticsPage() {
  const [timeFilter, setTimeFilter] = useState('30 ngày qua')
  const [statsData, setStatsData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function loadStats() {
      const data = await getDashboardStats()
      if (isMounted) {
        setStatsData(data)
        setIsLoading(false)
      }
    }
    loadStats()
    return () => { isMounted = false }
  }, [])

  if (isLoading) {
    return (
      <div className="as-page page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Đang tải dữ liệu phân tích...</p>
      </div>
    )
  }

  const formatValue = (val) => {
    if (val === '-' || val === null || val === undefined) return 'Không có dữ liệu'
    if (val === 0) return 'Chưa có dữ liệu'
    return val
  }

  const realOverviewStats = [
    { label: 'Tổng bài viết', value: formatValue(statsData?.totalPosts), change: '', changeLabel: '', icon: 'posts', accent: 'green' },
    { label: 'Người dùng', value: formatValue(statsData?.totalUsers), change: '', changeLabel: '', icon: 'users', accent: 'blue' },
    { label: 'Lượt lưu bài', value: formatValue(statsData?.totalSavedPosts), change: '', changeLabel: '', icon: 'comments', accent: 'orange' },
  ]

  return (
    <div className="as-page page">
      <section className="as-page__hero">
        <span className="page-badge page-badge--soft">
          Phân tích dữ liệu
        </span>
        <div className="as-page__hero-copy">
          <h2>Thống kê hệ thống</h2>
          <p>
            Theo dõi số liệu hoạt động, tương tác và xu hướng sử dụng trên
            nền tảng E-XANH.
          </p>
        </div>
      </section>

      <AdminTimeFilter active={timeFilter} onChange={setTimeFilter} />

      <AdminStatsOverview stats={realOverviewStats} />

      <div style={{ padding: '60px 24px', textAlign: 'center', background: 'rgba(255,255,255,0.8)', borderRadius: '24px', border: '1px dashed #ccc', marginTop: '24px' }}>
        <h3 style={{ marginBottom: '8px' }}>Biểu đồ phân tích chi tiết đang được phát triển</h3>
        <p style={{ color: '#666' }}>Tính năng thống kê dạng biểu đồ (hoạt động hàng tuần, thiết bị) sẽ sớm ra mắt với dữ liệu thực tế.</p>
      </div>
    </div>
  )
}

export default StatisticsPage
