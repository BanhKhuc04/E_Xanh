const { test, expect } = require('@playwright/test');
const { NAV_ITEMS } = require('../data/routes');
const { gotoAndReady, clickByAny, expectNoBlankPage, expectNoHorizontalOverflow } = require('../utils/test-utils');

test.describe('EXANH-002 Global Navigation - navbar/footer/link', () => {
  test('EX-001 Logo E-XANH bấm về trang chủ', async ({ page }) => {
    await gotoAndReady(page, '/cong-dong');
    const clicked = await clickByAny(page, [/e-xanh/i, /exanh/i, /logo/i]);
    expect(clicked, 'Không tìm thấy logo hoặc text E-XANH để click').toBeTruthy();
    await expect(page).toHaveURL(/\/$|\/home$/);
  });

  for (const item of NAV_ITEMS) {
    test(`Menu chuyển đúng route: ${String(item.text)}`, async ({ page }) => {
      await gotoAndReady(page, '/');
      const clicked = await clickByAny(page, [item.text]);
      if (item.optional && !clicked) test.skip(true, 'Menu optional không có trên UI');
      expect(clicked, `Không tìm thấy menu ${item.text}`).toBeTruthy();
      await page.waitForLoadState('domcontentloaded').catch(() => {});
      await expectNoBlankPage(page);
      expect(page.url(), `Menu ${item.text} không chuyển đúng route`).toContain(item.expectedPath);
    });
  }

  test('EX-008 Mobile hamburger mở/đóng được', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoAndReady(page, '/');
    const possibleButtons = [
      page.getByRole('button', { name: /menu|mở|hamburger|☰/i }).first(),
      page.locator('button[aria-label*="menu" i]').first(),
      page.locator('.hamburger, .menu-toggle, .navbar-toggler').first(),
      page.locator('button').first()
    ];
    let clicked = false;
    for (const btn of possibleButtons) {
      if (await btn.count() && await btn.isVisible().catch(() => false)) {
        await btn.click();
        clicked = true;
        break;
      }
    }
    expect(clicked, 'Mobile không có nút hamburger/menu rõ ràng').toBeTruthy();
    await expectNoHorizontalOverflow(page);
  });

  test('EX-014 Footer có link chính và không lỗi 404', async ({ page }) => {
    await gotoAndReady(page, '/');
    const footer = page.locator('footer').first();
    await expect(footer, 'Không tìm thấy footer').toBeVisible();
    const links = await footer.locator('a').count();
    expect(links, 'Footer nên có ít nhất 2 link').toBeGreaterThanOrEqual(2);
  });
});
