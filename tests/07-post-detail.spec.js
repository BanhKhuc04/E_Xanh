import { test, expect } from '@playwright/test';

test.describe('07 - Post Detail Flow', () => {
  test('Click bài cộng đồng đầu tiên vào chi tiết', async ({ page }) => {
    await page.goto('/cong-dong');
    const firstPostLink = page.getByTestId('community-post-link').first();

    if (await firstPostLink.count()) {
      await firstPostLink.click();
      await expect(page).toHaveURL(/cong-dong\/.+/);
      await expect(page.locator('body')).not.toContainText('NaN');
      await expect(page.locator('body')).not.toContainText('undefined');
    }
  });

  test('Các nút tương tác tồn tại trong bài viết', async ({ page }) => {
    await page.goto('/cong-dong');
    const firstPostLink = page.getByTestId('community-post-link').first();

    if (await firstPostLink.count()) {
      await firstPostLink.click();
      await expect(page.locator('body')).toContainText(/Thích|Lưu|Bình luận|Chia sẻ/i);
    }
  });

  test('Bài viết liên quan không lỗi ảnh/null', async ({ page }) => {
    await page.goto('/cong-dong');
    const firstPostLink = page.getByTestId('community-post-link').first();

    if (await firstPostLink.count()) {
      await firstPostLink.click();
      await expect(page.locator('body')).not.toContainText('undefined');
      await expect(page.locator('body')).not.toContainText('null');
    }
  });
});
