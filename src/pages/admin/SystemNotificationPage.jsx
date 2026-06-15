import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getSystemNotificationCapabilityAudit,
  getSystemNotificationHistory,
  previewSystemNotificationAudience,
  revokeSystemNotification,
  sendSystemNotification,
} from '../../services/adminNotificationService'
import '../../styles/admin-settings.css'

const INITIAL_FORM = {
  targetType: 'all_active',
  targetValue: '',
  title: '',
  message: '',
  notificationType: 'system',
  severity: 'info',
  actionUrl: '',
}

const TARGET_OPTIONS = [
  {
    value: 'all_active',
    label: 'Tất cả người dùng active',
    description: 'Gửi tới toàn bộ tài khoản đang hoạt động.',
  },
  {
    value: 'role',
    label: 'Theo vai trò',
    description: 'Gửi theo nhóm user, moderator hoặc admin.',
  },
  {
    value: 'specific_user',
    label: 'Một người dùng cụ thể',
    description: 'Tra cứu theo email hoặc UUID của người nhận.',
  },
]

const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'admin', label: 'Admin' },
]

const NOTIFICATION_TYPES = [
  {
    value: 'system',
    label: 'Hệ thống',
    description: 'Thông báo vận hành chung cho toàn nền tảng.',
    recommendedSeverity: 'info',
  },
  {
    value: 'warning',
    label: 'Cảnh báo',
    description: 'Nhắc người dùng về thay đổi hoặc rủi ro cần chú ý.',
    recommendedSeverity: 'warning',
  },
  {
    value: 'moderation',
    label: 'Kiểm duyệt',
    description: 'Dùng cho bài viết, bình luận hoặc hành vi bị kiểm soát.',
    recommendedSeverity: 'warning',
  },
  {
    value: 'account',
    label: 'Tài khoản',
    description: 'Liên quan hồ sơ, bảo mật, xác minh hoặc quyền truy cập.',
    recommendedSeverity: 'info',
  },
  {
    value: 'post',
    label: 'Bài viết',
    description: 'Cập nhật tương tác hoặc trạng thái nội dung của người dùng.',
    recommendedSeverity: 'info',
  },
]

const SEVERITY_OPTIONS = [
  { value: 'info', label: 'Thông tin', description: 'Nhẹ nhàng, không tạo cảm giác khẩn cấp.' },
  { value: 'warning', label: 'Cảnh báo', description: 'Nên đọc sớm vì có thay đổi hoặc ảnh hưởng trực tiếp.' },
  { value: 'critical', label: 'Khẩn cấp', description: 'Mức ưu tiên cao nhất, chỉ dùng khi thật sự cần.' },
]

function getOptionMeta(options, value, fallbackLabel = value) {
  return options.find((option) => option.value === value) || { value, label: fallbackLabel, description: '', recommendedSeverity: 'info' }
}

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

function getTargetSummary(item) {
  if (item.targetType === 'all_active') return 'Tất cả người dùng active'
  if (item.targetType === 'role') return `Vai trò: ${item.targetValue || 'Chưa chọn'}`
  if (item.targetType === 'specific_user') return `Người dùng: ${item.targetValue || 'Chưa xác định'}`
  return item.targetType
}

function getSeverityBadgeClass(severity) {
  if (severity === 'critical') return 'st-badge st-badge--danger'
  if (severity === 'warning') return 'st-badge st-badge--warning'
  return 'st-badge st-badge--active'
}

function getNotificationTypeBadgeClass(type) {
  return `notification-tone-pill notification-tone-pill--${type || 'system'}`
}

