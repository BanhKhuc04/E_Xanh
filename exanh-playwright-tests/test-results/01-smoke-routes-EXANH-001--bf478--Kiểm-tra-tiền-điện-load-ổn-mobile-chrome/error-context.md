# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-smoke-routes.spec.js >> EXANH-001 Smoke routes - route không trắng/không crash >> ROUTE-ELECTRIC Kiểm tra tiền điện load ổn
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
            - generic [ref=e30]: Công cụ thông minh
            - generic [ref=e31]:
              - heading "Kiểm tra tiền điện hằng tháng" [level=1] [ref=e32]
              - paragraph [ref=e33]: Nhập thiết bị bạn đang sử dụng để ước tính chi phí điện, tìm thiết bị tiêu hao nhiều nhất và nhận gợi ý tiết kiệm phù hợp.
            - generic [ref=e34]:
              - link "Bắt đầu tính" [ref=e35] [cursor=pointer]:
                - /url: "#cong-cu-dien"
              - link "Xem cách hoạt động" [ref=e36] [cursor=pointer]:
                - /url: "#cach-tinh"
          - img "Minh họa bảng điều khiển điện năng E-XANH" [ref=e38]
        - generic [ref=e39]:
          - generic [ref=e40]:
            - generic [ref=e41]:
              - heading "Thiết bị của bạn" [level=2] [ref=e42]
              - paragraph [ref=e43]: Thêm các thiết bị điện bạn dùng thường xuyên để E-XANH ước tính chi phí.
              - generic [ref=e44]:
                - generic [ref=e45]:
                  - generic [ref=e46]: Loại thiết bị
                  - combobox "Loại thiết bị" [ref=e47]:
                    - option "Bếp từ"
                    - option "Bình nóng lạnh"
                    - option "Đèn LED"
                    - option "Điều hòa 12000BTU"
                    - option "Điều hòa 9000BTU" [selected]
                    - option "Laptop"
                    - option "Máy giặt"
                    - option "Nồi cơm điện"
                    - option "Quạt điện"
                    - option "Tủ lạnh mini"
                    - option "Khác"
                - generic [ref=e48]:
                  - generic [ref=e49]: Công suất (W)
                  - spinbutton "Công suất (W)" [ref=e50]: "850"
                - generic [ref=e51]:
                  - generic [ref=e52]: Giờ dùng / Ngày
                  - spinbutton "Giờ dùng / Ngày" [ref=e53]
                - generic [ref=e54]:
                  - generic [ref=e55]: Ngày dùng / Tháng
                  - spinbutton "Ngày dùng / Tháng" [ref=e56]
              - button "Thêm thiết bị" [ref=e58] [cursor=pointer]
            - generic [ref=e59]:
              - article [ref=e60]:
                - generic [ref=e61]:
                  - heading "Điều hòa 9000BTU" [level=3] [ref=e62]
                  - paragraph [ref=e63]: 850W • 8h/ngày • 30 ngày
                - generic [ref=e64]:
                  - strong [ref=e65]: 204 kWh
                  - button "Xóa" [ref=e66] [cursor=pointer]
              - article [ref=e67]:
                - generic [ref=e68]:
                  - heading "Laptop" [level=3] [ref=e69]
                  - paragraph [ref=e70]: 65W • 10h/ngày • 22 ngày
                - generic [ref=e71]:
                  - strong [ref=e72]: 14.3 kWh
                  - button "Xóa" [ref=e73] [cursor=pointer]
            - generic [ref=e74]:
              - button "Tính tiền điện" [ref=e75] [cursor=pointer]
              - button "Làm mới" [ref=e76] [cursor=pointer]
            - button "Lưu lịch sử" [ref=e78] [cursor=pointer]
          - generic [ref=e79]:
            - generic [ref=e80]:
              - generic [ref=e81]: Tiền điện dự kiến
              - generic [ref=e82]: 523.920đ
              - paragraph [ref=e83]: Dựa trên đơn giá điện sinh hoạt tạm tính 2.400đ/kWh.
              - generic [ref=e84]:
                - generic [ref=e85]:
                  - text: Tổng điện năng
                  - strong [ref=e86]: 218.3 kWh
                - generic [ref=e87]:
                  - text: Thiết bị tốn nhất
                  - strong [ref=e88]: Điều hòa 9000BTU
                - generic [ref=e89]:
                  - text: Có thể tiết kiệm
                  - strong [ref=e90]: 15–20%
            - generic [ref=e91]:
              - heading "Phân bổ tiêu thụ" [level=3] [ref=e92]
              - generic [ref=e93]:
                - generic [ref=e95]:
                  - generic [ref=e96]: Điều hòa 9000BTU
                  - generic [ref=e97]: 204 kWh • 93%
                - generic [ref=e101]:
                  - generic [ref=e102]: Laptop
                  - generic [ref=e103]: 14.3 kWh • 7%
        - generic [ref=e106]:
          - generic [ref=e108]:
            - heading "Gợi ý tiết kiệm dành cho bạn" [level=2] [ref=e109]
            - paragraph [ref=e110]: Dựa trên các thiết bị bạn đang sử dụng
          - generic [ref=e111]:
            - article [ref=e112]:
              - generic [ref=e113]: Nhiệt
              - heading "Đặt điều hòa 26–28°C" [level=3] [ref=e114]
              - paragraph [ref=e115]: Tăng 1 độ C có thể giúp giảm tới 3% điện năng tiêu thụ của máy lạnh.
            - article [ref=e116]:
              - generic [ref=e117]: Pin
              - heading "Không sạc thiết bị qua đêm" [level=3] [ref=e118]
              - paragraph [ref=e119]: Ngắt sạc laptop, điện thoại khi đầy để tránh rò rỉ điện và chai pin.
            - article [ref=e120]:
              - generic [ref=e121]: Tắt
              - heading "Tắt thiết bị ở chế độ chờ" [level=3] [ref=e122]
              - paragraph [ref=e123]: Rút phích cắm TV, loa khi không dùng vì chế độ chờ vẫn tiêu thụ điện ngầm.
            - article [ref=e124]:
              - generic [ref=e125]: Sáng
              - heading "Tận dụng ánh sáng tự nhiên" [level=3] [ref=e126]
              - paragraph [ref=e127]: Mở cửa sổ thay vì bật đèn vào ban ngày để giảm tải hệ thống chiếu sáng.
        - generic [ref=e128]:
          - generic [ref=e129]:
            - heading "Lịch sử kiểm tra gần đây" [level=2] [ref=e130]
            - link "Xem lịch sử đầy đủ" [ref=e131] [cursor=pointer]:
              - /url: /lich-su-kiem-tra
          - generic [ref=e132]:
            - generic [ref=e133]:
              - generic [ref=e134]: Ngày
              - generic [ref=e135]: Thiết bị
              - generic [ref=e136]: Tiêu thụ
              - generic [ref=e137]: Thành tiền
            - generic [ref=e138]:
              - generic [ref=e139]: 12/06/2024
              - generic [ref=e140]: 3 thiết bị
              - generic [ref=e141]: 218.3 kWh
              - strong [ref=e142]: 520.000đ
            - generic [ref=e143]:
              - generic [ref=e144]: 08/06/2024
              - generic [ref=e145]: 4 thiết bị
              - generic [ref=e146]: 156 kWh
              - strong [ref=e147]: 420.000đ
            - generic [ref=e148]:
              - generic [ref=e149]: 01/06/2024
              - generic [ref=e150]: 2 thiết bị
              - generic [ref=e151]: 132 kWh
              - strong [ref=e152]: 360.000đ
          - paragraph [ref=e153]: Đăng nhập để lưu lại lịch sử kiểm tra tiền điện của bạn.
        - generic [ref=e154]:
          - generic [ref=e155]:
            - heading "E-XANH tính như thế nào?" [level=2] [ref=e156]
            - paragraph [ref=e157]: Số điện tiêu thụ = Công suất thiết bị × Thời gian sử dụng / 1000
          - generic [ref=e158]:
            - generic [ref=e159]:
              - generic [ref=e160]: Số điện tiêu thụ (kWh)
              - strong [ref=e161]: Công suất (W) × Thời gian (h)
              - generic [ref=e162]: "1000"
            - paragraph [ref=e164]:
              - text: Điều hòa 850W dùng 8 giờ/ngày trong 30 ngày sẽ tiêu thụ khoảng
              - strong [ref=e165]: 204 kWh
              - text: .
    - contentinfo [ref=e166]:
      - generic [ref=e167]:
        - generic [ref=e168]:
          - img [ref=e170]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e172]:
          - link "E-XANH về trang chủ" [ref=e173] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e175]
          - paragraph [ref=e176]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e177]:
          - link "Trang chủ" [ref=e178] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e179] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e180] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e181] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e182] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e183] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e184] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e186]: © 2024 E-XANH. Made by VanhKhucDev
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