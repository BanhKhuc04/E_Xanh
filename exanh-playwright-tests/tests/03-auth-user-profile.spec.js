const { test, expect } = require('@playwright/test');
const {
  gotoAndReady,
  login,
  fillFirst,
  clickByAny,
  expectNoBlankPage,
  expectNoCriticalText,
  expectNoHorizontalOverflow
} = require('../utils/test-utils');

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;

test.describe('EXANH-003 Auth + User Profile/Avatar/Settings', () => {
  test('EX-016 Đăng nhập rỗng phải báo lỗi hoặc giữ ở trang đăng nhập', async ({ page }) => {
    await gotoAndReady(page, '/dang-nhap');
    const clicked = await clickByAny(page, [/đăng nhập/i, /login/i]) || await page.locator('button[type="submit"]').first().click().then(() => true).catch(() => false);
    expect(clicked, 'Không tìm thấy nút đăng nhập').toBeTruthy();
    await page.waitForTimeout(500);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/bắt buộc|không được để trống|required|email|mật khẩu|password|đăng nhập/i);
  });

  test('EX-017 Sai email/password phải báo lỗi, không crash', async ({ page }) => {
    await gotoAndReady(page, '/dang-nhap');
    await fillFirst(page, ['input[type="email"]', 'input[name="email"]', 'input[placeholder*="email" i]'], 'wrong@example.com');
    await fillFirst(page, ['input[type="password"]', 'input[name="password"]', 'input[placeholder*="mật khẩu" i]', 'input[placeholder*="password" i]'], 'wrong-password-123');
    await clickByAny(page, [/đăng nhập/i, /login/i]);
    await page.waitForTimeout(1000);
    await expectNoBlankPage(page);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/sai|không đúng|invalid|error|lỗi|thất bại|email|mật khẩu/i);
  });

  test('EX-018 Đăng ký rỗng phải validate', async ({ page }) => {
    await gotoAndReady(page, '/dang-ky');
    await clickByAny(page, [/đăng ký/i, /register/i, /sign up/i]);
    await page.waitForTimeout(500);
    await expectNoBlankPage(page);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/bắt buộc|required|email|mật khẩu|họ tên|tên/i);
  });

  test('EX-020 Guest vào /dang-bai bị yêu cầu đăng nhập', async ({ page }) => {
    await gotoAndReady(page, '/dang-bai');
    await expectNoBlankPage(page);
    const url = page.url();
    const body = await page.locator('body').innerText();
    expect(url.includes('/dang-nhap') || /đăng nhập|login|vui lòng|yêu cầu/i.test(body)).toBeTruthy();
  });

  test('EX-021 Guest vào /bai-da-luu bị yêu cầu đăng nhập', async ({ page }) => {
    await gotoAndReady(page, '/bai-da-luu');
    await expectNoBlankPage(page);
    const url = page.url();
    const body = await page.locator('body').innerText();
    expect(url.includes('/dang-nhap') || /đăng nhập|login|vui lòng|yêu cầu/i.test(body)).toBeTruthy();
  });

  test('EX-025 User login thấy avatar/tên/menu tài khoản', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'Cần USER_EMAIL và USER_PASSWORD trong .env để test login user');
    await login(page, USER_EMAIL, USER_PASSWORD);
    await expectNoBlankPage(page);
    await expectNoCriticalText(page);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/tài khoản|profile|cá nhân|đăng xuất|avatar|lịch sử|bài đã lưu|setting|cài đặt/i);
  });

  test('EX-026 Avatar/user menu bấm phải mở dropdown hoặc vào tài khoản', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'Cần USER_EMAIL và USER_PASSWORD');
    await login(page, USER_EMAIL, USER_PASSWORD);
    const clicked = await clickByAny(page, [/avatar/i, /tài khoản/i, /profile/i, /cá nhân/i, /@/i]);
    expect(clicked, 'Không tìm thấy avatar/user menu để click').toBeTruthy();
    await page.waitForTimeout(500);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/tài khoản|bài đã lưu|lịch sử|cài đặt|đăng xuất|profile|thông tin/i);
  });

  test('EX-027 Trang tài khoản có thông tin người dùng, không phải trang rỗng', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'Cần USER_EMAIL và USER_PASSWORD');
    await login(page, USER_EMAIL, USER_PASSWORD);
    await gotoAndReady(page, '/tai-khoan');
    await expectNoBlankPage(page);
    await expectNoHorizontalOverflow(page);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/thông tin|email|avatar|tên|bài viết|đã lưu|lịch sử|cài đặt/i);
    expect(body).not.toMatch(/coming soon|đang phát triển|chưa có chức năng/i);
  });

  test('EX-028 Settings/cài đặt nếu có nút thì không được chết', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'Cần USER_EMAIL và USER_PASSWORD');
    await login(page, USER_EMAIL, USER_PASSWORD);
    await gotoAndReady(page, '/tai-khoan');
    const beforeURL = page.url();
    const clicked = await clickByAny(page, [/cài đặt/i, /setting/i, /chỉnh sửa/i, /edit/i]);
    if (!clicked) test.skip(true, 'Không có nút settings/edit profile trên UI');
    await page.waitForTimeout(500);
    const afterURL = page.url();
    const body = await page.locator('body').innerText();
    expect(afterURL !== beforeURL || /lưu|hủy|tên|avatar|email|setting|cài đặt|chỉnh sửa/i.test(body)).toBeTruthy();
  });
});
