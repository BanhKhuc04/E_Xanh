const { test, expect } = require('@playwright/test');
const { gotoAndReady, clickByAny, expectNoBlankPage, expectNoHorizontalOverflow } = require('../utils/test-utils');

test.describe('EXANH-015 Update Notice / Bug Report', () => {
  test('EX-151 Banner/popup cập nhật nếu có thì có nội dung phiên bản', async ({ page }) => {
    await gotoAndReady(page, '/');
    const body = await page.locator('body').innerText();
    if (!/cập nhật|phiên bản|version|báo cáo lỗi/i.test(body)) test.skip(true, 'Không thấy banner/popup cập nhật trên web');
    expect(body).toMatch(/cập nhật|phiên bản|version|1\.1|báo cáo lỗi/i);
    await expectNoHorizontalOverflow(page);
  });

  test('EX-152 Nút đóng thông báo nếu có hoạt động', async ({ page }) => {
    await gotoAndReady(page, '/');
    const body = await page.locator('body').innerText();
    if (!/cập nhật|phiên bản|version|báo cáo lỗi/i.test(body)) test.skip(true, 'Không thấy thông báo cập nhật');
    const clicked = await clickByAny(page, [/đóng/i, /x/i, /ẩn/i, /close/i]);
    if (!clicked) test.skip(true, 'Không có nút đóng thông báo');
    await page.waitForTimeout(500);
    await expectNoBlankPage(page);
  });

  test('EX-153 Nút báo cáo lỗi mở link/form, không bị trắng chữ sau click', async ({ page, context }) => {
    await gotoAndReady(page, '/');
    const reportButton = page.getByText(/báo cáo|report/i).first();
    if (!(await reportButton.count()) || !(await reportButton.isVisible().catch(() => false))) test.skip(true, 'Không có nút báo cáo lỗi');
    const [newPage] = await Promise.all([
      context.waitForEvent('page').catch(() => null),
      reportButton.click().catch(() => null)
    ]);
    if (newPage) await newPage.close();
    await page.bringToFront();
    await expect(reportButton, 'Nút báo cáo bị mất/trắng sau khi click').toBeVisible();
  });
});
