# Bộ Playwright test tự động cho E-XANH

Bộ này dùng để test nhanh các chức năng và nút của web E-XANH, đặc biệt các lỗi nhỏ kiểu:

- Nút bấm không có phản hồi
- Link/menu đi sai route
- Trang trắng, route 404 khi refresh
- Avatar/user menu/settings chưa làm hoặc bấm không ra gì
- Form đăng bài validate chưa rõ, chuyển trang khó chịu
- Bài cộng đồng nhảy sai sang mẹo tiết kiệm
- Admin dashboard, chuông, dấu hỏi, search giả
- UI mobile bị tràn ngang
- Text rác `undefined`, `null`, `NaN`, `[object Object]`

## 1. Cài đặt

Copy thư mục này vào root project React E-XANH, sau đó chạy:

```bash
npm install
npx playwright install
```

Nếu project của bạn đã có `package.json`, bạn có thể chỉ cần cài Playwright:

```bash
npm i -D @playwright/test
npx playwright install
```

## 2. Cấu hình URL

Tạo file `.env` hoặc set biến môi trường khi chạy.

Local Vite:

```bash
set EXANH_BASE_URL=http://localhost:5173
npm test
```

PowerShell:

```powershell
$env:EXANH_BASE_URL="http://localhost:5173"
npm test
```

Mac/Linux:

```bash
EXANH_BASE_URL=http://localhost:5173 npm test
```

Vercel:

```bash
EXANH_BASE_URL=https://link-vercel-cua-ban.vercel.app npm test
```

## 3. Tài khoản test

Các test login user/admin sẽ tự skip nếu bạn chưa nhập tài khoản.

```bash
USER_EMAIL=user-demo@example.com
USER_PASSWORD=123456
ADMIN_EMAIL=admin-demo@example.com
ADMIN_PASSWORD=123456
```

PowerShell ví dụ:

```powershell
$env:USER_EMAIL="user-demo@example.com"
$env:USER_PASSWORD="123456"
$env:ADMIN_EMAIL="admin-demo@example.com"
$env:ADMIN_PASSWORD="123456"
npm test
```

## 4. Lệnh chạy nhanh

```bash
npm run test:smoke     # Route + navigation cơ bản
npm run test:user      # User/profile/cộng đồng/đăng bài/bài đã lưu
npm run test:admin     # Admin dashboard/quản lý bài
npm run test:uiux      # Nút chết + responsive + lỗi UI nhỏ
npm test               # Chạy toàn bộ
npm run report         # Xem report HTML sau khi chạy
```

## 5. File quan trọng

```text
playwright.config.js
.env.example
data/routes.js
utils/test-utils.js
tests/00-scope-inventory.spec.js
tests/01-smoke-routes.spec.js
tests/02-navigation.spec.js
tests/03-auth-user-profile.spec.js
tests/04-home-ui.spec.js
tests/05-tips-page.spec.js
tests/06-community.spec.js
tests/07-create-post.spec.js
tests/08-post-detail.spec.js
tests/09-saved-posts.spec.js
tests/10-comments.spec.js
tests/11-electricity-calculator.spec.js
tests/12-admin-auth.spec.js
tests/13-admin-dashboard.spec.js
tests/14-admin-management.spec.js
tests/15-update-report.spec.js
tests/16-dead-buttons.spec.js
tests/17-responsive.spec.js
tests/18-uiux-accessibility.spec.js
tests/19-search-filter-pagination.spec.js
tests/20-console-performance.spec.js
manual/EXANH_testcase_212_chuc_nang.xlsx
manual/Bug_Report_Template.md
```

## 6. Cách đọc kết quả

Sau khi chạy xong:

```bash
npm run report
```

Nếu test fail, mở report để xem:

- Ảnh chụp màn hình lỗi
- Video lỗi
- Trace từng bước click
- Console error

## 7. Lưu ý quan trọng

Một số test được viết kiểu “nếu chức năng có trên UI thì phải chạy”. Ví dụ:

- Có icon chuông admin thì bấm phải hiện dropdown/phản hồi
- Có icon dấu hỏi thì phải hiện hướng dẫn
- Có search admin thì search phải có tác dụng hoặc ít nhất có phản hồi
- Có avatar/settings thì bấm phải mở menu/trang chỉnh sửa
- Có nút báo cáo lỗi thì bấm xong không được trắng chữ/mất nút

Nếu chức năng chưa làm thật thì có 2 hướng xử lý:

1. Làm cho nút chạy thật.
2. Ẩn nút khỏi UI để tránh bị tính là nút chết.

## 8. Test inventory

Chạy riêng:

```bash
npx playwright test tests/00-scope-inventory.spec.js
```

Nó tạo file:

```text
test-results/exanh-ui-inventory.json
```

File này liệt kê các nút/link visible trên từng route để bạn biết chức năng nào đang có mặt trên UI.
