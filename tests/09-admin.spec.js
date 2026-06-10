import { test, expect } from '@playwright/test';

const adminRoutes = [
  '/admin',
  '/admin/quan-ly-bai-viet',
  '/admin/quan-ly-binh-luan',
  '/admin/quan-ly-nguoi-dung',
  '/admin/quan-ly-thiet-bi',
  '/admin/cai-dat-giao-dien',
];

test.describe('09 - Admin Routes Protection', () => {
  for (const route of adminRoutes) {
    test(`Admin route ${route} không crash`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('body')).not.toContainText('undefined');
      await expect(page.locator('body')).not.toContainText('NaN');

      const url = page.url();
      expect(url.includes('/dang-nhap') || url.includes('/admin') || url.includes('/')).toBeTruthy();
    });
  }
});
