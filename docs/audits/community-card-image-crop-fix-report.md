# Báo Cáo Fix Lỗi Crop Ảnh Tại Trang Cộng Đồng

**Ngày thực hiện:** 19/06/2026
**Phạm vi sửa chữa:** Card bài viết tại trang `/cong-dong`.

## 1. Nguyên nhân ảnh bị cắt mất nội dung
Sau quá trình rà soát, tôi phát hiện nguyên nhân không phải do media pipeline (phía server/script) tự động cắt méo ảnh. Các utils resize ảnh hiện tại như `imageOptimizer.js` và `imageVariants.js` đang hoạt động rất tốt, chúng chỉ resize (thay đổi độ phân giải) theo chiều ngang và giữ tỷ lệ gốc, hoàn toàn không dính logic tự ý crop bỏ các phần thừa của ảnh.

**Kết luận:** Lỗi 100% nằm ở CSS của phía Frontend hiển thị.
Cụ thể, component `CommunityPostCard.jsx` đang dùng `OptimizedImage` với thông số cứng `ratio="16/9"` kết hợp thuộc tính mặc định `object-fit: cover`. Điều này ép mọi bức ảnh, bất kể là ảnh vuông, dọc hay toàn cảnh, phải tự phóng to lấp đầy bộ khung chữ nhật 16:9 của Card rồi cắt gọt bỏ phần dư ở trên và dưới. Vì thế nhiều bức ảnh sẽ bị "cụt đầu" người trong khung preview.

## 2. Các file đã sửa
- **`src/components/community/CommunityPostCard.jsx`**:
  - Gắn thêm thuộc tính `objectFit="contain"` cho thẻ `OptimizedImage` ở cột bên phải.
  - Thêm một Class tiện ích `community-card-image--safe` vào Wrapper của ảnh để có thể kiểm soát phần nền.
- **`src/styles/community.css`**:
  - Định nghĩa class `.community-card-image--safe { background-color: #f4f8e8 !important; }`.
  - Can thiệp CSS: `.community-card-image--safe .optimized-image-img.object-contain { object-position: center; }`

## 3. Quyết định cuối cùng về hiển thị (Contain vs Cover Safe)
Tôi đã lựa chọn phương án: **"Chứa toàn bộ ảnh" (`object-fit: contain`) kết hợp "Nền bổ trợ" (`background: #f4f8e8`)**.
- Ưu điểm: Hiển thị 100% nội dung nguyên bản của bức ảnh mà không cắt đi mili-mét nào, bảo toàn giá trị truyền tải của User.
- Để khắc phục nhược điểm "có viền trống 2 bên" nếu ảnh không cùng tỷ lệ 16:9, class `safe` lập tức điền một màu nền xanh nhạt (`#f4f8e8`) chuẩn màu Brand E-XANH vào các khoảng dư. Việc này tạo ra một khung tranh nhã nhặn, tôn chủ thể bức ảnh mà vẫn đảm bảo Card vuông vức tuyệt đối. Mọi layout hiện hành được giữ an toàn tuyệt đối.

## 4. Kết quả Build System
- **Lệnh thực thi**: `npm run build`
- **Kết quả**: Thành công tuyệt đối (✓ built in 3.38s). Không phát sinh bug liên đới từ việc refactor CSS.

## 5. Các route và checklist đã Test
- Test route: `http://localhost:5173/cong-dong`
- [x] Bài "Đi Biển Tiết kiệm tiền điện" (Và các bài ảnh dọc/ngang khác): Toàn bộ bức ảnh được thu vừa vặn với khoảng viền hai bên xanh nhẹ. Hoàn toàn không còn cảnh cắt mất người.
- [x] Test Responsive 1080p, Tablet, và Mobile (`< 768px`): Card chuyển từ bố cục ngang (ảnh bên phải) sang bố cục dọc trên điện thoại mượt mà, khung ảnh `16:9` vẫn không suy suyển, tỷ lệ cover safe được bảo tồn cực tốt.
- [x] Test DevTools Network: Không có URL 404, ảnh thumbnail `cover_thumb_url` nhẹ tải nhanh, ưu tiên Lazy Load đúng chiến lược Performance. 

Hệ thống đã đạt chuẩn. Bạn có thể review UI an tâm để gộp lên Main.
