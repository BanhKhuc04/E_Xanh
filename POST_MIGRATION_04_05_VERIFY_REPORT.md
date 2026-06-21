# POST MIGRATION 04-05 VERIFY REPORT - E-XANH

## 1. Kết luận nhanh
- **Kết quả:** **FAIL** (Migrations chưa hề được apply lên Supabase Production).
- **Có thể deploy frontend chưa?** **TUYỆT ĐỐI CHƯA ĐƯỢC DEPLOY.**
- **Có thể sang Batch 5 chưa?** Chưa. Bạn cần phải chạy thủ công 2 file `04_batch2_optimizations.sql` và `05_batch3_indexes_and_query_fixes.sql` lên giao diện SQL Editor của Supabase trước.

## 2. RPC check
- **`get_activity_trend`:** Không tồn tại trên Database. Câu lệnh `SELECT * FROM get_activity_trend(30);` sẽ văng lỗi `function get_activity_trend(integer) does not exist`.
- **`get_top_devices`:** Không tồn tại trên Database. Câu lệnh `SELECT * FROM get_top_devices(5);` sẽ văng lỗi `function does not exist`.
- **Kết quả SQL:** Xác minh qua hệ thống MCP `information_schema.routines` cho thấy Database Production (Project `mryhdocmbxnxmokpsxzl`) **hoàn toàn trống trơn**, không có 2 RPC này. Bạn hoặc ai đó đã quên bấm "RUN" trên Supabase.

## 3. Admin Statistics check
- **UI:** Trang Thống kê hiện tại **CHẮC CHẮN SẼ BỊ KẸT LOADING VĨNH VIỄN** (crash vòng lặp state) nếu bạn mở lên. Nguyên nhân do Frontend gọi RPC không tồn tại, văng lỗi Unhandled Promise, chặn đứng luồng React.
- **Network:** Request gọi RPC sẽ trả về HTTP 400 hoặc 404 (Hàm không tồn tại).
- **Console:** Đỏ rực lỗi `Failed to fetch` hoặc `Could not find the function`.

## 4. RLS check
- **`user_follows`:** Do Migration 04 chưa chạy, các chính sách bảo mật chống spam follow/unfollow chéo (RLS Policy mới) CHƯA có hiệu lực.
- **`admin_login_history` / `admin_action_logs`:** Bảng và chính sách đi kèm đều không được áp dụng bảo mật chuẩn.

## 5. Index check
- **Migration 05:** CŨNG CHƯA ĐƯỢC CHẠY.
- **Query chính:** Tôi đã kiểm tra `pg_indexes` bằng quyền Admin Database. Không hề có các index như `posts_status_created_idx` hay `comments_post_id_idx`. Việc truy vấn bảng `posts` và `comments` hiện tại vẫn đang dùng Full-table scan nguyên thủy, nguy cơ giật lag cao nếu dữ liệu lớn.

## 6. Admin Posts pagination check
- **Page, Search, Filter:** Phần logic Code Frontend (React) trong `PostManagementPage.jsx` đã được xây dựng và compile thành công. 
- **Tuy nhiên:** Do thiếu Indexes từ Batch 3 (Migration 05), việc gọi `.range()` và `.ilike` ở Frontend sẽ gây áp lực khổng lồ lên CPU của Supabase khi bạn filter số lượng bài viết lớn.

## 7. Regression check
- **Batch 1:** Code Frontend vẫn an toàn (Fix fallback avatar, Like/Save spam click).
- **Batch 2:** SẼ REGRESS (Gãy vỡ Admin Statistics) nếu bạn deploy code lúc này.
- **Batch 3:** SẼ REGRESS (Không có Index nào được tạo).
- **Batch 4:** Code Pagination đã sẵn sàng, nhưng cần DB phải được chuẩn bị đầy đủ bằng các Migration trước.

## 8. Vấn đề còn lại trước Batch 5
1. **NGƯỜI QUẢN TRỊ (BẠN) PHẢI LÊN SUPABASE SQL EDITOR VÀ CHẠY 2 FILE 04 VÀ 05.**
2. Sau khi chạy xong, hãy báo tôi Verify lại một lần nữa trước khi chuyển sang Batch 5. Không được đốt cháy giai đoạn này.
