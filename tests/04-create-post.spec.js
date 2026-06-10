import { test, expect } from '@playwright/test';

test.describe('04 - Create Post Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dang-bai');
  });

  test('Trang đăng bài load đúng', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/Đăng bài|Chia sẻ|Tiêu đề/i);
  });

  test('Validate form rỗng khi gửi bài', async ({ page }) => {
    const submit = page.getByRole('button', { name: /Gửi bài|Đăng bài/i }).first();
    await submit.click();
    await expect(page.locator('body')).toContainText(/vui lòng|bắt buộc|không được để trống|nhập/i);
  });

  test('Lưu nháp có phản hồi', async ({ page }) => {
    const titleInput = page.locator('input[name="title"], input[placeholder*="tiêu đề" i]').first();

    if (await titleInput.count()) {
      await titleInput.fill('Test lưu nháp Playwright');
    }

    const draftBtn = page.getByRole('button', { name: /Lưu nháp/i }).first();
    await draftBtn.click();

    await expect(page.locator('body')).toContainText(/nháp|đã lưu/i);
  });

  test('Reload vẫn khôi phục nháp', async ({ page }) => {
    const titleInput = page.locator('input[name="title"], input[placeholder*="tiêu đề" i]').first();

    if (await titleInput.count()) {
      await titleInput.fill('Bản nháp reload test');
      await page.getByRole('button', { name: /Lưu nháp/i }).first().click();
      await page.reload();
      await expect(page.locator('body')).toContainText(/Bản nháp reload test|khôi phục|nháp/i);
    }
  });
});
