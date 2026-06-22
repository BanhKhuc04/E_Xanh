import { supabase } from '../lib/supabase'
import { getCurrentSession } from './authService'
import { getCurrentProfile, normalizeUserPreferences } from './profileService'
import { logError, logWarn } from '../utils/logger'
import { isStaff } from '../utils/permissions'

const TABLES = {
  modernNotifications: 'notifications',
  legacyNotifications: 'user_notifications',
  batches: 'notification_batches',
}

const AVAILABILITY_CACHE = new Map()

function buildError(message, source = null, meta = {}) {
  return {
    message,
    source,
    ...meta,
  }
}

function isMissingRelationError(error) {
  return error?.code === 'PGRST205' || String(error?.message || '').toLowerCase().includes('could not find the table')
}

function isMissingColumnError(error) {
  return error?.code === '42703' || String(error?.message || '').toLowerCase().includes('does not exist')
}

function isPermissionError(error) {
  const message = String(error?.message || '').toLowerCase()
  return (
    message.includes('permission') ||
    message.includes('row-level security') ||
    message.includes('not authorized') ||
    message.includes('forbidden')
  )
}

async function isTableAvailable(tableName, force = false) {
  if (!supabase) return false
  if (force) AVAILABILITY_CACHE.delete(tableName)
  if (AVAILABILITY_CACHE.has(tableName)) {
    return AVAILABILITY_CACHE.get(tableName)
  }

  const { error } = await supabase.from(tableName).select('*').limit(1)
  const available = !isMissingRelationError(error)
  AVAILABILITY_CACHE.set(tableName, available)
  
  if (!available) {
    setTimeout(() => {
      AVAILABILITY_CACHE.delete(tableName)
    }, 10000)
  }
  
  return available
}

export function clearNotificationCache() {
  AVAILABILITY_CACHE.clear()
}

function mapNotificationFeedError(error) {
  if (isMissingRelationError(error)) {
    return buildError(
      'Supabase chưa có bảng notifications. Hãy chạy migration notification center để kích hoạt chuông thông báo thật.',
      error,
      { code: 'notification_table_missing' },
    )
  }

  if (isPermissionError(error)) {
    return buildError(
      'Supabase RLS đang chặn truy cập thông báo. Hãy kiểm tra lại policy của bảng notifications.',
      error,
      { code: 'notification_rls_denied' },
    )
  }

  return buildError('Không thể tải thông báo từ Supabase.', error)
}

function mapNotificationAdminError(error, actionLabel) {
  if (isMissingRelationError(error)) {
    return buildError(
      `Supabase chưa có bảng notifications/notification_batches để ${actionLabel}. Hãy chạy migration notification center.`,
      error,
      { code: 'notification_migration_required' },
    )
  }

  if (isPermissionError(error)) {
    return buildError(
      `Supabase RLS đang chặn thao tác ${actionLabel} thông báo.`,
      error,
      { code: 'notification_rls_denied' },
    )
  }

  if (isMissingColumnError(error)) {
    return buildError(
      `Schema thông báo trên Supabase chưa đủ cột để ${actionLabel}. Hãy apply migration mới nhất.`,
      error,
      { code: 'notification_schema_outdated' },
    )
  }

  return buildError(`Không thể ${actionLabel} thông báo.`, error)
}

function normalizeLegacyType(type, severity = 'info') {
  if (type === 'account' || type === 'role') {
    return type
  }

  if (severity === 'critical') return 'danger'
  if (severity === 'warning') return 'warning'
  return 'info'
}

function normalizeSeverity(value) {
  if (['info', 'warning', 'critical'].includes(value)) return value
  return 'info'
}

function normalizeNotificationType(value) {
  if (typeof value !== 'string' || value.trim() === '') return 'system'
  return value.trim()
}

function buildNotificationActionUrl(record) {
  if (record?.action_url) return record.action_url

  if (record?.related_type === 'link' && record?.related_id) {
    return record.related_id
  }

  return null
}

function normalizeNotificationRow(row, backend) {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title || 'Thông báo hệ thống',
    message: row.message || '',
    type: backend === TABLES.modernNotifications
      ? normalizeNotificationType(row.type)
      : normalizeNotificationType(row.notification_type || row.type),
    severity: normalizeSeverity(row.severity || row.type),
    is_read: Boolean(row.is_read),
    created_at: row.created_at,
    action_url: buildNotificationActionUrl(row),
    related_type: row.related_type || null,
    related_id: row.related_id || null,
    batch_id: row.batch_id || (row.related_type === 'system_batch' ? row.related_id : null),
    revoked_at: row.revoked_at || null,
  }
}

