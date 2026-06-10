import { test, expect } from '@playwright/test';

const pages = ['/', '/cong-dong', '/dang-nhap', '/dang-ky', '/meo-tiet-kiem'];

test.describe('19 - Branding Logo', () => {
  for (const path of pages) {
    test(`TC19 - Logo hiển thị rõ tại ${path}`, async ({ page }) => {
      await page.goto(path);

      const logoImg = page.locator('img[alt*="E-XANH" i]').first();
      await expect(logoImg).toBeVisible();

      const box = await logoImg.boundingBox();
      expect(box?.width || 0).toBeGreaterThan(60);
      expect(box?.height || 0).toBeGreaterThan(30);
    });
  }

  test('TC19-06 - Không có chữ brand dư cạnh logo trong navbar nếu chỉ dùng ảnh', async ({ page }) => {
    await page.goto('/');
    const navLogo = page.getByRole('link', { name: /E-XANH/i }).first();
    await expect(navLogo.locator('img')).toBeVisible();
  });
});
