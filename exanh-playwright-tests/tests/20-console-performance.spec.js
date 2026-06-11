const { test, expect } = require('@playwright/test');
const { PUBLIC_ROUTES } = require('../data/routes');
const { collectPageErrors, gotoAndReady, expectNoBlankPage } = require('../utils/test-utils');

test.describe('EXANH-020 Console/Error/Basic performance', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`Console không lỗi đỏ nghiêm trọng ${route.path}`, async ({ page }) => {
      const errors = collectPageErrors(page);
      await gotoAndReady(page, route.path);
      await expectNoBlankPage(page);
      expect(errors, 'Console/page errors nghiêm trọng').toEqual([]);
    });
  }

  test('Home DOMContentLoaded trong mức hợp lý', async ({ page }) => {
    const start = Date.now();
    await gotoAndReady(page, '/');
    const duration = Date.now() - start;
    expect(duration, `Trang chủ load quá lâu: ${duration}ms`).toBeLessThan(10_000);
  });
});
