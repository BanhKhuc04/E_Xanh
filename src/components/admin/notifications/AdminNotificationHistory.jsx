import { useState } from 'react'
import {
  NOTIFICATION_TYPES,
  SEVERITY_OPTIONS,
  formatDateTime,
  getNotificationTypeBadgeClass,
  getOptionMeta,
  getSeverityBadgeClass,
  getTargetSummary
} from './constants'

export default function AdminNotificationHistory({
  history,
  historyLoading,
  historyError,
  revokingBatchId,
  loadHistory,
  handleRevoke
}) {
  const [selectedHistory, setSelectedHistory] = useState(null)

  return (
    <>
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
    </>
  )
}
