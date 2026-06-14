# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-smoke-routes.spec.js >> EXANH-001 Smoke routes - route không trắng/không crash >> ROUTE-HISTORY Lịch sử điện load ổn
- Location: tests\01-smoke-routes.spec.js:16:5

# Error details

```
Error: Có console/page error nghiêm trọng

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 4

- Array []
+ Array [
+   "Failed to load resource: the server responded with a status of 404 ()",
+   "Failed to load resource: the server responded with a status of 404 ()",
+ ]
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - button "Đóng thông báo" [ref=e4] [cursor=pointer]: ×
    - heading "E-XANH đang trong quá trình phát triển" [level=4] [ref=e5]
    - paragraph [ref=e6]: Website có thể phát sinh vấn đề, mong bạn phản hồi để nhóm phát triển cải thiện.
    - generic [ref=e7]:
      - paragraph [ref=e8]:
        - text: "Phiên bản hiện tại:"
        - strong [ref=e9]: Beta v1.1
      - paragraph [ref=e10]:
        - text: "Cập nhật gần nhất:"
        - strong [ref=e11]: 11/06/2026
      - paragraph [ref=e12]:
        - text: "Dự kiến cập nhật tiếp theo:"
        - strong [ref=e13]: Sắp cập nhật
    - button "Báo cáo lỗi" [ref=e14] [cursor=pointer]:
      - img [ref=e15]
      - text: Báo cáo lỗi
  - generic [ref=e17]:
    - banner [ref=e18]:
      - generic [ref=e19]:
        - link "E-XANH về trang chủ" [ref=e20] [cursor=pointer]:
          - /url: /
          - img "E-XANH" [ref=e22]
        - button "Mở menu" [ref=e23] [cursor=pointer]:
          - img [ref=e24]
    - main [ref=e26]:
      - generic [ref=e27]:
        - generic [ref=e28]:
          - link "Trang chủ" [ref=e29] [cursor=pointer]:
            - /url: /
          - generic [ref=e30]: ">"
          - generic [ref=e31]: Lịch sử kiểm tra
        - generic [ref=e32]:
          - generic [ref=e33]:
            - heading "Lịch sử kiểm tra tiền điện" [level=1] [ref=e34]
            - paragraph [ref=e35]: Xem lại các lần kiểm tra tiền điện, so sánh mức tiêu thụ và theo dõi chi phí hằng tháng của bạn.
            - link "Kiểm tra mới" [ref=e36] [cursor=pointer]:
              - /url: /kiem-tra-tien-dien
          - img "Minh họa lịch sử kiểm tra điện năng" [ref=e38]
        - generic [ref=e39]:
          - article [ref=e40]:
            - generic [ref=e41]: Số lần kiểm tra
            - strong [ref=e42]: "0"
          - article [ref=e43]:
            - generic [ref=e44]: Tổng điện năng gần nhất
            - strong [ref=e45]: 0 kWh
          - article [ref=e46]:
            - generic [ref=e47]: Chi phí cao nhất
            - strong [ref=e48]: 0đ
          - article [ref=e49]:
            - generic [ref=e50]: Thiết bị tốn điện nhiều nhất
            - strong [ref=e51]: Chưa có
        - generic [ref=e52]:
          - searchbox "Tìm lịch sử..." [ref=e53]
          - combobox [ref=e54]:
            - option "Tất cả thời gian" [selected]
            - option "7 ngày gần đây"
            - option "30 ngày gần đây"
          - combobox [ref=e55]:
            - option "Tất cả mức chi phí" [selected]
            - option "Dưới 400.000đ"
            - option "400.000đ – 600.000đ"
            - option "Trên 600.000đ"
          - button "Lọc lịch sử" [ref=e56] [cursor=pointer]
          - button "Làm mới" [ref=e57] [cursor=pointer]
        - generic [ref=e58]:
          - generic [ref=e59]: ⚡
          - heading "Bạn chưa có lịch sử kiểm tra tiền điện." [level=2] [ref=e60]
          - paragraph [ref=e61]: Hãy sử dụng công cụ kiểm tra tiền điện để lưu lại kết quả và theo dõi chi phí hằng tháng.
          - link "Kiểm tra tiền điện ngay" [ref=e62] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - generic [ref=e63]:
            - heading "Dữ liệu mẫu tham khảo" [level=3] [ref=e64]
            - generic [ref=e65]:
              - generic [ref=e66]: 12/06/2024
              - strong [ref=e67]: 520.000đ
            - generic [ref=e68]:
              - generic [ref=e69]: 08/06/2024
              - strong [ref=e70]: 420.000đ
            - generic [ref=e71]:
              - generic [ref=e72]: 01/06/2024
              - strong [ref=e73]: 360.000đ
    - contentinfo [ref=e74]:
      - generic [ref=e75]:
        - generic [ref=e76]:
          - img [ref=e78]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e80]:
          - link "E-XANH về trang chủ" [ref=e81] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e83]
          - paragraph [ref=e84]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e85]:
          - link "Trang chủ" [ref=e86] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e87] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e88] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e89] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e90] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e91] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e92] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e94]: © 2024 E-XANH. Made by VanhKhucDev
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | const { PUBLIC_ROUTES, ADMIN_ROUTES } = require('../data/routes');
  3  | const {
  4  |   collectPageErrors,
  5  |   gotoAndReady,
  6  |   expectNoBlankPage,
  7  |   expectNoCriticalText,
  8  |   expectNoErrorPage,
  9  |   expectNoHorizontalOverflow,
  10 |   expectImagesHealthy,
  11 |   assertClickablesNotEmpty
  12 | } = require('../utils/test-utils');
  13 | 
  14 | test.describe('EXANH-001 Smoke routes - route không trắng/không crash', () => {
  15 |   for (const route of PUBLIC_ROUTES) {
  16 |     test(`${route.id} ${route.name} load ổn`, async ({ page }) => {
  17 |       const errors = collectPageErrors(page);
  18 |       await gotoAndReady(page, route.path);
  19 |       await expectNoBlankPage(page);
  20 |       await expectNoErrorPage(page, route.authRelated);
  21 |       await expectNoCriticalText(page);
  22 |       await expectNoHorizontalOverflow(page);
  23 |       await expectImagesHealthy(page);
  24 |       await assertClickablesNotEmpty(page, route.path === '/' ? 3 : 1);
> 25 |       expect(errors, 'Có console/page error nghiêm trọng').toEqual([]);
     |                                                            ^ Error: Có console/page error nghiêm trọng
  26 |     });
  27 |   }
  28 | 
  29 |   for (const route of ADMIN_ROUTES) {
  30 |     test(`${route.id} ${route.name} không crash khi truy cập trực tiếp`, async ({ page }) => {
  31 |       const errors = collectPageErrors(page);
  32 |       await gotoAndReady(page, route.path);
  33 |       await expectNoBlankPage(page);
  34 |       await expectNoErrorPage(page, true);
  35 |       await expectNoCriticalText(page);
  36 |       await expectNoHorizontalOverflow(page);
  37 |       expect(errors, 'Admin route có console/page error nghiêm trọng').toEqual([]);
  38 |     });
  39 |   }
  40 | 
  41 |   test('EX-DEP-REFRESH Refresh route con không 404', async ({ page }) => {
  42 |     await gotoAndReady(page, '/cong-dong');
  43 |     await page.reload({ waitUntil: 'domcontentloaded' });
  44 |     await page.waitForLoadState('networkidle').catch(() => {});
  45 |     await expectNoBlankPage(page);
  46 |     await expectNoErrorPage(page);
  47 |   });
  48 | });
  49 | 
```