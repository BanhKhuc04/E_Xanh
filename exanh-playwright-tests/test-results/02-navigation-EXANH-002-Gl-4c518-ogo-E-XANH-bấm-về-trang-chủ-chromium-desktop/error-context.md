# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-navigation.spec.js >> EXANH-002 Global Navigation - navbar/footer/link >> EX-001 Logo E-XANH bấm về trang chủ
- Location: tests\02-navigation.spec.js:6:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/$|\/home$/
Received string:  "http://localhost:5173/cong-dong"
Timeout: 7000ms

Call log:
  - Expect "toHaveURL" with timeout 7000ms
    17 × unexpected value "http://localhost:5173/cong-dong"

```

```yaml
- button "Đóng thông báo": ×
- heading "E-XANH đang trong quá trình phát triển" [level=4]
- paragraph: Website có thể phát sinh vấn đề, mong bạn phản hồi để nhóm phát triển cải thiện.
- paragraph:
  - text: "Phiên bản hiện tại:"
  - strong: Beta v1.1
- paragraph:
  - text: "Cập nhật gần nhất:"
  - strong: 11/06/2026
- paragraph:
  - text: "Dự kiến cập nhật tiếp theo:"
  - strong: Sắp cập nhật
- button "Báo cáo lỗi":
  - img
  - text: Báo cáo lỗi
- banner:
  - link "E-XANH về trang chủ":
    - /url: /
    - img "E-XANH"
  - navigation "Điều hướng người dùng":
    - link "Trang chủ":
      - /url: /
    - link "Mẹo tiết kiệm":
      - /url: /meo-tiet-kiem
    - link "Cộng đồng":
      - /url: /cong-dong
    - link "Kiểm tra tiền điện":
      - /url: /kiem-tra-tien-dien
    - link "Bài đã lưu":
      - /url: /bai-da-luu
  - link "Đăng nhập":
    - /url: /dang-nhap
  - button "Đăng bài"
