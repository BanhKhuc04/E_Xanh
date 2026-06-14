# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-smoke-routes.spec.js >> EXANH-001 Smoke routes - route không trắng/không crash >> ROUTE-COMMUNITY Cộng đồng load ổn
- Location: tests\01-smoke-routes.spec.js:16:5

# Error details

```
Error: Có ảnh bị lỗi tải hoặc naturalWidth/naturalHeight = 0

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 20

- Array []
+ Array [
+   Object {
+     "alt": "Khánh Linh",
+     "height": 0,
+     "src": "http://localhost:5173/images/fallback-green.jpg",
+     "width": 0,
+   },
+   Object {
+     "alt": "Đức Minh",
+     "height": 0,
+     "src": "http://localhost:5173/images/fallback-green.jpg",
+     "width": 0,
+   },
+   Object {
+     "alt": "Lan Anh",
+     "height": 0,
+     "src": "http://localhost:5173/images/fallback-green.jpg",
+     "width": 0,
+   },
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
            - generic [ref=e30]: Cộng đồng sống xanh
            - generic [ref=e31]:
              - heading "Cùng nhau chia sẻ mẹo tiết kiệm điện" [level=1] [ref=e32]
              - paragraph [ref=e33]: Nơi sinh viên và người trẻ lan tỏa kinh nghiệm sống xanh, trao đổi thói quen tiết kiệm điện và truyền cảm hứng cho nhau.
            - generic [ref=e34]:
              - button "Viết bài chia sẻ" [ref=e35] [cursor=pointer]
              - link "Khám phá bài viết" [ref=e36] [cursor=pointer]:
                - /url: "#cong-dong-feed"
          - img "Nhóm sinh viên đang chia sẻ kinh nghiệm sống xanh" [ref=e38]
        - generic [ref=e39]:
          - generic [ref=e40]:
            - generic [ref=e41]:
              - generic [ref=e42]:
                - generic [ref=e43]: EX
                - button "Bạn muốn chia sẻ mẹo tiết kiệm điện nào?" [ref=e44] [cursor=pointer]
                - button "Viết bài chia sẻ" [ref=e45] [cursor=pointer]:
                  - img [ref=e46]
                  - text: Viết bài chia sẻ
              - generic [ref=e49]:
                - button "Ảnh" [ref=e50] [cursor=pointer]
                - button "Chủ đề" [ref=e51] [cursor=pointer]
                - button "Mẹo nhanh" [ref=e52] [cursor=pointer]:
                  - img [ref=e53]
                  - text: Mẹo nhanh
            - tablist "Bộ lọc cộng đồng" [ref=e55]:
              - button "Tất cả" [ref=e56] [cursor=pointer]
              - button "Mới nhất" [ref=e57] [cursor=pointer]
              - button "Nhiều tương tác" [ref=e58] [cursor=pointer]
              - button "Hỏi đáp" [ref=e59] [cursor=pointer]
              - button "Kinh nghiệm" [ref=e60] [cursor=pointer]
              - button "Đã lưu nhiều" [ref=e61] [cursor=pointer]
            - generic [ref=e62]:
              - article [ref=e63] [cursor=pointer]:
                - generic [ref=e64]:
                  - generic [ref=e65]:
                    - img "Ảnh đại diện của vanhkhuc" [ref=e66]
                    - generic [ref=e67]:
                      - strong [ref=e68]: vanhkhuc
                      - generic [ref=e69]: 5/6/2026 • Quản trị viên
                  - generic [ref=e70]: ...
                - generic [ref=e71]:
                  - generic [ref=e72]: Cộng đồng
                  - generic [ref=e73]: Chia sẻ
                - link "Gợi ý 5 thói quen giúp giảm rác thải nhựa khi đi siêu thị Mang theo túi vải, hạn chế mua đồ đóng gói sẵn hay chọn các sản phẩm dùng hộp thủy tinh/giấy là những mẹo rất hay." [ref=e75]:
                  - /url: /cong-dong/3b6ccb24-1d2a-46c2-84f0-efb655f57e80
                  - heading "Gợi ý 5 thói quen giúp giảm rác thải nhựa khi đi siêu thị" [level=2] [ref=e76]
                  - paragraph [ref=e77]: Mang theo túi vải, hạn chế mua đồ đóng gói sẵn hay chọn các sản phẩm dùng hộp thủy tinh/giấy là những mẹo rất hay.
                - generic [ref=e78]:
                  - button "Thích 56" [ref=e79]:
                    - img [ref=e80]
                    - text: Thích 56
                  - button "Bình luận 0" [ref=e82]:
                    - img [ref=e83]
                    - text: Bình luận 0
                  - button "Lưu bài 1" [ref=e85]:
                    - img [ref=e86]
                    - text: Lưu bài 1
                  - button "Chia sẻ 0" [ref=e89]:
                    - img [ref=e90]
                    - text: Chia sẻ 0
              - article [ref=e92] [cursor=pointer]:
                - generic [ref=e93]:
                  - generic [ref=e94]:
                    - img "Ảnh đại diện của vanhkhuc" [ref=e95]
                    - generic [ref=e96]:
                      - strong [ref=e97]: vanhkhuc
                      - generic [ref=e98]: 14/6/2026 • Quản trị viên
                  - generic [ref=e99]: ...
                - generic [ref=e100]:
                  - generic [ref=e101]: Cộng đồng
                  - generic [ref=e102]: Chia sẻ
                - link "MMeo tiet kiem dien khi su dung tu lanh Day la mot bai viet chia se ve cach su dung tu lanh tiet kiem dien cuc ky hieu qua cho moi gia dinh trong mua he nong nuc nay...." [ref=e104]:
                  - /url: /cong-dong/5a6ac10c-740f-47c1-8f75-aecee1b0e01c
                  - heading "MMeo tiet kiem dien khi su dung tu lanh" [level=2] [ref=e105]
                  - paragraph [ref=e106]: Day la mot bai viet chia se ve cach su dung tu lanh tiet kiem dien cuc ky hieu qua cho moi gia dinh trong mua he nong nuc nay....
                - generic [ref=e107]:
                  - button "Thích 0" [ref=e108]:
                    - img [ref=e109]
                    - text: Thích 0
                  - button "Bình luận 0" [ref=e111]:
                    - img [ref=e112]
                    - text: Bình luận 0
                  - button "Lưu bài 0" [ref=e114]:
                    - img [ref=e115]
                    - text: Lưu bài 0
                  - button "Chia sẻ 0" [ref=e118]:
                    - img [ref=e119]
                    - text: Chia sẻ 0
              - article [ref=e121] [cursor=pointer]:
                - generic [ref=e122]:
                  - generic [ref=e123]:
                    - img "Ảnh đại diện của vanhkhuc" [ref=e124]
                    - generic [ref=e125]:
                      - strong [ref=e126]: vanhkhuc
                      - generic [ref=e127]: 9/6/2026 • Quản trị viên
                  - generic [ref=e128]: ...
                - generic [ref=e129]:
                  - generic [ref=e130]: Cộng đồng
                  - generic [ref=e131]: Chia sẻ
                - link "hehihihihihihihihehihihihihihihihehihihihihihihi hehihihihihihihihehihihihihihihi" [ref=e133]:
                  - /url: /cong-dong/8682dc7c-55a6-4996-a716-3eb8c85c4547
                  - heading "hehihihihihihihihehihihihihihihihehihihihihihihi" [level=2] [ref=e134]
                  - paragraph [ref=e135]: hehihihihihihihihehihihihihihihi
                - link "hehihihihihihihihehihihihihihihihehihihihihihihi" [ref=e137]:
                  - /url: /cong-dong/8682dc7c-55a6-4996-a716-3eb8c85c4547
                  - img "hehihihihihihihihehihihihihihihihehihihihihihihi" [ref=e139]
                - generic [ref=e140]:
                  - button "Thích 0" [ref=e141]:
                    - img [ref=e142]
                    - text: Thích 0
                  - button "Bình luận 0" [ref=e144]:
                    - img [ref=e145]
                    - text: Bình luận 0
                  - button "Lưu bài 1" [ref=e147]:
                    - img [ref=e148]
                    - text: Lưu bài 1
                  - button "Chia sẻ 0" [ref=e151]:
                    - img [ref=e152]
                    - text: Chia sẻ 0
            - button "Xem thêm bài viết" [ref=e155] [cursor=pointer]
          - complementary [ref=e156]:
            - generic [ref=e157]:
              - heading "Thành viên tích cực" [level=2] [ref=e158]
              - generic [ref=e159]:
                - article [ref=e160]:
                  - img "Khánh Linh" [ref=e161]
                  - generic [ref=e162]:
                    - strong [ref=e163]: Khánh Linh
                    - text: 42 bài chia sẻ
                  - emphasis [ref=e164]: "#1"
                - article [ref=e165]:
                  - img "Đức Minh" [ref=e166]
                  - generic [ref=e167]:
                    - strong [ref=e168]: Đức Minh
                    - text: 38 bài chia sẻ
                  - emphasis [ref=e169]: "#2"
                - article [ref=e170]:
                  - img "Lan Anh" [ref=e171]
                  - generic [ref=e172]:
                    - strong [ref=e173]: Lan Anh
                    - text: 26 bài chia sẻ
                  - emphasis [ref=e174]: Gợi ý hay
            - generic [ref=e175]:
              - heading "Chủ đề đang thảo luận" [level=2] [ref=e176]
              - generic [ref=e177]:
                - generic [ref=e178]: "#ĐiềuHòaMùaHè"
                - generic [ref=e179]: "#PhòngTrọXanh"
                - generic [ref=e180]: "#TủLạnh"
                - generic [ref=e181]: "#GócHọcTập"
                - generic [ref=e182]: "#SinhViênTiếtKiệm"
            - generic [ref=e183]:
              - heading "Quy tắc cộng đồng" [level=2] [ref=e184]
              - list [ref=e185]:
                - listitem [ref=e186]: Tôn trọng mọi thành viên và góc nhìn khác nhau.
                - listitem [ref=e187]: Ưu tiên chia sẻ thông tin hữu ích, thực tế và có trải nghiệm thật.
                - listitem [ref=e188]: Không spam, không quảng cáo sai sự thật hoặc gây hiểu nhầm.
            - generic [ref=e189]:
              - heading "Bài viết được yêu thích" [level=2] [ref=e190]
              - generic [ref=e191]:
                - article [ref=e192]:
                  - strong [ref=e193]: Checklist 30 giây trước khi rời phòng
                  - generic [ref=e194]: 302 thích • 45 bình luận
                - article [ref=e195]:
                  - strong [ref=e196]: Cách dùng điều hòa tiết kiệm hơn
                  - generic [ref=e197]: 214 thích • 29 bình luận
                - article [ref=e198]:
                  - strong [ref=e199]: Có nên rút sạc laptop khi pin đầy?
                  - generic [ref=e200]: 45 thích • 18 bình luận
            - generic [ref=e201]:
              - heading "Có kinh nghiệm hay?" [level=2] [ref=e202]
              - paragraph [ref=e203]: Chia sẻ bài viết của bạn với cộng đồng E-XANH để cùng nhau lan tỏa lối sống xanh.
              - button "Đăng bài ngay" [ref=e204] [cursor=pointer]
    - contentinfo [ref=e205]:
      - generic [ref=e206]:
        - generic [ref=e207]:
          - img [ref=e209]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e211]:
          - link "E-XANH về trang chủ" [ref=e212] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e214]
          - paragraph [ref=e215]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e216]:
          - link "Trang chủ" [ref=e217] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e218] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e219] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e220] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e221] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e222] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e223] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e225]: © 2024 E-XANH. Made by VanhKhucDev
```

