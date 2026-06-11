# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-navigation.spec.js >> EXANH-002 Global Navigation - navbar/footer/link >> Menu chuyển đúng route: /bài đã lưu|đã lưu/i
- Location: tests\02-navigation.spec.js:14:5

# Error details

```
Error: Menu /bài đã lưu|đã lưu/i không chuyển đúng route

expect(received).toContain(expected) // indexOf

Expected substring: "/bai-da-luu"
Received string:    "http://localhost:5173/dang-nhap"
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
          - img "E-XANH" [ref=e21]
        - button "Mở menu" [ref=e22] [cursor=pointer]:
          - img [ref=e23]
        - navigation "Điều hướng người dùng" [ref=e25]:
          - link "Trang chủ" [ref=e26] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e27] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e28] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e29] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Bài đã lưu" [active] [ref=e30] [cursor=pointer]:
            - /url: /bai-da-luu
        - generic [ref=e31]:
          - link "Đăng nhập" [ref=e32] [cursor=pointer]:
            - /url: /dang-nhap
          - link "Đăng bài" [ref=e33] [cursor=pointer]:
            - /url: /dang-bai
    - main [ref=e34]:
      - generic [ref=e36]:
        - generic [ref=e37]:
          - generic [ref=e38]:
            - generic [ref=e39]:
              - link "E-XANH về trang chủ" [ref=e41] [cursor=pointer]:
                - /url: /
                - img "E-XANH" [ref=e42]
              - generic [ref=e43]: Cộng đồng sống xanh
            - generic [ref=e44]:
              - heading "Tham gia E-XANH để sống xanh hơn mỗi ngày" [level=1] [ref=e45]:
                - text: Tham gia E-XANH
                - text: để sống xanh hơn
                - text: mỗi ngày
              - paragraph [ref=e46]: Một tài khoản E-XANH giúp bạn lưu bài viết, tham gia cộng đồng và theo dõi thói quen sử dụng điện cá nhân.
              - generic [ref=e47]:
                - generic [ref=e48]: Lưu bài viết
                - generic [ref=e49]: •
                - generic [ref=e50]: Bình luận
                - generic [ref=e51]: •
                - generic [ref=e52]: Theo dõi điện năng
          - generic [ref=e54]:
            - img "banner_cropped.jpeg" [ref=e56]
            - img "banner_cropped.jpeg" [ref=e58]
            - img "banner_cropped.jpeg" [ref=e60]
            - generic [ref=e61]:
              - button "Go to slide 1" [ref=e62] [cursor=pointer]
              - button "Go to slide 2" [ref=e63] [cursor=pointer]
              - button "Go to slide 3" [ref=e64] [cursor=pointer]
        - generic [ref=e65]:
          - generic [ref=e66]:
            - heading "Chào mừng trở lại" [level=2] [ref=e67]
            - paragraph [ref=e68]: Đăng nhập để tiếp tục hành trình sống xanh cùng E-XANH.
          - generic [ref=e69]:
            - generic [ref=e70]: Đăng nhập
            - link "Đăng ký" [ref=e71] [cursor=pointer]:
              - /url: /dang-ky
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
              - button "Quên mật khẩu?" [ref=e83] [cursor=pointer]
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
          - link "E-XANH về trang chủ" [ref=e93] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e94]
          - paragraph [ref=e95]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e96]:
          - link "Trang chủ" [ref=e97] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e98] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e99] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e100] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e101] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e102] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e103] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e105]: © 2024 E-XANH. Made by VanhKhucDev
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | const { NAV_ITEMS } = require('../data/routes');
  3  | const { gotoAndReady, clickByAny, expectNoBlankPage, expectNoHorizontalOverflow } = require('../utils/test-utils');
  4  | 
  5  | test.describe('EXANH-002 Global Navigation - navbar/footer/link', () => {
  6  |   test('EX-001 Logo E-XANH bấm về trang chủ', async ({ page }) => {
  7  |     await gotoAndReady(page, '/cong-dong');
  8  |     const clicked = await clickByAny(page, [/e-xanh/i, /exanh/i, /logo/i]);
  9  |     expect(clicked, 'Không tìm thấy logo hoặc text E-XANH để click').toBeTruthy();
  10 |     await expect(page).toHaveURL(/\/$|\/home$/);
  11 |   });
  12 | 
  13 |   for (const item of NAV_ITEMS) {
  14 |     test(`Menu chuyển đúng route: ${String(item.text)}`, async ({ page }) => {
  15 |       await gotoAndReady(page, '/');
  16 |       const clicked = await clickByAny(page, [item.text]);
  17 |       if (item.optional && !clicked) test.skip(true, 'Menu optional không có trên UI');
  18 |       expect(clicked, `Không tìm thấy menu ${item.text}`).toBeTruthy();
  19 |       await page.waitForLoadState('domcontentloaded').catch(() => {});
  20 |       await expectNoBlankPage(page);
> 21 |       expect(page.url(), `Menu ${item.text} không chuyển đúng route`).toContain(item.expectedPath);
     |                                                                       ^ Error: Menu /bài đã lưu|đã lưu/i không chuyển đúng route
  22 |     });
  23 |   }
  24 | 
  25 |   test('EX-008 Mobile hamburger mở/đóng được', async ({ page }) => {
  26 |     await page.setViewportSize({ width: 390, height: 844 });
  27 |     await gotoAndReady(page, '/');
  28 |     const possibleButtons = [
  29 |       page.getByRole('button', { name: /menu|mở|hamburger|☰/i }).first(),
  30 |       page.locator('button[aria-label*="menu" i]').first(),
  31 |       page.locator('.hamburger, .menu-toggle, .navbar-toggler').first(),
  32 |       page.locator('button').first()
  33 |     ];
  34 |     let clicked = false;
  35 |     for (const btn of possibleButtons) {
  36 |       if (await btn.count() && await btn.isVisible().catch(() => false)) {
  37 |         await btn.click();
  38 |         clicked = true;
  39 |         break;
  40 |       }
  41 |     }
  42 |     expect(clicked, 'Mobile không có nút hamburger/menu rõ ràng').toBeTruthy();
  43 |     await expectNoHorizontalOverflow(page);
  44 |   });
  45 | 
  46 |   test('EX-014 Footer có link chính và không lỗi 404', async ({ page }) => {
  47 |     await gotoAndReady(page, '/');
  48 |     const footer = page.locator('footer').first();
  49 |     await expect(footer, 'Không tìm thấy footer').toBeVisible();
  50 |     const links = await footer.locator('a').count();
  51 |     expect(links, 'Footer nên có ít nhất 2 link').toBeGreaterThanOrEqual(2);
  52 |   });
  53 | });
  54 | 
```