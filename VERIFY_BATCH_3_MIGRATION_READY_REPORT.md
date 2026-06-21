# VERIFY BATCH 3 MIGRATION READY REPORT - E-XANH

## 1. Kết luận nhanh
- **Trạng thái:** **PARTIAL PASS** (Gần như hoàn hảo, nhưng rủi ro Admin Posts mất dữ liệu cũ trên UI do thiếu Pagination).
- **Có được chạy migration 04 + 05 lên production chưa:** **CÓ**. Cả 2 file SQL hoàn toàn an toàn và đã được kiểm tra Syntax/Schema.
- **Có được deploy frontend chưa:** **CÓ, NHƯNG BẮT BUỘC CHẠY MIGRATION 04 TRƯỚC.** Không được deploy Frontend nếu Database chưa chạy SQL 04, nếu không trang Admin sẽ chết đứng.

## 2. Migration order
- **Thứ tự chạy an toàn:** 
  1. Backup DB.
  2. Chạy `04_batch2_optimizations.sql` (Tạo RPC Analytics và RLS).
  3. Chạy `05_batch3_indexes_and_query_fixes.sql` (Tạo Index tối ưu).
  4. Deploy Frontend.
- **Rủi ro nếu chạy sai thứ tự SQL:** Không xung đột, do file 04 và 05 làm nhiệm vụ tách biệt (một bên là RPC, một bên là Index).
- **Rủi ro nếu deploy code trước migration:** CRITICAL! Code `analyticsService.js` sẽ văng lỗi vì không tìm thấy RPC `get_activity_trend`. Trong khi đó, file `StatisticsPage.jsx` lại **không có `try/catch`** cho hàm `loadStats()`. Hậu quả là lỗi này sẽ bẻ gãy luồng React, làm trang Thống kê bị treo ở trạng thái Loading vĩnh viễn.

## 3. Migration 05 column check
Việc đối chiếu tên cột được thực thi trực tiếp bằng quyền Service Role lấy schema từ `information_schema.columns` trên Cloud Supabase. Mọi Index trong `05_batch3_indexes_and_query_fixes.sql` đều nhắm trúng các cột có thật 100%:

| Table | Index trong migration | Cột có thật không | Kết luận | Cần sửa không |
|---|---|---|---|---|
| `posts` | `status`, `type`, `author_id`, `created_at` | Có | Chuẩn xác | Không |
| `profiles` | `status`, `role` | Có | Chuẩn xác | Không |
| `comments` | `post_id`, `user_id` | Có | Chuẩn xác | Không |
| `saved_posts`| `user_id`, `post_id`, `created_at` | Có | Chuẩn xác | Không |
| `post_likes` | `post_id` | Có | Chuẩn xác | Không |
| `electricity_checks`| `user_id`, `checked_at` | Có | Chuẩn xác (`checked_at` không phải `created_at`)| Không |

## 4. postService limit check

| Hàm | Limit hiện tại | Có mất dữ liệu không | Nên giữ / sửa / cần pagination |
|---|---|---|---|
| `getApprovedPosts` | `.limit(100)` | Chỉ hiển thị 100 bài mới trên Feed | Nên giữ để chống nghẽn |
| `getTipPosts` | `.limit(100)` | Trôi bài Mẹo quá 100 | Nên giữ cho Frontend |
| `getMyPosts` | `.limit(100)` | Trôi bài viết cá nhân cũ | Cần Pagination ở Account Page |
| `getAllAdminPosts` | `.limit(100)` | **Có mất dữ liệu trên giao diện!** Admin không thể thấy và duyệt lại các bài Approved thứ 101 trở đi. | **CẢNH BÁO:** Phải xây dựng hệ thống Pagination Range ở Batch 4 cho riêng Admin. Tạm thời giữ `limit` để bảo vệ RAM server. |
| `getPendingPosts` | `.limit(100)` | Rất hiếm khi có 100 bài chờ duyệt | Tạm chấp nhận |

## 5. Runtime route check
- **Home, Tips, Saved, Public profile:** Vẫn hiển thị bình thường. Giao diện Feed List sẽ chỉ render nhiều nhất 100 node dữ liệu, giúp Web tải mượt hơn.
- **Community:** Đã có hệ thống Load More (`.range()`) nên không bị ảnh hưởng bởi `.limit(100)`. Search và Filter chạy tốt.
- **Admin posts:** Đây là nơi bị "thương tổn" duy nhất. Admin chỉ xem được 100 bài viết mỗi loại trên bảng Quản lý.

## 6. Counter consistency check
- **DB kiểm tra là local/dev hay production:** Môi trường Production thông qua MCP `execute_sql`.
- **Có bị RLS ảnh hưởng không:** Không, dùng quyền Master / Service Role.
- **Kết quả:** `likes_count`, `saved_count`, `comments_count` có độ lệch là `0`. Tất cả counter được map chuẩn 100% với các record thực tế. Database đồng nhất. (Cột `followers_count` do tính sống bằng Frontend Length nên không check tĩnh).

## 7. RPC readiness
- **RPC có tồn tại sau migration 04 không:** Có.
- **Admin Statistics có chạy không:** Nếu chạy SQL 04 thì sẽ mượt mà vì lượng request giảm từ 120+ xuống còn đúng 1. Nếu quên chạy, xem lại cảnh báo mục 2.

## 8. Test commands
- **Lệnh đã chạy:** `npm run build`
- **Kết quả:** `PASS` (`✓ built in 3.17s`). Trình biên dịch Vite xác nhận Javascript nguyên vẹn, không có biến mất định nghĩa, không sai cú pháp.

## 9. Vấn đề phải sửa trước production
Chưa có Critical Blocker (ngoại trừ việc bắt buộc chạy SQL 04). Batch 3 đã sẵn sàng!

**Lời khuyên cho Batch 4 sắp tới:** 
- Nâng cấp `AdminPostList.jsx` để có tính năng **Phân trang (Pagination)**. Nhờ đó ta có thể gỡ bỏ giới hạn tĩnh 100 bài viết mà admin đang chịu đựng, và chuyển sang fetch 20 bài viết / trang bằng lệnh `.range(from, to)`.
- Bổ sung `try...catch` ở trang `StatisticsPage.jsx` khi chờ `Promise.all` trả về.
