# Báo cáo Audit Toàn bộ Dự án E-XANH

Báo cáo này rà soát và đối chiếu toàn bộ các trang, component, service và thư viện trong dự án **E-XANH** với cơ sở dữ liệu Supabase nhằm xác định các lỗi kết nối, dữ liệu cứng/mock, và lập kế hoạch dọn dẹp (cleanup) dữ liệu test/demo một cách an toàn.

---

## 1. Bảng Đối chiếu Giao diện (UI) và Database Supabase

| Khu vực | File liên quan | Bảng Supabase cần dùng | Hiện trạng | Vấn đề | Mức độ | Cách sửa |
|---|---|---|---|---|---|---|
| **1. Trang chủ** | [HeroSection.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/components/home/HeroSection.jsx), [FeaturedPosts.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/components/home/FeaturedPosts.jsx), [CommunityPreview.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/components/home/CommunityPreview.jsx), [ElectricityPreview.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/components/home/ElectricityPreview.jsx), [home.js](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/data/home.js) | `website_banners`, `posts`, `profiles` | `partial` | Các text tĩnh trong Hero, thẻ FeatureCard, card ước tính tiền điện (`electricityPreview`) đang lấy dữ liệu cứng từ file `data/home.js`. Chỉ có Banner, bài viết nổi bật, bài viết cộng đồng là đã nối DB thật. | **medium** | Chuyển đổi các trường thông tin tĩnh của trang chủ sang cấu hình động trong `platform_settings` / `system_settings` hoặc hiển thị dữ liệu thật từ DB. |
| **2. Mẹo tiết kiệm** | [TipsPage.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/pages/user/TipsPage.jsx) | `posts`, `categories` | `query_wrong` | 1. Bộ lọc category (`postCategories`) đang là mảng tĩnh (hardcode), không lấy từ bảng `categories`.<br>2. **Lỗi logic lọc**: `post.category` được map từ `post.type` thành "Mẹo tiết kiệm", "Cộng đồng" nhưng bộ lọc UI lại lọc theo "Điều hòa", "Laptop", "Tủ lạnh". Lọc category sẽ luôn trả về danh sách rỗng (EmptyState). | **high** | 1. Query danh sách categories từ bảng `categories` lên UI.<br>2. Map lại dữ liệu cột `category_id` của `posts` tương ứng thay vì map bừa bãi từ `post.type`. |
| **3. Cộng đồng** | [CommunityPage.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/pages/user/CommunityPage.jsx), [postService.js](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/services/postService.js) | `posts`, `profiles`, `post_likes`, `saved_posts`, `comments` | `query_wrong` | **Lỗi lọc chủ đề**: Hàm `sortCommunityPosts` thực hiện lọc bài viết theo `topic === 'Hỏi đáp'` hoặc `'Kinh nghiệm'`. Tuy nhiên, `post.topic` trong mapping lại chỉ gán cứng dựa trên: `p.type === 'community' ? 'Cộng đồng' : 'Mẹo tiết kiệm'`. Do đó, người dùng bấm lọc "Hỏi đáp" hay "Kinh nghiệm" sẽ ra rỗng. | **high** | Sửa mapping của `post.topic` để đọc đúng trường `p.type` gốc (`qa` -> Hỏi đáp, `community` -> Kinh nghiệm/Cộng đồng, `review` -> Review thiết bị). |
| **4. Bài đã lưu** | [SavedPostsPage.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/pages/user/SavedPostsPage.jsx), [SavedSidebar.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/components/posts/SavedSidebar.jsx) | `saved_posts`, `posts` | `partial` | "Bài đọc gần đây" (`recentlyRead`) đang được truyền cứng là mảng rỗng `[]` do không có bảng tương ứng để lưu vết trên DB. | **low** | Ẩn phần UI này hoặc phát triển thêm cơ chế lưu lịch sử đọc bằng `localStorage` / bảng `recently_read_posts` mới nếu muốn. |
| **5. Tài khoản** | [AccountPage.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/pages/user/AccountPage.jsx) | `profiles`, `posts`, `saved_posts`, `comments` | `connected` | Mọi thông tin (số bài đăng, số bình luận, số bài đã lưu) đều tính toán động từ DB. Chỉ có mục "Gợi ý dành cho bạn" (Sidebar) là hardcode text tĩnh. | **low** | Cải tiến thuật toán gợi ý dựa trên hành vi thật hoặc giữ nguyên như text định hướng người dùng. |
| **6. Kiểm tra tiền điện** | [ElectricityCheckPage.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/pages/user/ElectricityCheckPage.jsx), [ElectricityHistoryPage.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/pages/user/ElectricityHistoryPage.jsx), [electricityService.js](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/services/electricityService.js) | `devices`, `electricity_checks`, `electricity_check_items` | `partial` | 1. Dữ liệu thiết bị gốc được lấy từ bảng `devices` thành công.<br>2. **Vấn đề lớn**: Lịch sử kiểm tra điện lại được lưu và đọc trực tiếp từ `localStorage` thông qua helper `electricityStorage.js`. Mặc dù trong `electricityService.js` đã có sẵn các API kết nối bảng `electricity_checks` và `electricity_check_items` nhưng frontend **không gọi tới** khi lưu/tải lịch sử. | **high** | Tích hợp các hàm `saveElectricityCheck`, `getMyElectricityChecks` vào `ElectricityCheckPage` và `ElectricityHistoryPage` thay thế cho `localStorage` để đồng bộ DB cho user đã đăng nhập. |
| **7. Bình luận** | [CommentManagementPage.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/pages/admin/CommentManagementPage.jsx), [interactionService.js](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/services/interactionService.js) | `comments`, `profiles`, `posts`, `reports` | `query_wrong` | Trong trang Admin quản lý bình luận, cột "Số lượt báo cáo" hiển thị số báo cáo của bình luận. Trích xuất trong UI dùng `reports: c.reports_count || 0`, nhưng service `getAllCommentsAdmin` **không thực hiện join/đếm từ bảng `reports`**. Số lượt báo cáo luôn hiển thị là 0. | **medium** | Bổ sung logic đếm hoặc join với bảng `reports` trong service `getAllCommentsAdmin`. |
| **8. Báo cáo** | *Không có file UI* | `reports` | `unused` | Không có giao diện hay nút nào cho phép người dùng gửi báo cáo (Report) bài viết/bình luận, và admin cũng không có trang rà soát hàng đợi báo cáo. Bảng `reports` hoàn toàn chưa được sử dụng ở frontend. | **medium** | Bổ sung nút Báo cáo (Report Modal) ở UI bài viết/bình luận và giao diện Admin rà soát báo cáo vi phạm. |
| **9. Thông báo** | [notificationService.js](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/services/notificationService.js), [SystemNotificationPage.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/pages/admin/SystemNotificationPage.jsx) | `notifications`, `notification_batches`, `user_notifications` | `connected` | Đã chuyển sang dùng bảng `notifications` và `notification_batches`. Tuy nhiên, trong code vẫn giữ fallback kết nối bảng `user_notifications` cũ (legacy). | **low** | Xóa bỏ code liên quan đến bảng `user_notifications` để tối ưu hóa, thống nhất sử dụng bảng `notifications` mới. |
| **10. Banner / Cấu hình giao diện** | [bannerService.js](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/services/bannerService.js), [PageHero.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/components/common/PageHero.jsx) | `website_banners` | `connected` | Banners tải động theo `page_key`, upload ảnh lên bucket `website-banners` và lưu link vào DB hoạt động bình thường. | **low** | Không có vấn đề. |
| **11. Admin dashboard** | [AdminDashboardPage.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/pages/admin/AdminDashboardPage.jsx), [analyticsService.js](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/services/analyticsService.js) | `posts`, `profiles`, `saved_posts`, `comments`, `devices`, `electricity_checks` | `connected` | Dữ liệu dashboard được thống kê động hoàn toàn qua queries từ DB thật, không dùng dữ liệu fake. | **low** | Không có vấn đề. |
| **12. Admin quản lý bài viết** | [PostManagementPage.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/pages/admin/PostManagementPage.jsx) | `posts` | `connected` | CRUD hoạt động chính xác với DB thật. Việc phê duyệt / từ chối cập nhật trực tiếp cột `status` trong bảng `posts`. | **low** | Không có vấn đề. |
| **13. Admin quản lý người dùng** | [UserManagementPage.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/pages/admin/UserManagementPage.jsx), [adminUserService.js](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/services/adminUserService.js) | `profiles` | `connected` | Đã kết nối DB thật. Có logic kiểm tra chống tự hạ quyền hoặc khóa tài khoản Admin cuối cùng để bảo vệ hệ thống. | **low** | Không có vấn đề. |
| **14. Admin quản lý thiết bị** | [DeviceManagementPage.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/pages/admin/DeviceManagementPage.jsx) | `devices` | `connected` | Hoạt động tốt với dữ liệu thật. Thiết bị được dùng làm danh mục master cho công cụ kiểm tra tiền điện. | **low** | Không có vấn đề. |
| **15. Admin cài đặt** | [SettingsPage.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/pages/admin/SettingsPage.jsx), [settingsService.js](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/services/settingsService.js) | `system_settings`, `platform_settings`, `system_backups`, `admin_action_logs` | `connected` | Đã kết nối động, tự tìm và ghi vào bảng `system_settings` (ưu tiên) hoặc `platform_settings` (fallback) nếu bảng kia chưa có. Tích hợp quản lý sao lưu (backups) hoạt động bình thường. | **low** | Không có vấn đề. |

