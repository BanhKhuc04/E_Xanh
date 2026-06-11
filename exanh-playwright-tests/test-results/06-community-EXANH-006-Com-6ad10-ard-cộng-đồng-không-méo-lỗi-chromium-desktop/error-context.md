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
        - navigation "Điều hướng người dùng" [ref=e25]:
          - link "Trang chủ" [ref=e26] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e27] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e28] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e29] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Bài đã lưu" [ref=e30] [cursor=pointer]:
            - /url: /bai-da-luu
        - generic [ref=e31]:
          - link "Đăng nhập" [ref=e32] [cursor=pointer]:
            - /url: /dang-nhap
          - link "Đăng bài" [ref=e33] [cursor=pointer]:
            - /url: /dang-bai
    - main [ref=e34]:
      - generic [ref=e35]:
        - generic [ref=e36]:
          - generic [ref=e37]:
            - generic [ref=e38]: Không gian chia sẻ sống xanh
            - heading "Cộng đồng E-XANH" [level=1] [ref=e39]
            - paragraph [ref=e40]: Chia sẻ kinh nghiệm tiết kiệm điện, đặt câu hỏi, lưu lại mẹo hữu ích và cùng lan tỏa thói quen sống xanh mỗi ngày.
            - generic [ref=e41]:
              - link "Viết bài chia sẻ" [ref=e42] [cursor=pointer]:
                - /url: /dang-bai
              - link "Khám phá bài viết" [ref=e43] [cursor=pointer]:
                - /url: "#cong-dong-feed"
          - img "Nhóm sinh viên đang chia sẻ kinh nghiệm sống xanh" [ref=e45]
        - generic [ref=e46]:
          - generic [ref=e47]:
            - generic [ref=e48]:
              - generic [ref=e49]:
                - img "Avatar người dùng" [ref=e50]
                - link "Bạn muốn chia sẻ mẹo tiết kiệm điện nào?" [ref=e51] [cursor=pointer]:
                  - /url: /dang-bai
                - link "Viết bài chia sẻ" [ref=e52] [cursor=pointer]:
                  - /url: /dang-bai
              - generic [ref=e53]:
                - link "Ảnh" [ref=e54] [cursor=pointer]:
                  - /url: /dang-bai
                - link "Chủ đề" [ref=e55] [cursor=pointer]:
                  - /url: /dang-bai
                - link "Mẹo nhanh" [ref=e56] [cursor=pointer]:
                  - /url: /dang-bai
            - tablist "Bộ lọc cộng đồng" [ref=e57]:
              - button "Tất cả" [ref=e58] [cursor=pointer]
              - button "Mới nhất" [ref=e59] [cursor=pointer]
              - button "Nhiều tương tác" [ref=e60] [cursor=pointer]
              - button "Hỏi đáp" [ref=e61] [cursor=pointer]
              - button "Kinh nghiệm" [ref=e62] [cursor=pointer]
              - button "Đã lưu nhiều" [ref=e63] [cursor=pointer]
            - generic [ref=e64]:
              - article [ref=e65] [cursor=pointer]:
                - generic [ref=e66]:
                  - generic [ref=e67]:
                    - img "vanhkhuc" [ref=e68]
                    - generic [ref=e69]:
                      - strong [ref=e70]: vanhkhuc
                      - generic [ref=e71]: 9/6/2026 • Quản trị viên
                  - generic [ref=e72]: ...
                - generic [ref=e73]:
                  - generic [ref=e74]: Cộng đồng
                  - generic [ref=e75]: Chia sẻ
                - link "hehihihihihihihihehihihihihihihihehihihihihihihi hehihihihihihihihehihihihihihihi" [ref=e77]:
                  - /url: /cong-dong/8682dc7c-55a6-4996-a716-3eb8c85c4547
                  - heading "hehihihihihihihihehihihihihihihihehihihihihihihi" [level=2] [ref=e78]
                  - paragraph [ref=e79]: hehihihihihihihihehihihihihihihi
                - link "hehihihihihihihihehihihihihihihihehihihihihihihi" [ref=e81]:
                  - /url: /cong-dong/8682dc7c-55a6-4996-a716-3eb8c85c4547
                  - img "hehihihihihihihihehihihihihihihihehihihihihihihi" [ref=e82]
                - generic [ref=e83]:
                  - button "Thích 0" [ref=e84]:
                    - img [ref=e85]
                    - text: Thích 0
                  - button "Bình luận 0" [ref=e87]:
                    - img [ref=e88]
                    - text: Bình luận 0
                  - button "Lưu bài 0" [ref=e90]:
                    - img [ref=e91]
                    - text: Lưu bài 0
                  - button "Chia sẻ 0" [ref=e94]:
                    - img [ref=e95]
                    - text: Chia sẻ 0
              - article [ref=e97] [cursor=pointer]:
                - generic [ref=e98]:
                  - generic [ref=e99]:
                    - img "vanhkhuc" [ref=e100]
                    - generic [ref=e101]:
                      - strong [ref=e102]: vanhkhuc
                      - generic [ref=e103]: 9/6/2026 • Quản trị viên
                  - generic [ref=e104]: ...
                - generic [ref=e105]:
                  - generic [ref=e106]: Cộng đồng
                  - generic [ref=e107]: Chia sẻ
                - link "hehihihihihihihi hehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihi..." [ref=e109]:
                  - /url: /cong-dong/c93b7b10-6b20-418e-9f67-d658ec03461a
                  - heading "hehihihihihihihi" [level=2] [ref=e110]
                  - paragraph [ref=e111]: hehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihihihihihihihehihi...
                - link "hehihihihihihihi" [ref=e113]:
                  - /url: /cong-dong/c93b7b10-6b20-418e-9f67-d658ec03461a
                  - img "hehihihihihihihi" [ref=e114]
                - generic [ref=e115]:
                  - button "Thích 0" [ref=e116]:
                    - img [ref=e117]
                    - text: Thích 0
                  - button "Bình luận 0" [ref=e119]:
                    - img [ref=e120]
                    - text: Bình luận 0
                  - button "Lưu bài 0" [ref=e122]:
                    - img [ref=e123]
                    - text: Lưu bài 0
                  - button "Chia sẻ 0" [ref=e126]:
                    - img [ref=e127]
                    - text: Chia sẻ 0
              - article [ref=e129] [cursor=pointer]:
                - generic [ref=e130]:
                  - generic [ref=e131]:
                    - img "vanhkhuc" [ref=e132]
                    - generic [ref=e133]:
                      - strong [ref=e134]: vanhkhuc
                      - generic [ref=e135]: 9/6/2026 • Quản trị viên
                  - generic [ref=e136]: ...
                - generic [ref=e137]:
                  - generic [ref=e138]: Cộng đồng
                  - generic [ref=e139]: Chia sẻ
                - link "Đẹp ko ạ vanhkhucvanhkhucvanhkhuc" [ref=e141]:
                  - /url: /cong-dong/cc489db2-1d05-4113-ae04-58fb61f21ccd
                  - heading "Đẹp ko ạ" [level=2] [ref=e142]
                  - paragraph [ref=e143]: vanhkhucvanhkhucvanhkhuc
                - link "Đẹp ko ạ" [ref=e145]:
                  - /url: /cong-dong/cc489db2-1d05-4113-ae04-58fb61f21ccd
                  - img "Đẹp ko ạ" [ref=e146]
                - generic [ref=e147]:
                  - button "Thích 0" [ref=e148]:
                    - img [ref=e149]
                    - text: Thích 0
                  - button "Bình luận 0" [ref=e151]:
                    - img [ref=e152]
                    - text: Bình luận 0
                  - button "Lưu bài 0" [ref=e154]:
                    - img [ref=e155]
                    - text: Lưu bài 0
                  - button "Chia sẻ 0" [ref=e158]:
                    - img [ref=e159]
                    - text: Chia sẻ 0
          - complementary [ref=e161]:
            - generic [ref=e162]:
              - heading "Thành viên tích cực" [level=2] [ref=e163]
              - generic [ref=e164]:
                - article [ref=e165]:
                  - img "Khánh Linh" [ref=e166]
                  - generic [ref=e167]:
                    - strong [ref=e168]: Khánh Linh
                    - text: 42 bài chia sẻ
                  - emphasis [ref=e169]: "#1"
                - article [ref=e170]:
                  - img "Đức Minh" [ref=e171]
                  - generic [ref=e172]:
                    - strong [ref=e173]: Đức Minh
                    - text: 38 bài chia sẻ
                  - emphasis [ref=e174]: "#2"
                - article [ref=e175]:
                  - img "Lan Anh" [ref=e176]
                  - generic [ref=e177]:
                    - strong [ref=e178]: Lan Anh
                    - text: 26 bài chia sẻ
                  - emphasis [ref=e179]: Gợi ý hay
            - generic [ref=e180]:
              - heading "Chủ đề đang thảo luận" [level=2] [ref=e181]
              - generic [ref=e182]:
                - generic [ref=e183]: "#ĐiềuHòaMùaHè"
                - generic [ref=e184]: "#PhòngTrọXanh"
                - generic [ref=e185]: "#TủLạnh"
                - generic [ref=e186]: "#GócHọcTập"
                - generic [ref=e187]: "#SinhViênTiếtKiệm"
            - generic [ref=e188]:
              - heading "Quy tắc cộng đồng" [level=2] [ref=e189]
              - list [ref=e190]:
                - listitem [ref=e191]: Tôn trọng mọi thành viên và góc nhìn khác nhau.
                - listitem [ref=e192]: Ưu tiên chia sẻ thông tin hữu ích, thực tế và có trải nghiệm thật.
                - listitem [ref=e193]: Không spam, không quảng cáo sai sự thật hoặc gây hiểu nhầm.
            - generic [ref=e194]:
              - heading "Bài viết được yêu thích" [level=2] [ref=e195]
              - generic [ref=e196]:
                - article [ref=e197]:
                  - strong [ref=e198]: Checklist 30 giây trước khi rời phòng
                  - generic [ref=e199]: 302 thích • 45 bình luận
                - article [ref=e200]:
                  - strong [ref=e201]: Cách dùng điều hòa tiết kiệm hơn
                  - generic [ref=e202]: 214 thích • 29 bình luận
                - article [ref=e203]:
                  - strong [ref=e204]: Có nên rút sạc laptop khi pin đầy?
                  - generic [ref=e205]: 45 thích • 18 bình luận
            - generic [ref=e206]:
              - heading "Có kinh nghiệm hay?" [level=2] [ref=e207]
              - paragraph [ref=e208]: Chia sẻ bài viết của bạn với cộng đồng E-XANH để cùng nhau lan tỏa lối sống xanh.
              - link "Đăng bài ngay" [ref=e209] [cursor=pointer]:
                - /url: /dang-bai
    - contentinfo [ref=e210]:
      - generic [ref=e211]:
        - generic [ref=e212]:
          - link "E-XANH về trang chủ" [ref=e213] [cursor=pointer]:
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