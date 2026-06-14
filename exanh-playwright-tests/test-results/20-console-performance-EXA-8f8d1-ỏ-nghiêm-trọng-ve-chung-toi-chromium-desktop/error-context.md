# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 20-console-performance.spec.js >> EXANH-020 Console/Error/Basic performance >> Console không lỗi đỏ nghiêm trọng /ve-chung-toi
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
      - generic [ref=e33]:
        - generic [ref=e34]:
          - link "Trang chủ" [ref=e35] [cursor=pointer]:
            - /url: /
          - generic [ref=e36]: ">"
          - generic [ref=e37]: Về chúng tôi
        - generic [ref=e38]:
          - generic [ref=e39]:
            - generic [ref=e40]: Về E-XANH
            - generic [ref=e41]:
              - heading "E-XANH là gì?" [level=1] [ref=e42]
              - paragraph [ref=e43]: E-XANH là nền tảng giúp người trẻ sử dụng điện thông minh hơn, tiết kiệm chi phí hằng tháng và lan tỏa lối sống xanh trong cộng đồng.
            - link "Khám phá mẹo tiết kiệm" [ref=e45] [cursor=pointer]:
              - /url: /meo-tiet-kiem
            - link "E-XANH về trang chủ" [ref=e47] [cursor=pointer]:
              - /url: /
              - img "E-XANH" [ref=e49]
          - img "Minh họa nền tảng E-XANH" [ref=e51]
        - generic [ref=e52]:
          - heading "Sứ mệnh của E-XANH" [level=2] [ref=e53]
          - paragraph [ref=e54]: Chúng tôi mong muốn biến việc tiết kiệm điện trở thành một thói quen đơn giản, dễ thực hiện và gần gũi với đời sống hằng ngày.
        - generic [ref=e55]:
          - heading "E-XANH giúp bạn làm gì?" [level=2] [ref=e57]
          - generic [ref=e58]:
            - article [ref=e59]:
              - heading "Đọc mẹo tiết kiệm điện" [level=3] [ref=e60]
              - paragraph [ref=e61]: Cập nhật những cách sử dụng điện hiệu quả, tiết kiệm chi phí mỗi ngày.
            - article [ref=e62]:
              - heading "Kiểm tra tiền điện" [level=3] [ref=e63]
              - paragraph [ref=e64]: Công cụ tính toán và dự báo chi phí điện dựa trên thói quen sử dụng của bạn.
            - article [ref=e65]:
              - heading "Chia sẻ kinh nghiệm" [level=3] [ref=e66]
              - paragraph [ref=e67]: Kết nối với cộng đồng, lan tỏa những câu chuyện sống xanh thiết thực.
            - article [ref=e68]:
              - heading "Lưu nội dung hữu ích" [level=3] [ref=e69]
              - paragraph [ref=e70]: Dễ dàng lưu trữ và tìm lại những bài viết, mẹo vặt hữu ích khi cần.
        - generic [ref=e71]:
          - heading "Giá trị cốt lõi" [level=2] [ref=e73]
          - generic [ref=e74]:
            - article [ref=e75]:
              - strong [ref=e76]: Thông minh
            - article [ref=e77]:
              - strong [ref=e78]: Tiết kiệm
            - article [ref=e79]:
              - strong [ref=e80]: Bền vững
        - generic [ref=e81]:
          - heading "Bắt đầu sống xanh từ những thay đổi nhỏ" [level=2] [ref=e82]
          - generic [ref=e83]:
            - link "Khám phá mẹo tiết kiệm" [ref=e84] [cursor=pointer]:
              - /url: /meo-tiet-kiem
            - link "Kiểm tra tiền điện ngay" [ref=e85] [cursor=pointer]:
              - /url: /kiem-tra-tien-dien
    - contentinfo [ref=e86]:
      - generic [ref=e87]:
        - generic [ref=e88]:
          - img [ref=e90]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e92]:
          - link "E-XANH về trang chủ" [ref=e93] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e95]
          - paragraph [ref=e96]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e97]:
          - link "Trang chủ" [ref=e98] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e99] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e100] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e101] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e102] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e103] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e104] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e106]: © 2024 E-XANH. Made by VanhKhucDev
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