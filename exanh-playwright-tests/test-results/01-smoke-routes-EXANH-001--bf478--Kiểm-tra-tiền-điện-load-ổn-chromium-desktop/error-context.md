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
        - generic [ref=e34]:
          - generic [ref=e35]:
            - generic [ref=e36]: Công cụ thông minh
            - generic [ref=e37]:
              - heading "Kiểm tra tiền điện hằng tháng" [level=1] [ref=e38]
              - paragraph [ref=e39]: Nhập thiết bị bạn đang sử dụng để ước tính chi phí điện, tìm thiết bị tiêu hao nhiều nhất và nhận gợi ý tiết kiệm phù hợp.
            - generic [ref=e40]:
              - link "Bắt đầu tính" [ref=e41] [cursor=pointer]:
                - /url: "#cong-cu-dien"
              - link "Xem cách hoạt động" [ref=e42] [cursor=pointer]:
                - /url: "#cach-tinh"
          - img "Minh họa bảng điều khiển điện năng E-XANH" [ref=e44]
        - generic [ref=e45]:
          - generic [ref=e46]:
            - generic [ref=e47]:
              - heading "Thiết bị của bạn" [level=2] [ref=e48]
              - paragraph [ref=e49]: Thêm các thiết bị điện bạn dùng thường xuyên để E-XANH ước tính chi phí.
              - generic [ref=e50]:
                - generic [ref=e51]:
                  - generic [ref=e52]: Loại thiết bị
                  - combobox "Loại thiết bị" [ref=e53]:
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
                - generic [ref=e54]:
                  - generic [ref=e55]: Công suất (W)
                  - spinbutton "Công suất (W)" [ref=e56]: "850"
                - generic [ref=e57]:
                  - generic [ref=e58]: Giờ dùng / Ngày
                  - spinbutton "Giờ dùng / Ngày" [ref=e59]
                - generic [ref=e60]:
                  - generic [ref=e61]: Ngày dùng / Tháng
                  - spinbutton "Ngày dùng / Tháng" [ref=e62]
              - button "Thêm thiết bị" [ref=e64] [cursor=pointer]
            - generic [ref=e65]:
              - article [ref=e66]:
                - generic [ref=e67]:
                  - heading "Điều hòa 9000BTU" [level=3] [ref=e68]
                  - paragraph [ref=e69]: 850W • 8h/ngày • 30 ngày
                - generic [ref=e70]:
                  - strong [ref=e71]: 204 kWh
                  - button "Xóa" [ref=e72] [cursor=pointer]
              - article [ref=e73]:
                - generic [ref=e74]:
                  - heading "Laptop" [level=3] [ref=e75]
                  - paragraph [ref=e76]: 65W • 10h/ngày • 22 ngày
                - generic [ref=e77]:
                  - strong [ref=e78]: 14.3 kWh
                  - button "Xóa" [ref=e79] [cursor=pointer]
            - generic [ref=e80]:
              - button "Tính tiền điện" [ref=e81] [cursor=pointer]
              - button "Làm mới" [ref=e82] [cursor=pointer]
            - button "Lưu lịch sử" [ref=e84] [cursor=pointer]
          - generic [ref=e85]:
            - generic [ref=e86]:
              - generic [ref=e87]: Tiền điện dự kiến
              - generic [ref=e88]: 523.920đ
              - paragraph [ref=e89]: Dựa trên đơn giá điện sinh hoạt tạm tính 2.400đ/kWh.
              - generic [ref=e90]:
                - generic [ref=e91]:
                  - text: Tổng điện năng
                  - strong [ref=e92]: 218.3 kWh
                - generic [ref=e93]:
                  - text: Thiết bị tốn nhất
                  - strong [ref=e94]: Điều hòa 9000BTU
                - generic [ref=e95]:
                  - text: Có thể tiết kiệm
                  - strong [ref=e96]: 15–20%
            - generic [ref=e97]:
              - heading "Phân bổ tiêu thụ" [level=3] [ref=e98]
              - generic [ref=e99]:
                - generic [ref=e101]:
                  - generic [ref=e102]: Điều hòa 9000BTU
                  - generic [ref=e103]: 204 kWh • 93%
                - generic [ref=e107]:
                  - generic [ref=e108]: Laptop
                  - generic [ref=e109]: 14.3 kWh • 7%
        - generic [ref=e112]:
          - generic [ref=e114]:
            - heading "Gợi ý tiết kiệm dành cho bạn" [level=2] [ref=e115]
            - paragraph [ref=e116]: Dựa trên các thiết bị bạn đang sử dụng
          - generic [ref=e117]:
            - article [ref=e118]:
              - generic [ref=e119]: Nhiệt
              - heading "Đặt điều hòa 26–28°C" [level=3] [ref=e120]
              - paragraph [ref=e121]: Tăng 1 độ C có thể giúp giảm tới 3% điện năng tiêu thụ của máy lạnh.
            - article [ref=e122]:
              - generic [ref=e123]: Pin
              - heading "Không sạc thiết bị qua đêm" [level=3] [ref=e124]
              - paragraph [ref=e125]: Ngắt sạc laptop, điện thoại khi đầy để tránh rò rỉ điện và chai pin.
            - article [ref=e126]:
              - generic [ref=e127]: Tắt
              - heading "Tắt thiết bị ở chế độ chờ" [level=3] [ref=e128]
              - paragraph [ref=e129]: Rút phích cắm TV, loa khi không dùng vì chế độ chờ vẫn tiêu thụ điện ngầm.
            - article [ref=e130]:
              - generic [ref=e131]: Sáng
              - heading "Tận dụng ánh sáng tự nhiên" [level=3] [ref=e132]
              - paragraph [ref=e133]: Mở cửa sổ thay vì bật đèn vào ban ngày để giảm tải hệ thống chiếu sáng.
        - generic [ref=e134]:
          - generic [ref=e135]:
            - heading "Lịch sử kiểm tra gần đây" [level=2] [ref=e136]
            - link "Xem lịch sử đầy đủ" [ref=e137] [cursor=pointer]:
              - /url: /lich-su-kiem-tra
          - generic [ref=e138]:
            - generic [ref=e139]:
              - generic [ref=e140]: Ngày
              - generic [ref=e141]: Thiết bị
              - generic [ref=e142]: Tiêu thụ
              - generic [ref=e143]: Thành tiền
            - generic [ref=e144]:
              - generic [ref=e145]: 12/06/2024
              - generic [ref=e146]: 3 thiết bị
              - generic [ref=e147]: 218.3 kWh
              - strong [ref=e148]: 520.000đ
            - generic [ref=e149]:
              - generic [ref=e150]: 08/06/2024
              - generic [ref=e151]: 4 thiết bị
              - generic [ref=e152]: 156 kWh
              - strong [ref=e153]: 420.000đ
            - generic [ref=e154]:
              - generic [ref=e155]: 01/06/2024
              - generic [ref=e156]: 2 thiết bị
              - generic [ref=e157]: 132 kWh
              - strong [ref=e158]: 360.000đ
          - paragraph [ref=e159]: Đăng nhập để lưu lại lịch sử kiểm tra tiền điện của bạn.
        - generic [ref=e160]:
          - generic [ref=e161]:
            - heading "E-XANH tính như thế nào?" [level=2] [ref=e162]
            - paragraph [ref=e163]: Số điện tiêu thụ = Công suất thiết bị × Thời gian sử dụng / 1000
          - generic [ref=e164]:
            - generic [ref=e165]:
              - generic [ref=e166]: Số điện tiêu thụ (kWh)
              - strong [ref=e167]: Công suất (W) × Thời gian (h)
              - generic [ref=e168]: "1000"
            - paragraph [ref=e170]:
              - text: Điều hòa 850W dùng 8 giờ/ngày trong 30 ngày sẽ tiêu thụ khoảng
              - strong [ref=e171]: 204 kWh
              - text: .
    - contentinfo [ref=e172]:
      - generic [ref=e173]:
        - generic [ref=e174]:
          - img [ref=e176]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e178]:
          - link "E-XANH về trang chủ" [ref=e179] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e181]
          - paragraph [ref=e182]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e183]:
          - link "Trang chủ" [ref=e184] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e185] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e186] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e187] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e188] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e189] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e190] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e192]: © 2024 E-XANH. Made by VanhKhucDev
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