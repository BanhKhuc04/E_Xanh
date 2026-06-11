# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-navigation.spec.js >> EXANH-002 Global Navigation - navbar/footer/link >> Menu chuyển đúng route: /trang chủ|home/i
- Location: tests\02-navigation.spec.js:14:5

# Error details

```
Error: Không tìm thấy menu /trang chủ|home/i

expect(received).toBeTruthy()

Received: false
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
    - main [ref=e25]:
      - generic [ref=e26]:
        - generic [ref=e28]:
          - generic [ref=e29]:
            - generic [ref=e30]: Nền tảng sống xanh cho sinh viên
            - heading "Dùng điện thông minh, sống xanh bền vững" [level=1] [ref=e32]:
              - text: Dùng điện thông minh,
              - generic [ref=e33]: sống xanh bền vững
            - paragraph [ref=e34]: Khám phá mẹo tiết kiệm điện, chia sẻ kinh nghiệm hữu ích và ước tính chi phí điện mỗi tháng cùng cộng đồng E-XANH.
            - generic [ref=e35]:
              - link "Khám phá mẹo tiết kiệm" [ref=e36] [cursor=pointer]:
                - /url: /meo-tiet-kiem
              - link "Kiểm tra tiền điện" [ref=e37] [cursor=pointer]:
                - /url: /kiem-tra-tien-dien
            - generic [ref=e38]:
              - generic [ref=e39]:
                - strong [ref=e40]: 120+
                - generic [ref=e41]: Bài viết
              - generic [ref=e42]:
                - strong [ref=e43]: 2.4K
                - generic [ref=e44]: Tương tác
              - generic [ref=e45]:
                - strong [ref=e46]: "850"
                - generic [ref=e47]: Lưu bài
          - generic [ref=e48]:
            - generic [ref=e49]:
              - generic:
                - img "banner_cropped.jpeg" [ref=e50]
                - img "banner_cropped.jpeg" [ref=e51]
                - img "banner_cropped.jpeg" [ref=e52]
                - generic:
                  - button "Go to slide 1"
                  - button "Go to slide 2"
                  - button "Go to slide 3"
            - generic [ref=e53]:
              - generic [ref=e54]: Tiết kiệm dự kiến
              - strong [ref=e55]: 420.000đ
              - generic [ref=e56]: /tháng
            - generic [ref=e57]:
              - generic [ref=e58]: Tốn điện nhất
              - strong [ref=e59]: Điều hòa nhiệt độ
            - generic [ref=e60]:
              - generic [ref=e61]: Mẹo hay
              - paragraph [ref=e62]: Đặt điều hòa 26–28°C kết hợp quạt gió
        - generic [ref=e64]:
          - article [ref=e65]:
            - img [ref=e67]
            - heading "Đọc mẹo tiết kiệm" [level=2] [ref=e69]
            - paragraph [ref=e70]: Khám phá những cách dùng điện thông minh, hiệu quả từ chuyên gia và cộng đồng sinh viên.
            - link "Khám phá" [ref=e71] [cursor=pointer]:
              - /url: /meo-tiet-kiem
          - article [ref=e72]:
            - img [ref=e74]
            - heading "Cộng đồng chia sẻ" [level=2] [ref=e79]
            - paragraph [ref=e80]: Đọc kinh nghiệm thực tế, hỏi đáp và chia sẻ bí quyết tiết kiệm với những người bạn đồng trang lứa.
            - link "Khám phá" [ref=e81] [cursor=pointer]:
              - /url: /cong-dong
          - article [ref=e82]:
            - img [ref=e84]
            - heading "Kiểm tra tiền điện" [level=2] [ref=e86]
            - paragraph [ref=e87]: Công cụ ước tính chi phí điện sinh hoạt nhanh chóng, giúp bạn kiểm soát ngân sách hiệu quả.
            - link "Khám phá" [ref=e88] [cursor=pointer]:
              - /url: /kiem-tra-tien-dien
        - generic [ref=e90]:
          - generic [ref=e91]:
            - generic [ref=e92]: Góc kiểm tra tiền điện
            - heading "Ước tính chi phí điện hằng tháng" [level=2] [ref=e93]
            - paragraph [ref=e94]: Nhập thông tin các thiết bị điện đang sử dụng để ước tính số tiền điện bạn phải trả. Giúp bạn lên kế hoạch chi tiêu hợp lý hơn.
            - link "Ước tính ngay" [ref=e95] [cursor=pointer]:
              - /url: /kiem-tra-tien-dien
          - generic [ref=e96]:
            - generic [ref=e97]:
              - strong [ref=e98]: Mô phỏng nhanh
              - generic [ref=e99]: Ví dụ
            - generic [ref=e100]:
              - article [ref=e101]:
                - generic [ref=e102]: AC
                - generic [ref=e103]:
                  - heading "Điều hòa 9000 BTU" [level=3] [ref=e104]
                  - paragraph [ref=e105]: 8h/ngày • 30 ngày
                - strong [ref=e106]: ~420.000đ
              - article [ref=e107]:
                - generic [ref=e108]: TL
                - generic [ref=e109]:
                  - heading "Tủ lạnh 150L" [level=3] [ref=e110]
                  - paragraph [ref=e111]: 24h/ngày • 30 ngày
                - strong [ref=e112]: ~150.000đ
            - generic [ref=e113]:
              - generic [ref=e114]:
                - text: Tổng cộng dự kiến
                - strong [ref=e115]: 570.000đ
              - generic [ref=e118]: Đã đạt 65% ngân sách dự kiến (800k)
        - generic [ref=e119]:
          - generic [ref=e120]:
            - generic [ref=e121]:
              - heading "Bài viết nổi bật" [level=2] [ref=e122]
              - paragraph [ref=e123]: Những mẹo hay được cộng đồng quan tâm nhất
            - link "Xem tất cả" [ref=e124] [cursor=pointer]:
              - /url: /meo-tiet-kiem
          - generic [ref=e125]:
            - article [ref=e126] [cursor=pointer]:
              - generic [ref=e127]:
                - img "hehihihihihihihihehihihihihihihihehihihihihihihi" [ref=e128]
                - generic [ref=e129]: Cộng đồng
                - button "Lưu bài viết hehihihihihihihihehihihihihihihihehihihihihihihi" [ref=e130]: Lưu
              - generic [ref=e131]:
                - heading "hehihihihihihihihehihihihihihihihehihihihihihihi" [level=3] [ref=e132]
                - generic [ref=e133]:
                  - generic [ref=e134]: V
                  - strong [ref=e135]: vanhkhuc
                  - generic [ref=e136]: 9/6/2026
            - article [ref=e137] [cursor=pointer]:
              - generic [ref=e138]:
                - img "hehihihihihihihi" [ref=e139]
                - generic [ref=e140]: Cộng đồng
                - button "Lưu bài viết hehihihihihihihi" [ref=e141]: Lưu
              - generic [ref=e142]:
                - heading "hehihihihihihihi" [level=3] [ref=e143]
                - generic [ref=e144]:
                  - generic [ref=e145]: V
                  - strong [ref=e146]: vanhkhuc
                  - generic [ref=e147]: 9/6/2026
            - article [ref=e148] [cursor=pointer]:
              - generic [ref=e149]:
                - img "Đẹp ko ạ" [ref=e150]
                - generic [ref=e151]: Cộng đồng
                - button "Lưu bài viết Đẹp ko ạ" [ref=e152]: Lưu
              - generic [ref=e153]:
                - heading "Đẹp ko ạ" [level=3] [ref=e154]
                - generic [ref=e155]:
                  - generic [ref=e156]: V
                  - strong [ref=e157]: vanhkhuc
                  - generic [ref=e158]: 9/6/2026
        - generic [ref=e160]:
          - generic [ref=e161]:
            - generic [ref=e163]:
              - heading "Hoạt động cộng đồng" [level=2] [ref=e164]
              - paragraph [ref=e165]: Nơi trao đổi, chia sẻ và thảo luận về các vấn đề tiết kiệm năng lượng
            - generic [ref=e166]:
              - article [ref=e167]:
                - generic [ref=e168]:
                  - generic [ref=e169]:
                    - generic [ref=e170]: V
                    - generic [ref=e171]:
                      - strong [ref=e172]: vanhkhuc
                      - generic [ref=e173]: 9/6/2026
                  - generic [ref=e174]: Chia sẻ
                - paragraph [ref=e175]: hehihihihihihihihehihihihihihihi
                - generic [ref=e176]:
                  - generic [ref=e177]: 0 thích
                  - generic [ref=e178]: 0 bình luận
                  - generic [ref=e179]: Lưu bài
              - article [ref=e180]:
                - generic [ref=e181]:
                  - generic [ref=e182]:
                    - generic [ref=e183]: V
                    - generic [ref=e184]:
                      - strong [ref=e185]: vanhkhuc
                      - generic [ref=e186]: 9/6/2026
                  - generic [ref=e187]: Chia sẻ
                - paragraph [ref=e188]: hehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihi...
                - generic [ref=e189]:
                  - generic [ref=e190]: 0 thích
                  - generic [ref=e191]: 0 bình luận
                  - generic [ref=e192]: Lưu bài
              - article [ref=e193]:
                - generic [ref=e194]:
                  - generic [ref=e195]:
                    - generic [ref=e196]: V
                    - generic [ref=e197]:
                      - strong [ref=e198]: vanhkhuc
                      - generic [ref=e199]: 9/6/2026
                  - generic [ref=e200]: Chia sẻ
                - paragraph [ref=e201]: vanhkhucvanhkhucvanhkhuc
                - generic [ref=e202]:
                  - generic [ref=e203]: 0 thích
                  - generic [ref=e204]: 0 bình luận
                  - generic [ref=e205]: Lưu bài
            - link "Xem cộng đồng" [ref=e206] [cursor=pointer]:
              - /url: /cong-dong
          - complementary [ref=e207]:
            - generic [ref=e208]:
              - heading "Thành viên tích cực" [level=3] [ref=e209]
              - list [ref=e210]:
                - listitem [ref=e211]:
                  - generic [ref=e212]: "1"
                  - generic [ref=e213]: V
                  - generic [ref=e214]:
                    - strong [ref=e215]: vanhkhuc
                    - generic [ref=e216]: 4 bài viết
            - generic [ref=e217]:
              - heading "Có kinh nghiệm hay?" [level=3] [ref=e218]
              - paragraph [ref=e219]: Chia sẻ mẹo tiết kiệm điện của bạn để giúp nhiều người hơn.
              - link "Đăng bài ngay" [ref=e220] [cursor=pointer]:
                - /url: /dang-bai
        - generic [ref=e222]:
          - generic [ref=e223]: ✦
          - heading "Bắt đầu sống xanh từ những thói quen nhỏ" [level=2] [ref=e224]
          - paragraph [ref=e225]: Tham gia E-XANH ngay hôm nay để chia sẻ hành trình tiết kiệm điện và góp phần bảo vệ môi trường.
          - link "Tham gia cộng đồng" [ref=e226] [cursor=pointer]:
            - /url: /cong-dong
    - contentinfo [ref=e227]:
      - generic [ref=e228]:
        - generic [ref=e229]:
          - link "E-XANH về trang chủ" [ref=e230] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e231]
          - paragraph [ref=e232]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e233]:
          - link "Trang chủ" [ref=e234] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e235] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e236] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e237] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e238] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e239] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e240] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e242]: © 2024 E-XANH. Made by VanhKhucDev
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
> 18 |       expect(clicked, `Không tìm thấy menu ${item.text}`).toBeTruthy();
     |                                                           ^ Error: Không tìm thấy menu /trang chủ|home/i
  19 |       await page.waitForLoadState('domcontentloaded').catch(() => {});
  20 |       await expectNoBlankPage(page);
  21 |       expect(page.url(), `Menu ${item.text} không chuyển đúng route`).toContain(item.expectedPath);
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