function SystemNotificationPage() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState('')
  const [preview, setPreview] = useState({ recipients: [], count: 0 })
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [revokingBatchId, setRevokingBatchId] = useState('')
  const [toast, setToast] = useState(null)
  const [selectedHistory, setSelectedHistory] = useState(null)
  const [capabilityAudit, setCapabilityAudit] = useState(null)

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ message, tone })
    window.clearTimeout(showToast.timeoutId)
    showToast.timeoutId = window.setTimeout(() => setToast(null), 3200)
  }, [])

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true)
    const { data, error } = await getSystemNotificationHistory()

    if (error) {
      setHistory([])
      setHistoryError(error.message)
    } else {
      setHistory(data || [])
      setHistoryError('')
    }

    setHistoryLoading(false)
  }, [])

  const loadCapabilityAudit = useCallback(async () => {
    const data = await getSystemNotificationCapabilityAudit()
    setCapabilityAudit(data)
  }, [])

  useEffect(() => {
    loadHistory()
    loadCapabilityAudit()
  }, [loadHistory, loadCapabilityAudit])

  useEffect(() => {
    let cancelled = false

    async function loadPreview() {
      setPreviewLoading(true)
      setPreviewError('')

      const targetValue = form.targetType === 'role' ? form.targetValue : form.targetValue.trim()
      const { data, error } = await previewSystemNotificationAudience({
        targetType: form.targetType,
        targetValue,
      })

      if (cancelled) return

      if (error) {
        setPreview({ recipients: [], count: 0 })
        setPreviewError(error.message)
      } else {
        setPreview(data || { recipients: [], count: 0 })
        setPreviewError('')
      }

      setPreviewLoading(false)
    }

    if (form.targetType === 'specific_user' && !form.targetValue.trim()) {
      setPreview({ recipients: [], count: 0 })
      setPreviewError('')
      return undefined
    }

    if (form.targetType === 'role' && !form.targetValue) {
      setPreview({ recipients: [], count: 0 })
      setPreviewError('')
      return undefined
    }

    loadPreview()

    return () => {
      cancelled = true
    }
  }, [form.targetType, form.targetValue])

  const previewRecipients = useMemo(
    () => (preview.recipients || []).slice(0, 4),
    [preview.recipients],
  )
  const selectedNotificationTypeMeta = useMemo(
    () => getOptionMeta(NOTIFICATION_TYPES, form.notificationType, 'Hệ thống'),
    [form.notificationType],
  )
  const selectedSeverityMeta = useMemo(
    () => getOptionMeta(SEVERITY_OPTIONS, form.severity, 'Thông tin'),
    [form.severity],
  )

  const canSubmit = Boolean(
    form.title.trim() &&
    form.message.trim() &&
    preview.count > 0 &&
    !previewError &&
    !submitting,
  )

  function handleFieldChange(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value }

      if (field === 'targetType') {
        next.targetValue = value === 'role' ? 'user' : ''
      }

      return next
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim()) {
      showToast('Tiêu đề thông báo đang để trống.', 'error')
      return
    }

    if (!form.message.trim()) {
      showToast('Nội dung thông báo đang để trống.', 'error')
      return
    }

    if (preview.count <= 0) {
      showToast('Không có người nhận hợp lệ để gửi thông báo.', 'error')
      return
    }

    if (!window.confirm(`Bạn sắp gửi thông báo này tới ${preview.count} người dùng.`)) {
      return
    }

    setSubmitting(true)

    const { data, error } = await sendSystemNotification({
      targetType: form.targetType,
      targetValue: form.targetValue,
      title: form.title,
      message: form.message,
      notificationType: form.notificationType,
      severity: form.severity,
      actionUrl: form.actionUrl,
    })

    if (error) {
      showToast(error.message, 'error')
    } else {
      showToast(`Đã gửi thông báo tới ${data.recipientCount} người dùng.`)
      setForm(INITIAL_FORM)
      setPreview({ recipients: [], count: 0 })
      await loadHistory()
      await loadCapabilityAudit()
    }

    setSubmitting(false)
  }

  async function handleRevoke(batchId) {
    if (!window.confirm('Thu hồi batch này sẽ ẩn toàn bộ thông báo khỏi chuông người dùng. Bạn có chắc chắn không?')) {
      return
    }

    setRevokingBatchId(batchId)
    const { error } = await revokeSystemNotification(batchId)

    if (error) {
      showToast(error.message, 'error')
    } else {
      showToast('Đã thu hồi batch thông báo.')
      await loadHistory()
    }

    setRevokingBatchId('')
  }

  return (
    <div className="st-page page notification-center-page">
      <section className="st-page__hero">
        <span className="page-badge page-badge--soft">Thông báo nội bộ</span>
        <div className="st-page__hero-copy">
          <h2>Thông báo hệ thống</h2>
          <p>Gửi thông báo nội bộ tới người dùng và quản lý lịch sử gửi.</p>
        </div>
      </section>

      {capabilityAudit && (!capabilityAudit.modernNotifications || !capabilityAudit.batches) ? (
        <div className="admin-alert admin-alert--warning">
          Supabase thật hiện chưa đủ schema chuẩn cho Notification Center.
          {` notifications: ${capabilityAudit.modernNotifications ? 'OK' : 'thiếu'} • notification_batches: ${capabilityAudit.batches ? 'OK' : 'thiếu'}`}
        </div>
      ) : null}

      <div className="notification-center-grid">
        <section className="st-card notification-compose-card">
          <div className="notification-section-heading">
            <div>
              <h3 className="st-card__title">Tạo thông báo mới</h3>
              <p className="st-card__helper">Chọn đúng đối tượng nhận, nhập nội dung và kiểm tra preview trước khi gửi.</p>
            </div>
            <span className="notification-count-pill">
              {previewLoading ? 'Đang tính người nhận...' : `${preview.count || 0} người nhận`}
            </span>
          </div>

          <form className="notification-compose-form" onSubmit={handleSubmit}>
            <div className="notification-target-grid">
              {TARGET_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`notification-target-card${form.targetType === option.value ? ' is-active' : ''}`}
                  onClick={() => handleFieldChange('targetType', option.value)}
                >
                  <strong>{option.label}</strong>
                  <span>{option.description}</span>
                </button>
              ))}
            </div>

            <div className="notification-form-grid">
              {form.targetType === 'role' ? (
                <label className="st-card__field">
                  <span className="st-card__label">Vai trò nhận</span>
                  <select
                    className="st-card__input"
                    value={form.targetValue}
                    onChange={(event) => handleFieldChange('targetValue', event.target.value)}
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {form.targetType === 'specific_user' ? (
                <label className="st-card__field">
                  <span className="st-card__label">Email hoặc UUID người nhận</span>
                  <input
                    className="st-card__input"
                    value={form.targetValue}
                    onChange={(event) => handleFieldChange('targetValue', event.target.value)}
                    placeholder="vd: user@exanh.vn hoặc UUID"
                  />
                </label>
              ) : null}

              <label className="st-card__field">
                <span className="st-card__label">Loại thông báo</span>
                <select
                  className="st-card__input"
                  value={form.notificationType}
                  onChange={(event) => handleFieldChange('notificationType', event.target.value)}
                >
                  {NOTIFICATION_TYPES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="notification-field-note">
                  <span className={getNotificationTypeBadgeClass(form.notificationType)}>
                    {selectedNotificationTypeMeta.label}
                  </span>
                  {selectedNotificationTypeMeta.description} Gợi ý mức độ: {getOptionMeta(SEVERITY_OPTIONS, selectedNotificationTypeMeta.recommendedSeverity, selectedNotificationTypeMeta.recommendedSeverity).label}.
                </span>
              </label>

              <label className="st-card__field">
                <span className="st-card__label">Mức độ</span>
                <select
                  className="st-card__input"
                  value={form.severity}
                  onChange={(event) => handleFieldChange('severity', event.target.value)}
                >
                  {SEVERITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="notification-field-note">
                  <span className={getSeverityBadgeClass(form.severity)}>
                    {selectedSeverityMeta.label}
                  </span>
                  {selectedSeverityMeta.description}
                </span>
              </label>

              <label className="st-card__field notification-form-grid__full">
                <span className="st-card__label">Tiêu đề</span>
                <input
                  className="st-card__input"
                  value={form.title}
                  onChange={(event) => handleFieldChange('title', event.target.value)}
                  placeholder="Ví dụ: Hệ thống sẽ bảo trì ngắn trong đêm nay"
                />
              </label>

              <label className="st-card__field notification-form-grid__full">
                <span className="st-card__label">Nội dung</span>
                <textarea
                  className="st-card__input st-card__textarea"
                  rows="5"
                  value={form.message}
                  onChange={(event) => handleFieldChange('message', event.target.value)}
                  placeholder="Mô tả rõ nội dung thông báo, phạm vi ảnh hưởng và hướng dẫn cần thiết."
                />
              </label>

              <label className="st-card__field notification-form-grid__full">
                <span className="st-card__label">Link liên quan</span>
                <input
                  className="st-card__input"
                  value={form.actionUrl}
                  onChange={(event) => handleFieldChange('actionUrl', event.target.value)}
                  placeholder="/admin/quan-ly-binh-luan hoặc https://..."
                />
              </label>
            </div>

            {previewError ? <div className="admin-alert admin-alert--error">{previewError}</div> : null}

            <div className="notification-preview-panel">
              <div className="notification-preview-panel__header">
                <div>
                  <strong>Preview chuông thông báo</strong>
                  <p>Người dùng sẽ nhìn thấy thông báo gần giống như block dưới đây.</p>
                </div>
                <div className="notification-preview-panel__badges">
                  <span className={getNotificationTypeBadgeClass(form.notificationType)}>
                    {selectedNotificationTypeMeta.label}
                  </span>
                  <span className={getSeverityBadgeClass(form.severity)}>
                    {selectedSeverityMeta.label}
                  </span>
                </div>
              </div>

              <article className={`notification-preview-item notification-preview-item--${form.severity}`}>
                <div className="notification-preview-item__copy">
                  <strong>{form.title.trim() || 'Tiêu đề thông báo sẽ hiển thị ở đây'}</strong>
                  <p>{form.message.trim() || 'Nội dung thông báo sẽ hiển thị ở đây để admin kiểm tra trước khi gửi.'}</p>
                </div>
                <div className="notification-preview-item__meta">
                  <span className={getNotificationTypeBadgeClass(form.notificationType)}>
                    {selectedNotificationTypeMeta.label}
                  </span>
                  <span>{form.actionUrl.trim() ? 'Có link chi tiết' : 'Không có link'}</span>
                </div>
              </article>

              <div className="notification-preview-audience">
                <strong>Người nhận dự kiến</strong>
                {previewLoading ? (
                  <p>Đang kiểm tra người nhận thật từ Supabase...</p>
                ) : preview.count === 0 ? (
                  <p>Chưa xác định được người nhận hợp lệ.</p>
                ) : (
                  <div className="notification-preview-audience__chips">
                    {previewRecipients.map((recipient) => (
                      <span key={recipient.id} className="notification-recipient-chip">
                        {recipient.name}
                        {recipient.email ? ` • ${recipient.email}` : ''}
                      </span>
                    ))}
                    {preview.count > previewRecipients.length ? (
                      <span className="notification-recipient-chip notification-recipient-chip--muted">
                        +{preview.count - previewRecipients.length} người nữa
                      </span>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            <div className="st-card__actions">
              <button type="submit" className="btn btn--primary" disabled={!canSubmit}>
                {submitting ? 'Đang gửi...' : 'Gửi thông báo'}
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setForm(INITIAL_FORM)}
                disabled={submitting}
              >
                Làm mới form
              </button>
            </div>
          </form>
        </section>

        <aside className="notification-sidebar">
          <section className="st-card notification-sidebar-card">
            <h3 className="st-card__title">Tóm tắt đợt gửi</h3>
            <div className="notification-summary-list">
              <div>
                <span>Đối tượng nhận</span>
                <strong>{TARGET_OPTIONS.find((item) => item.value === form.targetType)?.label}</strong>
              </div>
              <div>
                <span>Phạm vi cụ thể</span>
                <strong>{form.targetType === 'role' ? (ROLE_OPTIONS.find((item) => item.value === form.targetValue)?.label || 'Chưa chọn') : form.targetValue || 'Tự động theo nhóm'}</strong>
              </div>
              <div>
                <span>Loại / Mức độ</span>
                <div className="notification-summary-badges">
                  <strong className={getNotificationTypeBadgeClass(form.notificationType)}>{selectedNotificationTypeMeta.label}</strong>
                  <strong className={getSeverityBadgeClass(form.severity)}>{selectedSeverityMeta.label}</strong>
                </div>
              </div>
              <div>
                <span>Người nhận hợp lệ</span>
                <strong>{preview.count || 0}</strong>
              </div>
            </div>
          </section>

          <section className="st-card notification-sidebar-card">
            <h3 className="st-card__title">Kiểm tra backend</h3>
            <div className="notification-capability-list">
              <div>
                <span>Bảng `notifications`</span>
                <strong>{capabilityAudit?.modernNotifications ? 'Sẵn sàng' : 'Thiếu / chưa migrate'}</strong>
              </div>
              <div>
                <span>Bảng `notification_batches`</span>
                <strong>{capabilityAudit?.batches ? 'Sẵn sàng' : 'Thiếu / chưa migrate'}</strong>
              </div>
              <div>
                <span>Bảng `user_notifications` cũ</span>
                <strong>{capabilityAudit?.legacyNotifications ? 'Có tồn tại' : 'Không có'}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <section className="st-card notification-history-card">
        <div className="notification-section-heading">
          <div>
            <h3 className="st-card__title">Lịch sử gửi thông báo</h3>
            <p className="st-card__helper">Dữ liệu lấy theo batch gửi để quản lý trạng thái hoạt động và thu hồi.</p>
          </div>
          <button type="button" className="btn btn--secondary" onClick={loadHistory} disabled={historyLoading}>
            {historyLoading ? 'Đang tải...' : 'Tải lại'}
          </button>
        </div>

        {historyError ? <div className="admin-alert admin-alert--error">{historyError}</div> : null}

        {historyLoading ? (
          <div className="notification-empty-state">Đang tải lịch sử gửi từ Supabase...</div>
        ) : history.length === 0 ? (
          <div className="notification-empty-state">Chưa có batch thông báo nào được ghi nhận.</div>
        ) : (
          <div className="notification-history-list">
            {history.map((item) => (
              <article key={item.id} className={`notification-history-item${item.isRevoked ? ' is-revoked' : ''}`}>
                <div className="notification-history-item__main">
                  <div className="notification-history-item__heading">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.message.slice(0, 140)}{item.message.length > 140 ? '...' : ''}</p>
                    </div>
                    <span className={item.isRevoked ? 'st-badge st-badge--warning' : 'st-badge st-badge--active'}>
                      {item.isRevoked ? 'Đã thu hồi' : 'Đang hoạt động'}
                    </span>
                  </div>

                  <div className="notification-history-meta">
                    <span>Đối tượng: {getTargetSummary(item)}</span>
                    <span>Loại: {getOptionMeta(NOTIFICATION_TYPES, item.notificationType, item.notificationType).label}</span>
                    <span>Mức độ: {getOptionMeta(SEVERITY_OPTIONS, item.severity, item.severity).label}</span>
                    <span>Người nhận: {item.recipientCount}</span>
                    <span>Người gửi: {item.createdByName}</span>
                    <span>Gửi lúc: {formatDateTime(item.createdAt)}</span>
                  </div>
                </div>

                <div className="notification-history-actions">
                  <button type="button" className="btn btn--secondary" onClick={() => setSelectedHistory(item)}>
                    Xem chi tiết
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost notification-danger-btn"
                    onClick={() => handleRevoke(item.id)}
                    disabled={item.isRevoked || revokingBatchId === item.id}
                  >
                    {revokingBatchId === item.id ? 'Đang thu hồi...' : 'Thu hồi'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedHistory ? (
        <div className="notification-detail-overlay" role="dialog" aria-modal="true">
          <div className="notification-detail-modal">
            <div className="notification-detail-modal__header">
              <div>
                <h3>{selectedHistory.title}</h3>
                <p>{selectedHistory.isRevoked ? 'Batch này đã bị thu hồi.' : 'Batch hiện đang hoạt động trong chuông thông báo.'}</p>
              </div>
              <button type="button" className="notification-detail-modal__close" onClick={() => setSelectedHistory(null)} aria-label="Đóng">
                ×
              </button>
            </div>

            <div className="notification-detail-grid">
              <div>
                <span>Đối tượng nhận</span>
                <strong>{getTargetSummary(selectedHistory)}</strong>
              </div>
              <div>
                <span>Người nhận</span>
                <strong>{selectedHistory.recipientCount}</strong>
              </div>
              <div>
                <span>Người gửi</span>
                <strong>{selectedHistory.createdByName}</strong>
              </div>
              <div>
                <span>Thời gian gửi</span>
                <strong>{formatDateTime(selectedHistory.createdAt)}</strong>
              </div>
              <div>
                <span>Loại / Mức độ</span>
                <div className="notification-summary-badges">
                  <strong className={getNotificationTypeBadgeClass(selectedHistory.notificationType)}>
                    {getOptionMeta(NOTIFICATION_TYPES, selectedHistory.notificationType, selectedHistory.notificationType).label}
                  </strong>
                  <strong className={getSeverityBadgeClass(selectedHistory.severity)}>
                    {getOptionMeta(SEVERITY_OPTIONS, selectedHistory.severity, selectedHistory.severity).label}
                  </strong>
                </div>
              </div>
              <div>
                <span>Link liên quan</span>
                <strong>{selectedHistory.actionUrl || 'Không có'}</strong>
              </div>
              <div className="notification-detail-grid__full">
                <span>Nội dung đầy đủ</span>
                <p>{selectedHistory.message}</p>
              </div>
              {selectedHistory.isRevoked ? (
                <div className="notification-detail-grid__full">
                  <span>Thông tin thu hồi</span>
                  <p>
                    Thu hồi lúc {formatDateTime(selectedHistory.revokedAt)}
                    {selectedHistory.revokedByName ? ` bởi ${selectedHistory.revokedByName}` : ''}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className={`st-toast${toast.tone ? ` st-toast--${toast.tone}` : ''}`} role="alert" aria-live="assertive">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 12.5 10 15l7-7M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          </svg>
          {toast.message}
        </div>
      ) : null}
    </div>
  )
}

export default SystemNotificationPage