# Test source

```ts
  1   | const { expect } = require('@playwright/test');
  2   | const fs = require('fs');
  3   | const path = require('path');
  4   | 
  5   | const badTextRegex = /undefined|null|NaN|\[object Object\]|lorem ipsum/i;
  6   | const notImplementedRegex = /coming soon|đang phát triển|chưa hoàn thiện|chưa có chức năng|not implemented/i;
  7   | const errorPageRegex = /404|not found|không tìm thấy trang|page not found/i;
  8   | const destructiveRegex = /xóa|delete|remove|duyệt|từ chối|reject|approve|đăng xuất|logout|thoát|block|khóa/i;
  9   | 
  10  | function collectPageErrors(page) {
  11  |   const errors = [];
  12  |   page.on('console', msg => {
  13  |     const text = msg.text();
  14  |     if (msg.type() === 'error' && !/favicon|manifest|Download the React DevTools/i.test(text)) {
  15  |       errors.push(text);
  16  |     }
  17  |   });
  18  |   page.on('pageerror', err => errors.push(err.message));
  19  |   return errors;
  20  | }
  21  | 
  22  | async function gotoAndReady(page, route = '/') {
  23  |   await page.goto(route, { waitUntil: 'domcontentloaded' });
  24  |   await page.waitForLoadState('networkidle').catch(() => {});
  25  |   await expect(page.locator('body')).toBeVisible();
  26  | }
  27  | 
  28  | async function expectNoBlankPage(page) {
  29  |   const text = (await page.locator('body').innerText().catch(() => '')).trim();
  30  |   expect(text.length, 'Trang bị trắng hoặc render quá ít nội dung').toBeGreaterThan(20);
  31  | }
  32  | 
  33  | async function expectNoCriticalText(page) {
  34  |   const text = await page.locator('body').innerText().catch(() => '');
  35  |   expect(text, 'Không được hiện undefined/null/NaN/[object Object]/lorem ipsum').not.toMatch(badTextRegex);
  36  | }
  37  | 
  38  | async function expectNoUnexpectedNotImplemented(page) {
  39  |   const text = await page.locator('body').innerText().catch(() => '');
  40  |   expect(text, 'Có dấu hiệu chức năng chỉ mới mock/coming soon/chưa hoàn thiện').not.toMatch(notImplementedRegex);
  41  | }
  42  | 
  43  | async function expectNoErrorPage(page, allowAuthRedirect = false) {
  44  |   const text = await page.locator('body').innerText().catch(() => '');
  45  |   if (allowAuthRedirect && /đăng nhập|login|từ chối|không có quyền|unauthorized/i.test(text)) return;
  46  |   expect(text, 'Route bị 404 hoặc trang không tìm thấy').not.toMatch(errorPageRegex);
  47  | }
  48  | 
  49  | async function expectNoHorizontalOverflow(page) {
  50  |   const overflow = await page.evaluate(() => {
  51  |     const doc = document.documentElement;
  52  |     return Math.max(document.body.scrollWidth, doc.scrollWidth) - doc.clientWidth;
  53  |   });
  54  |   expect(overflow, `Trang bị tràn ngang ${overflow}px`).toBeLessThanOrEqual(5);
  55  | }
  56  | 
  57  | async function expectImagesHealthy(page) {
  58  |   const broken = await page.$$eval('img', imgs => imgs
  59  |     .filter(img => img.offsetParent !== null)
  60  |     .map(img => ({ src: img.currentSrc || img.src, width: img.naturalWidth, height: img.naturalHeight, alt: img.alt }))
  61  |     .filter(img => !img.width || !img.height)
  62  |   );
> 63  |   expect(broken, 'Có ảnh bị lỗi tải hoặc naturalWidth/naturalHeight = 0').toEqual([]);
      |                                                                           ^ Error: Có ảnh bị lỗi tải hoặc naturalWidth/naturalHeight = 0
  64  | }
  65  | 
  66  | async function clickByAny(page, candidates, options = {}) {
  67  |   for (const candidate of candidates) {
  68  |     const locator = typeof candidate === 'string'
  69  |       ? page.getByText(candidate, { exact: false }).first()
  70  |       : page.getByText(candidate).first();
  71  |     if (await locator.count() && await locator.isVisible().catch(() => false)) {
  72  |       await locator.click(options).catch(async () => {
  73  |         await locator.click({ force: true, ...options });
  74  |       });
  75  |       await page.waitForLoadState('domcontentloaded').catch(() => {});
  76  |       return true;
  77  |     }
  78  |   }
  79  |   return false;
  80  | }
  81  | 
  82  | async function fillFirst(page, selectors, value) {
  83  |   for (const selector of selectors) {
  84  |     const loc = page.locator(selector).first();
  85  |     if (await loc.count() && await loc.isVisible().catch(() => false)) {
  86  |       await loc.fill(value);
  87  |       return true;
  88  |     }
  89  |   }
  90  |   return false;
  91  | }
  92  | 
  93  | async function login(page, email, password) {
  94  |   await gotoAndReady(page, '/dang-nhap');
  95  |   const emailFilled = await fillFirst(page, [
  96  |     'input[type="email"]',
  97  |     'input[name="email"]',
  98  |     'input[placeholder*="email" i]',
  99  |     'input[placeholder*="Email" i]'
  100 |   ], email);
  101 |   const passwordFilled = await fillFirst(page, [
  102 |     'input[type="password"]',
  103 |     'input[name="password"]',
  104 |     'input[placeholder*="mật khẩu" i]',
  105 |     'input[placeholder*="password" i]'
  106 |   ], password);
  107 |   expect(emailFilled, 'Không tìm thấy input email ở trang đăng nhập').toBeTruthy();
  108 |   expect(passwordFilled, 'Không tìm thấy input password ở trang đăng nhập').toBeTruthy();
  109 |   const clicked = await clickByAny(page, [/đăng nhập/i, /login/i, /sign in/i]);
  110 |   if (!clicked) await page.locator('button[type="submit"], input[type="submit"]').first().click();
  111 |   await page.waitForLoadState('networkidle').catch(() => {});
  112 |   // Đợi cho đến khi URL chuyển khỏi trang /dang-nhap
  113 |   await page.waitForURL(url => !url.pathname.includes('/dang-nhap'), { timeout: 10000 }).catch(() => {});
  114 |   await page.waitForTimeout(1000);
  115 | }
  116 | 
  117 | async function scanClickableInventory(page) {
  118 |   return await page.$$eval('a,button,[role="button"],input[type="button"],input[type="submit"]', els => els.map((el, index) => ({
  119 |     index,
  120 |     tag: el.tagName.toLowerCase(),
  121 |     text: (el.innerText || el.value || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().slice(0, 80),
  122 |     href: el.getAttribute('href'),
  123 |     disabled: !!el.disabled || el.getAttribute('aria-disabled') === 'true',
  124 |     visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
  125 |     className: String(el.className || '').slice(0, 120)
  126 |   })));
  127 | }
  128 | 
  129 | async function saveJson(fileName, data) {
  130 |   const dir = path.join(process.cwd(), 'test-results');
  131 |   fs.mkdirSync(dir, { recursive: true });
  132 |   fs.writeFileSync(path.join(dir, fileName), JSON.stringify(data, null, 2), 'utf8');
  133 | }
  134 | 
  135 | async function assertClickablesNotEmpty(page, min = 1) {
  136 |   const inventory = await scanClickableInventory(page);
  137 |   const visible = inventory.filter(x => x.visible && !x.disabled);
  138 |   expect(visible.length, `Trang có quá ít nút/link khả dụng: ${visible.length}`).toBeGreaterThanOrEqual(min);
  139 |   const nameless = visible.filter(x => !x.text && !x.href && !/icon|btn|button/i.test(x.className));
  140 |   expect(nameless.length, 'Có nút/link không có text, aria-label, title hoặc href rõ ràng').toBeLessThanOrEqual(5);
  141 | }
  142 | 
  143 | async function clickSafeButtons(page, maxClicks = 12) {
  144 |   const locators = await page.locator('button, [role="button"]').all();
  145 |   const results = [];
  146 |   for (const loc of locators.slice(0, 50)) {
  147 |     const text = ((await loc.innerText().catch(() => '')) || (await loc.getAttribute('aria-label').catch(() => '')) || '').trim();
  148 |     if (!text || destructiveRegex.test(text)) continue;
  149 |     if (!(await loc.isVisible().catch(() => false))) continue;
  150 |     if (await loc.isDisabled().catch(() => false)) continue;
  151 |     const beforeURL = page.url();
  152 |     const beforeText = (await page.locator('body').innerText().catch(() => '')).length;
  153 |     await loc.click().catch(() => null);
  154 |     await page.waitForTimeout(250);
  155 |     const afterURL = page.url();
  156 |     const afterText = (await page.locator('body').innerText().catch(() => '')).length;
  157 |     results.push({ text, beforeURL, afterURL, changed: beforeURL !== afterURL || Math.abs(afterText - beforeText) > 5 });
  158 |     if (results.length >= maxClicks) break;
  159 |   }
  160 |   return results;
  161 | }
  162 | 
  163 | module.exports = {
```