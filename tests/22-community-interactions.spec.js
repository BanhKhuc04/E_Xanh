import { test, expect } from '@playwright/test';

test.describe('22 - Community Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cong-dong');
  });

  test('TC22-01 - Nút thích không crash', async ({ page }) => {
    const likeBtn = page.getByRole('button', { name: /Thích/i }).first();

    if (await likeBtn.count()) {
      await likeBtn.click();
      await expect(page.locator('body')).not.toContainText(/undefined|null|NaN/i);
    }
  });

  test('TC22-02 - Nút lưu bài không crash', async ({ page }) => {
    const saveBtn = page.getByRole('button', { name: /Lưu bài|Lưu/i }).first();

    if (await saveBtn.count()) {
      await saveBtn.click();
      await expect(page.locator('body')).not.toContainText(/undefined|null|NaN/i);
    }
  });

  test('TC22-03 - Nút chia sẻ/copy link không crash', async ({ page }) => {
    const shareBtn = page.getByRole('button', { name: /Chia sẻ/i }).first();

    if (await shareBtn.count()) {
      await shareBtn.click();
      await expect(page.locator('body')).not.toContainText(/undefined|null|NaN/i);
    }
  });

  test('TC22-04 - Nút bình luận có phản hồi hoặc vào chi tiết', async ({ page }) => {
    const commentBtn = page.getByRole('button', { name: /Bình luận/i }).first();

    if (await commentBtn.count()) {
      await commentBtn.click();
      await expect(page.locator('body')).not.toContainText(/undefined|null|NaN/i);
    }
  });
});
