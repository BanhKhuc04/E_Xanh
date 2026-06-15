import { useEffect, useMemo, useState } from 'react'
import AdminActivityChart from '../../components/admin/statistics/AdminActivityChart'
import AdminCommunityStats from '../../components/admin/statistics/AdminCommunityStats'
import AdminContentTypeChart from '../../components/admin/statistics/AdminContentTypeChart'
import AdminDataInsights from '../../components/admin/statistics/AdminDataInsights'
import AdminStatsOverview from '../../components/admin/statistics/AdminStatsOverview'
import AdminTimeFilter from '../../components/admin/statistics/AdminTimeFilter'
import AdminTopDevices from '../../components/admin/statistics/AdminTopDevices'
import AdminTopSavedPosts from '../../components/admin/statistics/AdminTopSavedPosts'
import {
  getActivityTrend,
  getAdminStats,
  getContentTypeBreakdown,
  getTopDevices,
  getTopSavedPosts,
} from '../../services/analyticsService'
import '../../styles/admin-statistics.css'

function StatisticsPage() {
  const [timeFilter, setTimeFilter] = useState('30 ngày qua')
  const [statsData, setStatsData] = useState(null)
  const [activityData, setActivityData] = useState([])
  const [contentTypeData, setContentTypeData] = useState([])
  const [topSavedPosts, setTopSavedPosts] = useState([])
  const [topDevices, setTopDevices] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadStats() {
      setIsLoading(true)

      const [stats, activity, contentTypes, savedPosts, devices] = await Promise.all([
        getAdminStats(timeFilter),
        getActivityTrend(timeFilter),
        getContentTypeBreakdown(timeFilter),
        getTopSavedPosts(5),
        getTopDevices(5),
      ])

      if (!isMounted) return

      setStatsData(stats)
      setActivityData(activity)
      setContentTypeData(contentTypes)
      setTopSavedPosts(savedPosts)
      setTopDevices(devices)
      setIsLoading(false)
    }

    loadStats()

    return () => {
      isMounted = false
    }
  }, [timeFilter])

  const overviewStats = useMemo(() => {
    if (!statsData) return []

    return [
      { label: 'Tổng bài viết', value: statsData.totalPosts, change: '', changeLabel: '', icon: 'posts', accent: 'success' },
      { label: 'Bài chờ duyệt', value: statsData.pendingPosts, change: '', changeLabel: '', icon: 'posts', accent: 'warning' },
      { label: 'Người dùng hoạt động', value: statsData.activeUsers, change: '', changeLabel: '', icon: 'users', accent: 'highlight' },
      { label: 'Tài khoản bị khóa', value: statsData.lockedUsers, change: '', changeLabel: '', icon: 'users', accent: 'muted' },
      { label: 'Lượt lưu bài', value: statsData.totalSavedPosts, change: '', changeLabel: '', icon: 'comments', accent: 'warning' },
      { label: 'Bình luận đã xử lý', value: statsData.hiddenSpamComments, change: '', changeLabel: '', icon: 'comments', accent: 'muted' },
      { label: 'Thiết bị điện', value: statsData.totalDevices, change: '', changeLabel: '', icon: 'electricity', accent: 'highlight' },
      { label: 'Lượt kiểm tra điện', value: statsData.totalElectricityChecks, change: '', changeLabel: '', icon: 'electricity', accent: 'success' },
    ]
  }, [statsData])

  const communityStats = useMemo(() => {
    if (!statsData) return []
    return [
      { label: 'Tổng bình luận', value: statsData.totalComments.toLocaleString('vi-VN'), icon: 'comment' },
      { label: 'Tổng bài đã lưu', value: statsData.totalSavedPosts.toLocaleString('vi-VN'), icon: 'bookmark' },
      { label: 'Bài đã duyệt', value: statsData.approvedPosts.toLocaleString('vi-VN'), icon: 'heart' },
      { label: 'Tài khoản chờ xử lý', value: (statsData.lockedUsers + statsData.deletedUsers).toLocaleString('vi-VN'), icon: 'share' },
    ]
  }, [statsData])

  const insights = useMemo(() => {
    if (!statsData) return ['Chưa có đủ dữ liệu trong khoảng thời gian này.']

    const dominantContent = [...contentTypeData].sort((left, right) => (right.raw ?? 0) - (left.raw ?? 0))[0]
    return [
      dominantContent?.raw
        ? `${dominantContent.label} đang là nhóm nội dung nổi bật nhất trong khoảng thời gian đã chọn.`
        : 'Chưa có đủ dữ liệu để xác định nhóm nội dung nổi bật.',
      statsData.pendingPosts > 0
        ? `Hiện có ${statsData.pendingPosts} bài viết chờ duyệt, nên ưu tiên rà hàng đợi kiểm duyệt.`
        : 'Không có bài chờ duyệt trong khoảng thời gian hiện tại.',
      statsData.hiddenSpamComments > 0
        ? `Có ${statsData.hiddenSpamComments} bình luận đã bị ẩn/spam/xóa mềm, cần tiếp tục theo dõi chất lượng thảo luận.`
        : 'Chưa phát hiện bình luận cần xử lý trong khoảng thời gian hiện tại.',
    ]
  }, [contentTypeData, statsData])

  const hasActivity = activityData.some((item) => item.posts || item.comments || item.saves || item.checks)

  if (isLoading) {
    return (
      <div className="as-page page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Đang tải dữ liệu phân tích...</p>
      </div>
    )
  }

  return (
    <div className="as-page page">
      <section className="as-page__hero">
        <span className="page-badge page-badge--soft">
          Phân tích dữ liệu
        </span>
        <div className="as-page__hero-copy">
          <h2>Thống kê hệ thống</h2>
          <p>
            Theo dõi số liệu hoạt động, nội dung cộng đồng, thiết bị điện và mức độ tương tác theo dữ liệu thật từ Supabase.
          </p>
        </div>
      </section>

      <AdminTimeFilter active={timeFilter} onChange={setTimeFilter} />

      <AdminStatsOverview stats={overviewStats} />

      <section className="as-charts-grid">
        {hasActivity ? (
          <AdminActivityChart data={activityData} />
        ) : (
          <div className="as-chart-card">
            <div className="as-chart-card__header">
              <h3>Lượt hoạt động theo ngày</h3>
            </div>
            <p>Chưa có đủ dữ liệu trong khoảng thời gian này.</p>
          </div>
        )}

        {contentTypeData.some((item) => (item.raw ?? 0) > 0) ? (
          <AdminContentTypeChart data={contentTypeData} />
        ) : (
          <div className="as-chart-card">
            <div className="as-chart-card__header">
              <h3>Tỷ lệ loại nội dung</h3>
            </div>
            <p>Chưa có đủ dữ liệu trong khoảng thời gian này.</p>
          </div>
        )}
      </section>

      <section className="as-secondary-grid">
        <AdminTopSavedPosts posts={topSavedPosts} />
        <AdminTopDevices devices={topDevices} />
      </section>

      <section className="as-secondary-grid">
        <AdminCommunityStats stats={communityStats} />
        <AdminDataInsights insights={insights} />
      </section>
    </div>
  )
}

export default StatisticsPage
