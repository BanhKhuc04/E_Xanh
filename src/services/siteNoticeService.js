import { supabase } from '../lib/supabase'
import { getCurrentSession } from './authService'
import { logError, logWarn } from '../utils/logger'

const SITE_NOTICES_TABLE = 'site_notices'
const BUG_REPORTS_TABLE = 'bug_reports'

const DEFAULT_GUIDE_SECTIONS = [
  {
    title: '1. Test tài khoản người dùng',
    items: [
      'Đăng ký tài khoản mới',
      'Đăng nhập và đăng xuất',
      'Cập nhật thông tin cá nhân',
      'Kiểm tra danh sách bài đã lưu',
    ],
  },
  {
    title: '2. Test bài viết',
    items: [
      'Tạo bài viết mới',
      'Upload ảnh cho bài viết',
      'Gửi bài chờ duyệt',
      'Kiểm tra trạng thái pending, approved và rejected',
    ],
  },
]

function createSupabaseUnavailableError(message) {
  return {
    message: message || 'Thiếu cấu hình Supabase nên không thể tải thông báo hệ thống.',
  }
}

function normalizeText(value, fallback = '') {
  if (typeof value !== 'string') return fallback
  return value.trim()
}

function normalizeOptionalText(value) {
  const normalized = normalizeText(value)
  return normalized || null
}

function normalizeGuideSections(value) {
  if (!Array.isArray(value)) return []

  return value
    .map((section, index) => {
      const title = normalizeText(section?.title, `Mục ${index + 1}`)
      const items = Array.isArray(section?.items)
        ? section.items
            .map((item) => normalizeText(item))
            .filter(Boolean)
        : []

      if (!title && items.length === 0) return null

      return {
        title,
        items,
      }
    })
    .filter(Boolean)
}

function normalizeNoticeRow(row = {}) {
  const guideSections = normalizeGuideSections(row.guide_sections)

  return {
    id: row.id || null,
    notice_key: normalizeText(row.notice_key, 'main'),
    version: normalizeText(row.version, 'v1.0'),
    title: normalizeText(row.title, 'Thông báo kiểm thử hệ thống'),
    subtitle: normalizeText(row.subtitle),
    description: normalizeText(row.description),
    guide_sections: guideSections.length > 0 ? guideSections : DEFAULT_GUIDE_SECTIONS,
    contact_label: normalizeText(row.contact_label, 'Liên hệ hỗ trợ'),
    contact_url: normalizeText(row.contact_url),
    is_active: Boolean(row.is_active),
    show_on_first_visit: row.show_on_first_visit !== false,
    show_bug_button: row.show_bug_button !== false,
    created_at: row.created_at || null,
    updated_at: row.updated_at || null,
  }
}

function normalizeBugReportRow(row = {}) {
  return {
    ...row,
    title: normalizeText(row.title),
    description: normalizeText(row.description),
    page_url: normalizeText(row.page_url),
    user_agent: normalizeText(row.user_agent),
    severity: normalizeText(row.severity, 'medium'),
    status: normalizeText(row.status, 'new'),
    profiles: row.profiles || null,
  }
}

function mapSiteNoticeError(error, fallbackMessage) {
  const message = String(error?.message || '').toLowerCase()

  if (
    message.includes(`relation "public.${SITE_NOTICES_TABLE}"`) ||
    message.includes('could not find the table') ||
    message.includes(`table '${SITE_NOTICES_TABLE}'`)
  ) {
    return {
      message: 'Chưa tìm thấy bảng `site_notices` trong Supabase. Hãy chạy migration notice/bug report trước.',
      original: error,
    }
  }

  if (
    message.includes(`relation "public.${BUG_REPORTS_TABLE}"`) ||
    message.includes(`table '${BUG_REPORTS_TABLE}'`)
  ) {
    return {
      message: 'Chưa tìm thấy bảng `bug_reports` trong Supabase. Hãy chạy migration notice/bug report trước.',
      original: error,
    }
  }

  if (
    message.includes('row-level security') ||
    message.includes('permission denied') ||
    message.includes('forbidden')
  ) {
    return {
      message: fallbackMessage || 'Supabase RLS đang chặn thao tác này.',
      original: error,
    }
  }

  return error
}

function normalizeSiteNoticePayload(payload = {}) {
  return {
    notice_key: normalizeText(payload.notice_key, 'main'),
    version: normalizeText(payload.version, 'v1.0'),
    title: normalizeText(payload.title),
    subtitle: normalizeOptionalText(payload.subtitle),
    description: normalizeOptionalText(payload.description),
    guide_sections: normalizeGuideSections(payload.guide_sections),
    contact_label: normalizeOptionalText(payload.contact_label),
    contact_url: normalizeOptionalText(payload.contact_url),
    is_active: Boolean(payload.is_active),
    show_on_first_visit: payload.show_on_first_visit !== false,
    show_bug_button: payload.show_bug_button !== false,
    updated_at: new Date().toISOString(),
  }
}

export function getNoticeSeenStorageKey(version) {
  return `exanh_notice_seen_${normalizeText(version, 'v1.0')}`
}

