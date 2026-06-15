import {
  getNotificationAudiencePreview,
  getNotificationCapabilityAudit,
  getSystemNotificationHistory as getSharedSystemNotificationHistory,
  revokeSystemNotificationBatch,
  sendBulkSystemNotification,
} from './notificationService'

export async function previewSystemNotificationAudience(options) {
  return getNotificationAudiencePreview(options)
}

export async function sendSystemNotification({
  targetType,
  targetValue = '',
  title,
  message,
  notificationType = 'system',
  severity = 'info',
  actionUrl = '',
}) {
  return sendBulkSystemNotification({
    targetType,
    targetValue,
    title,
    message,
    notificationType,
    severity,
    actionUrl,
  })
}

export async function getSystemNotificationHistory() {
  return getSharedSystemNotificationHistory()
}

export async function revokeSystemNotification(batchId) {
  return revokeSystemNotificationBatch(batchId)
}

export async function getSystemNotificationCapabilityAudit() {
  return getNotificationCapabilityAudit()
}
