# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: custom-verification.spec.js >> E-XANH Browser Verification Suite >> B. Admin announcements checks
- Location: tests\custom-verification.spec.js:247:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.st-card__title:has-text("Thông báo website")')
Expected: visible
Timeout: 7000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 7000ms
  - waiting for locator('.st-card__title:has-text("Thông báo website")')

```

```yaml
- button "Đóng thông báo": ×
- heading "E-XANH đang trong quá trình phát triển" [level=4]
- paragraph: Website có thể phát sinh vấn đề, mong bạn phản hồi để nhóm phát triển cải thiện.
- paragraph:
  - text: "Phiên bản hiện tại:"
  - strong: Beta v1.1
- paragraph:
  - text: "Cập nhật gần nhất:"
  - strong: 11/06/2026
- paragraph:
  - text: "Dự kiến cập nhật tiếp theo:"
  - strong: Sắp cập nhật
- button "Báo cáo lỗi":
  - img
  - text: Báo cáo lỗi
- banner:
  - link "E-XANH về trang chủ":
    - /url: /
    - img "E-XANH"
  - navigation "Điều hướng người dùng":
    - link "Trang chủ":
      - /url: /
    - link "Mẹo tiết kiệm":
      - /url: /meo-tiet-kiem
    - link "Cộng đồng":
      - /url: /cong-dong
    - link "Kiểm tra tiền điện":
      - /url: /kiem-tra-tien-dien
    - link "Bài đã lưu":
      - /url: /bai-da-luu
  - link "Đăng nhập":
    - /url: /dang-nhap
  - button "Đăng bài"
- main:
  - link "E-XANH về trang chủ":
    - /url: /
    - img "E-XANH"
  - text: Cộng đồng sống xanh
  - heading "Tham gia E-XANH để sống xanh hơn mỗi ngày" [level=1]
  - paragraph: Một tài khoản E-XANH giúp bạn lưu bài viết, tham gia cộng đồng và theo dõi thói quen sử dụng điện cá nhân.
  - text: Lưu bài viết • Bình luận • Theo dõi điện năng
  - img "banner_cropped.jpeg"
  - img "auth-hero.jpeg"
  - img "auth-hero.jpeg"
  - button "Go to slide 1"
  - button "Go to slide 2"
  - button "Go to slide 3"
  - heading "Chào mừng trở lại" [level=2]
  - paragraph: Đăng nhập để tiếp tục hành trình sống xanh cùng E-XANH.
  - text: Đăng nhập
  - link "Đăng ký":
    - /url: /dang-ky
  - text: Email
  - textbox "Email":
    - /placeholder: Nhập email của bạn
  - text: Mật khẩu
  - textbox "Mật khẩu":
    - /placeholder: Nhập mật khẩu
  - checkbox "Ghi nhớ đăng nhập"
  - text: Ghi nhớ đăng nhập
  - button "Quên mật khẩu?" [disabled]
  - button "Đăng nhập"
  - paragraph:
    - text: Chưa có tài khoản?
    - link "Tạo tài khoản ngay":
      - /url: /dang-ky
  - strong: Bảo mật thông tin
  - paragraph: Khách chưa đăng nhập vẫn có thể xem bài viết và tính tiền điện. Đăng nhập giúp bạn lưu lại dữ liệu cá nhân hóa.
- contentinfo:
  - img
  - text: Hoàng Sa & Trường Sa là của Việt Nam!
  - link "E-XANH về trang chủ":
    - /url: /
    - img "E-XANH"
  - paragraph: Dùng điện thông minh, sống xanh bền vững.
  - navigation "Liên kết chân trang":
    - link "Trang chủ":
      - /url: /
    - link "Mẹo tiết kiệm":
      - /url: /meo-tiet-kiem
    - link "Cộng đồng":
      - /url: /cong-dong
    - link "Kiểm tra tiền điện":
      - /url: /kiem-tra-tien-dien
    - link "Về chúng tôi":
      - /url: /ve-chung-toi
    - link "Điều khoản":
      - /url: /dieu-khoan
    - link "Liên hệ":
      - /url: /lien-he
  - paragraph: © 2024 E-XANH. Made by VanhKhucDev
