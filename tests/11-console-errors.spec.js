import { test, expect } from '@playwright/test';

const pages = [
  '/',
  '/cong-dong',
  '/dang-bai',
  '/kiem-tra-tien-dien',
  '/meo-tiet-kiem',
  '/bai-da-luu',
  '/dang-nhap',
  '/dang-ky',
];

test.describe('11 - Console Error Check', () => {
  for (const path of pages) {
    test(`Không có console error nghiêm trọng tại ${path}`, async ({ page }) => {
      const errors = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.goto(path);
      await page.waitForTimeout(1000);

      const seriousErrors = errors.filter(error =>
        !error.includes('favicon') &&
        !error.includes('ResizeObserver') &&
        !error.includes('Failed to load resource') &&
        !error.includes('net::ERR_ABORTED')
      );

      expect(seriousErrors).toEqual([]);
    });
  }
});
