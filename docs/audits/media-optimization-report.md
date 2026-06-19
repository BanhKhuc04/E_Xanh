# Báo Cáo Tối Ưu Hóa Hình Ảnh Toàn Web (Media Optimization Report)

## 1. Nguyên nhân chính gây ảnh chậm / không load
- **Fetch ảnh gốc kích thước lớn**: Người dùng tải ảnh lên (ví dụ ảnh từ điện thoại 3MB-5MB) và hệ thống lưu trữ trực tiếp ảnh gốc, sau đó fetch hiển thị ở mọi nơi (từ avatar nhỏ đến card bài viết) mà không nén, dẫn tới băng thông bị quá tải và thời gian tải trang lâu.
- **Không có fallback rõ ràng cho ảnh lỗi / không tồn tại**: Việc sử dụng thẻ `<img>` thô với URL bị thiếu/lỗi khiến trình duyệt chỉ hiện khung trống màu trắng/xanh, làm vỡ layout hoặc trải nghiệm rất kém.
- **Fetch toàn bộ dữ liệu ở trang danh sách**: Truy vấn `getCommunityPosts` trước đây sử dụng `.select('*')` làm cho toàn bộ text của `content` bị tải thừa, cộng với việc không có phân trang đúng cách (chỉ slice trên frontend) làm nghẽn cổ chai mạng khi số bài viết tăng lên (200-300 bài).

## 2. Danh sách file đã sửa
- `src/services/mediaUploadService.js`: Sửa toàn bộ luồng upload để tạo variants.
- `src/services/postService.js`: Thêm phân trang (range) cho API và select ít trường hơn cho feed.
- `src/components/community/CommunityPostCard.jsx`: Dùng `OptimizedImage`.
- `src/components/home/CommunityPreview.jsx`: Dùng `OptimizedImage`.
- `src/components/home/FeaturedPosts.jsx`: Dùng `OptimizedImage`.
- `src/pages/user/PostDetailPage.jsx`: Truyền `cover_detail_url` vào content.
- `src/components/posts/ArticleContent.jsx`: Dùng `OptimizedImage`.
- `src/pages/user/CommunityPostDetailPage.jsx`: Dùng `OptimizedImage`.
- `src/pages/user/CommunityPage.jsx`: Cập nhật logic phân trang (pagination) trên Client để đồng bộ với Server.
- `src/components/account/ProfileHeader.jsx`: Dùng `OptimizedImage`.
- `package.json`: Đảm bảo dependencies cho luồng build.

## 3. Component mới đã tạo
- **`src/components/common/OptimizedImage.jsx`**: Component chung dùng làm drop-in replacement cho `<img>`. Tích hợp sẵn `srcSet` tự động sinh ra dựa trên props `variants`, có hiệu ứng khung skeleton khi đang tải (loading) và Icon fallback chuẩn khi bị lỗi hoặc không có ảnh, tránh làm rỗng khung.
- **Pipeline ảnh (src/utils/media/)**:
  - `imageValidation.js`
  - `imageOptimizer.js`
  - `imageVariants.js`

## 4. Luồng upload ảnh mới
- Khi user/admin chọn file ảnh bài viết, `imageValidation` sẽ check loại file, dung lượng.
- `imageOptimizer.js` sử dụng thẻ `canvas` trên Browser để tiến hành resize.
- Lần lượt tạo 3 variant `thumb` (360px), `card` (900px), và `detail` (1440px) dưới dạng WebP `quality: 85`.
- Đẩy 3 phiên bản WebP vào Supabase Storage, với thư mục có cấu trúc `posts/[postId]/card-[timestamp].webp` thay vì ghi đè cache.

## 5. Cách Database lưu ảnh mới
Chúng ta sử dụng file SQL `supabase/migrations/add_post_image_variants.sql` để thêm cột:
- `cover_thumb_url`
- `cover_card_url`
- `cover_detail_url`
- `cover_width`, `cover_height`, `cover_aspect_ratio`

Khi upload thành công, API sẽ trả về JSON chứa các URL variant để component cha gửi đi lưu Database.

## 6. Các route đã áp dụng
- `/cong-dong`
- `/cong-dong/:id`
- `/` (Home, phần nổi bật)
- `/meo-tiet-kiem/:slug` (Phần detail)
- `/tai-khoan` (Profile cover photo)

## 7. Cách test bằng Chrome Network
1. Mở Chrome DevTools (F12) -> tab **Network**.
2. Tick chọn **Disable cache**.
3. Load trang `/cong-dong` (Feed):
   - Bạn sẽ thấy các ảnh có đuôi `.webp` và tên có dạng `card-...webp` thay vì ảnh gốc.
   - Kích thước load dưới 200KB (thường ~80KB).
4. Load trang Detail:
   - Ảnh to nhất sẽ load là bản `detail-...webp` thay vì nguyên gốc.
5. Cuộn xuống cuối trang `/cong-dong`:
   - Ấn "Xem thêm bài viết". Nhìn tab Network sẽ thấy API call mới trả về lượng data nhỏ thay vì load lại toàn bộ posts.

## 8. Lưu ý migration ảnh cũ
Script `scripts/migrate-post-images.mjs` được cung cấp sẵn.
Script sẽ query ảnh chưa có `cover_card_url`, download ảnh cũ trên Storage, chạy biến đổi thành WebP và upload lại, sau đó Update DB. 
- Mặc định chạy dry-run: `node scripts/migrate-post-images.mjs`
- Áp dụng: `node scripts/migrate-post-images.mjs --apply`

## 9. Các vấn đề còn cần Supabase data thật để xác nhận
- Chạy script SQL migration trên Supabase production (hoặc local). Nếu chưa chạy SQL, việc upload ảnh mới sẽ hoạt động nhưng Supabase sẽ báo lỗi thiếu cột khi save post.
- Test script migration ảnh cũ bằng Service Role Key.
- Test tạo mới 1 post với cover để xác nhận các kích thước WebP lưu chuẩn và trả về DB.