```

# Test source

```ts
  169 |     expect(currentVal).toContain('>');
  170 | 
  171 |     // Chuyển Viết/Xem trước, nội dung render đúng
  172 |     await page.locator('.post-editor__tab:has-text("Xem trước")').click();
  173 |     await page.waitForTimeout(500);
  174 |     const mdPreview = page.locator('.post-editor__preview');
  175 |     await expect(mdPreview).toBeVisible();
  176 |     console.log('[A] Render xem trước: Passed');
  177 |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_6_markdown_preview.png') });
  178 |     
  179 |     await page.locator('.post-editor__tab:has-text("Viết")').click();
  180 |     await page.waitForTimeout(500);
  181 | 
  182 |     // Chèn ảnh inline, kiểm tra tối đa 3 ảnh
  183 |     const inlineInput = page.locator('input[type="file"][hidden]');
  184 |     
  185 |     // Nhập text dài hơn 80 ký tự để bypass minLength validation
  186 |     const longText = 'Đây là nội dung bài viết dài hơn 80 ký tự để kiểm tra tính năng chèn ảnh inline và kiểm tra số lượng ảnh tối đa cho phép đăng trong một bài viết chia sẻ với cộng đồng. '.repeat(2);
  187 |     await textarea.fill(longText);
  188 | 
  189 |     // Chèn ảnh 1
  190 |     await inlineInput.setInputFiles(smallImgPath);
  191 |     await page.waitForTimeout(1000);
  192 |     // Chèn ảnh 2
  193 |     await inlineInput.setInputFiles(smallImgPath);
  194 |     await page.waitForTimeout(1000);
  195 |     // Chèn ảnh 3
  196 |     await inlineInput.setInputFiles(smallImgPath);
  197 |     await page.waitForTimeout(1000);
  198 |     
  199 |     // Thử chèn ảnh 4
  200 |     await inlineInput.setInputFiles(smallImgPath);
  201 |     await page.waitForTimeout(1000);
  202 |     
  203 |     const inlineError = page.locator('.post-form-group__error:has-text("tối đa 3 ảnh")');
  204 |     await expect(inlineError).toBeVisible();
  205 |     console.log('[A] Giới hạn tối đa 3 ảnh inline hoạt động: Passed');
  206 |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_7_inline_images_limit_error.png') });
  207 | 
  208 |     // Reload trang, kiểm tra nháp autosave còn không
  209 |     const testTitle = 'Test Autosave Title ' + Date.now();
  210 |     await page.locator('#post-title').fill(testTitle);
  211 |     await page.waitForTimeout(5000); // Đợi autosave (hẹn giờ 4s)
  212 |     
  213 |     await page.reload();
  214 |     await gotoAndReady(page, '/cong-dong');
  215 |     await writeBtn.click();
  216 |     await page.waitForTimeout(1500);
  217 |     
  218 |     const restoredTitle = await page.locator('#post-title').inputValue();
  219 |     console.log(`[A] Tiêu đề được khôi phục: ${restoredTitle}`);
  220 |     expect(restoredTitle).toBe(testTitle);
  221 |     console.log('[A] Autosave khôi phục bản nháp sau reload: Passed');
  222 |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_8_autosave_restored.png') });
  223 | 
  224 |     // Bấm gửi bài nhiều lần liên tục, xác nhận isSubmitting/cooldown 30s hoạt động
  225 |     // Điền thêm thông tin hợp lệ
  226 |     await page.locator('#post-type').selectOption('community');
  227 |     await page.locator('#post-category').selectOption('Thói quen xanh');
  228 |     await page.locator('#post-description').fill('Mô tả ngắn cho bài test autosave và rate limit.');
  229 |     
  230 |     const submitBtn = page.locator('.composer-modal__footer-actions button:has-text("Gửi bài chờ duyệt")');
  231 |     await submitBtn.click();
  232 |     await page.waitForTimeout(500);
  233 |     
  234 |     // Bấm lại ngay lập tức
  235 |     const nextSubmitBtnText = await submitBtn.innerText();
  236 |     console.log(`[A] Nút submit sau lần gửi đầu: ${nextSubmitBtnText}`);
  237 |     expect(nextSubmitBtnText).toMatch(/Đợi|Đang gửi/i);
  238 |     
  239 |     console.log('[A] Nút cooldown hoạt động: Passed');
  240 |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_9_cooldown_active.png') });
  241 |     
  242 |     // Đóng modal để sang test B
  243 |     await page.locator('.ui-modal__close').click();
  244 |   });
  245 | 
  246 |   // B. Admin announcements
  247 |   test('B. Admin announcements checks', async ({ page }) => {
  248 |     test.setTimeout(80000);
  249 |     console.log('--- Bắt đầu test B. Admin announcements ---');
  250 |     
  251 |     // Log out user
  252 |     await gotoAndReady(page, '/tai-khoan');
  253 |     const logoutBtn = page.locator('button:has-text("Đăng xuất"), a:has-text("Đăng xuất")').first();
  254 |     if (await logoutBtn.count() > 0) {
  255 |       await logoutBtn.click();
  256 |       await page.waitForTimeout(1000);
  257 |     }
  258 |     
  259 |     // Login as Admin
  260 |     await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
  261 |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B_0_admin_logged_in.png') });
  262 |     
  263 |     // Vào /admin/cai-dat-giao-dien
  264 |     await gotoAndReady(page, '/admin/cai-dat-giao-dien');
  265 |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B_1_admin_settings_page.png') });
  266 |     
  267 |     // Kiểm tra đã apply SQL website_announcements chưa
  268 |     const cardTitle = page.locator('.st-card__title:has-text("Thông báo website")');
> 269 |     await expect(cardTitle).toBeVisible();
      |                             ^ Error: expect(locator).toBeVisible() failed
  270 |     console.log('[B] Bảng quản lý announcements có hiển thị: Passed');
  271 | 
  272 |     // Tạo thông báo static
  273 |     const announcementTitle = 'Test Static Announcement ' + Date.now();
  274 |     await page.locator('.st-card__field input[placeholder*="Bảo trì"]').fill(announcementTitle);
  275 |     await page.locator('.st-card__field select').first().selectOption('info');
  276 |     await page.locator('.st-card__field select').nth(1).selectOption('static');
  277 |     await page.locator('.st-card__field textarea').fill('Đây là thông báo tĩnh để kiểm tra thanh thông tin.');
  278 |     await page.locator('.announcement-manager__form button[type="submit"]').click();
  279 |     await page.waitForTimeout(1500);
  280 |     
  281 |     const successMsg = page.locator('.admin-alert--success');
  282 |     await expect(successMsg).toBeVisible();
  283 |     console.log('[B] Tạo thông báo static thành công: Passed');
  284 |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B_2_static_announcement_created.png') });
  285 | 
  286 |     // Tạo thông báo marquee
  287 |     const marqueeTitle = 'Test Marquee Announcement ' + Date.now();
  288 |     await page.locator('.st-card__field input[placeholder*="Bảo trì"]').fill(marqueeTitle);
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
```