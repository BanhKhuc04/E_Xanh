const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const badTextRegex = /undefined|null|NaN|\[object Object\]|lorem ipsum/i;
const notImplementedRegex = /coming soon|đang phát triển|chưa hoàn thiện|chưa có chức năng|not implemented/i;
const errorPageRegex = /404|not found|không tìm thấy trang|page not found/i;
const destructiveRegex = /xóa|delete|remove|duyệt|từ chối|reject|approve|đăng xuất|logout|thoát|block|khóa/i;

function collectPageErrors(page) {
  const errors = [];
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error' && !/favicon|manifest|Download the React DevTools/i.test(text)) {
      errors.push(text);
    }
  });
  page.on('pageerror', err => errors.push(err.message));
  return errors;
}

async function gotoAndReady(page, route = '/') {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  await expect(page.locator('body')).toBeVisible();
}

async function expectNoBlankPage(page) {
  const text = (await page.locator('body').innerText().catch(() => '')).trim();
  expect(text.length, 'Trang bị trắng hoặc render quá ít nội dung').toBeGreaterThan(20);
}

async function expectNoCriticalText(page) {
  const text = await page.locator('body').innerText().catch(() => '');
  expect(text, 'Không được hiện undefined/null/NaN/[object Object]/lorem ipsum').not.toMatch(badTextRegex);
}

async function expectNoUnexpectedNotImplemented(page) {
  const text = await page.locator('body').innerText().catch(() => '');
  expect(text, 'Có dấu hiệu chức năng chỉ mới mock/coming soon/chưa hoàn thiện').not.toMatch(notImplementedRegex);
}

async function expectNoErrorPage(page, allowAuthRedirect = false) {
  const text = await page.locator('body').innerText().catch(() => '');
  if (allowAuthRedirect && /đăng nhập|login|từ chối|không có quyền|unauthorized/i.test(text)) return;
  expect(text, 'Route bị 404 hoặc trang không tìm thấy').not.toMatch(errorPageRegex);
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return Math.max(document.body.scrollWidth, doc.scrollWidth) - doc.clientWidth;
  });
  expect(overflow, `Trang bị tràn ngang ${overflow}px`).toBeLessThanOrEqual(5);
}

async function expectImagesHealthy(page) {
  const broken = await page.$$eval('img', imgs => imgs
    .filter(img => img.offsetParent !== null)
    .map(img => ({ src: img.currentSrc || img.src, width: img.naturalWidth, height: img.naturalHeight, alt: img.alt }))
    .filter(img => !img.width || !img.height)
  );
  expect(broken, 'Có ảnh bị lỗi tải hoặc naturalWidth/naturalHeight = 0').toEqual([]);
}

async function clickByAny(page, candidates, options = {}) {
  for (const candidate of candidates) {
    const locator = typeof candidate === 'string'
      ? page.getByText(candidate, { exact: false }).first()
      : page.getByText(candidate).first();
    if (await locator.count() && await locator.isVisible().catch(() => false)) {
      await locator.click(options).catch(async () => {
        await locator.click({ force: true, ...options });
      });
      await page.waitForLoadState('domcontentloaded').catch(() => {});
      return true;
    }
  }
  return false;
}

async function fillFirst(page, selectors, value) {
  for (const selector of selectors) {
    const loc = page.locator(selector).first();
    if (await loc.count() && await loc.isVisible().catch(() => false)) {
      await loc.fill(value);
      return true;
    }
  }
  return false;
}

async function login(page, email, password) {
  await gotoAndReady(page, '/dang-nhap');
  const emailFilled = await fillFirst(page, [
    'input[type="email"]',
    'input[name="email"]',
    'input[placeholder*="email" i]',
    'input[placeholder*="Email" i]'
  ], email);
  const passwordFilled = await fillFirst(page, [
    'input[type="password"]',
    'input[name="password"]',
    'input[placeholder*="mật khẩu" i]',
    'input[placeholder*="password" i]'
  ], password);
  expect(emailFilled, 'Không tìm thấy input email ở trang đăng nhập').toBeTruthy();
  expect(passwordFilled, 'Không tìm thấy input password ở trang đăng nhập').toBeTruthy();
  const clicked = await clickByAny(page, [/đăng nhập/i, /login/i, /sign in/i]);
  if (!clicked) await page.locator('button[type="submit"], input[type="submit"]').first().click();
  await page.waitForLoadState('networkidle').catch(() => {});
  // Đợi cho đến khi URL chuyển khỏi trang /dang-nhap
  await page.waitForURL(url => !url.pathname.includes('/dang-nhap'), { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(1000);
}

async function scanClickableInventory(page) {
  return await page.$$eval('a,button,[role="button"],input[type="button"],input[type="submit"]', els => els.map((el, index) => ({
    index,
    tag: el.tagName.toLowerCase(),
    text: (el.innerText || el.value || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().slice(0, 80),
    href: el.getAttribute('href'),
    disabled: !!el.disabled || el.getAttribute('aria-disabled') === 'true',
    visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
    className: String(el.className || '').slice(0, 120)
  })));
}

async function saveJson(fileName, data) {
  const dir = path.join(process.cwd(), 'test-results');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, fileName), JSON.stringify(data, null, 2), 'utf8');
}

async function assertClickablesNotEmpty(page, min = 1) {
  const inventory = await scanClickableInventory(page);
  const visible = inventory.filter(x => x.visible && !x.disabled);
  expect(visible.length, `Trang có quá ít nút/link khả dụng: ${visible.length}`).toBeGreaterThanOrEqual(min);
  const nameless = visible.filter(x => !x.text && !x.href && !/icon|btn|button/i.test(x.className));
  expect(nameless.length, 'Có nút/link không có text, aria-label, title hoặc href rõ ràng').toBeLessThanOrEqual(5);
}

async function clickSafeButtons(page, maxClicks = 12) {
  const locators = await page.locator('button, [role="button"]').all();
  const results = [];
  for (const loc of locators.slice(0, 50)) {
    const text = ((await loc.innerText().catch(() => '')) || (await loc.getAttribute('aria-label').catch(() => '')) || '').trim();
    if (!text || destructiveRegex.test(text)) continue;
    if (!(await loc.isVisible().catch(() => false))) continue;
    if (await loc.isDisabled().catch(() => false)) continue;
    const beforeURL = page.url();
    const beforeText = (await page.locator('body').innerText().catch(() => '')).length;
    await loc.click().catch(() => null);
    await page.waitForTimeout(250);
    const afterURL = page.url();
    const afterText = (await page.locator('body').innerText().catch(() => '')).length;
    results.push({ text, beforeURL, afterURL, changed: beforeURL !== afterURL || Math.abs(afterText - beforeText) > 5 });
    if (results.length >= maxClicks) break;
  }
  return results;
}

module.exports = {
  collectPageErrors,
  gotoAndReady,
  expectNoBlankPage,
  expectNoCriticalText,
  expectNoUnexpectedNotImplemented,
  expectNoErrorPage,
  expectNoHorizontalOverflow,
  expectImagesHealthy,
  clickByAny,
  fillFirst,
  login,
  scanClickableInventory,
  saveJson,
  assertClickablesNotEmpty,
  clickSafeButtons,
  badTextRegex,
  notImplementedRegex,
  errorPageRegex
};
