# QA Agent tự động cho E-XANH

Bộ test này dùng Playwright để kiểm tra tổng thể E-XANH theo cách có bằng chứng: route, ảnh, nút, form, role, mobile, console error, network error, screenshot, video và trace.

## 1. Bộ test kiểm tra gì?

### Public route health
- `/`
- `/meo-tiet-kiem`
- `/cong-dong`
- `/kiem-tra-tien-dien`
- `/ve-chung-toi`
- `/lien-he`
- `/dieu-khoan`
- `/dang-nhap`
- `/dang-ky`
- `/quen-mat-khau`

Mỗi route được kiểm tra:
- HTTP status `< 400`
- không màn trắng
- body có nội dung thật
- F5/reload không lỗi
- không JS page error
- không console error nghiêm trọng
- không request 404/500 nghiêm trọng
- không tràn ngang layout

### Ảnh và giao diện
Test chỉ kiểm tra ảnh chính/card/banner, không kiểm tra bừa avatar/logo/icon.

Bắt lỗi:
- ảnh không load
- ảnh trắng, `naturalWidth = 0`
- ảnh bài viết/banner/card sai tỉ lệ quá xa 16:9
- layout tràn ngang trên desktop/mobile

Ngưỡng hiện tại cho ảnh cover/card/banner: ratio hiển thị phải nằm trong khoảng `1.35–2.05`. Chuẩn 16:9 là `1.77`.

### Nút và chức năng nhỏ
- navbar link
- tìm kiếm/filter mẹo tiết kiệm nếu có input
- mở chi tiết bài viết
- chia sẻ bài cộng đồng phải hiện toast/feedback
- ẩn danh bấm thích/lưu/bình luận phải có feedback yêu cầu đăng nhập
- form đăng nhập validate email/mật khẩu
- form đăng ký validate field/password/confirm/terms
- công cụ tính tiền điện: empty state, thêm thiết bị, tính tiền, reset

### Role/user/admin
Các test đăng nhập user/admin là optional vì cần tài khoản test.

- Ẩn danh vào `/bai-da-luu`, `/lich-su-kiem-tra`, `/tai-khoan/cai-dat` phải bị chuyển về đăng nhập.
- Ẩn danh vào `/admin` không được vào admin thật.
- Nếu có `QA_USER_EMAIL`, test user login và mở trang user.
- Nếu có `QA_ADMIN_EMAIL`, test admin login và mở toàn bộ route admin.

### Accessibility
Dùng `@axe-core/playwright` để quét nhanh accessibility. Rule `color-contrast` đang tạm tắt để tránh chặn QA chức năng trong lúc UI chưa chốt.

### Lighthouse
Có cấu hình Lighthouse CI để kiểm tra performance/accessibility/best-practices/SEO.


## 2.1. Bản v2 đã xử lý 2 nhiễu test thường gặp

Bản này đã tự xử lý:

- Bỏ qua lỗi tracking/analytics như `https://www.google.com/g/collect`, `googletagmanager`, `cloudflareinsights`, `Vercel Speed Insights`. Những lỗi này thường do mạng/extension chặn tracking, không phải lỗi chức năng E-XANH.
- Tự đánh dấu đã xem và/hoặc đóng popup `Hướng dẫn test & báo lỗi E-XANH` trước khi kiểm tra route, để overlay mờ không che nút, không làm sai test ảnh/layout/screenshot.

Nếu bạn vẫn muốn nhìn popup bằng mắt, chạy web bình thường trong Chrome của bạn. QA Agent sẽ cố tình đóng popup để test phần website phía sau cho sạch.

## 2. Cài đặt

```bash
npm install
npx playwright install
```

Nếu chưa cài dev dependencies mới:

```bash
npm i -D @playwright/test @axe-core/playwright @lhci/cli
npx playwright install
```

## 3. Chạy test production

Mac/Linux:

```bash
QA_BASE_URL=https://exanh.online npm run test:qa
```

Windows PowerShell:

```powershell
$env:QA_BASE_URL="https://exanh.online"; npm run test:qa
```

## 4. Xem report

```bash
npm run test:qa:report
```

Playwright sẽ tạo:

```txt
playwright-report/
test-results/
```

Khi fail sẽ có:
- screenshot
- video
- trace
- JSON result

## 5. Tạo report Markdown dễ đọc

Sau khi chạy test:

```bash
npm run test:qa:summary
```

File xuất ra:

```txt
test-results/QA_REPORT.md
```

## 6. Chạy UI mode để xem từng test

```bash
npm run test:qa:ui
```

