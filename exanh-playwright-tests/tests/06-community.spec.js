const { test, expect } = require('@playwright/test');
const { gotoAndReady, clickByAny, fillFirst, expectNoBlankPage, expectNoCriticalText, expectNoHorizontalOverflow, expectImagesHealthy } = require('../utils/test-utils');

test.describe('EXANH-006 Community Page - cộng đồng', () => {
  test('EX-061 Trang cộng đồng load đúng, không nhảy sang mẹo tiết kiệm', async ({ page }) => {
    await gotoAndReady(page, '/cong-dong');
    await expectNoBlankPage(page);
    expect(page.url()).toContain('/cong-dong');
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/cộng đồng|chia sẻ|bài đăng|đăng bài|hoạt động/i);
    await expectNoHorizontalOverflow(page);
    await expectNoCriticalText(page);
  });

  test('EX-062 Có danh sách bài cộng đồng hoặc empty state rõ', async ({ page }) => {
    await gotoAndReady(page, '/cong-dong');
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/cộng đồng|bài|chưa có|không có|chia sẻ/i);
    const clickable = await page.locator('a, button').count();
    expect(clickable).toBeGreaterThan(0);
  });

  test('EX-063 Bấm bài cộng đồng mở đúng chi tiết cộng đồng/post', async ({ page }) => {
    await gotoAndReady(page, '/cong-dong');
    const before = page.url();
    const clicked = await clickByAny(page, [/xem chi tiết/i, /đọc thêm/i, /bình luận/i]) || await page.locator('article a, .card a, [class*="card"] a').first().click().then(() => true).catch(() => false);
    if (!clicked) test.skip(true, 'Không có bài/card cộng đồng để click');
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    await expectNoBlankPage(page);
    expect(page.url()).not.toBe(before);
    expect(page.url()).not.toContain('/meo-tiet-kiem');
  });

  test('EX-064 Filter chip/tabs cộng đồng nếu có thì click được', async ({ page }) => {
    await gotoAndReady(page, '/cong-dong');
    const clicked = await clickByAny(page, [/mới nhất/i, /phổ biến/i, /tất cả/i, /câu hỏi/i, /chia sẻ/i]);
    if (!clicked) test.skip(true, 'Không có filter chip/tabs cộng đồng');
    await page.waitForTimeout(400);
    await expectNoBlankPage(page);
  });

  test('EX-065 Like/save/share trên cộng đồng nếu có thì không chết', async ({ page }) => {
    await gotoAndReady(page, '/cong-dong');
    const clicked = await clickByAny(page, [/like/i, /thích/i, /lưu/i, /save/i, /chia sẻ/i, /share/i]);
    if (!clicked) test.skip(true, 'Không có nút like/save/share trên cộng đồng');
    await page.waitForTimeout(500);
    await expectNoBlankPage(page);
  });

  test('EX-066 Search cộng đồng nếu có thì có phản hồi', async ({ page }) => {
    await gotoAndReady(page, '/cong-dong');
    const filled = await fillFirst(page, ['input[type="search"]', 'input[placeholder*="tìm" i]', 'input[placeholder*="search" i]'], 'điện');
    if (!filled) test.skip(true, 'Không có search cộng đồng');
    await page.waitForTimeout(500);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/điện|không tìm thấy|kết quả|cộng đồng/i);
  });

  test('EX-067 Ảnh/card cộng đồng không méo/lỗi', async ({ page }) => {
    await gotoAndReady(page, '/cong-dong');
    await expectImagesHealthy(page);
    await expectNoHorizontalOverflow(page);
  });
});
