const PUBLIC_ROUTES = [
  { id: 'ROUTE-HOME', path: '/', name: 'Trang chủ', required: true },
  { id: 'ROUTE-TIPS', path: '/meo-tiet-kiem', name: 'Mẹo tiết kiệm', required: true },
  { id: 'ROUTE-COMMUNITY', path: '/cong-dong', name: 'Cộng đồng', required: true },
  { id: 'ROUTE-CREATE', path: '/dang-bai', name: 'Đăng bài', required: true, authRelated: true },
  { id: 'ROUTE-SAVED', path: '/bai-da-luu', name: 'Bài đã lưu', required: true, authRelated: true },
  { id: 'ROUTE-ELECTRIC', path: '/kiem-tra-tien-dien', name: 'Kiểm tra tiền điện', required: false },
  { id: 'ROUTE-LOGIN', path: '/dang-nhap', name: 'Đăng nhập', required: true },
  { id: 'ROUTE-REGISTER', path: '/dang-ky', name: 'Đăng ký', required: true },
  { id: 'ROUTE-ACCOUNT', path: '/tai-khoan', name: 'Tài khoản', required: true, authRelated: true },
  { id: 'ROUTE-HISTORY', path: '/lich-su-kiem-tra', name: 'Lịch sử điện', required: false, authRelated: true },
  { id: 'ROUTE-ABOUT', path: '/ve-chung-toi', name: 'Về chúng tôi', required: false },
  { id: 'ROUTE-TERMS', path: '/dieu-khoan', name: 'Điều khoản', required: false },
  { id: 'ROUTE-CONTACT', path: '/lien-he', name: 'Liên hệ', required: false }
];

const ADMIN_ROUTES = [
  { id: 'ADMIN-HOME', path: '/admin', name: 'Admin Dashboard', required: true },
  { id: 'ADMIN-POSTS', path: '/admin/quan-ly-bai-viet', name: 'Quản lý bài viết', required: true },
  { id: 'ADMIN-COMMENTS', path: '/admin/quan-ly-binh-luan', name: 'Quản lý bình luận', required: false },
  { id: 'ADMIN-USERS', path: '/admin/quan-ly-nguoi-dung', name: 'Quản lý người dùng', required: false },
  { id: 'ADMIN-DEVICES', path: '/admin/quan-ly-thiet-bi', name: 'Quản lý thiết bị', required: false },
  { id: 'ADMIN-BANNERS', path: '/admin/cai-dat-giao-dien', name: 'Cài đặt giao diện', required: false }
];

const NAV_ITEMS = [
  { text: /trang chủ|home/i, expectedPath: '/' },
  { text: /mẹo tiết kiệm|tiết kiệm/i, expectedPath: '/meo-tiet-kiem' },
  { text: /cộng đồng/i, expectedPath: '/cong-dong' },
  { text: /đăng bài/i, expectedPath: '/dang-bai' },
  { text: /bài đã lưu|đã lưu/i, expectedPath: '/bai-da-luu' },
  { text: /kiểm tra tiền điện|tiền điện/i, expectedPath: '/kiem-tra-tien-dien', optional: true }
];

module.exports = { PUBLIC_ROUTES, ADMIN_ROUTES, NAV_ITEMS };
