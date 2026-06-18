import { test, expect } from '@playwright/test'
import {
  PUBLIC_ROUTES,
  collectBrowserIssues,
  createIssueBag,
  gotoAndWait,
  assertPageIsUsable,
  assertNoCriticalBrowserIssues,
  assertNoHorizontalOverflow,
  dismissKnownOverlays,
} from './utils/qa-helpers.js'

test.describe('00 - Public routes health', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`public route loads, reloads, and has no critical browser error: ${route}`, async ({ page }, testInfo) => {
      const issueBag = createIssueBag()
      collectBrowserIssues(page, issueBag)

      const response = await gotoAndWait(page, route)
      expect(response?.status(), `${route}: HTTP status`).toBeLessThan(400)
      await assertPageIsUsable(page, route)
      await assertNoHorizontalOverflow(page, route)

      await testInfo.attach(`screenshot-${route.replaceAll('/', '_') || 'home'}.png`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      })

      await page.reload({ waitUntil: 'domcontentloaded' })
      await page.waitForLoadState('networkidle').catch(() => {})
      await dismissKnownOverlays(page)
      await assertPageIsUsable(page, `${route} after F5/reload`)
      await assertNoCriticalBrowserIssues(issueBag, route)
    })
  }
})
