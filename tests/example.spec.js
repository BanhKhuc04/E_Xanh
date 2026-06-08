import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

const pages = [
  '/',
  '/bai-viet',
  '/lich-cat-dien',
  '/bai-da-luu',
  '/dang-nhap',
  '/dang-ky',
  '/admin',
  '/admin/dashboard',
  '/admin/bai-viet',
  '/admin/binh-luan',
  '/admin/duyet-bai',
];

test.describe('E-XANH full website check', () => {
  for (const path of pages) {
    test(`Trang ${path} mở được và không lỗi console`, async ({ page }) => {
      const errors = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.goto(`${BASE_URL}${path}`);
      await expect(page).toHaveURL(new RegExp(path.replace('/', '.*')));

      expect(errors).toEqual([]);
    });
  }
});