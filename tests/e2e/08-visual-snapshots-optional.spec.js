import process from 'node:process'
import { test, expect } from '@playwright/test'
import { gotoAndWait, assertPageIsUsable } from './utils/qa-helpers.js'

const visualRoutes = ['/', '/meo-tiet-kiem', '/cong-dong', '/kiem-tra-tien-dien']

test.describe('08 - Optional visual regression snapshots', () => {
  test.skip(process.env.QA_ENABLE_VISUAL !== '1', 'Bật QA_ENABLE_VISUAL=1 khi muốn chạy visual regression.')

  for (const route of visualRoutes) {
    test(`visual snapshot: ${route}`, async ({ page }) => {
      await gotoAndWait(page, route)
      await assertPageIsUsable(page, route)
      await expect(page).toHaveScreenshot(`${route.replaceAll('/', '_') || 'home'}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.03,
      })
    })
  }
})
