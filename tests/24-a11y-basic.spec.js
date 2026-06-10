import { test, expect } from '@playwright/test';

const pages = ['/', '/cong-dong', '/dang-bai', '/kiem-tra-tien-dien', '/dang-nhap'];

test.describe('24 - Accessibility cơ bản', () => {
  for (const path of pages) {
    test(`TC24 - ${path} có heading và ảnh có alt`, async ({ page }) => {
      await page.goto(path);

      const headings = page.locator('h1, h2');
      expect(await headings.count()).toBeGreaterThan(0);

      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        expect(alt).not.toBeNull();
      }
    });
  }

  test('TC24-06 - Form đăng nhập có input email/password', async ({ page }) => {
    await page.goto('/dang-nhap');

    const email = page.locator('input[type="email"], input[name*="email" i]').first();
    const password = page.locator('input[type="password"]').first();

    expect(await email.count()).toBeGreaterThan(0);
    expect(await password.count()).toBeGreaterThan(0);
  });
});
