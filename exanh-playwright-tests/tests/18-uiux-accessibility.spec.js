const { test, expect } = require('@playwright/test');
const { PUBLIC_ROUTES } = require('../data/routes');
const { gotoAndReady, expectNoBlankPage, expectNoCriticalText, expectImagesHealthy } = require('../utils/test-utils');

test.describe('EXANH-018 UI/UX small defects + accessibility lite', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`EX-UX ${route.path} không có text rác/ảnh lỗi`, async ({ page }) => {
      await gotoAndReady(page, route.path);
      await expectNoBlankPage(page);
      await expectNoCriticalText(page);
      await expectImagesHealthy(page);
    });
  }

  test('EX-UX-ALT Ảnh chính nên có alt text', async ({ page }) => {
    await gotoAndReady(page, '/');
    const missingAlt = await page.$$eval('img', imgs => imgs
      .filter(img => img.offsetParent !== null)
      .filter(img => !img.alt || img.alt.trim().length < 2)
      .length
    );
    expect(missingAlt, 'Có quá nhiều ảnh thiếu alt text').toBeLessThanOrEqual(3);
  });

  test('EX-UX-FOCUS Tab focus không làm crash layout', async ({ page }) => {
    await gotoAndReady(page, '/');
    for (let i = 0; i < 10; i++) await page.keyboard.press('Tab');
    await expectNoBlankPage(page);
  });

  test('EX-UX-FORM-LABEL Inputs ở auth nên có placeholder/label rõ', async ({ page }) => {
    await gotoAndReady(page, '/dang-nhap');
    const inputs = await page.$$eval('input', els => els.map(input => ({
      type: input.type,
      name: input.name,
      placeholder: input.placeholder,
      aria: input.getAttribute('aria-label'),
      id: input.id,
      hasLabel: !!(input.id && document.querySelector(`label[for="${input.id}"]`))
    })));
    const unclear = inputs.filter(i => !i.placeholder && !i.aria && !i.hasLabel && i.type !== 'hidden');
    expect(unclear.length, 'Có input đăng nhập không có label/placeholder/aria-label').toBe(0);
  });
});
