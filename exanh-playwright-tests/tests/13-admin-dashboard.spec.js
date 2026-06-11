const { test, expect } = require('@playwright/test');
const { gotoAndReady, login, clickByAny, expectNoBlankPage, expectNoCriticalText, expectNoHorizontalOverflow } = require('../utils/test-utils');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

test.describe('EXANH-013 Admin Dashboard - thống kê, chuông, dấu hỏi', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'Cần ADMIN_EMAIL/ADMIN_PASSWORD');
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await gotoAndReady(page, '/admin');
  });

  test('EX-131 Dashboard có thống kê không NaN/undefined', async ({ page }) => {
    await expectNoBlankPage(page);
    await expectNoCriticalText(page);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/tổng quan|dashboard|bài|người dùng|duyệt|thống kê/i);
  });

  test('EX-132 Khối cần phê duyệt ngay hiển thị gọn, không vỡ', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/phê duyệt|chờ duyệt|pending|bài mới|cần duyệt/i);
    await expectNoHorizontalOverflow(page);
  });

  test('EX-133 Click card thống kê nếu có thì không chết', async ({ page }) => {
    const clicked = await clickByAny(page, [/bài viết/i, /người dùng/i, /bình luận/i, /chờ duyệt/i]);
    expect(clicked, 'Không tìm thấy card/link thống kê có thể click').toBeTruthy();
    await page.waitForTimeout(500);
    await expectNoBlankPage(page);
  });

  test('EX-134 Icon chuông admin phải có dropdown/phản hồi', async ({ page }) => {
    const clicked = await clickByAny(page, [/thông báo/i, /notification/i, /chuông/i, /🔔/i]) || await page.locator('button[aria-label*="thông báo" i], button[aria-label*="notification" i], .notification button, [class*="bell"]').first().click().then(() => true).catch(() => false);
    expect(clicked, 'Không tìm thấy hoặc không click được icon chuông').toBeTruthy();
    await page.waitForTimeout(500);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/thông báo|chưa có|bài chờ|phê duyệt|notification|pending/i);
  });

  test('EX-135 Icon dấu hỏi/help phải có dropdown/phản hồi', async ({ page }) => {
    const clicked = await clickByAny(page, [/trợ giúp/i, /hướng dẫn/i, /help/i, /\?/i]) || await page.locator('button[aria-label*="help" i], button[aria-label*="trợ" i], .help button, [class*="help"]').first().click().then(() => true).catch(() => false);
    expect(clicked, 'Không tìm thấy hoặc không click được icon dấu hỏi/help').toBeTruthy();
    await page.waitForTimeout(500);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/hướng dẫn|trợ giúp|help|quản lý|admin|phê duyệt|bài viết/i);
  });

  test('EX-136 Nếu còn ô search admin thì search không được là lỗi', async ({ page }) => {
    const input = page.locator('input[type="search"], input[placeholder*="tìm" i], input[placeholder*="search" i]').first();
    if (!(await input.count()) || !(await input.isVisible().catch(() => false))) test.skip(true, 'Không còn ô search admin trên dashboard');
    await input.fill('test');
    await page.waitForTimeout(500);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/test|kết quả|không tìm thấy|bài|người dùng|search|tìm/i);
  });
});
