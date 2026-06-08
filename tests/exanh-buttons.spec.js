import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

const pages = [
  '/',
  '/bai-viet',
  '/lich-cat-dien',
  '/bai-da-luu',
  '/admin/dashboard',
  '/admin/bai-viet',
  '/admin/binh-luan',
  '/admin/duyet-bai',
];

test.describe('E-XANH button check', () => {
  for (const path of pages) {
    test(`Kiểm tra các nút ở ${path}`, async ({ page }) => {
      await page.goto(`${BASE_URL}${path}`);

      const buttons = await page.locator('button').count();

      console.log(`${path} có ${buttons} nút`);

      for (let i = 0; i < buttons; i++) {
        const button = page.locator('button').nth(i);

        if (await button.isVisible() && await button.isEnabled()) {
          await button.click({ timeout: 3000 }).catch(() => {
            throw new Error(`Nút số ${i + 1} ở trang ${path} bị lỗi khi click`);
          });
        }
      }

      expect(true).toBeTruthy();
    });
  }
});