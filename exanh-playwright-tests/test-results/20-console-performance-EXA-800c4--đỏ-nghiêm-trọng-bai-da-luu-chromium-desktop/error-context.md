# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 20-console-performance.spec.js >> EXANH-020 Console/Error/Basic performance >> Console không lỗi đỏ nghiêm trọng /bai-da-luu
- Location: tests\20-console-performance.spec.js:7:5

# Error details

```
Error: Console/page errors nghiêm trọng

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
            - heading "Chào mừng trở lại" [level=2] [ref=e72]
            - paragraph [ref=e73]: Đăng nhập để tiếp tục hành trình sống xanh cùng E-XANH.
          - generic [ref=e74]:
            - generic [ref=e75]: Đăng nhập
            - link "Đăng ký" [ref=e76] [cursor=pointer]:
              - /url: /dang-ky
          - alert [ref=e77]: Vui lòng đăng nhập để xem trang này.
          - generic [ref=e78]:
            - generic [ref=e79]:
              - generic [ref=e80]: Email
              - textbox "Email" [ref=e81]:
                - /placeholder: Nhập email của bạn
            - generic [ref=e82]:
              - generic [ref=e83]: Mật khẩu
              - textbox "Mật khẩu" [ref=e84]:
                - /placeholder: Nhập mật khẩu
            - generic [ref=e85]:
              - generic [ref=e86]:
                - checkbox "Ghi nhớ đăng nhập" [ref=e87]
                - generic [ref=e88]: Ghi nhớ đăng nhập
              - button "Quên mật khẩu?" [disabled] [ref=e89] [cursor=pointer]
            - button "Đăng nhập" [ref=e90] [cursor=pointer]
          - paragraph [ref=e91]:
            - text: Chưa có tài khoản?
            - link "Tạo tài khoản ngay" [ref=e92] [cursor=pointer]:
              - /url: /dang-ky
          - generic [ref=e93]:
            - strong [ref=e94]: Bảo mật thông tin
            - paragraph [ref=e95]: Khách chưa đăng nhập vẫn có thể xem bài viết và tính tiền điện. Đăng nhập giúp bạn lưu lại dữ liệu cá nhân hóa.
    - contentinfo [ref=e96]:
      - generic [ref=e97]:
        - generic [ref=e98]:
          - img [ref=e100]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e102]:
          - link "E-XANH về trang chủ" [ref=e103] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e105]
          - paragraph [ref=e106]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e107]:
          - link "Trang chủ" [ref=e108] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e109] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e110] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e111] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e112] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e113] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e114] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e116]: © 2024 E-XANH. Made by VanhKhucDev
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | const { PUBLIC_ROUTES } = require('../data/routes');
  3  | const { collectPageErrors, gotoAndReady, expectNoBlankPage } = require('../utils/test-utils');
  4  | 
  5  | test.describe('EXANH-020 Console/Error/Basic performance', () => {
  6  |   for (const route of PUBLIC_ROUTES) {
  7  |     test(`Console không lỗi đỏ nghiêm trọng ${route.path}`, async ({ page }) => {
  8  |       const errors = collectPageErrors(page);
  9  |       await gotoAndReady(page, route.path);
  10 |       await expectNoBlankPage(page);
> 11 |       expect(errors, 'Console/page errors nghiêm trọng').toEqual([]);
     |                                                          ^ Error: Console/page errors nghiêm trọng
  12 |     });
  13 |   }
  14 | 
  15 |   test('Home DOMContentLoaded trong mức hợp lý', async ({ page }) => {
  16 |     const start = Date.now();
  17 |     await gotoAndReady(page, '/');
  18 |     const duration = Date.now() - start;
  19 |     expect(duration, `Trang chủ load quá lâu: ${duration}ms`).toBeLessThan(10_000);
  20 |   });
  21 | });
  22 | 
```