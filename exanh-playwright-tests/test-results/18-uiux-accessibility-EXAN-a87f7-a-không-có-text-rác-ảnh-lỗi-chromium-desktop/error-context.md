# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 18-uiux-accessibility.spec.js >> EXANH-018 UI/UX small defects + accessibility lite >> EX-UX /lich-su-kiem-tra không có text rác/ảnh lỗi
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
+     "alt": "Minh họa lịch sử kiểm tra điện năng",
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
          - link "Trang chủ" [ref=e37] [cursor=pointer]:
            - /url: /
          - generic [ref=e38]: ">"
          - generic [ref=e39]: Lịch sử kiểm tra
        - generic [ref=e40]:
          - generic [ref=e41]:
            - heading "Lịch sử kiểm tra tiền điện" [level=1] [ref=e42]
            - paragraph [ref=e43]: Xem lại các lần kiểm tra tiền điện, so sánh mức tiêu thụ và theo dõi chi phí hằng tháng của bạn.
            - link "Kiểm tra mới" [ref=e44] [cursor=pointer]:
              - /url: /kiem-tra-tien-dien
          - img "Minh họa lịch sử kiểm tra điện năng" [ref=e46]
        - generic [ref=e47]:
          - article [ref=e48]:
            - generic [ref=e49]: Số lần kiểm tra
            - strong [ref=e50]: "0"
          - article [ref=e51]:
            - generic [ref=e52]: Tổng điện năng gần nhất
            - strong [ref=e53]: 0 kWh
          - article [ref=e54]:
            - generic [ref=e55]: Chi phí cao nhất
            - strong [ref=e56]: 0đ
          - article [ref=e57]:
            - generic [ref=e58]: Thiết bị tốn điện nhiều nhất
            - strong [ref=e59]: Chưa có
        - generic [ref=e60]:
          - searchbox "Tìm lịch sử..." [ref=e61]
          - combobox [ref=e62]:
            - option "Tất cả thời gian" [selected]
            - option "7 ngày gần đây"
            - option "30 ngày gần đây"
          - combobox [ref=e63]:
            - option "Tất cả mức chi phí" [selected]
            - option "Dưới 400.000đ"
            - option "400.000đ – 600.000đ"
            - option "Trên 600.000đ"
          - button "Lọc lịch sử" [ref=e64] [cursor=pointer]
          - button "Làm mới" [ref=e65] [cursor=pointer]
        - generic [ref=e66]:
          - generic [ref=e67]: ⚡
          - heading "Bạn chưa có lịch sử kiểm tra tiền điện." [level=2] [ref=e68]
          - paragraph [ref=e69]: Hãy sử dụng công cụ kiểm tra tiền điện để lưu lại kết quả và theo dõi chi phí hằng tháng.
          - link "Kiểm tra tiền điện ngay" [ref=e70] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - generic [ref=e71]:
            - heading "Dữ liệu mẫu tham khảo" [level=3] [ref=e72]
            - generic [ref=e73]:
              - generic [ref=e74]: 12/06/2024
              - strong [ref=e75]: 520.000đ
            - generic [ref=e76]:
              - generic [ref=e77]: 08/06/2024
              - strong [ref=e78]: 420.000đ
            - generic [ref=e79]:
              - generic [ref=e80]: 01/06/2024
              - strong [ref=e81]: 360.000đ
    - contentinfo [ref=e82]:
      - generic [ref=e83]:
        - generic [ref=e84]:
          - link "E-XANH về trang chủ" [ref=e85] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e86]
          - paragraph [ref=e87]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e88]:
          - link "Trang chủ" [ref=e89] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e90] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e91] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e92] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e93] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e94] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e95] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e97]: © 2024 E-XANH. Made by VanhKhucDev
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