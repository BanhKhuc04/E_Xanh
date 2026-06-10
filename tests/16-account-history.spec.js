import { test, expect } from '@playwright/test';

test.describe('16 - Tài khoản, lịch sử, bài đã lưu', () => {
  test('TC16-01 - Trang tài khoản không crash hoặc redirect đúng', async ({ page }) => {
    await page.goto('/tai-khoan');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/undefined|null|NaN/i);
  });

  test('TC16-02 - Trang lịch sử điện không crash hoặc redirect đúng', async ({ page }) => {
    await page.goto('/lich-su-kiem-tra');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/undefined|null|NaN/i);
  });

  test('TC16-03 - Trang bài đã lưu không crash', async ({ page }) => {
    await page.goto('/bai-da-luu');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/undefined|null|NaN/i);
  });

  test('TC16-04 - Nếu chưa đăng nhập có CTA đăng nhập', async ({ page }) => {
    await page.goto('/tai-khoan');
    const bodyText = await page.locator('body').innerText();
    expect(/đăng nhập|tài khoản|profile|hồ sơ/i.test(bodyText)).toBeTruthy();
  });
});
