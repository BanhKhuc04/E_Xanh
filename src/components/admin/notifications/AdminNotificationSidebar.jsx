import { useMemo } from 'react'
import {
  NOTIFICATION_TYPES,
  ROLE_OPTIONS,
  SEVERITY_OPTIONS,
  TARGET_OPTIONS,
  getNotificationTypeBadgeClass,
  getOptionMeta,
  getSeverityBadgeClass
} from './constants'

export default function AdminNotificationSidebar({
  form,
  effectivePreview,
  capabilityAudit
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
            <strong>{effectivePreview.count || 0}</strong>
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
  )
}
