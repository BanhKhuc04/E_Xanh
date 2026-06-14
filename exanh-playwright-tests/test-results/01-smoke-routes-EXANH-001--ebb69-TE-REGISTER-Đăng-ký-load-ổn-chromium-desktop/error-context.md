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
      - generic [ref=e34]:
        - generic [ref=e35]:
          - generic [ref=e36]:
            - generic [ref=e37]:
              - link "E-XANH về trang chủ" [ref=e39] [cursor=pointer]:
                - /url: /
                - img "E-XANH" [ref=e41]
              - generic [ref=e42]: Cộng đồng sống xanh
            - generic [ref=e43]:
              - heading "Tham gia E-XANH để sống xanh hơn mỗi ngày" [level=1] [ref=e44]:
                - text: Tham gia E-XANH
                - text: để sống xanh hơn
                - text: mỗi ngày
              - paragraph [ref=e45]: Một tài khoản E-XANH giúp bạn lưu bài viết, tham gia cộng đồng và theo dõi thói quen sử dụng điện cá nhân.
              - generic [ref=e46]:
                - generic [ref=e47]: Lưu bài viết
                - generic [ref=e48]: •
                - generic [ref=e49]: Bình luận
                - generic [ref=e50]: •
                - generic [ref=e51]: Theo dõi điện năng
          - generic [ref=e53]:
            - img "banner_cropped.jpeg" [ref=e56]
            - img "auth-hero.jpeg" [ref=e59]
            - img "auth-hero.jpeg" [ref=e62]
            - generic [ref=e63]:
              - button "Go to slide 1" [ref=e64] [cursor=pointer]
              - button "Go to slide 2" [ref=e66] [cursor=pointer]
              - button "Go to slide 3" [ref=e68] [cursor=pointer]
        - generic [ref=e70]:
          - generic [ref=e71]:
            - heading "Tạo tài khoản E-XANH" [level=2] [ref=e72]
            - paragraph [ref=e73]: Đăng ký để lưu bài viết, bình luận, đăng bài chia sẻ và theo dõi lịch sử kiểm tra tiền điện.
          - generic [ref=e74]:
            - link "Đăng nhập" [ref=e75] [cursor=pointer]:
              - /url: /dang-nhap
            - generic [ref=e76]: Đăng ký
          - generic [ref=e77]:
            - generic [ref=e78]:
              - generic [ref=e79]: Họ và tên
              - textbox "Họ và tên" [ref=e80]:
                - /placeholder: Nhập họ và tên
            - generic [ref=e81]:
              - generic [ref=e82]: Email
              - textbox "Email" [ref=e83]:
                - /placeholder: Nhập email của bạn
            - generic [ref=e84]:
              - generic [ref=e85]: Mật khẩu
              - textbox "Mật khẩu" [ref=e86]:
                - /placeholder: Tạo mật khẩu
            - generic [ref=e87]:
              - generic [ref=e88]: Xác nhận mật khẩu
              - textbox "Xác nhận mật khẩu" [ref=e89]:
                - /placeholder: Nhập lại mật khẩu
            - generic [ref=e90]:
              - checkbox "Tôi đồng ý với điều khoản sử dụng của E-XANH" [ref=e91]
              - generic [ref=e92]:
                - text: Tôi đồng ý với
                - link "điều khoản sử dụng" [ref=e93] [cursor=pointer]:
                  - /url: /dieu-khoan
                - text: của E-XANH
            - button "Tạo tài khoản" [ref=e94] [cursor=pointer]
          - paragraph [ref=e95]:
            - text: Đã có tài khoản?
            - link "Đăng nhập" [ref=e96] [cursor=pointer]:
              - /url: /dang-nhap
          - generic [ref=e97]:
            - strong [ref=e98]: Bảo mật thông tin
            - paragraph [ref=e99]: E-XANH cam kết bảo vệ dữ liệu cá nhân của bạn. Thông tin được mã hóa an toàn và không chia sẻ cho bên thứ ba.
    - contentinfo [ref=e100]:
      - generic [ref=e101]:
        - generic [ref=e102]:
          - img [ref=e104]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e106]:
          - link "E-XANH về trang chủ" [ref=e107] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e109]
          - paragraph [ref=e110]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e111]:
          - link "Trang chủ" [ref=e112] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e113] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e114] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e115] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e116] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e117] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e118] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e120]: © 2024 E-XANH. Made by VanhKhucDev
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