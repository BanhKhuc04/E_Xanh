# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-smoke-routes.spec.js >> EXANH-001 Smoke routes - route không trắng/không crash >> ROUTE-CREATE Đăng bài load ổn
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
      - generic [ref=e28]:
        - generic [ref=e29]:
          - generic [ref=e30]:
            - generic [ref=e31]:
              - link "E-XANH về trang chủ" [ref=e33] [cursor=pointer]:
                - /url: /
                - img "E-XANH" [ref=e35]
              - generic [ref=e36]: Cộng đồng sống xanh
            - generic [ref=e37]:
              - heading "Tham gia E-XANH để sống xanh hơn mỗi ngày" [level=1] [ref=e38]:
                - text: Tham gia E-XANH
                - text: để sống xanh hơn
                - text: mỗi ngày
              - paragraph [ref=e39]: Một tài khoản E-XANH giúp bạn lưu bài viết, tham gia cộng đồng và theo dõi thói quen sử dụng điện cá nhân.
              - generic [ref=e40]:
                - generic [ref=e41]: Lưu bài viết
                - generic [ref=e42]: •
                - generic [ref=e43]: Bình luận
                - generic [ref=e44]: •
                - generic [ref=e45]: Theo dõi điện năng
          - generic [ref=e47]:
            - img "banner_cropped.jpeg" [ref=e50]
            - img "auth-hero.jpeg" [ref=e53]
            - img "auth-hero.jpeg" [ref=e56]
            - generic [ref=e57]:
              - button "Go to slide 1" [ref=e58] [cursor=pointer]
              - button "Go to slide 2" [ref=e60] [cursor=pointer]
              - button "Go to slide 3" [ref=e62] [cursor=pointer]
        - generic [ref=e64]:
          - generic [ref=e65]:
            - heading "Chào mừng trở lại" [level=2] [ref=e66]
            - paragraph [ref=e67]: Đăng nhập để tiếp tục hành trình sống xanh cùng E-XANH.
          - generic [ref=e68]:
            - generic [ref=e69]: Đăng nhập
            - link "Đăng ký" [ref=e70] [cursor=pointer]:
              - /url: /dang-ky
          - alert [ref=e71]: Vui lòng đăng nhập để đăng bài
          - generic [ref=e72]:
            - generic [ref=e73]:
              - generic [ref=e74]: Email
              - textbox "Email" [ref=e75]:
                - /placeholder: Nhập email của bạn
            - generic [ref=e76]:
              - generic [ref=e77]: Mật khẩu
              - textbox "Mật khẩu" [ref=e78]:
                - /placeholder: Nhập mật khẩu
            - generic [ref=e79]:
              - generic [ref=e80]:
                - checkbox "Ghi nhớ đăng nhập" [ref=e81]
                - generic [ref=e82]: Ghi nhớ đăng nhập
              - button "Quên mật khẩu?" [disabled] [ref=e83] [cursor=pointer]
            - button "Đăng nhập" [ref=e84] [cursor=pointer]
          - paragraph [ref=e85]:
            - text: Chưa có tài khoản?
            - link "Tạo tài khoản ngay" [ref=e86] [cursor=pointer]:
              - /url: /dang-ky
          - generic [ref=e87]:
            - strong [ref=e88]: Bảo mật thông tin
            - paragraph [ref=e89]: Khách chưa đăng nhập vẫn có thể xem bài viết và tính tiền điện. Đăng nhập giúp bạn lưu lại dữ liệu cá nhân hóa.
    - contentinfo [ref=e90]:
      - generic [ref=e91]:
        - generic [ref=e92]:
          - img [ref=e94]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e96]:
          - link "E-XANH về trang chủ" [ref=e97] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e99]
          - paragraph [ref=e100]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e101]:
          - link "Trang chủ" [ref=e102] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e103] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e104] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e105] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e106] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e107] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e108] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e110]: © 2024 E-XANH. Made by VanhKhucDev
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