- main:
  - text: Cộng đồng sống xanh
  - heading "Cùng nhau chia sẻ mẹo tiết kiệm điện" [level=1]
  - paragraph: Nơi sinh viên và người trẻ lan tỏa kinh nghiệm sống xanh, trao đổi thói quen tiết kiệm điện và truyền cảm hứng cho nhau.
  - button "Viết bài chia sẻ"
  - link "Khám phá bài viết":
    - /url: "#cong-dong-feed"
  - img "Nhóm sinh viên đang chia sẻ kinh nghiệm sống xanh"
  - text: EX
  - button "Bạn muốn chia sẻ mẹo tiết kiệm điện nào?"
  - button "Viết bài chia sẻ"
  - button "Ảnh"
  - button "Chủ đề"
  - button "Mẹo nhanh"
  - tablist "Bộ lọc cộng đồng":
    - button "Tất cả"
    - button "Mới nhất"
    - button "Nhiều tương tác"
    - button "Hỏi đáp"
    - button "Kinh nghiệm"
    - button "Đã lưu nhiều"
  - article:
    - img "Ảnh đại diện của vanhkhuc"
    - strong: vanhkhuc
    - text: 5/6/2026 • Quản trị viên ... Cộng đồng Chia sẻ
    - link "Gợi ý 5 thói quen giúp giảm rác thải nhựa khi đi siêu thị Mang theo túi vải, hạn chế mua đồ đóng gói sẵn hay chọn các sản phẩm dùng hộp thủy tinh/giấy là những mẹo rất hay.":
      - /url: /cong-dong/3b6ccb24-1d2a-46c2-84f0-efb655f57e80
      - heading "Gợi ý 5 thói quen giúp giảm rác thải nhựa khi đi siêu thị" [level=2]
      - paragraph: Mang theo túi vải, hạn chế mua đồ đóng gói sẵn hay chọn các sản phẩm dùng hộp thủy tinh/giấy là những mẹo rất hay.
    - button "Thích 56":
      - img
      - text: Thích 56
    - button "Bình luận 0":
      - img
      - text: Bình luận 0
    - button "Lưu bài 1":
      - img
      - text: Lưu bài 1
    - button "Chia sẻ 0":
      - img
      - text: Chia sẻ 0
  - article:
    - img "Ảnh đại diện của vanhkhuc"
    - strong: vanhkhuc
    - text: 14/6/2026 • Quản trị viên ... Cộng đồng Chia sẻ
    - link "MMeo tiet kiem dien khi su dung tu lanh Day la mot bai viet chia se ve cach su dung tu lanh tiet kiem dien cuc ky hieu qua cho moi gia dinh trong mua he nong nuc nay....":
      - /url: /cong-dong/5a6ac10c-740f-47c1-8f75-aecee1b0e01c
      - heading "MMeo tiet kiem dien khi su dung tu lanh" [level=2]
      - paragraph: Day la mot bai viet chia se ve cach su dung tu lanh tiet kiem dien cuc ky hieu qua cho moi gia dinh trong mua he nong nuc nay....
    - button "Thích 0":
      - img
      - text: Thích 0
    - button "Bình luận 0":
      - img
      - text: Bình luận 0
    - button "Lưu bài 0":
      - img
      - text: Lưu bài 0
    - button "Chia sẻ 0":
      - img
      - text: Chia sẻ 0
  - article:
    - img "Ảnh đại diện của vanhkhuc"
    - strong: vanhkhuc
    - text: 9/6/2026 • Quản trị viên ... Cộng đồng Chia sẻ
    - link "hehihihihihihihihehihihihihihihihehihihihihihihi hehihihihihihihihehihihihihihihi":
      - /url: /cong-dong/8682dc7c-55a6-4996-a716-3eb8c85c4547
      - heading "hehihihihihihihihehihihihihihihihehihihihihihihi" [level=2]
      - paragraph: hehihihihihihihihehihihihihihihi
    - link "hehihihihihihihihehihihihihihihihehihihihihihihi":
      - /url: /cong-dong/8682dc7c-55a6-4996-a716-3eb8c85c4547
      - img "hehihihihihihihihehihihihihihihihehihihihihihihi"
    - button "Thích 0":
      - img
      - text: Thích 0
    - button "Bình luận 0":
      - img
      - text: Bình luận 0
    - button "Lưu bài 1":
      - img
      - text: Lưu bài 1
    - button "Chia sẻ 0":
      - img
      - text: Chia sẻ 0
  - button "Xem thêm bài viết"
  - complementary:
    - heading "Thành viên tích cực" [level=2]
    - article:
      - img "Khánh Linh"
      - strong: Khánh Linh
      - text: 42 bài chia sẻ
      - emphasis: "#1"
    - article:
      - img "Đức Minh"
      - strong: Đức Minh
      - text: 38 bài chia sẻ
      - emphasis: "#2"
    - article:
      - img "Lan Anh"
      - strong: Lan Anh
      - text: 26 bài chia sẻ
      - emphasis: Gợi ý hay
    - heading "Chủ đề đang thảo luận" [level=2]
    - text: "#ĐiềuHòaMùaHè #PhòngTrọXanh #TủLạnh #GócHọcTập #SinhViênTiếtKiệm"
    - heading "Quy tắc cộng đồng" [level=2]
    - list:
      - listitem: Tôn trọng mọi thành viên và góc nhìn khác nhau.
      - listitem: Ưu tiên chia sẻ thông tin hữu ích, thực tế và có trải nghiệm thật.
      - listitem: Không spam, không quảng cáo sai sự thật hoặc gây hiểu nhầm.
    - heading "Bài viết được yêu thích" [level=2]
    - article:
      - strong: Checklist 30 giây trước khi rời phòng
      - text: 302 thích • 45 bình luận
    - article:
      - strong: Cách dùng điều hòa tiết kiệm hơn
      - text: 214 thích • 29 bình luận
    - article:
      - strong: Có nên rút sạc laptop khi pin đầy?
      - text: 45 thích • 18 bình luận
    - heading "Có kinh nghiệm hay?" [level=2]
    - paragraph: Chia sẻ bài viết của bạn với cộng đồng E-XANH để cùng nhau lan tỏa lối sống xanh.
    - button "Đăng bài ngay"
- contentinfo:
  - img
  - text: Hoàng Sa & Trường Sa là của Việt Nam!
  - link "E-XANH về trang chủ":
    - /url: /
    - img "E-XANH"
  - paragraph: Dùng điện thông minh, sống xanh bền vững.
  - navigation "Liên kết chân trang":
    - link "Trang chủ":
      - /url: /
    - link "Mẹo tiết kiệm":
      - /url: /meo-tiet-kiem
    - link "Cộng đồng":
      - /url: /cong-dong
    - link "Kiểm tra tiền điện":
      - /url: /kiem-tra-tien-dien
    - link "Về chúng tôi":
      - /url: /ve-chung-toi
    - link "Điều khoản":
      - /url: /dieu-khoan
    - link "Liên hệ":
      - /url: /lien-he
  - paragraph: © 2024 E-XANH. Made by VanhKhucDev
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
> 10 |     await expect(page).toHaveURL(/\/$|\/home$/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
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