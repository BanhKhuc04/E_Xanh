import { useCallback, useEffect, useRef, useState } from 'react'
import AdminBugReportManager from '../../components/admin/settings/AdminBugReportManager'
import AdminSiteNoticeManager from '../../components/admin/settings/AdminSiteNoticeManager'
import AdminNotificationComposer from '../../components/admin/notifications/AdminNotificationComposer'
import AdminNotificationSidebar from '../../components/admin/notifications/AdminNotificationSidebar'
import AdminNotificationHistory from '../../components/admin/notifications/AdminNotificationHistory'
import { useNotificationHistory } from '../../components/admin/notifications/useNotificationHistory'
import { useNotificationComposer } from '../../components/admin/notifications/useNotificationComposer'
import { getSystemNotificationCapabilityAudit } from '../../services/adminNotificationService'
import '../../styles/admin-settings.css'

function SystemNotificationPage() {
  const [toast, setToast] = useState(null)
  const [capabilityAudit, setCapabilityAudit] = useState(null)
  const toastTimeoutRef = useRef(null)

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ message, tone })
    window.clearTimeout(toastTimeoutRef.current)
    toastTimeoutRef.current = window.setTimeout(() => setToast(null), 3200)
  }, [])

  const {
    history,
    historyLoading,
    historyError,
    revokingBatchId,
    loadHistory,
    handleRevoke
  } = useNotificationHistory(showToast)

  const loadCapabilityAudit = useCallback(async () => {
    const data = await getSystemNotificationCapabilityAudit()
    setCapabilityAudit(data)
  }, [])

  const composerProps = useNotificationComposer(loadHistory, loadCapabilityAudit, showToast)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void loadHistory()
      void loadCapabilityAudit()
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [loadHistory, loadCapabilityAudit])

  useEffect(() => {
    return () => {
      window.clearTimeout(toastTimeoutRef.current)
    }
  }, [])

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

      <AdminSiteNoticeManager />
      <AdminBugReportManager />

      <div className="notification-center-grid">
        <AdminNotificationComposer {...composerProps} />

        <AdminNotificationSidebar
          form={composerProps.form}
          effectivePreview={composerProps.effectivePreview}
          capabilityAudit={capabilityAudit}
        />
      </div>

      <AdminNotificationHistory
        history={history}
        historyLoading={historyLoading}
        historyError={historyError}
        revokingBatchId={revokingBatchId}
        loadHistory={loadHistory}
        handleRevoke={handleRevoke}
      />

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
