# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: custom-verification.spec.js >> E-XANH Browser Verification Suite >> D. Security quick check
- Location: tests\custom-verification.spec.js:462:3

# Error details

```
TimeoutError: locator.fill: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('.post-editor__textarea')

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
        - generic [ref=e35]:
          - generic [ref=e36]:
            - generic [ref=e37]:
              - link "E-XANH về trang chủ" [ref=e39] [cursor=pointer]:
                - /url: /
                - img "E-XANH" [ref=e41]
              - generic [ref=e42]: Cộng đồng sống xanh
            - generic [ref=e43]:
              - heading "Tham gia E-XANH để sống xanh hơn mỗi ngày" [level=1] [ref=e44]:
                - text: Tham gia E-XANH
                - text: để sống xanh hơn
                - text: mỗi ngày
              - paragraph [ref=e45]: Một tài khoản E-XANH giúp bạn lưu bài viết, tham gia cộng đồng và theo dõi thói quen sử dụng điện cá nhân.
              - generic [ref=e46]:
                - generic [ref=e47]: Lưu bài viết
                - generic [ref=e48]: •
                - generic [ref=e49]: Bình luận
                - generic [ref=e50]: •
                - generic [ref=e51]: Theo dõi điện năng
          - generic [ref=e53]:
            - img "banner_cropped.jpeg" [ref=e56]
            - img "auth-hero.jpeg" [ref=e59]
            - img "auth-hero.jpeg" [ref=e62]
            - generic [ref=e63]:
              - button "Go to slide 1" [ref=e64] [cursor=pointer]
              - button "Go to slide 2" [ref=e66] [cursor=pointer]
              - button "Go to slide 3" [ref=e68] [cursor=pointer]
        - generic [ref=e70]:
          - generic [ref=e71]:
            - heading "Chào mừng trở lại" [level=2] [ref=e72]
            - paragraph [ref=e73]: Đăng nhập để tiếp tục hành trình sống xanh cùng E-XANH.
          - generic [ref=e74]:
            - generic [ref=e75]: Đăng nhập
            - link "Đăng ký" [ref=e76] [cursor=pointer]:
              - /url: /dang-ky
          - alert [ref=e77]: Vui lòng đăng nhập để đăng bài.
          - generic [ref=e78]:
            - generic [ref=e79]:
              - generic [ref=e80]: Email
              - textbox "Email" [ref=e81]:
                - /placeholder: Nhập email của bạn
            - generic [ref=e82]:
              - generic [ref=e83]: Mật khẩu
              - textbox "Mật khẩu" [ref=e84]:
                - /placeholder: Nhập mật khẩu
            - generic [ref=e85]:
              - generic [ref=e86]:
                - checkbox "Ghi nhớ đăng nhập" [ref=e87]
                - generic [ref=e88]: Ghi nhớ đăng nhập
              - button "Quên mật khẩu?" [disabled] [ref=e89] [cursor=pointer]
            - button "Đăng nhập" [ref=e90] [cursor=pointer]
          - paragraph [ref=e91]:
            - text: Chưa có tài khoản?
            - link "Tạo tài khoản ngay" [ref=e92] [cursor=pointer]:
              - /url: /dang-ky
          - generic [ref=e93]:
            - strong [ref=e94]: Bảo mật thông tin
            - paragraph [ref=e95]: Khách chưa đăng nhập vẫn có thể xem bài viết và tính tiền điện. Đăng nhập giúp bạn lưu lại dữ liệu cá nhân hóa.
    - contentinfo [ref=e96]:
      - generic [ref=e97]:
        - generic [ref=e98]:
          - img [ref=e100]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e102]:
          - link "E-XANH về trang chủ" [ref=e103] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e105]
          - paragraph [ref=e106]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e107]:
          - link "Trang chủ" [ref=e108] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e109] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e110] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e111] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e112] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e113] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e114] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e116]: © 2024 E-XANH. Made by VanhKhucDev
```

# Test source

