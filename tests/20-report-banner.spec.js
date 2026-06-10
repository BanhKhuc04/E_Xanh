import { test, expect } from '@playwright/test';

test.describe('20 - Banner thông báo phiên bản và báo lỗi', () => {
  test('TC20-01 - Banner thông báo nếu có thì không che toàn bộ màn hình', async ({ page }) => {
    await page.goto('/');

    const bannerText = page.getByText(/đang trong quá trình phát triển|phiên bản hiện tại/i).first();

    if (await bannerText.count()) {
      await expect(bannerText).toBeVisible();
      const scrollWidth = await page.locator('body').evaluate(el => el.scrollWidth);
      const viewportWidth = page.viewportSize().width;
      expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 20);
    }
  });

  test('TC20-02 - Nút đóng thông báo hoạt động', async ({ page }) => {
    await page.goto('/');

    const closeBtn = page.getByRole('button', { name: /Đóng thông báo/i });

    if (await closeBtn.count()) {
      await closeBtn.click();
      await expect(closeBtn).toBeHidden();
    }
  });

  test('TC20-03 - Nút báo lỗi tồn tại nếu banner có', async ({ page }) => {
    await page.goto('/');

    const reportBtn = page.getByRole('button', { name: /Báo cáo lỗi/i });

    if (await reportBtn.count()) {
      await expect(reportBtn).toBeVisible();
    }
  });
});