---

## 2. Danh sách Mock / Hardcode cần xóa hoặc cập nhật ở Frontend
1. **[home.js](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/data/home.js)**:
   - Các text mô phỏng như `Floating savings: 420.000đ/tháng`, `Tốn điện nhất: Điều hòa nhiệt độ`, `Mẹo hay: Đặt điều hòa 26–28°C kết hợp quạt gió`.
   - `homeFeaturedPosts` và `homeCommunity` (hiện tại homepage đã có code fallback gọi DB nhưng vẫn lưu trữ mảng tĩnh này, cần cleanup file data).
2. **[TipsPage.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/pages/user/TipsPage.jsx)**:
   - Danh sách mảng cứng `postCategories` cần chuyển sang query từ Supabase table `categories`.
3. **[CommunityPage.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/pages/user/CommunityPage.jsx)**:
   - `communityFilters` cứng cần khớp với schema `type` thật của bài viết trên DB.
4. **[SavedPostsPage.jsx](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/src/pages/user/SavedPostsPage.jsx)**:
   - Mảng rỗng `recentlyRead={[]}` cần được xử lý ẩn đi hoặc thay thế bằng cơ chế lưu lịch sử đọc thật.

---

## 3. Các Component chưa kết nối / Kết nối lỗi với Supabase
1. **Bộ lọc Category trong `TipsPage.jsx`**:
   - Chưa kết nối bảng `categories` và bị lỗi logic lọc do so sánh category tĩnh với mapped type động.
