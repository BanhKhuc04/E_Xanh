import { test, expect } from '@playwright/test';

test.describe('21 - Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
  });

  test('TC21-01 - Mobile không tràn ngang', async ({ page }) => {
    const scrollWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(410);
  });

  test('TC21-02 - Menu mobile nếu có thì mở được', async ({ page }) => {
    const menuBtn = page.getByRole('button', { name: /menu|mở menu|điều hướng/i }).first();

    if (await menuBtn.count()) {
      await menuBtn.click();
      await expect(page.locator('body')).toContainText(/Trang chủ|Cộng đồng|Mẹo tiết kiệm/i);
    }
  });

  test('TC21-03 - Link cộng đồng trên mobile hoạt động', async ({ page }) => {
    const communityLink = page.getByRole('link', { name: /Cộng đồng/i }).first();

    if (await communityLink.count()) {
      await communityLink.click();
      await expect(page).toHaveURL(/cong-dong/);
    }
  });
});
