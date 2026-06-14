# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-navigation.spec.js >> EXANH-002 Global Navigation - navbar/footer/link >> Menu chuyển đúng route: /bài đã lưu|đã lưu/i
- Location: tests\02-navigation.spec.js:14:5

# Error details

```
Error: Không tìm thấy menu /bài đã lưu|đã lưu/i

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
          - img "E-XANH" [ref=e22]
        - button "Mở menu" [ref=e23] [cursor=pointer]:
          - img [ref=e24]
    - main [ref=e26]:
      - generic [ref=e27]:
        - generic [ref=e29]:
          - generic [ref=e30]:
            - generic [ref=e31]: Nền tảng sống xanh cho sinh viên
            - heading "Dùng điện thông minh, sống xanh bền vững" [level=1] [ref=e33]:
              - text: Dùng điện thông minh,
              - generic [ref=e34]: sống xanh bền vững
            - paragraph [ref=e35]: Khám phá mẹo tiết kiệm điện, chia sẻ kinh nghiệm hữu ích và ước tính chi phí điện mỗi tháng cùng cộng đồng E-XANH.
            - generic [ref=e36]:
              - link "Khám phá mẹo tiết kiệm" [ref=e37] [cursor=pointer]:
                - /url: /meo-tiet-kiem
              - link "Kiểm tra tiền điện" [ref=e38] [cursor=pointer]:
                - /url: /kiem-tra-tien-dien
            - generic [ref=e39]:
              - generic [ref=e40]:
                - strong [ref=e41]: 120+
                - generic [ref=e42]: Bài viết
              - generic [ref=e43]:
                - strong [ref=e44]: 2.4K
                - generic [ref=e45]: Tương tác
              - generic [ref=e46]:
                - strong [ref=e47]: "850"
                - generic [ref=e48]: Lưu bài
          - generic [ref=e49]:
            - generic [ref=e51]:
              - img "banner_cropped.jpeg" [ref=e54]
              - img "home-hero.jpeg" [ref=e57]
              - img "banner_cropped.jpeg" [ref=e60]
              - generic [ref=e61]:
                - button "Go to slide 1" [ref=e62] [cursor=pointer]
                - button "Go to slide 2" [ref=e64] [cursor=pointer]
                - button "Go to slide 3" [ref=e66] [cursor=pointer]
            - generic [ref=e68]:
              - generic [ref=e69]: Tiết kiệm dự kiến
              - strong [ref=e70]: 420.000đ
              - generic [ref=e71]: /tháng
            - generic [ref=e72]:
              - generic [ref=e73]: Tốn điện nhất
              - strong [ref=e74]: Điều hòa nhiệt độ
            - generic [ref=e75]:
              - generic [ref=e76]: Mẹo hay
              - paragraph [ref=e77]: Đặt điều hòa 26–28°C kết hợp quạt gió
        - generic [ref=e79]:
          - article [ref=e80]:
            - img [ref=e82]
            - heading "Đọc mẹo tiết kiệm" [level=2] [ref=e84]
            - paragraph [ref=e85]: Khám phá những cách dùng điện thông minh, hiệu quả từ chuyên gia và cộng đồng sinh viên.
            - link "Khám phá" [ref=e86] [cursor=pointer]:
              - /url: /meo-tiet-kiem
          - article [ref=e87]:
            - img [ref=e89]
            - heading "Cộng đồng chia sẻ" [level=2] [ref=e94]
            - paragraph [ref=e95]: Đọc kinh nghiệm thực tế, hỏi đáp và chia sẻ bí quyết tiết kiệm với những người bạn đồng trang lứa.
            - link "Khám phá" [ref=e96] [cursor=pointer]:
              - /url: /cong-dong
          - article [ref=e97]:
            - img [ref=e99]
            - heading "Kiểm tra tiền điện" [level=2] [ref=e101]
            - paragraph [ref=e102]: Công cụ ước tính chi phí điện sinh hoạt nhanh chóng, giúp bạn kiểm soát ngân sách hiệu quả.
            - link "Khám phá" [ref=e103] [cursor=pointer]:
              - /url: /kiem-tra-tien-dien
        - generic [ref=e105]:
          - generic [ref=e106]:
            - generic [ref=e107]: Góc kiểm tra tiền điện
            - heading "Ước tính chi phí điện hằng tháng" [level=2] [ref=e108]
            - paragraph [ref=e109]: Nhập thông tin các thiết bị điện đang sử dụng để ước tính số tiền điện bạn phải trả. Giúp bạn lên kế hoạch chi tiêu hợp lý hơn.
            - link "Ước tính ngay" [ref=e110] [cursor=pointer]:
              - /url: /kiem-tra-tien-dien
          - generic [ref=e111]:
            - generic [ref=e112]:
              - strong [ref=e113]: Mô phỏng nhanh
              - generic [ref=e114]: Ví dụ
            - generic [ref=e115]:
              - article [ref=e116]:
                - generic [ref=e117]: AC
                - generic [ref=e118]:
                  - heading "Điều hòa 9000 BTU" [level=3] [ref=e119]
                  - paragraph [ref=e120]: 8h/ngày • 30 ngày
                - strong [ref=e121]: ~420.000đ
              - article [ref=e122]:
                - generic [ref=e123]: TL
                - generic [ref=e124]:
                  - heading "Tủ lạnh 150L" [level=3] [ref=e125]
                  - paragraph [ref=e126]: 24h/ngày • 30 ngày
                - strong [ref=e127]: ~150.000đ
            - generic [ref=e128]:
              - generic [ref=e129]:
                - text: Tổng cộng dự kiến
                - strong [ref=e130]: 570.000đ
              - generic [ref=e133]: Đã đạt 65% ngân sách dự kiến (800k)
        - generic [ref=e134]:
          - generic [ref=e135]:
            - generic [ref=e136]:
              - heading "Bài viết nổi bật" [level=2] [ref=e137]
              - paragraph [ref=e138]: Những mẹo hay được cộng đồng quan tâm nhất
            - link "Xem tất cả" [ref=e139] [cursor=pointer]:
              - /url: /meo-tiet-kiem
          - article [ref=e141] [cursor=pointer]:
            - generic [ref=e142]:
              - img "Cách để tiết kiệm người yêu - mẹo tiết kiệm điện" [ref=e143]
              - generic [ref=e144]: Mẹo tiết kiệm
              - button "Tính năng đang phát triển" [disabled] [ref=e145]:
                - img [ref=e146]
            - generic [ref=e148]:
              - heading "Cách để tiết kiệm người yêu" [level=3] [ref=e149]
              - generic [ref=e150]:
                - generic [ref=e151]: V
                - strong [ref=e152]: vanhkhuc
                - generic [ref=e153]: 7/6/2026
        - generic [ref=e155]:
          - generic [ref=e156]:
            - generic [ref=e158]:
              - heading "Hoạt động cộng đồng" [level=2] [ref=e159]
              - paragraph [ref=e160]: Nơi trao đổi, chia sẻ và thảo luận về các vấn đề tiết kiệm năng lượng
            - generic [ref=e161]:
              - article [ref=e162]:
                - generic [ref=e163]:
                  - generic [ref=e164]:
                    - generic [ref=e165]: V
                    - generic [ref=e166]:
                      - strong [ref=e167]: vanhkhuc
                      - generic [ref=e168]: 6 giờ trước
                  - generic [ref=e169]: Chia sẻ
                - paragraph [ref=e170]: Day la mot bai viet chia se ve cach su dung tu lanh tiet kiem dien cuc ky hieu qua cho moi gia dinh trong mua he nong nuc nay....
                - generic [ref=e171]:
                  - generic [ref=e172]: 0 thích
                  - generic [ref=e173]: 0 bình luận
                  - generic [ref=e174]: Lưu bài
              - article [ref=e175]:
                - generic [ref=e176]:
                  - generic [ref=e177]:
                    - generic [ref=e178]: V
                    - generic [ref=e179]:
                      - strong [ref=e180]: vanhkhuc
                      - generic [ref=e181]: 9/6/2026
                  - generic [ref=e182]: Chia sẻ
                - paragraph [ref=e183]: hehihihihihihihihehihihihihihihi
                - generic [ref=e184]:
                  - generic [ref=e185]: 0 thích
                  - generic [ref=e186]: 0 bình luận
                  - generic [ref=e187]: Lưu bài
              - article [ref=e188]:
                - generic [ref=e189]:
                  - generic [ref=e190]:
                    - generic [ref=e191]: V
                    - generic [ref=e192]:
                      - strong [ref=e193]: vanhkhuc
                      - generic [ref=e194]: 9/6/2026
                  - generic [ref=e195]: Chia sẻ
                - paragraph [ref=e196]: hehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihi...
                - generic [ref=e197]:
                  - generic [ref=e198]: 0 thích
                  - generic [ref=e199]: 0 bình luận
                  - generic [ref=e200]: Lưu bài
            - link "Xem cộng đồng" [ref=e201] [cursor=pointer]:
              - /url: /cong-dong
          - complementary [ref=e202]:
            - generic [ref=e203]:
              - heading "Thành viên tích cực" [level=3] [ref=e204]
              - list [ref=e205]:
                - listitem [ref=e206]:
                  - generic [ref=e207]: "1"
                  - generic [ref=e208]: V
                  - generic [ref=e209]:
                    - strong [ref=e210]: vanhkhuc
                    - generic [ref=e211]: 6 bài viết
            - generic [ref=e212]:
              - heading "Có kinh nghiệm hay?" [level=3] [ref=e213]
              - paragraph [ref=e214]: Chia sẻ mẹo tiết kiệm điện của bạn để giúp nhiều người hơn.
              - button "Đăng bài ngay" [ref=e215] [cursor=pointer]
        - generic [ref=e217]:
          - generic [ref=e218]: ✦
          - heading "Bắt đầu sống xanh từ những thói quen nhỏ" [level=2] [ref=e219]
          - paragraph [ref=e220]: Tham gia E-XANH ngay hôm nay để chia sẻ hành trình tiết kiệm điện và góp phần bảo vệ môi trường.
          - link "Tham gia cộng đồng" [ref=e221] [cursor=pointer]:
            - /url: /cong-dong
    - contentinfo [ref=e222]:
      - generic [ref=e223]:
        - generic [ref=e224]:
          - img [ref=e226]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e228]:
          - link "E-XANH về trang chủ" [ref=e229] [cursor=pointer]:
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
     |                                                           ^ Error: Không tìm thấy menu /bài đã lưu|đã lưu/i
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