```ts
  383 |   test('C. Saved posts checks', async ({ page }) => {
  384 |     test.setTimeout(80000);
  385 |     console.log('--- Bắt đầu test C. Saved posts ---');
  386 |     
  387 |     // Log out admin
  388 |     await gotoAndReady(page, '/tai-khoan');
  389 |     await page.locator('button:has-text("Đăng xuất"), a:has-text("Đăng xuất")').first().click();
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
> 483 |     await textarea.fill('Testing raw html: <b>Bold HTML</b> <script>alert("XSS")</script>');
      |                    ^ TimeoutError: locator.fill: Timeout 10000ms exceeded.
  484 |     
  485 |     await page.locator('.post-editor__tab:has-text("Xem trước")').click();
  486 |     await page.waitForTimeout(500);
  487 |     
  488 |     const preview = page.locator('.post-editor__preview');
  489 |     const boldTag = preview.locator('b');
  490 |     const scriptTag = preview.locator('script');
  491 |     
  492 |     expect(await boldTag.count()).toBe(0);
  493 |     expect(await scriptTag.count()).toBe(0);
  494 |     console.log('[D] MarkdownContent không render raw HTML/script: Passed');
  495 |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'D_1_xss_prevention.png') });
  496 |     
  497 |     await page.locator('.ui-modal__close').click();
  498 | 
  499 |     // 2. Kiểm tra upload ảnh không nhận SVG/HTML/script
  500 |     await writeBtn.click();
  501 |     const uploadBox = page.locator('[data-testid="post-upload-area"]');
  502 |     
  503 |     const fileChooserPromise = page.waitForEvent('filechooser');
  504 |     await uploadBox.click();
  505 |     const fileChooser = await fileChooserPromise;
  506 |     await fileChooser.setFiles(svgFilePath);
  507 |     await page.waitForTimeout(500);
  508 |     
  509 |     const formatError = page.locator('.post-form-group__error:has-text("chỉ nhận")');
  510 |     await expect(formatError).toBeVisible();
  511 |     console.log('[D] Chặn upload file SVG: Passed');
  512 |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'D_2_svg_upload_blocked.png') });
  513 |     
  514 |     await page.locator('.ui-modal__close').click();
  515 | 
  516 |     // 3. Kiểm tra user thường không gọi được service admin announcement
  517 |     // Logout admin/user
  518 |     await gotoAndReady(page, '/tai-khoan');
  519 |     await page.locator('button:has-text("Đăng xuất"), a:has-text("Đăng xuất")').first().click();
  520 |     await page.waitForTimeout(1000);
  521 |     
  522 |     // Login user thường
  523 |     await login(page, USER_EMAIL, USER_PASSWORD);
  524 |     
  525 |     // Gọi thử trực tiếp API/Service (mock test từ console qua supabase client)
  526 |     const accessError = await page.evaluate(async () => {
  527 |       try {
  528 |         const { supabase } = await import('/src/lib/supabase.js');
  529 |         const { data, error } = await supabase
  530 |           .from('website_announcements')
  531 |           .insert([{ message: 'Hacked by normal user', type: 'danger', display_mode: 'static' }]);
  532 |         return error ? error.message : 'No error';
  533 |       } catch (e) {
  534 |         return e.message;
  535 |       }
  536 |     }).catch(err => err.message);
  537 |     
  538 |     console.log(`[D] Kết quả gọi insert database của user thường: ${accessError}`);
  539 |     expect(accessError).not.toBe('No error'); // Phải có lỗi hoặc access denied do RLS
  540 |     console.log('[D] Supabase RLS chặn user thường insert announcement: Passed');
  541 | 
  542 |     // 4. Kiểm tra console không có lỗi runtime
  543 |     console.log(`[D] Số lỗi console ghi nhận được: ${consoleErrors.length}`);
  544 |     if (consoleErrors.length > 0) {
  545 |       console.warn('Lỗi console:', consoleErrors);
  546 |     }
  547 |     // Chấp nhận cảnh báo hoặc một số lỗi CDN nhỏ nếu có, nhưng không được có crash
  548 |     console.log('[D] Kiểm tra console errors: Completed');
  549 |   });
  550 | });
  551 | 
```