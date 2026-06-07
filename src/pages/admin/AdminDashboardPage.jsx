import { Link } from 'react-router-dom'
import {
  contentTypes,
  dashboardStats,
  quickActions,
  recentActivities,
  recentComments,
  weeklyInteractions,
} from '../../data/adminDashboard'

function DashboardIcon({ icon }) {
  const icons = {
    pending: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      </svg>
    ),
    approved: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 12.5 10 15l7-7M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      </svg>
    ),
    comment: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 6h14v10H9l-4 3V6zM9 10h6M9 13h4" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3.5 20a5.5 5.5 0 0 1 11 0M14 20a4 4 0 0 1 6.5-3.1" />
      </svg>
    ),
    energy: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m13 2-7 10h5l-1 10 8-12h-5V2z" />
      </svg>
    ),
  }

  return icons[icon] ?? null
}

function buildDonutGradient(items) {
  let current = 0
  const stops = items.map((item) => {
    const start = current
    const end = current + item.value
    current = end
    return `${item.color} ${start}% ${end}%`
  })

  return `conic-gradient(${stops.join(', ')})`
}

function AdminDashboardPage() {
  const donutStyle = {
    background: buildDonutGradient(contentTypes),
  }

  const weeklyMax = Math.max(
    ...weeklyInteractions.flatMap((item) => [item.likes, item.comments, item.saves]),
  )

  return (
    <div className="admin-dashboard page">
      <section className="admin-dashboard__hero">
        <span className="page-badge page-badge--soft">Bảng điều khiển quản trị</span>
        <div className="admin-dashboard__hero-copy">
          <h2>Tổng quan quản trị</h2>
          <p>
            Theo dõi bài viết, bình luận, người dùng và lượt kiểm tra tiền điện trong hệ
            thống.
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

      <section className="admin-dashboard__insights">
        <article className="admin-panel admin-panel--chart">
          <div className="admin-panel__header">
            <div>
              <h3>Lượt tương tác trong tuần</h3>
              <p>Like, bình luận và lưu bài trong 7 ngày gần nhất.</p>
            </div>
          </div>

          <div className="admin-chart-legend" aria-label="Chú thích biểu đồ">
            <span>
              <i className="is-like" aria-hidden="true"></i>
              Like
            </span>
            <span>
              <i className="is-comment" aria-hidden="true"></i>
              Bình luận
            </span>
            <span>
              <i className="is-save" aria-hidden="true"></i>
              Lưu bài
            </span>
          </div>

          <div className="admin-weekly-chart" aria-hidden="true">
            {weeklyInteractions.map((item) => (
              <div key={item.day} className="admin-weekly-chart__group">
                <div className="admin-weekly-chart__bars">
                  <span
                    className="bar-like"
                    style={{ height: `${(item.likes / weeklyMax) * 100}%` }}
                  ></span>
                  <span
                    className="bar-comment"
                    style={{ height: `${(item.comments / weeklyMax) * 100}%` }}
                  ></span>
                  <span
                    className="bar-save"
                    style={{ height: `${(item.saves / weeklyMax) * 100}%` }}
                  ></span>
                </div>
                <small>{item.day}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h3>Loại nội dung phổ biến</h3>
              <p>Phân bổ nội dung đang được cộng đồng quan tâm nhất.</p>
            </div>
          </div>

          <div className="admin-content-share">
            <div className="admin-donut-chart" style={donutStyle} aria-hidden="true">
              <div className="admin-donut-chart__center">
                <strong>186 bài</strong>
              </div>
            </div>

            <ul className="admin-content-list">
              {contentTypes.map((item) => (
                <li key={item.label}>
                  <span className="admin-content-list__label">
                    <i style={{ backgroundColor: item.color }} aria-hidden="true"></i>
                    {item.label}
                  </span>
                  <strong>{item.value}%</strong>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <section className="admin-dashboard__secondary">
        <article className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h3>Bình luận mới</h3>
              <p>Những thảo luận cần theo dõi trong cộng đồng E-XANH.</p>
            </div>
            <span className="admin-panel__count">4</span>
          </div>

          <ul className="admin-comment-list">
            {recentComments.map((comment) => (
              <li key={comment.id} className="admin-comment-item">
                <span className="admin-comment-item__avatar">{comment.avatar}</span>
                <div className="admin-comment-item__content">
                  <div className="admin-comment-item__meta">
                    <strong>{comment.author}</strong>
                    <span>{comment.time}</span>
                  </div>
                  <p>{comment.content}</p>
                </div>
                <button type="button" className="admin-comment-item__action">
                  Xem
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h3>Hoạt động gần đây</h3>
              <p>Các cập nhật mới nhất trong khu vực quản trị và cộng đồng.</p>
            </div>
          </div>

          <ol className="admin-timeline">
            {recentActivities.map((activity) => (
              <li key={activity}>{activity}</li>
            ))}
          </ol>
        </article>
      </section>

      <section className="admin-dashboard__quick">
        <div className="admin-dashboard__section-title">
          <h3>Truy cập nhanh</h3>
          <p>Đi tới các tác vụ quản trị được dùng thường xuyên trong ngày.</p>
        </div>

        <div className="admin-quick-grid">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to} className="admin-quick-card">
              <span className="admin-quick-card__icon" aria-hidden="true">
                <DashboardIcon icon={action.icon} />
              </span>
              <div>
                <strong>{action.title}</strong>
                <p>{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AdminDashboardPage