## 7. Chạy headed để nhìn browser thật

```bash
npm run test:qa:headed
```

## 8. Chạy test user/admin đầy đủ

Tạo file `.env.qa.local` theo mẫu `.env.qa.example` hoặc set biến môi trường thủ công.

PowerShell ví dụ:

```powershell
$env:QA_BASE_URL="https://exanh.online"
$env:QA_USER_EMAIL="user01@exanh.test"
$env:QA_USER_PASSWORD="Test@123456"
$env:QA_ADMIN_EMAIL="admin-test@exanh.test"
$env:QA_ADMIN_PASSWORD="Test@123456"
npm run test:qa
```

Lưu ý quan trọng: nếu production vẫn bật Turnstile/CAPTCHA thật, automation login UI có thể bị chặn. Với local QA, hãy build/chạy app với:

```env
VITE_DISABLE_CAPTCHA=true
```

Không tắt CAPTCHA thật trên production lâu dài. Chỉ dùng tài khoản test và môi trường test.

## 9. Chạy Lighthouse

```bash
npm run test:qa:lighthouse
```

Report nằm ở:

```txt
lhci-report/
```

## 10. Visual regression optional

Mặc định visual snapshot bị skip để tránh fail ngay lần đầu chưa có baseline.

Bật bằng:

```bash
QA_ENABLE_VISUAL=1 npm run test:qa -- tests/e2e/08-visual-snapshots-optional.spec.js
```

Windows PowerShell:

```powershell
$env:QA_ENABLE_VISUAL="1"; npm run test:qa -- tests/e2e/08-visual-snapshots-optional.spec.js
```

Lần đầu muốn tạo baseline:

```bash
QA_ENABLE_VISUAL=1 npx playwright test tests/e2e/08-visual-snapshots-optional.spec.js --update-snapshots
```

## 11. Cách đọc lỗi

Ví dụ lỗi ảnh:

```txt
BAD_COVER_IMAGE_RATIO
renderedRatio: 0.75
expected: ảnh card/banner nên gần 16:9
```

Cách hiểu: CSS đang khiến ảnh bài viết/banner bị dọc hoặc méo. Kiểm tra `aspect-ratio`, `object-fit`, wrapper ảnh trong `PostCard`, `CommunityPostCard`, `BannerCarousel`, `PostImage`.

Ví dụ lỗi màn trắng:

```txt
visibleElementCount quá thấp
textLength quá ít
```

Cách hiểu: trang có thể bị crash, lazy chunk lỗi, route direct/F5 lỗi, hoặc loading treo.

Ví dụ lỗi nút:

```txt
Ẩn danh bấm thích phải có phản hồi yêu cầu đăng nhập
```

Cách hiểu: nút có thể bấm nhưng thiếu toast/alert/modal, làm người dùng tưởng web không hoạt động.

## 12. Quy trình dùng cho team

1. Dev push code.
2. GitHub Actions chạy `npm run test:qa`.
3. Nếu fail, tải `playwright-report` artifact.
4. Chạy `npm run test:qa:summary` nếu cần report markdown.
5. Tạo task lỗi theo severity:
   - Critical: sửa ngay
   - High: sửa trong sprint hiện tại
   - Medium: đưa vào backlog gần
   - Low: gom lại polish UI

## 13. Giới hạn của bộ test

Bộ test này không thể tự biết 100% “đẹp hay xấu” theo cảm tính. Nó bắt lỗi có bằng chứng:
- sai ratio ảnh
- tràn layout
- button không feedback
- page crash
- console/API lỗi
- auth guard sai

Những lỗi thẩm mỹ như “icon xấu”, “màu chưa đẹp”, “bố cục chưa sang” vẫn cần checklist review thủ công hoặc visual baseline đã chốt.


## Ghi chú bản v3

Bản v3 đã giảm false positive khi chạy production qua Cloudflare:

- Bỏ qua request phụ của Cloudflare Zaraz/RUM: `/cdn-cgi/zaraz/*`, `/cdn-cgi/rum?`.
- Bỏ qua video request bị `ERR_ABORTED` khi Playwright reload hoặc chuyển trang.
- Không coi việc người dùng bấm `Ctrl + C` trong lúc test là lỗi web; test bị `interrupted` thì cần chạy lại nếu muốn kết quả đầy đủ.

Nếu route vẫn fail sau bản v3, đó mới có khả năng là lỗi thật: JS page error, HTTP 4xx/5xx của API chính, màn trắng, tràn layout, ảnh hỏng hoặc nút không phản hồi.
