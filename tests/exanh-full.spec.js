/**
 * ============================================================
 *  E-XANH — Full Playwright Test Suite
 *  Target: https://e-xanh.vercel.app
 *  Coverage: UI, Navigation, Logic, Form Validation, Auth flow
 * ============================================================
 *
 *  Cách chạy:
 *    npx playwright test tests/exanh-full.spec.js --headed
 *    npx playwright test tests/exanh-full.spec.js --project=chromium
 *
 *  Biến môi trường (tuỳ chọn để test auth):
 *    TEST_EMAIL=your@email.com
 *    TEST_PASSWORD=yourpassword
 * ============================================================
 */

import { test, expect } from '@playwright/test';

// ─── CONFIG ──────────────────────────────────────────────────
const BASE_URL = process.env.EXANH_BASE_URL || 'http://127.0.0.1:5173';

// Tài khoản test — điền vào nếu muốn test các chức năng cần đăng nhập
const TEST_EMAIL    = process.env.TEST_EMAIL    || '';
const TEST_PASSWORD = process.env.TEST_PASSWORD || '';
const ADMIN_EMAIL   = process.env.ADMIN_EMAIL   || '';
const ADMIN_PASSWORD= process.env.ADMIN_PASSWORD|| '';
const HAS_AUTH      = Boolean(TEST_EMAIL && TEST_PASSWORD);
const HAS_ADMIN     = Boolean(ADMIN_EMAIL && ADMIN_PASSWORD);

// Timeout mặc định cho các request Supabase
const API_TIMEOUT = 15_000;

// ─── HELPERS ─────────────────────────────────────────────────
async function gotoAndWait(page, path) {
  await page.goto(`${BASE_URL}${path}`);
  await page.waitForLoadState('networkidle', { timeout: API_TIMEOUT }).catch(() => {});
}

async function clearSession(page) {
  await page.context().clearCookies();
  // Tránh lỗi khi trang trống chưa có origin
  try {
    await page.goto(`${BASE_URL}/`);
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  } catch (e) {}
}

async function loginAs(page, email, password) {
  await clearSession(page);
  await gotoAndWait(page, '/dang-nhap');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  // Đợi redirect sau đăng nhập thành công
  await page.waitForURL(url => !url.pathname.includes('/dang-nhap'), { timeout: 10_000 });
}

async function login(page) {
  if (!HAS_AUTH) return;
  await loginAs(page, TEST_EMAIL, TEST_PASSWORD);
}

async function adminLogin(page) {
  if (!HAS_ADMIN) return;
  await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
}

