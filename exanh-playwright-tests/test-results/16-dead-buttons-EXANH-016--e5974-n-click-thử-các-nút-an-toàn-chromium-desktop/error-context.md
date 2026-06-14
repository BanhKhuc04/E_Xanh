# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 16-dead-buttons.spec.js >> EXANH-016 Dead buttons - rà nút chết/nút giả >> EX-BTN-CLICK /kiem-tra-tien-dien click thử các nút an toàn
- Location: tests\16-dead-buttons.spec.js:16:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: Trang bị trắng hoặc render quá ít nội dung

expect(received).toBeGreaterThan(expected)

Expected: > 20
Received:   0
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - button "Báo cáo lỗi" [ref=e3] [cursor=pointer]:
    - img [ref=e4]
    - text: Báo cáo lỗi
  - generic [ref=e6]:
    - banner [ref=e7]:
      - generic [ref=e8]:
        - link "E-XANH về trang chủ" [ref=e9] [cursor=pointer]:
          - /url: /
          - img "E-XANH" [ref=e11]
        - navigation "Điều hướng người dùng" [ref=e12]:
          - link "Trang chủ" [ref=e13] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e14] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e15] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e16] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Bài đã lưu" [ref=e17] [cursor=pointer]:
            - /url: /bai-da-luu
        - generic [ref=e18]:
          - link "Đăng nhập" [ref=e19] [cursor=pointer]:
            - /url: /dang-nhap
          - button "Đăng bài" [ref=e20] [cursor=pointer]
    - main [ref=e21]:
      - generic [ref=e23]:
        - generic [ref=e24]:
          - generic [ref=e25]:
            - generic [ref=e26]:
              - link "E-XANH về trang chủ" [ref=e28] [cursor=pointer]:
                - /url: /
                - img "E-XANH" [ref=e30]
              - generic [ref=e31]: Cộng đồng sống xanh
            - generic [ref=e32]:
              - heading "Tham gia E-XANH để sống xanh hơn mỗi ngày" [level=1] [ref=e33]:
                - text: Tham gia E-XANH
                - text: để sống xanh hơn
                - text: mỗi ngày
              - paragraph [ref=e34]: Một tài khoản E-XANH giúp bạn lưu bài viết, tham gia cộng đồng và theo dõi thói quen sử dụng điện cá nhân.
              - generic [ref=e35]:
                - generic [ref=e36]: Lưu bài viết
                - generic [ref=e37]: •
                - generic [ref=e38]: Bình luận
                - generic [ref=e39]: •
                - generic [ref=e40]: Theo dõi điện năng
          - generic [ref=e42]:
            - img "banner_cropped.jpeg" [ref=e45]
            - img "auth-hero.jpeg" [ref=e48]
            - img "auth-hero.jpeg" [ref=e51]
            - generic [ref=e52]:
              - button "Go to slide 1" [ref=e53] [cursor=pointer]
              - button "Go to slide 2" [ref=e55] [cursor=pointer]
              - button "Go to slide 3" [ref=e57] [cursor=pointer]
        - generic [ref=e59]:
          - generic [ref=e60]:
            - heading "Chào mừng trở lại" [level=2] [ref=e61]
            - paragraph [ref=e62]: Đăng nhập để tiếp tục hành trình sống xanh cùng E-XANH.
          - generic [ref=e63]:
            - generic [ref=e64]: Đăng nhập
            - link "Đăng ký" [ref=e65] [cursor=pointer]:
              - /url: /dang-ky
          - alert [ref=e66]: Vui lòng nhập email.
          - generic [ref=e67]:
            - generic [ref=e68]:
              - generic [ref=e69]: Email
              - textbox "Email" [ref=e70]:
                - /placeholder: Nhập email của bạn
            - generic [ref=e71]:
              - generic [ref=e72]: Mật khẩu
              - textbox "Mật khẩu" [ref=e73]:
                - /placeholder: Nhập mật khẩu
            - generic [ref=e74]:
              - generic [ref=e75]:
                - checkbox "Ghi nhớ đăng nhập" [ref=e76]
                - generic [ref=e77]: Ghi nhớ đăng nhập
              - button "Quên mật khẩu?" [disabled] [ref=e78] [cursor=pointer]
            - button "Đăng nhập" [active] [ref=e79] [cursor=pointer]
          - paragraph [ref=e80]:
            - text: Chưa có tài khoản?
            - link "Tạo tài khoản ngay" [ref=e81] [cursor=pointer]:
              - /url: /dang-ky
          - generic [ref=e82]:
            - strong [ref=e83]: Bảo mật thông tin
            - paragraph [ref=e84]: Khách chưa đăng nhập vẫn có thể xem bài viết và tính tiền điện. Đăng nhập giúp bạn lưu lại dữ liệu cá nhân hóa.
    - contentinfo [ref=e85]:
      - generic [ref=e86]:
        - generic [ref=e87]:
          - img [ref=e89]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e91]:
          - link "E-XANH về trang chủ" [ref=e92] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e94]
          - paragraph [ref=e95]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e96]:
          - link "Trang chủ" [ref=e97] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e98] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e99] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e100] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e101] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e102] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e103] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e105]: © 2024 E-XANH. Made by VanhKhucDev
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
> 30  |   expect(text.length, 'Trang bị trắng hoặc render quá ít nội dung').toBeGreaterThan(20);
      |                                                                     ^ Error: Trang bị trắng hoặc render quá ít nội dung
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
  63  |   expect(broken, 'Có ảnh bị lỗi tải hoặc naturalWidth/naturalHeight = 0').toEqual([]);
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
```