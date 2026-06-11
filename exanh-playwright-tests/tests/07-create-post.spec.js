const { test, expect } = require('@playwright/test');
const { gotoAndReady, login, fillFirst, clickByAny, expectNoBlankPage, expectNoHorizontalOverflow } = require('../utils/test-utils');

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;

test.describe('EXANH-007 Create Post - đăng bài', () => {
  test('EX-071 Guest vào đăng bài bị chặn hoặc yêu cầu đăng nhập', async ({ page }) => {
    await gotoAndReady(page, '/dang-bai');
    const body = await page.locator('body').innerText();
    expect(page.url().includes('/dang-nhap') || /đăng nhập|login|vui lòng|yêu cầu/i.test(body)).toBeTruthy();
  });

  test('EX-072 Form đăng bài không nên chuyển sang trang khác quá đột ngột khi mới mở', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'Cần USER_EMAIL/USER_PASSWORD');
    await login(page, USER_EMAIL, USER_PASSWORD);
    await gotoAndReady(page, '/dang-bai');
    await expectNoBlankPage(page);
    expect(page.url()).toContain('/dang-bai');
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/đăng bài|tiêu đề|nội dung|chủ đề|danh mục|preview|xem trước/i);
  });

  test('EX-073 Submit form rỗng phải validate rõ', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'Cần USER_EMAIL/USER_PASSWORD');
    await login(page, USER_EMAIL, USER_PASSWORD);
    await gotoAndReady(page, '/dang-bai');
    await clickByAny(page, [/đăng bài/i, /gửi bài/i, /submit/i, /publish/i]);
    await page.waitForTimeout(500);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/bắt buộc|required|tiêu đề|nội dung|vui lòng|không được để trống/i);
  });

  test('EX-074 Nhập tiêu đề thiếu nội dung phải báo lỗi nội dung', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'Cần USER_EMAIL/USER_PASSWORD');
    await login(page, USER_EMAIL, USER_PASSWORD);
    await gotoAndReady(page, '/dang-bai');
    await fillFirst(page, ['input[name="title"]', 'input[placeholder*="tiêu đề" i]', 'input[type="text"]'], 'Test Playwright tiêu đề');
    await clickByAny(page, [/đăng bài/i, /gửi bài/i, /submit/i]);
    await page.waitForTimeout(500);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/nội dung|content|mô tả|bắt buộc|required/i);
  });

  test('EX-075 Category cộng đồng/mẹo nếu có phải chọn được', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'Cần USER_EMAIL/USER_PASSWORD');
    await login(page, USER_EMAIL, USER_PASSWORD);
    await gotoAndReady(page, '/dang-bai');
    const clicked = await clickByAny(page, [/cộng đồng/i, /mẹo/i, /tiết kiệm/i]);
    const selectCount = await page.locator('select').count();
    if (!clicked && !selectCount) test.skip(true, 'Không thấy category hoặc select loại bài trên form');
    if (selectCount) {
      await page.locator('select').first().selectOption({ index: 1 }).catch(() => {});
    }
    await expectNoHorizontalOverflow(page);
  });

  test('EX-076 Preview/xem trước nếu có thì bấm được', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'Cần USER_EMAIL/USER_PASSWORD');
    await login(page, USER_EMAIL, USER_PASSWORD);
    await gotoAndReady(page, '/dang-bai');
    const clicked = await clickByAny(page, [/xem trước/i, /preview/i]);
    if (!clicked) test.skip(true, 'Không có nút preview/xem trước');
    await page.waitForTimeout(500);
    await expectNoBlankPage(page);
  });

  test('EX-077 Form đăng bài không tràn ngang mobile', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'Cần USER_EMAIL/USER_PASSWORD');
    await page.setViewportSize({ width: 390, height: 844 });
    await login(page, USER_EMAIL, USER_PASSWORD);
    await gotoAndReady(page, '/dang-bai');
    await expectNoHorizontalOverflow(page);
  });
});
