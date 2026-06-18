import { useCallback, useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { getBugReports, updateBugReportStatus } from '../../../services/siteNoticeService'

const STATUS_OPTIONS = [
  { value: 'new', label: 'new' },
  { value: 'checking', label: 'checking' },
  { value: 'fixed', label: 'fixed' },
  { value: 'ignored', label: 'ignored' },
]

function formatDateTime(value) {
  if (!value) return 'Chưa có dữ liệu'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Chưa có dữ liệu'

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(date)
}

function AdminBugReportManager() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [updatingId, setUpdatingId] = useState('')

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

  async function handleStatusChange(reportId, status) {
    setUpdatingId(reportId)
    const { data, error } = await updateBugReportStatus(reportId, status)

    if (error) {
      setErrorMsg(error.message)
      setUpdatingId('')
      return
    }

    setReports((current) =>
      current.map((item) => (item.id === reportId ? data : item)),
    )
    setUpdatingId('')
  }

  return (
    <section className="st-card site-notice-admin-card">
      <div className="notification-section-heading">
        <div>
          <h3 className="st-card__title">Bug reports từ website</h3>
          <p className="st-card__helper">Guest vẫn có thể gửi lỗi. Nếu người gửi đã đăng nhập, hệ thống sẽ tự gắn `user_id`.</p>
        </div>
        <button type="button" className="btn btn--secondary" onClick={loadReports} disabled={loading}>
          <RefreshCw size={16} />
          {loading ? 'Đang tải...' : 'Tải lại'}
        </button>
      </div>

      <div className="site-notice-bug-summary">
        <span className="notification-count-pill">{summary.total} lỗi</span>
        <span className="st-badge st-badge--warning">new: {summary.new}</span>
        <span className="st-badge st-badge--active">checking: {summary.checking}</span>
        <span className="st-badge st-badge--active">fixed: {summary.fixed}</span>
        <span className="st-badge">ignored: {summary.ignored}</span>
      </div>

      {errorMsg ? <div className="admin-alert admin-alert--error">{errorMsg}</div> : null}

      {loading ? <div className="notification-empty-state">Đang tải bug reports...</div> : null}
      {!loading && reports.length === 0 ? <div className="notification-empty-state">Chưa có bug report nào được gửi.</div> : null}

      {!loading && reports.length > 0 ? (
        <div className="site-notice-bug-list">
          {reports.map((report) => (
            <article key={report.id} className="site-notice-bug-item">
              <div className="site-notice-bug-item__header">
                <div>
                  <strong>{report.title}</strong>
                  <p>{report.description}</p>
                </div>
                <span className="site-notice-chip site-notice-chip--soft">{report.severity}</span>
              </div>

              <div className="site-notice-bug-item__meta">
                <span>Người gửi: {report.profiles?.name || report.profiles?.email || 'Guest'}</span>
                <span>Trang: {report.page_url || 'Không có'}</span>
                <span>Gửi lúc: {formatDateTime(report.created_at)}</span>
              </div>

              <div className="site-notice-bug-item__footer">
                <label className="st-card__field">
                  <span className="st-card__label">Trạng thái</span>
                  <select
                    className="st-card__input"
                    value={report.status}
                    onChange={(event) => handleStatusChange(report.id, event.target.value)}
                    disabled={updatingId === report.id}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="st-card__field site-notice-bug-item__user-agent">
                  <span className="st-card__label">User agent</span>
                  <textarea className="st-card__input st-card__textarea" rows="2" value={report.user_agent || 'Không có'} readOnly />
                </label>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default AdminBugReportManager
