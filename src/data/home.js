import heroImage from '../assets/hero.png'

export const homeHero = {
  badge: 'Nền tảng sống xanh cho sinh viên',
  title: 'Dùng điện thông minh,',
  highlight: 'sống xanh bền vững',
  description:
    'Khám phá mẹo tiết kiệm điện, chia sẻ kinh nghiệm hữu ích và ước tính chi phí điện mỗi tháng cùng cộng đồng E-XANH.',
  image: heroImage,
  imageAlt: 'Minh họa không gian sống xanh và học tập thân thiện',
  stats: [
    { value: '120+', label: 'Bài viết' },
    { value: '2.4K', label: 'Tương tác' },
    { value: '850', label: 'Lưu bài' },
  ],
  floatingSavings: {
    label: 'Tiết kiệm dự kiến',
    value: '420.000đ',
    note: '/tháng',
  },
  floatingAppliance: {
    label: 'Tốn điện nhất',
    value: 'Điều hòa nhiệt độ',
  },
  floatingTip: {
    label: 'Mẹo hay',
    value: 'Đặt điều hòa 26–28°C kết hợp quạt gió',
  },
}

export const homeFeatures = [
  {
    title: 'Đọc mẹo tiết kiệm',
    description:
      'Khám phá những cách dùng điện thông minh, hiệu quả từ chuyên gia và cộng đồng sinh viên.',
    symbol: 'Mẹo',
    tone: 'yellow',
    to: '/meo-tiet-kiem',
  },
  {
    title: 'Cộng đồng chia sẻ',
    description:
      'Đọc kinh nghiệm thực tế, hỏi đáp và chia sẻ bí quyết tiết kiệm với những người bạn đồng trang lứa.',
    symbol: 'Chia sẻ',
    tone: 'green',
    to: '/cong-dong',
  },
  {
    title: 'Kiểm tra tiền điện',
    description:
      'Công cụ ước tính chi phí điện sinh hoạt nhanh chóng, giúp bạn kiểm soát ngân sách hiệu quả.',
    symbol: 'Điện',
    tone: 'dark',
    to: '/kiem-tra-tien-dien',
  },
]

export const electricityPreview = {
  eyebrow: 'Góc kiểm tra tiền điện',
  title: 'Ước tính chi phí điện hằng tháng',
  description:
    'Nhập thông tin các thiết bị điện đang sử dụng để ước tính số tiền điện bạn phải trả. Giúp bạn lên kế hoạch chi tiêu hợp lý hơn.',
  devices: [
    {
      icon: 'AC',
      name: 'Điều hòa 9000 BTU',
      usage: '8h/ngày • 30 ngày',
      cost: '~420.000đ',
    },
    {
      icon: 'TL',
      name: 'Tủ lạnh 150L',
      usage: '24h/ngày • 30 ngày',
      cost: '~150.000đ',
    },
  ],
  total: '570.000đ',
  progress: '65%',
  budgetNote: 'Đã đạt 65% ngân sách dự kiến (800k)',
}

export const homeFeaturedPosts = [
  {
    category: 'Mẹo điều hòa',
    title: 'Cách sử dụng điều hòa tiết kiệm 30% điện năng mùa nắng nóng',
    author: 'Hoàng Anh',
    authorInitials: 'HA',
    authorTone: 'yellow',
    likes: '124',
    imageAlt: 'Điều hòa và không gian phòng xanh mát',
    image:
      '/og-image-v2.png',
  },
  {
    category: 'Thiết bị bếp',
    title: 'Sự thật về tủ lạnh Inverter và cách sắp xếp thực phẩm đỡ tốn điện',
    author: 'Linh Trần',
    authorInitials: 'LT',
    authorTone: 'green',
    likes: '89',
    imageAlt: 'Tủ lạnh tiết kiệm điện trong căn bếp xanh',
    image:
      '/og-image-v2.png',
  },
  {
    category: 'Góc trọ sinh viên',
    title: 'Sinh viên thuê trọ: Làm sao để không bị "chặt chém" tiền điện?',
    author: 'Minh Đức',
    authorInitials: 'MD',
    authorTone: 'dark',
    likes: '215',
    imageAlt: 'Phòng trọ sinh viên với góc học tập tiết kiệm điện',
    image:
      '/og-image-v2.png',
  },
]

export const homeCommunity = {
  activityNote: '24 bình luận mới hôm nay',
  posts: [
    {
      author: 'Tuấn Nghĩa',
      initials: 'TN',
      tone: 'green',
      time: '2 giờ trước',
      type: 'Kinh nghiệm',
      likes: '45',
      comments: '12',
      content:
        'Tháng này mình áp dụng mẹo tắt hẳn nguồn các thiết bị khi không dùng thay vì để standby, tiền điện giảm được gần 80k luôn mọi người ạ.',
    },
    {
      author: 'Hương Mai',
      initials: 'HM',
      tone: 'lime',
      time: '5 giờ trước',
      type: 'Hỏi đáp',
      likes: '18',
      comments: '24',
      content:
        'Mọi người ơi cho em hỏi, tủ lạnh mini phòng trọ em dạo này kêu to và hay đóng tuyết thì có tốn điện hơn bình thường nhiều không ạ?',
    },
  ],
  members: [
    { rank: '1', name: 'Hoàng Anh', points: '2.4k Điểm xanh' },
    { rank: '2', name: 'Minh Đức', points: '1.8k Điểm xanh' },
    { rank: '3', name: 'Linh Trần', points: '1.5k Điểm xanh' },
  ],
}
