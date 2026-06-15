export const userRoleMap = {
  user: { label: 'Người dùng', className: 'is-user' },
  moderator: { label: 'Moderator', className: 'is-moderator' },
  admin: { label: 'Admin', className: 'is-admin' },
}

export const userStatusMap = {
  active: { label: 'Đang hoạt động', className: 'is-active' },
  locked: { label: 'Bị khóa', className: 'is-locked' },
  blocked: { label: 'Bị khóa', className: 'is-locked' },
  pending: { label: 'Chờ xác minh', className: 'is-pending' },
  deleted: { label: 'Đã vô hiệu hóa', className: 'is-deleted' },
}

export const userRoleOptions = [
  'Tất cả',
  'Người dùng',
  'Moderator',
  'Admin',
]

export const userStatusOptions = [
  'Tất cả',
  'Đang hoạt động',
  'Bị khóa',
  'Chờ xác minh',
  'Đã vô hiệu hóa',
]

export const userDateOptions = [
  'Tất cả',
  'Hôm nay',
  '7 ngày qua',
  'Tháng này',
]
