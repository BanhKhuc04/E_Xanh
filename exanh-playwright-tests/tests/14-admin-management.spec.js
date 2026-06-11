const { test, expect } = require('@playwright/test');
const { ADMIN_ROUTES } = require('../data/routes');
const { gotoAndReady, login, clickByAny, expectNoBlankPage, expectNoCriticalText, expectNoHorizontalOverflow } = require('../utils/test-utils');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

test.describe('EXANH-014 Admin Management Pages', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'Cần ADMIN_EMAIL/ADMIN_PASSWORD');
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
  });

  for (const route of ADMIN_ROUTES) {
    test(`${route.id} ${route.name} load và không vỡ`, async ({ page }) => {
      await gotoAndReady(page, route.path);
      await expectNoBlankPage(page);
      await expectNoCriticalText(page);
      await expectNoHorizontalOverflow(page);
      const body = await page.locator('body').innerText();
      if (route.required) {
        expect(body).not.toMatch(/404|not found|không tìm thấy trang/i);
      }
    });
  }

  test('EX-141 Quản lý bài viết có nút xem/duyệt/từ chối/xóa hoặc trạng thái rõ', async ({ page }) => {
    await gotoAndReady(page, '/admin/quan-ly-bai-viet');
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/bài viết|duyệt|từ chối|xóa|trạng thái|approved|pending|rejected|xem/i);
  });

  test('EX-142 Click xem chi tiết bài trong admin nếu có không chết', async ({ page }) => {
    await gotoAndReady(page, '/admin/quan-ly-bai-viet');
    const clicked = await clickByAny(page, [/xem/i, /chi tiết/i, /view/i]);
    if (!clicked) test.skip(true, 'Không có nút xem chi tiết bài trong admin');
    await page.waitForTimeout(500);
    await expectNoBlankPage(page);
  });

  test('EX-143 Filter trạng thái bài viết nếu có hoạt động', async ({ page }) => {
    await gotoAndReady(page, '/admin/quan-ly-bai-viet');
    const clicked = await clickByAny(page, [/pending/i, /chờ duyệt/i, /approved/i, /đã duyệt/i, /rejected/i, /từ chối/i, /tất cả/i]);
    if (!clicked) test.skip(true, 'Không có filter trạng thái bài viết');
    await page.waitForTimeout(500);
    await expectNoBlankPage(page);
  });

  test('EX-144 Search quản lý bài nếu còn trên UI phải có phản hồi', async ({ page }) => {
    await gotoAndReady(page, '/admin/quan-ly-bai-viet');
    const input = page.locator('input[type="search"], input[placeholder*="tìm" i], input[placeholder*="search" i]').first();
    if (!(await input.count()) || !(await input.isVisible().catch(() => false))) test.skip(true, 'Không có search quản lý bài');
    await input.fill('điện');
    await page.waitForTimeout(500);
    await expectNoBlankPage(page);
  });
});
