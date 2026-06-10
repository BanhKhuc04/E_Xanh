import { test, expect } from '@playwright/test';

test.describe('02 - Navbar & Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Logo hiển thị và click về trang chủ', async ({ page }) => {
    const logo = page.getByRole('link', { name: /E-XANH/i }).first();
    await expect(logo).toBeVisible();
    await logo.click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('Menu chính hoạt động', async ({ page }) => {
    await page.getByRole('link', { name: /Mẹo tiết kiệm/i }).first().click();
    await expect(page).toHaveURL(/meo-tiet-kiem/);

    await page.goto('/');
    await page.getByRole('link', { name: /Cộng đồng/i }).first().click();
    await expect(page).toHaveURL(/cong-dong/);

    await page.goto('/');
    await page.getByRole('link', { name: /Kiểm tra tiền điện/i }).first().click();
    await expect(page).toHaveURL(/kiem-tra-tien-dien/);
  });

  test('Footer có đủ link chính', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]');
    await expect(footer).toBeVisible();
    await expect(footer.getByRole('link', { name: /Liên hệ/i })).toBeVisible();
    await expect(footer.getByRole('link', { name: /Điều khoản/i })).toBeVisible();
  });
});