export function getDefaultGuideSections() {
  return DEFAULT_GUIDE_SECTIONS
}

export async function getActiveSiteNotice() {
  if (!supabase) {
    const error = createSupabaseUnavailableError()
    logWarn('[E-XANH][site-notice] Supabase is not configured.', error.message)
    return { data: null, error }
  }

  const { data, error } = await supabase
    .from(SITE_NOTICES_TABLE)
    .select('*')
    .or('is_active.eq.true,show_bug_button.eq.true')
    .order('is_active', { ascending: false })
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    const mappedError = mapSiteNoticeError(error, 'Bạn chưa có quyền đọc cấu hình thông báo public.')
    logError('[E-XANH][site-notice] Fetch active notice failed:', mappedError)
    return { data: null, error: mappedError }
  }

  return { data: data ? normalizeNoticeRow(data) : null, error: null }
}

export async function getAllSiteNotices() {
  if (!supabase) {
    return { data: [], error: createSupabaseUnavailableError() }
  }

  const { data, error } = await supabase
    .from(SITE_NOTICES_TABLE)
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) {
    const mappedError = mapSiteNoticeError(error, 'Bạn chưa có quyền xem toàn bộ site notices.')
    logError('[E-XANH][site-notice] Fetch all notices failed:', mappedError)
    return { data: [], error: mappedError }
  }

  return {
    data: (data || []).map(normalizeNoticeRow),
    error: null,
  }
}

export async function createSiteNotice(payload) {
  if (!supabase) {
    return { data: null, error: createSupabaseUnavailableError() }
  }

  const normalizedPayload = normalizeSiteNoticePayload(payload)
  const { data, error } = await supabase
    .from(SITE_NOTICES_TABLE)
    .insert([normalizedPayload])
    .select('*')
    .single()

  if (error) {
    const mappedError = mapSiteNoticeError(error, 'Bạn chưa có quyền tạo site notice.')
    logError('[E-XANH][site-notice] Create notice failed:', mappedError)
    return { data: null, error: mappedError }
  }

  return {
    data: normalizeNoticeRow(data),
    error: null,
  }
}

export async function updateSiteNotice(id, payload) {
  if (!supabase) {
    return { data: null, error: createSupabaseUnavailableError() }
  }

  const normalizedPayload = normalizeSiteNoticePayload(payload)
  const { data, error } = await supabase
    .from(SITE_NOTICES_TABLE)
    .update(normalizedPayload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    const mappedError = mapSiteNoticeError(error, 'Bạn chưa có quyền cập nhật site notice.')
    logError('[E-XANH][site-notice] Update notice failed:', mappedError)
    return { data: null, error: mappedError }
  }

  return {
    data: normalizeNoticeRow(data),
    error: null,
  }
}

export async function submitBugReport(payload = {}) {
  if (!supabase) {
    return { data: null, error: createSupabaseUnavailableError('Thiếu cấu hình Supabase nên không thể gửi báo lỗi.') }
  }

  const session = await getCurrentSession()
  const userId = session?.user?.id || null
  const insertPayload = {
    user_id: userId,
    title: normalizeText(payload.title),
    description: normalizeText(payload.description),
    page_url: normalizeOptionalText(payload.page_url),
    user_agent: normalizeOptionalText(payload.user_agent),
    severity: normalizeText(payload.severity, 'medium'),
  }

  const { data, error } = await supabase
    .from(BUG_REPORTS_TABLE)
    .insert([insertPayload])
    .select('*')
    .single()

  if (error) {
    const mappedError = mapSiteNoticeError(error, 'Bạn chưa có quyền gửi bug report.')
    logError('[E-XANH][bug-report] Create report failed:', mappedError)
    return { data: null, error: mappedError }
  }

  return {
    data: normalizeBugReportRow(data),
    error: null,
  }
}

export async function getBugReports() {
  if (!supabase) {
    return { data: [], error: createSupabaseUnavailableError('Thiếu cấu hình Supabase nên không thể tải bug reports.') }
  }

  const { data, error } = await supabase
    .from(BUG_REPORTS_TABLE)
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        email,
        role
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    const mappedError = mapSiteNoticeError(error, 'Bạn chưa có quyền xem bug reports.')
    logError('[E-XANH][bug-report] Fetch reports failed:', mappedError)
    return { data: [], error: mappedError }
  }

  return {
    data: (data || []).map(normalizeBugReportRow),
    error: null,
  }
}

export async function updateBugReportStatus(id, status) {
  if (!supabase) {
    return { data: null, error: createSupabaseUnavailableError('Thiếu cấu hình Supabase nên không thể cập nhật bug report.') }
  }

  const { data, error } = await supabase
    .from(BUG_REPORTS_TABLE)
    .update({
      status: normalizeText(status, 'new'),
    })
    .eq('id', id)
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        email,
        role
      )
    `)
    .single()

  if (error) {
    const mappedError = mapSiteNoticeError(error, 'Bạn chưa có quyền cập nhật trạng thái bug report.')
    logError('[E-XANH][bug-report] Update report status failed:', mappedError)
    return { data: null, error: mappedError }
  }

  return {
    data: normalizeBugReportRow(data),
    error: null,
  }
}
