import { useState } from 'react'
import {
  overviewStats,
  weeklyActivities,
  contentTypes,
  topDevices,
  topSavedPosts,
  activeUsers,
  communityStats,
  dataInsights,
} from '../../data/adminStatistics'
import AdminStatsOverview from '../../components/admin/statistics/AdminStatsOverview'
import AdminTimeFilter from '../../components/admin/statistics/AdminTimeFilter'
import AdminActivityChart from '../../components/admin/statistics/AdminActivityChart'
import AdminContentTypeChart from '../../components/admin/statistics/AdminContentTypeChart'
import AdminTopDevices from '../../components/admin/statistics/AdminTopDevices'
import AdminTopSavedPosts from '../../components/admin/statistics/AdminTopSavedPosts'
import AdminActiveUsers from '../../components/admin/statistics/AdminActiveUsers'
import AdminCommunityStats from '../../components/admin/statistics/AdminCommunityStats'
import AdminDataInsights from '../../components/admin/statistics/AdminDataInsights'
import '../../styles/admin-statistics.css'

function StatisticsPage() {
  const [timeFilter, setTimeFilter] = useState('30 ngày qua')

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

      <AdminStatsOverview stats={overviewStats} />

      <div className="as-charts-row">
        <AdminActivityChart data={weeklyActivities} />
        <AdminContentTypeChart data={contentTypes} />
      </div>

      <div className="as-two-col">
        <AdminTopDevices devices={topDevices} />
        <AdminTopSavedPosts posts={topSavedPosts} />
      </div>

      <div className="as-two-col">
        <AdminActiveUsers users={activeUsers} />
        <AdminCommunityStats stats={communityStats} />
      </div>

      <AdminDataInsights insights={dataInsights} />
    </div>
  )
}

export default StatisticsPage
