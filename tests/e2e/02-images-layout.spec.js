import { test } from '@playwright/test'
import {
  collectBrowserIssues,
  createIssueBag,
  gotoAndWait,
  assertPageIsUsable,
  assertMainImagesAreHealthy,
  assertNoHorizontalOverflow,
  assertNoCriticalBrowserIssues,
} from './utils/qa-helpers.js'

const IMAGE_ROUTES = [
  '/',
  '/meo-tiet-kiem',
  '/cong-dong',
  '/dang-nhap',
  '/dang-ky',
]

test.describe('02 - Image ratio, broken image, and layout', () => {
  for (const route of IMAGE_ROUTES) {
    test(`main images and layout are healthy: ${route}`, async ({ page }, testInfo) => {
      const issueBag = createIssueBag()
      collectBrowserIssues(page, issueBag)

      await gotoAndWait(page, route)
      await assertPageIsUsable(page, route)
      await assertNoHorizontalOverflow(page, route)
      await assertMainImagesAreHealthy(page, route)

      await testInfo.attach(`image-layout-${route.replaceAll('/', '_') || 'home'}.png`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      })

      await assertNoCriticalBrowserIssues(issueBag, route)
    })
  }
})
