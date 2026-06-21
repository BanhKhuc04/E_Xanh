# Kế hoạch khắc phục các vấn đề còn tồn đọng từ Audit

Dựa trên báo cáo Audit trước đó, dưới đây là kế hoạch chi tiết để xử lý dứt điểm các vấn đề từ N+1 Query, tối ưu Performance, sửa UI đến bổ sung các tính năng còn thiếu.

## 1. Vá lỗi N+1 Query (Performance & Rate Limit)
**Vị trí:** `src/services/adminUserService.js`
**Vấn đề:** Đang dùng vòng lặp `.map` và `Promise.all` tạo ra 4 requests đếm dữ liệu cho *mỗi* user (ví dụ 20 users = 80 requests cùng lúc).
**Giải pháp đề xuất:**
- Tạo một file Migration SQL mới để định nghĩa hàm RPC trên Postgres (`get_users_activity_stats(user_ids uuid[])`).
- Hàm này sẽ nhận vào mảng UUID và trả về bảng tổng hợp số lượng (posts, comments, saves, electricity) cho toàn bộ user chỉ trong **1 request duy nhất**.
- Cập nhật hàm `adminUserService.js` để gọi `supabase.rpc(...)` thay vì `.map()`.

## 2. Loại bỏ Alert() thô và tích hợp hệ thống Toast
**Vị trí:** `src/components/posts/PostCard.jsx`
**Vấn đề:** Khi báo lỗi không thể lưu bài viết, đang dùng hàm `alert()` mặc định của trình duyệt gây trải nghiệm gián đoạn (UX kém).
**Giải pháp đề xuất:**
- Thêm State `toast` và Component `<Toast />` có sẵn từ `src/components/common/Toast.jsx` vào `PostCard.jsx`.
- Thay thế toàn bộ các hàm `alert(...)` bằng `setToast(...)` để hiển thị lỗi nhẹ nhàng hơn ở góc màn hình.

## 3. Hoàn thiện Giao diện (Xóa Placeholders)
**Vị trí:** `src/pages/auth/ForgotPasswordPage.jsx`, `ResetPasswordPage.jsx`
- Vấn đề: Giao diện còn dòng chữ "Ảnh minh họa đang cập nhật".
- Giải pháp: Tôi sẽ tự động sinh (Generate) một bức ảnh nghệ thuật vector chất lượng cao (phong cách sống xanh) và gắn vào làm ảnh minh họa.

**Vị trí:** `src/pages/user/ContactPage.jsx`
- Vấn đề: Thông báo lỗi "Hệ thống chưa có bảng contacts" (Tôi đã tạo bảng này nên lỗi này không còn, nhưng code vẫn giữ fallback).
- Giải pháp: Xóa fallback text không cần thiết này.

## 4. Tối ưu Hiệu năng tải trang (Lazy-load Images)
**Vị trí:** Gần 20 components khác nhau (như `AvatarUploader`, `CommunityPreview`, `SettingsUserPage`, v.v.)
**Vấn đề:** Các thẻ `<img />` truyền thống tải ngay lập tức kể cả khi người dùng chưa cuộn tới (làm giảm điểm Lighthouse & băng thông).
**Giải pháp:**
- Dùng công cụ code tìm kiếm và tự động bổ sung thuộc tính `loading="lazy"` cho tất cả các thẻ `<img />` ngoại trừ thẻ nằm trên vùng màn hình đầu tiên (như `BrandLogo`).

## ⚠️ User Review Required
Trong phần Setting của User có 2 chỗ ghi chú:
- `NotificationSettingsSection.jsx`: Tính năng "Cài đặt thông báo (Push/Email)" đang để nhãn "Sắp ra mắt".
- `SecuritySettingsSection.jsx`: Tính năng "Tự động đăng xuất/Lịch sử thiết bị" đang để nhãn "Sắp ra mắt".

**Câu hỏi mở cho bạn:** Bạn muốn tôi (A) Ẩn hẳn các tính năng này đi cho đến khi code thật, hay (B) Cứ giữ nguyên text "Sắp ra mắt" như một gợi ý cho người dùng, hay (C) Tiến hành code backend và logic thật cho 2 tính năng này luôn trong lần cập nhật tới?

Vui lòng bấm **Proceed** nếu bạn đồng ý với kế hoạch 4 bước trên, và cho tôi biết lựa chọn của bạn về phần Setting nhé!
