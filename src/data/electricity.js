export const deviceOptions = [
  { label: 'Điều hòa 9000BTU', value: 'Điều hòa 9000BTU', defaultPower: 850, tone: 'green' },
  { label: 'Laptop', value: 'Laptop', defaultPower: 65, tone: 'lime' },
  { label: 'Tủ lạnh', value: 'Tủ lạnh', defaultPower: 150, tone: 'green' },
  { label: 'Đèn học LED', value: 'Đèn học LED', defaultPower: 9, tone: 'yellow' },
  { label: 'Máy giặt', value: 'Máy giặt', defaultPower: 500, tone: 'olive' },
  { label: 'Quạt điện', value: 'Quạt điện', defaultPower: 60, tone: 'teal' },
  { label: 'Khác', value: 'Khác', defaultPower: '', tone: 'green' },
]

export const electricitySampleDevices = [
  {
    id: 'sample-ac',
    name: 'Điều hòa 9000BTU',
    power: 850,
    hoursPerDay: 8,
    daysPerMonth: 30,
    tone: 'green',
  },
  {
    id: 'sample-laptop',
    name: 'Laptop',
    power: 65,
    hoursPerDay: 10,
    daysPerMonth: 22,
    tone: 'lime',
  },
]

export const savingSuggestions = [
  {
    title: 'Đặt điều hòa 26–28°C',
    description: 'Tăng 1 độ C có thể giúp giảm tới 3% điện năng tiêu thụ của máy lạnh.',
    icon: 'Nhiệt',
  },
  {
    title: 'Không sạc thiết bị qua đêm',
    description: 'Ngắt sạc laptop, điện thoại khi đầy để tránh rò rỉ điện và chai pin.',
    icon: 'Pin',
  },
  {
    title: 'Tắt thiết bị ở chế độ chờ',
    description: 'Rút phích cắm TV, loa khi không dùng vì chế độ chờ vẫn tiêu thụ điện ngầm.',
    icon: 'Tắt',
  },
  {
    title: 'Tận dụng ánh sáng tự nhiên',
    description: 'Mở cửa sổ thay vì bật đèn vào ban ngày để giảm tải hệ thống chiếu sáng.',
    icon: 'Sáng',
  },
]

export const electricityHistory = [
  {
    id: 'history-1',
    date: '12/06/2024',
    deviceCount: 3,
    totalKwh: 218.3,
    estimatedCost: 520000,
    highestDevice: 'Điều hòa 9000BTU',
    savingPercent: '15–20%',
    items: [
      {
        deviceName: 'Điều hòa 9000BTU',
        power: 850,
        hoursPerDay: 8,
        daysPerMonth: 30,
        kwh: 204,
      },
      {
        deviceName: 'Laptop',
        power: 65,
        hoursPerDay: 10,
        daysPerMonth: 22,
        kwh: 14.3,
      },
      {
        deviceName: 'Quạt điện',
        power: 60,
        hoursPerDay: 6,
        daysPerMonth: 12,
        kwh: 4.3,
      },
    ],
  },
  {
    id: 'history-2',
    date: '08/06/2024',
    deviceCount: 4,
    totalKwh: 156,
    estimatedCost: 420000,
    highestDevice: 'Tủ lạnh',
    savingPercent: '10–15%',
    items: [
      {
        deviceName: 'Tủ lạnh',
        power: 150,
        hoursPerDay: 24,
        daysPerMonth: 30,
        kwh: 108,
      },
      {
        deviceName: 'Laptop',
        power: 65,
        hoursPerDay: 8,
        daysPerMonth: 22,
        kwh: 11.4,
      },
      {
        deviceName: 'Đèn học LED',
        power: 9,
        hoursPerDay: 5,
        daysPerMonth: 26,
        kwh: 1.2,
      },
      {
        deviceName: 'Quạt điện',
        power: 60,
        hoursPerDay: 10,
        daysPerMonth: 30,
        kwh: 18,
      },
    ],
  },
  {
    id: 'history-3',
    date: '01/06/2024',
    deviceCount: 2,
    totalKwh: 132,
    estimatedCost: 360000,
    highestDevice: 'Laptop',
    savingPercent: '8–12%',
    items: [
      {
        deviceName: 'Laptop',
        power: 65,
        hoursPerDay: 12,
        daysPerMonth: 30,
        kwh: 23.4,
      },
      {
        deviceName: 'Máy giặt',
        power: 500,
        hoursPerDay: 0.8,
        daysPerMonth: 12,
        kwh: 4.8,
      },
    ],
  },
]

export const heroHighlights = {
  badge: 'Công cụ thông minh',
  title: 'Kiểm tra tiền điện hằng tháng',
  description:
    'Nhập thiết bị bạn đang sử dụng để ước tính chi phí điện, tìm thiết bị tiêu hao nhiều nhất và nhận gợi ý tiết kiệm phù hợp.',
  image:
    '/images/fallback-green.jpg',
}

export function calculateDeviceKwh(device) {
  return (Number(device.power) * Number(device.hoursPerDay) * Number(device.daysPerMonth)) / 1000
}

export function formatKwh(value) {
  const rounded = Number(value.toFixed(1))
  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)} kWh`
}

export function formatCurrency(value) {
  return `${Math.round(value).toLocaleString('vi-VN')}đ`
}

export function formatHistoryDate(value) {
  if (!value) {
    return ''
  }

  if (value.includes('/')) {
    return value
  }

  const [year, month, day] = value.split('-')
  return day && month && year ? `${day}/${month}/${year}` : value
}

export function getDefaultPowerByName(name) {
  return deviceOptions.find((item) => item.value === name)?.defaultPower ?? ''
}

export function getDeviceTone(name) {
  return deviceOptions.find((item) => item.value === name)?.tone ?? 'green'
}
