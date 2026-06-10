import { test, expect } from '@playwright/test';

test.describe('18 - 404 và ScrollToTop', () => {
  test('TC18-01 - Route sai không làm trắng màn', async ({ page }) => {
    await page.goto('/route-khong-ton-tai-playwright');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/undefined|null|NaN/i);
  });

  test('TC18-02 - Chuyển route phải tự lên đầu trang', async ({ page }) => {
    await page.goto('/cong-dong');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(200);

    await page.getByRole('link', { name: /Trang chủ/i }).first().click();
    // Wait for smooth scroll to finish
    await expect.poll(async () => {
      return await page.evaluate(() => window.scrollY);
    }, { timeout: 3000 }).toBeLessThan(50);
  });
});
