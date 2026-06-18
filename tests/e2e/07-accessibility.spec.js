import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { PUBLIC_ROUTES, gotoAndWait, assertPageIsUsable } from './utils/qa-helpers.js'

const A11Y_ROUTES = PUBLIC_ROUTES.filter((route) => !['/quen-mat-khau'].includes(route))

test.describe('07 - Accessibility quick scan', () => {
  for (const route of A11Y_ROUTES) {
    test(`axe scan: ${route}`, async ({ page }) => {
      await gotoAndWait(page, route)
      await assertPageIsUsable(page, route)

      const results = await new AxeBuilder({ page })
        .disableRules([
          // Dự án đang ưu tiên QA chức năng trước. Bật lại sau khi đã chốt visual design.
          'color-contrast',
        ])
        .analyze()

      expect(results.violations, `${route}: accessibility violations`).toEqual([])
    })
  }
})
