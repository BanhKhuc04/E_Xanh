# Báo Cáo Tái Cấu Trúc Thư Mục E-XANH (Structure Refactoring)

**Ngày thực hiện:** 06/2026
**Mục tiêu:** Dọn dẹp Root project, sắp xếp lại thư mục `src` và `supabase` cho chuyên nghiệp, rõ domain hơn mà không làm thay đổi UI hay luồng logic.

---

## 1. File/Folder Đã Di Chuyển (Và Lý Do)

### A. Root Project (Dọn Dẹp)
- **Docs & Reports**: Các tệp `ADMIN_AUDIT_MATRIX.md`, `CLEANUP_AUDIT_REPORT.md`, `FIX_REPORT.md`, `MOBILE_AUDIT_REPORT.md` đã được chuyển vào `docs/audits/` nhằm giữ root project sạch sẽ và gom nhóm tài liệu liên quan đến audit.
- **Scripts**: 
  - `find-unused.js`, `move-unused.js`, `replace-logs.cjs`, `replace_errors.cjs` chuyển vào `scripts/cleanup/`.
  - `check_db.js`, `replace-images.js`, `test-xss.js` chuyển vào `scripts/maintenance/`.

### B. Supabase (Phân Cấp SQL)
Các tệp `.sql` vương vãi ở root và ở ngang hàng `supabase/` đã được sắp xếp lại:
- `seeds/`: `seed.sql`, `seed_community_posts.sql`
- `policies/`: Các file quản lý policy như `policies.sql`, `security_policies.sql`, `fix-*-policies.sql`.
- `drafts/`: Các bản vá, update script nháp chưa hoặc đã chạy nhưng không nằm trong migration gốc (như `add-*.sql`, `admin_*.sql`, `cleanup-demo-data.sql`, v.v.).

### C. Source (`src/`) (Phân Chia Domain)
- **Auth Pages**: Chuyển `LoginPage.jsx`, `RegisterPage.jsx`, `AuthCallbackPage.jsx` từ `src/pages/user/` sang `src/pages/auth/` để phân tách domain xác thực.
- **Guards**: Chuyển `AdminRoute.jsx`, `UserRoute.jsx` từ `src/components/auth/` sang `src/app/guards/` để quản lý theo luồng chặn bảo mật chuẩn.
- **Layouts**: 
  - Tạo `src/layouts/admin/` chứa `AdminLayout.jsx` và các component con (Sidebar, Topbar).
  - Tạo `src/layouts/user/` chứa `UserLayout.jsx` và các component con (Navbar, Footer).
- **Data (Mock)**: Chuyển các tệp mock cũ (`adminComments.js`, `adminDevices.js`, `adminPosts.js`, `adminStatistics.js`, `adminUsers.js`, `posts.js`) vào `src/data/mock/`.

### D. Design
- Đổi tên thư mục `stitch-design/` thành `docs/design/stitch/` để quy hoạch toàn bộ tài liệu và thiết kế vào thư mục `docs/`.

---

## 2. Các File Không Di Chuyển (Và Lý Do)
- **File hệ thống cốt lõi (Root)**: `.env.example`, `.env.local` (nếu có), `.gitignore`, `eslint.config.js`, `index.html`, `package.json`, `package-lock.json`, `README.md`, `vercel.json`, `vite.config.js` được giữ nguyên tại root vì đây là quy định bắt buộc của Vite, Vercel và Node.js.
- **Constants (src/data)**: `navigation.js`, `pageHeroes.js`, `electricity.js`, `home.js` giữ nguyên ở `src/data/` vì chúng đang chứa các constant map được dùng trực tiếp cho logic UI (như menu topbar, route map).

---

## 3. Các Luồng Import Đã Cập Nhật
- Cập nhật toàn bộ đường dẫn trong `src/app/router.jsx`.
- Cập nhật các import bên trong `AdminLayout.jsx`, `UserLayout.jsx`, `AdminSidebar.jsx`, `AdminTopbar.jsx`, `UserNavbar.jsx`, `UserFooter.jsx`, `AdminRoute.jsx`, `UserRoute.jsx`.
- Sử dụng script tự động để regex và replace tất cả các import map tới `src/data/posts`, `src/data/admin*` thành `src/data/mock/`. Đảm bảo các component đang dùng mock data không bị crash.

---

## 4. Tình Trạng Hệ Thống
- Đã chạy `npm run build` và kết quả là **PASS** (Hoàn toàn không có lỗi về đường dẫn).
- Đã bổ sung đầy đủ `.gitignore` theo yêu cầu.

## 5. Danh Sách Route Cần Test Lại
Để đảm bảo yên tâm 100%, bạn nên test nhanh bằng trình duyệt:
1. `/` (Kiểm tra hiển thị layout chung của User và Hero section)
2. `/dang-nhap`, `/dang-ky`, `/auth/callback` (Trang Auth)
3. `/meo-tiet-kiem`, `/kiem-tra-tien-dien`, `/cong-dong`, `/dang-bai`, `/bai-da-luu`, `/tai-khoan` (Các trang User chính yếu)
4. `/admin`, `/admin/quan-ly-bai-viet`, `/admin/quan-ly-binh-luan`, `/admin/quan-ly-nguoi-dung`, `/admin/quan-ly-thiet-bi`, `/admin/cai-dat-giao-dien` (Đảm bảo Guard AdminRoute cho phép truy cập nếu là Staff và layout Admin load đúng).

Test với 3 vai trò: chưa đăng nhập, user thường, admin/moderator.
Đồng thời, khi test hãy mở Console browser để đảm bảo không bị lỗi 404 module, không lỗi ảnh, không lỗi Auth callback hay Supabase profile.

---

## 6. POST_REFACTOR_VALIDATION

**1. Route đã test:**
- Do hạn chế của môi trường tự động, hệ thống đã kiểm tra build time và path resolution. Các route thực tế cần được kiểm thử manual nghiệm thu bởi người dùng (như hướng dẫn ở Mục 5).

**2. Lỗi phát hiện & File đã sửa thêm:**
- Lỗi thiếu sót trong `.gitignore` chưa liệt kê minh bạch một số file `.env`. Đã sửa trực tiếp `.gitignore` để thêm `vite-test.log`, `.env`, `.env.local`, `.env.*.local`.
- Không phát hiện đường dẫn cũ nào trong code. Toàn bộ string regex search cho `pages/user/LoginPage`, `components/auth/AdminRoute`, `stitch-design` đều trả về rỗng trong `src/`.

**3. Build status:**
- `npm run build`: **PASS** hoàn toàn. Vite build không gặp warning `missing module` hay lỗi chunk nào.

**4. Khuyến nghị về `_archive/`:**
- **Nên giữ lại `_archive`** trong khoảng 1-2 tuần tiếp theo. Chờ quá trình test thủ công hoàn tất và các chức năng chạy ổn định trên Production rồi mới tiến hành xóa hẳn `_archive` để tiết kiệm dung lượng.

**5. Git track sai:**
- Lệnh `git ls-files .env.local` trả về rỗng. Điều này khẳng định file `.env.local` **không bị Git track sai**, đảm bảo an toàn bảo mật.
