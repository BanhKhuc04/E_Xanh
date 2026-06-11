const { test, expect } = require('@playwright/test');
const { PUBLIC_ROUTES } = require('../data/routes');
const { gotoAndReady, assertClickablesNotEmpty, clickSafeButtons, saveJson, expectNoBlankPage } = require('../utils/test-utils');

const SCAN_ROUTES = PUBLIC_ROUTES.filter(r => ['/', '/meo-tiet-kiem', '/cong-dong', '/dang-nhap', '/dang-ky', '/kiem-tra-tien-dien', '/bai-da-luu', '/dang-bai'].includes(r.path));

test.describe('EXANH-016 Dead buttons - rà nút chết/nút giả', () => {
  for (const route of SCAN_ROUTES) {
    test(`EX-BTN ${route.path} có nút/link visible và accessible`, async ({ page }) => {
      await gotoAndReady(page, route.path);
      await assertClickablesNotEmpty(page, route.path === '/' ? 4 : 1);
    });
  }

  for (const route of SCAN_ROUTES) {
    test(`EX-BTN-CLICK ${route.path} click thử các nút an toàn`, async ({ page }) => {
      await gotoAndReady(page, route.path);
      const results = await clickSafeButtons(page, 10);
      await saveJson(`dead-button-scan-${route.path.replaceAll('/', '_') || 'home'}.json`, results);
      await expectNoBlankPage(page);
      // Không bắt buộc tất cả nút phải đổi URL; nhưng nếu click 5 nút mà không có nút nào tạo phản hồi thì nghi là nút giả.
      if (results.length >= 5) {
        expect(results.some(r => r.changed), 'Click nhiều nút nhưng không có phản hồi/đổi UI/đổi route nào').toBeTruthy();
      }
    });
  }
});
