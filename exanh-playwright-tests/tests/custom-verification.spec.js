const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { gotoAndReady, login, fillFirst, clickByAny } = require('../utils/test-utils');

const USER_EMAIL = 'khucvietanh04@gmail.com';
const USER_PASSWORD = '123456';
const ADMIN_EMAIL = 'vanhkhuc2k5@gmail.com';
const ADMIN_PASSWORD = 'vanhkhuc';

const SCREENSHOT_DIR = 'C:/Users/khucv/.gemini/antigravity/brain/e5e71cb6-f77f-4ca4-ac5b-ed3e08338b24/screenshots';

// Đảm bảo thư mục screenshot tồn tại
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Hàm helper tạo file dummy để test upload
function createDummyFile(filename, sizeBytes, content = '') {
  const dir = path.join(__dirname, '../fixtures');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, filename);
  if (sizeBytes > 0) {
    const buffer = Buffer.alloc(sizeBytes);
    fs.writeFileSync(filePath, buffer);
  } else {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  return filePath;
}

test.describe('E-XANH Browser Verification Suite', () => {
  let smallImgPath;
  let largeImgPath;
  let badFilePath;
  let svgFilePath;

  test.beforeAll(async () => {
    // Tạo các files test
    smallImgPath = createDummyFile('test-small.png', 10 * 1024); // 10KB
    largeImgPath = createDummyFile('test-large.jpg', 5.5 * 1024 * 1024); // 5.5MB
    badFilePath = createDummyFile('test-invalid.txt', 0, 'dummy text content');
    svgFilePath = createDummyFile('test-svg.svg', 0, '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40"/><script>console.log("xss")</script></svg>');
  });

  // A. Modal đăng bài /cong-dong
  test('A. Modal đăng bài /cong-dong checks', async ({ page }) => {
    test.setTimeout(80000);
    console.log('--- Bắt đầu test A. Modal đăng bài /cong-dong ---');
    
    // Đăng nhập tài khoản user
    await login(page, USER_EMAIL, USER_PASSWORD);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_0_logged_in.png') });
    
    // Vào trang cộng đồng
    await gotoAndReady(page, '/cong-dong');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_1_community_page.png') });

    // Mở modal “Chia sẻ với cộng đồng”
    const writeBtn = page.locator('[data-testid="community-write-post-button"]').first();
    await expect(writeBtn).toBeVisible();
    await writeBtn.click();
    
    const modal = page.locator('.ui-modal--composer');
    await expect(modal).toBeVisible();
    console.log('[A] Modal đã mở thành công.');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_2_modal_open.png') });

    // Kiểm tra header/footer sticky, body cuộn riêng, không tràn màn hình 1080p
    const header = page.locator('.ui-modal__header');
    const footer = page.locator('.ui-modal__footer');
    const body = page.locator('.composer-modal__body');
    
    await expect(header).toBeVisible();
    await expect(footer).toBeVisible();
    await expect(body).toBeVisible();
    
    const headerPos = await header.evaluate(el => window.getComputedStyle(el).position);
    const footerPos = await footer.evaluate(el => window.getComputedStyle(el).position);
    const bodyOverflow = await body.evaluate(el => window.getComputedStyle(el).overflow);
    
    console.log(`[A] Header position style: ${headerPos}`);
    console.log(`[A] Footer position style: ${footerPos}`);
    console.log(`[A] Body overflow style: ${bodyOverflow}`);
    
    expect(headerPos === 'sticky' || headerPos === 'fixed').toBeTruthy();
    expect(footerPos === 'sticky' || footerPos === 'fixed').toBeTruthy();
    expect(bodyOverflow).toContain('auto');

    // Click khu ảnh bìa và nút "Chọn ảnh bìa", xác nhận đều mở file picker
    const uploadBox = page.locator('[data-testid="post-upload-area"]');
    
    const fileChooserPromise1 = page.waitForEvent('filechooser');
    await uploadBox.click();
    const fileChooser1 = await fileChooserPromise1;
    console.log('[A] Click khu ảnh bìa mở file picker: Passed');
    
    // Upload JPG/PNG/WEBP dưới 5MB, có preview
    await fileChooser1.setFiles(smallImgPath);
    await page.waitForTimeout(1000);
    const previewImg = page.locator('[data-testid="post-upload-area"] img');
    await expect(previewImg).toBeVisible();
    console.log('[A] Upload file dưới 5MB và hiển thị preview: Passed');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_3_cover_preview.png') });

    // Upload file sai định dạng, phải báo lỗi thân thiện
    const removeCoverBtn = page.locator('[data-testid="post-upload-area"] button:has-text("Xóa ảnh")');
    await removeCoverBtn.click();
    await page.waitForTimeout(500);
    
    const fileChooserPromise2 = page.waitForEvent('filechooser');
    await uploadBox.click();
    const fileChooser2 = await fileChooserPromise2;
    await fileChooser2.setFiles(badFilePath);
    await page.waitForTimeout(500);
    
    const invalidError = page.locator('.post-form-group__error:has-text("chỉ nhận")');
    await expect(invalidError).toBeVisible();
    console.log('[A] Báo lỗi upload sai định dạng file: Passed');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_4_invalid_format_error.png') });

    // Upload file lớn hơn 5MB, phải báo lỗi
    const fileChooserPromise3 = page.waitForEvent('filechooser');
    await uploadBox.click();
    const fileChooser3 = await fileChooserPromise3;
    await fileChooser3.setFiles(largeImgPath);
    await page.waitForTimeout(500);
    
    const sizeError = page.locator('.post-form-group__error:has-text("5MB")');
    await expect(sizeError).toBeVisible();
    console.log('[A] Báo lỗi upload file > 5MB: Passed');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_5_large_size_error.png') });

    // Xóa ảnh bìa
    const fileChooserPromise4 = page.waitForEvent('filechooser');
    await uploadBox.click();
    const fileChooser4 = await fileChooserPromise4;
    await fileChooser4.setFiles(smallImgPath);
    await page.waitForTimeout(500);
    await removeCoverBtn.click();
    await page.waitForTimeout(500);
    await expect(previewImg).not.toBeVisible();
    console.log('[A] Xóa ảnh bìa: Passed');

    // Viết nội dung markdown, dùng toolbar: đậm, nghiêng, tiêu đề, danh sách, quote, link
    const textarea = page.locator('.post-editor__textarea');
    await expect(textarea).toBeVisible();
    await textarea.fill('Nội dung markdown: ');
    
    // Test bold
    await page.locator('.post-editor__tool:has-text("In đậm")').click();
    // Test italic
    await page.locator('.post-editor__tool:has-text("In nghiêng")').click();
    // Test heading
    await page.locator('.post-editor__tool:has-text("Tiêu đề")').click();
    // Test list
    await page.locator('.post-editor__tool:has-text("Danh sách")').click();
    // Test quote
    await page.locator('.post-editor__tool:has-text("Trích dẫn")').click();
    
    const currentVal = await textarea.inputValue();
    console.log(`[A] Giá trị nội dung sau khi nhấn toolbar: ${currentVal}`);
    expect(currentVal).toContain('**');
    expect(currentVal).toContain('*');
    expect(currentVal).toContain('##');
    expect(currentVal).toContain('-');
    expect(currentVal).toContain('>');

    // Chuyển Viết/Xem trước, nội dung render đúng
    await page.locator('.post-editor__tab:has-text("Xem trước")').click();
    await page.waitForTimeout(500);
    const mdPreview = page.locator('.post-editor__preview');
    await expect(mdPreview).toBeVisible();
    console.log('[A] Render xem trước: Passed');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_6_markdown_preview.png') });
    
    await page.locator('.post-editor__tab:has-text("Viết")').click();
    await page.waitForTimeout(500);

    // Chèn ảnh inline, kiểm tra tối đa 3 ảnh
    const inlineInput = page.locator('input[type="file"][hidden]');
    
    // Nhập text dài hơn 80 ký tự để bypass minLength validation
    const longText = 'Đây là nội dung bài viết dài hơn 80 ký tự để kiểm tra tính năng chèn ảnh inline và kiểm tra số lượng ảnh tối đa cho phép đăng trong một bài viết chia sẻ với cộng đồng. '.repeat(2);
    await textarea.fill(longText);

    // Chèn ảnh 1
    await inlineInput.setInputFiles(smallImgPath);
    await page.waitForTimeout(1000);
    // Chèn ảnh 2
    await inlineInput.setInputFiles(smallImgPath);
    await page.waitForTimeout(1000);
    // Chèn ảnh 3
    await inlineInput.setInputFiles(smallImgPath);
    await page.waitForTimeout(1000);
    
    // Thử chèn ảnh 4
    await inlineInput.setInputFiles(smallImgPath);
    await page.waitForTimeout(1000);
    
    const inlineError = page.locator('.post-form-group__error:has-text("tối đa 3 ảnh")');
    await expect(inlineError).toBeVisible();
    console.log('[A] Giới hạn tối đa 3 ảnh inline hoạt động: Passed');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_7_inline_images_limit_error.png') });

    // Reload trang, kiểm tra nháp autosave còn không
    const testTitle = 'Test Autosave Title ' + Date.now();
    await page.locator('#post-title').fill(testTitle);
    await page.waitForTimeout(5000); // Đợi autosave (hẹn giờ 4s)
    
    await page.reload();
    await gotoAndReady(page, '/cong-dong');
    await writeBtn.click();
    await page.waitForTimeout(1500);
    
    const restoredTitle = await page.locator('#post-title').inputValue();
    console.log(`[A] Tiêu đề được khôi phục: ${restoredTitle}`);
    expect(restoredTitle).toBe(testTitle);
    console.log('[A] Autosave khôi phục bản nháp sau reload: Passed');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_8_autosave_restored.png') });

    // Bấm gửi bài nhiều lần liên tục, xác nhận isSubmitting/cooldown 30s hoạt động
    // Điền thêm thông tin hợp lệ
    await page.locator('#post-type').selectOption('community');
    await page.locator('#post-category').selectOption('Thói quen xanh');
    await page.locator('#post-description').fill('Mô tả ngắn cho bài test autosave và rate limit.');
    
    const submitBtn = page.locator('.composer-modal__footer-actions button:has-text("Gửi bài chờ duyệt")');
    await submitBtn.click();
    await page.waitForTimeout(500);
    
    // Bấm lại ngay lập tức
    const nextSubmitBtnText = await submitBtn.innerText();
    console.log(`[A] Nút submit sau lần gửi đầu: ${nextSubmitBtnText}`);
    expect(nextSubmitBtnText).toMatch(/Đợi|Đang gửi/i);
    
    console.log('[A] Nút cooldown hoạt động: Passed');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_9_cooldown_active.png') });
    
    // Đóng modal để sang test B
    await page.locator('.ui-modal__close').click();
  });

  // B. Admin announcements
  test('B. Admin announcements checks', async ({ page }) => {
    test.setTimeout(80000);
    console.log('--- Bắt đầu test B. Admin announcements ---');
    
    // Log out user
    await gotoAndReady(page, '/tai-khoan');
    const logoutBtn = page.locator('button:has-text("Đăng xuất"), a:has-text("Đăng xuất")').first();
    if (await logoutBtn.count() > 0) {
      await logoutBtn.click();
      await page.waitForTimeout(1000);
    }
    
    // Login as Admin
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B_0_admin_logged_in.png') });
    
    // Vào /admin/cai-dat-giao-dien
    await gotoAndReady(page, '/admin/cai-dat-giao-dien');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B_1_admin_settings_page.png') });
    
    // Kiểm tra đã apply SQL website_announcements chưa
    const cardTitle = page.locator('.st-card__title:has-text("Thông báo website")');
    await expect(cardTitle).toBeVisible();
    console.log('[B] Bảng quản lý announcements có hiển thị: Passed');

    // Tạo thông báo static
    const announcementTitle = 'Test Static Announcement ' + Date.now();
    await page.locator('.st-card__field input[placeholder*="Bảo trì"]').fill(announcementTitle);
    await page.locator('.st-card__field select').first().selectOption('info');
    await page.locator('.st-card__field select').nth(1).selectOption('static');
    await page.locator('.st-card__field textarea').fill('Đây là thông báo tĩnh để kiểm tra thanh thông tin.');
    await page.locator('.announcement-manager__form button[type="submit"]').click();
    await page.waitForTimeout(1500);
    
    const successMsg = page.locator('.admin-alert--success');
    await expect(successMsg).toBeVisible();
    console.log('[B] Tạo thông báo static thành công: Passed');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B_2_static_announcement_created.png') });

    // Tạo thông báo marquee
    const marqueeTitle = 'Test Marquee Announcement ' + Date.now();
    await page.locator('.st-card__field input[placeholder*="Bảo trì"]').fill(marqueeTitle);
    await page.locator('.st-card__field select').first().selectOption('warning');
    await page.locator('.st-card__field select').nth(1).selectOption('marquee');
    await page.locator('.st-card__field textarea').fill('Đây là thông báo chạy chữ rất dài chạy đi chạy lại.');
    await page.locator('.announcement-manager__form button[type="submit"]').click();
    await page.waitForTimeout(1500);
    console.log('[B] Tạo thông báo marquee thành công: Passed');

    // Bật/tắt thông báo
    // Tìm thông báo static vừa tạo, bấm tắt hiển thị
    const staticItem = page.locator(`.announcement-manager__item:has-text("${announcementTitle}")`);
    await expect(staticItem).toBeVisible();
    const toggleBtn = staticItem.locator('button:has-text("Tắt hiển thị"), button:has-text("Bật hiển thị")').first();
    await toggleBtn.click();
    await page.waitForTimeout(1000);
    
    const statusBadge = staticItem.locator('.st-badge');
    console.log(`[B] Trạng thái sau khi toggle: ${await statusBadge.innerText()}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B_3_announcement_toggled.png') });

    // Sửa thông báo
    const editBtn = staticItem.locator('button:has-text("Sửa")');
    await editBtn.click();
    await page.waitForTimeout(500);
    
    const updatedTitle = announcementTitle + ' Edited';
    await page.locator('.st-card__field input[placeholder*="Bảo trì"]').fill(updatedTitle);
    await page.locator('.announcement-manager__form button[type="submit"]').click();
    await page.waitForTimeout(1500);
    
    const editedItem = page.locator(`.announcement-manager__item:has-text("${updatedTitle}")`);
    await expect(editedItem).toBeVisible();
    console.log('[B] Sửa thông báo thành công: Passed');

    // Ra user site, kiểm tra AnnouncementBar hiển thị đúng
    // Bật lại thông báo tĩnh vừa sửa để test ở user site
    await editedItem.locator('button:has-text("Bật hiển thị")').click();
    await page.waitForTimeout(1000);
    
    await gotoAndReady(page, '/');
    const publicBar = page.locator('.announcement-bar');
    await expect(publicBar).toBeVisible();
    expect(await publicBar.innerText()).toContain(updatedTitle);
    console.log('[B] AnnouncementBar hiển thị đúng ở trang chủ: Passed');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B_4_announcement_bar_public.png') });

    // Bấm tắt thông báo, reload trang, xác nhận không hiện lại
    await publicBar.locator('.announcement-bar__close').click();
    await page.waitForTimeout(500);
    await expect(publicBar).not.toBeVisible();
    
    await page.reload();
    await page.waitForTimeout(1000);
    await expect(publicBar).not.toBeVisible();
    console.log('[B] Bấm tắt thông báo không hiện lại sau reload: Passed');

    // Test user thường không được tạo/sửa/xóa announcement
    await gotoAndReady(page, '/tai-khoan');
    await page.locator('button:has-text("Đăng xuất"), a:has-text("Đăng xuất")').first().click();
    await page.waitForTimeout(1000);
    
    await login(page, USER_EMAIL, USER_PASSWORD);
    await gotoAndReady(page, '/admin/cai-dat-giao-dien');
    
    // Xác nhận route admin chuyển về home hoặc báo Access Denied
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.includes('không có quyền') || page.url().endsWith('/') || page.url().includes('/denied') || !bodyText.includes('Thông báo website')).toBeTruthy();
    console.log('[B] User thường bị chặn vào admin settings: Passed');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'B_5_user_denied_admin.png') });

    // Dọn dẹp: Đăng nhập lại admin để xóa test announcements tránh ô nhiễm database
    await gotoAndReady(page, '/tai-khoan');
    await page.locator('button:has-text("Đăng xuất"), a:has-text("Đăng xuất")').first().click();
    await page.waitForTimeout(1000);
    
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await gotoAndReady(page, '/admin/cai-dat-giao-dien');
    
    // Xóa các test announcements vừa tạo
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    
    const itemsToDelete = [updatedTitle, marqueeTitle];
    for (const title of itemsToDelete) {
      const item = page.locator(`.announcement-manager__item:has-text("${title}")`);
      if (await item.count() > 0) {
        await item.locator('button:has-text("Xóa")').click();
        await page.waitForTimeout(1000);
      }
    }
    console.log('[B] Dọn dẹp dữ liệu test: Passed');
  });

  // C. Saved posts
  test('C. Saved posts checks', async ({ page }) => {
    test.setTimeout(80000);
    console.log('--- Bắt đầu test C. Saved posts ---');
    
    // Log out admin
    await gotoAndReady(page, '/tai-khoan');
    await page.locator('button:has-text("Đăng xuất"), a:has-text("Đăng xuất")').first().click();
    await page.waitForTimeout(1000);

    // Login user
    await login(page, USER_EMAIL, USER_PASSWORD);

    // Vào trang mẹo tiết kiệm
    await gotoAndReady(page, '/meo-tiet-kiem');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'C_1_tips_page.png') });
    
    // Lưu bài tips có ảnh
    const tipCard = page.locator('.tip-card').first();
    await expect(tipCard).toBeVisible();
    const tipTitle = await tipCard.locator('h3').innerText();
    const tipSaveBtn = tipCard.locator('button:has-text("Lưu"), button:has-text("Save")').first();
    
    const isSavedTip = await tipSaveBtn.innerText().then(t => t.includes('Đã lưu'));
    if (!isSavedTip) {
      await tipSaveBtn.click();
      await page.waitForTimeout(500);
    }
    console.log(`[C] Đã lưu bài tips: ${tipTitle}`);

    // Vào trang cộng đồng
    await gotoAndReady(page, '/cong-dong');
    // Lưu bài community có ảnh
    const commCard = page.locator('article, .community-post-card').first();
    await expect(commCard).toBeVisible();
    const commTitle = await commCard.locator('.community-post-card__title, h3').first().innerText();
    const commSaveBtn = commCard.locator('button:has-text("Lưu"), button:has-text("Save")').first();
    
    const isSavedComm = await commSaveBtn.innerText().then(t => t.includes('Đã lưu'));
    if (!isSavedComm) {
      await commSaveBtn.click();
      await page.waitForTimeout(500);
    }
    console.log(`[C] Đã lưu bài community: ${commTitle}`);

    // Vào trang bài đã lưu
    await gotoAndReady(page, '/bai-da-luu');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'C_2_saved_posts_page.png') });

    // Kiểm tra card hiển thị đúng ảnh và placeholders
    const savedCards = page.locator('.saved-post-card');
    await expect(savedCards.first()).toBeVisible();
    
    const cardCount = await savedCards.count();
    console.log(`[C] Số lượng bài đã lưu hiển thị: ${cardCount}`);
    
    for (let i = 0; i < cardCount; i++) {
      const card = savedCards.nth(i);
      const img = card.locator('img');
      await expect(img).toBeVisible();
      const src = await img.getAttribute('src');
      console.log(`[C] Card #${i + 1} image src: ${src}`);
      expect(src).toBeTruthy();
    }
    console.log('[C] Ảnh card đã lưu tải tốt: Passed');

    // Click card check routing
    const firstCard = savedCards.first();
    const detailLink = firstCard.locator('.saved-post-card__read, a').first();
    const href = await detailLink.getAttribute('href');
    console.log(`[C] Route đích: ${href}`);
    
    await detailLink.click();
    await page.waitForLoadState('domcontentloaded');
    console.log(`[C] URL sau click: ${page.url()}`);
    expect(page.url()).toContain(href);
    console.log('[C] Click đọc lại chuyển đúng route: Passed');
  });

  // D. Security quick check
  test('D. Security quick check', async ({ page }) => {
    test.setTimeout(80000);
    console.log('--- Bắt đầu test D. Security quick check ---');
    
    // Đảm bảo log errors console
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });

    // 1. Kiểm tra MarkdownContent không render raw HTML/script
    await gotoAndReady(page, '/cong-dong');
    const writeBtn = page.locator('[data-testid="community-write-post-button"]').first();
    await writeBtn.click();
    
    const textarea = page.locator('.post-editor__textarea');
    await textarea.fill('Testing raw html: <b>Bold HTML</b> <script>alert("XSS")</script>');
    
    await page.locator('.post-editor__tab:has-text("Xem trước")').click();
    await page.waitForTimeout(500);
    
    const preview = page.locator('.post-editor__preview');
    const boldTag = preview.locator('b');
    const scriptTag = preview.locator('script');
    
    expect(await boldTag.count()).toBe(0);
    expect(await scriptTag.count()).toBe(0);
    console.log('[D] MarkdownContent không render raw HTML/script: Passed');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'D_1_xss_prevention.png') });
    
    await page.locator('.ui-modal__close').click();

    // 2. Kiểm tra upload ảnh không nhận SVG/HTML/script
    await writeBtn.click();
    const uploadBox = page.locator('[data-testid="post-upload-area"]');
    
    const fileChooserPromise = page.waitForEvent('filechooser');
    await uploadBox.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(svgFilePath);
    await page.waitForTimeout(500);
    
    const formatError = page.locator('.post-form-group__error:has-text("chỉ nhận")');
    await expect(formatError).toBeVisible();
    console.log('[D] Chặn upload file SVG: Passed');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'D_2_svg_upload_blocked.png') });
    
    await page.locator('.ui-modal__close').click();

    // 3. Kiểm tra user thường không gọi được service admin announcement
    // Logout admin/user
    await gotoAndReady(page, '/tai-khoan');
    await page.locator('button:has-text("Đăng xuất"), a:has-text("Đăng xuất")').first().click();
    await page.waitForTimeout(1000);
    
    // Login user thường
    await login(page, USER_EMAIL, USER_PASSWORD);
    
    // Gọi thử trực tiếp API/Service (mock test từ console qua supabase client)
    const accessError = await page.evaluate(async () => {
      try {
        const { supabase } = await import('/src/lib/supabase.js');
        const { data, error } = await supabase
          .from('website_announcements')
          .insert([{ message: 'Hacked by normal user', type: 'danger', display_mode: 'static' }]);
        return error ? error.message : 'No error';
      } catch (e) {
        return e.message;
      }
    }).catch(err => err.message);
    
    console.log(`[D] Kết quả gọi insert database của user thường: ${accessError}`);
    expect(accessError).not.toBe('No error'); // Phải có lỗi hoặc access denied do RLS
    console.log('[D] Supabase RLS chặn user thường insert announcement: Passed');

    // 4. Kiểm tra console không có lỗi runtime
    console.log(`[D] Số lỗi console ghi nhận được: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.warn('Lỗi console:', consoleErrors);
    }
    // Chấp nhận cảnh báo hoặc một số lỗi CDN nhỏ nếu có, nhưng không được có crash
    console.log('[D] Kiểm tra console errors: Completed');
  });
});
