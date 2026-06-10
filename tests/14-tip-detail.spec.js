import { test, expect } from '@playwright/test';

test.describe('14 - Chi tiết bài mẹo tiết kiệm', () => {
  test('TC14-01 - Vào chi tiết từ danh sách bài mẹo', async ({ page }) => {
    await page.goto('/meo-tiet-kiem');

    const firstArticle = page.locator('article a[href*="/meo-tiet-kiem/"], a[href*="/meo-tiet-kiem/"]').first();

    if (await firstArticle.count()) {
      await firstArticle.click();
      await expect(page).toHaveURL(/meo-tiet-kiem\/.+/);
      await expect(page.locator('body')).not.toContainText(/undefined|null|NaN|\[object Object\]/i);
    }
  });

  test('TC14-02 - Chi tiết bài không lỗi ảnh', async ({ page }) => {
    await page.goto('/meo-tiet-kiem');

    const firstArticle = page.locator('article a[href*="/meo-tiet-kiem/"], a[href*="/meo-tiet-kiem/"]').first();

    if (await firstArticle.count()) {
      await firstArticle.click();

      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const box = await images.nth(i).boundingBox();
        expect(box?.width || 0).toBeGreaterThan(0);
        expect(box?.height || 0).toBeGreaterThan(0);
      }
    }
  });

  test('TC14-03 - Related posts nếu có không vỡ layout', async ({ page }) => {
    await page.goto('/meo-tiet-kiem');

    const firstArticle = page.locator('article a[href*="/meo-tiet-kiem/"], a[href*="/meo-tiet-kiem/"]').first();

    if (await firstArticle.count()) {
      await firstArticle.click();

      const scrollWidth = await page.locator('body').evaluate(el => el.scrollWidth);
      const viewportWidth = page.viewportSize().width;
      expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 20);
    }
  });
});
