# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 06-community.spec.js >> EXANH-006 Community Page - cộng đồng >> EX-067 Ảnh/card cộng đồng không méo/lỗi
- Location: tests\06-community.spec.js:59:3

# Error details

```
Error: Có ảnh bị lỗi tải hoặc naturalWidth/naturalHeight = 0

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 32

- Array []
+ Array [
+   Object {
+     "alt": "Nhóm sinh viên đang chia sẻ kinh nghiệm sống xanh",
+     "height": 0,
+     "src": "http://localhost:5173/images/fallback-green.jpg",
+     "width": 0,
+   },
+   Object {
+     "alt": "Avatar người dùng",
+     "height": 0,
+     "src": "http://localhost:5173/images/fallback-green.jpg",
+     "width": 0,
+   },
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
          - img "E-XANH" [ref=e21]
        - button "Mở menu" [ref=e22] [cursor=pointer]:
          - img [ref=e23]
    - main [ref=e25]:
      - generic [ref=e26]:
        - generic [ref=e27]:
          - generic [ref=e28]:
            - generic [ref=e29]: Không gian chia sẻ sống xanh
            - heading "Cộng đồng E-XANH" [level=1] [ref=e30]
            - paragraph [ref=e31]: Chia sẻ kinh nghiệm tiết kiệm điện, đặt câu hỏi, lưu lại mẹo hữu ích và cùng lan tỏa thói quen sống xanh mỗi ngày.
            - generic [ref=e32]:
              - link "Viết bài chia sẻ" [ref=e33] [cursor=pointer]:
                - /url: /dang-bai
              - link "Khám phá bài viết" [ref=e34] [cursor=pointer]:
                - /url: "#cong-dong-feed"
          - img "Nhóm sinh viên đang chia sẻ kinh nghiệm sống xanh" [ref=e36]
        - generic [ref=e37]:
          - generic [ref=e38]:
            - generic [ref=e39]:
              - generic [ref=e40]:
                - img "Avatar người dùng" [ref=e41]
                - link "Bạn muốn chia sẻ mẹo tiết kiệm điện nào?" [ref=e42] [cursor=pointer]:
                  - /url: /dang-bai
                - link "Viết bài chia sẻ" [ref=e43] [cursor=pointer]:
                  - /url: /dang-bai
              - generic [ref=e44]:
                - link "Ảnh" [ref=e45] [cursor=pointer]:
                  - /url: /dang-bai
                - link "Chủ đề" [ref=e46] [cursor=pointer]:
                  - /url: /dang-bai
                - link "Mẹo nhanh" [ref=e47] [cursor=pointer]:
                  - /url: /dang-bai
            - tablist "Bộ lọc cộng đồng" [ref=e48]:
              - button "Tất cả" [ref=e49] [cursor=pointer]
              - button "Mới nhất" [ref=e50] [cursor=pointer]
              - button "Nhiều tương tác" [ref=e51] [cursor=pointer]
              - button "Hỏi đáp" [ref=e52] [cursor=pointer]
              - button "Kinh nghiệm" [ref=e53] [cursor=pointer]
              - button "Đã lưu nhiều" [ref=e54] [cursor=pointer]
            - generic [ref=e55]:
              - article [ref=e56] [cursor=pointer]:
                - generic [ref=e57]:
                  - generic [ref=e58]:
                    - img "vanhkhuc" [ref=e59]
                    - generic [ref=e60]:
                      - strong [ref=e61]: vanhkhuc
                      - generic [ref=e62]: 9/6/2026 • Quản trị viên
                  - generic [ref=e63]: ...
                - generic [ref=e64]:
                  - generic [ref=e65]: Cộng đồng
                  - generic [ref=e66]: Chia sẻ
                - link "hehihihihihihihihehihihihihihihihehihihihihihihi hehihihihihihihihehihihihihihihi" [ref=e68]:
                  - /url: /cong-dong/8682dc7c-55a6-4996-a716-3eb8c85c4547
                  - heading "hehihihihihihihihehihihihihihihihehihihihihihihi" [level=2] [ref=e69]
                  - paragraph [ref=e70]: hehihihihihihihihehihihihihihihi
                - link "hehihihihihihihihehihihihihihihihehihihihihihihi" [ref=e72]:
                  - /url: /cong-dong/8682dc7c-55a6-4996-a716-3eb8c85c4547
                  - img "hehihihihihihihihehihihihihihihihehihihihihihihi" [ref=e73]
                - generic [ref=e74]:
                  - button "Thích 0" [ref=e75]:
                    - img [ref=e76]
                    - text: Thích 0
                  - button "Bình luận 0" [ref=e78]:
                    - img [ref=e79]
                    - text: Bình luận 0
                  - button "Lưu bài 0" [ref=e81]:
                    - img [ref=e82]
                    - text: Lưu bài 0
                  - button "Chia sẻ 0" [ref=e85]:
                    - img [ref=e86]
                    - text: Chia sẻ 0
              - article [ref=e88] [cursor=pointer]:
                - generic [ref=e89]:
                  - generic [ref=e90]:
                    - img "vanhkhuc" [ref=e91]
                    - generic [ref=e92]:
                      - strong [ref=e93]: vanhkhuc
                      - generic [ref=e94]: 9/6/2026 • Quản trị viên
                  - generic [ref=e95]: ...
                - generic [ref=e96]:
                  - generic [ref=e97]: Cộng đồng
                  - generic [ref=e98]: Chia sẻ
                - link "hehihihihihihihi hehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihi..." [ref=e100]:
                  - /url: /cong-dong/c93b7b10-6b20-418e-9f67-d658ec03461a
                  - heading "hehihihihihihihi" [level=2] [ref=e101]
                  - paragraph [ref=e102]: hehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihi...
                - link "hehihihihihihihi" [ref=e104]:
                  - /url: /cong-dong/c93b7b10-6b20-418e-9f67-d658ec03461a
                  - img "hehihihihihihihi" [ref=e105]
                - generic [ref=e106]:
                  - button "Thích 0" [ref=e107]:
                    - img [ref=e108]
                    - text: Thích 0
                  - button "Bình luận 0" [ref=e110]:
                    - img [ref=e111]
                    - text: Bình luận 0
                  - button "Lưu bài 0" [ref=e113]:
                    - img [ref=e114]
                    - text: Lưu bài 0
                  - button "Chia sẻ 0" [ref=e117]:
                    - img [ref=e118]
                    - text: Chia sẻ 0
              - article [ref=e120] [cursor=pointer]:
                - generic [ref=e121]:
                  - generic [ref=e122]:
                    - img "vanhkhuc" [ref=e123]
                    - generic [ref=e124]:
                      - strong [ref=e125]: vanhkhuc
                      - generic [ref=e126]: 9/6/2026 • Quản trị viên
                  - generic [ref=e127]: ...
                - generic [ref=e128]:
                  - generic [ref=e129]: Cộng đồng
                  - generic [ref=e130]: Chia sẻ
                - link "Đẹp ko ạ vanhkhucvanhkhucvanhkhuc" [ref=e132]:
                  - /url: /cong-dong/cc489db2-1d05-4113-ae04-58fb61f21ccd
                  - heading "Đẹp ko ạ" [level=2] [ref=e133]
                  - paragraph [ref=e134]: vanhkhucvanhkhucvanhkhuc
                - link "Đẹp ko ạ" [ref=e136]:
                  - /url: /cong-dong/cc489db2-1d05-4113-ae04-58fb61f21ccd
                  - img "Đẹp ko ạ" [ref=e137]
                - generic [ref=e138]:
                  - button "Thích 0" [ref=e139]:
                    - img [ref=e140]
                    - text: Thích 0
                  - button "Bình luận 0" [ref=e142]:
                    - img [ref=e143]
                    - text: Bình luận 0
                  - button "Lưu bài 0" [ref=e145]:
                    - img [ref=e146]
                    - text: Lưu bài 0
                  - button "Chia sẻ 0" [ref=e149]:
                    - img [ref=e150]
                    - text: Chia sẻ 0
          - complementary [ref=e152]:
            - generic [ref=e153]:
              - heading "Thành viên tích cực" [level=2] [ref=e154]
              - generic [ref=e155]:
                - article [ref=e156]:
                  - img "Khánh Linh" [ref=e157]
                  - generic [ref=e158]:
                    - strong [ref=e159]: Khánh Linh
                    - text: 42 bài chia sẻ
                  - emphasis [ref=e160]: "#1"
                - article [ref=e161]:
                  - img "Đức Minh" [ref=e162]
                  - generic [ref=e163]:
                    - strong [ref=e164]: Đức Minh
                    - text: 38 bài chia sẻ
                  - emphasis [ref=e165]: "#2"
                - article [ref=e166]:
                  - img "Lan Anh" [ref=e167]
                  - generic [ref=e168]:
                    - strong [ref=e169]: Lan Anh
                    - text: 26 bài chia sẻ
                  - emphasis [ref=e170]: Gợi ý hay
            - generic [ref=e171]:
              - heading "Chủ đề đang thảo luận" [level=2] [ref=e172]
              - generic [ref=e173]:
                - generic [ref=e174]: "#ĐiềuHòaMùaHè"
                - generic [ref=e175]: "#PhòngTrọXanh"
                - generic [ref=e176]: "#TủLạnh"
                - generic [ref=e177]: "#GócHọcTập"
                - generic [ref=e178]: "#SinhViênTiếtKiệm"
            - generic [ref=e179]:
              - heading "Quy tắc cộng đồng" [level=2] [ref=e180]
              - list [ref=e181]:
                - listitem [ref=e182]: Tôn trọng mọi thành viên và góc nhìn khác nhau.
                - listitem [ref=e183]: Ưu tiên chia sẻ thông tin hữu ích, thực tế và có trải nghiệm thật.
                - listitem [ref=e184]: Không spam, không quảng cáo sai sự thật hoặc gây hiểu nhầm.
            - generic [ref=e185]:
              - heading "Bài viết được yêu thích" [level=2] [ref=e186]
              - generic [ref=e187]:
                - article [ref=e188]:
                  - strong [ref=e189]: Checklist 30 giây trước khi rời phòng
                  - generic [ref=e190]: 302 thích • 45 bình luận
                - article [ref=e191]:
                  - strong [ref=e192]: Cách dùng điều hòa tiết kiệm hơn
                  - generic [ref=e193]: 214 thích • 29 bình luận
                - article [ref=e194]:
                  - strong [ref=e195]: Có nên rút sạc laptop khi pin đầy?
                  - generic [ref=e196]: 45 thích • 18 bình luận
            - generic [ref=e197]:
              - heading "Có kinh nghiệm hay?" [level=2] [ref=e198]
              - paragraph [ref=e199]: Chia sẻ bài viết của bạn với cộng đồng E-XANH để cùng nhau lan tỏa lối sống xanh.
              - link "Đăng bài ngay" [ref=e200] [cursor=pointer]:
                - /url: /dang-bai
    - contentinfo [ref=e201]:
      - generic [ref=e202]:
        - generic [ref=e203]:
          - link "E-XANH về trang chủ" [ref=e204] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e205]
          - paragraph [ref=e206]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e207]:
          - link "Trang chủ" [ref=e208] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e209] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e210] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e211] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e212] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e213] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e214] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e216]: © 2024 E-XANH. Made by VanhKhucDev
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
  112 | }
  113 | 
  114 | async function scanClickableInventory(page) {
  115 |   return await page.$$eval('a,button,[role="button"],input[type="button"],input[type="submit"]', els => els.map((el, index) => ({
  116 |     index,
  117 |     tag: el.tagName.toLowerCase(),
  118 |     text: (el.innerText || el.value || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().slice(0, 80),
  119 |     href: el.getAttribute('href'),
  120 |     disabled: !!el.disabled || el.getAttribute('aria-disabled') === 'true',
  121 |     visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
  122 |     className: String(el.className || '').slice(0, 120)
  123 |   })));
  124 | }
  125 | 
  126 | async function saveJson(fileName, data) {
  127 |   const dir = path.join(process.cwd(), 'test-results');
  128 |   fs.mkdirSync(dir, { recursive: true });
  129 |   fs.writeFileSync(path.join(dir, fileName), JSON.stringify(data, null, 2), 'utf8');
  130 | }
  131 | 
  132 | async function assertClickablesNotEmpty(page, min = 1) {
  133 |   const inventory = await scanClickableInventory(page);
  134 |   const visible = inventory.filter(x => x.visible && !x.disabled);
  135 |   expect(visible.length, `Trang có quá ít nút/link khả dụng: ${visible.length}`).toBeGreaterThanOrEqual(min);
  136 |   const nameless = visible.filter(x => !x.text && !x.href && !/icon|btn|button/i.test(x.className));
  137 |   expect(nameless.length, 'Có nút/link không có text, aria-label, title hoặc href rõ ràng').toBeLessThanOrEqual(5);
  138 | }
  139 | 
  140 | async function clickSafeButtons(page, maxClicks = 12) {
  141 |   const locators = await page.locator('button, [role="button"]').all();
  142 |   const results = [];
  143 |   for (const loc of locators.slice(0, 50)) {
  144 |     const text = ((await loc.innerText().catch(() => '')) || (await loc.getAttribute('aria-label').catch(() => '')) || '').trim();
  145 |     if (!text || destructiveRegex.test(text)) continue;
  146 |     if (!(await loc.isVisible().catch(() => false))) continue;
  147 |     if (await loc.isDisabled().catch(() => false)) continue;
  148 |     const beforeURL = page.url();
  149 |     const beforeText = (await page.locator('body').innerText().catch(() => '')).length;
  150 |     await loc.click().catch(() => null);
  151 |     await page.waitForTimeout(250);
  152 |     const afterURL = page.url();
  153 |     const afterText = (await page.locator('body').innerText().catch(() => '')).length;
  154 |     results.push({ text, beforeURL, afterURL, changed: beforeURL !== afterURL || Math.abs(afterText - beforeText) > 5 });
  155 |     if (results.length >= maxClicks) break;
  156 |   }
  157 |   return results;
  158 | }
  159 | 
  160 | module.exports = {
  161 |   collectPageErrors,
  162 |   gotoAndReady,
  163 |   expectNoBlankPage,
```