export const userRoleMap = {
  user: { label: 'Người dùng', className: 'is-user' },
  moderator: { label: 'Moderator', className: 'is-moderator' },
  admin: { label: 'Admin', className: 'is-admin' },
}

export const userStatusMap = {
  active: { label: 'Đang hoạt động', className: 'is-active' },
  locked: { label: 'Bị khóa', className: 'is-locked' },
  pending: { label: 'Chờ xác minh', className: 'is-pending' },
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
]

export const userDateOptions = [
  'Tất cả',
  'Hôm nay',
  '7 ngày qua',
  'Tháng này',
]

export const adminUserStats = [
  {
    label: 'Tổng người dùng',
    value: '1.240',
    icon: 'total',
    accent: 'success',
  },
  {
    label: 'Người dùng hoạt động',
    value: '856',
    icon: 'active',
    accent: 'highlight',
  },
  {
    label: 'Tài khoản bị khóa',
    value: '12',
    icon: 'locked',
    accent: 'warning',
  },
  {
    label: 'Admin / Moderator',
    value: '5',
    icon: 'staff',
    accent: 'muted',
  },
]

export const adminUsers = [
  {
    id: 'usr-001',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    avatar: 'A',
    role: 'user',
    status: 'active',
    postsCount: 8,
    commentsCount: 24,
    savedCount: 15,
    electricityChecks: 6,
    joinedAt: '2026-01-15',
    lastActive: '10 phút trước',
    recentActivities: [
      'Đã đăng bài "Mẹo dùng quạt tiết kiệm điện"',
      'Đã bình luận trong "5 cách dùng điều hòa tiết kiệm"',
      'Đã kiểm tra tiền điện tháng 6',
      'Đã lưu bài "Checklist 30 giây trước khi rời phòng"',
    ],
  },
  {
    id: 'usr-002',
    name: 'Lan Anh',
    email: 'lananh@email.com',
    avatar: 'L',
    role: 'user',
    status: 'active',
    postsCount: 5,
    commentsCount: 18,
    savedCount: 22,
    electricityChecks: 3,
    joinedAt: '2026-02-20',
    lastActive: '1 giờ trước',
    recentActivities: [
      'Đã bình luận trong "Thiết bị nào tốn điện nhất?"',
      'Đã lưu 3 bài viết mới',
      'Đã kiểm tra tiền điện tháng 5',
    ],
  },
  {
    id: 'usr-003',
    name: 'Minh Tuấn',
    email: 'minhtuan@email.com',
    avatar: 'M',
    role: 'moderator',
    status: 'active',
    postsCount: 12,
    commentsCount: 45,
    savedCount: 8,
    electricityChecks: 10,
    joinedAt: '2025-11-05',
    lastActive: 'Hôm nay',
    recentActivities: [
      'Đã duyệt 3 bài viết mới',
      'Đã ẩn 1 bình luận spam',
      'Đã đăng bài "Checklist 30 giây trước khi rời phòng"',
      'Đã phản hồi 5 bình luận từ cộng đồng',
    ],
  },
  {
    id: 'usr-004',
    name: 'User_992',
    email: 'user992@email.com',
    avatar: 'U',
    role: 'user',
    status: 'locked',
    postsCount: 1,
    commentsCount: 3,
    savedCount: 0,
    electricityChecks: 0,
    joinedAt: '2026-05-28',
    lastActive: '2 ngày trước',
    recentActivities: [
      'Đã bị khóa do vi phạm nội dung cộng đồng',
      'Đã đăng nội dung quảng cáo/spam',
      'Bình luận bị báo cáo 5 lần',
    ],
  },
  {
    id: 'usr-005',
    name: 'Admin E-XANH',
    email: 'admin@exanh.vn',
    avatar: 'E',
    role: 'admin',
    status: 'active',
    postsCount: 24,
    commentsCount: 0,
    savedCount: 0,
    electricityChecks: 0,
    joinedAt: '2025-08-01',
    lastActive: 'Vừa xong',
    recentActivities: [
      'Đã duyệt bài "Cách đặt tủ lạnh giảm hao phí điện"',
      'Đã cập nhật danh mục thiết bị điện',
      'Đã khóa tài khoản User_992',
      'Đã xuất báo cáo thống kê tháng 5',
    ],
  },
]
