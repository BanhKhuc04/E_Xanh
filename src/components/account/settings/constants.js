import { Bell, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react'

export const PROFILE_BIO_LIMIT = 180

export const SECTION_ITEMS = [
  {
    id: 'account',
    label: 'Tài khoản',
    description: 'Thông tin cá nhân và hình ảnh hồ sơ',
    icon: UserRound,
  },
  {
    id: 'security',
    label: 'Bảo mật',
    description: 'Mật khẩu, phiên đăng nhập và an toàn tài khoản',
    icon: LockKeyhole,
  },
  {
    id: 'privacy',
    label: 'Quyền riêng tư',
    description: 'Kiểm soát hồ sơ công khai và nội dung hiển thị',
    icon: ShieldCheck,
  },
  {
    id: 'notifications',
    label: 'Thông báo',
    description: 'Điều hướng Notification Center nội bộ',
    icon: Bell,
  },
]

export const PROFILE_VISIBILITY_OPTIONS = [
  {
    value: 'public',
    label: 'Công khai',
    description: 'Ai cũng có thể xem trang cá nhân công khai của bạn.',
  },
  {
    value: 'authenticated',
    label: 'Chỉ người đăng nhập',
    description: 'Khách phải đăng nhập mới xem được hồ sơ.',
  },
  {
    value: 'private',
    label: 'Chỉ mình tôi',
    description: 'Ẩn hồ sơ công khai với mọi người khác.',
  },
]

export const NOTIFICATION_SWITCHES = [
  {
    key: 'notify_system',
    label: 'Thông báo hệ thống',
    description: 'Các thông báo quan trọng từ quản trị viên và nền tảng.',
    enabled: true,
  },
  {
    key: 'notify_post_review',
    label: 'Thông báo duyệt bài',
    description: 'Tự động ẩn vì luồng duyệt bài chưa phát thông báo theo tùy chọn cá nhân.',
    enabled: false,
  },
  {
    key: 'notify_comment_moderation',
    label: 'Thông báo bình luận',
    description: 'Nhận cảnh báo khi bình luận bị nhắc nhở hoặc điều tiết.',
    enabled: true,
  },
  {
    key: 'notify_interactions',
    label: 'Thông báo tương tác',
    description: 'Đang chờ backend cho lượt theo dõi, trả lời và tương tác hồ sơ.',
    enabled: false,
  },
]
