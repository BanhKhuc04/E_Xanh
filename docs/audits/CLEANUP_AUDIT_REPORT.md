# Báo cáo Audit & Cleanup Codebase E-XANH (06/2026)

Mục tiêu: Dọn dẹp dead code, mock file, test, demo, unused assets/css ra khỏi `src` và `supabase` mà không ảnh hưởng tới project.

## Thống kê tổng quan
- Tổng số file đã rà soát: Toàn bộ thư mục `src` (~200+ files) và `supabase` (23 files)
- Số file đã chuyển sang `_archive/cleanup-2026-06/`: 13
- Số file đánh dấu REVIEW: 8 (Dependencies và SQL scripts)
- Các console.log đã xóa: Các log debug trong `src/components/home/FeaturedPosts.jsx`
- Trạng thái build (`npm run build`): **PASS** (Không lỗi)

## Bảng Chi Tiết

### 1. Files đã chuyển sang Archive (Không dùng)

| File/Folder | Loại | Trạng thái | Lý do | Có import ở đâu không | Ảnh hưởng nếu xóa | Hành động đã làm |
|---|---|---|---|---|---|---|
| `src/assets/branding/logo.png` | Asset | ARCHIVE | Đã có logo .webp/svg thay thế, file cũ không được dùng | Không | Không | Đã move |
| `src/assets/react.svg` | Asset | ARCHIVE | Mặc định của Vite, không dùng | Không | Không | Đã move |
| `src/assets/vite.svg` | Asset | ARCHIVE | Mặc định của Vite, không dùng | Không | Không | Đã move |
| `src/components/account/AccountSettingsCard.jsx` | Component | ARCHIVE | File cũ, đã dùng `SettingsUserPage` thay thế | Không | Không | Đã move |
| `src/components/account/ChangePasswordModal.jsx` | Component | ARCHIVE | Chức năng cũ, không còn được dùng | Không | Không | Đã move |
| `src/components/account/EditProfileModal.jsx` | Component | ARCHIVE | Modal cũ, đã dùng trang cài đặt profile riêng | Không | Không | Đã move |
| `src/components/account/RecentElectricityHistoryCard.jsx`| Component | ARCHIVE | Component cũ, trang account đã được làm lại | Không | Không | Đã move |
| `src/components/admin/statistics/AdminActiveUsers.jsx` | Component | ARCHIVE | Component thống kê cũ, không import | Không | Không | Đã move |
| `src/data/adminSettings.js` | Data/Mock | ARCHIVE | File mock data, đã chuyển sang lấy từ Supabase | Không | Không | Đã move |
| `src/data/community.js` | Data/Mock | ARCHIVE | File mock data cộng đồng cũ | Không | Không | Đã move |
| `src/lib/testSupabaseConnection.js`| Test | ARCHIVE | Script test kết nối, không chạy trong app | Không | Không | Đã move |
| `src/services/adminStatsService.js`| Service | ARCHIVE | Service thừa, logic đã gộp vào file khác | Không | Không | Đã move |
| `src/utils/authStorage.js` | Util | ARCHIVE | Util localStorage cũ cho Auth, hiện dùng Supabase session | Không | Không | Đã move |

### 2. Thành phần cần REVIEW (Nghi ngờ, chưa xóa)

| Thành phần | Loại | Trạng thái | Lý do | Có import ở đâu không | Ảnh hưởng nếu xóa | Hành động đã làm |
|---|---|---|---|---|---|---|
| `axios` | Dependency | REVIEW | Phát hiện trong `package.json` nhưng codebase không dùng, toàn bộ fetch gọi qua Supabase JS client. | Không | Rất nhỏ (Nên chạy npm uninstall) | Ghi nhận |
| `@reduxjs/toolkit` | Dependency | REVIEW | Cài đặt nhưng codebase không sử dụng Redux (đang dùng useState/Context) | Không | Giảm bundle size | Ghi nhận |
| `react-redux` | Dependency | REVIEW | Đi kèm với Redux Toolkit | Không | Giảm bundle size | Ghi nhận |
| `bootstrap` | Dependency | REVIEW | E-Xanh tự viết custom Vanilla CSS, package bootstrap không được import | Không | Giảm bundle size | Ghi nhận |
| `react-bootstrap` | Dependency | REVIEW | E-Xanh không dùng Component của React-Bootstrap | Không | Giảm bundle size | Ghi nhận |
| `supabase/cleanup-demo-data.sql` | SQL Script | REVIEW | Script nháp dọn dẹp data, có thể cần cho dev test. | N/A | Không thể run thủ công | Giữ lại |
| `supabase/seed.sql` | SQL Script | REVIEW | Chứa mock data seed local, không ảnh hưởng production nhưng hữu ích cho dev. | N/A | Mất data mẫu local | Giữ lại |
| `supabase/seed_community_posts.sql`| SQL Script | REVIEW | Chứa data bài viết mẫu. | N/A | Mất data mẫu local | Giữ lại |

### 3. Routes & Pages
- Đã check toàn bộ router trong `src/app/router.jsx`.
- 100% các page trong `src/pages/user`, `src/pages/admin`, `src/pages/shared` ĐỀU ĐANG ĐƯỢC SỬ DỤNG. Không có page thừa.

### 4. CSS
- Các file `.css` (đặc biệt trong `src/styles`) đều được import vào các Component hoặc Layout.
- File `responsive-fix.css` mới tạo được gọi trong `global.css`, giữ nguyên.

### 5. Mock / Test / Debug
- Đã rà soát `console.log`.
- **Hành động**: Đã xóa cụm code `console.log('--- DEBUG getFeaturedPosts ---')` trong `src/components/home/FeaturedPosts.jsx` để dọn dẹp debug cũ.
- Kiểm tra `localStorage`: Một số tính năng như `dismiss announcement`, `development notice`, `post draft` và `electricity history` vẫn sử dụng hợp lệ. Không xóa.

## Tổng Kết
Codebase E-XANH đã được lọc sạch sẽ những file thực sự dead code. Thư mục `_archive/cleanup-2026-06/` đã lưu trữ an toàn các file cũ. Bạn có thể tiến hành test toàn diện các luồng hoặc remove những Dependencies trong danh sách REVIEW nếu muốn tối ưu package size.
