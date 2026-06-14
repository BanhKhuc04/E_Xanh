# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-smoke-routes.spec.js >> EXANH-001 Smoke routes - route không trắng/không crash >> ROUTE-CONTACT Liên hệ load ổn
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
        - navigation "Điều hướng người dùng" [ref=e23]:
          - link "Trang chủ" [ref=e24] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e25] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e26] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e27] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Bài đã lưu" [ref=e28] [cursor=pointer]:
            - /url: /bai-da-luu
        - generic [ref=e29]:
          - link "Đăng nhập" [ref=e30] [cursor=pointer]:
            - /url: /dang-nhap
          - button "Đăng bài" [ref=e31] [cursor=pointer]
    - main [ref=e32]:
      - generic [ref=e33]:
        - generic [ref=e34]:
          - link "Trang chủ" [ref=e35] [cursor=pointer]:
            - /url: /
          - generic [ref=e36]: ">"
          - generic [ref=e37]: Liên hệ
        - generic [ref=e39]:
          - heading "Liên hệ với E-XANH" [level=1] [ref=e40]
          - paragraph [ref=e41]: Bạn có câu hỏi, góp ý hoặc muốn hợp tác cùng E-XANH? Hãy gửi thông tin cho chúng tôi.
        - generic [ref=e42]:
          - generic [ref=e43]:
            - heading "Gửi tin nhắn cho chúng tôi" [level=2] [ref=e44]
            - generic [ref=e45]:
              - generic [ref=e46]:
                - generic [ref=e47]:
                  - generic [ref=e48]: Họ và tên
                  - textbox "Họ và tên" [ref=e49]:
                    - /placeholder: Nhập họ và tên của bạn
                - generic [ref=e50]:
                  - generic [ref=e51]: Email
                  - textbox "Email" [ref=e52]:
                    - /placeholder: "Ví dụ: email@domain.com"
              - generic [ref=e53]:
                - generic [ref=e54]: Chủ đề
                - combobox "Chủ đề" [ref=e55]:
                  - option "Góp ý giao diện" [selected]
                  - option "Báo lỗi hệ thống"
                  - option "Hợp tác truyền thông"
                  - option "Hỗ trợ tài khoản"
                  - option "Khác"
              - generic [ref=e56]:
                - generic [ref=e57]: Nội dung tin nhắn
                - textbox "Nội dung tin nhắn" [ref=e58]:
                  - /placeholder: Nhập nội dung chi tiết...
              - generic [ref=e59]:
                - generic [ref=e60]: Chúng tôi thường phản hồi trong vòng 24h
                - button "Gửi tin nhắn" [ref=e61] [cursor=pointer]
          - generic [ref=e62]:
            - generic [ref=e63]:
              - heading "Thông tin hỗ trợ" [level=2] [ref=e64]
              - generic [ref=e65]:
                - generic [ref=e66]:
                  - generic [ref=e67]: Email
                  - strong [ref=e68]: support@exanh.vn
                - generic [ref=e69]:
                  - generic [ref=e70]: Khu vực
                  - strong [ref=e71]: Hà Nội, Việt Nam
                - generic [ref=e72]:
                  - generic [ref=e73]: Thời gian hỗ trợ
                  - strong [ref=e74]: 08:00 – 18:00
                - generic [ref=e75]:
                  - generic [ref=e76]: Kênh cộng đồng
                  - strong [ref=e77]: Facebook, TikTok
            - generic [ref=e78]:
              - heading "Câu hỏi thường gặp" [level=2] [ref=e79]
              - generic [ref=e80]:
                - article [ref=e81]: Tôi có cần đăng nhập để kiểm tra tiền điện không?
                - article [ref=e82]: Kết quả tính tiền điện có chính xác tuyệt đối không?
                - article [ref=e83]: Tôi có thể đăng bài chia sẻ mẹo tiết kiệm điện không?
        - generic [ref=e84]:
          - heading "Cùng E-XANH lan tỏa thói quen dùng điện thông minh" [level=2] [ref=e85]
          - generic [ref=e86]:
            - link "Tham gia cộng đồng" [ref=e87] [cursor=pointer]:
              - /url: /cong-dong
            - link "Đăng bài chia sẻ" [ref=e88] [cursor=pointer]:
              - /url: /dang-bai
    - contentinfo [ref=e89]:
      - generic [ref=e90]:
        - generic [ref=e91]:
          - img [ref=e93]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e95]:
          - link "E-XANH về trang chủ" [ref=e96] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e98]
          - paragraph [ref=e99]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e100]:
          - link "Trang chủ" [ref=e101] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e102] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e103] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e104] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e105] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e106] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e107] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e109]: © 2024 E-XANH. Made by VanhKhucDev
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