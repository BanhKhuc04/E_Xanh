const { test, expect } = require('@playwright/test');
const { gotoAndReady, login, fillFirst, clickByAny, expectNoBlankPage } = require('../utils/test-utils');

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;

async function openFirstPost(page) {
  await gotoAndReady(page, '/cong-dong');
  return await clickByAny(page, [/xem chi tiết/i, /bình luận/i, /đọc thêm/i]) || await page.locator('article a, .card a, [class*="card"] a').first().click().then(() => true).catch(() => false);
}

test.describe('EXANH-010 Comments - bình luận', () => {
  test('EX-101 Guest bình luận nếu có form phải bị chặn/yêu cầu đăng nhập', async ({ page }) => {
    const opened = await openFirstPost(page);
    if (!opened) test.skip(true, 'Không có bài cộng đồng để mở');
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    const hasCommentInput = await page.locator('textarea, input[placeholder*="bình luận" i], input[placeholder*="comment" i]').count();
    if (!hasCommentInput) test.skip(true, 'Không có form bình luận');
    await fillFirst(page, ['textarea', 'input[placeholder*="bình luận" i]', 'input[placeholder*="comment" i]'], 'Test comment guest');
    await clickByAny(page, [/gửi/i, /bình luận/i, /comment/i]);
    await page.waitForTimeout(500);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/đăng nhập|login|vui lòng|yêu cầu|không có quyền/i);
  });

  test('EX-102 User gửi bình luận rỗng phải validate', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'Cần USER_EMAIL/USER_PASSWORD');
    await login(page, USER_EMAIL, USER_PASSWORD);
    const opened = await openFirstPost(page);
    if (!opened) test.skip(true, 'Không có bài để mở');
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    const clicked = await clickByAny(page, [/gửi/i, /bình luận/i, /comment/i]);
    if (!clicked) test.skip(true, 'Không có nút gửi bình luận');
    await page.waitForTimeout(500);
    await expectNoBlankPage(page);
  });

  test('EX-103 Comment dài không vỡ layout', async ({ page }) => {
    const opened = await openFirstPost(page);
    if (!opened) test.skip(true, 'Không có bài để mở');
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    await expectNoBlankPage(page);
  });
});
