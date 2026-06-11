# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 18-uiux-accessibility.spec.js >> EXANH-018 UI/UX small defects + accessibility lite >> EX-UX /kiem-tra-tien-dien không có text rác/ảnh lỗi
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
+     "alt": "Minh họa bảng điều khiển điện năng E-XANH",
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
            - generic [ref=e38]: Công cụ thông minh
            - heading "Kiểm tra tiền điện hằng tháng" [level=1] [ref=e39]
            - paragraph [ref=e40]: Nhập thiết bị bạn đang sử dụng để ước tính chi phí điện, tìm thiết bị tiêu hao nhiều nhất và nhận gợi ý tiết kiệm phù hợp.
            - generic [ref=e41]:
              - link "Bắt đầu tính" [ref=e42] [cursor=pointer]:
                - /url: "#cong-cu-dien"
              - link "Xem cách hoạt động" [ref=e43] [cursor=pointer]:
                - /url: "#cach-tinh"
          - generic [ref=e44]:
            - img "Minh họa bảng điều khiển điện năng E-XANH" [ref=e45]
            - generic [ref=e46]:
              - generic [ref=e47]: Dự kiến
              - strong [ref=e48]: 520.000đ/tháng
            - generic [ref=e49]:
              - generic [ref=e50]: Tốn nhất
              - strong [ref=e51]: Điều hòa
            - generic [ref=e52]:
              - generic [ref=e53]: Tiết kiệm gợi ý
              - strong [ref=e54]: 15%
        - generic [ref=e55]:
          - generic [ref=e56]:
            - generic [ref=e57]:
              - heading "Thiết bị của bạn" [level=2] [ref=e58]
              - paragraph [ref=e59]: Thêm các thiết bị điện bạn dùng thường xuyên để E-XANH ước tính chi phí.
              - generic [ref=e60]:
                - generic [ref=e61]:
                  - generic [ref=e62]: Loại thiết bị
                  - combobox "Loại thiết bị" [ref=e63]:
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
                - generic [ref=e64]:
                  - generic [ref=e65]: Công suất (W)
                  - spinbutton "Công suất (W)" [ref=e66]: "850"
                - generic [ref=e67]:
                  - generic [ref=e68]: Giờ dùng / Ngày
                  - spinbutton "Giờ dùng / Ngày" [ref=e69]
                - generic [ref=e70]:
                  - generic [ref=e71]: Ngày dùng / Tháng
                  - spinbutton "Ngày dùng / Tháng" [ref=e72]
              - button "Thêm thiết bị" [ref=e73] [cursor=pointer]
            - generic [ref=e74]:
              - article [ref=e75]:
                - generic [ref=e76]:
                  - heading "Điều hòa 9000BTU" [level=3] [ref=e77]
                  - paragraph [ref=e78]: 850W • 8h/ngày • 30 ngày
                - generic [ref=e79]:
                  - strong [ref=e80]: 204 kWh
                  - button "Xóa" [ref=e81] [cursor=pointer]
              - article [ref=e82]:
                - generic [ref=e83]:
                  - heading "Laptop" [level=3] [ref=e84]
                  - paragraph [ref=e85]: 65W • 10h/ngày • 22 ngày
                - generic [ref=e86]:
                  - strong [ref=e87]: 14.3 kWh
                  - button "Xóa" [ref=e88] [cursor=pointer]
            - generic [ref=e89]:
              - button "Tính tiền điện" [ref=e90] [cursor=pointer]
              - button "Làm mới" [ref=e91] [cursor=pointer]
            - button "Lưu lịch sử" [ref=e93] [cursor=pointer]
          - generic [ref=e94]:
            - generic [ref=e95]:
              - generic [ref=e96]: Tiền điện dự kiến
              - generic [ref=e97]: 523.920đ
              - paragraph [ref=e98]: Dựa trên đơn giá điện sinh hoạt tạm tính 2.400đ/kWh.
              - generic [ref=e99]:
                - generic [ref=e100]:
                  - text: Tổng điện năng
                  - strong [ref=e101]: 218.3 kWh
                - generic [ref=e102]:
                  - text: Thiết bị tốn nhất
                  - strong [ref=e103]: Điều hòa 9000BTU
                - generic [ref=e104]:
                  - text: Có thể tiết kiệm
                  - strong [ref=e105]: 15–20%
            - generic [ref=e106]:
              - heading "Phân bổ tiêu thụ" [level=3] [ref=e107]
              - generic [ref=e108]:
                - generic [ref=e110]:
                  - generic [ref=e111]: Điều hòa 9000BTU
                  - generic [ref=e112]: 204 kWh • 93%
                - generic [ref=e116]:
                  - generic [ref=e117]: Laptop
                  - generic [ref=e118]: 14.3 kWh • 7%
        - generic [ref=e121]:
          - generic [ref=e123]:
            - heading "Gợi ý tiết kiệm dành cho bạn" [level=2] [ref=e124]
            - paragraph [ref=e125]: Dựa trên các thiết bị bạn đang sử dụng
          - generic [ref=e126]:
            - article [ref=e127]:
              - generic [ref=e128]: Nhiệt
              - heading "Đặt điều hòa 26–28°C" [level=3] [ref=e129]
              - paragraph [ref=e130]: Tăng 1 độ C có thể giúp giảm tới 3% điện năng tiêu thụ của máy lạnh.
            - article [ref=e131]:
              - generic [ref=e132]: Pin
              - heading "Không sạc thiết bị qua đêm" [level=3] [ref=e133]
              - paragraph [ref=e134]: Ngắt sạc laptop, điện thoại khi đầy để tránh rò rỉ điện và chai pin.
            - article [ref=e135]:
              - generic [ref=e136]: Tắt
              - heading "Tắt thiết bị ở chế độ chờ" [level=3] [ref=e137]
              - paragraph [ref=e138]: Rút phích cắm TV, loa khi không dùng vì chế độ chờ vẫn tiêu thụ điện ngầm.
            - article [ref=e139]:
              - generic [ref=e140]: Sáng
              - heading "Tận dụng ánh sáng tự nhiên" [level=3] [ref=e141]
              - paragraph [ref=e142]: Mở cửa sổ thay vì bật đèn vào ban ngày để giảm tải hệ thống chiếu sáng.
        - generic [ref=e143]:
          - generic [ref=e144]:
            - heading "Lịch sử kiểm tra gần đây" [level=2] [ref=e145]
            - link "Xem lịch sử đầy đủ" [ref=e146] [cursor=pointer]:
              - /url: /lich-su-kiem-tra
          - generic [ref=e147]:
            - generic [ref=e148]:
              - generic [ref=e149]: Ngày
              - generic [ref=e150]: Thiết bị
              - generic [ref=e151]: Tiêu thụ
              - generic [ref=e152]: Thành tiền
            - generic [ref=e153]:
              - generic [ref=e154]: 12/06/2024
              - generic [ref=e155]: 3 thiết bị
              - generic [ref=e156]: 218.3 kWh
              - strong [ref=e157]: 520.000đ
            - generic [ref=e158]:
              - generic [ref=e159]: 08/06/2024
              - generic [ref=e160]: 4 thiết bị
              - generic [ref=e161]: 156 kWh
              - strong [ref=e162]: 420.000đ
            - generic [ref=e163]:
              - generic [ref=e164]: 01/06/2024
              - generic [ref=e165]: 2 thiết bị
              - generic [ref=e166]: 132 kWh
              - strong [ref=e167]: 360.000đ
          - paragraph [ref=e168]: Đăng nhập để lưu lại lịch sử kiểm tra tiền điện của bạn.
        - generic [ref=e169]:
          - generic [ref=e170]:
            - heading "E-XANH tính như thế nào?" [level=2] [ref=e171]
            - paragraph [ref=e172]: Số điện tiêu thụ = Công suất thiết bị × Thời gian sử dụng / 1000
          - generic [ref=e173]:
            - generic [ref=e174]:
              - generic [ref=e175]: Số điện tiêu thụ (kWh)
              - strong [ref=e176]: Công suất (W) × Thời gian (h)
              - generic [ref=e177]: "1000"
            - paragraph [ref=e179]:
              - text: Điều hòa 850W dùng 8 giờ/ngày trong 30 ngày sẽ tiêu thụ khoảng
              - strong [ref=e180]: 204 kWh
              - text: .
    - contentinfo [ref=e181]:
      - generic [ref=e182]:
        - generic [ref=e183]:
          - link "E-XANH về trang chủ" [ref=e184] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e185]
          - paragraph [ref=e186]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e187]:
          - link "Trang chủ" [ref=e188] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e189] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e190] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e191] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e192] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e193] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e194] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e196]: © 2024 E-XANH. Made by VanhKhucDev
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