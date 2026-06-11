const { test, expect } = require('@playwright/test');
const { gotoAndReady, fillFirst, clickByAny, expectNoBlankPage } = require('../utils/test-utils');

const searchableRoutes = ['/meo-tiet-kiem', '/cong-dong', '/bai-da-luu', '/admin/quan-ly-bai-viet'];

test.describe('EXANH-019 Search/Filter/Pagination', () => {
  for (const route of searchableRoutes) {
    test(`Search ${route} nếu có thì không chết`, async ({ page }) => {
      await gotoAndReady(page, route);
      const filled = await fillFirst(page, ['input[type="search"]', 'input[placeholder*="tìm" i]', 'input[placeholder*="search" i]'], 'điện');
      if (!filled) test.skip(true, `Route ${route} không có search`);
      await page.waitForTimeout(500);
      await expectNoBlankPage(page);
      const body = await page.locator('body').innerText();
      expect(body).toMatch(/điện|kết quả|không tìm thấy|không có|tìm/i);
    });

    test(`Filter/pagination ${route} nếu có thì không chết`, async ({ page }) => {
      await gotoAndReady(page, route);
      const clicked = await clickByAny(page, [/tất cả/i, /mới nhất/i, /cũ nhất/i, /next/i, /sau/i, /trước/i, /1/i, /2/i]);
      if (!clicked) test.skip(true, `Route ${route} không có filter/pagination rõ`);
      await page.waitForTimeout(500);
      await expectNoBlankPage(page);
    });
  }
});
