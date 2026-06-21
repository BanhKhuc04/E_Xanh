# AUDIT DATABASE & UI BUTTONS REPORT - E-XANH

## 1. Tóm tắt nhanh
- **Tổng số table/view/RPC/bucket phát hiện:** 26 table/view, 12 RPC, 4 buckets.
- **Tổng số nút/chức năng đã rà soát:** Gần như toàn bộ các tương tác UI chính (Follow, Like, Save, Admin Settings, Analytics).
- **Số lỗi Cao / Trung bình / Thấp:** Cao: 3 | Trung bình: 4 | Thấp: Nhiều.
- **5 lỗi nghiêm trọng nhất:**
  1. **Race condition ở Like/Save post:** Khi click nhanh nhiều lần, DB bị dội lỗi `23505` nhưng RPC vẫn tăng biến đếm `likes_count`/`saved_count` một cách vô tội vạ, làm sai lệch số liệu vĩnh viễn.
  2. **Race condition UI ở nút Follow:** Khi spam click Follow, UI cộng dồn số lượt theo dõi (followersCount) liên tục do không bắt mã lỗi 23505 trả về để chặn UI.
  3. **Lỗi bài viết hiển thị "Thành viên E-XANH" (Profile mapping null):** Hàm `fetchPublicProfilesMap` đang lấy sai cột `profile_visibility` từ `profiles` (thực tế nó nằm trong `user_preferences` JSONB). Hậu quả là toàn bộ query lấy profile mapping bị Postgres từ chối và trả về null.
  4. **N+1 Query ở Trang Thống kê (Analytics):** Hàm `getActivityTrend` chạy một vòng lặp JS gửi liên tiếp 150 requests (30 ngày * 5 tables) tới Supabase để đếm số liệu thay vì dùng 1 query/RPC gộp.
  5. **Bảng `user_follows` bị lặp RLS Policy:** Bảng này có tới 8 RLS policy trùng lặp chức năng (ví dụ có 3 policy INSERT, 3 policy DELETE chỉ để check `auth.uid() = follower_id`). Việc này làm chậm query đáng kể.

## 2. Database inventory
| Tên DB object | Loại | File đang dùng | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- |
| `profiles` | Table | profileService, authService | OK nhưng cột sai | UI gọi `profile_visibility` là top-level, thực tế là trong `user_preferences` |
| `posts` | Table | postService, interactionService | Có lỗi | Dễ dính N+1 ở views, thiếu index trên count |
| `comments` | Table | commentService | OK | Thiếu RPC update comments_count an toàn |
| `post_likes` | Table | interactionService | Lỗi Logic | RPC increment bị gọi dù insert bị lỗi duplicate |
| `saved_posts` | Table | interactionService | Lỗi Logic | Tương tự post_likes |
| `user_follows` | Table | followService | Lỗi RLS | Bị duplicate quá nhiều RLS policies |
| `electricity_checks` | Table | electricityService | OK | |
| `electricity_check_items` | Table | analyticsService | Lỗi Hiệu năng | `getTopDevices` select toàn bộ table về đếm ở JS thay vì dùng Group By |
| `devices` | Table | deviceService | OK | |
| `notifications` | Table | notificationService | Đã fix | Policy SELECT đã được cập nhật trước đó |
| `admin_action_logs` | Table | adminLogService | OK | |
| `admin_login_history` | Table | authService | OK | |
| `public_profiles` | View | postService | Chưa dùng đúng | Frontend không fetch từ View này để lấy role mà fetch từ profiles |
| `website_banners` | Table | bannerService | OK | |
| `post-images` | Bucket | mediaUploadService | OK | |
| `profile-avatars` | Bucket | mediaUploadService | OK | |

