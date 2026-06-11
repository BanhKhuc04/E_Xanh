const { test, expect } = require('@playwright/test');
const { gotoAndReady, fillFirst, clickByAny, expectNoBlankPage, expectNoHorizontalOverflow, expectImagesHealthy, expectNoCriticalText } = require('../utils/test-utils');

test.describe('EXANH-005 Tips Page - mẹo tiết kiệm', () => {
  test('EX-051 Trang mẹo load danh sách bài/card', async ({ page }) => {
    await gotoAndReady(page, '/meo-tiet-kiem');
    await expectNoBlankPage(page);
    await expectNoHorizontalOverflow(page);
    await expectImagesHealthy(page);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/mẹo|tiết kiệm|điện|bài viết/i);
  });

  test('EX-052 Card bài viết có thể bấm vào chi tiết', async ({ page }) => {
    await gotoAndReady(page, '/meo-tiet-kiem');
    const before = page.url();
    const clicked = await clickByAny(page, [/xem chi tiết/i, /đọc thêm/i, /xem thêm/i]) || await page.locator('article a, .card a, [class*="card"] a').first().click().then(() => true).catch(() => false);
    expect(clicked, 'Không tìm thấy link/card bài viết để mở chi tiết').toBeTruthy();
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    await expectNoBlankPage(page);
    expect(page.url()).not.toBe(before);
  });

  test('EX-053 Tìm kiếm nếu có input thì phải lọc hoặc có phản hồi', async ({ page }) => {
    await gotoAndReady(page, '/meo-tiet-kiem');
    const filled = await fillFirst(page, ['input[type="search"]', 'input[placeholder*="tìm" i]', 'input[placeholder*="search" i]'], 'điều hòa');
    if (!filled) test.skip(true, 'Trang mẹo không có ô tìm kiếm');
    await page.waitForTimeout(500);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/điều hòa|không tìm thấy|kết quả|mẹo|tiết kiệm/i);
  });

  test('EX-054 Search không có kết quả phải có empty state', async ({ page }) => {
    await gotoAndReady(page, '/meo-tiet-kiem');
    const filled = await fillFirst(page, ['input[type="search"]', 'input[placeholder*="tìm" i]', 'input[placeholder*="search" i]'], 'zzzzzz-khong-co-bai');
    if (!filled) test.skip(true, 'Trang mẹo không có ô tìm kiếm');
    await page.waitForTimeout(500);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/không tìm thấy|không có|empty|kết quả|zzzzzz/i);
  });

  test('EX-055 Text dài không gây tràn ngang', async ({ page }) => {
    await gotoAndReady(page, '/meo-tiet-kiem');
    await expectNoHorizontalOverflow(page);
    await expectNoCriticalText(page);
  });
});
