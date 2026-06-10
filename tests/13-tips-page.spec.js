import { test, expect } from '@playwright/test';

test.describe('13 - Trang Mẹo tiết kiệm', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/meo-tiet-kiem');
  });

  test('TC13-01 - Trang mẹo tiết kiệm load đúng', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/Mẹo tiết kiệm|tiết kiệm điện|bài viết/i);
    await expect(page.locator('body')).not.toContainText(/undefined|null|NaN/i);
  });

  test('TC13-02 - Ô tìm kiếm/filter nếu có phải nhập được', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="tìm" i], input[placeholder*="search" i]').first();

    if (await searchInput.count()) {
      await searchInput.fill('điều hòa');
      await expect(searchInput).toHaveValue(/điều hòa/i);
    }
  });

  test('TC13-03 - Click bài viết đầu tiên nếu có', async ({ page }) => {
    const firstTipLink = page.getByTestId('tip-card-link').first();

    if (await firstTipLink.count()) {
      await firstTipLink.click();
      await expect(page).toHaveURL(/meo-tiet-kiem\/.+/);
      await expect(page.locator('body')).not.toContainText(/undefined|null|NaN/i);
    }
  });

  test('TC13-04 - Không tràn ngang layout', async ({ page }) => {
    const scrollWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    const viewportWidth = page.viewportSize().width;
    const tipCard = page.getByTestId('tip-card');
    expect(await tipCard.count()).toBeGreaterThan(0);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 20);
  });
});