function matchesNotificationPreference(item, preferences) {
  const type = normalizeNotificationType(item?.type)

  if (item?.related_type === 'comment' || type === 'comment_warning' || type === 'moderation') {
    return preferences.notify_comment_moderation
  }

  if (item?.related_type === 'system_batch' || ['system', 'info', 'warning', 'danger', 'success'].includes(type)) {
    return preferences.notify_system
  }

  if (['post_review', 'post_approved', 'post_rejected', 'post_status'].includes(type)) {
    return preferences.notify_post_review
  }

  if (['interaction', 'follow', 'reply', 'mention', 'account', 'role'].includes(type)) {
    return preferences.notify_interactions
  }

  return true
}

async function getNotificationBackend() {
  const hasModern = await isTableAvailable(TABLES.modernNotifications)
  if (hasModern) return TABLES.modernNotifications

  const hasLegacy = await isTableAvailable(TABLES.legacyNotifications)
  if (hasLegacy) return TABLES.legacyNotifications

  return null
}

async function requireStaffSession() {
  const session = await getCurrentSession()
  if (!session?.user) {
    return {
      session: null,
      error: buildError('Bạn cần đăng nhập bằng tài khoản quản trị để thực hiện thao tác này.'),
    }
  }

  const profileResult = await getCurrentProfile()
  if (profileResult.error || !profileResult.data) {
    return {
      session: null,
      profile: null,
      error: buildError('Không thể xác thực hồ sơ staff hiện tại từ bảng profiles.', profileResult.error),
    }
  }

  if (!isStaff(profileResult.data) || profileResult.data.status !== 'active') {
    return {
      session: null,
      profile: null,
      error: buildError('Chỉ admin hoặc moderator đang hoạt động mới được gửi thông báo hệ thống.'),
    }
  }

  return { session, profile: profileResult.data, error: null }
}

