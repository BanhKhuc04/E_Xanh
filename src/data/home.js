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
      'https://lh3.googleusercontent.com/aida/AP1WRLtJfGHYp4iRBd3DNb0kS0JmBUmMmzBG2Q7kXPeFcjJgUPIhg8XwXVrifo2FhXJpUTBY2BGAZIYIWuKg0WGU3RvaBnYGmQIDmquDd2GM-R9bArCPpoKvKKQ0qIwgdeatuQdTGadOOewVspg5wPwlvkkvUzyX5aP8_TWQZOig-cDyf7IqUjjgsX3ZnTLII4ohu_otaSfhusjl3ViPixt4oPpthoxUuhroQdmzzR_id2cnRP7Rv56CawNxH6Q',
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
      'https://lh3.googleusercontent.com/aida/AP1WRLvbWOyPiA1HOGeXusMgsrnwPTGOs7ZeCNH_V5mjvBV-0raxbD0NylGvP8bjesWQZEw1w79K7iGEhb2VJCJY8W3VAYkEuDmoB4B7GlXyCWZVaQ2zb613SQ0E6FD6DZc46lE9JE6uUsKhANajT_tUjY1mYHEjkVaIi_r2VGhPl7D65TgSU3FQS1l1ZcNBKyGwFDhM1WuxkMRyqJhVAHuO5LB8exzEpGOlKqqcD6cSw_DMO70yjYybvun0kDg',
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
      'https://lh3.googleusercontent.com/aida/AP1WRLuN-xlTzAvJ2YABiTMep4m7AmleqctohMTuoKlE9fbpDfOurOPpxlPDVFqJTzSKKW1EzA8pNxTUs6Fpx-q6aAd-3rDINQAB6l2wPmKnH8GXWFFE13z8viDR6LRyXWbHWDxbEWOIPA-IJPjhJcnAjr60C0csDBkONsodp0qr5dzDZScorKpmiUIHRtXntOk4E6i4wU5ZPbxC_man3Q9XsaBAhbolMgSWryFn2rKce48bpFdIoHM7ZOfnYJn_',
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
