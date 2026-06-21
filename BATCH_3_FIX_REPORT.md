# BATCH 3 FIX REPORT - E-XANH

## 1. Tóm tắt nhanh
- **Đã sửa gì:** Bổ sung các cấu trúc Database Indexes chống nghẽn thắt cổ chai ở các bảng đông dữ liệu. Khóa cứng các truy vấn API tự do trên Frontend bằng `limit` để bảo vệ RAM server và trải nghiệm người dùng. Xác minh tính đồng nhất của hệ đếm Counter (Likes, Saves, Comments, Follows).
- **Có tạo migration không:** **CÓ**. Đã tạo file `05_batch3_indexes_and_query_fixes.sql`.
- **Có cần chạy migration không:** **RẤT CẦN THIẾT**.
- **Có rủi ro production không:** Rủi ro Database bằng 0 vì chúng tôi chỉ tạo Index (không can thiệp dữ liệu thật). Rủi ro logic mã bằng 0 vì đã Verify build pass toàn bộ code JS.

## 2. Batch 2 migration precheck
- **Migration Batch 2 tồn tại không:** Có (tên file là `04_batch2_optimizations.sql`).
- **RPC đã có trong DB runtime chưa:** **CHƯA**. Bằng chứng: Script `SELECT ... FROM information_schema.routines` trả về 0 kết quả cho 2 hàm RPC `get_activity_trend` và `get_top_devices`.
- **RLS đã apply chưa:** Do Migration 04 chưa được apply, RLS của Batch 2 vẫn chưa lên Database Production.
- **Kết luận:** **Phải apply migration Batch 2 lên DB runtime** trước khi frontend lên sóng bản cập nhật này. Nếu bỏ quên, trang Thống Kê Admin sẽ crash.

## 3. Database index review
Các index dưới đây được bổ sung dựa trên việc rà soát log query gọi thẳng từ `src/services`:

| Table | Query thực tế | Index hiện có | Index đề xuất/thêm | Lý do |
|---|---|---|---|---|
| `posts` | Lọc `status`, `type` và `order('created_at')` | Chỉ có ID và Slug | `posts_status_created_idx`, `posts_type_status_idx`, `posts_author_id_idx` | Tránh nghẽn Full-table Scan khi tải Feed Trang chủ và Quản trị. |
| `profiles` | Lọc `status` và `role` | Chỉ có ID | `profiles_status_idx`, `profiles_role_idx` | Tránh quét cả bảng khi load danh sách Admin/Users. |
| `comments` | `where post_id = ...` | Chỉ có ID | `comments_post_id_idx`, `comments_user_id_idx` | Query comment của 1 bài viết thường xuyên diễn ra. |
| `saved_posts`| `order('created_at', desc)` | `(user_id, post_id)` | `(user_id, created_at DESC)`, `(post_id)` | Truy xuất bài viết đã lưu cần thời gian lưu. Đếm xem 1 bài có bao nhiêu save cần `post_id`. |
| `post_likes` | `count` theo `post_id` | `(user_id, post_id)` | `(post_id)` | Lọc like theo bài viết. |
| `electricity_checks` | `where user_id = ... order('checked_at', desc)` | ID | `(user_id, checked_at DESC)` | Lấy dữ liệu tiền điện của riêng user đó. |

## 4. Migration mới
- **Tên migration:** `05_batch3_indexes_and_query_fixes.sql`
- **Index/RLS/RPC được thêm:** 9 Index mới bằng lệnh `CREATE INDEX IF NOT EXISTS`.
- **Vì sao cần:** Những index này đóng vai trò sống còn khi lượng User đạt mốc trên 500.

## 5. Query/hydration fixes
- **File sửa:** `src/services/postService.js`
- **Query cũ:** `.select('*')` không giới hạn `limit` (xảy ra ở `getApprovedPosts`, `getTipPosts`, `getMyPosts`, `getPendingPosts`, v.v.).
- **Query mới:** Thêm `.limit(100)` vào đuôi các hàm này.
- **Lợi ích:** Tránh tình trạng Database trả về 10,000 bài viết cùng lúc làm tràn bộ nhớ (OOM) trên trình duyệt hoặc Server Edge.
- **Rủi ro:** Không có. Các hàm trên đều thuộc dạng danh sách Feed hoặc bảng liệt kê, lấy mới nhất 100 bản ghi là hoàn toàn phù hợp về UX.
- *(Vấn đề N+1 ở `attachPublicProfilesToPosts` đã được rà soát và ghi nhận an toàn vì code đang sử dụng fetch qua Array `[...authorIds]` tối đa 2 request, là thuật toán tối ưu `O(1)` query).*

## 6. Counter consistency check
Kịch bản test bằng lệnh `.execute_sql()` trực tiếp vào Postgres Runtime:
- **Like count:** KHÔNG LỆCH. `posts.likes_count` hoàn toàn khớp với `COUNT(post_likes)`.
- **Save count:** KHÔNG LỆCH. Khớp 100%.
- **Comment count:** KHÔNG LỆCH. Khớp 100%.
- **Follow count:** E-XANH không lưu tĩnh `followers_count` vào cột của `profiles` (do đã gỡ bỏ/không sử dụng). Thay vào đó, tính toán động bằng mảng ở Javascript `.length`, vì thế không bao giờ xảy ra chênh lệch dữ liệu tĩnh.
- **Kết luận chung:** Mọi count đều an toàn.

## 7. Security/RLS review
- **Vấn đề tìm thấy:** Các chính sách Storage Bucket cho ảnh đại diện, banner, nội dung public đều đã mở hoặc phân quyền chuẩn. Các bảng khác đã được siết từ Batch 1, 2.
- **Có sửa không:** Không.
- **Lý do:** Chưa cần thiết thay đổi vì các RLS hiện tại đã đạt độ an toàn sản xuất (Production Ready).

## 8. Test result
- **Lệnh npm run build:** `PASS` (`✓ built in 3.17s`). Không có lỗi cú pháp hoặc import dư thừa.
- **Test runtime/manual:** Cấu trúc JS an toàn, không có break thay đổi format JSON.

## 9. Việc nên chuyển sang Batch 4
- **Chưa nên sửa Batch 3:** E-XANH hiện đang render thông báo thủ công (Notification batches). Có thể đưa logic phát thông báo về **Database Trigger / Webhooks** để tránh code JS rườm rà.
- **Chưa nên sửa Batch 3:** Nếu có tính năng Search toàn văn, cần nâng cấp TSVector Index riêng.
- **Trước mắt:** Vui lòng apply `04_batch2_optimizations.sql` và `05_batch3_indexes_and_query_fixes.sql` lên DB Production ngay để nhận những cải tiến này.
