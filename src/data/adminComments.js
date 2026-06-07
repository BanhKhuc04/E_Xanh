export const commentStatusMap = {
  visible: { label: 'Đang hiển thị', className: 'is-visible' },
  hidden: { label: 'Đã ẩn', className: 'is-hidden' },
  reported: { label: 'Bị báo cáo', className: 'is-reported' },
  spam: { label: 'Spam', className: 'is-spam' },
}

export const commentStatusOptions = [
  'Tất cả',
  'Đang hiển thị',
  'Đã ẩn',
  'Bị báo cáo',
  'Spam',
]

export const commentDateOptions = [
  'Tất cả',
  'Hôm nay',
  '7 ngày qua',
  'Tháng này',
]

export const adminCommentStats = [
  {
    label: 'Bình luận mới',
    value: 48,
    icon: 'new',
    accent: 'success',
  },
  {
    label: 'Bị báo cáo',
    value: 6,
    icon: 'reported',
    accent: 'warning',
  },
  {
    label: 'Đã ẩn',
    value: 12,
    icon: 'hidden',
    accent: 'muted',
  },
  {
    label: 'Spam cần xử lý',
    value: 3,
    icon: 'spam',
    accent: 'highlight',
  },
]

export const adminComments = [
  {
    id: 'cmt-001',
    userName: 'Hoàng Nam',
    userEmail: 'hoangnam@email.com',
    avatar: 'H',
    content:
      'Bài viết rất hữu ích, mình đã áp dụng và thấy số điện giảm rõ rệt sau 2 tuần sử dụng. Cảm ơn tác giả đã chia sẻ!',
    postTitle: '5 cách dùng điều hòa tiết kiệm điện mùa nóng',
    createdAt: '2026-06-07T10:15:00',
    status: 'visible',
    reports: 0,
  },
  {
    id: 'cmt-002',
    userName: 'Thanh Trúc',
    userEmail: 'thanhtruc@email.com',
    avatar: 'T',
    content:
      'Cho mình hỏi thiết bị A có tốn điện hơn thiết bị B không nếu dùng mỗi ngày? Mình đang phân vân giữa 2 lựa chọn.',
    postTitle: 'Thiết bị nào trong phòng trọ tốn điện nhất?',
    createdAt: '2026-06-07T09:30:00',
    status: 'visible',
    reports: 0,
  },
  {
    id: 'cmt-003',
    userName: 'User_992',
    userEmail: 'user992@email.com',
    avatar: 'U',
    content:
      'Nội dung quảng cáo/spam không phù hợp. Mua ngay sản phẩm XYZ giá rẻ tại link abc.xyz... Khuyến mãi cực sốc hôm nay!',
    postTitle: 'Sạc laptop qua đêm có thật sự tốn điện?',
    createdAt: '2026-06-06T22:45:00',
    status: 'reported',
    reports: 5,
  },
  {
    id: 'cmt-004',
    userName: 'Minh Anh',
    userEmail: 'minhanh@email.com',
    avatar: 'M',
    content:
      'Mình nghĩ nên thêm ví dụ cho phòng trọ nhỏ dưới 20m² nữa, vì đa số sinh viên ở phòng nhỏ hơn nhiều so với bài viết đề cập.',
    postTitle: 'Checklist 30 giây trước khi rời phòng',
    createdAt: '2026-06-06T14:20:00',
    status: 'visible',
    reports: 0,
  },
  {
    id: 'cmt-005',
    userName: 'Bình An',
    userEmail: 'binhan@email.com',
    avatar: 'B',
    content:
      'Mình đã thử cách này và thấy hiệu quả rõ rệt. Tủ lạnh chạy êm hơn và hóa đơn điện tháng vừa rồi giảm khoảng 50.000 đồng.',
    postTitle: 'Cách đặt tủ lạnh giúp giảm hao phí điện',
    createdAt: '2026-06-05T08:10:00',
    status: 'hidden',
    reports: 0,
  },
]
