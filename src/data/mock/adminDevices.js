export const deviceLevelMap = {
  low: { label: 'Thấp', className: 'is-low' },
  medium: { label: 'Trung bình', className: 'is-medium' },
  high: { label: 'Cao', className: 'is-high' },
}

export const deviceStatusMap = {
  active: { label: 'Đang dùng', className: 'is-active' },
  hidden: { label: 'Đã ẩn', className: 'is-hidden' },
}

export const deviceGroupOptions = [
  'Tất cả',
  'Điều hòa',
  'Laptop',
  'Tủ lạnh',
  'Đèn học',
  'Máy giặt',
  'Thiết bị bếp',
  'Thiết bị gia dụng',
  'Khác',
]

export const deviceLevelOptions = [
  'Tất cả',
  'Thấp',
  'Trung bình',
  'Cao',
]

export const deviceStatusOptions = [
  'Tất cả',
  'Đang dùng',
  'Đã ẩn',
]

export const adminDeviceStats = [
  {
    label: 'Tổng thiết bị',
    value: 36,
    icon: 'total',
    accent: 'success',
  },
  {
    label: 'Thiết bị đang dùng',
    value: 28,
    icon: 'active',
    accent: 'highlight',
  },
  {
    label: 'Tiêu thụ cao',
    value: 8,
    icon: 'high',
    accent: 'warning',
  },
  {
    label: 'Gợi ý tiết kiệm',
    value: 24,
    icon: 'tips',
    accent: 'muted',
  },
]

export const savingTipsHighlight = [
  'Đặt điều hòa 26–28°C',
  'Không sạc laptop qua đêm',
  'Tắt thiết bị ở chế độ chờ',
  'Tận dụng ánh sáng tự nhiên',
]

export const adminDevices = [
  {
    id: 'dev-001',
    name: 'Điều hòa 9000BTU',
    group: 'Điều hòa',
    power: 850,
    level: 'high',
    status: 'active',
    savingTip: 'Đặt nhiệt độ 26–28°C, vệ sinh lưới lọc định kỳ để giảm 15–20% điện năng.',
    suggestedHoursPerDay: 8,
    icon: '❄️',
  },
  {
    id: 'dev-002',
    name: 'Laptop',
    group: 'Laptop',
    power: 65,
    level: 'low',
    status: 'active',
    savingTip: 'Rút sạc khi pin đầy, giảm độ sáng màn hình để tiết kiệm điện.',
    suggestedHoursPerDay: 8,
    icon: '💻',
  },
  {
    id: 'dev-003',
    name: 'Tủ lạnh',
    group: 'Tủ lạnh',
    power: 150,
    level: 'medium',
    status: 'active',
    savingTip: 'Đặt cách tường 10cm, không để thực phẩm nóng vào tủ, kiểm tra gioăng cửa.',
    suggestedHoursPerDay: 24,
    icon: '🧊',
  },
  {
    id: 'dev-004',
    name: 'Đèn học LED',
    group: 'Đèn học',
    power: 9,
    level: 'low',
    status: 'active',
    savingTip: 'Tận dụng ánh sáng tự nhiên ban ngày, tắt đèn khi rời phòng.',
    suggestedHoursPerDay: 5,
    icon: '💡',
  },
  {
    id: 'dev-005',
    name: 'Máy giặt',
    group: 'Máy giặt',
    power: 500,
    level: 'medium',
    status: 'active',
    savingTip: 'Giặt đủ tải, chọn chế độ nước lạnh để giảm điện năng đáng kể.',
    suggestedHoursPerDay: 1,
    icon: '🧺',
  },
  {
    id: 'dev-006',
    name: 'Bếp điện',
    group: 'Thiết bị bếp',
    power: 1200,
    level: 'high',
    status: 'hidden',
    savingTip: 'Đậy nắp khi nấu, dùng nồi vừa kích thước bếp để tiết kiệm nhiệt.',
    suggestedHoursPerDay: 2,
    icon: '🍳',
  },
  {
    id: 'dev-007',
    name: 'Quạt điện',
    group: 'Thiết bị gia dụng',
    power: 60,
    level: 'low',
    status: 'active',
    savingTip: 'Dùng quạt thay điều hòa khi thời tiết dưới 30°C để tiết kiệm đáng kể.',
    suggestedHoursPerDay: 6,
    icon: '🌀',
  },
]
