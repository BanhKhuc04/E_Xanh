import { supabase } from '../lib/supabase'
import { getCurrentSession } from './authService'
import { logError, logWarn } from '../utils/logger'
import {
  evaluateAnnouncementVisibility,
  getCurrentVietnamTimeLabel,
} from '../utils/announcementTime'

const ANNOUNCEMENT_TABLE = 'website_announcements'
const COLUMN_CACHE = new Map()

function createSupabaseUnavailableError() {
  return {
    message: 'Thiếu cấu hình Supabase nên không thể tải thông báo website.',
  }
}

function normalizeNullableValue(value) {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed === '' ? null : trimmed
  }

  if (value === '' || value === undefined) return null
  return value
}

function mapLegacyAnnouncementType(type) {
  if (type === 'critical') return 'danger'
  if (type === 'maintenance') return 'warning'
  return type || 'info'
}

function normalizeDisplayTypeValue(displayType) {
  if (displayType === 'banner') return 'marquee'
  return displayType || 'top_bar'
}

function normalizeAnnouncementRow(row = {}) {
  return {
    ...row,
    type: row.type || 'info',
    display_type: normalizeDisplayTypeValue(row.display_type || row.display_mode),
    is_active: Boolean(row.is_active),
    updated_by: row.updated_by || null,
  }
}

async function isColumnAvailable(columnName) {
  const cacheKey = `${ANNOUNCEMENT_TABLE}.${columnName}`
  if (COLUMN_CACHE.has(cacheKey)) {
    return COLUMN_CACHE.get(cacheKey)
  }

  const { error } = await supabase
    .from(ANNOUNCEMENT_TABLE)
    .select(columnName)
    .limit(1)

  const available = !(error?.code === '42703' || String(error?.message || '').toLowerCase().includes('does not exist'))
  COLUMN_CACHE.set(cacheKey, available)
  return available
}

async function getAnnouncementSchemaCapabilities() {
  const [hasDisplayType, hasUpdatedBy] = await Promise.all([
    isColumnAvailable('display_type'),
    isColumnAvailable('updated_by'),
  ])

  return {
    hasDisplayType,
    hasUpdatedBy,
  }
}

async function normalizeAnnouncementPayload(payload = {}, { partial = false } = {}) {
  const capabilities = await getAnnouncementSchemaCapabilities()
  const normalized = partial ? {} : {}
  const nullableFields = ['cta_label', 'cta_url', 'start_at', 'end_at']

  for (const field of nullableFields) {
    if (partial && !(field in payload)) continue
    normalized[field] = normalizeNullableValue(payload[field])
  }

  if ('title' in payload) {
    normalized.title = typeof payload.title === 'string' ? payload.title.trim() : payload.title
  }

  if ('message' in payload) {
    normalized.message = typeof payload.message === 'string' ? payload.message.trim() : payload.message
  }

  if ('type' in payload) {
    normalized.type = mapLegacyAnnouncementType(payload.type)
  }

  if ('priority' in payload) {
    normalized.priority = Number(payload.priority) || 0
  }

  if ('is_active' in payload) {
    normalized.is_active = Boolean(payload.is_active)
  }

  const nextDisplayType = normalizeDisplayTypeValue(payload.display_type || payload.display_mode)
  if (nextDisplayType) {
    let dbValue = nextDisplayType
    if (dbValue === 'marquee') dbValue = 'banner'

    if (capabilities.hasDisplayType) {
      normalized.display_type = dbValue
    } else {
      normalized.display_mode = nextDisplayType === 'marquee' ? 'marquee' : 'static'
    }
  }

  return normalized
}

function mapAnnouncementError(error, actionLabel) {
  const message = error?.message || ''
  const lowerMessage = message.toLowerCase()

  if (
    lowerMessage.includes('could not find the table') ||
    lowerMessage.includes(`relation "public.${ANNOUNCEMENT_TABLE}"`) ||
    lowerMessage.includes(`table '${ANNOUNCEMENT_TABLE}'`)
  ) {
    return {
      message: 'Chưa tìm thấy bảng website_announcements trong Supabase. Hãy chạy SQL tạo bảng/policy announcement.',
      original: error,
    }
  }

  if (
    lowerMessage.includes('row-level security') ||
    lowerMessage.includes('violates row-level security') ||
    lowerMessage.includes('permission denied') ||
    lowerMessage.includes('not authorized') ||
    lowerMessage.includes('forbidden')
  ) {
    return {
      message: `Supabase RLS đang chặn thao tác ${actionLabel} announcement.`,
      original: error,
    }
  }

  return error
}

