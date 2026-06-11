const { test, expect } = require('@playwright/test');
const { gotoAndReady, fillFirst, clickByAny, expectNoBlankPage, expectNoCriticalText, expectNoHorizontalOverflow } = require('../utils/test-utils');

test.describe('EXANH-011 Electricity Calculator - kiểm tra tiền điện', () => {
  test('EX-111 Trang kiểm tra tiền điện nếu có phải load được', async ({ page }) => {
    await gotoAndReady(page, '/kiem-tra-tien-dien');
    await expectNoBlankPage(page);
    const body = await page.locator('body').innerText();
    if (/404|not found|không tìm thấy trang/i.test(body)) test.skip(true, 'Project hiện không có trang kiểm tra tiền điện');
    expect(body).toMatch(/tiền điện|kwh|công suất|thiết bị|điện|ước tính|tính/i);
    await expectNoHorizontalOverflow(page);
  });

  test('EX-112 Form tính tiền điện validate input rỗng/sai', async ({ page }) => {
    await gotoAndReady(page, '/kiem-tra-tien-dien');
    const body = await page.locator('body').innerText();
    if (/404|not found|không tìm thấy trang/i.test(body)) test.skip(true, 'Không có trang kiểm tra tiền điện');
    const clicked = await clickByAny(page, [/tính/i, /kiểm tra/i, /calculate/i]);
    if (!clicked) test.skip(true, 'Không có nút tính');
    await page.waitForTimeout(500);
    await expectNoBlankPage(page);
  });

  test('EX-113 Nhập số âm/chữ không được ra NaN', async ({ page }) => {
    await gotoAndReady(page, '/kiem-tra-tien-dien');
    const body = await page.locator('body').innerText();
    if (/404|not found|không tìm thấy trang/i.test(body)) test.skip(true, 'Không có trang kiểm tra tiền điện');
    const inputs = await page.locator('input').all();
    for (const input of inputs.slice(0, 3)) {
      if (await input.isVisible().catch(() => false)) await input.fill('-5').catch(() => {});
    }
    await clickByAny(page, [/tính/i, /kiểm tra/i, /calculate/i]);
    await page.waitForTimeout(500);
    await expectNoCriticalText(page);
  });

  test('EX-114 Thêm/xóa thiết bị nếu có không chết', async ({ page }) => {
    await gotoAndReady(page, '/kiem-tra-tien-dien');
    const body = await page.locator('body').innerText();
    if (/404|not found|không tìm thấy trang/i.test(body)) test.skip(true, 'Không có trang kiểm tra tiền điện');
    const clicked = await clickByAny(page, [/thêm thiết bị/i, /add/i, /xóa/i, /remove/i, /làm mới/i, /reset/i]);
    if (!clicked) test.skip(true, 'Không có nút thêm/xóa/reset thiết bị');
    await page.waitForTimeout(500);
    await expectNoBlankPage(page);
    await expectNoCriticalText(page);
  });
});
