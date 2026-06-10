import { test, expect } from '@playwright/test';

test.describe('03 - Community Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cong-dong');
  });

  test('TC01 - Trang cộng đồng load đúng', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Cộng đồng E-XANH/i })).toBeVisible();
  });

  test('TC02 - Nút viết bài chia sẻ hoạt động', async ({ page }) => {
    await page.getByTestId('community-write-post-button').click();
    await expect(page).toHaveURL(/dang-bai/);
  });

  test('TC03 - Ô composer chuyển sang đăng bài', async ({ page }) => {
    await page.getByRole('link', { name: /Bạn muốn chia sẻ mẹo tiết kiệm điện nào/i }).click();
    await expect(page).toHaveURL(/dang-bai/);
  });

  test('TC04 - Tab Ảnh/Chủ đề/Mẹo nhanh hoạt động', async ({ page }) => {
    await page.getByRole('link', { name: /^Ảnh$/i }).click();
    await expect(page).toHaveURL(/dang-bai/);

    await page.goto('/cong-dong');
    await page.getByRole('link', { name: /^Chủ đề$/i }).click();
    await expect(page).toHaveURL(/dang-bai/);

    await page.goto('/cong-dong');
    await page.getByRole('link', { name: /^Mẹo nhanh$/i }).click();
    await expect(page).toHaveURL(/dang-bai/);
  });

  test('TC05 - Bộ lọc cộng đồng click được', async ({ page }) => {
    const filterBar = page.getByRole('tablist', { name: /Bộ lọc cộng đồng/i });
    await filterBar.getByRole('button', { name: 'Tất cả' }).click();
    await filterBar.getByRole('button', { name: 'Mới nhất' }).click();
    await filterBar.getByRole('button', { name: 'Nhiều tương tác' }).click();
    await filterBar.getByRole('button', { name: 'Hỏi đáp' }).click();
    await filterBar.getByRole('button', { name: 'Kinh nghiệm' }).click();
    await filterBar.getByRole('button', { name: 'Đã lưu nhiều' }).click();
  });

  test('TC06 - Không vỡ layout do text dài', async ({ page }) => {
    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    const viewportWidth = page.viewportSize().width;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20);
  });
});
