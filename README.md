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
| Supabase | Backend-as-a-Service (Auth, Database, Storage) |

---

## 📋 Chức năng

### Phía người dùng (User)

- **Trang chủ** — Giới thiệu nền tảng, bài viết nổi bật, gợi ý tiết kiệm
- **Mẹo tiết kiệm** — Danh sách bài viết mẹo tiết kiệm điện
- **Chi tiết bài viết** — Xem nội dung bài viết, thích, lưu, bình luận
- **Bài đã lưu** — Quản lý các bài viết đã lưu
- **Cộng đồng** — Bài chia sẻ từ cộng đồng người dùng
- **Đăng bài chia sẻ** — Tạo bài viết mới gửi lên cộng đồng (cần duyệt)
- **Kiểm tra tiền điện** — Nhập thiết bị, tính chi phí điện ước tính
- **Lịch sử kiểm tra tiền điện** — Xem lại các lần kiểm tra đã lưu, tính lại
- **Đăng nhập / Đăng ký** — Hệ thống xác thực bằng Email/Password qua Supabase Auth
- **Tài khoản của tôi** — Xem thông tin cá nhân và thiết lập
- **Về chúng tôi** — Giới thiệu đội ngũ phát triển
- **Điều khoản** — Điều khoản sử dụng nền tảng
- **Liên hệ** — Form liên hệ hỗ trợ

### Phía quản trị (Admin / Moderator)

- **Dashboard** — (Chỉ Admin) Tổng quan hệ thống dữ liệu thực (Bài viết, Users, Saved Posts...)
- **Quản lý bài viết** — (Admin/Moderator) Duyệt, từ chối, ẩn bài. Admin có thể Xóa bài viết.
- **Quản lý người dùng** — (Chỉ Admin) Xem danh sách người dùng, khóa tài khoản, cấp quyền (Moderator, Admin).
- **Phân quyền chặt chẽ (RLS)** — Không cho Moderator xóa bài. Không cho Moderator vào trang người dùng. Không cho Admin tự khóa hay hạ quyền nếu là Admin duy nhất.

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

Hệ thống đã kết nối hoàn chỉnh với Supabase Auth. Bạn cần tạo tài khoản thực tế bằng Email.

| Vai trò | Cơ chế |
|---------|---------------|
| **User** | Đăng ký tài khoản bình thường tại `/dang-ky`. Mặc định được cấp role `user`. |
| **Moderator / Admin** | Đăng ký tài khoản thường, sau đó phải dùng tài khoản Admin (hoặc set trong bảng `profiles` ở Supabase) để nâng quyền lên `moderator` hoặc `admin`. |

---

## 🗄️ Tích hợp Supabase backend

### Bước 1: Tạo project Supabase

1. Vào [supabase.com](https://supabase.com) → **New Project**
2. Đợi project khởi tạo.

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
2. **`supabase/policies.sql`** — Thiết lập Row Level Security (RLS) bảo vệ dữ liệu.
3. **`supabase/seed.sql`** — (Tùy chọn) Nhập dữ liệu mẫu (categories, devices, settings).

### Bước 4: Tự thiết lập Admin đầu tiên
Vào Supabase -> Table Editor -> `profiles`, tìm row của tài khoản bạn vừa tạo, sửa cột `role` thành `admin`.

### Bước 5: Deploy lên Vercel

Thêm 2 biến môi trường vào **Vercel → Settings → Environment Variables**:

| Tên | Giá trị |
|-----|---------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` |

Sau đó redeploy.

---

## 📝 Ghi chú

- Toàn bộ giao diện bằng **tiếng Việt**.
- Palette màu chủ đạo: `#EAF59D` · `#C1D95C` · `#80B155` · `#4F8428` · `#336A29`
- Font chữ: **Be Vietnam Pro** (Google Fonts).
- Responsive cơ bản cho Desktop, Tablet, Mobile.
- Tích hợp 100% API cho Auth, Posts và Profiles.

---

**© 2024 E-XANH**
