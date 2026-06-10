import { test, expect } from '@playwright/test';

test.describe('05 - Electricity Check Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kiem-tra-tien-dien');
  });

  test('Trang kiểm tra tiền điện load đúng', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/Kiểm tra tiền điện|tiền điện|thiết bị/i);
  });

  test('Không hiện NaN/undefined/null khi mới vào trang', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('NaN');
    await expect(page.locator('body')).not.toContainText('undefined');
    await expect(page.locator('body')).not.toContainText('null');
  });

  test('Validate số âm hoặc dữ liệu sai', async ({ page }) => {
    const numberInputs = page.locator('input[type="number"]');
    const count = await numberInputs.count();

    if (count > 0) {
      await numberInputs.first().fill('-10');
      const calculateBtn = page.getByRole('button', { name: /Tính|Kiểm tra|Thêm/i }).first();
      await calculateBtn.click();
      await expect(page.locator('body')).not.toContainText('NaN');
    }
  });

  test('Có thể nhập dữ liệu cơ bản và tính', async ({ page }) => {
    const inputs = page.locator('input[type="number"]');
    const count = await inputs.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      await inputs.nth(i).fill(i === 0 ? '850' : i === 1 ? '4' : '30');
    }

    const btn = page.getByRole('button', { name: /Tính|Kiểm tra|Thêm/i }).first();

    if (await btn.count()) {
      await btn.click();
    }

    await expect(page.locator('body')).not.toContainText('NaN');
  });
});
