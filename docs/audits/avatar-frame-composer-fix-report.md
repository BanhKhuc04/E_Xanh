# Báo cáo: Chuyển đổi hệ thống Avatar Frame sang Canvas
**Thời gian:** Tháng 6/2026
**Mục tiêu:** Cải thiện sự ổn định, chống vỡ layout, và dọn dẹp các overlay CSS phức tạp cho hệ thống avatar.

## 1. Cơ chế cũ đã được loại bỏ
- Xóa bỏ overlay `img` tuyệt đối qua CSS (các class `.user-avatar__frame`, `.user-avatar--has-frame`, `.avatar-lightbox__frame-stage`).
- Xóa prop `frameMode` cũ trên mọi file, tránh lỗi CSS.

## 2. Tiện ích `composeAvatarFrame`
Đã tạo `src/utils/avatar/avatarFrameComposer.js`.
- **Cách hoạt động:** Dùng HTML `<canvas>` tải 2 ảnh `avatarSrc` và `frameSrc`, cắt avatar thành hình tròn bằng clip, sau đó vẽ chồng `frameSrc` lên. Cuối cùng trích xuất thành định dạng `image/webp`.
- **An toàn:** Xử lý CORS bằng `crossOrigin = 'Anonymous'`, có fallback hiển thị `initials` (ký tự viết tắt) nếu load ảnh lỗi.
- Tích hợp Skeleton Loading animation trong lúc đang gộp ảnh.

## 3. Cấu hình vị trí khung hình (Config)
`src/config/avatarFrames.js` đã được tinh gọn với object `compose`:
```javascript
compose: {
  avatarScale: 0.70, // kích thước của vòng rỗng trên frame so với canvas size
  avatarCenterX: 0.5, // trục X
  avatarCenterY: 0.44  // trục Y
}
```
**Cách tinh chỉnh nếu avatar bị lệch:** 
- Chỉnh sửa các giá trị trên ngay trong `AVATAR_FRAMES`. Nếu mặt quá to, giảm `avatarScale`. Nếu lệch trên/dưới, điều chỉnh `avatarCenterY`.

## 4. Danh sách các File đã sửa đổi
- `src/utils/avatar/avatarFrameComposer.js` (Mới)
- `src/config/avatarFrames.js`
- `src/components/common/UserAvatar.jsx`
- `src/components/common/UserAvatar.css`
- `src/components/common/AvatarLightbox.jsx`
- `src/components/common/AvatarLightbox.css`
- `src/components/account/ProfileHeader.jsx`
- `src/pages/user/PublicProfilePage.jsx`
- Hàng loạt component nhỏ khác (xóa bỏ `frameMode="ring"`).

## 5. Kết quả Build
- Chạy `npm run build` thành công, không gặp lỗi.
- App đã gọn gàng, hiệu năng canvas được tối ưu chỉ gọi khi cần hiển thị frame thực sự.

## 6. Lộ trình tiếp theo
- Sau này Admin có thể dễ dàng quản lý kho Avatar Frame bằng cách insert thêm dữ liệu có kèm theo thông số `compose` vào bảng cơ sở dữ liệu `avatar_frames` (hoặc chèn trực tiếp vào config array).
- Trong Database `profiles`, chỉ cần lưu `avatar_frame_id`.
