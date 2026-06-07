export const dashboardStats = [
  {
    label: 'Bài chờ duyệt',
    value: '18',
    change: '+5 hôm nay',
    icon: 'pending',
    accent: 'peach',
  },
  {
    label: 'Bài đã duyệt',
    value: '126',
    change: '+12 tuần này',
    icon: 'approved',
    accent: 'green',
  },
  {
    label: 'Bình luận mới',
    value: '48',
    change: 'Cần xem 6',
    icon: 'comment',
    accent: 'lime',
  },
  {
    label: 'Người dùng hoạt động',
    value: '1.240',
    change: '+8%',
    icon: 'users',
    accent: 'olive',
  },
  {
    label: 'Lượt kiểm tra tiền điện',
    value: '356',
    change: '+24 hôm nay',
    icon: 'energy',
    accent: 'green',
  },
]

export const weeklyInteractions = [
  { day: 'T2', likes: 24, comments: 18, saves: 15 },
  { day: 'T3', likes: 36, comments: 24, saves: 19 },
  { day: 'T4', likes: 32, comments: 28, saves: 22 },
  { day: 'T5', likes: 42, comments: 34, saves: 30 },
  { day: 'T6', likes: 38, comments: 26, saves: 21 },
  { day: 'T7', likes: 54, comments: 43, saves: 33 },
  { day: 'CN', likes: 40, comments: 31, saves: 25 },
]

export const contentTypes = [
  { label: 'Mẹo tiết kiệm', value: 45, color: '#80B155' },
  { label: 'Cộng đồng', value: 30, color: '#C1D95C' },
  { label: 'Review', value: 15, color: '#4F8428' },
  { label: 'Hỏi đáp', value: 10, color: '#E8F18A' },
]

export const recentComments = [
  {
    id: 'comment-01',
    author: 'Hoàng Nam',
    avatar: 'H',
    content: 'Bài viết rất hữu ích, mình đã áp dụng và thấy số điện giảm rõ rệt sau 2 tuần.',
    time: 'Vừa xong',
  },
  {
    id: 'comment-02',
    author: 'Thanh Trúc',
    avatar: 'T',
    content: 'Cho mình hỏi thiết bị A có tốn điện hơn thiết bị B không nếu dùng mỗi ngày?',
    time: '15 phút trước',
  },
  {
    id: 'comment-03',
    author: 'Minh Khôi',
    avatar: 'M',
    content: 'Mình đề xuất thêm phần so sánh hóa đơn điện theo tháng để dễ theo dõi hơn.',
    time: '32 phút trước',
  },
  {
    id: 'comment-04',
    author: 'Linh Chi',
    avatar: 'L',
    content: 'Checklist trước khi rời phòng quá thực tế, mình đã lưu lại để dùng mỗi tối.',
    time: '1 giờ trước',
  },
]

export const recentActivities = [
  'Admin đã duyệt bài “Tắt thiết bị chờ có tiết kiệm điện không?”',
  'Người dùng Minh Anh đã đăng bài mới',
  'Có 12 lượt lưu bài trong 1 giờ qua',
  'Có 8 lượt kiểm tra tiền điện mới',
]

export const quickActions = [
  {
    title: 'Duyệt bài viết',
    description: 'Kiểm tra và phê duyệt nội dung mới gửi lên hệ thống.',
    to: '/admin/duyet-bai-viet',
    icon: 'pending',
  },
  {
    title: 'Quản lý bình luận',
    description: 'Theo dõi thảo luận và xử lý các bình luận cần xem.',
    to: '/admin/quan-ly-binh-luan',
    icon: 'comment',
  },
  {
    title: 'Quản lý người dùng',
    description: 'Kiểm tra tài khoản hoạt động và hỗ trợ cộng đồng.',
    to: '/admin/quan-ly-nguoi-dung',
    icon: 'users',
  },
  {
    title: 'Quản lý thiết bị điện',
    description: 'Cập nhật dữ liệu thiết bị và công suất tham chiếu.',
    to: '/admin/quan-ly-thiet-bi',
    icon: 'energy',
  },
]
