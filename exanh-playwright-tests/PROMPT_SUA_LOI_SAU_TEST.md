# Prompt sửa lỗi sau khi chạy Playwright

Dùng prompt này đưa cho AI/dev sau khi chạy test:

```text
Tôi đã chạy bộ Playwright test cho dự án E-XANH. Hãy đọc lỗi trong playwright-report/test-results và sửa theo nguyên tắc sau:

1. Không thêm chức năng ngoài phạm vi hiện có của E-XANH.
2. Nút/icon nào xuất hiện trên UI thì phải có phản hồi rõ: chuyển route, mở dropdown/modal, toast, copy link hoặc validate form.
3. Nếu chức năng chưa làm thật thì ẩn nút khỏi UI, không để nút giả.
4. Sửa các route bị trắng trang, 404 khi refresh, hoặc render quá ít nội dung.
5. Sửa các lỗi text rác: undefined, null, NaN, [object Object].
6. Sửa responsive mobile: không tràn ngang ở 390px, 768px, 1366px.
7. Kiểm tra avatar/user menu/profile/settings: nếu có nút chỉnh sửa/cài đặt thì phải mở form hoặc trang tương ứng.
8. Kiểm tra form đăng bài: validate rõ, giữ user ở form khi lỗi, không chuyển trang khó chịu khi chưa cần.
9. Kiểm tra cộng đồng: bài cộng đồng không được nhảy sang mẹo tiết kiệm.
10. Kiểm tra admin: dashboard, chuông thông báo, nút dấu hỏi, quản lý bài viết, search/filter nếu còn trên UI.
11. Sau khi sửa, chạy lại: npm run test:smoke, npm run test:user, npm run test:admin, npm run test:uiux.

Hãy trả về danh sách file đã sửa và giải thích ngắn từng lỗi đã xử lý.
```
