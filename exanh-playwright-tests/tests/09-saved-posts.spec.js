const { test, expect } = require('@playwright/test');
const { gotoAndReady, login, clickByAny, expectNoBlankPage, expectNoCriticalText, expectNoHorizontalOverflow } = require('../utils/test-utils');

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;

test.describe('EXANH-009 Saved Posts - bài đã lưu', () => {
  test('EX-091 Guest vào bài đã lưu bị chặn', async ({ page }) => {
    await gotoAndReady(page, '/bai-da-luu');
    await expectNoBlankPage(page);
    const body = await page.locator('body').innerText();
    expect(page.url().includes('/dang-nhap') || /đăng nhập|login|vui lòng|yêu cầu/i.test(body)).toBeTruthy();
  });

  test('EX-092 User vào bài đã lưu có danh sách hoặc empty state đẹp', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'Cần USER_EMAIL/USER_PASSWORD');
    await login(page, USER_EMAIL, USER_PASSWORD);
    await gotoAndReady(page, '/bai-da-luu');
    await expectNoBlankPage(page);
    await expectNoCriticalText(page);
    await expectNoHorizontalOverflow(page);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/bài đã lưu|đã lưu|chưa lưu|không có|lưu bài|saved/i);
  });

  test('EX-093 Bấm bỏ lưu nếu có thì có phản hồi', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'Cần USER_EMAIL/USER_PASSWORD');
    await login(page, USER_EMAIL, USER_PASSWORD);
    await gotoAndReady(page, '/bai-da-luu');
    const clicked = await clickByAny(page, [/bỏ lưu/i, /unsave/i, /xóa khỏi/i]);
    if (!clicked) test.skip(true, 'Không có nút bỏ lưu trên trang');
    await page.waitForTimeout(500);
    await expectNoBlankPage(page);
  });

  test('EX-094 Search/filter bài đã lưu nếu có không chết', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'Cần USER_EMAIL/USER_PASSWORD');
    await login(page, USER_EMAIL, USER_PASSWORD);
    await gotoAndReady(page, '/bai-da-luu');
    const input = page.locator('input[type="search"], input[placeholder*="tìm" i], input[placeholder*="search" i]').first();
    if (!(await input.count())) test.skip(true, 'Không có search bài đã lưu');
    await input.fill('điện');
    await page.waitForTimeout(500);
    await expectNoBlankPage(page);
  });
});
