# Kết quả rà soát tĩnh nhanh - E-XANH

File này được tạo khi thêm bộ QA Agent. Đây không phải kết quả Playwright thật trên máy bạn; kết quả Playwright cần chạy bằng `npm run test:qa`.

## Đã kiểm tra được

- `npm install --package-lock-only` chạy được và đã cập nhật `package-lock.json` cho Playwright/Axe/Lighthouse.
- `npm ci` chạy được trong môi trường kiểm tra.
- `npm run build` chạy thành công.

## Lỗi/cảnh báo phát hiện từ source trước khi chạy browser QA

### 1. Link profile cộng đồng có thể trỏ tới `/nguoi-dung/null`

Vị trí: `src/components/community/CommunityPostCard.jsx`

Trong card cộng đồng có đoạn link:

```jsx
<Link to={`/nguoi-dung/${post.authorId}`}>...</Link>
```

Nhưng ở `src/pages/user/CommunityPage.jsx`, `authorId` có thể bị set `null` khi profile private hoặc ẩn danh. Khi đó UI có thể tạo link sai dạng:

```txt
/nguoi-dung/null
```

Ảnh hưởng:
- user bấm avatar/tên có thể vào trang profile lỗi;
- dễ liên quan lỗi “ẩn danh / không hiện tên avatar / bấm vào lỗi”.

Gợi ý fix:
- nếu `post.authorId` không có thì render `<span>` thay vì `<Link>`;
- hoặc disable link giống cách `PostCard.jsx` đang làm.

### 2. Canonical/OG URL đang hardcode domain cũ

Nhiều page dùng:

```txt
https://e-xanh.vercel.app
```

Trong khi production bạn đang dùng:

```txt
https://exanh.online
```

Ảnh hưởng:
- SEO/canonical sai;
- chia sẻ link/social preview có thể không đúng domain;
- audit Lighthouse/SEO có thể cảnh báo.

Gợi ý fix:
- tạo config `SITE_URL` dùng `import.meta.env.VITE_SITE_URL || window.location.origin`;
- thay hardcode ở các page Helmet.

### 3. `npm run lint` đang fail nhiều lỗi sẵn có

Lệnh `npm run lint` hiện fail. Một phần lỗi nằm trong `_archive/cleanup-2026-06` và scripts cũ, một phần trong source hiện tại.

Nhóm lỗi đáng chú ý:
- `_archive` vẫn bị lint dù là thư mục lưu trữ;
- `scripts/cleanup` dùng `process` nhưng ESLint đang cấu hình browser globals;
- `src/pages/admin/ThemeSettingsPage.jsx` có biến `playbackInspection` chưa định nghĩa;
- `src/pages/admin/UserManagementPage.jsx` gán property vào function `showToast.timeoutId`, bị rule React Hooks báo lỗi;
- nhiều biến unused ở các page/service.

Gợi ý fix:
- thêm `_archive/**`, `scripts/cleanup/**`, `run-*.txt` vào ignore;
- tách config ESLint riêng cho node scripts;
- sửa lỗi `playbackInspection` vì đây có thể là lỗi runtime thật trong admin giao diện/banner/video.

### 4. Automation login có thể bị Turnstile/CAPTCHA chặn

Login/Register đang dùng Turnstile nếu `VITE_DISABLE_CAPTCHA !== 'true'`.

Ảnh hưởng:
- test auth/admin bằng UI có thể không chạy được trên production nếu CAPTCHA bật;
- cần chạy local/staging với `VITE_DISABLE_CAPTCHA=true` hoặc có cơ chế bypass QA an toàn.

## Ghi chú quan trọng

Trong sandbox hiện tại không chạy được Playwright browser thật vì Chromium bị chặn truy cập URL bởi policy môi trường (`ERR_BLOCKED_BY_ADMINISTRATOR`) và không tải được browser Playwright từ CDN. Vì vậy kết quả browser thật cần chạy trên máy của bạn hoặc GitHub Actions.
