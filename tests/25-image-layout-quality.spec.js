import { test, expect } from '@playwright/test';

const pages = ['/', '/cong-dong', '/meo-tiet-kiem', '/dang-nhap', '/dang-ky'];

test.describe('25 - Image & Layout Quality', () => {
  for (const path of pages) {
    test(`TC25 - ${path} ảnh không bị kích thước 0 và không tràn ngang`, async ({ page }) => {
      await page.goto(path);

      const scrollWidth = await page.locator('body').evaluate(el => el.scrollWidth);
      const viewportWidth = page.viewportSize().width;
      expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 20);

      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);

        if (await img.isVisible()) {
          const box = await img.boundingBox();
          expect(box?.width || 0).toBeGreaterThan(0);
          expect(box?.height || 0).toBeGreaterThan(0);
        }
      }
    });
  }

  test('TC25-06 - Text dài cộng đồng không làm tràn ngang', async ({ page }) => {
    await page.goto('/cong-dong');
    const scrollWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    const viewportWidth = page.viewportSize().width;
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 20);
  });
});
