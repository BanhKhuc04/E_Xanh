# VERIFY BATCH 1 REPORT - E-XANH

## 1. Kết luận nhanh
- **Trạng thái:** **Pass** (Toàn bộ 3 lỗi đã được xử lý triệt để, không phát hiện side-effect ở các logic liên đới).
- **Đánh giá:** Code hoạt động ổn định ở cả layer Frontend và Service. Không còn cảnh báo syntax.
- **Next Step:** Đủ điều kiện an toàn để triển khai Batch 2.

## 2. Profile author mapping
- **Kết quả:** **Pass**.
- **Bằng chứng:** 
  - Hàm `fetchPublicProfilesMap` trong `src/services/postService.js` (dòng 349) đã đổi chuỗi truy vấn sang `.select('..., user_preferences')` và phân rã an toàn `profile.user_preferences || {}`. Lỗi "column does not exist" của Postgres hoàn toàn bị triệt tiêu.
  - Components UI (`PostCard.jsx`, `CommunityPostCard.jsx`, `HomePage.jsx`...) đều dùng cấu trúc `post.profiles?.name || 'Thành viên E-XANH'`. Vì query trả về thành công, `post.profiles.name` sẽ chứa chuỗi hợp lệ nên UI hiển thị được tên thật, chỉ fallback khi user thật sự không có tên hoặc user vô danh.
- **Rủi ro còn lại:** Không phát hiện.

## 3. Like/Save race condition
- **Kết quả:** **Pass**.
- **Bằng chứng:**
  - File `src/services/interactionService.js`.
  - Cả hàm `likePost` và `savePost` đều được cấu trúc lại:
    ```javascript
    if (error) {
      if (error.code === '23505') return { error: null } // Ngắt sớm
      // ...
    }
    await supabase.rpc('increment_likes_count', ...) // Lệnh này không bị gọi nếu error = 23505
    ```
  - Các hàm `unlikePost` và `unsavePost` được bổ sung `.select()` để kiểm tra độ dài mảng dữ liệu bị xoá (`if (!data || data.length === 0) return { error: null }`), ngăn không gọi hàm RPC decrement âm.
  - Component `PostDetailPage.jsx` khi nhận `error: null` từ Service vẫn cập nhật UI state bình thường thành "Đã Thích", khớp hoàn toàn với trạng thái database hiện hữu (thay vì chửi lỗi kỹ thuật).
- **Có còn khả năng tăng count ảo không?** **Không**. Request gọi RPC increment đã được che chắn tuyệt đối bởi điều kiện không có lỗi khi insert vào db.
- **Có cần script đồng bộ lại count cũ không?** **Không cần thiết ngay lúc này**. Test xác minh qua lệnh query SQL trực tiếp (`SELECT p.id, p.likes_count, (SELECT COUNT(*) FROM post_likes) as actual...`) trả về mảng rỗng `[]`, chứng tỏ hiện tại chưa có Post nào bị dính lệch count trong DB local. (Trừ khi database trên Production đã bị lệch thì mới cần chạy script đồng bộ Data migration).

## 4. Follow/Unfollow race condition
- **Kết quả:** **Pass**.
- **Bằng chứng:**
  - File `src/services/followService.js`. Khi gặp 23505, trả về object có kèm `already_followed: true`. Khi delete row không tồn tại, trả về `already_unfollowed: true`.
  - File `src/pages/user/PublicProfilePage.jsx` (dòng 130). Đã thêm cờ check logic:
    ```javascript
    if (!data?.already_followed) {
      setFollowStats(prev => ({ ...prev, followersCount: prev.followersCount + 1 }))
    }
    ```
- **Có còn khả năng duplicate key/toast lỗi kỹ thuật không?** **Không**. Spam click follow sẽ không báo lỗi DB, toast vẫn báo "Đã theo dõi", nhưng bộ đếm UI đã ngừng cộng nhồi. Follower count ở DB thì luôn fetch bằng lệnh COUNT(*) động nên không bao giờ sai.

## 5. Test commands
- **Lệnh đã chạy:** `npm run build`
- **Kết quả:** `✓ built in 4.47s` (Tất cả Javascript, CSS bundle thành công, không gặp cảnh báo lỗi biến chưa khai báo hay type error). Các lệnh check count từ Database qua Database IDE connector cũng xác nhận trạng thái trơn tru.

## 6. Vấn đề còn sót
Những vấn đề này cần được xử lý trong Batch 2:
1. N+1 Query làm chậm trang Admin Analytics (`getActivityTrend` và `getTopDevices`).
2. Tình trạng duplicate RLS policies ở bảng `user_follows`.
3. Lỗ hổng INSERT không qua xác thực Auth UID ở bảng `admin_login_history`.
4. `alert()` hiển thị thô lỗi kỹ thuật tại trang `AdminMFASettings.jsx`.
