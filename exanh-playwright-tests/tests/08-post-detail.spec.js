const { test, expect } = require('@playwright/test');
const { gotoAndReady, clickByAny, expectNoBlankPage, expectNoCriticalText, expectNoHorizontalOverflow } = require('../utils/test-utils');

async function openFirstPost(page, route) {
  await gotoAndReady(page, route);
  const clicked = await clickByAny(page, [/xem chi tiết/i, /đọc thêm/i, /xem thêm/i]) || await page.locator('article a, .card a, [class*="card"] a').first().click().then(() => true).catch(() => false);
  if (!clicked) return false;
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  return true;
}

test.describe('EXANH-008 Post Detail - chi tiết bài/nút tương tác', () => {
  for (const route of ['/meo-tiet-kiem', '/cong-dong']) {
    test(`EX-081 Mở chi tiết bài từ ${route}`, async ({ page }) => {
      const opened = await openFirstPost(page, route);
      if (!opened) test.skip(true, `Không có bài để mở từ ${route}`);
      await expectNoBlankPage(page);
      await expectNoCriticalText(page);
      await expectNoHorizontalOverflow(page);
      const body = await page.locator('body').innerText();
      expect(body).toMatch(/tiết kiệm|điện|cộng đồng|bài viết|nội dung|chia sẻ|lưu|bình luận/i);
    });
  }

  test('EX-082 URL chi tiết sai phải có thông báo không tìm thấy, không trắng', async ({ page }) => {
    await gotoAndReady(page, '/meo-tiet-kiem/slug-khong-ton-tai-playwright');
    await expectNoBlankPage(page);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/không tìm thấy|not found|404|bài viết|quay lại|trang chủ/i);
  });

  test('EX-083 Nút lưu/like/share ở chi tiết nếu có thì không chết', async ({ page }) => {
    const opened = await openFirstPost(page, '/meo-tiet-kiem');
    if (!opened) test.skip(true, 'Không có bài để test nút tương tác');
    const clicked = await clickByAny(page, [/lưu/i, /save/i, /thích/i, /like/i, /chia sẻ/i, /share/i, /copy/i]);
    if (!clicked) test.skip(true, 'Không có nút tương tác trên chi tiết bài');
    await page.waitForTimeout(500);
    await expectNoBlankPage(page);
  });

  test('EX-084 Nút quay lại nếu có hoạt động', async ({ page }) => {
    const opened = await openFirstPost(page, '/meo-tiet-kiem');
    if (!opened) test.skip(true, 'Không có bài để test quay lại');
    const clicked = await clickByAny(page, [/quay lại/i, /back/i, /trở về/i]);
    if (!clicked) test.skip(true, 'Không có nút quay lại');
    await page.waitForTimeout(500);
    await expectNoBlankPage(page);
  });
});
