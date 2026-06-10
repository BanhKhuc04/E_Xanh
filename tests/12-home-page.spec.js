import { test, expect } from '@playwright/test';

test.describe('12 - Home Page chuyên sâu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC12-01 - Trang chủ load hero chính', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/E-XANH|sống xanh|tiết kiệm điện/i);
  });

  test('TC12-02 - Không có text lỗi kỹ thuật trên trang chủ', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('undefined');
    await expect(page.locator('body')).not.toContainText('null');
    await expect(page.locator('body')).not.toContainText('NaN');
    await expect(page.locator('body')).not.toContainText('[object Object]');
  });

  test('TC12-03 - CTA cộng đồng trên trang chủ hoạt động nếu có', async ({ page }) => {
    const communityCta = page.getByRole('link', { name: /Tham gia cộng đồng|Cộng đồng|Đăng bài ngay/i }).first();

    if (await communityCta.count()) {
      await communityCta.click();
      await expect(page).toHaveURL(/cong-dong|dang-bai/);
    }
  });

  test('TC12-04 - CTA kiểm tra tiền điện hoạt động nếu có', async ({ page }) => {
    const electricityCta = page.getByRole('link', { name: /Kiểm tra tiền điện|Tính tiền điện|Bắt đầu kiểm tra/i }).first();

    if (await electricityCta.count()) {
      await electricityCta.click();
      await expect(page).toHaveURL(/kiem-tra-tien-dien/);
    }
  });

  test('TC12-05 - Bài viết nổi bật không vỡ layout', async ({ page }) => {
    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    const viewportWidth = page.viewportSize().width;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20);
  });

  test('TC12-06 - Tất cả ảnh trên trang chủ có kích thước hợp lệ', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();

      const box = await img.boundingBox();
      expect(box?.width || 0).toBeGreaterThan(0);
      expect(box?.height || 0).toBeGreaterThan(0);
    }
  });

  test('TC12-07 - Thông báo phiên bản/báo lỗi nếu có thì nút hoạt động', async ({ page }) => {
    const closeBtn = page.getByRole('button', { name: /Đóng thông báo/i });

    if (await closeBtn.count()) {
      await closeBtn.click();
      await expect(closeBtn).toBeHidden();
    }

    await page.reload();

    const reportBtn = page.getByRole('button', { name: /Báo cáo lỗi/i });

    if (await reportBtn.count()) {
      await expect(reportBtn).toBeVisible();
    }
  });

  test('TC12-08 - Footer hiện copyright Made by VanhKhucDev', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]');
    await expect(footer).toContainText(/VanhKhucDev|E-XANH/i);
  });
});
