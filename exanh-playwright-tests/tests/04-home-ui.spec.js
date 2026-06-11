const { test, expect } = require('@playwright/test');
const { gotoAndReady, clickByAny, expectNoHorizontalOverflow, expectImagesHealthy, expectNoCriticalText } = require('../utils/test-utils');

test.describe('EXANH-004 Home Page UI/CTA', () => {
  test('EX-041 Trang chủ có hero/banner/CTA rõ ràng', async ({ page }) => {
    await gotoAndReady(page, '/');
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/e-xanh|tiết kiệm|điện|sống xanh|cộng đồng/i);
    const ctaCount = await page.locator('a, button').filter({ hasText: /khám phá|tham gia|đăng bài|kiểm tra|xem thêm|bắt đầu/i }).count();
    expect(ctaCount, 'Trang chủ thiếu CTA rõ ràng').toBeGreaterThanOrEqual(2);
  });

  test('EX-042 CTA Khám phá/Xem bài viết chuyển route hợp lý', async ({ page }) => {
    await gotoAndReady(page, '/');
    const clicked = await clickByAny(page, [/khám phá/i, /xem thêm/i, /mẹo/i, /bài viết/i]);
    expect(clicked, 'Không tìm thấy CTA khám phá/xem thêm').toBeTruthy();
    await page.waitForTimeout(500);
    expect(page.url()).toMatch(/meo-tiet-kiem|bai|post|cong-dong|\/$/i);
  });

  test('EX-043 CTA Tham gia cộng đồng chuyển đúng cộng đồng/đăng bài', async ({ page }) => {
    await gotoAndReady(page, '/');
    const clicked = await clickByAny(page, [/tham gia cộng đồng/i, /cộng đồng/i]);
    expect(clicked, 'Không tìm thấy CTA cộng đồng').toBeTruthy();
    await page.waitForTimeout(500);
    expect(page.url()).toMatch(/cong-dong|dang-bai|dang-nhap/i);
  });

  test('EX-044 Bài viết nổi bật/hoạt động cộng đồng không vỡ layout', async ({ page }) => {
    await gotoAndReady(page, '/');
    await expectNoHorizontalOverflow(page);
    await expectImagesHealthy(page);
    await expectNoCriticalText(page);
    const cards = await page.locator('article, .card, [class*="card"], [class*="post"]').count();
    expect(cards, 'Trang chủ nên có card bài viết/hoạt động cộng đồng').toBeGreaterThanOrEqual(2);
  });

  test('EX-045 Thông báo phiên bản/báo lỗi nếu có không che mất nội dung', async ({ page }) => {
    await gotoAndReady(page, '/');
    const body = await page.locator('body').innerText();
    if (!/phiên bản|cập nhật|báo cáo lỗi|report/i.test(body)) test.skip(true, 'Không thấy banner/popup cập nhật trên UI');
    await expectNoHorizontalOverflow(page);
    const reportButton = page.getByText(/báo cáo|report/i).first();
    await expect(reportButton).toBeVisible();
  });
});
