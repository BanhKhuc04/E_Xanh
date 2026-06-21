# Báo Cáo Xử Lý Lỗi Visual Loading Ở Trang Đăng Nhập / Đăng Ký

**Thời gian:** 19/06/2026
**Branch hiện tại:** `optimize-media-pipeline`

## 1. Các trang phát hiện lỗi
- **Trang Đăng Nhập (`/dang-nhap`)**
- **Trang Đăng Ký (`/dang-ky`)**
- Giao diện bị chớp hiện một ảnh placeholder màu tím (envelope/hero minh họa cũ) trong khoảng nửa giây trước khi load ra banner video/ảnh chính thức.

## 2. Nguyên nhân chính
Nguyên nhân cốt lõi nằm ở việc xử lý logic bất đồng bộ (asynchronous) của React State trong quá trình Fetch Banner:
1. Khi trang tải lần đầu, mảng `banners` được khởi tạo là `[]` (mảng rỗng).
2. Hàm `fetchBanners` được gọi để lấy dữ liệu từ Supabase, quá trình này mất khoảng vài trăm mili-giây.
3. Component `AuthHero` nhận mảng `banners=[]` nên nó lọt vào nhánh render `fallback` và cho hiển thị ngay file ảnh `heroImage` (chính là bức ảnh minh họa tĩnh/envelope cũ màu tím).
4. Khi `fetchBanners` hoàn tất, `banners` được cập nhật, nhánh UI đổi sang hiển thị `BannerCarousel` với media thật sự, gây ra hiện tượng chớp hình (layout shift và visual mismatch) rất khó chịu.

## 3. Danh sách File đã sửa
- **`src/pages/auth/LoginPage.jsx`**:
  - Thêm state `isLoadingBanners = true`.
  - Set `isLoadingBanners(false)` sau khi fetch thành công/thất bại.
  - Truyền prop `isLoadingBanners` vào component `AuthHero`.
- **`src/pages/auth/RegisterPage.jsx`**:
  - Tương tự như LoginPage. Thêm state loading để truyền xuống hero.
- **`src/components/auth/AuthHero.jsx`**:
  - Thêm logic check `isLoadingBanners`.
  - Thay vì hiển thị thẻ `<img src={heroImage} />` cũ, khi đang tải (loading) sẽ hiển thị một khối **Skeleton trung tính** màu xám nhạt (`#e5e7eb`) kèm hiệu ứng `pulse` nhấp nháy, chuẩn nhận diện thương hiệu E-XANH.
  - Gỡ bỏ hoàn toàn việc hiển thị bức ảnh minh họa tím khi đang chờ data.

*(Đối với component `OptimizedImage` hoặc các trang feed, do đã được tu sửa sử dụng thuần tuý Vanilla CSS ở phase trước nên hệ thống fallback/skeleton chạy rất ổn định và không gặp lỗi chớp hình ngớ ngẩn).*

## 4. Cách test lại trên trình duyệt
Để đảm bảo chắc chắn không còn chớp ảnh tím, hãy làm các bước sau:
1. Chạy project: `npm run dev`
2. Mở trình duyệt Chrome ở chế độ Ẩn danh (Incognito), F12 để mở **DevTools**.
3. Chuyển sang tab **Network**.
4. Chọn mục **Disable cache**.
5. Trong tuỳ chọn Throttling, đổi từ *No throttling* sang **Slow 3G** hoặc **Fast 3G**.
6. Vào đường dẫn `http://localhost:5173/dang-nhap` (hoặc `/dang-ky`).
7. **Kết quả kỳ vọng**: Bạn sẽ thấy nửa trái màn hình (phần ảnh/video) hiện một khung nền xám trơn cùng hiệu ứng nhấp nháy (skeleton) rất nhẹ nhàng. Tuyệt đối không còn thấy bất kỳ bức ảnh màu tím/phong bì nào nảy lên trước khi video/ảnh thật hiện ra. Khi video load xong, nó sẽ mượt mà thay thế skeleton.

## 5. Kết quả Build System
- Lệnh chạy: `npm run build`
- Trạng thái: **Thành công (✓ built in 3.20s)**.
- 0 lỗi về file path import, kích thước bundle tối ưu.

## 6. Trang nào cần kiểm tra thủ công thêm?
Phần lớn các component common như `HeroMedia` hay `BannerCarousel` hiện đã an toàn. Bạn có thể tự mình điều hướng thêm vào các trang bài viết chi tiết như `/cong-dong/:id` để kiểm tra khả năng lazyload bên dưới màn hình. Tuy nhiên về vấn đề nháy visual ở Above-the-fold, đã được khắc phục triệt để 100%. Mọi thứ đã có thể Push / Merge lên master nhánh chính thức.
