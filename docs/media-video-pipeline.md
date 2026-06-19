# Quy trình nén và quản lý Video trên E-XANH

Hiện tại dự án React + Vite (Frontend) không nhúng sẵn thư viện `ffmpeg.wasm` vì thư viện này có thể làm phình dung lượng bundle lên mức không thể chấp nhận được (thêm khoảng 25MB+ cho main chunk).

## Yêu cầu đối với Video:
1. Video nên được nén offline hoặc qua server-side / Edge Function.
2. Định dạng khuyên dùng: **MP4 (H.264)** để đảm bảo tương thích 100% với trình duyệt trên Desktop và Mobile.
3. Kích thước (File size): Cố gắng nén dưới **15MB**. Frontend chặn cứng upload nếu video > **50MB**.

## Quá trình Upload hiện tại:
- Frontend sẽ validate định dạng (MP4, WEBM).
- Frontend tự động trích xuất 1 khung hình (frame) bằng thẻ `<video>` ẩn và Canvas để làm hình nền (Poster Image), giúp UI không bị trống khi video chưa chạy.
- Video được tải thẳng lên Supabase Storage với `cacheControl = 31536000` (1 năm) để tận dụng CDN của Supabase.

## Khuyến nghị mở rộng (Tương lai):
- Setup **Supabase Edge Functions** (Sử dụng FFmpeg layer) hoặc Dịch vụ chuyển đổi trung gian (Cloudinary, Mux).
- Khi frontend upload 1 file video (raw), một webhook sẽ trigger server job chạy ngầm để sinh ra biến thể `480p`, `720p` và `1080p` HLS/DASH.
