import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardStats } from '../../services/adminStatsService'
import { postStatusMap } from '../../data/adminPosts'

function DashboardIcon({ icon }) {
  const icons = {
    total: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
      </svg>
    ),
    approved: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 12.5 10 15l7-7M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      </svg>
    ),
    pending: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      </svg>
    ),
    rejected: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4m0 3.5h.01" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3.5 20a5.5 5.5 0 0 1 11 0M14 20a4 4 0 0 1 6.5-3.1" />
      </svg>
    ),
    saved: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 6h14v10H9l-4 3V6zM9 10h6M9 13h4" />
      </svg>
    ),
  }

  return icons[icon] ?? null
}

function AdminDashboardPage() {
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
      <div className="admin-dashboard page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Đang tải dữ liệu tổng quan...</p>
      </div>
    )
  }

  // Cấu trúc lại danh sách card từ dữ liệu fetch được
  const dashboardStats = [
    { label: 'Tổng bài viết', value: statsData.totalPosts, icon: 'total', accent: 'green', change: '' },
    { label: 'Đã duyệt', value: statsData.approvedPosts, icon: 'approved', accent: 'blue', change: '' },
    { label: 'Chờ duyệt', value: statsData.pendingPosts, icon: 'pending', accent: 'yellow', change: '' },
    { label: 'Từ chối / Ẩn', value: statsData.rejectedHiddenPosts, icon: 'rejected', accent: 'red', change: '' },
    { label: 'Tổng người dùng', value: statsData.totalUsers, icon: 'users', accent: 'purple', change: '' },
    { label: 'Lượt lưu bài', value: statsData.totalSavedPosts, icon: 'saved', accent: 'orange', change: '' },
  ]

  return (
    <div className="admin-dashboard page">
      <section className="admin-dashboard__hero">
        <span className="page-badge page-badge--soft">Bảng điều khiển quản trị</span>
        <div className="admin-dashboard__hero-copy">
          <h2>Tổng quan hệ thống</h2>
          <p>
            Theo dõi tình trạng bài viết, người dùng và các hoạt động đang diễn ra.
          </p>
        </div>
      </section>

      <section className="admin-stats-grid" aria-label="Thống kê hệ thống">
        {dashboardStats.map((item) => (
          <article key={item.label} className={`admin-metric-card admin-metric-card--${item.accent}`}>
            <div className="admin-metric-card__top">
              <span className="admin-metric-card__icon" aria-hidden="true">
                <DashboardIcon icon={item.icon} />
              </span>
              <span className="admin-metric-card__change">{item.change}</span>
            </div>
            <div className="admin-metric-card__body">
              <p>{item.label}</p>
              <strong>{item.value}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="admin-dashboard__secondary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginTop: '32px' }}>
        
        {/* Khu vực 5 bài viết mới nhất */}
        <article className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h3>Bài viết gần đây</h3>
              <p>5 bài viết mới được thêm vào hệ thống (mọi trạng thái).</p>
            </div>
            <Link to="/admin/quan-ly-bai-viet" className="btn btn--ghost" style={{ fontSize: '0.85rem' }}>Quản lý</Link>
          </div>

          {statsData.recentPosts.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#666' }}>Chưa có bài viết nào.</div>
          ) : (
            <ul className="admin-comment-list">
              {statsData.recentPosts.map((post) => {
                const statusInfo = postStatusMap[post.status] ?? postStatusMap.pending
                return (
                  <li key={post.id} className="admin-comment-item" style={{ alignItems: 'flex-start' }}>
                    <div className="admin-comment-item__content" style={{ flex: 1 }}>
                      <div className="admin-comment-item__meta" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{post.title}</strong>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                        Bởi <strong>{post.profiles?.name || 'Ẩn danh'}</strong> - Ngày: {new Date(post.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <span className={`ap-badge ${statusInfo.className}`} style={{ marginLeft: '12px' }}>
                      {statusInfo.label}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </article>

        {/* Khu vực bài cần duyệt ngay */}
        <article className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h3>Cần phê duyệt ngay</h3>
              <p>Các bài viết đang ở trạng thái chờ duyệt.</p>
            </div>
            <span className="admin-panel__count">{statsData.pendingPostsList.length}</span>
          </div>

          {statsData.pendingPostsList.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: '#4f8428', background: '#f1f8e9', borderRadius: '8px', margin: '16px' }}>
              <svg viewBox="0 0 24 24" style={{ width: 48, height: 48, fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, margin: '0 auto 12px' }}>
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p style={{ fontWeight: 600 }}>Thật tuyệt!</p>
              <span style={{ fontSize: '0.9rem' }}>Không có bài viết nào đang chờ duyệt lúc này.</span>
            </div>
          ) : (
            <ul className="admin-comment-list">
              {statsData.pendingPostsList.map((post) => (
                <li key={post.id} className="admin-comment-item" style={{ alignItems: 'flex-start' }}>
                  <div className="admin-comment-item__content" style={{ flex: 1 }}>
                    <div className="admin-comment-item__meta">
                      <strong>{post.title}</strong>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                      Bởi: {post.profiles?.name || 'Ẩn danh'} - {new Date(post.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <Link to="/admin/quan-ly-bai-viet" className="btn btn--primary" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>
                    Duyệt
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </article>

      </section>
    </div>
  )
}

export default AdminDashboardPage
