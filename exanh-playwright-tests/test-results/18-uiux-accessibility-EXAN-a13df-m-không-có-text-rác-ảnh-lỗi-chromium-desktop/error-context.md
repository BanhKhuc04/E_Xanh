# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 18-uiux-accessibility.spec.js >> EXANH-018 UI/UX small defects + accessibility lite >> EX-UX /meo-tiet-kiem không có text rác/ảnh lỗi
- Location: tests\18-uiux-accessibility.spec.js:7:5

# Error details

```
Error: Có ảnh bị lỗi tải hoặc naturalWidth/naturalHeight = 0

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 8

- Array []
+ Array [
+   Object {
+     "alt": "Không gian học tập xanh với các mẹo tiết kiệm điện",
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
            - generic [ref=e38]: Thư viện mẹo tiết kiệm điện
            - heading "Mẹo tiết kiệm điện" [level=1] [ref=e39]
            - paragraph [ref=e40]: Khám phá các mẹo sử dụng điện thông minh, dễ áp dụng và phù hợp với đời sống hằng ngày.
          - generic [ref=e41]:
            - img "Không gian học tập xanh với các mẹo tiết kiệm điện"
        - generic [ref=e42]:
          - generic [ref=e43]:
            - generic [ref=e44]: Tìm kiếm
            - searchbox "Tìm kiếm" [ref=e45]
          - generic "Lọc theo chủ đề" [ref=e46]:
            - button "Tất cả" [ref=e47] [cursor=pointer]
            - button "Điều hòa" [ref=e48] [cursor=pointer]
            - button "Laptop" [ref=e49] [cursor=pointer]
            - button "Tủ lạnh" [ref=e50] [cursor=pointer]
            - button "Thiết bị điện" [ref=e51] [cursor=pointer]
            - button "Thói quen" [ref=e52] [cursor=pointer]
          - generic [ref=e53]:
            - generic [ref=e54]: Sắp xếp
            - combobox "Sắp xếp" [ref=e55]:
              - option "Mới nhất" [selected]
              - option "Nhiều lượt lưu"
              - option "Nhiều tương tác"
        - generic [ref=e56]:
          - article [ref=e59]:
            - generic [ref=e60]:
              - img "Cách để tiết kiệm người yêu" [ref=e61]
              - generic [ref=e62]: Mẹo tiết kiệm
              - button "Lưu bài Cách để tiết kiệm người yêu" [ref=e63] [cursor=pointer]: Lưu
            - generic [ref=e64]:
              - heading "Cách để tiết kiệm người yêu" [level=3] [ref=e65]
              - paragraph [ref=e66]: TÔI THẤY NY XINH
              - generic [ref=e67]:
                - generic [ref=e68]:
                  - generic [ref=e69]: V
                  - generic [ref=e70]:
                    - strong [ref=e71]: vanhkhuc
                    - generic [ref=e72]: 2026-06-07 • 3 phút
                - generic [ref=e73]:
                  - generic [ref=e74]: 0 thích
                  - generic [ref=e75]: 0 bình luận
                  - generic [ref=e76]: 0 lưu
              - link "Đọc tiếp" [ref=e77] [cursor=pointer]:
                - /url: /meo-tiet-kiem/cach-de-tiet-kiem-nguoi-yeu-bcrm
          - complementary [ref=e78]:
            - generic [ref=e79]:
              - heading "Gợi ý hôm nay" [level=2] [ref=e80]
              - paragraph [ref=e81]: Đặt điều hòa ở 26-28°C và kết hợp sử dụng quạt gió. Mỗi độ C tăng lên giúp bạn tiết kiệm khoảng 10% điện năng tiêu thụ.
            - generic [ref=e82]:
              - heading "Chủ đề nổi bật" [level=2] [ref=e83]
              - generic [ref=e84]:
                - button "Điều hòa" [ref=e85] [cursor=pointer]
                - button "Tủ lạnh" [ref=e86] [cursor=pointer]
                - button "Máy giặt" [ref=e87] [cursor=pointer]
                - button "Thiết bị gia dụng" [ref=e88] [cursor=pointer]
                - button "Laptop" [ref=e89] [cursor=pointer]
                - button "Thói quen" [ref=e90] [cursor=pointer]
                - button "Mùa nắng nóng" [ref=e91] [cursor=pointer]
            - generic [ref=e92]:
              - heading "Bài viết được lưu nhiều" [level=2] [ref=e93]
              - generic [ref=e94]:
                - article [ref=e95]:
                  - generic [ref=e96]: TL
                  - generic [ref=e97]:
                    - heading "Mẹo rã đông tủ lạnh đúng cách không tốn điện" [level=3] [ref=e98]
                    - paragraph [ref=e99]: 452 lượt lưu
                - article [ref=e100]:
                  - generic [ref=e101]: MN
                  - generic [ref=e102]:
                    - heading "Sử dụng máy nước nóng lạnh sao cho hiệu quả?" [level=3] [ref=e103]
                    - paragraph [ref=e104]: 389 lượt lưu
                - article [ref=e105]:
                  - generic [ref=e106]: MG
                  - generic [ref=e107]:
                    - heading "Lượng quần áo tối ưu cho mỗi mẻ giặt" [level=3] [ref=e108]
                    - paragraph [ref=e109]: 315 lượt lưu
            - generic [ref=e110]:
              - generic [ref=e111]: ✎
              - heading "Bạn có mẹo hay?" [level=2] [ref=e112]
              - paragraph [ref=e113]: Chia sẻ kinh nghiệm tiết kiệm điện của bạn để lan tỏa lối sống xanh đến cộng đồng.
              - link "Đăng bài chia sẻ" [ref=e114] [cursor=pointer]:
                - /url: /cong-dong
    - contentinfo [ref=e115]:
      - generic [ref=e116]:
        - generic [ref=e117]:
          - link "E-XANH về trang chủ" [ref=e118] [cursor=pointer]:
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