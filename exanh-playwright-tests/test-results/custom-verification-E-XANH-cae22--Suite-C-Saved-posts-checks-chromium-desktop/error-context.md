# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: custom-verification.spec.js >> E-XANH Browser Verification Suite >> C. Saved posts checks
- Location: tests\custom-verification.spec.js:383:3

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Đăng xuất"), a:has-text("Đăng xuất")').first()

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
      - generic [ref=e34]:
        - heading "Bạn cần đăng nhập để xem tài khoản." [level=1] [ref=e35]
        - paragraph [ref=e36]: Đăng nhập để xem bài đã lưu, lịch sử kiểm tra điện và quản lý hoạt động cá nhân của bạn.
        - generic [ref=e37]:
          - link "Đăng nhập" [ref=e38] [cursor=pointer]:
            - /url: /dang-nhap
          - link "Tạo tài khoản" [ref=e39] [cursor=pointer]:
            - /url: /dang-ky
    - contentinfo [ref=e40]:
      - generic [ref=e41]:
        - generic [ref=e42]:
          - img [ref=e44]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e46]:
          - link "E-XANH về trang chủ" [ref=e47] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e49]
          - paragraph [ref=e50]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e51]:
          - link "Trang chủ" [ref=e52] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e53] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e54] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e55] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e56] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e57] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e58] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e60]: © 2024 E-XANH. Made by VanhKhucDev
