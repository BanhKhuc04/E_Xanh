# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-smoke-routes.spec.js >> EXANH-001 Smoke routes - route không trắng/không crash >> ROUTE-TERMS Điều khoản load ổn
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
          - link "Trang chủ" [ref=e35] [cursor=pointer]:
            - /url: /
          - generic [ref=e36]: ">"
          - generic [ref=e37]: Điều khoản
        - generic [ref=e39]:
          - heading "Điều khoản sử dụng E-XANH" [level=1] [ref=e40]
          - paragraph [ref=e41]: Vui lòng đọc kỹ các điều khoản trước khi sử dụng nền tảng E-XANH để đảm bảo trải nghiệm an toàn, văn minh và hữu ích.
        - generic [ref=e42]:
          - complementary [ref=e43]:
            - heading "Mục lục điều khoản" [level=2] [ref=e44]
            - list [ref=e45]:
              - listitem [ref=e46]:
                - link "1. Chấp nhận điều khoản" [ref=e47] [cursor=pointer]:
                  - /url: "#term-1"
              - listitem [ref=e48]:
                - link "2. Tài khoản người dùng" [ref=e49] [cursor=pointer]:
                  - /url: "#term-2"
              - listitem [ref=e50]:
                - link "3. Nội dung do người dùng đăng" [ref=e51] [cursor=pointer]:
                  - /url: "#term-3"
              - listitem [ref=e52]:
                - link "4. Quy tắc cộng đồng" [ref=e53] [cursor=pointer]:
                  - /url: "#term-4"
              - listitem [ref=e54]:
                - link "5. Dữ liệu và quyền riêng tư" [ref=e55] [cursor=pointer]:
                  - /url: "#term-5"
              - listitem [ref=e56]:
                - link "6. Giới hạn trách nhiệm" [ref=e57] [cursor=pointer]:
                  - /url: "#term-6"
              - listitem [ref=e58]:
                - link "7. Thay đổi điều khoản" [ref=e59] [cursor=pointer]:
                  - /url: "#term-7"
              - listitem [ref=e60]:
                - link "8. Liên hệ hỗ trợ" [ref=e61] [cursor=pointer]:
                  - /url: "#term-8"
          - generic [ref=e62]:
            - article [ref=e63]:
              - generic [ref=e64]:
                - generic [ref=e65]: "1"
                - heading "Chấp nhận điều khoản" [level=3] [ref=e66]
              - paragraph [ref=e67]: Bằng việc truy cập, đăng ký tài khoản và sử dụng nền tảng E-XANH, bạn đồng ý tuân thủ các điều khoản sử dụng được công bố trên trang này.
            - article [ref=e68]:
              - generic [ref=e69]:
                - generic [ref=e70]: "2"
                - heading "Tài khoản người dùng" [level=3] [ref=e71]
              - paragraph [ref=e72]: Bạn cần cung cấp thông tin cơ bản chính xác khi đăng ký và có trách nhiệm bảo mật tài khoản, mật khẩu cũng như mọi hoạt động diễn ra dưới tên đăng nhập của mình.
            - article [ref=e73]:
              - generic [ref=e74]:
                - generic [ref=e75]: "3"
                - heading "Nội dung do người dùng đăng" [level=3] [ref=e76]
              - paragraph [ref=e77]: Bạn chịu trách nhiệm với bài viết, bình luận và nội dung mình chia sẻ. E-XANH có quyền từ chối hoặc gỡ bỏ nội dung vi phạm quy tắc cộng đồng.
            - article [ref=e78]:
              - generic [ref=e79]:
                - generic [ref=e80]: "4"
                - heading "Quy tắc cộng đồng" [level=3] [ref=e81]
              - paragraph [ref=e82]: Mọi thành viên cần tôn trọng nhau, không spam, không phát tán thông tin sai lệch và không sử dụng nền tảng cho mục đích quảng cáo gây hiểu nhầm.
            - article [ref=e83]:
              - generic [ref=e84]:
                - generic [ref=e85]: "5"
                - heading "Dữ liệu và quyền riêng tư" [level=3] [ref=e86]
              - paragraph [ref=e87]: Chúng tôi chỉ sử dụng dữ liệu cần thiết để duy trì trải nghiệm cá nhân hóa cơ bản, bao gồm bài đã lưu và lịch sử kiểm tra điện của bạn.
            - article [ref=e88]:
              - generic [ref=e89]:
                - generic [ref=e90]: "6"
                - heading "Giới hạn trách nhiệm" [level=3] [ref=e91]
              - paragraph [ref=e92]: E-XANH cung cấp thông tin tham khảo và công cụ hỗ trợ. Kết quả tính toán chi phí điện không thay thế hóa đơn chính thức từ nhà cung cấp điện.
            - article [ref=e93]:
              - generic [ref=e94]:
                - generic [ref=e95]: "7"
                - heading "Thay đổi điều khoản" [level=3] [ref=e96]
              - paragraph [ref=e97]: Các điều khoản có thể được cập nhật theo thời gian. Việc tiếp tục sử dụng nền tảng sau khi cập nhật được hiểu là bạn chấp nhận phiên bản mới.
            - article [ref=e98]:
              - generic [ref=e99]:
                - generic [ref=e100]: "8"
                - heading "Liên hệ hỗ trợ" [level=3] [ref=e101]
              - paragraph [ref=e102]: Nếu có câu hỏi liên quan đến điều khoản sử dụng, bạn có thể liên hệ với E-XANH qua email hỗ trợ hoặc trang Liên hệ để được giải đáp.
            - generic [ref=e103]: "Cập nhật lần cuối: 12/06/2024"
    - contentinfo [ref=e104]:
      - generic [ref=e105]:
        - generic [ref=e106]:
          - img [ref=e108]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e110]:
          - link "E-XANH về trang chủ" [ref=e111] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e113]
          - paragraph [ref=e114]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e115]:
          - link "Trang chủ" [ref=e116] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e117] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e118] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e119] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e120] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e121] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e122] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e124]: © 2024 E-XANH. Made by VanhKhucDev
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