# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-smoke-routes.spec.js >> EXANH-001 Smoke routes - route không trắng/không crash >> ROUTE-ABOUT Về chúng tôi load ổn
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
          - generic [ref=e31]: Về chúng tôi
        - generic [ref=e32]:
          - generic [ref=e33]:
            - generic [ref=e34]: Về E-XANH
            - generic [ref=e35]:
              - heading "E-XANH là gì?" [level=1] [ref=e36]
              - paragraph [ref=e37]: E-XANH là nền tảng giúp người trẻ sử dụng điện thông minh hơn, tiết kiệm chi phí hằng tháng và lan tỏa lối sống xanh trong cộng đồng.
            - link "Khám phá mẹo tiết kiệm" [ref=e39] [cursor=pointer]:
              - /url: /meo-tiet-kiem
            - link "E-XANH về trang chủ" [ref=e41] [cursor=pointer]:
              - /url: /
              - img "E-XANH" [ref=e43]
          - img "Minh họa nền tảng E-XANH" [ref=e45]
        - generic [ref=e46]:
          - heading "Sứ mệnh của E-XANH" [level=2] [ref=e47]
          - paragraph [ref=e48]: Chúng tôi mong muốn biến việc tiết kiệm điện trở thành một thói quen đơn giản, dễ thực hiện và gần gũi với đời sống hằng ngày.
        - generic [ref=e49]:
          - heading "E-XANH giúp bạn làm gì?" [level=2] [ref=e51]
          - generic [ref=e52]:
            - article [ref=e53]:
              - heading "Đọc mẹo tiết kiệm điện" [level=3] [ref=e54]
              - paragraph [ref=e55]: Cập nhật những cách sử dụng điện hiệu quả, tiết kiệm chi phí mỗi ngày.
            - article [ref=e56]:
              - heading "Kiểm tra tiền điện" [level=3] [ref=e57]
              - paragraph [ref=e58]: Công cụ tính toán và dự báo chi phí điện dựa trên thói quen sử dụng của bạn.
            - article [ref=e59]:
              - heading "Chia sẻ kinh nghiệm" [level=3] [ref=e60]
              - paragraph [ref=e61]: Kết nối với cộng đồng, lan tỏa những câu chuyện sống xanh thiết thực.
            - article [ref=e62]:
              - heading "Lưu nội dung hữu ích" [level=3] [ref=e63]
              - paragraph [ref=e64]: Dễ dàng lưu trữ và tìm lại những bài viết, mẹo vặt hữu ích khi cần.
        - generic [ref=e65]:
          - heading "Giá trị cốt lõi" [level=2] [ref=e67]
          - generic [ref=e68]:
            - article [ref=e69]:
              - strong [ref=e70]: Thông minh
            - article [ref=e71]:
              - strong [ref=e72]: Tiết kiệm
            - article [ref=e73]:
              - strong [ref=e74]: Bền vững
        - generic [ref=e75]:
          - heading "Bắt đầu sống xanh từ những thay đổi nhỏ" [level=2] [ref=e76]
          - generic [ref=e77]:
            - link "Khám phá mẹo tiết kiệm" [ref=e78] [cursor=pointer]:
              - /url: /meo-tiet-kiem
            - link "Kiểm tra tiền điện ngay" [ref=e79] [cursor=pointer]:
              - /url: /kiem-tra-tien-dien
    - contentinfo [ref=e80]:
      - generic [ref=e81]:
        - generic [ref=e82]:
          - img [ref=e84]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e86]:
          - link "E-XANH về trang chủ" [ref=e87] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e89]
          - paragraph [ref=e90]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e91]:
          - link "Trang chủ" [ref=e92] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e93] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e94] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e95] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e96] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e97] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e98] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e100]: © 2024 E-XANH. Made by VanhKhucDev
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