# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-smoke-routes.spec.js >> EXANH-001 Smoke routes - route không trắng/không crash >> ROUTE-TIPS Mẹo tiết kiệm load ổn
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
          - generic [ref=e29]:
            - generic [ref=e30]: Thư viện mẹo tiết kiệm điện
            - generic [ref=e31]:
              - heading "Mẹo tiết kiệm điện" [level=1] [ref=e32]
              - paragraph [ref=e33]: Khám phá các mẹo sử dụng điện thông minh, dễ áp dụng và phù hợp với đời sống hằng ngày.
          - img "Không gian học tập xanh với các mẹo tiết kiệm điện" [ref=e35]
        - generic [ref=e36]:
          - generic [ref=e37]:
            - generic [ref=e38]: Tìm kiếm
            - searchbox "Tìm kiếm" [ref=e39]
          - generic "Lọc theo chủ đề" [ref=e40]:
            - button "Tất cả" [ref=e41] [cursor=pointer]
            - button "Điều hòa" [ref=e42] [cursor=pointer]
            - button "Laptop" [ref=e43] [cursor=pointer]
            - button "Tủ lạnh" [ref=e44] [cursor=pointer]
            - button "Thiết bị điện" [ref=e45] [cursor=pointer]
            - button "Thói quen" [ref=e46] [cursor=pointer]
          - generic [ref=e47]:
            - generic [ref=e48]: Sắp xếp
            - combobox "Sắp xếp" [ref=e49]:
              - option "Mới nhất" [selected]
              - option "Nhiều lượt lưu"
              - option "Nhiều tương tác"
        - generic [ref=e50]:
          - article [ref=e53]:
            - generic [ref=e54]:
              - img "Cách để tiết kiệm người yêu - mẹo tiết kiệm điện" [ref=e56]
              - generic [ref=e57]: Mẹo tiết kiệm
              - button "Lưu bài Cách để tiết kiệm người yêu" [ref=e58] [cursor=pointer]: Lưu
            - generic [ref=e59]:
              - heading "Cách để tiết kiệm người yêu" [level=3] [ref=e60]
              - paragraph [ref=e61]: TÔI THẤY NY XINH
              - generic [ref=e62]:
                - generic [ref=e63]:
                  - generic [ref=e64]: V
                  - generic [ref=e65]:
                    - strong [ref=e66]: vanhkhuc
                    - generic [ref=e67]: 2026-06-07 • 3 phút
                - generic [ref=e68]:
                  - generic [ref=e69]: 0 thích
                  - generic [ref=e70]: 0 bình luận
                  - generic [ref=e71]: 1 lưu
              - link "Đọc tiếp" [ref=e72] [cursor=pointer]:
                - /url: /meo-tiet-kiem/cach-de-tiet-kiem-nguoi-yeu-bcrm
          - complementary [ref=e73]:
            - generic [ref=e74]:
              - heading "Gợi ý hôm nay" [level=2] [ref=e75]
              - paragraph [ref=e76]: Đặt điều hòa ở 26-28°C và kết hợp sử dụng quạt gió. Mỗi độ C tăng lên giúp bạn tiết kiệm khoảng 10% điện năng tiêu thụ.
            - generic [ref=e77]:
              - heading "Chủ đề nổi bật" [level=2] [ref=e78]
              - generic [ref=e79]:
                - button "Điều hòa" [ref=e80] [cursor=pointer]
                - button "Tủ lạnh" [ref=e81] [cursor=pointer]
                - button "Máy giặt" [ref=e82] [cursor=pointer]
                - button "Thiết bị gia dụng" [ref=e83] [cursor=pointer]
                - button "Laptop" [ref=e84] [cursor=pointer]
                - button "Thói quen" [ref=e85] [cursor=pointer]
                - button "Mùa nắng nóng" [ref=e86] [cursor=pointer]
            - generic [ref=e87]:
              - heading "Bài viết được lưu nhiều" [level=2] [ref=e88]
              - generic [ref=e89]:
                - link "TL Mẹo rã đông tủ lạnh đúng cách không tốn điện 452 lượt lưu" [ref=e90] [cursor=pointer]:
                  - /url: /meo-tiet-kiem/saved-1
                  - generic [ref=e91]: TL
                  - generic [ref=e92]:
                    - heading "Mẹo rã đông tủ lạnh đúng cách không tốn điện" [level=3] [ref=e93]
                    - paragraph [ref=e94]: 452 lượt lưu
                - link "MN Sử dụng máy nước nóng lạnh sao cho hiệu quả? 389 lượt lưu" [ref=e95] [cursor=pointer]:
                  - /url: /meo-tiet-kiem/saved-2
                  - generic [ref=e96]: MN
                  - generic [ref=e97]:
                    - heading "Sử dụng máy nước nóng lạnh sao cho hiệu quả?" [level=3] [ref=e98]
                    - paragraph [ref=e99]: 389 lượt lưu
                - link "MG Lượng quần áo tối ưu cho mỗi mẻ giặt 315 lượt lưu" [ref=e100] [cursor=pointer]:
                  - /url: /meo-tiet-kiem/saved-3
                  - generic [ref=e101]: MG
                  - generic [ref=e102]:
                    - heading "Lượng quần áo tối ưu cho mỗi mẻ giặt" [level=3] [ref=e103]
                    - paragraph [ref=e104]: 315 lượt lưu
            - generic [ref=e105]:
              - generic [ref=e106]: ✎
              - heading "Bạn có mẹo hay?" [level=2] [ref=e107]
              - paragraph [ref=e108]: Chia sẻ kinh nghiệm tiết kiệm điện của bạn để lan tỏa lối sống xanh đến cộng đồng.
              - link "Đăng bài chia sẻ" [ref=e109] [cursor=pointer]:
                - /url: /cong-dong
    - contentinfo [ref=e110]:
      - generic [ref=e111]:
        - generic [ref=e112]:
          - img [ref=e114]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e116]:
          - link "E-XANH về trang chủ" [ref=e117] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e119]
          - paragraph [ref=e120]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e121]:
          - link "Trang chủ" [ref=e122] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e123] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e124] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e125] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e126] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e127] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e128] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e130]: © 2024 E-XANH. Made by VanhKhucDev
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