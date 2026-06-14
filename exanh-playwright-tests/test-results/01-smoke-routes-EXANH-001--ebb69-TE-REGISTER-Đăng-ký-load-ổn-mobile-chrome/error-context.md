# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-smoke-routes.spec.js >> EXANH-001 Smoke routes - route không trắng/không crash >> ROUTE-REGISTER Đăng ký load ổn
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
            - heading "Tạo tài khoản E-XANH" [level=2] [ref=e66]
            - paragraph [ref=e67]: Đăng ký để lưu bài viết, bình luận, đăng bài chia sẻ và theo dõi lịch sử kiểm tra tiền điện.
          - generic [ref=e68]:
            - link "Đăng nhập" [ref=e69] [cursor=pointer]:
              - /url: /dang-nhap
            - generic [ref=e70]: Đăng ký
          - generic [ref=e71]:
            - generic [ref=e72]:
              - generic [ref=e73]: Họ và tên
              - textbox "Họ và tên" [ref=e74]:
                - /placeholder: Nhập họ và tên
            - generic [ref=e75]:
              - generic [ref=e76]: Email
              - textbox "Email" [ref=e77]:
                - /placeholder: Nhập email của bạn
            - generic [ref=e78]:
              - generic [ref=e79]: Mật khẩu
              - textbox "Mật khẩu" [ref=e80]:
                - /placeholder: Tạo mật khẩu
            - generic [ref=e81]:
              - generic [ref=e82]: Xác nhận mật khẩu
              - textbox "Xác nhận mật khẩu" [ref=e83]:
                - /placeholder: Nhập lại mật khẩu
            - generic [ref=e84]:
              - checkbox "Tôi đồng ý với điều khoản sử dụng của E-XANH" [ref=e85]
              - generic [ref=e86]:
                - text: Tôi đồng ý với
                - link "điều khoản sử dụng" [ref=e87] [cursor=pointer]:
                  - /url: /dieu-khoan
                - text: của E-XANH
            - button "Tạo tài khoản" [ref=e88] [cursor=pointer]
          - paragraph [ref=e89]:
            - text: Đã có tài khoản?
            - link "Đăng nhập" [ref=e90] [cursor=pointer]:
              - /url: /dang-nhap
          - generic [ref=e91]:
            - strong [ref=e92]: Bảo mật thông tin
            - paragraph [ref=e93]: E-XANH cam kết bảo vệ dữ liệu cá nhân của bạn. Thông tin được mã hóa an toàn và không chia sẻ cho bên thứ ba.
    - contentinfo [ref=e94]:
      - generic [ref=e95]:
        - generic [ref=e96]:
          - img [ref=e98]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e100]:
          - link "E-XANH về trang chủ" [ref=e101] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e103]
          - paragraph [ref=e104]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e105]:
          - link "Trang chủ" [ref=e106] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e107] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e108] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e109] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e110] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e111] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e112] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e114]: © 2024 E-XANH. Made by VanhKhucDev
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