function isUuidLike(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function isEmailLike(value) {
  return value.includes('@')
}

async function resolveSpecificProfile(targetValue) {
  if (!targetValue) {
    return { data: [], error: null }
  }

  const normalizedValue = String(targetValue).trim()
  if (!normalizedValue) {
    return { data: [], error: null }
  }

  if (isEmailLike(normalizedValue)) {
    const byEmail = await supabase
      .from('profiles')
      .select('id, name, email, role, status')
      .ilike('email', normalizedValue)
      .eq('status', 'active')
      .limit(1)

    return { data: byEmail.data || [], error: byEmail.error }
  }

  if (isUuidLike(normalizedValue)) {
    const byId = await supabase
      .from('profiles')
      .select('id, name, email, role, status')
      .eq('id', normalizedValue)
      .eq('status', 'active')
      .limit(1)

    if (byId.error) {
      return { data: [], error: byId.error }
    }

    if ((byId.data || []).length > 0) {
      return { data: byId.data, error: null }
    }
  }

  const byEmail = await supabase
    .from('profiles')
    .select('id, name, email, role, status')
    .ilike('email', normalizedValue)
    .eq('status', 'active')
    .limit(1)

  return { data: byEmail.data || [], error: byEmail.error }
}

export async function getNotificationAudiencePreview({
  targetType = 'all_active',
  targetValue = '',
} = {}) {
  if (!supabase) {
    return {
      data: { recipients: [], count: 0 },
      error: buildError('Supabase chưa được cấu hình trong môi trường hiện tại.'),
    }
  }

  let result

  if (targetType === 'all_active') {
    result = await supabase
      .from('profiles')
      .select('id, name, email, role, status')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
  } else if (targetType === 'role') {
    result = await supabase
      .from('profiles')
      .select('id, name, email, role, status')
      .eq('status', 'active')
      .eq('role', targetValue)
      .order('created_at', { ascending: false })
  } else if (targetType === 'specific_user') {
    result = await resolveSpecificProfile(targetValue)
  } else {
    return {
      data: { recipients: [], count: 0 },
      error: buildError('Đối tượng nhận thông báo không hợp lệ.'),
    }
  }

  if (result.error) {
    logError('[Notifications] Lỗi lấy danh sách người nhận', result.error)
    return {
      data: { recipients: [], count: 0 },
      error: mapNotificationAdminError(result.error, 'xác định người nhận'),
    }
  }

  const recipients = (result.data || []).map((profile) => ({
    id: profile.id,
    name: profile.name || profile.email || 'Người dùng E-XANH',
    email: profile.email || '',
    role: profile.role || 'user',
    status: profile.status || 'active',
  }))

  return {
    data: {
      recipients,
      count: recipients.length,
    },
    error: null,
  }
}

export async function getMyNotifications({ limit = 8 } = {}) {
  if (!supabase) {
    return {
      data: { items: [], unreadCount: 0, supported: false, backend: null },
      error: buildError('Supabase chưa được cấu hình trong môi trường hiện tại.'),
    }
  }

  const backend = await getNotificationBackend()
  if (!backend) {
    return {
      data: { items: [], unreadCount: 0, supported: false, backend: null },
      error: null,
    }
  }

  const modernColumns = 'id,user_id,type,severity,title,message,action_url,related_type,related_id,is_read,batch_id,created_at,revoked_at'
  const legacyColumns = 'id,user_id,title,message,type,action_url,related_type,related_id,is_read,created_at'

  let listQuery = supabase
    .from(backend)
    .select(backend === TABLES.modernNotifications ? modernColumns : legacyColumns)
    .order('created_at', { ascending: false })
    .limit(Math.max(limit * 3, 24))

  // Fetch minimal columns for unread so we can apply preference filtering
  // (HEAD count skips matchesNotificationPreference, causing badge vs. list mismatch)
  let unreadQuery = supabase
    .from(backend)
    .select(
      backend === TABLES.modernNotifications
        ? 'id,type,related_type,revoked_at'
        : 'id,type,related_type'
    )
    .eq('is_read', false)

  if (backend === TABLES.modernNotifications) {
    listQuery = listQuery.is('revoked_at', null)
    unreadQuery = unreadQuery.is('revoked_at', null)
  }

  const [listResult, unreadResult, profileResult] = await Promise.all([
    listQuery,
    unreadQuery,
    getCurrentProfile(),
  ])

  if (listResult.error) {
    logError('[Notifications] Lỗi tải danh sách thông báo', listResult.error)
    return {
      data: { items: [], unreadCount: 0, supported: true, backend },
      error: mapNotificationFeedError(listResult.error),
    }
  }

  if (unreadResult.error) {
    logWarn('[Notifications] Lỗi đếm unread notifications', unreadResult.error)
  }

  const preferences = normalizeUserPreferences(profileResult.data?.user_preferences)
  const filteredItems = (listResult.data || [])
    .map((row) => normalizeNotificationRow(row, backend))
    .filter((item) => matchesNotificationPreference(item, preferences))
    .slice(0, limit)

  // Count only unread items that pass the same preference filter as the list
  const filteredUnreadCount = unreadResult.error
    ? 0
    : (unreadResult.data || []).filter((item) => matchesNotificationPreference(item, preferences)).length

  return {
    data: {
      items: filteredItems,
      unreadCount: filteredUnreadCount,
      supported: true,
      backend,
    },
    error: null,
  }
}

export async function markNotificationAsRead(notificationId) {
  if (!supabase) {
    return { data: null, error: buildError('Supabase chưa được cấu hình trong môi trường hiện tại.') }
  }

  const backend = await getNotificationBackend()
  if (!backend) {
    return { data: null, error: buildError('Bảng thông báo chưa sẵn sàng.') }
  }

  const { data, error } = await supabase
    .from(backend)
    .update({ is_read: true })
    .eq('id', notificationId)
    .select('id, is_read')
    .single()

  if (error) {
    logError('[Notifications] Lỗi đánh dấu đã đọc', error)
    return { data: null, error: mapNotificationFeedError(error) }
  }

  return { data, error: null }
}

export async function markAllNotificationsAsRead() {
  if (!supabase) {
    return { data: null, error: buildError('Supabase chưa được cấu hình trong môi trường hiện tại.') }
  }

  const backend = await getNotificationBackend()
  if (!backend) {
    return { data: null, error: buildError('Bảng thông báo chưa sẵn sàng.') }
  }

  let query = supabase
    .from(backend)
    .update({ is_read: true })
    .eq('is_read', false)
    .select('id')

  if (backend === TABLES.modernNotifications) {
    query = query.is('revoked_at', null)
  }

  const { data, error } = await query

  if (error) {
    logError('[Notifications] Lỗi đánh dấu tất cả đã đọc', error)
    return { data: null, error: mapNotificationFeedError(error) }
  }

  return { data, error: null }
}

export async function getNotificationCapabilityAudit() {
  const [modernNotifications, legacyNotifications, batches] = await Promise.all([
    isTableAvailable(TABLES.modernNotifications),
    isTableAvailable(TABLES.legacyNotifications),
    isTableAvailable(TABLES.batches),
  ])

  return {
    modernNotifications,
    legacyNotifications,
    batches,
  }
}

export async function sendBulkSystemNotification({
  targetType,
  targetValue = '',
  title,
  message,
  notificationType = 'system',
  severity = 'info',
  actionUrl = '',
} = {}) {
  const { profile, error: sessionError } = await requireStaffSession()
  if (sessionError) {
    return { data: null, error: sessionError }
  }

  if (!(await isTableAvailable(TABLES.modernNotifications)) || !(await isTableAvailable(TABLES.batches))) {
    return {
      data: null,
      error: buildError(
        'Supabase thật hiện chưa có đủ bảng notifications + notification_batches. Hãy chạy migration notification center trước khi gửi thông báo hàng loạt.',
        null,
        { code: 'notification_migration_required' },
      ),
    }
  }

  const audienceResult = await getNotificationAudiencePreview({ targetType, targetValue })
  if (audienceResult.error) {
    return { data: null, error: audienceResult.error }
  }

  const recipients = audienceResult.data.recipients
  if (recipients.length === 0) {
    return {
      data: null,
      error: buildError('Không tìm thấy người dùng active phù hợp với đối tượng nhận.'),
    }
  }

  const batchId = crypto.randomUUID()
  const createdAt = new Date().toISOString()

  const batchPayload = {
    id: batchId,
    title: title.trim(),
    message: message.trim(),
    notification_type: normalizeNotificationType(notificationType),
    severity: normalizeSeverity(severity),
    action_url: actionUrl?.trim() || null,
    target_type: targetType,
    target_value: targetValue?.trim() ? { value: targetValue.trim() } : null,
    recipient_count: recipients.length,
    created_by: profile.id,
    created_at: createdAt,
  }

  const { error: batchError } = await supabase
    .from(TABLES.batches)
    .insert(batchPayload)

  if (batchError) {
    logError('[Notifications] Lỗi tạo batch thông báo', batchError)
    return { data: null, error: mapNotificationAdminError(batchError, 'tạo đợt gửi') }
  }

  const notificationRows = recipients.map((recipient) => ({
    user_id: recipient.id,
    type: normalizeNotificationType(notificationType),
    severity: normalizeSeverity(severity),
    title: title.trim(),
    message: message.trim(),
    action_url: actionUrl?.trim() || null,
    related_type: 'system_batch',
    related_id: batchId,
    batch_id: batchId,
    created_by: profile.id,
    created_at: createdAt,
  }))

  const chunkSize = 500
  for (let index = 0; index < notificationRows.length; index += chunkSize) {
    const chunk = notificationRows.slice(index, index + chunkSize)
    const { error } = await supabase.from(TABLES.modernNotifications).insert(chunk)

    if (error) {
      logError('[Notifications] Lỗi insert thông báo hàng loạt', error)
      return { data: null, error: mapNotificationAdminError(error, 'gửi') }
    }
  }

  return {
    data: {
      batchId,
      recipientCount: recipients.length,
      recipients,
    },
    error: null,
  }
}

export async function getSystemNotificationHistory() {
  const { error: sessionError } = await requireStaffSession()
  if (sessionError) {
    return { data: [], error: sessionError }
  }

  if (!(await isTableAvailable(TABLES.batches))) {
    return {
      data: [],
      error: buildError(
        'Supabase thật chưa có bảng notification_batches. Lịch sử gửi chỉ hoạt động sau khi apply migration notification center.',
        null,
        { code: 'notification_batch_missing' },
      ),
    }
  }

  const { data, error } = await supabase
    .from(TABLES.batches)
    .select(`
      id,
      title,
      message,
      notification_type,
      severity,
      action_url,
      target_type,
      target_value,
      recipient_count,
      created_by,
      created_at,
      revoked_at,
      revoked_by,
      created_by_profile:created_by (name, email),
      revoked_by_profile:revoked_by (name, email)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    logError('[Notifications] Lỗi tải lịch sử batch', error)
    return {
      data: [],
      error: mapNotificationAdminError(error, 'tải lịch sử'),
    }
  }

  const history = (data || []).map((item) => ({
    id: item.id,
    title: item.title || 'Thông báo hệ thống',
    message: item.message || '',
    notificationType: normalizeNotificationType(item.notification_type),
    severity: normalizeSeverity(item.severity),
    actionUrl: item.action_url || '',
    targetType: item.target_type || 'all_active',
    targetValue: item.target_value?.value || '',
    recipientCount: item.recipient_count || 0,
    createdAt: item.created_at,
    createdBy: item.created_by,
    createdByName: item.created_by_profile?.name || item.created_by_profile?.email || 'Quản trị viên',
    revokedAt: item.revoked_at,
    revokedBy: item.revoked_by,
    revokedByName: item.revoked_by_profile?.name || item.revoked_by_profile?.email || '',
    isRevoked: Boolean(item.revoked_at),
  }))

  return { data: history, error: null }
}

export async function revokeSystemNotificationBatch(batchId) {
  const { profile, error: sessionError } = await requireStaffSession()
  if (sessionError) {
    return { error: sessionError }
  }

  if (!(await isTableAvailable(TABLES.modernNotifications)) || !(await isTableAvailable(TABLES.batches))) {
    return {
      error: buildError(
        'Supabase thật chưa có đủ bảng notifications + notification_batches để thu hồi mềm thông báo.',
        null,
        { code: 'notification_migration_required' },
      ),
    }
  }

  const revokedAt = new Date().toISOString()

  const { error: batchError } = await supabase
    .from(TABLES.batches)
    .update({
      revoked_at: revokedAt,
      revoked_by: profile.id,
    })
    .eq('id', batchId)
    .is('revoked_at', null)

  if (batchError) {
    logError('[Notifications] Lỗi revoke batch', batchError)
    return { error: mapNotificationAdminError(batchError, 'thu hồi') }
  }

  const { error: notificationError } = await supabase
    .from(TABLES.modernNotifications)
    .update({
      revoked_at: revokedAt,
      revoked_by: profile.id,
    })
    .eq('batch_id', batchId)
    .is('revoked_at', null)

  if (notificationError) {
    logError('[Notifications] Lỗi revoke notification rows', notificationError)
    return { error: mapNotificationAdminError(notificationError, 'thu hồi') }
  }

  return { error: null }
}

export function clearNotificationCapabilityCache() {
  AVAILABILITY_CACHE.clear()
}

export async function getUnreadCount() {
  if (!supabase) return { count: 0, error: buildError('Supabase chưa cấu hình') }
  const backend = await getNotificationBackend()
  if (!backend) return { count: 0, error: null }
  
  let query = supabase.from(backend).select('id', { count: 'exact', head: true }).eq('is_read', false)
  if (backend === TABLES.modernNotifications) query = query.is('revoked_at', null)
  
  const { count, error } = await query
  return { count: count || 0, error }
}

export async function createNotification(payload) {
  if (!supabase) return { data: null, error: buildError('Supabase chưa cấu hình') }
  const backend = await getNotificationBackend()
  if (!backend) return { data: null, error: null }

  const session = await getCurrentSession()
  const createdBy = session?.user?.id || null

  const row = {
    user_id: payload.user_id || payload.userId,
    title: payload.title,
    message: payload.message || payload.content || '',
    type: normalizeNotificationType(payload.type || 'system'),
    severity: normalizeSeverity(payload.severity || 'info'),
    action_url: payload.actionUrl || payload.action_url || payload.link || null,
    related_type: payload.relatedType || payload.related_type || null,
    related_id: payload.relatedId || payload.related_id || null,
    created_by: createdBy
  }

  const { data, error } = await supabase.from(backend).insert(row).select().single()
  return { data, error }
}

export async function createNotificationForUser(userId, payload) {
  return createNotification({ ...payload, user_id: userId })
}

export async function createBulkNotifications(userIds, payload) {
  if (!supabase || !userIds?.length) return { data: null, error: buildError('Invalid input') }
  const backend = await getNotificationBackend()
  if (!backend) return { data: null, error: null }

  const session = await getCurrentSession()
  const createdBy = session?.user?.id || null

  const rows = userIds.map(userId => ({
    user_id: userId,
    title: payload.title,
    message: payload.message || payload.content || '',
    type: normalizeNotificationType(payload.type || 'system'),
    severity: normalizeSeverity(payload.severity || 'info'),
    action_url: payload.actionUrl || payload.action_url || payload.link || null,
    related_type: payload.relatedType || payload.related_type || null,
    related_id: payload.relatedId || payload.related_id || null,
    created_by: createdBy
  }))

  const { data, error } = await supabase.from(backend).insert(rows)
  return { data, error }
}

export async function notifyAdmins(payload) {
  if (!supabase) return { data: null, error: buildError('Supabase chưa cấu hình') }
  
  const { data: admins, error: adminError } = await supabase
    .from('profiles')
    .select('id')
    .in('role', ['admin', 'moderator'])
    .eq('status', 'active')

  if (adminError || !admins?.length) return { data: null, error: adminError }
  
  return createBulkNotifications(admins.map(a => a.id), payload)
}

export { TABLES as NOTIFICATION_TABLES, buildError as buildNotificationError, normalizeSeverity, normalizeNotificationType, normalizeLegacyType }
