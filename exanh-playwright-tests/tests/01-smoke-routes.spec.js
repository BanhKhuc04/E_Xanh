const { test, expect } = require('@playwright/test');
const { PUBLIC_ROUTES, ADMIN_ROUTES } = require('../data/routes');
const {
  collectPageErrors,
  gotoAndReady,
  expectNoBlankPage,
  expectNoCriticalText,
  expectNoErrorPage,
  expectNoHorizontalOverflow,
  expectImagesHealthy,
  assertClickablesNotEmpty
} = require('../utils/test-utils');

test.describe('EXANH-001 Smoke routes - route không trắng/không crash', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route.id} ${route.name} load ổn`, async ({ page }) => {
      const errors = collectPageErrors(page);
      await gotoAndReady(page, route.path);
      await expectNoBlankPage(page);
      await expectNoErrorPage(page, route.authRelated);
      await expectNoCriticalText(page);
      await expectNoHorizontalOverflow(page);
      await expectImagesHealthy(page);
      await assertClickablesNotEmpty(page, route.path === '/' ? 3 : 1);
      expect(errors, 'Có console/page error nghiêm trọng').toEqual([]);
    });
  }

  for (const route of ADMIN_ROUTES) {
    test(`${route.id} ${route.name} không crash khi truy cập trực tiếp`, async ({ page }) => {
      const errors = collectPageErrors(page);
      await gotoAndReady(page, route.path);
      await expectNoBlankPage(page);
      await expectNoErrorPage(page, true);
      await expectNoCriticalText(page);
      await expectNoHorizontalOverflow(page);
      expect(errors, 'Admin route có console/page error nghiêm trọng').toEqual([]);
    });
  }

  test('EX-DEP-REFRESH Refresh route con không 404', async ({ page }) => {
    await gotoAndReady(page, '/cong-dong');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});
    await expectNoBlankPage(page);
    await expectNoErrorPage(page);
  });
});
