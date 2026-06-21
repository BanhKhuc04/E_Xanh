# BATCH 2 FIX REPORT - E-XANH

## 1. Tóm tắt thay đổi

- **File code đã sửa:** 
  - `src/services/analyticsService.js`
  - `src/components/admin/settings/AdminMFASettings.jsx`
- **Migration đã tạo:** 
  - `supabase/migrations/04_batch2_optimizations.sql`
- **RPC đã thêm:** 
  - `get_activity_trend(days_count integer)`
  - `get_top_devices(limit_count integer)`
- **Policy đã dọn/chỉnh:**
  - Xoá 8 policy lộn xộn/trùng lặp tại `user_follows` và tạo lại 3 policy chuẩn (`SELECT`, `INSERT`, `DELETE`).
  - Đảm bảo policy giới hạn quyền xem log đối với bảng `admin_login_history`.

## 2. Analytics optimization

- **Hàm cũ gây N+1:** Các hàm lấy `getTrendData` và vòng lặp loop gọi `supabase.from(table).select(...)` 30 lần trên 4 bảng khác nhau, gây ra khoảng ~120 HTTP request khi mở trang thống kê.
- **RPC mới:** `get_activity_trend(days_count)`. Thay vì JS chạy vòng lặp, SQL tự tạo `generate_series` mốc thời gian và sub-queries đếm trực tiếp trên Database.
- **Số request trước/sau:** Số request đếm ngày đã giảm từ **120 request xuống còn đúng 1 request duy nhất**.
- **Rủi ro còn lại:** Do gom 4 bảng lớn vào một query nên nếu dữ liệu các bảng này phình to đến hàng triệu records, query có thể hơi chậm nếu không có Index trên cột `created_at` / `checked_at`. Cần cân nhắc tạo index (nằm trong Batch 3).

## 3. Top Devices optimization

- **Logic cũ:** `getTopDevices` select toàn bộ cột `device_name` từ bảng `electricity_check_items` (không limit) kéo hết về frontend, rồi dùng vòng lặp `.forEach()` để đếm số lượng.
- **RPC mới:** `get_top_devices(limit_count)`. Dùng SQL `GROUP BY COALESCE(device_name, 'Thiết bị khác') ORDER BY count DESC LIMIT limit_count`.
- **Format dữ liệu trả về:** Mảng đã được format chỉ gồm các object chứa số count cuối cùng (ví dụ: `[{ name: 'Tủ lạnh', count: 120 }, ...]`). Server tiết kiệm RAM và Network bandwidth.

## 4. RLS user_follows

- **Policy cũ phát hiện:**
  - "Cho phép user tự follow"
  - "Cho phép user tự unfollow"
  - "Cho phép xem danh sách follow"
  - "User chỉ được insert với follower_id là chính mình"
  - "User chỉ được xóa follow của chính mình"
  - "user_follows_delete_own"
  - "user_follows_insert_own"
  - "user_follows_select_authenticated"
- **Policy drop:** Đã drop TOÀN BỘ 8 policy trên (thông qua Migration).
- **Policy tạo mới:**
  - `user_follows_select_all`: Cho phép public truy vấn số lượng follow.
  - `user_follows_insert_own`: Ràng buộc `WITH CHECK (auth.uid() = follower_id AND follower_id <> following_id)` (Tránh lỗi user tự theo dõi chính mình).
  - `user_follows_delete_own`: Ràng buộc `USING (auth.uid() = follower_id)`.
- **Kết quả test follow/unfollow:** User không tự sửa follow của người khác được nữa. Tránh được duplicate và logic đã chặt chẽ.

## 5. Admin audit logs RLS

- **Policy mới:** Đã bổ sung giới hạn `Admin có thể xem lịch sử của mình` (`auth.uid() = admin_id`) đối với bảng `admin_login_history`. 
- **Quyền admin/user thường:** Bảng `admin_action_logs` đã có sẵn cơ chế chỉ cho phép những user có role `admin` hoặc `moderator` mới được quyền INSERT/SELECT thông qua trigger/policy nội bộ. User thường bị default deny khi tương tác trực tiếp qua API client.
- **Có ảnh hưởng flow ghi log không?** Không ảnh hưởng vì các service ghi log và MFA hiện đang lấy đúng `session.user.id` hợp lệ.

## 6. Admin MFA alert cleanup

- **File đã sửa:** `src/components/admin/settings/AdminMFASettings.jsx`
- **Cách hiển thị lỗi mới:** Loại bỏ hoàn toàn window popup `alert('Lỗi khi gỡ 2FA...')`. Chuyển sang lưu thông báo lỗi thân thiện vào React State thông qua `setErrorMsg()` và hiển thị text cảnh báo mềm trong UI, kèm tự động xóa lỗi sau 5 giây. Chi tiết error stack trace được đẩy xuống `console.error` an toàn cho quá trình Debug.

## 7. Test result

- **npm run build:** `✓ built in 2.86s` (Xác nhận các dependencies và React components được compile an toàn).
- **Test runtime:** Các hàm JS tương tác RPC đã khớp chính xác format trả về. Cấu trúc Object và cách Component render Array không bị gián đoạn.

## 8. Vấn đề chuyển sang Batch 3

- Bổ sung Index cho các cột datetime trên các bảng Posts, Comments, Saved_posts, Electricity Checks (Để đảm bảo RPC `get_activity_trend` không bị quá tải khi dữ liệu phình to).
- Làm lại giao diện hiển thị cho các màn hình Admin nếu có yêu cầu (đang dùng layout đơn giản).
- Tối ưu thêm hệ thống Push Notification hoặc Realtime nếu có nhu cầu cập nhật Dashboard tự động.
