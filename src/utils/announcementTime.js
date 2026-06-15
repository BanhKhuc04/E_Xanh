const VIETNAM_UTC_OFFSET_HOURS = 7
const VIETNAM_UTC_OFFSET_MS = VIETNAM_UTC_OFFSET_HOURS * 60 * 60 * 1000
const VIETNAM_TIMEZONE = 'Asia/Ho_Chi_Minh'

function padTwoDigits(value) {
  return String(value).padStart(2, '0')
}

export function parseAnnouncementTimestamp(value) {
  if (!value) return null

  const timestamp = new Date(value).getTime()
  return Number.isFinite(timestamp) ? timestamp : null
}

export function evaluateAnnouncementVisibility(announcement, nowMs = Date.now()) {
  const reasons = []
  const startAtMs = parseAnnouncementTimestamp(announcement?.start_at)
  const endAtMs = parseAnnouncementTimestamp(announcement?.end_at)

  if (!announcement?.is_active) {
    reasons.push('inactive')
  }

  if (Number.isFinite(startAtMs) && startAtMs > nowMs) {
    reasons.push('before_start')
  }

  if (Number.isFinite(endAtMs) && endAtMs < nowMs) {
    reasons.push('after_end')
  }

  return {
    visible: reasons.length === 0,
    reasons,
    startAtMs,
    endAtMs,
  }
}

export function toUtcIsoFromVietnamDateTimeLocal(value) {
  if (!value) return null

  const normalized = value.length === 16 ? `${value}:00+07:00` : `${value}+07:00`
  const date = new Date(normalized)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString()
}

export function toVietnamDateTimeLocalValue(value) {
  const timestamp = parseAnnouncementTimestamp(value)
  if (!Number.isFinite(timestamp)) return ''

  const vietnamDate = new Date(timestamp + VIETNAM_UTC_OFFSET_MS)
  return vietnamDate.toISOString().slice(0, 16)
}

export function formatAnnouncementDateTime(value, fallback = 'Không giới hạn') {
  const timestamp = parseAnnouncementTimestamp(value)
  if (!Number.isFinite(timestamp)) return fallback

  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: VIETNAM_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(timestamp))
}

export function getVietnamTimeWindowLabel(startAt, endAt) {
  const startLabel = formatAnnouncementDateTime(startAt, 'Bắt đầu ngay')
  const endLabel = formatAnnouncementDateTime(endAt, 'Không giới hạn')
  return `${startLabel} - ${endLabel}`
}

export function getCurrentVietnamTimeLabel(date = new Date()) {
  const timestamp = date.getTime()
  const vietnamDate = new Date(timestamp + VIETNAM_UTC_OFFSET_MS)

  return [
    vietnamDate.getUTCFullYear(),
    padTwoDigits(vietnamDate.getUTCMonth() + 1),
    padTwoDigits(vietnamDate.getUTCDate()),
  ].join('-') + ` ${padTwoDigits(vietnamDate.getUTCHours())}:${padTwoDigits(vietnamDate.getUTCMinutes())}`
}
