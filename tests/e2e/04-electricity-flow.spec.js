import { test, expect } from '@playwright/test'
import {
  collectBrowserIssues,
  createIssueBag,
  gotoAndWait,
  assertPageIsUsable,
  assertNoCriticalBrowserIssues,
} from './utils/qa-helpers.js'

test.describe('04 - Electricity calculator flow', () => {
  test('calculator validates empty state, adds device, calculates, and resets', async ({ page }) => {
    const issueBag = createIssueBag()
    collectBrowserIssues(page, issueBag)
    await gotoAndWait(page, '/kiem-tra-tien-dien')
    await assertPageIsUsable(page, '/kiem-tra-tien-dien')

    await page.getByRole('button', { name: /tính tiền điện/i }).click()
    await expect(page.locator('body')).toContainText(/cần thêm ít nhất một thiết bị/i)

    const select = page.locator('select').first()
    await expect(select).toBeVisible()
    const optionValues = await select.locator('option').evaluateAll((options) => options.map((option) => option.value).filter(Boolean))
    expect(optionValues.length, 'Dropdown thiết bị phải có option').toBeGreaterThan(0)

    await select.selectOption(optionValues[0])
    const powerInput = page.getByLabel(/công suất/i)
    if (!(await powerInput.inputValue())) {
      await powerInput.fill('1000')
    }
    await page.getByLabel(/giờ dùng/i).fill('8')
    await page.getByLabel(/ngày dùng/i).fill('30')
    await page.getByRole('button', { name: /thêm thiết bị/i }).click()

    await expect(page.locator('body')).toContainText(/kWh|thiết bị|tổng/i, { timeout: 5000 })
    await page.getByRole('button', { name: /tính tiền điện/i }).click()
    await expect(page.locator('#ket-qua-dien')).toContainText(/kWh|tiền|ước tính|đồng/i, { timeout: 5000 })

    await page.getByRole('button', { name: /làm mới/i }).click()
    await expect(page.getByLabel(/giờ dùng/i)).toHaveValue('')

    await assertNoCriticalBrowserIssues(issueBag, 'electricity calculator')
  })
})
