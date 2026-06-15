export const platformInfo = {
  name: 'E-XANH',
  slogan: 'Dùng điện thông minh, sống xanh bền vững.',
  email: 'support@exanh.vn',
  description:
    'E-XANH giúp người trẻ tiết kiệm điện, chia sẻ kinh nghiệm sống xanh và theo dõi chi phí điện hằng tháng.',
}

export const contentSettings = [
  {
    key: 'approveBeforePublish',
    label: 'Bật duyệt bài trước khi hiển thị',
    description: 'Bài viết mới phải được admin duyệt trước khi hiển thị cho cộng đồng.',
    defaultValue: true,
  },
  {
    key: 'moderateComments',
    label: 'Bật kiểm duyệt bình luận',
    description: 'Bình luận vi phạm sẽ tự động ẩn và chờ admin kiểm tra.',
    defaultValue: true,
  },
  {
    key: 'allowReporting',
    label: 'Cho phép người dùng báo cáo nội dung',
    description: 'Người dùng có thể báo cáo bài viết hoặc bình luận không phù hợp.',
    defaultValue: true,
  },
  {
    key: 'autoHideReported',
    label: 'Ẩn bài viết khi bị báo cáo nhiều lần',
    description: 'Bài viết sẽ tự động ẩn khi nhận từ 5 lượt báo cáo trở lên.',
    defaultValue: false,
  },
]

export const notificationSettings = [
  {
    key: 'newPostPending',
    label: 'Thông báo khi có bài mới chờ duyệt',
    description: 'Nhận thông báo ngay khi người dùng gửi bài viết mới.',
    defaultValue: true,
  },
  {
    key: 'reportedComment',
    label: 'Thông báo khi có bình luận bị báo cáo',
    description: 'Nhận cảnh báo khi bình luận vi phạm được báo cáo.',
    defaultValue: true,
  },
  {
    key: 'newUserRegistered',
    label: 'Thông báo khi có người dùng mới đăng ký',
    description: 'Nhận thông báo mỗi khi có tài khoản mới trong hệ thống.',
    defaultValue: false,
  },
  {
    key: 'weeklyEmail',
    label: 'Gửi email tổng hợp hằng tuần cho admin',
    description: 'Nhận bản tin tổng hợp hoạt động hệ thống mỗi thứ Hai.',
    defaultValue: true,
  },
]

export const securitySettings = {
  twoFactor: false,
  autoLogout: true,
  loginHistory: [
    { time: 'Hôm nay, 10:45', action: 'Đăng nhập từ Hà Nội' },
    { time: 'Hôm qua, 21:10', action: 'Đăng nhập từ Chrome' },
    { time: '10/06/2024, 08:20', action: 'Thay đổi mật khẩu' },
  ],
}

export const appearanceSettings = {
  theme: 'Sáng',
  primaryColor: 'Xanh E-XANH',
  borderRadius: 'Mềm',
  density: 'Rộng rãi',
}

export const adminProfile = {
  name: 'Admin E-XANH',
  role: 'Quản trị viên cấp cao',
  email: 'admin@exanh.vn',
  status: 'Đang hoạt động',
  avatar: 'E',
}

export const systemStatus = [
  { label: 'API hệ thống', value: 'Hoạt động', ok: true },
  { label: 'Cơ sở dữ liệu', value: 'Hoạt động', ok: true },
  { label: 'Lưu trữ ảnh', value: 'Hoạt động', ok: true },
  { label: 'Kiểm duyệt nội dung', value: 'Bật', ok: true },
  { label: 'Bảo mật', value: 'Tốt', ok: true },
]

export const backupInfo = {
  lastBackup: '12/06/2024 — 09:30',
  dataSize: '128 MB',
  totalPosts: '186',
  totalUsers: '1.240',
}

export const quickActions = [
  { label: 'Xóa cache hệ thống', icon: 'cache', style: 'default' },
  { label: 'Kiểm tra dữ liệu', icon: 'check', style: 'default' },
  { label: 'Xuất báo cáo', icon: 'export', style: 'default' },
  { label: 'Khôi phục mặc định', icon: 'reset', style: 'warning' },
]