## 3. UI Button / Feature Matrix
| Chức năng | Component/File | Service/API | DB liên quan | Trạng thái | Mức độ | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| **Nút Theo dõi (Follow)** | `PublicProfilePage.jsx` | `followUser` | `user_follows` | Sai logic UI | Cao | UI không check duplicate key error, cộng dồn số liệu ảo nếu click nhanh. |
| **Nút Thích (Like)** | `PostCard.jsx` | `likePost` | `post_likes` | Sai logic DB | Cao | Lỗi RPC vẫn tăng likes_count khi trùng primary key. |
| **Nút Lưu (Save)** | `PostCard.jsx` | `savePost` | `saved_posts` | Sai logic DB | Cao | Tương tự nút Like. |
| **Hiển thị tác giả bài viết** | `PostCard.jsx` / `HomePage.jsx` | `getTipPosts` | `profiles` | Sai logic DB | Cao | Fallback thành "Thành viên E-XANH" do cột `profile_visibility` không tồn tại ở top-level `profiles`. |
| **Gỡ MFA (Admin)** | `AdminMFASettings.jsx` | N/A | N/A | Có nguy cơ UX | Thấp | Nút dùng `alert(error.message)` để hiển thị lỗi, gây trải nghiệm kém và lộ lỗi kỹ thuật. |
| **Biểu đồ hoạt động (Admin)** | `StatisticsPage.jsx` | `getActivityTrend` | Nhiều tables | Nguy cơ hiệu năng | Cao | Gọi vòng lặp 150 truy vấn độc lập. |
| **Thống kê thiết bị (Admin)** | `StatisticsPage.jsx` | `getTopDevices` | `electricity_check_items` | Nguy cơ hiệu năng | Trung bình | Tải toàn bộ record thiết bị về trình duyệt chỉ để đếm top 5. |

## 4. Các lỗi Cao cần xử lý trước

### Lỗi 1: Sai lệch số liệu Like và Save (Race Condition ở Backend)
- **Mô tả:** Khi user click Like/Save nhiều lần liên tiếp, hàm `likePost` bắt lỗi `23505` (Duplicate Key) nhưng vẫn tiếp tục gọi `supabase.rpc('increment_likes_count')`. Điều này làm số lượt like/save của bài viết tăng vọt ảo.
- **File liên quan:** `src/services/interactionService.js` (hàm `likePost`, `savePost`).
- **DB liên quan:** `post_likes`, `saved_posts`, `posts` (cột counts).
- **Nguyên nhân khả nghi:** Logic catch error đang lọt qua lỗi 23505 và không `return { error }` hoặc chặn RPC.
- **Cách tái hiện:** Ở bài viết, nháy đúp nút like thật nhanh (hoặc block network rồi nháy).
- **Hướng sửa đề xuất:** Đưa lệnh gọi `rpc('increment_..._count')` vào bên trong block kiểm tra: chỉ khi insert thành công (không có lỗi) mới được chạy RPC.

