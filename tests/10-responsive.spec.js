import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Mobile', width: 390, height: 844 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Laptop', width: 1366, height: 768 },
  { name: 'Desktop', width: 1920, height: 1080 },
];

const pages = [
  '/',
  '/cong-dong',
  '/dang-bai',
  '/kiem-tra-tien-dien',
  '/meo-tiet-kiem',
];

test.describe('10 - Responsive Layout', () => {
  for (const viewport of viewports) {
    for (const path of pages) {
      test(`${viewport.name} - ${path} không tràn ngang`, async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });

        await page.goto(path);

        const scrollWidth = await page.locator('body').evaluate(el => el.scrollWidth);
        expect(scrollWidth).toBeLessThanOrEqual(viewport.width + 20);
      });
    }
  }
});
