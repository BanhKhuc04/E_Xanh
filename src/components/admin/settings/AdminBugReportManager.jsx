import { useCallback, useEffect, useMemo, useState } from 'react'
import { RefreshCw, Filter } from 'lucide-react'
import { getBugReports, updateBugReportStatus } from '../../../services/siteNoticeService'
import { createNotificationForUser } from '../../../services/notificationService'

const STATUS_OPTIONS = [
  { value: 'new', label: 'new' },
  { value: 'checking', label: 'checking' },
  { value: 'fixed', label: 'fixed' },
  { value: 'ignored', label: 'ignored' },
]

function formatDateTime(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(date)
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'new': return 'st-badge--warning'
    case 'checking': return 'st-badge--active'
    case 'fixed': return 'st-badge--success'
    default: return 'st-badge--muted'
  }
}

function getSeverityBadgeClass(severity) {
  switch (severity) {
    case 'low': return 'st-badge--muted'
    case 'medium': return 'st-badge--active'
    case 'high': return 'st-badge--warning'
    case 'critical': return 'st-badge--error'
    default: return 'st-badge--muted'
  }
}

function AdminBugReportManager() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [updatingId, setUpdatingId] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const loadReports = useCallback(async () => {
    setLoading(true)
    const { data, error } = await getBugReports()

    if (error) {
      setReports([])
      setErrorMsg(error.message)
    } else {
      setReports(data || [])
      setErrorMsg('')
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void loadReports()
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [loadReports])

  const summary = useMemo(() => {
    return reports.reduce((accumulator, report) => {
      accumulator.total += 1
      accumulator[report.status] = (accumulator[report.status] || 0) + 1
      return accumulator
    }, { total: 0, new: 0, checking: 0, fixed: 0, ignored: 0 })
  }, [reports])

  const filteredReports = useMemo(() => {
    if (filterStatus === 'all') return reports
    return reports.filter(r => r.status === filterStatus)
  }, [reports, filterStatus])

  async function handleStatusChange(report, newStatus) {
    const reportId = report.id
    setUpdatingId(reportId)
    const { data, error } = await updateBugReportStatus(reportId, newStatus)

    if (error) {
      setErrorMsg(error.message)
      setUpdatingId('')
      return
    }

    setReports((current) =>
      current.map((item) => (item.id === reportId ? data : item)),
    )
    
    // Auto send notification when a bug is fixed
    if (newStatus === 'fixed' && report.user_id) {
      try {
        await createNotificationForUser(report.user_id, {
          title: 'Cảm ơn bạn đã báo lỗi!',
          message: `Lỗi "${report.title}" mà bạn báo cáo đã được đội ngũ E-XANH xử lý thành công. Cảm ơn sự đóng góp của bạn!`,
          type: 'system',
          severity: 'success',
        })
      } catch (err) {
        console.error('Lỗi khi gửi thông báo cảm ơn:', err)
      }
    }

    setUpdatingId('')
  }

  return (
    <section className="st-card site-notice-admin-card" style={{ overflowX: 'auto' }}>
      <div className="notification-section-heading">
        <div>
          <h3 className="st-card__title">Bug reports từ website</h3>
          <p className="st-card__helper">Duyệt lỗi được người dùng gửi. Tự động gửi thông báo cảm ơn khi đánh dấu "fixed".</p>
        </div>
        <button type="button" className="btn btn--secondary" onClick={loadReports} disabled={loading}>
          <RefreshCw size={16} />
          {loading ? 'Đang tải...' : 'Tải lại'}
        </button>
      </div>

      <div className="site-notice-bug-summary" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: 'auto' }}>
          <Filter size={16} color="var(--color-text-muted)" />
          <select 
            className="st-card__input" 
            style={{ width: 'auto', padding: '6px 32px 6px 12px', minHeight: '36px' }}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả ({summary.total})</option>
            <option value="new">Mới ({summary.new})</option>
            <option value="checking">Đang kiểm tra ({summary.checking})</option>
            <option value="fixed">Đã xử lý ({summary.fixed})</option>
            <option value="ignored">Bỏ qua ({summary.ignored})</option>
          </select>
        </div>
      </div>

      {errorMsg ? <div className="admin-alert admin-alert--error">{errorMsg}</div> : null}

      {loading ? <div className="notification-empty-state">Đang tải bug reports...</div> : null}
      {!loading && reports.length === 0 ? <div className="notification-empty-state">Chưa có bug report nào được gửi.</div> : null}
      {!loading && reports.length > 0 && filteredReports.length === 0 ? <div className="notification-empty-state">Không có lỗi nào ở trạng thái này.</div> : null}

      {!loading && filteredReports.length > 0 ? (
        <div className="st-table-container">
          <table className="st-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Lỗi & Mô tả</th>
                <th style={{ width: '10%' }}>Mức độ</th>
                <th style={{ width: '20%' }}>Người gửi</th>
                <th style={{ width: '15%' }}>Gửi lúc</th>
                <th style={{ width: '15%' }}>Trạng thái</th>
                <th style={{ width: '15%' }}>Trang gặp lỗi</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>{report.title}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', whiteSpace: 'normal', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} title={report.description}>
                      {report.description}
                    </div>
                  </td>
                  <td>
                    <span className={`st-badge ${getSeverityBadgeClass(report.severity)}`}>{report.severity}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{report.profiles?.name || 'Guest'}</div>
                    {report.profiles?.email && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{report.profiles.email}</div>}
                  </td>
                  <td>{formatDateTime(report.created_at)}</td>
                  <td>
                    <select
                      className="st-card__input"
                      style={{ padding: '4px 24px 4px 8px', minHeight: '32px', fontSize: '0.8125rem', width: '100%' }}
                      value={report.status}
                      onChange={(event) => handleStatusChange(report, event.target.value)}
                      disabled={updatingId === report.id}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {updatingId === report.id && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '4px' }}>Đang lưu...</span>}
                  </td>
                  <td>
                    {report.page_url ? (
                      <a href={report.page_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8125rem', color: 'var(--color-primary-500)', textDecoration: 'underline', wordBreak: 'break-all' }}>
                        Xem trang
                      </a>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}

export default AdminBugReportManager
