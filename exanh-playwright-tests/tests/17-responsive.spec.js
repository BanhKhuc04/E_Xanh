const { test, expect } = require('@playwright/test');
const { PUBLIC_ROUTES, ADMIN_ROUTES } = require('../data/routes');
const { gotoAndReady, expectNoBlankPage, expectNoHorizontalOverflow } = require('../utils/test-utils');

const viewports = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1366', width: 1366, height: 768 }
];

const routes = [...PUBLIC_ROUTES, ...ADMIN_ROUTES];

test.describe('EXANH-017 Responsive - không tràn ngang', () => {
  for (const vp of viewports) {
    for (const route of routes) {
      test(`${vp.name} ${route.path} không tràn ngang/không trắng`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await gotoAndReady(page, route.path);
        await expectNoBlankPage(page);
        await expectNoHorizontalOverflow(page);
      });
    }
  }
});
