# Báo Cáo Xử Lý Lỗi CSS Card Bài Viết (Related Posts)

**Ngày thực hiện:** 19/06/2026
**Phạm vi:** Section "Có thể bạn cũng thích" (Related posts) và component `PostCard` (Card bài viết mẹo tiết kiệm).

## 1. Nguyên nhân lỗi CSS
Sau quá trình audit CSS của dự án, tôi đã phát hiện ra các nguyên nhân chính làm vỡ giao diện "Có thể bạn cũng thích" trên trang chi tiết bài viết mẹo tiết kiệm:

1. **Conflict ảnh tĩnh và Component mới**: Ở các phase trước, mặc dù hệ thống Media Pipeline và `OptimizedImage` được tích hợp, nhưng `PostCard.jsx` vẫn sử dụng `SmartImage` cũ. Selector CSS ban đầu phụ thuộc cứng vào cấu trúc DOM của component cũ (`.tips-post-card__media .smart-image-container img`), dẫn tới việc các style về `object-fit`, `aspect-ratio` bị thất bại khi render.
2. **Mất Flexbox ở Metadata Footer**: Class `.tips-post-card__footer` đã mất đi các khai báo `display: flex; justify-content: space-between;` khiến layout của row Tác giả và row Thống kê (Tim, Bình luận, Lưu) bị rơi xuống thành từng hàng dọc liên tiếp.
3. **Save Button bị ảnh hưởng bởi Global Styles**: Nút Save (Lưu bài viết - icon Bookmark) dùng thẻ `<button>` nhưng không được xóa các định dạng nền (appearance, padding) chuẩn của hệ điều hành/trình duyệt, làm nó trông giống một nút Button nổi (chữ nhật) mặc định rất thô thay vì là một nút tròn trong suốt.
4. **Grid Layout Responsive**: Selector của grid 3 cột `.post-detail-suggestions__grid` bị gộp chung vào media query `max-width: 1120px` với class khác, làm nó biến thành 1 cột trực tiếp thay vì bẻ xuống 2 cột trên Tablet.

## 2. Các file đã sửa

- **`src/components/posts/PostCard.jsx`**:
  - Đổi từ `SmartImage` sang sử dụng `OptimizedImage` để tận dụng hệ thống lazy-load WebP tối ưu của toàn dự án.
  - Cập nhật logic truyền `src`: ưu tiên dùng `cover_card_url` (nếu có) trước khi lùi về ảnh gốc `image` (tăng tốc độ tải mạng cho thumbnail).
- **`src/styles/tips.css`**:
  - Bổ sung selector cho `OptimizedImage`: `.tips-post-card__media .optimized-image-wrapper img`.
  - Cập nhật `object-position: center;` để ảnh không bị cắt cụt đầu.
  - Phục hồi lại Grid Flexbox ở footer: `.tips-post-card__footer` set `display: flex; justify-content: space-between; align-items: center;`.
  - Xóa reset margin ở cụm Author, cho `flex: 1` và set `white-space: nowrap` + `text-overflow: ellipsis` để tránh trường hợp tên người dùng quá dài đẩy cụm Thống kê xuống dòng.
  - Xóa bỏ styles mặc định trình duyệt cho `.tips-post-card__save-btn` (`padding: 0; appearance: none; outline: none;`).
- **`src/styles/post-detail.css`**:
  - Tách riêng media query cho `.post-detail-suggestions__grid` thành `max-width: 992px` trả về 2 cột, và `max-width: 768px` (mobile) trả về 1 cột.

## 3. Các section và thiết bị đã Test
- Màn hình Desktop 1440px / 1080p: Grid hiện 3 cột, card bo góc mượt, tỷ lệ ảnh chuẩn 16:9 sắc nét, hover có bóng đổ và nổi lên. Các metadata đều nằm gọn gàng trên 1 dòng ngang.
- Màn hình Tablet (iPad ~768-992px): Grid linh hoạt chuyển xuống 2 cột.
- Màn hình Mobile (iPhone ~390px): Grid chuyển thành 1 cột, ảnh bự và rất dễ thao tác chạm nút Save.
- **Có ảnh hưởng trang khác không?**: KHÔNG. Tất cả các CSS selector được giới hạn nghiêm ngặt ở phạm vi block class `.tips-post-card` và `.post-detail-suggestions__grid`, hoàn toàn tuân thủ kiến trúc Vanilla CSS cũ.

## 4. Kết quả Build
- Đã chạy `npm run build`.
- System Build: **Thành công (✓ built in 5.09s)**. Không phát hiện bất kỳ lỗi bundle css (postcss/terser) hay lỗi import nào.

## 5. Hướng dẫn Test thủ công (Manual Test Checklist)
Bạn có thể tự test trên máy mình theo các bước:
- [x] Chạy `npm run dev`.
- [x] Vào trang chi tiết mẹo tiết kiệm bất kỳ: `/meo-tiet-kiem/:slug`.
- [x] Cuộn xuống cuối bài, nhìn vào section **Có thể bạn cũng thích**.
- [x] Quan sát ảnh cover đã sắc nét, tỷ lệ 16:9, hình không bị bóp méo. Nút Save (icon Bookmark) nhỏ gọn nằm chồng lên góc trên bên phải bức ảnh.
- [x] Quan sát Footer thẻ: Avatar + tên tác giả nằm bên trái, cụm [Tim - Comment - Save] nằm dàn ngang bên phải. Thu nhỏ cửa sổ lại để thấy card biến đổi mượt mà giữa 3 -> 2 -> 1 cột.
- [x] Check thẻ Network F12: Các ảnh Card đang được kéo bằng chuẩn `.webp` thay vì ảnh gốc `2MB`.
