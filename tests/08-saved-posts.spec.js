import { test, expect } from '@playwright/test';

test.describe('08 - Saved Posts Page', () => {
  test('Trang bài đã lưu không trắng màn', async ({ page }) => {
    await page.goto('/bai-da-luu');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).not.toContainText('undefined');
    await expect(page.locator('body')).not.toContainText('NaN');
  });

  test('Nếu chưa đăng nhập phải có hướng dẫn đăng nhập hoặc empty state', async ({ page }) => {
    await page.goto('/bai-da-luu');
    await expect(page.locator('body')).toContainText(/lưu|đăng nhập|chưa có|bài viết/i);
  });
});
