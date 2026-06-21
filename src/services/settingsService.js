import { supabase } from '../lib/supabase'
import { getAdminStats } from './analyticsService'
import { logError, logWarn } from '../utils/logger'
import { getCurrentSession, getCurrentUserProfile } from './authService'

export const DEFAULT_PLATFORM_SETTINGS = {
  site_name: 'E-XANH',
  site_slogan: 'Dùng điện thông minh, sống xanh bền vững.',
  support_email: 'support@exanh.vn',
  site_description:
    'E-XANH giúp người trẻ tiết kiệm điện, chia sẻ kinh nghiệm sống xanh và theo dõi chi phí điện hằng tháng.',
  require_post_approval: true,
  enable_comment_moderation: true,
  allow_reporting: true,
  auto_hide_reported: false,
  notify_new_post_pending: true,
  notify_reported_comment: true,
  notify_new_user: false,
  auto_logout_admin_minutes: 30,
  saved_posts_hero_image: '',
}

const TABLE_CACHE = {
  admin_action_logs: null,
  system_backups: null,
  system_settings: null,
  platform_settings: null,
}

function buildError(message, source = null) {
  return { message, source }
}

function isMissingRelationError(error) {
  const message = String(error?.message || '').toLowerCase()
  return error?.code === '42P01' || error?.code === 'PGRST205' || message.includes('does not exist')
}

function isPermissionError(error) {
  const message = String(error?.message || '').toLowerCase()
  return (
    message.includes('permission') ||
    message.includes('row-level security') ||
    message.includes('policy') ||
    message.includes('not authorized') ||
    message.includes('forbidden')
  )
}

function encodeSettingValue(value) {
  return value === undefined ? null : value
}

function decodeSettingValue(value, fallback) {
  if (value === null || value === undefined) return fallback
  return value
}

async function isTableAvailable(tableName, force = false) {
  if (force) TABLE_CACHE[tableName] = null
  if (TABLE_CACHE[tableName] !== null) {
    return TABLE_CACHE[tableName]
  }

  const { error } = await supabase.from(tableName).select('*').limit(1)
  const available = !isMissingRelationError(error)
  TABLE_CACHE[tableName] = available
  
  if (error && !isPermissionError(error) && available) {
    logWarn(`[Settings] Probe bảng ${tableName} trả lỗi`, error)
  }

  if (!available) {
    setTimeout(() => {
      TABLE_CACHE[tableName] = null
    }, 10000)
  }

  return available
}

export function clearSettingsCache() {
  Object.keys(TABLE_CACHE).forEach(key => {
    TABLE_CACHE[key] = null
  })
}

async function getAuthenticatedStaffProfile() {
  const session = await getCurrentSession()
  if (!session?.user?.id) {
    return {
      profile: null,
      error: buildError('Không tìm thấy phiên đăng nhập staff hiện tại.'),
    }
  }

  const profile = await getCurrentUserProfile(session.user.id)
  if (!profile) {
    return {
      profile: null,
      error: buildError('Không thể xác thực hồ sơ staff hiện tại từ bảng profiles.'),
    }
  }

  if (!['admin', 'moderator'].includes(profile.role) || profile.status !== 'active') {
    return {
      profile: null,
      error: buildError('Tài khoản hiện tại không có quyền staff hợp lệ để ghi admin action log.'),
    }
  }

  return { profile, error: null }
}

async function resolveSettingsTable() {
  const hasSystemSettings = await isTableAvailable('system_settings')
  if (hasSystemSettings) return 'system_settings'

  const hasPlatformSettings = await isTableAvailable('platform_settings')
  if (hasPlatformSettings) return 'platform_settings'

  return 'system_settings'
}

async function writeAuditLog(payload) {
  const available = await isTableAvailable('admin_action_logs')
  if (!available) {
    return { skipped: true }
  }

  const { profile, error: profileError } = await getAuthenticatedStaffProfile()
  if (profileError) {
    logWarn('[Settings] Không thể xác thực staff trước khi ghi audit log', profileError)
    return { skipped: true, error: profileError }
  }

  const newPayload = {
    admin_id: profile.id,
    action: payload.action,
    target_type: 'system_settings',
    target_id: payload.target_user_id || 'system',
    metadata: {
      old_value: payload.old_value,
      new_value: payload.new_value,
      reason: payload.reason
    }
  }

  const { error } = await supabase.from('admin_action_logs').insert(newPayload)
  if (error) {
    logWarn('[Settings] Không thể ghi audit log', error)
    return { skipped: true, error }
  }

  return { skipped: false, error: null }
}

