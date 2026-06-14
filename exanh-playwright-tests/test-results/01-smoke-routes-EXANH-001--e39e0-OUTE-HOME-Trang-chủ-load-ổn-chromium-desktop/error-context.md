# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-smoke-routes.spec.js >> EXANH-001 Smoke routes - route không trắng/không crash >> ROUTE-HOME Trang chủ load ổn
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
      - generic [ref=e33]:
        - generic [ref=e35]:
          - generic [ref=e36]:
            - generic [ref=e37]: Nền tảng sống xanh cho sinh viên
            - heading "Dùng điện thông minh, sống xanh bền vững" [level=1] [ref=e39]:
              - text: Dùng điện thông minh,
              - generic [ref=e40]: sống xanh bền vững
            - paragraph [ref=e41]: Khám phá mẹo tiết kiệm điện, chia sẻ kinh nghiệm hữu ích và ước tính chi phí điện mỗi tháng cùng cộng đồng E-XANH.
            - generic [ref=e42]:
              - link "Khám phá mẹo tiết kiệm" [ref=e43] [cursor=pointer]:
                - /url: /meo-tiet-kiem
              - link "Kiểm tra tiền điện" [ref=e44] [cursor=pointer]:
                - /url: /kiem-tra-tien-dien
            - generic [ref=e45]:
              - generic [ref=e46]:
                - strong [ref=e47]: 120+
                - generic [ref=e48]: Bài viết
              - generic [ref=e49]:
                - strong [ref=e50]: 2.4K
                - generic [ref=e51]: Tương tác
              - generic [ref=e52]:
                - strong [ref=e53]: "850"
                - generic [ref=e54]: Lưu bài
          - generic [ref=e55]:
            - generic [ref=e57]:
              - img "banner_cropped.jpeg" [ref=e60]
              - img "home-hero.jpeg" [ref=e63]
              - img "banner_cropped.jpeg" [ref=e66]
              - generic [ref=e67]:
                - button "Go to slide 1" [ref=e68] [cursor=pointer]
                - button "Go to slide 2" [ref=e70] [cursor=pointer]
                - button "Go to slide 3" [ref=e72] [cursor=pointer]
            - generic [ref=e74]:
              - generic [ref=e75]: Tiết kiệm dự kiến
              - strong [ref=e76]: 420.000đ
              - generic [ref=e77]: /tháng
            - generic [ref=e78]:
              - generic [ref=e79]: Tốn điện nhất
              - strong [ref=e80]: Điều hòa nhiệt độ
            - generic [ref=e81]:
              - generic [ref=e82]: Mẹo hay
              - paragraph [ref=e83]: Đặt điều hòa 26–28°C kết hợp quạt gió
        - generic [ref=e85]:
          - article [ref=e86]:
            - img [ref=e88]
            - heading "Đọc mẹo tiết kiệm" [level=2] [ref=e90]
            - paragraph [ref=e91]: Khám phá những cách dùng điện thông minh, hiệu quả từ chuyên gia và cộng đồng sinh viên.
            - link "Khám phá" [ref=e92] [cursor=pointer]:
              - /url: /meo-tiet-kiem
          - article [ref=e93]:
            - img [ref=e95]
            - heading "Cộng đồng chia sẻ" [level=2] [ref=e100]
            - paragraph [ref=e101]: Đọc kinh nghiệm thực tế, hỏi đáp và chia sẻ bí quyết tiết kiệm với những người bạn đồng trang lứa.
            - link "Khám phá" [ref=e102] [cursor=pointer]:
              - /url: /cong-dong
          - article [ref=e103]:
            - img [ref=e105]
            - heading "Kiểm tra tiền điện" [level=2] [ref=e107]
            - paragraph [ref=e108]: Công cụ ước tính chi phí điện sinh hoạt nhanh chóng, giúp bạn kiểm soát ngân sách hiệu quả.
            - link "Khám phá" [ref=e109] [cursor=pointer]:
              - /url: /kiem-tra-tien-dien
        - generic [ref=e111]:
          - generic [ref=e112]:
            - generic [ref=e113]: Góc kiểm tra tiền điện
            - heading "Ước tính chi phí điện hằng tháng" [level=2] [ref=e114]
            - paragraph [ref=e115]: Nhập thông tin các thiết bị điện đang sử dụng để ước tính số tiền điện bạn phải trả. Giúp bạn lên kế hoạch chi tiêu hợp lý hơn.
            - link "Ước tính ngay" [ref=e116] [cursor=pointer]:
              - /url: /kiem-tra-tien-dien
          - generic [ref=e117]:
            - generic [ref=e118]:
              - strong [ref=e119]: Mô phỏng nhanh
              - generic [ref=e120]: Ví dụ
            - generic [ref=e121]:
              - article [ref=e122]:
                - generic [ref=e123]: AC
                - generic [ref=e124]:
                  - heading "Điều hòa 9000 BTU" [level=3] [ref=e125]
                  - paragraph [ref=e126]: 8h/ngày • 30 ngày
                - strong [ref=e127]: ~420.000đ
              - article [ref=e128]:
                - generic [ref=e129]: TL
                - generic [ref=e130]:
                  - heading "Tủ lạnh 150L" [level=3] [ref=e131]
                  - paragraph [ref=e132]: 24h/ngày • 30 ngày
                - strong [ref=e133]: ~150.000đ
            - generic [ref=e134]:
              - generic [ref=e135]:
                - text: Tổng cộng dự kiến
                - strong [ref=e136]: 570.000đ
              - generic [ref=e139]: Đã đạt 65% ngân sách dự kiến (800k)
        - generic [ref=e140]:
          - generic [ref=e141]:
            - generic [ref=e142]:
              - heading "Bài viết nổi bật" [level=2] [ref=e143]
              - paragraph [ref=e144]: Những mẹo hay được cộng đồng quan tâm nhất
            - link "Xem tất cả" [ref=e145] [cursor=pointer]:
              - /url: /meo-tiet-kiem
          - article [ref=e147] [cursor=pointer]:
            - generic [ref=e148]:
              - img "Cách để tiết kiệm người yêu - mẹo tiết kiệm điện" [ref=e149]
              - generic [ref=e150]: Mẹo tiết kiệm
              - button "Tính năng đang phát triển" [disabled] [ref=e151]:
                - img [ref=e152]
            - generic [ref=e154]:
              - heading "Cách để tiết kiệm người yêu" [level=3] [ref=e155]
              - generic [ref=e156]:
                - generic [ref=e157]: V
                - strong [ref=e158]: vanhkhuc
                - generic [ref=e159]: 7/6/2026
        - generic [ref=e161]:
          - generic [ref=e162]:
            - generic [ref=e164]:
              - heading "Hoạt động cộng đồng" [level=2] [ref=e165]
              - paragraph [ref=e166]: Nơi trao đổi, chia sẻ và thảo luận về các vấn đề tiết kiệm năng lượng
            - generic [ref=e167]:
              - article [ref=e168]:
                - generic [ref=e169]:
                  - generic [ref=e170]:
                    - generic [ref=e171]: V
                    - generic [ref=e172]:
                      - strong [ref=e173]: vanhkhuc
                      - generic [ref=e174]: 6 giờ trước
                  - generic [ref=e175]: Chia sẻ
                - paragraph [ref=e176]: Day la mot bai viet chia se ve cach su dung tu lanh tiet kiem dien cuc ky hieu qua cho moi gia dinh trong mua he nong nuc nay....
                - generic [ref=e177]:
                  - generic [ref=e178]: 0 thích
                  - generic [ref=e179]: 0 bình luận
                  - generic [ref=e180]: Lưu bài
              - article [ref=e181]:
                - generic [ref=e182]:
                  - generic [ref=e183]:
                    - generic [ref=e184]: V
                    - generic [ref=e185]:
                      - strong [ref=e186]: vanhkhuc
                      - generic [ref=e187]: 9/6/2026
                  - generic [ref=e188]: Chia sẻ
                - paragraph [ref=e189]: hehihihihihihihihehihihihihihihi
                - generic [ref=e190]:
                  - generic [ref=e191]: 0 thích
                  - generic [ref=e192]: 0 bình luận
                  - generic [ref=e193]: Lưu bài
              - article [ref=e194]:
                - generic [ref=e195]:
                  - generic [ref=e196]:
                    - generic [ref=e197]: V
                    - generic [ref=e198]:
                      - strong [ref=e199]: vanhkhuc
                      - generic [ref=e200]: 9/6/2026
                  - generic [ref=e201]: Chia sẻ
                - paragraph [ref=e202]: hehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihi...
                - generic [ref=e203]:
                  - generic [ref=e204]: 0 thích
                  - generic [ref=e205]: 0 bình luận
                  - generic [ref=e206]: Lưu bài
            - link "Xem cộng đồng" [ref=e207] [cursor=pointer]:
              - /url: /cong-dong
          - complementary [ref=e208]:
            - generic [ref=e209]:
              - heading "Thành viên tích cực" [level=3] [ref=e210]
              - list [ref=e211]:
                - listitem [ref=e212]:
                  - generic [ref=e213]: "1"
                  - generic [ref=e214]: V
                  - generic [ref=e215]:
                    - strong [ref=e216]: vanhkhuc
                    - generic [ref=e217]: 6 bài viết
            - generic [ref=e218]:
              - heading "Có kinh nghiệm hay?" [level=3] [ref=e219]
              - paragraph [ref=e220]: Chia sẻ mẹo tiết kiệm điện của bạn để giúp nhiều người hơn.
              - button "Đăng bài ngay" [ref=e221] [cursor=pointer]
        - generic [ref=e223]:
          - generic [ref=e224]: ✦
          - heading "Bắt đầu sống xanh từ những thói quen nhỏ" [level=2] [ref=e225]
          - paragraph [ref=e226]: Tham gia E-XANH ngay hôm nay để chia sẻ hành trình tiết kiệm điện và góp phần bảo vệ môi trường.
          - link "Tham gia cộng đồng" [ref=e227] [cursor=pointer]:
            - /url: /cong-dong
    - contentinfo [ref=e228]:
      - generic [ref=e229]:
        - generic [ref=e230]:
          - img [ref=e232]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e234]:
          - link "E-XANH về trang chủ" [ref=e235] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e237]
          - paragraph [ref=e238]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e239]:
          - link "Trang chủ" [ref=e240] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e241] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e242] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e243] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e244] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e245] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e246] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e248]: © 2024 E-XANH. Made by VanhKhucDev
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