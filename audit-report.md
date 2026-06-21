# BÁO CÁO RÀ SOÁT TỔNG THỂ DỰ ÁN E-XANH (AUDIT REPORT)
*Ngày: 21/06/2026*

---

## 1. BUGS & RỦI RO (Logic, Bảo mật, Edge Cases)

1. **Rủi ro Rate Limit & Treo UI (N+1 Query):**
   - **File:** `src/services/adminUserService.js` (dòng 434)
   - **Vấn đề:** Hàm đếm số lượng (posts, comments, saved, electricity checks) cho danh sách người dùng đang sử dụng vòng lặp `.map` và gọi `Promise.all` với 4 câu query *cho mỗi user*. Nếu fetch 20 user, sẽ phát sinh 80 queries tới Supabase cùng lúc. Điều này rất dễ gây lỗi cạn kiệt kết nối (Connection Pool Exhaustion) hoặc bị Rate Limit.
   - **Đề xuất:** Nên chuyển logic đếm này thành một hàm RPC (Postgres Function) trên Supabase để chỉ gọi 1 lần, group by theo `user_id`.

2. **Lỗi UX (Sử dụng `alert` thay vì hệ thống Toast):**
   - **File:** `src/components/posts/PostCard.jsx` (dòng 31, 41, 45)
   - **Vấn đề:** Chức năng báo lỗi lưu bài viết hoặc tương tác đang sử dụng hàm `alert()` mặc định của trình duyệt thay vì `toast()` của hệ thống. Điều này làm trải nghiệm người dùng kém mượt mà và làm ngắt quãng flow.

3. **Cơ chế xác thực quyền quản trị (Admin Role):**
   - **Vấn đề:** Đa số các trang Admin hiện nay kiểm tra quyền bằng việc lấy `role` từ bảng profile phía Frontend (`if (user.role !== 'admin')`). 
   - **Rủi ro:** Cần đảm bảo rằng các Row Level Security (RLS) policies trên DB của Supabase có kiểm tra role (thường lấy từ JWT claims) cho các thao tác INSERT/UPDATE/DELETE. Nếu không, hacker có thể bỏ qua frontend và gọi thẳng API.

---

## 2. CHỨC NĂNG CHƯA HOÀN THIỆN (Stub, TODO, Placeholders)

Rà soát UI cho thấy một số chức năng vẫn đang sử dụng text giữ chỗ hoặc giao diện giả:

1. **Cài đặt Thông báo / Bảo mật:**
   - **File:** `src/components/account/settings/NotificationSettingsSection.jsx` (dòng 30)
   - **Vấn đề:** Badge hiển thị `"Sắp ra mắt"` cho tính năng tùy chỉnh thông báo.
   - **File:** `src/components/account/settings/SecuritySettingsSection.jsx` (dòng 87, 89)
   - **Vấn đề:** Badge hiển thị `"Sắp ra mắt"` cho lịch sử đăng nhập/bảo mật, và dòng text thông báo *"Hệ thống hiện chưa có luồng tự động đăng xuất..."*.

2. **Giao diện xác thực (Auth):**
   - **File:** `src/pages/auth/ForgotPasswordPage.jsx` (dòng 129)
   - **File:** `src/pages/auth/ResetPasswordPage.jsx` (dòng 326)
   - **Vấn đề:** Phía layout còn hiển thị dòng chữ giữ chỗ `"Ảnh minh họa đang cập nhật"`. Chưa có hình ảnh thật được tích hợp.

3. **Trang Liên hệ (Contact Page):**
   - **File:** `src/pages/user/ContactPage.jsx` (dòng 75)
   - **Vấn đề:** Form liên hệ đã gọi đến bảng `contacts`, nhưng phần Error Handling vẫn đang cứng nhắc thông báo: *"Tính năng đang bảo trì: Hệ thống chưa có schema/backend..."* (Mặc dù tôi đã setup bảng này gần đây, nhưng message báo lỗi chưa được update cho khớp với thông báo lỗi thông thường).

---

## 3. HIỆU NĂNG (Performance)

1. **Lazy Loading cho hình ảnh (Images):**
   - **Vấn đề:** Gần như toàn bộ các thẻ `<img />` trên hệ thống (không dùng `OptimizedImage` hoặc `SmartImage`) đang thiếu thuộc tính `loading="lazy"`.
   - **File ảnh hưởng:** `AvatarUploader.jsx`, `BrandLogo.jsx`, `CommunityPreview.jsx`, `SettingsUserPage.jsx`...
   - **Đề xuất:** Cần thêm `loading="lazy"` vào tất cả ảnh nằm dưới màn hình đầu tiên (below the fold) hoặc tái cấu trúc để dùng chung component `OptimizedImage`.

2. **Bundle & Mã nguồn:**
   - Cấu trúc file `vite.config.js` đã chia `manualChunks` rất tốt cho `vendor`, `router`, `supabase`, `redux` và lazy load các route trong `router.jsx` chuẩn xác. Tuy nhiên, build process báo hiệu thời gian xử lý `.css` khá dài. Cần cân nhắc gộp bớt các file CSS lắt nhắt hoặc loại bỏ code CSS chết (unused CSS).

---

## 4. ĐỀ XUẤT TÍNH NĂNG TIẾP THEO

Dựa trên cấu trúc hệ thống sẵn có (cộng đồng, tính tiền điện, bài viết, auth):

1. **Huy hiệu (Gamification Badges) cho Cộng đồng:**
   - Xây dựng hệ thống tự cấp huy hiệu "Chuyên gia tiết kiệm", "Người đóng góp" cho user dựa trên điểm (points) có sẵn trong profile. Hiển thị badge cạnh tên trên diễn đàn.

2. **Gợi ý thiết bị tự động hoá & tiết kiệm năng lượng (Affiliate):**
   - Tích hợp thêm hệ thống đề xuất các thiết bị tiết kiệm điện năng cho những thiết bị ngốn nhiều điện được user nhập vào ở trang `ElectricityHistoryPage`.

3. **Báo cáo điện năng hàng tháng qua Email:**
   - Viết Supabase Edge Function chạy theo Cronjob hàng tháng. Tổng hợp xem tháng này user đã nhập bao nhiêu số điện, xuất báo cáo và gửi qua Resend/SendGrid.

4. **Thử thách Tiết kiệm Xanh (Monthly Challenges):**
   - User có thể bấm tham gia các thử thách (VD: "Giảm 5% hóa đơn điện tháng này so với tháng trước"). Nếu đạt được, sẽ cộng thêm Điểm tích luỹ.

5. **Lưu Bộ lọc & Tìm kiếm bài viết (Saved Filters):**
   - Tại `TipsPage`, cho phép user lưu lại cấu hình bộ lọc chuyên dụng mà họ thường xem (VD: mẹo tiết kiệm cho điều hòa) để truy cập nhanh lần sau mà không cần chọn lại danh mục.