2. **Bộ lọc chủ đề trong `CommunityPage.jsx`**:
   - Bị lỗi so sánh topic ("Hỏi đáp", "Kinh nghiệm") với giá trị map cứng từ database (`p.type`).
3. **Phần lịch sử "Bài đọc gần đây" trên Sidebar của `SavedPostsPage.jsx`**:
   - Truyền tham số rỗng, chưa kết nối lưu trữ.
4. **Trang lịch sử kiểm tra điện (`ElectricityHistoryPage.jsx`)**:
   - Đang lấy dữ liệu từ `localStorage` thay vì gọi bảng `electricity_checks` qua Supabase.

---

## 4. Các Service đang Query sai hoặc thiếu logic
1. **`interactionService.js` (Hàm `getAllCommentsAdmin`)**:
   - Chưa thực hiện đếm hoặc join từ bảng `reports` để tính toán `reports_count`, dẫn đến việc UI hiển thị số lượt báo cáo luôn bằng 0.

---

## 5. Bảng Database đang có nhưng Frontend chưa sử dụng (hoặc dùng sai)
1. **`reports`**: Có trong DB nhưng frontend hoàn toàn không có UI gửi hay hiển thị chi tiết các dòng báo cáo.
2. **`electricity_checks` & `electricity_check_items`**: Có trong DB và có code trong `electricityService.js` nhưng frontend vẫn dùng `localStorage` để lưu lịch sử kiểm tra tiền điện.
3. **`categories`**: Bảng danh mục có sẵn trên database nhưng frontend lại đang dùng danh mục cứng (static array) ở trang Mẹo tiết kiệm.
4. **`user_notifications`**: Bảng thông báo kiểu cũ, frontend đang dùng `notifications` làm chính nhưng vẫn duy trì code fallback check bảng này.

