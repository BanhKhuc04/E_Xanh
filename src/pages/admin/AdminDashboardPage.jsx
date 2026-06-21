import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminStats } from '../../services/analyticsService'
import { postStatusMap } from '../../data/mock/adminPosts'
import PageLoader from '../../components/common/PageLoader'

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
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadStats() {
      try {
        const data = await getAdminStats('30 ngày qua')
        if (isMounted) {
          setStatsData(data)
          setIsLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Lỗi tải dữ liệu thống kê')
          setIsLoading(false)
        }
      }
    }

    loadStats()

    return () => {
      isMounted = false
    }
  }, [])

  const dashboardStats = useMemo(() => {
    if (!statsData) return []

    return [
      { label: 'Tổng bài viết', value: statsData.totalPosts, icon: 'total', accent: 'green' },
      { label: 'Đã duyệt', value: statsData.approvedPosts, icon: 'approved', accent: 'blue' },
      { label: 'Chờ duyệt', value: statsData.pendingPosts, icon: 'pending', accent: 'yellow' },
      { label: 'Từ chối / Khóa', value: statsData.rejectedHiddenPosts, icon: 'rejected', accent: 'red' },
      { label: 'Tổng người dùng', value: statsData.totalUsers, icon: 'users', accent: 'purple' },
      { label: 'Lượt lưu bài', value: statsData.totalSavedPosts, icon: 'saved', accent: 'orange' },
    ]
  }, [statsData])

  if (isLoading) {
    return (
      <div className="admin-dashboard page">
        <PageLoader />
      </div>
    )
  }

  return (
    <div className="admin-dashboard page">
      {error && (
        <div className="admin-alert admin-alert--error" style={{ marginBottom: '24px' }}>
          {error}
        </div>
      )}
      <section className="admin-dashboard__hero">
        <span className="page-badge page-badge--soft">Bảng điều khiển quản trị</span>
        <div className="admin-dashboard__hero-copy">
          <h2>Tổng quan hệ thống</h2>
          <p>
            Theo dõi nhanh nội dung chờ duyệt, hoạt động người dùng và xu hướng tương tác trên nền tảng.
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
            </div>
            <div className="admin-metric-card__body">
              <p>{item.label}</p>
              <strong>{item.value}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="admin-dashboard__secondary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginTop: '32px' }}>
        <article className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h3>Bài viết gần đây</h3>
              <p>5 bài viết mới được thêm vào hệ thống.</p>
            </div>
            <Link to="/admin/quan-ly-bai-viet" className="btn btn--ghost" style={{ fontSize: '0.85rem' }}>Quản lý</Link>
          </div>

          {statsData?.recentPosts?.length ? (
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
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: '#666' }}>Chưa có bài viết nào.</div>
          )}
        </article>

        <article className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h3>Cần phê duyệt ngay</h3>
              <p>Các bài viết đang ở trạng thái chờ duyệt.</p>
            </div>
            <span className="admin-panel__count">{statsData?.pendingPostsList?.length ?? 0}</span>
          </div>

          {statsData?.pendingPostsList?.length ? (
            <ul className="admin-comment-list">
              {statsData.pendingPostsList.map((post) => (
                <li key={post.id} className="admin-comment-item" style={{ alignItems: 'center', padding: '16px 0', gap: '16px' }}>
                  <div className="admin-comment-item__content" style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: '1.4',
                      marginBottom: '6px',
                    }}>
                      {post.title}
                    </strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#666', flexWrap: 'wrap' }}>
                      <span>Bởi: <strong>{post.profiles?.name || 'Ẩn danh'}</strong></span>
                      <span>•</span>
                      <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                      <span>•</span>
                      <span className="ap-badge ap-badge--pending" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>Chờ duyệt</span>
                    </div>
                  </div>
                  <Link to="/admin/quan-ly-bai-viet" className="btn btn--primary" style={{ padding: '6px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    Quản lý
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: '#4f8428', background: '#f1f8e9', borderRadius: '8px', margin: '16px' }}>
              <svg viewBox="0 0 24 24" style={{ width: 48, height: 48, fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, margin: '0 auto 12px' }}>
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p style={{ fontWeight: 600 }}>Thật tuyệt!</p>
              <span style={{ fontSize: '0.9rem' }}>Không có bài viết nào đang chờ duyệt lúc này.</span>
            </div>
          )}
        </article>
      </section>
    </div>
  )
}

export default AdminDashboardPage