async function fetchCount(table, options = {}) {
  let query = supabase.from(table).select('*', { count: 'exact', head: true })
  if (options.gteField && options.gteValue) {
    query = query.gte(options.gteField, options.gteValue)
  }
  const { count, error } = await query
  if (error) {
    return { count: 0, error }
  }
  return { count: count ?? 0, error: null }
}

export async function getPlatformSettings() {
  if (!supabase) {
    return {
      data: DEFAULT_PLATFORM_SETTINGS,
      error: buildError('Supabase chưa được cấu hình trong môi trường hiện tại.'),
    }
  }

  const settingsTable = await resolveSettingsTable()
  const keys = Object.keys(DEFAULT_PLATFORM_SETTINGS)
  const { data, error } = await supabase
    .from(settingsTable)
    .select('key, value, updated_at, updated_by')
    .in('key', keys)

  if (error) {
    logError('[Settings] Lỗi tải platform settings', error)
    return {
      data: DEFAULT_PLATFORM_SETTINGS,
      error: buildError('Không thể tải cài đặt hệ thống từ Supabase.', error),
    }
  }

  const recordMap = new Map((data ?? []).map((item) => [item.key, item]))
  const merged = keys.reduce((accumulator, key) => {
    accumulator[key] = decodeSettingValue(
      recordMap.get(key)?.value,
      DEFAULT_PLATFORM_SETTINGS[key],
    )
    return accumulator
  }, {})

  return { data: merged, error: null }
}

export async function savePlatformSettings({
  values,
  currentUserId = null,
  reason = 'update_platform_settings',
}) {
  const settingsTable = await resolveSettingsTable()
  const rows = Object.entries(values).map(([key, value]) => ({
    key,
    value: encodeSettingValue(value),
    updated_at: new Date().toISOString(),
    updated_by: currentUserId,
  }))

  const { data, error } = await supabase
    .from(settingsTable)
    .upsert(rows, { onConflict: 'key' })
    .select('key, value')

  if (error) {
    logError('[Settings] Lỗi lưu platform settings', error)
    return { data: null, error: buildError('Không thể lưu cài đặt hệ thống.', error) }
  }

  if (currentUserId) {
    await writeAuditLog({
      admin_id: currentUserId,
      action: reason,
      target_user_id: currentUserId,
      old_value: null,
      new_value: values,
      reason,
    })
  }

  return { data, error: null }
}

export async function resetPlatformSettings(currentUserId = null) {
  return savePlatformSettings({
    values: DEFAULT_PLATFORM_SETTINGS,
    currentUserId,
    reason: 'reset_platform_settings',
  })
}

export async function getRuntimeSetting(key, fallback = null) {
  const settingsTable = await resolveSettingsTable()
  const { data, error } = await supabase
    .from(settingsTable)
    .select('value')
    .eq('key', key)
    .maybeSingle()

  if (error) {
    logWarn(`[Settings] Không thể lấy runtime setting ${key}`, error)
    return { data: fallback, error }
  }

  return {
    data: decodeSettingValue(data?.value, fallback),
    error: null,
  }
}

export async function runSystemHealthChecks() {
  const checks = []

  const tableChecks = [
    { key: 'profiles', label: 'Cơ sở dữ liệu người dùng', table: 'profiles' },
    { key: 'posts', label: 'Bài viết', table: 'posts' },
    { key: 'comments', label: 'Bình luận', table: 'comments' },
    { key: 'devices', label: 'Thiết bị điện', table: 'devices' },
    { key: 'system_settings', label: 'Cài đặt hệ thống', table: 'system_settings', fallbackTable: 'platform_settings' },
    { key: 'notifications', label: 'Thông báo nội bộ', table: 'notifications' },
    { key: 'admin_action_logs', label: 'Nhật ký admin', table: 'admin_action_logs', optional: true },
    { key: 'system_backups', label: 'Sao lưu ứng dụng', table: 'system_backups', optional: true },
  ]

  for (const item of tableChecks) {
    let { error } = await supabase.from(item.table).select('*').limit(1)
    let activeTable = item.table

    if (error && item.fallbackTable) {
      const fallbackResult = await supabase.from(item.fallbackTable).select('*').limit(1)
      if (!fallbackResult.error) {
        error = null
        activeTable = item.fallbackTable
      }
    }

    if (error) {
      checks.push({
        key: item.key,
        label: item.label,
        ok: false,
        value: item.optional ? 'Chưa sẵn sàng' : 'Lỗi truy cập',
        detail: error.message,
      })
    } else {
      checks.push({
        key: item.key,
        label: item.label,
        ok: true,
        value: 'Hoạt động',
        detail: activeTable !== item.table ? `Đang dùng fallback ${activeTable}` : '',
      })
    }
  }

  try {
    const { data, error } = await supabase.storage.from('website-banners').list('', { limit: 1 })
    checks.push({
      key: 'storage',
      label: 'Lưu trữ ảnh',
      ok: !error,
      value: error ? 'Lỗi truy cập' : 'Hoạt động',
      detail: error?.message || `${data?.length ?? 0} mục khả dụng`,
    })
  } catch (error) {
    checks.push({
      key: 'storage',
      label: 'Lưu trữ ảnh',
      ok: false,
      value: 'Lỗi truy cập',
      detail: error.message,
    })
  }

  return {
    data: checks,
    error: null,
  }
}

