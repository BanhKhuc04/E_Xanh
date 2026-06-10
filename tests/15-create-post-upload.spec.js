import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('15 - Đăng bài upload ảnh chuyên sâu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dang-bai');
  });

  test('TC15-01 - Có vùng upload hoặc input file', async ({ page }) => {
    const fileInput = page.getByTestId('post-image-input');
    expect(await fileInput.count()).toBeGreaterThan(0);
  });

  test('TC15-02 - Chọn ảnh thủ công có preview/phản hồi', async ({ page }) => {
    const fileInput = page.getByTestId('post-image-input').first();
    const imagePath = path.resolve('fixtures/test-image.png');

    if (await fileInput.count()) {
      await fileInput.setInputFiles(imagePath);
      await expect(page.locator('body')).not.toContainText(/lỗi|không hợp lệ|quá dung lượng/i);
    }
  });

  test('TC15-03 - Nút Lưu nháp không crash sau khi có ảnh', async ({ page }) => {
    const fileInput = page.getByTestId('post-image-input').first();
    const imagePath = path.resolve('fixtures/test-image.png');

    if (await fileInput.count()) {
      await fileInput.setInputFiles(imagePath);
    }

    const draftBtn = page.getByRole('button', { name: /Lưu nháp/i }).first();

    if (await draftBtn.count()) {
      await draftBtn.click();
      await expect(page.locator('body')).not.toContainText(/undefined|null|NaN/i);
    }
  });

  test('TC15-04 - Form không gửi khi thiếu nội dung bắt buộc', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: /Gửi bài|Đăng bài/i }).first();

    if (await submitBtn.count()) {
      await submitBtn.click();
      await expect(page.locator('body')).toContainText(/vui lòng|bắt buộc|nhập|thiếu/i);
    }
  });
});
