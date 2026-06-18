import process from 'node:process'
import { expect } from '@playwright/test'
import { gotoAndWait } from './qa-helpers.js'

export function getQaUserCredentials() {
  const email = process.env.QA_USER_EMAIL
  const password = process.env.QA_USER_PASSWORD
  return email && password ? { email, password } : null
}

export function getQaAdminCredentials() {
  const email = process.env.QA_ADMIN_EMAIL
  const password = process.env.QA_ADMIN_PASSWORD
  return email && password ? { email, password } : null
}

export async function loginViaUi(page, credentials, expectedAfterLogin = /\/$|\/admin|\/tai-khoan/) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error('Thiếu QA_*_EMAIL hoặc QA_*_PASSWORD trong environment.')
  }

  await gotoAndWait(page, '/dang-nhap')
  await page.getByLabel(/email/i).fill(credentials.email)
  await page.getByLabel(/mật khẩu/i).fill(credentials.password)
  await page.getByRole('button', { name: /^đăng nhập$/i }).click()

  const captchaError = page.getByText(/xác minh bạn là người|turnstile|captcha/i)
  if (await captchaError.isVisible({ timeout: 2000 }).catch(() => false)) {
    throw new Error('Automation login bị CAPTCHA/Turnstile chặn. Với local QA, build app bằng VITE_DISABLE_CAPTCHA=true hoặc dùng tài khoản/session test riêng.')
  }

  await expect(page.getByText(/đăng nhập thành công/i).first()).toBeVisible({ timeout: 10_000 })
  await page.waitForURL(expectedAfterLogin, { timeout: 15_000 }).catch(() => {})
}

export async function logoutIfPossible(page) {
  const possibleButtons = [
    page.getByRole('button', { name: /đăng xuất/i }),
    page.getByRole('link', { name: /đăng xuất/i }),
  ]

  for (const locator of possibleButtons) {
    if (await locator.first().isVisible({ timeout: 1000 }).catch(() => false)) {
      await locator.first().click()
      return
    }
  }
}