export async function createSystemBackup({
  currentUserId = null,
  label = '',
}) {
  const available = await isTableAvailable('system_backups')
  if (!available) {
    return {
      data: null,
      error: buildError('Bảng system_backups chưa được tạo hoặc RLS chưa sẵn sàng.'),
    }
  }

  const [{ data: settings }, statsResult] = await Promise.all([
    getPlatformSettings(),
    getAdminStats('30 ngày qua'),
  ])

  const [profilesCount, postsCount, commentsCount, devicesCount] = await Promise.all([
    fetchCount('profiles'),
    fetchCount('posts'),
    fetchCount('comments'),
    fetchCount('devices'),
  ])

  const snapshot = {
    generated_at: new Date().toISOString(),
    settings,
    stats: statsResult,
    counters: {
      profiles: profilesCount.count,
      posts: postsCount.count,
      comments: commentsCount.count,
      devices: devicesCount.count,
    },
  }

  const { data, error } = await supabase
    .from('system_backups')
    .insert({
      label: label?.trim() || `Backup ${new Date().toLocaleString('vi-VN')}`,
      snapshot,
      created_by: currentUserId,
    })
    .select('*')
    .single()

  if (error) {
    logError('[Settings] Lỗi tạo backup', error)
    return { data: null, error: buildError('Không thể tạo bản sao lưu ứng dụng.', error) }
  }

  if (currentUserId) {
    await writeAuditLog({
      admin_id: currentUserId,
      target_user_id: currentUserId,
      action: 'create_system_backup',
      old_value: null,
      new_value: { backup_id: data.id, label: data.label },
      reason: 'create_system_backup',
    })
  }

  return { data, error: null }
}

export async function getSystemBackups(limit = 10) {
  const available = await isTableAvailable('system_backups')
  if (!available) {
    return {
      data: [],
      error: buildError('Bảng system_backups chưa được tạo hoặc RLS chưa sẵn sàng.'),
    }
  }

  const { data, error } = await supabase
    .from('system_backups')
    .select('id, label, snapshot, created_at, created_by')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    logError('[Settings] Lỗi tải backup', error)
    return { data: [], error: buildError('Không thể tải danh sách sao lưu.', error) }
  }

  return { data: data ?? [], error: null }
}

export async function getSystemBackupById(backupId) {
  const available = await isTableAvailable('system_backups')
  if (!available) {
    return {
      data: null,
      error: buildError('Bảng system_backups chưa được tạo hoặc RLS chưa sẵn sàng.'),
    }
  }

  const { data, error } = await supabase
    .from('system_backups')
    .select('*')
    .eq('id', backupId)
    .single()

  if (error) {
    logError('[Settings] Lỗi tải chi tiết backup', error)
    return { data: null, error: buildError('Không thể tải chi tiết bản sao lưu.', error) }
  }

  return { data, error: null }
}

export function clearAdminRuntimeCache() {
  const removedKeys = []
  const prefixes = ['sb-', 'supabase.', 'exanh-', 'admin-', 'post-composer']

  for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
    const key = window.localStorage.key(index)
    if (!key) continue
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      removedKeys.push(key)
      window.localStorage.removeItem(key)
    }
  }

  return removedKeys
}

export function buildAdminExportPayload({ settings, stats, systemStatus, backups }) {
  return {
    exported_at: new Date().toISOString(),
    settings,
    stats,
    systemStatus,
    backups,
  }
}