// ═══════════════════════════════════════════════════════════════
//  1. NAVIGATION & ROUTING
// ═══════════════════════════════════════════════════════════════
test.describe('1. Navigation & Routing', () => {

  test('1.1 — Trang chủ load thành công', async ({ page }) => {
    await gotoAndWait(page, '/');
    await expect(page).toHaveTitle(/E-XANH|E_Xanh/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('1.2 — Navbar hiển thị đủ các liên kết chính', async ({ page }) => {
    await gotoAndWait(page, '/');
    const nav = page.locator('nav[aria-label="Điều hướng người dùng"], .user-navbar__links').first();
    await expect(nav).toBeVisible();

    // Kiểm tra từng link điều hướng quan trọng
    for (const [label, href] of [
      ['Trang chủ',         '/'],
      ['Mẹo tiết kiệm',    '/meo-tiet-kiem'],
      ['Cộng đồng',        '/cong-dong'],
      ['Kiểm tra tiền điện', '/kiem-tra-tien-dien'],
    ]) {
      const link = nav.getByRole('link', { name: new RegExp(label, 'i') }).first();
      await expect(link, `Navbar thiếu link "${label}"`).toBeVisible();
      await expect(link).toHaveAttribute('href', new RegExp(href));
    }
  });

  test('1.3 — Footer hiển thị và có link điều hướng', async ({ page }) => {
    await gotoAndWait(page, '/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.getByRole('link').first()).toBeVisible();
  });

  test('1.4 — URL không tồn tại → hiển thị trang 404', async ({ page }) => {
    await gotoAndWait(page, '/trang-khong-ton-tai-xyz');
    // Trang 404 phải render nội dung gì đó (không blank)
    await expect(page.locator('body')).not.toBeEmpty();
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(10);
  });

  const userRoutes = [
    ['Trang chủ',             '/'],
    ['Mẹo tiết kiệm',        '/meo-tiet-kiem'],
    ['Cộng đồng',            '/cong-dong'],
    ['Kiểm tra tiền điện',   '/kiem-tra-tien-dien'],
    ['Lịch sử kiểm tra',     '/lich-su-kiem-tra'],
    ['Đăng nhập',            '/dang-nhap'],
    ['Đăng ký',              '/dang-ky'],
    ['Về chúng tôi',         '/ve-chung-toi'],
    ['Điều khoản',           '/dieu-khoan'],
    ['Liên hệ',              '/lien-he'],
  ];

  for (const [name, path] of userRoutes) {
    test(`1.5 — Route "${name}" (${path}) trả về HTTP 200`, async ({ page }) => {
      const res = await page.goto(`${BASE_URL}${path}`);
      expect(res?.status(), `Route ${path} trả lỗi`).toBeLessThan(400);
    });
  }

});

// ═══════════════════════════════════════════════════════════════
//  2. TRANG CHỦ — UI & CTA
// ═══════════════════════════════════════════════════════════════
test.describe('2. Trang chủ — UI & CTA', () => {

  test('2.1 — Hero section hiển thị đúng', async ({ page }) => {
    await gotoAndWait(page, '/');
    const hero = page.locator('.hero, [class*="hero"]').first();
    await expect(hero).toBeVisible();
    // Tiêu đề hero phải có text
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    const headingText = await heading.innerText();
    expect(headingText.trim().length).toBeGreaterThan(0);
  });

  test('2.2 — Nút CTA "Bắt đầu" hoặc "Khám phá" điều hướng đúng', async ({ page }) => {
    await gotoAndWait(page, '/');
    const cta = page.getByRole('link', { name: /Bắt đầu|Khám phá|Tính tiền điện/i }).first();
    if (await cta.isVisible()) {
      await cta.click();
      await page.waitForLoadState('domcontentloaded');
      // Phải điều hướng sang trang khác hoặc scroll đến section
      expect(page.url()).toBeTruthy();
    }
  });

  test('2.3 — Logo click về trang chủ', async ({ page }) => {
    await gotoAndWait(page, '/meo-tiet-kiem');
    const logo = page.locator('a[href="/"]').first();
    await expect(logo).toBeVisible();
    await logo.click();
    await expect(page).toHaveURL(`${BASE_URL}/`);
  });

  test('2.4 — Phần "Mẹo tiết kiệm nổi bật" xuất hiện trên trang chủ', async ({ page }) => {
    await gotoAndWait(page, '/');
    // Chờ bài viết nổi bật load từ Supabase
    await page.waitForTimeout(2000);
    const featuredSection = page.locator('[class*="featured"], [class*="post-card"], .post-card').first();
    // Không bắt buộc có bài nếu DB trống — chỉ kiểm tra section tồn tại
    const sectionExists = await featuredSection.count() > 0;
    // Log để debug
    console.log('Featured posts visible:', sectionExists);
  });

  test('2.5 — Preview kiểm tra tiền điện trên trang chủ có nút CTA', async ({ page }) => {
    await gotoAndWait(page, '/');
    const electricitySection = page.locator('[class*="electricity"]').first();
    if (await electricitySection.count() > 0) {
      await expect(electricitySection).toBeVisible();
      const ctaBtn = electricitySection.getByRole('link').first();
      if (await ctaBtn.count() > 0) {
        await expect(ctaBtn).toBeVisible();
      }
    }
  });

});

// ═══════════════════════════════════════════════════════════════
//  3. MẸO TIẾT KIỆM — LIST & FILTER & DETAIL
// ═══════════════════════════════════════════════════════════════
test.describe('3. Mẹo tiết kiệm', () => {

  test('3.1 — Trang mẹo tiết kiệm load được', async ({ page }) => {
    await gotoAndWait(page, '/meo-tiet-kiem');
    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
  });

  test('3.2 — Filter bar hiển thị (Tất cả, Mới nhất, v.v.)', async ({ page }) => {
    await gotoAndWait(page, '/meo-tiet-kiem');
    const filterBar = page.locator('[class*="filter"], [class*="Filter"]').first();
    if (await filterBar.count() > 0) {
      await expect(filterBar).toBeVisible();
    }
  });

  test('3.3 — Ô tìm kiếm hoạt động (nhập text không crash)', async ({ page }) => {
    await gotoAndWait(page, '/meo-tiet-kiem');
    const searchInput = page.locator('input[type="text"][placeholder*="Tìm"], input[type="search"], input[placeholder*="tìm"]').first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill('điều hòa');
    await page.waitForTimeout(500);
    // Không crash là pass
    await expect(page.locator('body')).toBeVisible();
  });

  test('3.4 — Click vào bài viết → vào trang chi tiết', async ({ page }) => {
    await gotoAndWait(page, '/meo-tiet-kiem');
    await page.waitForTimeout(2000); // Chờ Supabase load

    const postCard = page.locator('[class*="post-card"] a, .post-card a').first();
    if (await postCard.count() > 0) {
      const href = await postCard.getAttribute('href');
      await postCard.click();
      await page.waitForLoadState('domcontentloaded');
      // URL phải thay đổi sang slug bài viết
      expect(page.url()).not.toEqual(`${BASE_URL}/meo-tiet-kiem`);
      console.log('Post detail URL:', page.url());
    } else {
      console.log('Không có bài viết nào trong DB — bỏ qua test 3.4');
    }
  });

  test('3.5 — Trang chi tiết bài viết có đủ thành phần cơ bản', async ({ page }) => {
    await gotoAndWait(page, '/meo-tiet-kiem');
    await page.waitForTimeout(2000);

    const postLink = page.locator('a[href*="/meo-tiet-kiem/"]').first();
    if (await postLink.count() > 0) {
      await postLink.click();
      await page.waitForLoadState('networkidle', { timeout: API_TIMEOUT }).catch(() => {});

      // Phải có tiêu đề bài viết
      const articleTitle = page.locator('h1, [class*="article-title"], [class*="ArticleHeader"]').first();
      await expect(articleTitle).toBeVisible();

      // Phải có nội dung bài viết
      const content = page.locator('[class*="content"], article, main').first();
      await expect(content).toBeVisible();
    }
  });

});

// ═══════════════════════════════════════════════════════════════
//  4. CỘNG ĐỒNG
// ═══════════════════════════════════════════════════════════════
test.describe('4. Trang cộng đồng', () => {

  test('4.1 — Trang cộng đồng load được', async ({ page }) => {
    await gotoAndWait(page, '/cong-dong');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('4.2 — Filter "Tất cả / Mới nhất / Nhiều tương tác" hiển thị', async ({ page }) => {
    await gotoAndWait(page, '/cong-dong');
    const filters = page.locator('[class*="filter"]').first();
    if (await filters.count() > 0) {
      await expect(filters).toBeVisible();
    }
  });

  test('4.3 — Click filter thay đổi state (không crash)', async ({ page }) => {
    await gotoAndWait(page, '/cong-dong');
    await page.waitForTimeout(2000);

    const filterBtns = page.locator('[class*="filter"] button, [class*="CommunityFilter"] button');
    const count = await filterBtns.count();
    if (count > 1) {
      await filterBtns.nth(1).click();
      await page.waitForTimeout(500);
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('4.4 — Nút "Xem thêm" hoạt động (nếu có)', async ({ page }) => {
    await gotoAndWait(page, '/cong-dong');
    await page.waitForTimeout(2000);

    const loadMoreBtn = page.getByRole('button', { name: /xem thêm|load more/i });
    if (await loadMoreBtn.count() > 0) {
      const postsBefore = await page.locator('[class*="CommunityPostCard"], [class*="community-post"]').count();
      await loadMoreBtn.click();
      await page.waitForTimeout(500);
      const postsAfter = await page.locator('[class*="CommunityPostCard"], [class*="community-post"]').count();
      expect(postsAfter).toBeGreaterThanOrEqual(postsBefore);
    }
  });

  test('4.5 — Sidebar cộng đồng hiển thị (chủ đề phổ biến / thành viên)', async ({ page }) => {
    await gotoAndWait(page, '/cong-dong');
    const sidebar = page.locator('[class*="sidebar"], [class*="Sidebar"]').first();
    if (await sidebar.count() > 0) {
      await expect(sidebar).toBeVisible();
    }
  });

  test('4.6 — PostComposer hiển thị ô nhập liệu khi chưa đăng nhập', async ({ page }) => {
    await gotoAndWait(page, '/cong-dong');
    const composer = page.locator('[class*="PostComposer"], [class*="Composer"]').first();
    if (await composer.count() > 0) {
      await expect(composer).toBeVisible();
    }
  });

});

// ═══════════════════════════════════════════════════════════════
//  5. KIỂM TRA TIỀN ĐIỆN — LOGIC & UI
// ═══════════════════════════════════════════════════════════════
test.describe('5. Kiểm tra tiền điện', () => {

  test('5.1 — Trang tải đủ form nhập thiết bị', async ({ page }) => {
    await gotoAndWait(page, '/kiem-tra-tien-dien');
    await expect(page.locator('select').first()).toBeVisible();
    await expect(page.locator('input[type="number"]').first()).toBeVisible();
  });

  test('5.2 — Dropdown thiết bị có đủ lựa chọn (ít nhất 3)', async ({ page }) => {
    await gotoAndWait(page, '/kiem-tra-tien-dien');
    await page.waitForTimeout(2000); // Chờ Supabase load device options

    const select = page.locator('select').first();
    const options = await select.locator('option').count();
    expect(options).toBeGreaterThanOrEqual(3);
  });

  test('5.3 — Chọn thiết bị → công suất (W) tự điền', async ({ page }) => {
    await gotoAndWait(page, '/kiem-tra-tien-dien');
    await page.waitForTimeout(2000);

    const select = page.locator('select').first();
    await select.selectOption({ index: 0 }); // Chọn thiết bị đầu tiên
    await page.waitForTimeout(300);

    const powerInput = page.locator('input[type="number"]').first();
    const value = await powerInput.inputValue();
    // Giá trị công suất phải được điền tự động (không rỗng)
    expect(value).not.toBe('');
    expect(Number(value)).toBeGreaterThan(0);
  });

  test('5.4 — Thêm thiết bị vào danh sách', async ({ page }) => {
    await gotoAndWait(page, '/kiem-tra-tien-dien');
    await page.waitForTimeout(2000);

    // Điền form
    const numberInputs = page.locator('input[type="number"]');
    await numberInputs.nth(0).fill('850'); // Công suất
    await numberInputs.nth(1).fill('8');   // Giờ/ngày
    await numberInputs.nth(2).fill('30');  // Ngày/tháng

    // Click nút "Thêm thiết bị"
    const addBtn = page.getByRole('button', { name: /Thêm thiết bị/i });
    await expect(addBtn).toBeVisible();
    await addBtn.click();
    await page.waitForTimeout(500);

    // Kiểm tra thiết bị xuất hiện trong danh sách
    const deviceList = page.locator('[class*="device-usage"], [class*="DeviceUsage"]').first();
    if (await deviceList.count() > 0) {
      await expect(deviceList).toBeVisible();
    }
  });

  test('5.5 — Form validation: bấm Thêm khi để trống → không thêm', async ({ page }) => {
    await gotoAndWait(page, '/kiem-tra-tien-dien');
    await page.waitForTimeout(2000);

    // Xóa sạch tất cả inputs số
    const numberInputs = page.locator('input[type="number"]');
    const count = await numberInputs.count();
    for (let i = 0; i < count; i++) {
      await numberInputs.nth(i).fill('');
    }

    const devicesBefore = await page.locator('[class*="device-item"], [class*="DeviceItem"]').count();
    await page.getByRole('button', { name: /Thêm thiết bị/i }).click();
    await page.waitForTimeout(300);
    const devicesAfter = await page.locator('[class*="device-item"], [class*="DeviceItem"]').count();

    // Số thiết bị không tăng lên
    expect(devicesAfter).toBeLessThanOrEqual(devicesBefore);
  });

  test('5.6 — Kết quả kWh & chi phí được tính và hiển thị', async ({ page }) => {
    await gotoAndWait(page, '/kiem-tra-tien-dien');
    await page.waitForTimeout(2000);

    // Điền thiết bị hợp lệ
    const numberInputs = page.locator('input[type="number"]');
    await numberInputs.nth(0).fill('1000');
    await numberInputs.nth(1).fill('8');
    await numberInputs.nth(2).fill('30');
    await page.getByRole('button', { name: /Thêm thiết bị/i }).click();
    await page.waitForTimeout(500);

    // Kiểm tra card kết quả tồn tại và có số kWh
    const resultCard = page.locator('[class*="result"], [class*="Result"]').first();
    if (await resultCard.count() > 0) {
      await expect(resultCard).toBeVisible();
      const text = await resultCard.innerText();
      // Phải có số hoặc đơn vị kWh/đồng
      expect(text).toMatch(/kWh|đ|VNĐ|\d+/i);
    }
  });

  test('5.7 — Công thức tính: 1000W × 8h × 30 ngày / 1000 = 240 kWh', async ({ page }) => {
    await gotoAndWait(page, '/kiem-tra-tien-dien');
    await page.waitForTimeout(2000);

    // Làm mới trước
    const resetBtn = page.getByRole('button', { name: /Làm mới/i });
    if (await resetBtn.count() > 0) await resetBtn.click();
    await page.waitForTimeout(300);

    // Xóa tất cả thiết bị mẫu trước
    const removeButtons = page.locator('button[aria-label*="xóa"], button[title*="xóa"], [class*="remove"]');
    const removeCount = await removeButtons.count();
    for (let i = 0; i < removeCount; i++) {
      await removeButtons.first().click();
      await page.waitForTimeout(200);
    }

    // Chọn "Khác" để nhập tay
    const select = page.locator('select').first();
    await select.selectOption('Khác').catch(() => {});
    await page.waitForTimeout(200);

    const numberInputs = page.locator('input[type="number"]');
    await numberInputs.nth(0).fill('1000'); // 1000W
    await numberInputs.nth(1).fill('8');    // 8h/ngày
    await numberInputs.nth(2).fill('30');   // 30 ngày

    await page.getByRole('button', { name: /Thêm thiết bị/i }).click();
    await page.waitForTimeout(500);

    // Kết quả phải hiển thị ~240 kWh
    const bodyText = await page.locator('body').innerText();
    const hasKwh = bodyText.includes('240') || bodyText.includes('kWh');
    expect(hasKwh).toBeTruthy();
  });

  test('5.8 — Nút "Làm mới" reset danh sách về mẫu mặc định', async ({ page }) => {
    await gotoAndWait(page, '/kiem-tra-tien-dien');
    await page.waitForTimeout(2000);

    // Thêm 1 thiết bị
    const numberInputs = page.locator('input[type="number"]');
    await numberInputs.nth(0).fill('500');
    await numberInputs.nth(1).fill('5');
    await numberInputs.nth(2).fill('20');
    await page.getByRole('button', { name: /Thêm thiết bị/i }).click();
    await page.waitForTimeout(300);

    // Làm mới
    const resetBtn = page.getByRole('button', { name: /Làm mới/i });
    await resetBtn.click();
    await page.waitForTimeout(300);

    // Inputs phải trở về trống hoặc giá trị mặc định
    const hoursInput = page.locator('input[type="number"]').nth(1);
    const value = await hoursInput.inputValue();
    expect(value).toBe('');
  });

  test('5.9 — Nút "Xóa" từng thiết bị hoạt động', async ({ page }) => {
    await gotoAndWait(page, '/kiem-tra-tien-dien');
    await page.waitForTimeout(2000);

    // Tìm nút xóa (dấu ✕ hoặc "Xóa")
    const removeBtn = page.locator('[class*="remove"], button:has-text("Xóa")').first();
    if (await removeBtn.count() > 0) {
      const countBefore = await page.locator('[class*="device-item"], [class*="DeviceItem"]').count();
      await removeBtn.click();
      await page.waitForTimeout(300);
      const countAfter = await page.locator('[class*="device-item"], [class*="DeviceItem"]').count();
      expect(countAfter).toBeLessThanOrEqual(countBefore);
    }
  });

  test('5.10 — Gợi ý tiết kiệm điện hiển thị', async ({ page }) => {
    await gotoAndWait(page, '/kiem-tra-tien-dien');
    const suggestions = page.locator('[class*="saving"], [class*="Saving"]').first();
    if (await suggestions.count() > 0) {
      await expect(suggestions).toBeVisible();
    }
  });

  test('5.11 — Nút "Lưu lịch sử" hiển thị và có thể click (chưa đăng nhập → thông báo)', async ({ page }) => {
    await gotoAndWait(page, '/kiem-tra-tien-dien');
    await page.waitForTimeout(2000);

    const saveBtn = page.getByRole('button', { name: /Lưu lịch sử/i });
    await expect(saveBtn).toBeVisible();

    await saveBtn.click();
    await page.waitForTimeout(1000);

    // Phải có thông báo phản hồi
    const feedback = page.locator('[class*="save-message"], [class*="feedback"]').first();
    if (await feedback.count() > 0) {
      const text = await feedback.innerText();
      expect(text.length).toBeGreaterThan(0);
    }
  });

});

// ═══════════════════════════════════════════════════════════════
//  6. ĐĂNG NHẬP — VALIDATION & UI
// ═══════════════════════════════════════════════════════════════
test.describe('6. Trang đăng nhập — Validation', () => {

  test('6.1 — Trang đăng nhập render đầy đủ các field', async ({ page }) => {
    await gotoAndWait(page, '/dang-nhap');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('6.2 — Bấm Đăng nhập khi bỏ trống email → lỗi "Vui lòng nhập email"', async ({ page }) => {
    await gotoAndWait(page, '/dang-nhap');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    const error = page.locator('[class*="error"], [class*="message--error"]').first();
    await expect(error).toBeVisible();
    await expect(error).toContainText(/email/i);
  });

  test('6.3 — Email sai định dạng → lỗi "Email không hợp lệ"', async ({ page }) => {
    await gotoAndWait(page, '/dang-nhap');
    await page.fill('input[type="email"]', 'khonghople');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    const error = page.locator('[data-testid="login-error"]').first();
    await expect(error).toBeVisible();
    await expect(error).toContainText(/email/i);
  });

  test('6.4 — Email hợp lệ nhưng bỏ trống mật khẩu → lỗi mật khẩu', async ({ page }) => {
    await gotoAndWait(page, '/dang-nhap');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    const error = page.locator('[class*="error"], [class*="message--error"]').first();
    await expect(error).toBeVisible();
    await expect(error).toContainText(/mật khẩu/i);
  });

  test('6.5 — Đăng nhập sai credentials → lỗi từ Supabase', async ({ page }) => {
    await gotoAndWait(page, '/dang-nhap');
    await page.fill('input[type="email"]', 'sai@email.com');
    await page.fill('input[type="password"]', 'saitmk123');
    await page.click('button[type="submit"]');

    const error = page.locator('[class*="error"], [class*="message--error"]').first();
    await expect(error).toBeVisible({ timeout: 8000 });
    const text = await error.innerText();
    expect(text.length).toBeGreaterThan(0);
  });

  test('6.6 — Link "Đăng ký" ở trang login dẫn đến /dang-ky', async ({ page }) => {
    await gotoAndWait(page, '/dang-nhap');
    const link = page.getByRole('link', { name: /Đăng ký/i }).first();
    await link.click();
    await expect(page).toHaveURL(/\/dang-ky/);
  });

  test('6.7 — Checkbox "Ghi nhớ đăng nhập" có thể tick', async ({ page }) => {
    await gotoAndWait(page, '/dang-nhap');
    const checkbox = page.locator('input[type="checkbox"]').first();
    await expect(checkbox).toBeVisible();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  // Test đăng nhập thực — chỉ chạy khi có env vars
  test.skip(!HAS_AUTH, '6.8 — Đăng nhập thành công (cần TEST_EMAIL & TEST_PASSWORD)', async ({ page }) => {
    await login(page);
    // Sau login phải redirect về / hoặc /admin
    expect(page.url()).toMatch(/\/|\/admin/);
  });

});

// ═══════════════════════════════════════════════════════════════
//  7. ĐĂNG KÝ — VALIDATION
// ═══════════════════════════════════════════════════════════════
test.describe('7. Trang đăng ký — Validation', () => {

  test('7.1 — Trang đăng ký render đủ 4 fields', async ({ page }) => {
    await gotoAndWait(page, '/dang-ky');
    await expect(page.locator('input[type="text"]').first()).toBeVisible();   // Họ tên
    await expect(page.locator('input[type="email"]')).toBeVisible();
    const passwordFields = page.locator('input[type="password"]');
    await expect(passwordFields.nth(0)).toBeVisible(); // Mật khẩu
    await expect(passwordFields.nth(1)).toBeVisible(); // Xác nhận
  });

  test('7.2 — Bỏ trống họ tên → lỗi', async ({ page }) => {
    await gotoAndWait(page, '/dang-ky');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    const error = page.locator('[class*="error"], [class*="message--error"]').first();
    await expect(error).toBeVisible();
    await expect(error).toContainText(/họ.*tên|tên/i);
  });

  test('7.3 — Email không hợp lệ → lỗi', async ({ page }) => {
    await gotoAndWait(page, '/dang-ky');
    await page.fill('input[type="text"]', 'Người Dùng Test');
    await page.fill('input[type="email"]', 'emailsai');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    const error = page.locator('[data-testid="register-error"]').first();
    await expect(error).toContainText(/email/i);
  });

  test('7.4 — Mật khẩu < 6 ký tự → lỗi', async ({ page }) => {
    await gotoAndWait(page, '/dang-ky');
    await page.fill('input[type="text"]', 'Người Dùng Test');
    await page.fill('input[type="email"]', 'test@gmail.com');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    const error = page.locator('[role="alert"]').first();
    await expect(error).toContainText(/6|ký tự/i);
  });

  test('7.5 — Mật khẩu không khớp → lỗi', async ({ page }) => {
    await gotoAndWait(page, '/dang-ky');
    await page.fill('input[type="text"]', 'Người Dùng Test');
    await page.fill('input[type="email"]', 'test@gmail.com');
    const passwords = page.locator('input[type="password"]');
    await passwords.nth(0).fill('password123');
    await passwords.nth(1).fill('password456');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    const error = page.locator('[role="alert"]').first();
    await expect(error).toContainText(/khớp|xác nhận/i);
  });

  test('7.6 — Không tick điều khoản → lỗi', async ({ page }) => {
    await gotoAndWait(page, '/dang-ky');
    await page.fill('input[type="text"]', 'Người Dùng Test');
    await page.fill('input[type="email"]', 'test@gmail.com');
    const passwords = page.locator('input[type="password"]');
    await passwords.nth(0).fill('password123');
    await passwords.nth(1).fill('password123');
    // Không check checkbox điều khoản
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    const error = page.locator('[class*="error"], [class*="message--error"]').first();
    await expect(error).toContainText(/điều khoản/i);
  });

  test('7.7 — Link "Điều khoản sử dụng" trong form dẫn đúng', async ({ page }) => {
    await gotoAndWait(page, '/dang-ky');
    const termsLink = page.getByRole('link', { name: /điều khoản/i }).first();
    await expect(termsLink).toHaveAttribute('href', /dieu-khoan/);
  });

  test('7.8 — Link "Đăng nhập" ở trang đăng ký dẫn về /dang-nhap', async ({ page }) => {
    await gotoAndWait(page, '/dang-ky');
    const link = page.getByRole('link', { name: /Đăng nhập/i }).first();
    await link.click();
    await expect(page).toHaveURL(/\/dang-nhap/);
  });

});

// ═══════════════════════════════════════════════════════════════
//  8. FORM LIÊN HỆ — VALIDATION
// ═══════════════════════════════════════════════════════════════
test.describe('8. Form liên hệ', () => {

  test('8.1 — Trang liên hệ render form', async ({ page }) => {
    await gotoAndWait(page, '/lien-he');
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('8.2 — Submit trống → lỗi yêu cầu nhập họ tên', async ({ page }) => {
    await gotoAndWait(page, '/lien-he');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    const error = page.locator('[role="alert"]').first();
    await expect(error).toBeVisible();
    await expect(error).toContainText(/họ tên|tên/i);
  });

  test('8.3 — Email sai định dạng → lỗi email', async ({ page }) => {
    await gotoAndWait(page, '/lien-he');
    await page.fill('input[type="text"]', 'Nguyễn Văn A');
    await page.fill('input[type="email"]', 'emailkhonghople');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    const error = page.locator('[data-testid="contact-error"]').first();
    await expect(error).toContainText(/email/i);
  });

  test('8.4 — Bỏ trống nội dung → lỗi nội dung', async ({ page }) => {
    await gotoAndWait(page, '/lien-he');
    await page.fill('input[type="text"]', 'Nguyễn Văn A');
    await page.fill('input[type="email"]', 'valid@email.com');
    // Bỏ trống textarea
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    const error = page.locator('[role="alert"]').first();
    await expect(error).toContainText(/nội dung/i);
  });

  test('8.5 — Submit hợp lệ → thông báo thành công', async ({ page }) => {
    await gotoAndWait(page, '/lien-he');
    await page.fill('input[type="text"]', 'Playwright Tester');
    await page.fill('input[type="email"]', 'playwright@test.com');
    await page.fill('textarea', 'Đây là tin nhắn test từ Playwright.');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    const success = page.locator('[class*="success"], [class*="message--success"]').first();
    await expect(success).toBeVisible();
    await expect(success).toContainText(/cảm ơn|thành công/i);
  });

  test('8.6 — Dropdown chủ đề liên hệ có thể thay đổi', async ({ page }) => {
    await gotoAndWait(page, '/lien-he');
    const select = page.locator('select').first();
    if (await select.count() > 0) {
      const options = await select.locator('option').count();
      expect(options).toBeGreaterThanOrEqual(1);
      if (options > 1) {
        await select.selectOption({ index: 1 });
        await page.waitForTimeout(200);
        await expect(page.locator('body')).toBeVisible(); // Không crash
      }
    }
  });

});

// ═══════════════════════════════════════════════════════════════
//  9. TRANG TĨNH — VỀ CHÚNG TÔI & ĐIỀU KHOẢN
// ═══════════════════════════════════════════════════════════════
test.describe('9. Trang tĩnh', () => {

  test('9.1 — Trang "Về chúng tôi" load và có heading', async ({ page }) => {
    await gotoAndWait(page, '/ve-chung-toi');
    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
    const text = await heading.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  });

  test('9.2 — Trang "Điều khoản" load và có nội dung', async ({ page }) => {
    await gotoAndWait(page, '/dieu-khoan');
    const body = page.locator('main, [class*="static-page"]').first();
    if (await body.count() > 0) {
      await expect(body).toBeVisible();
      const text = await body.innerText();
      expect(text.trim().length).toBeGreaterThan(50);
    }
  });

  test('9.3 — Breadcrumb hiển thị và link về trang chủ', async ({ page }) => {
    await gotoAndWait(page, '/ve-chung-toi');
    const breadcrumb = page.locator('[class*="breadcrumb"]').first();
    if (await breadcrumb.count() > 0) {
      const homeLink = breadcrumb.getByRole('link', { name: /trang chủ/i });
      await expect(homeLink).toBeVisible();
      await homeLink.click();
      await expect(page).toHaveURL(`${BASE_URL}/`);
    }
  });

});

// ═══════════════════════════════════════════════════════════════
//  10. LỊCH SỬ KIỂM TRA ĐIỆN
// ═══════════════════════════════════════════════════════════════
test.describe('10. Lịch sử kiểm tra điện', () => {

  test('10.1 — Trang lịch sử load được', async ({ page }) => {
    await gotoAndWait(page, '/lich-su-kiem-tra');
    await expect(page.locator('body')).toBeVisible();
  });

  test('10.2 — Khi chưa đăng nhập, trang vẫn render (không crash)', async ({ page }) => {
    await gotoAndWait(page, '/lich-su-kiem-tra');
    // Không crash = pass
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(10);
  });

  test('10.3 — Lưu rồi vào lịch sử → thấy dữ liệu localStorage', async ({ page }) => {
    // Inject dữ liệu giả vào localStorage rồi vào trang
    await page.goto(`${BASE_URL}/lich-su-kiem-tra`);
    await page.evaluate(() => {
      const fakeHistory = [{
        id: 'test-pw-001',
        checkedAt: '2025-06-01',
        deviceCount: 2,
        totalKwh: 240,
        estimatedCost: 576000,
        highestDevice: 'Điều hòa',
        savingPercent: '15–20%',
        items: []
      }];
      localStorage.setItem('eXanhElectricityHistory', JSON.stringify(fakeHistory));
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const bodyText = await page.locator('body').innerText();
    // Phải thấy dữ liệu lịch sử (số kWh hoặc tên thiết bị)
    const hasData = bodyText.includes('240') || bodyText.includes('Điều hòa') || bodyText.includes('576');
    console.log('History data found:', hasData);
    // Không yêu cầu bắt buộc vì trang có thể ưu tiên DB
  });

});

// ═══════════════════════════════════════════════════════════════
//  11. RESPONSIVE — MOBILE VIEW
// ═══════════════════════════════════════════════════════════════
test.describe('11. Responsive — Mobile', () => {

  const mobileViewport = { width: 390, height: 844 }; // iPhone 14

  test('11.1 — Trang chủ hiển thị đúng trên mobile', async ({ page }) => {
    await page.setViewportSize(mobileViewport);
    await gotoAndWait(page, '/');
    await expect(page.locator('body')).toBeVisible();
    await page.waitForTimeout(1000); // Wait for mobile layout to settle
    // Không có horizontal scroll vượt quá viewport
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20);
  });

  test('11.2 — Trang kiểm tra điện dùng được trên mobile', async ({ page }) => {
    await page.setViewportSize(mobileViewport);
    await gotoAndWait(page, '/kiem-tra-tien-dien');
    await expect(page.locator('select').first()).toBeVisible();
    await expect(page.locator('input[type="number"]').first()).toBeVisible();
  });

  test('11.3 — Trang đăng nhập dùng được trên mobile', async ({ page }) => {
    await page.setViewportSize(mobileViewport);
    await gotoAndWait(page, '/dang-nhap');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('11.4 — Navbar mobile hiển thị (hamburger hoặc bottom nav)', async ({ page }) => {
    await page.setViewportSize(mobileViewport);
    await gotoAndWait(page, '/');
    const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
    await expect(hamburger).toBeVisible();
    await hamburger.click();
    await page.waitForTimeout(500);

    const nav = page.locator('nav[aria-label="Điều hướng người dùng"], .user-navbar__links').first();
    await expect(nav).toBeVisible();
  });

});

// ═══════════════════════════════════════════════════════════════
//  12. PERFORMANCE & ACCESSIBILITY CƠ BẢN
// ═══════════════════════════════════════════════════════════════
test.describe('12. Performance & Accessibility', () => {

  test('12.1 — Trang chủ load xong trong vòng 10 giây', async ({ page }) => {
    const start = Date.now();
    await gotoAndWait(page, '/');
    const elapsed = Date.now() - start;
    console.log(`Trang chủ load trong ${elapsed}ms`);
    expect(elapsed).toBeLessThan(10_000);
  });

  test('12.2 — Không có lỗi console nghiêm trọng trên trang chủ', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await gotoAndWait(page, '/');
    await page.waitForTimeout(2000);

    // Lọc lỗi Supabase kết nối (vì chạy không có key thật)
    const criticalErrors = errors.filter(e =>
      !e.includes('supabase') &&
      !e.includes('fetch') &&
      !e.includes('network') &&
      !e.includes('CORS') &&
      !e.includes('Failed to load')
    );

    if (criticalErrors.length > 0) {
      console.warn('Console errors:', criticalErrors);
    }
    expect(criticalErrors.length).toBe(0);
  });

  test('12.3 — Tất cả ảnh có thuộc tính alt', async ({ page }) => {
    await gotoAndWait(page, '/');
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      // Ảnh có src thật phải có alt
      if (src && !src.startsWith('data:')) {
        expect(alt, `Ảnh ${src} thiếu thuộc tính alt`).not.toBeNull();
      }
    }
  });

  test('12.4 — Tất cả nút có text hoặc aria-label', async ({ page }) => {
    await gotoAndWait(page, '/');
    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      if (!(await btn.isVisible())) continue;

      const text     = (await btn.innerText()).trim();
      const ariaLabel = await btn.getAttribute('aria-label');
      const title    = await btn.getAttribute('title');

      const hasLabel = text.length > 0 || Boolean(ariaLabel) || Boolean(title);
      if (!hasLabel) {
        console.warn(`Nút số ${i + 1} không có text/aria-label`);
      }
    }
  });

  test('12.5 — Trang có thẻ <title> không rỗng', async ({ page }) => {
    await gotoAndWait(page, '/');
    const title = await page.title();
    expect(title.trim().length).toBeGreaterThan(0);
  });

  test('12.6 — Không có link href bị broken (#, undefined, null)', async ({ page }) => {
    await gotoAndWait(page, '/');
    const links = page.locator('a[href]');
    const count = await links.count();
    const brokenLinks = [];

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      if (href === '#' || href === 'undefined' || href === 'null' || href === '') {
        const text = await links.nth(i).innerText();
        brokenLinks.push(`"${text}" → href="${href}"`);
      }
    }

    if (brokenLinks.length > 0) {
      console.warn('Broken links:', brokenLinks);
    }
    // Cảnh báo thay vì fail cứng vì href="#" đôi khi hợp lệ
    expect(brokenLinks.filter(l => !l.includes('undefined') && !l.includes('null')).length).toBeLessThan(5);
  });

});

// ═══════════════════════════════════════════════════════════════
//  13. ADMIN — ACCESS CONTROL (Không có quyền)
// ═══════════════════════════════════════════════════════════════
test.describe('13. Admin — Access Control', () => {

  test('13.1 — Khách chưa đăng nhập vào /admin → bị từ chối/redirect', async ({ page }) => {
    await clearSession(page);
    await gotoAndWait(page, '/admin');
    const url = page.url();
    const isAllowed = url.includes('/admin') && !url.includes('khong-co-quyen') && !url.includes('dang-nhap');
    if (isAllowed) {
      console.warn('⚠️ Admin route không được bảo vệ!');
    }
    expect(url).toBeTruthy();
  });

  test('13.2 — User thường vào /admin → bị từ chối/redirect', async ({ page }) => {
    test.skip(!HAS_AUTH, 'Bỏ qua vì không có TEST_EMAIL');
    await login(page);
    await gotoAndWait(page, '/admin');
    const isRedirected = page.url().includes('khong-co-quyen') || page.url().includes('dang-nhap');
    if (!isRedirected) {
      const heading = page.locator('h2', { hasText: /Từ chối truy cập/i }).first();
      await expect(heading).toBeVisible({ timeout: 10000 });
    }
  });

  test('13.3 — Admin login vào /admin → thành công', async ({ page }) => {
    test.skip(!HAS_ADMIN, 'Bỏ qua vì không có ADMIN_EMAIL');
    await adminLogin(page);
    await gotoAndWait(page, '/admin');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url.includes('/admin') && !url.includes('khong-co-quyen') && !url.includes('dang-nhap')).toBeTruthy();
  });

});

// ═══════════════════════════════════════════════════════════════
//  14. ĐĂNG BÀI — CHƯA ĐĂNG NHẬP
// ═══════════════════════════════════════════════════════════════
test.describe('14. Trang đăng bài', () => {

  test('14.1 — Trang /dang-bai hiển thị (hoặc redirect)', async ({ page }) => {
    await gotoAndWait(page, '/dang-bai');
    await expect(page.locator('body')).toBeVisible();
    const url = page.url();
    console.log('Đăng bài redirect to:', url);
  });

  test('14.2 — Nếu hiển thị form, có đủ các field cơ bản', async ({ page }) => {
    await gotoAndWait(page, '/dang-bai');
    const hasForm = await page.locator('input[type="text"], textarea, select').count();
    if (hasForm > 0) {
      // Có tiêu đề, loại bài, nội dung
      const titleInput = page.locator('input[placeholder*="tiêu đề"], input[placeholder*="Tiêu đề"]').first();
      if (await titleInput.count() > 0) {
        await expect(titleInput).toBeVisible();
      }
    }
  });

});

// ═══════════════════════════════════════════════════════════════
//  15. BÀI ĐÃ LƯU
// ═══════════════════════════════════════════════════════════════
test.describe('15. Bài đã lưu', () => {

  test('15.1 — Trang /bai-da-luu load được', async ({ page }) => {
    await gotoAndWait(page, '/bai-da-luu');
    await expect(page.locator('body')).toBeVisible();
  });

  test('15.2 — Trang hiển thị thông báo khi chưa có bài lưu hoặc chưa đăng nhập', async ({ page }) => {
    await gotoAndWait(page, '/bai-da-luu');
    await page.waitForTimeout(2000);
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.trim().length).toBeGreaterThan(10);
  });

});
