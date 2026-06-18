import { test, expect } from '@playwright/test'
import {
  collectBrowserIssues,
  createIssueBag,
  gotoAndWait,
  assertPageIsUsable,
  assertNoCriticalBrowserIssues,
} from './utils/qa-helpers.js'
import { getQaAdminCredentials, loginViaUi } from './utils/auth.js'

const adminPages = [
  { route: '/admin/quan-ly-bai-viet', expected: /bài viết|duyệt|trạng thái/i },
  { route: '/admin/quan-ly-binh-luan', expected: /bình luận/i },
  { route: '/admin/quan-ly-nguoi-dung', expected: /người dùng|email|role|vai trò/i },
  { route: '/admin/quan-ly-thiet-bi', expected: /thiết bị|công suất/i },
  { route: '/admin/thong-bao-he-thong', expected: /thông báo/i },
]

test.describe('06 - Admin safe checks', () => {
  test('admin pages render tables/forms and do not show raw mock/undefined states', async ({ page }) => {
    const credentials = getQaAdminCredentials()
    test.skip(!credentials, 'Bỏ qua vì chưa cấu hình QA_ADMIN_EMAIL và QA_ADMIN_PASSWORD.')

    const issueBag = createIssueBag()
    collectBrowserIssues(page, issueBag)
    await loginViaUi(page, credentials, /\/admin/)

    for (const item of adminPages) {
      await gotoAndWait(page, item.route)
      await assertPageIsUsable(page, item.route)
      await expect(page.locator('body')).toContainText(item.expected)
      await expect(page.locator('body')).not.toContainText(/undefined|null|NaN|\[object Object\]/i)
    }

    await assertNoCriticalBrowserIssues(issueBag, 'admin safe pages')
  })
})
