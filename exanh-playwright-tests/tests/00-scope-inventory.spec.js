const { test, expect } = require('@playwright/test');
const { PUBLIC_ROUTES, ADMIN_ROUTES } = require('../data/routes');
const {
  gotoAndReady,
  scanClickableInventory,
  saveJson,
  expectNoBlankPage,
  expectNoCriticalText,
  expectNoHorizontalOverflow
} = require('../utils/test-utils');

// File này tạo inventory để bạn biết web hiện có nút/link/chức năng nào.
// Chạy xong xem: test-results/exanh-ui-inventory.json

test.describe('EXANH-000 Scope inventory - kiểm kê chức năng/nút/link hiện có', () => {
  for (const route of [...PUBLIC_ROUTES, ...ADMIN_ROUTES]) {
    test(`${route.id} kiểm kê UI tại ${route.path}`, async ({ page }) => {
      await gotoAndReady(page, route.path);
      await expectNoBlankPage(page);
      await expectNoCriticalText(page);
      await expectNoHorizontalOverflow(page);
      const inventory = await scanClickableInventory(page);
      await test.info().attach(`${route.id}-clickables.json`, {
        body: JSON.stringify(inventory, null, 2),
        contentType: 'application/json'
      });
      expect(inventory.filter(x => x.visible).length, 'Trang không có nút/link visible nào').toBeGreaterThan(0);
    });
  }

  test('Xuất file tổng hợp inventory các route public', async ({ page }) => {
    const report = [];
    for (const route of PUBLIC_ROUTES) {
      await gotoAndReady(page, route.path);
      report.push({
        route: route.path,
        name: route.name,
        url: page.url(),
        title: await page.title(),
        textSample: (await page.locator('body').innerText()).slice(0, 300),
        clickables: await scanClickableInventory(page)
      });
    }
    await saveJson('exanh-ui-inventory.json', report);
    expect(report.length).toBeGreaterThan(5);
  });
});