---

## 6. Phân loại Bảng khi dọn dẹp Database (Preserve vs Clear)

### Nhóm KHÔNG ĐƯỢC XÓA (Master / Cấu hình)
Đây là các bảng chứa dữ liệu nền tảng, thiết lập hoặc thông tin tài khoản cốt lõi:
- `profiles`: Thông tin tài khoản người dùng, phân quyền (Admin/Moderator/User).
- `devices`: Danh mục thiết bị điện master (dùng làm template tính tiền điện).
- `categories`: Danh mục bài viết (Mẹo tiết kiệm, Điều hòa, Laptop,...).
- `website_banners`: Dữ liệu banner quảng bá trang chủ, bài lưu.
- `website_announcements`: Các thông báo khẩn cấp/bảo trì hiển thị ở thanh đầu trang.
- `platform_settings` / `system_settings`: Cấu hình hệ thống (site name, mail support, cài đặt duyệt bài).
- `system_backups`: Bản sao lưu cấu hình hệ thống đã tạo.

### Nhóm CÓ THỂ CLEAR (Dữ liệu giao dịch / Test / Demo)
Các bảng này chứa dữ liệu do quá trình tương tác test/demo tạo ra và có thể dọn dẹp:
- `comments`: Bình luận test.
- `post_likes`: Lượt thích bài viết test.
- `saved_posts`: Danh sách lưu bài viết test.
- `reports`: Báo cáo vi phạm test.
- `notifications`: Thông báo gửi cho user test.
- `notification_batches`: Đợt gửi thông báo hệ thống test.
- `user_notifications`: Thông báo cũ (nếu có).
- `electricity_checks`: Lịch sử kiểm tra điện test (nếu có dòng nào lọt vào DB).
- `electricity_check_items`: Chi tiết thiết bị trong lịch sử kiểm tra điện test.
- `user_follows`: Lượt theo dõi qua lại giữa các tài khoản demo.
- `admin_audit_logs`: Nhật ký hành động của admin test.
- `admin_user_notes`: Ghi chú nội bộ của admin về user test.

> [!WARNING]
> **Đối với bảng `posts`**:
> Hiện tại hệ thống đang giữ các bài viết demo. Nếu xác nhận tất cả bài viết hiện tại chỉ phục vụ chạy thử (test/demo) thì có thể clear. Nếu có bài viết thật chứa nội dung hướng dẫn sử dụng hoặc mẹo thực tế cần giữ lại làm nội dung ban đầu thì **KHÔNG ĐƯỢC CLEAR**. Khuyến nghị giữ lại các bài viết gốc nếu chưa có nguồn bài mới thay thế.

---

## 7. Kế hoạch dọn dẹp Database (SQL Cleanup Plan)
Chi tiết các câu lệnh SQL để dọn dẹp dữ liệu đã được tạo tại file [supabase-cleanup-plan.sql](file:///d:/FPTU_VanhKhuc/Ki%205_Summer/E_Xanh/e-xanh/supabase-cleanup-plan.sql) (chỉ lưu trữ tham khảo, không tự động chạy).