export function filterActiveAnnouncements(announcements = []) {
  const now = Date.now()

  return announcements.filter((announcement) =>
    evaluateAnnouncementVisibility(announcement, now).visible
  )
}

export async function fetchWebsiteAnnouncements({ activeOnly = false } = {}) {
  if (!supabase) {
    const error = createSupabaseUnavailableError()
    logWarn('[E-XANH][announcement] Supabase is not configured.', error.message)
    return { data: [], error, meta: { reason: 'supabase_missing' } }
  }

  let query = supabase
    .from(ANNOUNCEMENT_TABLE)
    .select('*')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    const mappedError = mapAnnouncementError(error, 'đọc')
    logError('[E-XANH][announcement] Fetch failed:', mappedError)
    return { data: [], error: mappedError, meta: { reason: 'fetch_error' } }
  }

  const normalizedData = (data || []).map(normalizeAnnouncementRow)

  if (!activeOnly) {
    return { data: normalizedData, error: null, meta: { total: normalizedData.length } }
  }

  const nowMs = Date.now()
  const evaluations = normalizedData.map((announcement) => ({
    announcement,
    visibility: evaluateAnnouncementVisibility(announcement, nowMs),
  }))
  const visibleAnnouncements = evaluations
    .filter(({ visibility }) => visibility.visible)
    .map(({ announcement }) => announcement)

  if (normalizedData.length === 0) {
    logWarn('[E-XANH][announcement] No active announcement rows returned from Supabase.', {
      nowVietnam: getCurrentVietnamTimeLabel(),
      reason: 'empty_data',
    })
  }

  const filteredOutAnnouncements = evaluations
    .filter(({ visibility }) => !visibility.visible)
    .map(({ announcement, visibility }) => ({
      id: announcement.id,
      title: announcement.title || null,
      reasons: visibility.reasons,
      start_at: announcement.start_at,
      end_at: announcement.end_at,
      nowVietnam: getCurrentVietnamTimeLabel(),
    }))

  if (filteredOutAnnouncements.length > 0) {
    logWarn('[E-XANH][announcement] Announcements filtered out by active/time rules.', filteredOutAnnouncements)
  }

  return {
    data: visibleAnnouncements,
    error: null,
    meta: {
      total: normalizedData.length,
      visible: visibleAnnouncements.length,
      filteredOut: filteredOutAnnouncements.length,
    },
  }
}

export async function createWebsiteAnnouncement(payload) {
  if (!supabase) {
    return { data: null, error: createSupabaseUnavailableError() }
  }

  const session = await getCurrentSession()
  const capabilities = await getAnnouncementSchemaCapabilities()
  const normalizedPayload = await normalizeAnnouncementPayload(payload)
  const insertPayload = {
    ...normalizedPayload,
    created_by: session?.user?.id || null,
  }

  if (capabilities.hasUpdatedBy) {
    insertPayload.updated_by = session?.user?.id || null
  }

  const { data, error } = await supabase
    .from(ANNOUNCEMENT_TABLE)
    .insert([insertPayload])
    .select()
    .single()

  const mappedError = error ? mapAnnouncementError(error, 'tạo') : null

  if (mappedError) {
    logError('[E-XANH][announcement] Create failed:', mappedError)
  }

  return { data: data ? normalizeAnnouncementRow(data) : null, error: mappedError }
}

export async function updateWebsiteAnnouncement(id, payload) {
  if (!supabase) {
    return { data: null, error: createSupabaseUnavailableError() }
  }

  const session = await getCurrentSession()
  const capabilities = await getAnnouncementSchemaCapabilities()
  const normalizedPayload = await normalizeAnnouncementPayload(payload, { partial: true })
  const updatePayload = {
    ...normalizedPayload,
    updated_at: new Date().toISOString(),
  }

  if (capabilities.hasUpdatedBy) {
    updatePayload.updated_by = session?.user?.id || null
  }

  const { data, error } = await supabase
    .from(ANNOUNCEMENT_TABLE)
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single()

  const mappedError = error ? mapAnnouncementError(error, 'cập nhật') : null

  if (mappedError) {
    logError('[E-XANH][announcement] Update failed:', mappedError)
  }

  return { data: data ? normalizeAnnouncementRow(data) : null, error: mappedError }
}

export async function deleteWebsiteAnnouncement(id) {
  if (!supabase) {
    return { error: createSupabaseUnavailableError() }
  }

  const { error } = await supabase
    .from(ANNOUNCEMENT_TABLE)
    .delete()
    .eq('id', id)

  const mappedError = error ? mapAnnouncementError(error, 'xóa') : null

  if (mappedError) {
    logError('[E-XANH][announcement] Delete failed:', mappedError)
  }

  return { error: mappedError }
}
