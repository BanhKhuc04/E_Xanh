# 🌿 E-XANH

Website giúp người trẻ đọc mẹo tiết kiệm điện, chia sẻ kinh nghiệm sống xanh, kiểm tra tiền điện và quản trị nội dung.

---

## 🚀 Công nghệ sử dụng

| Công nghệ | Mô tả |
|-----------|-------|
| ReactJS | Thư viện UI |
| Vite | Build tool & Dev server |
| React Router DOM v6 | Điều hướng SPA |
| CSS | Styling thuần (không framework CSS) |
| localStorage | Lưu trữ dữ liệu tạm trên trình duyệt |
| Mock data | Dữ liệu mẫu tĩnh (không có backend) |

---

## 📋 Chức năng

### Phía người dùng (User)

- **Trang chủ** — Giới thiệu nền tảng, bài viết nổi bật, gợi ý tiết kiệm
- **Mẹo tiết kiệm** — Danh sách bài viết mẹo tiết kiệm điện
- **Chi tiết bài viết** — Xem nội dung bài viết, thích, lưu, bình luận
- **Bài đã lưu** — Quản lý các bài viết đã lưu
- **Cộng đồng** — Bài chia sẻ từ cộng đồng người dùng
- **Đăng bài chia sẻ** — Tạo bài viết mới gửi lên cộng đồng
- **Kiểm tra tiền điện** — Nhập thiết bị, tính chi phí điện ước tính
- **Lịch sử kiểm tra tiền điện** — Xem lại các lần kiểm tra đã lưu, tính lại
- **Đăng nhập / Đăng ký** — Xác thực giả lập bằng localStorage
- **Tài khoản của tôi** — Xem và chỉnh sửa thông tin cá nhân
- **Về chúng tôi** — Giới thiệu đội ngũ phát triển
- **Điều khoản** — Điều khoản sử dụng nền tảng
- **Liên hệ** — Form liên hệ hỗ trợ

### Phía quản trị (Admin)

- **Dashboard** — Tổng quan hoạt động, biểu đồ tương tác, bình luận mới
- **Duyệt bài viết** — Duyệt / từ chối bài viết chờ kiểm duyệt
- **Quản lý bình luận** — Duyệt, ẩn, xóa bình luận vi phạm
- **Quản lý người dùng** — Xem, khóa / mở khóa, đổi vai trò người dùng
- **Quản lý thiết bị điện** — Thêm, sửa, ẩn thiết bị và gợi ý tiết kiệm
- **Thống kê** — Biểu đồ CSS, top thiết bị, bài viết, người dùng tích cực
- **Cài đặt hệ thống** — Thông tin nền tảng, toggle duyệt nội dung, bảo mật, giao diện

---

## 🛠️ Cách chạy project

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy development server
npm run dev

# 3. Build production
npm run build

# 4. Preview bản build
npm run preview

# 5. Kiểm tra lỗi code
npm run lint
```

---

## 🔑 Tài khoản demo

| Vai trò | Cách truy cập |
|---------|---------------|
| **User** | Nhập email hợp lệ bất kỳ + mật khẩu bất kỳ tại `/dang-nhap` |
| **Admin** | Truy cập trực tiếp `/admin` trên trình duyệt |

---

## 📁 Cấu trúc thư mục chính

```
src/
├── app/              # Router config
├── components/       # Component tái sử dụng
│   ├── admin/        # Component admin (devices, settings, statistics, users, ...)
│   ├── common/       # Component dùng chung (BrandLogo, ...)
│   ├── electricity/  # Component kiểm tra tiền điện
│   └── layout/       # Layout component (admin sidebar/topbar, user navbar/footer)
├── data/             # Mock data tĩnh
├── layouts/          # AdminLayout, UserLayout
├── pages/            # Tất cả page component
│   ├── admin/        # 7 trang admin
│   ├── shared/       # NotFoundPage
│   └── user/         # 14 trang user
├── styles/           # CSS files
└── utils/            # authStorage, electricityStorage
```

---

## 📝 Ghi chú

- Dự án sử dụng **mock data** và **localStorage** để mô phỏng chức năng, không có backend hoặc API thật.
- Toàn bộ giao diện bằng **tiếng Việt**.
- Palette màu chủ đạo: `#EAF59D` · `#C1D95C` · `#80B155` · `#4F8428` · `#336A29`
- Font chữ: **Be Vietnam Pro** (Google Fonts).
- Responsive cơ bản cho Desktop, Tablet, Mobile.

---

**© 2024 E-XANH. Made by VanhKhucDev**
