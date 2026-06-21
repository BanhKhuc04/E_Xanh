import { test, expect } from '@playwright/test';

test('Version notice appears on the left and has orange color', async ({ page }) => {
  // Clear local storage to ensure the notice appears
  await page.addInitScript(() => {
    window.localStorage.clear();
  });

  await page.goto('http://localhost:5173');

  const toast = page.locator('.version-notice-toast');
  await expect(toast).toBeVisible({ timeout: 5000 });

  // Check position
  const boundingBox = await toast.boundingBox();
  expect(boundingBox.x).toBeCloseTo(24, -1); // left: 24px

  // Check pseudo element color
  const pseudoColor = await page.evaluate(() => {
    const el = document.querySelector('.version-notice-toast__inner');
    return window.getComputedStyle(el, '::before').backgroundColor;
  });
  
  // rgb(245, 158, 11) is #f59e0b (orange)
  expect(pseudoColor).toBe('rgb(245, 158, 11)');
});
