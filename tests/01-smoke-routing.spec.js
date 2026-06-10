import { test, expect } from '@playwright/test';

const routes = [
  ['Trang chủ', '/'],
  ['Mẹo tiết kiệm', '/meo-tiet-kiem'],
  ['Cộng đồng', '/cong-dong'],
  ['Đăng bài', '/dang-bai'],
  ['Kiểm tra tiền điện', '/kiem-tra-tien-dien'],
  ['Bài đã lưu', '/bai-da-luu'],
  ['Đăng nhập', '/dang-nhap'],
  ['Đăng ký', '/dang-ky'],
  ['Về chúng tôi', '/ve-chung-toi'],
  ['Điều khoản', '/dieu-khoan'],
  ['Liên hệ', '/lien-he'],
];

test.describe('01 - Smoke Routing toàn website', () => {
  for (const [name, path] of routes) {
    test(`${name} - ${path} không trắng màn`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('body')).not.toContainText(/undefined|null|NaN/i);
    });
  }
});
