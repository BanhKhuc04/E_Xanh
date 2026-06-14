# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 20-console-performance.spec.js >> EXANH-020 Console/Error/Basic performance >> Console không lỗi đỏ nghiêm trọng /tai-khoan
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
        - heading "Bạn cần đăng nhập để xem tài khoản." [level=1] [ref=e35]
        - paragraph [ref=e36]: Đăng nhập để xem bài đã lưu, lịch sử kiểm tra điện và quản lý hoạt động cá nhân của bạn.
        - generic [ref=e37]:
          - link "Đăng nhập" [ref=e38] [cursor=pointer]:
            - /url: /dang-nhap
          - link "Tạo tài khoản" [ref=e39] [cursor=pointer]:
            - /url: /dang-ky
    - contentinfo [ref=e40]:
      - generic [ref=e41]:
        - generic [ref=e42]:
          - img [ref=e44]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e46]:
          - link "E-XANH về trang chủ" [ref=e47] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e49]
          - paragraph [ref=e50]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e51]:
          - link "Trang chủ" [ref=e52] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e53] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e54] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e55] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e56] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e57] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e58] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e60]: © 2024 E-XANH. Made by VanhKhucDev
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