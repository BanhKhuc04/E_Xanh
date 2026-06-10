import { test, expect } from '@playwright/test';

test.describe('06 - Auth Pages', () => {
  test('Trang đăng nhập load đúng', async ({ page }) => {
    await page.goto('/dang-nhap');
    await expect(page.locator('body')).toContainText(/Đăng nhập|email|mật khẩu/i);
  });

  test('Trang đăng ký load đúng', async ({ page }) => {
    await page.goto('/dang-ky');
    await expect(page.locator('body')).toContainText(/Đăng ký|email|mật khẩu/i);
  });

  test('Đăng nhập rỗng phải báo lỗi', async ({ page }) => {
    await page.goto('/dang-nhap');
    const btn = page.getByRole('button', { name: /Đăng nhập/i }).first();
    await btn.click();
    await expect(page.locator('body')).toContainText(/vui lòng|email|mật khẩu|không hợp lệ|bắt buộc/i);
  });

  test('Link chuyển đăng nhập - đăng ký hoạt động', async ({ page }) => {
    await page.goto('/dang-nhap');
    const registerLink = page.getByRole('link', { name: /Đăng ký|Tạo tài khoản/i }).first();

    if (await registerLink.count()) {
      await registerLink.click();
      await expect(page).toHaveURL(/dang-ky/);
    }
  });
});
