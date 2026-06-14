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
        - button "Mở menu" [ref=e23] [cursor=pointer]:
          - img [ref=e24]
    - main [ref=e26]:
      - generic [ref=e27]:
        - generic [ref=e28]:
          - link "Trang chủ" [ref=e29] [cursor=pointer]:
            - /url: /
          - generic [ref=e30]: ">"
          - generic [ref=e31]: Liên hệ
        - generic [ref=e33]:
          - heading "Liên hệ với E-XANH" [level=1] [ref=e34]
          - paragraph [ref=e35]: Bạn có câu hỏi, góp ý hoặc muốn hợp tác cùng E-XANH? Hãy gửi thông tin cho chúng tôi.
        - generic [ref=e36]:
          - generic [ref=e37]:
            - heading "Gửi tin nhắn cho chúng tôi" [level=2] [ref=e38]
            - generic [ref=e39]:
              - generic [ref=e40]:
                - generic [ref=e41]:
                  - generic [ref=e42]: Họ và tên
                  - textbox "Họ và tên" [ref=e43]:
                    - /placeholder: Nhập họ và tên của bạn
                - generic [ref=e44]:
                  - generic [ref=e45]: Email
                  - textbox "Email" [ref=e46]:
                    - /placeholder: "Ví dụ: email@domain.com"
              - generic [ref=e47]:
                - generic [ref=e48]: Chủ đề
                - combobox "Chủ đề" [ref=e49]:
                  - option "Góp ý giao diện" [selected]
                  - option "Báo lỗi hệ thống"
                  - option "Hợp tác truyền thông"
                  - option "Hỗ trợ tài khoản"
                  - option "Khác"
              - generic [ref=e50]:
                - generic [ref=e51]: Nội dung tin nhắn
                - textbox "Nội dung tin nhắn" [ref=e52]:
                  - /placeholder: Nhập nội dung chi tiết...
              - generic [ref=e53]:
                - generic [ref=e54]: Chúng tôi thường phản hồi trong vòng 24h
                - button "Gửi tin nhắn" [ref=e55] [cursor=pointer]
          - generic [ref=e56]:
            - generic [ref=e57]:
              - heading "Thông tin hỗ trợ" [level=2] [ref=e58]
              - generic [ref=e59]:
                - generic [ref=e60]:
                  - generic [ref=e61]: Email
                  - strong [ref=e62]: support@exanh.vn
                - generic [ref=e63]:
                  - generic [ref=e64]: Khu vực
                  - strong [ref=e65]: Hà Nội, Việt Nam
                - generic [ref=e66]:
                  - generic [ref=e67]: Thời gian hỗ trợ
                  - strong [ref=e68]: 08:00 – 18:00
                - generic [ref=e69]:
                  - generic [ref=e70]: Kênh cộng đồng
                  - strong [ref=e71]: Facebook, TikTok
            - generic [ref=e72]:
              - heading "Câu hỏi thường gặp" [level=2] [ref=e73]
              - generic [ref=e74]:
                - article [ref=e75]: Tôi có cần đăng nhập để kiểm tra tiền điện không?
                - article [ref=e76]: Kết quả tính tiền điện có chính xác tuyệt đối không?
                - article [ref=e77]: Tôi có thể đăng bài chia sẻ mẹo tiết kiệm điện không?
        - generic [ref=e78]:
          - heading "Cùng E-XANH lan tỏa thói quen dùng điện thông minh" [level=2] [ref=e79]
          - generic [ref=e80]:
            - link "Tham gia cộng đồng" [ref=e81] [cursor=pointer]:
              - /url: /cong-dong
            - link "Đăng bài chia sẻ" [ref=e82] [cursor=pointer]:
              - /url: /dang-bai
    - contentinfo [ref=e83]:
      - generic [ref=e84]:
        - generic [ref=e85]:
          - img [ref=e87]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e89]:
          - link "E-XANH về trang chủ" [ref=e90] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e92]
          - paragraph [ref=e93]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e94]:
          - link "Trang chủ" [ref=e95] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e96] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e97] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e98] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e99] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e100] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e101] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e103]: © 2024 E-XANH. Made by VanhKhucDev
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