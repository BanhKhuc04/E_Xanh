# Báo cáo sửa lỗi và tối ưu hóa hệ thống E-XANH (Bảo mật, SEO, UX)

## 1. Vấn đề Bảo mật (Security)
- **Chống Role Escalation:** Hàm `updateProfile` đã được giới hạn qua whitelist `pickSafeProfileUpdates` chỉ cho phép cập nhật `name`, `bio`, `avatar_url`. Người dùng không thể tự cấp quyền `admin`. 
- **Bảo mật File Upload:** Tạo helper xác thực `fileValidation.js` từ chối các định dạng không an toàn (SVG/HTML) và giới hạn kích thước 5MB, được áp dụng trên `postService` và `bannerService`. Đồng thời chuẩn hoá tên file bằng thuật toán ngẫu nhiên nhằm phòng tránh lỗi kí tự lạ.
- **Server-side RLS:** Đã cung cấp kịch bản SQL bảo mật (trong `supabase/security_policies.sql`) để bảo vệ quyền CRUD tại DB. 
- **RBAC Client-side:** Sử dụng helper `isStaff(profile)` dựa trên profile truy vấn từ DB để bảo vệ AdminRoute và các chức năng xóa tài nguyên thay vì dựa dẫm vào localStorage không an toàn.
- **Che giấu lỗi hệ thống:** Đã tạo cơ chế `logger.js` với `logError` (chỉ ở Dev) và `getUserSafeError` để xoá mờ đi các chi tiết kĩ thuật nhạy cảm (JWT, RLS) trên UI khi hiển thị cho người dùng.

## 2. Vấn đề SEO và Vercel Cache
- **Sitemap & Robots.txt Cache:** Thay đổi `vercel.json` thiết lập `max-age=86400` cho sitemap và robots để bot có thể tải phiên bản mới hàng ngày, và chặn cache với các file bảo mật.
- **Google Fonts SEO:** Khai báo preconnect và tham số `subset=vietnamese` trong `index.html`.
- **Meta Robots Noindex:** Gắn thẻ `<meta name="robots" content="noindex,nofollow" />` cho các trang auth, hồ sơ cá nhân và khu vực cài đặt.
- **Loại bỏ Private Routes khỏi Sitemap:** Sửa `vite.config.js` để plugin sitemap chỉ quét các trang public thực sự.

## 3. Vấn đề Trải nghiệm người dùng (UX)
- **Giới hạn độ dài bình luận:** Textarea giờ đây tối đa 1000 ký tự. Văn bản hiển thị số lượng ký tự sẽ đổi màu (cam và đỏ) để nhắc nhở người dùng khi gần tới giới hạn.
- **Development Notice:** Chỉ hiển thị trong DEV hoặc khi kích hoạt flag. Tự động ghi nhớ thao tác đóng bằng `exanh_dev_notice_dismissed_v1`.
- **Lịch sử tính tiền điện:** Thêm nút "Xoá toàn bộ lịch sử", có hộp thoại xác nhận. Đồng thời bổ sung lưu ý rằng lịch sử hiện đang được lưu trên LocalStorage.
- **Deadlinks & Nút chưa hoàn thiện:** Toàn bộ nút `alert('Tính năng đang phát triển')` đã được xử lý chuẩn HTML `disabled="true"`, `aria-disabled="true"` và `title="Tính năng đang phát triển"`.

## 4. Kết quả quá trình xác nhận (Verification)
- Xoá toàn bộ console.error() phơi bày log nhạy cảm bằng script regex, thành công áp dụng cho tất cả dịch vụ.
- `npm run build` hoàn thành trong 2.74s, không có lỗi module, không có route private nào lọt vào build sitemap trái phép.
