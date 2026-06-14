import heroImage from '../assets/hero.png'

export const pageHeroContent = {
  tips: {
    pageKey: 'tips',
    badge: 'Thư viện mẹo tiết kiệm điện',
    title: 'Mẹo tiết kiệm điện',
    description:
      'Khám phá các mẹo sử dụng điện thông minh, dễ áp dụng và phù hợp với đời sống hằng ngày.',
    fallbackImage: heroImage,
    imageAlt: 'Không gian học tập xanh với các mẹo tiết kiệm điện',
  },
  community: {
    pageKey: 'community',
    badge: 'Cộng đồng sống xanh',
    title: 'Cùng nhau chia sẻ mẹo tiết kiệm điện',
    description:
      'Nơi sinh viên và người trẻ lan tỏa kinh nghiệm sống xanh, trao đổi thói quen tiết kiệm điện và truyền cảm hứng cho nhau.',
    fallbackImage: heroImage,
    imageAlt: 'Nhóm sinh viên đang chia sẻ kinh nghiệm sống xanh',
  },
  'electricity-check': {
    pageKey: 'electricity-check',
    badge: 'Công cụ tính tiền điện',
    title: 'Kiểm tra tiền điện nhanh và trực quan',
    description:
      'Nhập thiết bị bạn đang dùng để ước tính điện năng tiêu thụ, nhận cảnh báo điểm nóng và gợi ý tiết kiệm sát thực tế.',
    fallbackImage: heroImage,
    imageAlt: 'Minh họa bảng điều khiển điện năng E-XANH',
  },
  about: {
    pageKey: 'about',
    badge: 'Về E-XANH',
    title: 'E-XANH là gì?',
    description:
      'E-XANH là nền tảng giúp người trẻ sử dụng điện thông minh hơn, tiết kiệm chi phí hằng tháng và lan tỏa lối sống xanh trong cộng đồng.',
    fallbackImage:
      'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=1400&q=80',
    imageAlt: 'Minh họa nền tảng E-XANH',
  },
}

export const heroPageOptions = [
  { key: 'home', label: 'Trang chủ', aspectRatio: 16 / 9 },
  { key: 'auth', label: 'Đăng nhập / Đăng ký', aspectRatio: 16 / 9 },
  { key: 'tips', label: 'Mẹo tiết kiệm', aspectRatio: 16 / 9 },
  { key: 'community', label: 'Cộng đồng', aspectRatio: 16 / 9 },
  { key: 'electricity-check', label: 'Kiểm tra tiền điện', aspectRatio: 16 / 9 },
  { key: 'about', label: 'Về chúng tôi', aspectRatio: 16 / 9 },
]

export function getHeroPageLabel(pageKey) {
  return heroPageOptions.find((item) => item.key === pageKey)?.label || pageKey
}
