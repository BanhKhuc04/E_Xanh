# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: custom-verification.spec.js >> E-XANH Browser Verification Suite >> A. Modal đăng bài /cong-dong checks
- Location: tests\custom-verification.spec.js:49:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.ui-modal--composer')
Expected: visible
Timeout: 7000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 7000ms
  - waiting for locator('.ui-modal--composer')

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
  - alert: Vui lòng đăng nhập để đăng bài.
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
  1   | const { test, expect } = require('@playwright/test');
  2   | const fs = require('fs');
  3   | const path = require('path');
  4   | const { gotoAndReady, login, fillFirst, clickByAny } = require('../utils/test-utils');
  5   | 
  6   | const USER_EMAIL = 'khucvietanh04@gmail.com';
  7   | const USER_PASSWORD = '123456';
  8   | const ADMIN_EMAIL = 'vanhkhuc2k5@gmail.com';
  9   | const ADMIN_PASSWORD = 'vanhkhuc';
  10  | 
  11  | const SCREENSHOT_DIR = 'C:/Users/khucv/.gemini/antigravity/brain/e5e71cb6-f77f-4ca4-ac5b-ed3e08338b24/screenshots';
  12  | 
  13  | // Đảm bảo thư mục screenshot tồn tại
  14  | if (!fs.existsSync(SCREENSHOT_DIR)) {
  15  |   fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  16  | }
  17  | 
  18  | // Hàm helper tạo file dummy để test upload
  19  | function createDummyFile(filename, sizeBytes, content = '') {
  20  |   const dir = path.join(__dirname, '../fixtures');
  21  |   if (!fs.existsSync(dir)) {
  22  |     fs.mkdirSync(dir, { recursive: true });
  23  |   }
  24  |   const filePath = path.join(dir, filename);
  25  |   if (sizeBytes > 0) {
  26  |     const buffer = Buffer.alloc(sizeBytes);
  27  |     fs.writeFileSync(filePath, buffer);
  28  |   } else {
  29  |     fs.writeFileSync(filePath, content, 'utf8');
  30  |   }
  31  |   return filePath;
  32  | }
  33  | 
  34  | test.describe('E-XANH Browser Verification Suite', () => {
  35  |   let smallImgPath;
  36  |   let largeImgPath;
  37  |   let badFilePath;
  38  |   let svgFilePath;
  39  | 
  40  |   test.beforeAll(async () => {
  41  |     // Tạo các files test
  42  |     smallImgPath = createDummyFile('test-small.png', 10 * 1024); // 10KB
  43  |     largeImgPath = createDummyFile('test-large.jpg', 5.5 * 1024 * 1024); // 5.5MB
  44  |     badFilePath = createDummyFile('test-invalid.txt', 0, 'dummy text content');
  45  |     svgFilePath = createDummyFile('test-svg.svg', 0, '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40"/><script>console.log("xss")</script></svg>');
  46  |   });
  47  | 
  48  |   // A. Modal đăng bài /cong-dong
  49  |   test('A. Modal đăng bài /cong-dong checks', async ({ page }) => {
  50  |     test.setTimeout(80000);
  51  |     console.log('--- Bắt đầu test A. Modal đăng bài /cong-dong ---');
  52  |     
  53  |     // Đăng nhập tài khoản user
  54  |     await login(page, USER_EMAIL, USER_PASSWORD);
  55  |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_0_logged_in.png') });
  56  |     
  57  |     // Vào trang cộng đồng
  58  |     await gotoAndReady(page, '/cong-dong');
  59  |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_1_community_page.png') });
  60  | 
  61  |     // Mở modal “Chia sẻ với cộng đồng”
  62  |     const writeBtn = page.locator('[data-testid="community-write-post-button"]').first();
  63  |     await expect(writeBtn).toBeVisible();
  64  |     await writeBtn.click();
  65  |     
  66  |     const modal = page.locator('.ui-modal--composer');
> 67  |     await expect(modal).toBeVisible();
      |                         ^ Error: expect(locator).toBeVisible() failed
  68  |     console.log('[A] Modal đã mở thành công.');
  69  |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_2_modal_open.png') });
  70  | 
  71  |     // Kiểm tra header/footer sticky, body cuộn riêng, không tràn màn hình 1080p
  72  |     const header = page.locator('.ui-modal__header');
  73  |     const footer = page.locator('.ui-modal__footer');
  74  |     const body = page.locator('.composer-modal__body');
  75  |     
  76  |     await expect(header).toBeVisible();
  77  |     await expect(footer).toBeVisible();
  78  |     await expect(body).toBeVisible();
  79  |     
  80  |     const headerPos = await header.evaluate(el => window.getComputedStyle(el).position);
  81  |     const footerPos = await footer.evaluate(el => window.getComputedStyle(el).position);
  82  |     const bodyOverflow = await body.evaluate(el => window.getComputedStyle(el).overflow);
  83  |     
  84  |     console.log(`[A] Header position style: ${headerPos}`);
  85  |     console.log(`[A] Footer position style: ${footerPos}`);
  86  |     console.log(`[A] Body overflow style: ${bodyOverflow}`);
  87  |     
  88  |     expect(headerPos === 'sticky' || headerPos === 'fixed').toBeTruthy();
  89  |     expect(footerPos === 'sticky' || footerPos === 'fixed').toBeTruthy();
  90  |     expect(bodyOverflow).toContain('auto');
  91  | 
  92  |     // Click khu ảnh bìa và nút "Chọn ảnh bìa", xác nhận đều mở file picker
  93  |     const uploadBox = page.locator('[data-testid="post-upload-area"]');
  94  |     
  95  |     const fileChooserPromise1 = page.waitForEvent('filechooser');
  96  |     await uploadBox.click();
  97  |     const fileChooser1 = await fileChooserPromise1;
  98  |     console.log('[A] Click khu ảnh bìa mở file picker: Passed');
  99  |     
  100 |     // Upload JPG/PNG/WEBP dưới 5MB, có preview
  101 |     await fileChooser1.setFiles(smallImgPath);
  102 |     await page.waitForTimeout(1000);
  103 |     const previewImg = page.locator('[data-testid="post-upload-area"] img');
  104 |     await expect(previewImg).toBeVisible();
  105 |     console.log('[A] Upload file dưới 5MB và hiển thị preview: Passed');
  106 |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_3_cover_preview.png') });
  107 | 
  108 |     // Upload file sai định dạng, phải báo lỗi thân thiện
  109 |     const removeCoverBtn = page.locator('[data-testid="post-upload-area"] button:has-text("Xóa ảnh")');
  110 |     await removeCoverBtn.click();
  111 |     await page.waitForTimeout(500);
  112 |     
  113 |     const fileChooserPromise2 = page.waitForEvent('filechooser');
  114 |     await uploadBox.click();
  115 |     const fileChooser2 = await fileChooserPromise2;
  116 |     await fileChooser2.setFiles(badFilePath);
  117 |     await page.waitForTimeout(500);
  118 |     
  119 |     const invalidError = page.locator('.post-form-group__error:has-text("chỉ nhận")');
  120 |     await expect(invalidError).toBeVisible();
  121 |     console.log('[A] Báo lỗi upload sai định dạng file: Passed');
  122 |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_4_invalid_format_error.png') });
  123 | 
  124 |     // Upload file lớn hơn 5MB, phải báo lỗi
  125 |     const fileChooserPromise3 = page.waitForEvent('filechooser');
  126 |     await uploadBox.click();
  127 |     const fileChooser3 = await fileChooserPromise3;
  128 |     await fileChooser3.setFiles(largeImgPath);
  129 |     await page.waitForTimeout(500);
  130 |     
  131 |     const sizeError = page.locator('.post-form-group__error:has-text("5MB")');
  132 |     await expect(sizeError).toBeVisible();
  133 |     console.log('[A] Báo lỗi upload file > 5MB: Passed');
  134 |     await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'A_5_large_size_error.png') });
  135 | 
  136 |     // Xóa ảnh bìa
  137 |     const fileChooserPromise4 = page.waitForEvent('filechooser');
  138 |     await uploadBox.click();
  139 |     const fileChooser4 = await fileChooserPromise4;
  140 |     await fileChooser4.setFiles(smallImgPath);
  141 |     await page.waitForTimeout(500);
  142 |     await removeCoverBtn.click();
  143 |     await page.waitForTimeout(500);
  144 |     await expect(previewImg).not.toBeVisible();
  145 |     console.log('[A] Xóa ảnh bìa: Passed');
  146 | 
  147 |     // Viết nội dung markdown, dùng toolbar: đậm, nghiêng, tiêu đề, danh sách, quote, link
  148 |     const textarea = page.locator('.post-editor__textarea');
  149 |     await expect(textarea).toBeVisible();
  150 |     await textarea.fill('Nội dung markdown: ');
  151 |     
  152 |     // Test bold
  153 |     await page.locator('.post-editor__tool:has-text("In đậm")').click();
  154 |     // Test italic
  155 |     await page.locator('.post-editor__tool:has-text("In nghiêng")').click();
  156 |     // Test heading
  157 |     await page.locator('.post-editor__tool:has-text("Tiêu đề")').click();
  158 |     // Test list
  159 |     await page.locator('.post-editor__tool:has-text("Danh sách")').click();
  160 |     // Test quote
  161 |     await page.locator('.post-editor__tool:has-text("Trích dẫn")').click();
  162 |     
  163 |     const currentVal = await textarea.inputValue();
  164 |     console.log(`[A] Giá trị nội dung sau khi nhấn toolbar: ${currentVal}`);
  165 |     expect(currentVal).toContain('**');
  166 |     expect(currentVal).toContain('*');
  167 |     expect(currentVal).toContain('##');
```