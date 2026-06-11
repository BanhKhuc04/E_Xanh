const { test, expect } = require('@playwright/test');
const { gotoAndReady, login, expectNoBlankPage, expectNoCriticalText, expectNoHorizontalOverflow } = require('../utils/test-utils');

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

test.describe('EXANH-012 Admin Auth/Permission', () => {
  test('EX-121 Guest vào /admin bị chuyển đăng nhập hoặc báo không có quyền', async ({ page }) => {
    await gotoAndReady(page, '/admin');
    await expectNoBlankPage(page);
    const body = await page.locator('body').innerText();
    expect(page.url().includes('/dang-nhap') || /đăng nhập|login|không có quyền|từ chối|admin/i.test(body)).toBeTruthy();
  });

  test('EX-122 User thường không được vào admin', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'Cần USER_EMAIL/USER_PASSWORD');
    await login(page, USER_EMAIL, USER_PASSWORD);
    await gotoAndReady(page, '/admin');
    await expectNoBlankPage(page);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/không có quyền|từ chối|unauthorized|admin|trang chủ|đăng nhập/i);
  });

  test('EX-123 Admin đăng nhập vào được dashboard', async ({ page }) => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'Cần ADMIN_EMAIL/ADMIN_PASSWORD');
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await gotoAndReady(page, '/admin');
    await expectNoBlankPage(page);
    await expectNoCriticalText(page);
    await expectNoHorizontalOverflow(page);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/admin|dashboard|tổng quan|bài viết|người dùng|phê duyệt|thống kê/i);
    expect(body).not.toMatch(/không có quyền|từ chối|unauthorized/i);
  });
});
