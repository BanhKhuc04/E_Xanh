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
| Supabase | Backend-as-a-Service (Auth, Database, Storage) |

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
├── lib/              # Supabase client, test connection
├── pages/            # Tất cả page component
│   ├── admin/        # 7 trang admin
│   ├── shared/       # NotFoundPage
│   └── user/         # 14 trang user
├── styles/           # CSS files
└── utils/            # authStorage, electricityStorage

supabase/
├── schema.sql        # SQL tạo 11 bảng database
├── seed.sql          # Dữ liệu mẫu (categories, devices, settings)
└── policies.sql      # Row Level Security policies
```

---

## 🗄️ Nâng cấp Supabase backend

### Bước 1: Tạo project Supabase

1. Vào [supabase.com](https://supabase.com) → **New Project**
2. Chọn region: **Southeast Asia (Singapore)**
3. Đặt password database → lưu lại
4. Đợi project khởi tạo (~2 phút)

### Bước 2: Tạo file `.env.local`

Copy từ `.env.example`:

```bash
cp .env.example .env.local
```

Mở `.env.local` và điền giá trị thật từ **Supabase Dashboard → Settings → API**:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

> ⚠️ **Không commit `.env.local`** — file này đã nằm trong `.gitignore` (`*.local`).

### Bước 3: Chạy SQL trong Supabase

Vào **SQL Editor** trong Supabase Dashboard, chạy **đúng thứ tự**:

1. **`supabase/schema.sql`** — Tạo 11 bảng + trigger tự tạo profile
2. **`supabase/policies.sql`** — Thiết lập Row Level Security
3. **`supabase/seed.sql`** — Nhập dữ liệu mẫu (categories, devices, settings)

### Bước 4: Test kết nối

Mở `src/main.jsx` và thêm tạm:

```javascript
import { testSupabaseConnection } from './lib/testSupabaseConnection'
testSupabaseConnection()
```

Chạy `npm run dev`, mở console trình duyệt. Nếu thấy:

```
[E-XANH] Kết nối thành công! Dữ liệu categories: [...]
```

→ Kết nối OK ✅. **Nhớ xóa dòng test sau khi kiểm tra xong.**

### Bước 5: Deploy lên Vercel

Thêm 2 biến môi trường vào **Vercel → Settings → Environment Variables**:

| Tên | Giá trị |
|-----|---------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` |

Sau đó redeploy.

---

## 📝 Ghi chú

- Dự án hiện đang dùng **mock data** và **localStorage** để mô phỏng chức năng. Supabase backend đang trong quá trình tích hợp.
- Toàn bộ giao diện bằng **tiếng Việt**.
- Palette màu chủ đạo: `#EAF59D` · `#C1D95C` · `#80B155` · `#4F8428` · `#336A29`
- Font chữ: **Be Vietnam Pro** (Google Fonts).
- Responsive cơ bản cho Desktop, Tablet, Mobile.

---

**© 2024 E-XANH. Made by VanhKhucDev**

