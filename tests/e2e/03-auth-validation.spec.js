import { test, expect } from '@playwright/test'
import { collectBrowserIssues, createIssueBag, gotoAndWait, assertNoCriticalBrowserIssues } from './utils/qa-helpers.js'

test.describe('03 - Auth form validation', () => {
  test('login form validates empty and invalid inputs', async ({ page }) => {
    const issueBag = createIssueBag()
    collectBrowserIssues(page, issueBag)
    await gotoAndWait(page, '/dang-nhap')

    await page.getByRole('button', { name: /^đăng nhập$/i }).click()
    await expect(page.getByTestId('login-error')).toContainText(/email/i)

    await page.getByLabel(/email/i).fill('email-sai')
    await page.getByRole('button', { name: /^đăng nhập$/i }).click()
    await expect(page.getByTestId('login-error')).toContainText(/không hợp lệ/i)

    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByRole('button', { name: /^đăng nhập$/i }).click()
    await expect(page.getByTestId('login-error')).toContainText(/mật khẩu/i)

    await assertNoCriticalBrowserIssues(issueBag, 'login validation')
  })

  test('register form validates required fields, password, confirm, and terms', async ({ page }) => {
    const issueBag = createIssueBag()
    collectBrowserIssues(page, issueBag)
    await gotoAndWait(page, '/dang-ky')

    await page.getByRole('button', { name: /tạo tài khoản|đăng ký/i }).click()
    await expect(page.getByTestId('register-error')).toBeVisible()

    await page.getByLabel(/họ và tên/i).fill('QA Tester')
    await page.getByLabel(/^email$/i).fill('email-sai')
    await page.getByLabel(/^mật khẩu$/i).fill('123')
    await page.getByLabel(/xác nhận mật khẩu/i).fill('456')
    await page.getByRole('button', { name: /tạo tài khoản|đăng ký/i }).click()
    await expect(page.getByTestId('register-error')).toBeVisible()

    await assertNoCriticalBrowserIssues(issueBag, 'register validation')
  })
})
