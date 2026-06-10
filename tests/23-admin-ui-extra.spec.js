import { test, expect } from '@playwright/test';

test.describe('23 - Admin UI Extra Smoke', () => {
  test('TC23-01 - Admin dashboard không crash', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/undefined|null|NaN|\[object Object\]/i);
  });

  test('TC23-02 - Admin bài viết không crash hoặc redirect login', async ({ page }) => {
    await page.goto('/admin/quan-ly-bai-viet');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/undefined|null|NaN/i);
  });

  test('TC23-03 - Admin bình luận không crash hoặc redirect login', async ({ page }) => {
    await page.goto('/admin/quan-ly-binh-luan');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/undefined|null|NaN/i);
  });

  test('TC23-04 - Admin cài đặt giao diện không crash hoặc redirect login', async ({ page }) => {
    await page.goto('/admin/cai-dat-giao-dien');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/undefined|null|NaN/i);
  });
});
