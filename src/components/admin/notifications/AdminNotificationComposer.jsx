import { useMemo } from 'react'
import {
  INITIAL_FORM,
  NOTIFICATION_TYPES,
  ROLE_OPTIONS,
  SEVERITY_OPTIONS,
  TARGET_OPTIONS,
  getNotificationTypeBadgeClass,
  getOptionMeta,
  getSeverityBadgeClass
} from './constants'

export default function AdminNotificationComposer({
  form,
  setForm,
  previewLoading,
  submitting,
  previewRecipients,
  isPreviewTargetReady,
  effectivePreview,
  effectivePreviewError,
  canSubmit,
  handleFieldChange,
  handleSubmit
}) {
  const selectedNotificationTypeMeta = useMemo(
    () => getOptionMeta(NOTIFICATION_TYPES, form.notificationType, 'Hệ thống'),
    [form.notificationType],
  )
  const selectedSeverityMeta = useMemo(
    () => getOptionMeta(SEVERITY_OPTIONS, form.severity, 'Thông tin'),
    [form.severity],
  )

  return (
    <section className="st-card notification-compose-card">
      <div className="notification-section-heading">
        <div>
          <h3 className="st-card__title">Tạo thông báo mới</h3>
          <p className="st-card__helper">Chọn đúng đối tượng nhận, nhập nội dung và kiểm tra preview trước khi gửi.</p>
        </div>
        <span className="notification-count-pill">
          {previewLoading && isPreviewTargetReady
            ? 'Đang tính người nhận...'
            : `${effectivePreview.count || 0} người nhận`}
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

        {effectivePreviewError ? <div className="admin-alert admin-alert--error">{effectivePreviewError}</div> : null}

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
            {previewLoading && isPreviewTargetReady ? (
              <p>Đang kiểm tra người nhận thật từ Supabase...</p>
            ) : effectivePreview.count === 0 ? (
              <p>Chưa xác định được người nhận hợp lệ.</p>
            ) : (
              <div className="notification-preview-audience__chips">
                {previewRecipients.map((recipient) => (
                  <span key={recipient.id} className="notification-recipient-chip">
                    {recipient.name}
                    {recipient.email ? ` • ${recipient.email}` : ''}
                  </span>
                ))}
                {effectivePreview.count > previewRecipients.length ? (
                  <span className="notification-recipient-chip notification-recipient-chip--muted">
                    +{effectivePreview.count - previewRecipients.length} người nữa
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
  )
}
