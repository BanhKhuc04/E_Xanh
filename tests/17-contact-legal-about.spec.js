import { test, expect } from '@playwright/test';

const staticPages = [
  ['/ve-chung-toi', /Về chúng tôi|E-XANH|sứ mệnh|dự án/i],
  ['/dieu-khoan', /Điều khoản|quy định|sử dụng/i],
  ['/lien-he', /Liên hệ|email|form|góp ý/i],
];

test.describe('17 - Static Pages: About, Terms, Contact', () => {
  for (const [path, keyword] of staticPages) {
    test(`TC17 - ${path} load nội dung`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('body')).toContainText(keyword);
      await expect(page.locator('body')).not.toContainText(/undefined|null|NaN|\[object Object\]/i);
    });
  }

  test('TC17-04 - Form liên hệ nếu có thì nhập được', async ({ page }) => {
    await page.goto('/lien-he');

    const inputs = page.locator('input, textarea');
    const count = await inputs.count();

    if (count > 0) {
      await inputs.first().fill('Playwright test contact');
      await expect(inputs.first()).toHaveValue(/Playwright test contact/i);
    }
  });
});
