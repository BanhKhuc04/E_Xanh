import { test, expect } from '@playwright/test'
import {
  PROTECTED_USER_ROUTES,
  ADMIN_ROUTES,
  collectBrowserIssues,
  createIssueBag,
  gotoAndWait,
  assertPageIsUsable,
  assertNoCriticalBrowserIssues,
} from './utils/qa-helpers.js'
import { getQaUserCredentials, getQaAdminCredentials, loginViaUi } from './utils/auth.js'

test.describe('05 - Guards and optional authenticated flows', () => {
  for (const route of PROTECTED_USER_ROUTES) {
    test(`anonymous user route guard redirects to login: ${route}`, async ({ page }) => {
      const issueBag = createIssueBag()
      collectBrowserIssues(page, issueBag)
      await gotoAndWait(page, route)
      await expect(page).toHaveURL(/\/dang-nhap/)
      await expect(page.locator('body')).toContainText(/đăng nhập|vui lòng/i)
      await assertNoCriticalBrowserIssues(issueBag, `${route} anonymous guard`)
    })
  }

  test('anonymous admin guard redirects or denies access safely', async ({ page }) => {
    const issueBag = createIssueBag()
    collectBrowserIssues(page, issueBag)
    await gotoAndWait(page, '/admin')
    await expect(page).toHaveURL(/\/dang-nhap|\/admin/)
    await expect(page.locator('body')).toContainText(/đăng nhập|kiểm tra quyền|từ chối|chào mừng/i)
    await assertNoCriticalBrowserIssues(issueBag, 'anonymous admin guard')
  })

  test('user login flow and protected pages', async ({ page }) => {
    const credentials = getQaUserCredentials()
    test.skip(!credentials, 'Bỏ qua vì chưa cấu hình QA_USER_EMAIL và QA_USER_PASSWORD.')

    const issueBag = createIssueBag()
    collectBrowserIssues(page, issueBag)
    await loginViaUi(page, credentials, /\/|\/tai-khoan|\/admin/)

    for (const route of ['/tai-khoan', '/bai-da-luu', '/lich-su-kiem-tra', '/tai-khoan/cai-dat']) {
      await gotoAndWait(page, route)
      await assertPageIsUsable(page, route)
    }

    await assertNoCriticalBrowserIssues(issueBag, 'user authenticated routes')
  })

  test('admin login flow and admin routes are usable', async ({ page }) => {
    const credentials = getQaAdminCredentials()
    test.skip(!credentials, 'Bỏ qua vì chưa cấu hình QA_ADMIN_EMAIL và QA_ADMIN_PASSWORD.')

    const issueBag = createIssueBag()
    collectBrowserIssues(page, issueBag)
    await loginViaUi(page, credentials, /\/admin/)

    for (const route of ADMIN_ROUTES) {
      await gotoAndWait(page, route)
      await assertPageIsUsable(page, route)
      await expect(page.locator('body')).not.toContainText(/không có quyền|từ chối truy cập/i)
    }

    await assertNoCriticalBrowserIssues(issueBag, 'admin authenticated routes')
  })
})