### Lỗi 2: Tên tác giả hiển thị "Thành viên E-XANH" (Profile hydration failed)
- **Mô tả:** Bài viết bị mất thông tin tác giả do hàm fetch mapping thông tin bị huỷ bởi Supabase (báo lỗi column doesn't exist).
- **File liên quan:** `src/services/postService.js` (hàm `fetchPublicProfilesMap`).
- **DB liên quan:** `profiles`.
- **Nguyên nhân khả nghi:** Code `.select('..., profile_visibility, ...')` trong khi `profile_visibility` nằm trong JSONB `user_preferences`.
- **Hướng sửa đề xuất:** Sửa chuỗi select thành `user_preferences->profile_visibility` hoặc bỏ cột đó khỏi select, chỉ lấy những cột có thực ở root.

### Lỗi 3: N+1 Query diện rộng trên trang Admin Thống Kê
- **Mô tả:** Trang thống kê tải hàng trăm truy vấn count cùng lúc khiến Supabase bị thắt nút cổ chai (Rate Limit) nếu admin reload liên tục.
- **File liên quan:** `src/services/analyticsService.js` (hàm `getTrendData`).
- **DB liên quan:** Toàn bộ bảng dữ liệu.
- **Hướng sửa đề xuất:** Viết 1 RPC `get_activity_trend(days INT)` bằng PL/pgSQL với `GROUP BY DATE(created_at)` để CSDL tự nhóm và chỉ trả về 1 kết quả JSON.

## 5. Các lỗi Trung bình

### Lỗi 4: UI Follow tăng ảo (Race Condition Frontend)
- **Mô tả:** Ở `PublicProfilePage.jsx`, khi `error.code === '23505'` trả về từ Service, biến `error` = null, khiến UI tưởng là Follow thành công và +1 cho `followersCount`. Nháy nhanh 10 lần sẽ thấy số follower tăng thêm 10.
- **File liên quan:** `src/pages/user/PublicProfilePage.jsx`, `src/services/followService.js`.
- **Hướng sửa đề xuất:** Service nên trả về cờ `already_followed: true`, UI không được phép cộng dồn nếu cờ này là true.

### Lỗi 5: Đếm Top Devices tốn bộ nhớ ở Frontend
- **Mô tả:** `getTopDevices` select toàn bộ cột `device_name` từ `electricity_check_items` (có thể lên tới chục nghìn bản ghi) chỉ để lấy ra Top 5.
- **File liên quan:** `src/services/analyticsService.js`.
- **Hướng sửa đề xuất:** Viết query RPC `.rpc('get_top_devices')` có sử dụng `COUNT() ... GROUP BY device_name ORDER BY count DESC LIMIT 5`.

### Lỗi 6: Dư thừa RLS Policy trên `user_follows`
- **Mô tả:** Bảng `user_follows` có 8 policy trùng lặp chức năng.
- **DB liên quan:** `user_follows`.
- **Hướng sửa đề xuất:** Xoá các policy trùng, giữ lại đúng 1 policy cho SELECT, 1 cho INSERT, 1 cho DELETE.

## 6. Các lỗi Thấp / UX consistency
- **Lộ lỗi kỹ thuật ra UI:** Trang `AdminMFASettings.jsx` dùng `alert()` in thẳng lỗi Supabase ra màn hình thay vì dùng Toast component có sẵn của hệ thống. Đề xuất chuyển sang `setToast`.

## 7. Các chức năng có UI nhưng chưa đủ backend/database
*(Không phát hiện chức năng nào hoàn toàn rỗng do các chức năng đều đã được đấu nối qua service)*

## 8. Các database object có nhưng frontend chưa dùng hoặc dùng chưa đúng
- **`public_profiles` view:** Code `postService` tự query `profiles` (gây lỗi cột) thay vì sử dụng view `public_profiles` đã được tạo sẵn trên database dùng cho mục đích này.

## 9. Rủi ro RLS / bảo mật
- **Admin Audit Logs / Login History:** Hiện tại các bảng này có RLS nhưng không cấm hoàn toàn user sửa xoá nếu họ vô tình chiếm được token có role admin. Nên dùng `FOR INSERT` only và chặn hoàn toàn `UPDATE`/`DELETE`.
- **Sử dụng `user_preferences` (JSONB) trực tiếp trong select:** Làm chậm truy vấn do thiếu index trên JSONB fields nếu sau này tìm kiếm dựa trên profile visibility.

## 10. Checklist test thủ công sau khi fix
- [ ] Mở 2 tab, đăng nhập user thường, test like/save liên tục (spam click) xem count có tăng ảo không.
- [ ] Truy cập profile public của người khác, spam click nút Follow xem số bị đội lên không.
- [ ] Vào trang chủ E-XANH xem các bài viết có còn hiện "Thành viên E-XANH" không.
- [ ] Vào trang Admin Thống kê, bật Network Tab xem số request có giảm từ 150+ xuống còn vài cái không.
- [ ] Test lại chức năng vô hiệu hóa/khóa user xem thông báo có đẩy bình thường không (đã fix ngầm RLS ở kỳ trước).

## Kết luận
Dự án có nền tảng UI tốt nhưng logic giao tiếp với Supabase đang tồn đọng nhiều **race condition** nghiêm trọng (có thể làm vỡ tính toàn vẹn của database counters). 

**Thứ tự ưu tiên xử lý (Batch đề xuất cho lần sau):**
1. Sửa hàm `fetchPublicProfilesMap` (Xóa cột `profile_visibility` hoặc chuyển sang query view) để hiển thị đúng tác giả bài viết ngay lập tức.
2. Sửa cơ chế Increment RPC ở `interactionService.js` (chặn RPC nếu `error` là 23505).
3. Sửa UI Follow ở `PublicProfilePage.jsx`.
4. Gộp các câu lệnh N+1 ở `analyticsService.js` thành các RPC tối ưu.
5. Dọn dẹp RLS policies dư thừa ở bảng `user_follows`.
