export const commentStatusMap = {
  visible: { label: 'Đang hiển thị', className: 'is-visible' },
  hidden: { label: 'Đã ẩn', className: 'is-hidden' },
  reported: { label: 'Bị báo cáo', className: 'is-reported' },
  spam: { label: 'Spam', className: 'is-spam' },
  deleted: { label: 'Đã xóa', className: 'is-deleted' },
}

export const commentStatusOptions = [
  'Tất cả',
  'Đang hiển thị',
  'Đã ẩn',
  'Bị báo cáo',
  'Spam',
  'Đã xóa',
]

export const commentDateOptions = [
  'Tất cả',
  'Hôm nay',
  '7 ngày qua',
  'Tháng này',
]
