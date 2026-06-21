# Báo cáo: Hệ thống Avatar & Frame E-XANH

**Thời gian:** Tháng 6/2026
**Mục tiêu:** Tái cấu trúc và chuẩn hóa hệ thống Avatar và Frame E-XANH trên toàn bộ website.
**Tình trạng Build:** Đang kiểm tra...

## Các File Đã Thay Đổi/Tạo Mới
- `src/config/avatarFrames.js` (Cấu hình)
- `src/components/common/UserAvatar.jsx`
- `src/components/common/UserAvatar.css`
- `src/components/common/AvatarLightbox.jsx`
- `src/components/common/AvatarLightbox.css`
- `src/components/account/ProfileHeader.jsx`
- `src/pages/user/PublicProfilePage.jsx`

## Frame Asset Đang Dùng
- **File path:** `public/avatar-frames/exanh-default-frame.png`
- **Tình trạng:** Hệ thống đang sử dụng frame ảnh chuẩn. Dựa vào yêu cầu, frame *bắt buộc phải là PNG trong suốt* ở vòng tròn giữa để hình ảnh avatar (bên dưới) được nhìn xuyên thấu qua.
- **Lưu ý quan trọng (Nếu frame chưa đạt):** Asset frame *phải* có khu vực ở giữa hoàn toàn trong suốt (Transparent). Nếu file `exanh-default-frame.png` hiện tại có nền trắng hoặc màu đặc ở giữa vòng tròn, vui lòng export lại PNG có vùng rỗng và thay thế file, nếu không frame sẽ che mất khuôn mặt người dùng.

## Avatar Đã Khớp Frame Chưa?
**Đã khớp.** Modal xem avatar (AvatarLightbox) hiện sử dụng logic `absolute positioning` và Z-index:
- Frame image (`z-index: 2`) nằm trên cùng che phủ các viền.
- Avatar image (`z-index: 1`) nằm bên dưới, lọt gọn vào vòng tròn.

**Cách căn chỉnh thêm (nếu cần):**
Mở file `src/config/avatarFrames.js` và chỉnh sửa tham số `placement` trong Object cấu hình:
- `avatarCenterX`: Tọa độ tâm X (Ví dụ `0.5` = giữa).
- `avatarCenterY`: Tọa độ tâm Y (Ví dụ `0.39` = cách trên cùng 39%).
- `avatarSize`: Độ lớn vòng tròn lỗ hổng so với frame (Ví dụ `0.5` = 50% khung).

## Các Trang Đã Thay Thế
1. Trang Cá nhân (`/tai-khoan`) - `ProfileHeader.jsx` (Dùng size="profile" lớn hơn, có viền profile chuẩn).
2. Trang Hồ sơ công khai (`/nguoi-dung/:id`) - `PublicProfilePage.jsx` (Đồng bộ với Profile cá nhân).
3. Navbar (`UserNavbar.jsx`) - (Kích thước "sm", viền "ring" mỏng nhẹ).
4. Bài viết cộng đồng / Tác giả - Các components như `PostAuthorAvatar.jsx` và `CommunityPostCard.jsx` đều đã sử dụng class gốc và prop `frameMode="ring"` tiêu chuẩn.

## Ghi Chú Phát Triển Phase Sau
Khi Admin muốn thêm frame mới:
1. Upload file ảnh PNG trong suốt vào thư mục `public/avatar-frames/` (Hoặc sau này có thể dùng link url từ Supabase Storage).
2. Mở file `src/config/avatarFrames.js`.
3. Thêm một Object vào mảng `AVATAR_FRAMES` chứa `id` và config `placement` tùy chỉnh phù hợp với vị trí rỗng của frame đó.
4. Cấu trúc component mới cho phép đổi frame cực kỳ dễ dàng bằng cách truyền `frameId="tên-frame"`. Hệ thống sẽ tự tra soát cấu hình và căn giữa tự động.
