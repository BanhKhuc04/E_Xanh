# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 20-console-performance.spec.js >> EXANH-020 Console/Error/Basic performance >> Console không lỗi đỏ nghiêm trọng /cong-dong
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
          - generic [ref=e35]:
            - generic [ref=e36]: Cộng đồng sống xanh
            - generic [ref=e37]:
              - heading "Cùng nhau chia sẻ mẹo tiết kiệm điện" [level=1] [ref=e38]
              - paragraph [ref=e39]: Nơi sinh viên và người trẻ lan tỏa kinh nghiệm sống xanh, trao đổi thói quen tiết kiệm điện và truyền cảm hứng cho nhau.
            - generic [ref=e40]:
              - button "Viết bài chia sẻ" [ref=e41] [cursor=pointer]
              - link "Khám phá bài viết" [ref=e42] [cursor=pointer]:
                - /url: "#cong-dong-feed"
          - img "Nhóm sinh viên đang chia sẻ kinh nghiệm sống xanh" [ref=e44]
        - generic [ref=e45]:
          - generic [ref=e46]:
            - generic [ref=e47]:
              - generic [ref=e48]:
                - generic [ref=e49]: EX
                - button "Bạn muốn chia sẻ mẹo tiết kiệm điện nào?" [ref=e50] [cursor=pointer]
                - button "Viết bài chia sẻ" [ref=e51] [cursor=pointer]:
                  - img [ref=e52]
                  - text: Viết bài chia sẻ
              - generic [ref=e55]:
                - button "Ảnh" [ref=e56] [cursor=pointer]
                - button "Chủ đề" [ref=e57] [cursor=pointer]
                - button "Mẹo nhanh" [ref=e58] [cursor=pointer]:
                  - img [ref=e59]
                  - text: Mẹo nhanh
            - tablist "Bộ lọc cộng đồng" [ref=e61]:
              - button "Tất cả" [ref=e62] [cursor=pointer]
              - button "Mới nhất" [ref=e63] [cursor=pointer]
              - button "Nhiều tương tác" [ref=e64] [cursor=pointer]
              - button "Hỏi đáp" [ref=e65] [cursor=pointer]
              - button "Kinh nghiệm" [ref=e66] [cursor=pointer]
              - button "Đã lưu nhiều" [ref=e67] [cursor=pointer]
            - generic [ref=e68]:
              - article [ref=e69] [cursor=pointer]:
                - generic [ref=e70]:
                  - generic [ref=e71]:
                    - img "Ảnh đại diện của vanhkhuc" [ref=e72]
                    - generic [ref=e73]:
                      - strong [ref=e74]: vanhkhuc
                      - generic [ref=e75]: 5/6/2026 • Quản trị viên
                  - generic [ref=e76]: ...
                - generic [ref=e77]:
                  - generic [ref=e78]: Cộng đồng
                  - generic [ref=e79]: Chia sẻ
                - link "Gợi ý 5 thói quen giúp giảm rác thải nhựa khi đi siêu thị Mang theo túi vải, hạn chế mua đồ đóng gói sẵn hay chọn các sản phẩm dùng hộp thủy tinh/giấy là những mẹo rất hay." [ref=e81]:
                  - /url: /cong-dong/3b6ccb24-1d2a-46c2-84f0-efb655f57e80
                  - heading "Gợi ý 5 thói quen giúp giảm rác thải nhựa khi đi siêu thị" [level=2] [ref=e82]
                  - paragraph [ref=e83]: Mang theo túi vải, hạn chế mua đồ đóng gói sẵn hay chọn các sản phẩm dùng hộp thủy tinh/giấy là những mẹo rất hay.
                - generic [ref=e84]:
                  - button "Thích 56" [ref=e85]:
                    - img [ref=e86]
                    - text: Thích 56
                  - button "Bình luận 0" [ref=e88]:
                    - img [ref=e89]
                    - text: Bình luận 0
                  - button "Lưu bài 1" [ref=e91]:
                    - img [ref=e92]
                    - text: Lưu bài 1
                  - button "Chia sẻ 0" [ref=e95]:
                    - img [ref=e96]
                    - text: Chia sẻ 0
              - article [ref=e98] [cursor=pointer]:
                - generic [ref=e99]:
                  - generic [ref=e100]:
                    - img "Ảnh đại diện của vanhkhuc" [ref=e101]
                    - generic [ref=e102]:
                      - strong [ref=e103]: vanhkhuc
                      - generic [ref=e104]: 14/6/2026 • Quản trị viên
                  - generic [ref=e105]: ...
                - generic [ref=e106]:
                  - generic [ref=e107]: Cộng đồng
                  - generic [ref=e108]: Chia sẻ
                - link "MMeo tiet kiem dien khi su dung tu lanh Day la mot bai viet chia se ve cach su dung tu lanh tiet kiem dien cuc ky hieu qua cho moi gia dinh trong mua he nong nuc nay...." [ref=e110]:
                  - /url: /cong-dong/5a6ac10c-740f-47c1-8f75-aecee1b0e01c
                  - heading "MMeo tiet kiem dien khi su dung tu lanh" [level=2] [ref=e111]
                  - paragraph [ref=e112]: Day la mot bai viet chia se ve cach su dung tu lanh tiet kiem dien cuc ky hieu qua cho moi gia dinh trong mua he nong nuc nay....
                - generic [ref=e113]:
                  - button "Thích 0" [ref=e114]:
                    - img [ref=e115]
                    - text: Thích 0
                  - button "Bình luận 0" [ref=e117]:
                    - img [ref=e118]
                    - text: Bình luận 0
                  - button "Lưu bài 0" [ref=e120]:
                    - img [ref=e121]
                    - text: Lưu bài 0
                  - button "Chia sẻ 0" [ref=e124]:
                    - img [ref=e125]
                    - text: Chia sẻ 0
              - article [ref=e127] [cursor=pointer]:
                - generic [ref=e128]:
                  - generic [ref=e129]:
                    - img "Ảnh đại diện của vanhkhuc" [ref=e130]
                    - generic [ref=e131]:
                      - strong [ref=e132]: vanhkhuc
                      - generic [ref=e133]: 9/6/2026 • Quản trị viên
                  - generic [ref=e134]: ...
                - generic [ref=e135]:
                  - generic [ref=e136]: Cộng đồng
                  - generic [ref=e137]: Chia sẻ
                - link "hehihihihihihihihehihihihihihihihehihihihihihihi hehihihihihihihihehihihihihihihi" [ref=e139]:
                  - /url: /cong-dong/8682dc7c-55a6-4996-a716-3eb8c85c4547
                  - heading "hehihihihihihihihehihihihihihihihehihihihihihihi" [level=2] [ref=e140]
                  - paragraph [ref=e141]: hehihihihihihihihehihihihihihihi
                - link "hehihihihihihihihehihihihihihihihehihihihihihihi" [ref=e143]:
                  - /url: /cong-dong/8682dc7c-55a6-4996-a716-3eb8c85c4547
                  - img "hehihihihihihihihehihihihihihihihehihihihihihihi" [ref=e145]
                - generic [ref=e146]:
                  - button "Thích 0" [ref=e147]:
                    - img [ref=e148]
                    - text: Thích 0
                  - button "Bình luận 0" [ref=e150]:
                    - img [ref=e151]
                    - text: Bình luận 0
                  - button "Lưu bài 1" [ref=e153]:
                    - img [ref=e154]
                    - text: Lưu bài 1
                  - button "Chia sẻ 0" [ref=e157]:
                    - img [ref=e158]
                    - text: Chia sẻ 0
            - button "Xem thêm bài viết" [ref=e161] [cursor=pointer]
          - complementary [ref=e162]:
            - generic [ref=e163]:
              - heading "Thành viên tích cực" [level=2] [ref=e164]
              - generic [ref=e165]:
                - article [ref=e166]:
                  - img "Khánh Linh" [ref=e167]
                  - generic [ref=e168]:
                    - strong [ref=e169]: Khánh Linh
                    - text: 42 bài chia sẻ
                  - emphasis [ref=e170]: "#1"
                - article [ref=e171]:
                  - img "Đức Minh" [ref=e172]
                  - generic [ref=e173]:
                    - strong [ref=e174]: Đức Minh
                    - text: 38 bài chia sẻ
                  - emphasis [ref=e175]: "#2"
                - article [ref=e176]:
                  - img "Lan Anh" [ref=e177]
                  - generic [ref=e178]:
                    - strong [ref=e179]: Lan Anh
                    - text: 26 bài chia sẻ
                  - emphasis [ref=e180]: Gợi ý hay
            - generic [ref=e181]:
              - heading "Chủ đề đang thảo luận" [level=2] [ref=e182]
              - generic [ref=e183]:
                - generic [ref=e184]: "#ĐiềuHòaMùaHè"
                - generic [ref=e185]: "#PhòngTrọXanh"
                - generic [ref=e186]: "#TủLạnh"
                - generic [ref=e187]: "#GócHọcTập"
                - generic [ref=e188]: "#SinhViênTiếtKiệm"
            - generic [ref=e189]:
              - heading "Quy tắc cộng đồng" [level=2] [ref=e190]
              - list [ref=e191]:
                - listitem [ref=e192]: Tôn trọng mọi thành viên và góc nhìn khác nhau.
                - listitem [ref=e193]: Ưu tiên chia sẻ thông tin hữu ích, thực tế và có trải nghiệm thật.
                - listitem [ref=e194]: Không spam, không quảng cáo sai sự thật hoặc gây hiểu nhầm.
            - generic [ref=e195]:
              - heading "Bài viết được yêu thích" [level=2] [ref=e196]
              - generic [ref=e197]:
                - article [ref=e198]:
                  - strong [ref=e199]: Checklist 30 giây trước khi rời phòng
                  - generic [ref=e200]: 302 thích • 45 bình luận
                - article [ref=e201]:
                  - strong [ref=e202]: Cách dùng điều hòa tiết kiệm hơn
                  - generic [ref=e203]: 214 thích • 29 bình luận
                - article [ref=e204]:
                  - strong [ref=e205]: Có nên rút sạc laptop khi pin đầy?
                  - generic [ref=e206]: 45 thích • 18 bình luận
            - generic [ref=e207]:
              - heading "Có kinh nghiệm hay?" [level=2] [ref=e208]
              - paragraph [ref=e209]: Chia sẻ bài viết của bạn với cộng đồng E-XANH để cùng nhau lan tỏa lối sống xanh.
              - button "Đăng bài ngay" [ref=e210] [cursor=pointer]
    - contentinfo [ref=e211]:
      - generic [ref=e212]:
        - generic [ref=e213]:
          - img [ref=e215]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e217]:
          - link "E-XANH về trang chủ" [ref=e218] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e220]
          - paragraph [ref=e221]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e222]:
          - link "Trang chủ" [ref=e223] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e224] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e225] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e226] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e227] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e228] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e229] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e231]: © 2024 E-XANH. Made by VanhKhucDev
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