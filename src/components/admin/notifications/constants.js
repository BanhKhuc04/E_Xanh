export const INITIAL_FORM = {
  targetType: 'all_active',
  targetValue: '',
  title: '',
  message: '',
  notificationType: 'system',
  severity: 'info',
  actionUrl: '',
  version: 'v1.0',
  showBugButton: true,
}

export const TARGET_OPTIONS = [
  {
    value: 'all_active',
    label: 'Tất cả người dùng active',
    description: 'Gửi tới toàn bộ tài khoản đang hoạt động.',
  },
  {
    value: 'role',
    label: 'Theo vai trò',
    description: 'Gửi theo nhóm user, moderator hoặc admin.',
  },
  {
    value: 'specific_user',
    label: 'Một người dùng cụ thể',
    description: 'Tra cứu theo email hoặc UUID của người nhận.',
  },
  {
    value: 'global',
    label: 'Popup toàn hệ thống (Global)',
    description: 'Bật thông báo nổi hoặc version notice ngoài website.',
  },
]

export const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'admin', label: 'Admin' },
]

export const NOTIFICATION_TYPES = [
  {
    value: 'system',
    label: 'Hệ thống',
    description: 'Thông báo vận hành chung cho toàn nền tảng.',
    recommendedSeverity: 'info',
  },
  {
    value: 'warning',
    label: 'Cảnh báo',
    description: 'Nhắc người dùng về thay đổi hoặc rủi ro cần chú ý.',
    recommendedSeverity: 'warning',
  },
  {
    value: 'moderation',
    label: 'Kiểm duyệt',
    description: 'Dùng cho bài viết, bình luận hoặc hành vi bị kiểm soát.',
    recommendedSeverity: 'warning',
  },
  {
    value: 'account',
    label: 'Tài khoản',
    description: 'Liên quan hồ sơ, bảo mật, xác minh hoặc quyền truy cập.',
    recommendedSeverity: 'info',
  },
  {
    value: 'post',
    label: 'Bài viết',
    description: 'Cập nhật tương tác hoặc trạng thái nội dung của người dùng.',
    recommendedSeverity: 'info',
  },
]

export const SEVERITY_OPTIONS = [
  { value: 'info', label: 'Thông tin', description: 'Nhẹ nhàng, không tạo cảm giác khẩn cấp.' },
  { value: 'warning', label: 'Cảnh báo', description: 'Nên đọc sớm vì có thay đổi hoặc ảnh hưởng trực tiếp.' },
  { value: 'critical', label: 'Khẩn cấp', description: 'Mức ưu tiên cao nhất, chỉ dùng khi thật sự cần.' },
]

export const EMPTY_PREVIEW = { recipients: [], count: 0 }

export function getOptionMeta(options, value, fallbackLabel = value) {
  return options.find((option) => option.value === value) || { value, label: fallbackLabel, description: '', recommendedSeverity: 'info' }
}

export function formatDateTime(value) {
  if (!value) return 'Chưa có dữ liệu'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Chưa có dữ liệu'

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(date)
}

export function getTargetSummary(item) {
  if (item.targetType === 'all_active') return 'Tất cả người dùng active'
  if (item.targetType === 'role') return `Vai trò: ${item.targetValue || 'Chưa chọn'}`
  if (item.targetType === 'specific_user') return `Người dùng: ${item.targetValue || 'Chưa xác định'}`
  if (item.targetType === 'global') return 'Popup toàn hệ thống (Global)'
  return item.targetType
}

export function getSeverityBadgeClass(severity) {
  if (severity === 'critical') return 'st-badge st-badge--danger'
  if (severity === 'warning') return 'st-badge st-badge--warning'
  return 'st-badge st-badge--active'
}

export function getNotificationTypeBadgeClass(type) {
  return `notification-tone-pill notification-tone-pill--${type || 'system'}`
}