```

# Test source

```ts
  289 |     await page.locator('.st-card__field select').first().selectOption('warning');
  290 |     await page.locator('.st-card__field select').nth(1).selectOption('marquee');
  291 |     await page.locator('.st-card__field textarea').fill('Đây là thông báo chạy chữ rất dài chạy đi chạy lại.');
  292 |     await page.locator('.announcement-manager__form button[type="submit"]').click();
  293 |     await page.waitForTimeout(1500);
  294 |     console.log('[B] Tạo thông báo marquee thành công: Passed');
  295 | 
  296 |     // Bật/tắt thông báo
  297 |     // Tìm thông báo static vừa tạo, bấm tắt hiển thị
  298 |     const staticItem = page.locator(`.announcement-manager__item:has-text("${announcementTitle}")`);
  299 |     await expect(staticItem).toBeVisible();
  300 |     const toggleBtn = staticItem.locator('button:has-text("Tắt hiển thị"), button:has-text("Bật hiển thị")').first();
  301 |     await toggleBtn.click();
  302 |     await page.waitForTimeout(1000);
  303 |     
  304 |     const statusBadge = staticItem.locator('.st-badge');
  305 |     console.log(`[B] Trạng thái sau khi toggle: ${await statusBadge.innerText()}`);
  306 |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B_3_announcement_toggled.png') });
  307 | 
  308 |     // Sửa thông báo
  309 |     const editBtn = staticItem.locator('button:has-text("Sửa")');
  310 |     await editBtn.click();
  311 |     await page.waitForTimeout(500);
  312 |     
  313 |     const updatedTitle = announcementTitle + ' Edited';
  314 |     await page.locator('.st-card__field input[placeholder*="Bảo trì"]').fill(updatedTitle);
  315 |     await page.locator('.announcement-manager__form button[type="submit"]').click();
  316 |     await page.waitForTimeout(1500);
  317 |     
  318 |     const editedItem = page.locator(`.announcement-manager__item:has-text("${updatedTitle}")`);
  319 |     await expect(editedItem).toBeVisible();
  320 |     console.log('[B] Sửa thông báo thành công: Passed');
  321 | 
  322 |     // Ra user site, kiểm tra AnnouncementBar hiển thị đúng
  323 |     // Bật lại thông báo tĩnh vừa sửa để test ở user site
  324 |     await editedItem.locator('button:has-text("Bật hiển thị")').click();
  325 |     await page.waitForTimeout(1000);
  326 |     
  327 |     await gotoAndReady(page, '/');
  328 |     const publicBar = page.locator('.announcement-bar');
  329 |     await expect(publicBar).toBeVisible();
  330 |     expect(await publicBar.innerText()).toContain(updatedTitle);
  331 |     console.log('[B] AnnouncementBar hiển thị đúng ở trang chủ: Passed');
  332 |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B_4_announcement_bar_public.png') });
  333 | 
  334 |     // Bấm tắt thông báo, reload trang, xác nhận không hiện lại
  335 |     await publicBar.locator('.announcement-bar__close').click();
  336 |     await page.waitForTimeout(500);
  337 |     await expect(publicBar).not.toBeVisible();
  338 |     
  339 |     await page.reload();
  340 |     await page.waitForTimeout(1000);
  341 |     await expect(publicBar).not.toBeVisible();
  342 |     console.log('[B] Bấm tắt thông báo không hiện lại sau reload: Passed');
  343 | 
  344 |     // Test user thường không được tạo/sửa/xóa announcement
  345 |     await gotoAndReady(page, '/tai-khoan');
  346 |     await page.locator('button:has-text("Đăng xuất"), a:has-text("Đăng xuất")').first().click();
  347 |     await page.waitForTimeout(1000);
  348 |     
  349 |     await login(page, USER_EMAIL, USER_PASSWORD);
  350 |     await gotoAndReady(page, '/admin/cai-dat-giao-dien');
  351 |     
  352 |     // Xác nhận route admin chuyển về home hoặc báo Access Denied
  353 |     const bodyText = await page.locator('body').innerText();
  354 |     expect(bodyText.includes('không có quyền') || page.url().endsWith('/') || page.url().includes('/denied') || !bodyText.includes('Thông báo website')).toBeTruthy();
  355 |     console.log('[B] User thường bị chặn vào admin settings: Passed');
  356 |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B_5_user_denied_admin.png') });
  357 | 
  358 |     // Dọn dẹp: Đăng nhập lại admin để xóa test announcements tránh ô nhiễm database
  359 |     await gotoAndReady(page, '/tai-khoan');
  360 |     await page.locator('button:has-text("Đăng xuất"), a:has-text("Đăng xuất")').first().click();
  361 |     await page.waitForTimeout(1000);
  362 |     
  363 |     await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
  364 |     await gotoAndReady(page, '/admin/cai-dat-giao-dien');
  365 |     
  366 |     // Xóa các test announcements vừa tạo
  367 |     page.on('dialog', async dialog => {
  368 |       await dialog.accept();
  369 |     });
  370 |     
  371 |     const itemsToDelete = [updatedTitle, marqueeTitle];
  372 |     for (const title of itemsToDelete) {
  373 |       const item = page.locator(`.announcement-manager__item:has-text("${title}")`);
  374 |       if (await item.count() > 0) {
  375 |         await item.locator('button:has-text("Xóa")').click();
  376 |         await page.waitForTimeout(1000);
  377 |       }
  378 |     }
  379 |     console.log('[B] Dọn dẹp dữ liệu test: Passed');
  380 |   });
  381 | 
  382 |   // C. Saved posts
  383 |   test('C. Saved posts checks', async ({ page }) => {
  384 |     test.setTimeout(80000);
  385 |     console.log('--- Bắt đầu test C. Saved posts ---');
  386 |     
  387 |     // Log out admin
  388 |     await gotoAndReady(page, '/tai-khoan');
> 389 |     await page.locator('button:has-text("Đăng xuất"), a:has-text("Đăng xuất")').first().click();
      |                                                                                         ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
  390 |     await page.waitForTimeout(1000);
  391 | 
  392 |     // Login user
  393 |     await login(page, USER_EMAIL, USER_PASSWORD);
  394 | 
  395 |     // Vào trang mẹo tiết kiệm
  396 |     await gotoAndReady(page, '/meo-tiet-kiem');
  397 |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'C_1_tips_page.png') });
  398 |     
  399 |     // Lưu bài tips có ảnh
  400 |     const tipCard = page.locator('.tip-card').first();
  401 |     await expect(tipCard).toBeVisible();
  402 |     const tipTitle = await tipCard.locator('h3').innerText();
  403 |     const tipSaveBtn = tipCard.locator('button:has-text("Lưu"), button:has-text("Save")').first();
  404 |     
  405 |     const isSavedTip = await tipSaveBtn.innerText().then(t => t.includes('Đã lưu'));
  406 |     if (!isSavedTip) {
  407 |       await tipSaveBtn.click();
  408 |       await page.waitForTimeout(500);
  409 |     }
  410 |     console.log(`[C] Đã lưu bài tips: ${tipTitle}`);
  411 | 
  412 |     // Vào trang cộng đồng
  413 |     await gotoAndReady(page, '/cong-dong');
  414 |     // Lưu bài community có ảnh
  415 |     const commCard = page.locator('article, .community-post-card').first();
  416 |     await expect(commCard).toBeVisible();
  417 |     const commTitle = await commCard.locator('.community-post-card__title, h3').first().innerText();
  418 |     const commSaveBtn = commCard.locator('button:has-text("Lưu"), button:has-text("Save")').first();
  419 |     
  420 |     const isSavedComm = await commSaveBtn.innerText().then(t => t.includes('Đã lưu'));
  421 |     if (!isSavedComm) {
  422 |       await commSaveBtn.click();
  423 |       await page.waitForTimeout(500);
  424 |     }
  425 |     console.log(`[C] Đã lưu bài community: ${commTitle}`);
  426 | 
  427 |     // Vào trang bài đã lưu
  428 |     await gotoAndReady(page, '/bai-da-luu');
  429 |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'C_2_saved_posts_page.png') });
  430 | 
  431 |     // Kiểm tra card hiển thị đúng ảnh và placeholders
  432 |     const savedCards = page.locator('.saved-post-card');
  433 |     await expect(savedCards.first()).toBeVisible();
  434 |     
  435 |     const cardCount = await savedCards.count();
  436 |     console.log(`[C] Số lượng bài đã lưu hiển thị: ${cardCount}`);
  437 |     
  438 |     for (let i = 0; i < cardCount; i++) {
  439 |       const card = savedCards.nth(i);
  440 |       const img = card.locator('img');
  441 |       await expect(img).toBeVisible();
  442 |       const src = await img.getAttribute('src');
  443 |       console.log(`[C] Card #${i + 1} image src: ${src}`);
  444 |       expect(src).toBeTruthy();
  445 |     }
  446 |     console.log('[C] Ảnh card đã lưu tải tốt: Passed');
  447 | 
  448 |     // Click card check routing
  449 |     const firstCard = savedCards.first();
  450 |     const detailLink = firstCard.locator('.saved-post-card__read, a').first();
  451 |     const href = await detailLink.getAttribute('href');
  452 |     console.log(`[C] Route đích: ${href}`);
  453 |     
  454 |     await detailLink.click();
  455 |     await page.waitForLoadState('domcontentloaded');
  456 |     console.log(`[C] URL sau click: ${page.url()}`);
  457 |     expect(page.url()).toContain(href);
  458 |     console.log('[C] Click đọc lại chuyển đúng route: Passed');
  459 |   });
  460 | 
  461 |   // D. Security quick check
  462 |   test('D. Security quick check', async ({ page }) => {
  463 |     test.setTimeout(80000);
  464 |     console.log('--- Bắt đầu test D. Security quick check ---');
  465 |     
  466 |     // Đảm bảo log errors console
  467 |     const consoleErrors = [];
  468 |     page.on('console', msg => {
  469 |       if (msg.type() === 'error') {
  470 |         consoleErrors.push(msg.text());
  471 |       }
  472 |     });
  473 |     page.on('pageerror', err => {
  474 |       consoleErrors.push(err.message);
  475 |     });
  476 | 
  477 |     // 1. Kiểm tra MarkdownContent không render raw HTML/script
  478 |     await gotoAndReady(page, '/cong-dong');
  479 |     const writeBtn = page.locator('[data-testid="community-write-post-button"]').first();
  480 |     await writeBtn.click();
  481 |     
  482 |     const textarea = page.locator('.post-editor__textarea');
  483 |     await textarea.fill('Testing raw html: <b>Bold HTML</b> <script>alert("XSS")</script>');
  484 |     
  485 |     await page.locator('.post-editor__tab:has-text("Xem trước")').click();
  486 |     await page.waitForTimeout(500);
  487 |     
  488 |     const preview = page.locator('.post-editor__preview');
  489 |     const boldTag = preview.locator('b');
```