import { expect } from '@playwright/test'

export const PUBLIC_ROUTES = [
  '/',
  '/meo-tiet-kiem',
  '/cong-dong',
  '/kiem-tra-tien-dien',
  '/ve-chung-toi',
  '/lien-he',
  '/dieu-khoan',
  '/dang-nhap',
  '/dang-ky',
  '/quen-mat-khau',
]

export const PROTECTED_USER_ROUTES = [
  '/bai-da-luu',
  '/lich-su-kiem-tra',
  '/tai-khoan/cai-dat',
]

export const ADMIN_ROUTES = [
  '/admin',
  '/admin/quan-ly-bai-viet',
  '/admin/quan-ly-binh-luan',
  '/admin/quan-ly-nguoi-dung',
  '/admin/quan-ly-thiet-bi',
  '/admin/thong-ke',
  '/admin/thong-bao-he-thong',
  '/admin/cai-dat',
  '/admin/cai-dat-giao-dien',
]

const CONSOLE_IGNORE_PATTERNS = [
  /favicon/i,
  /ResizeObserver/i,
  /non-serializable/i,
  /Download the React DevTools/i,
  /google-analytics/i,
  /google\.com\/g\/collect/i,
  /googletagmanager\.com/i,
  /gtag/i,
  /cloudflareinsights/i,
  /Failed to load resource: net::ERR_CONNECTION_RESET/i,
  /ERR_BLOCKED_BY_CLIENT/i,
  // Browser emits generic resource-load errors without URL; request/response listeners already record URLs.
  // Keep network assertions as the source of truth to avoid noisy false positives.
  /Failed to load resource/i,
  /font-size:0;color:transparent NaN/i,
]

const REQUEST_IGNORE_PATTERNS = [
  /favicon/i,
  /cloudflareinsights/i,
  /google-analytics/i,
  /google\.com\/g\/collect/i,
  /googletagmanager\.com/i,
  /analytics/i,
  /speed-insights/i,
  /vercel\/insights/i,
  /turnstile/i,
  /challenges\.cloudflare\.com\/cdn-cgi\/challenge-platform/i,
  /\/cdn-cgi\/challenge-platform/i,
  // Cloudflare Web Analytics / Zaraz / RUM / Challenge assets: thường bị abort/401 trong Playwright do anti-bot/CAPTCHA, không phải lỗi ảnh/layout E-XANH.
  /\/cdn-cgi\/zaraz\//i,
  /\/cdn-cgi\/rum/i,
  /\/cdn-cgi\/trace/i,
]

function isAbortOnlyMediaRequest(url, errorText = '') {
  const isMedia = /\.(mp4|webm|mov|m4v|avi)(\?|$)/i.test(url)
  const isAbort = /ERR_ABORTED|NS_BINDING_ABORTED|net::ERR_ABORTED|aborted/i.test(errorText)
  return isMedia && isAbort
}

function shouldIgnoreRequestFailure(url, errorText = '') {
  if (REQUEST_IGNORE_PATTERNS.some((pattern) => pattern.test(url))) return true
  // Video/banner có thể bị browser abort khi route reload hoặc khi test chuyển trang.
  // Broken image/video hiển thị sẽ được bắt ở image/layout test riêng, không nên fail smoke test.
  if (isAbortOnlyMediaRequest(url, errorText)) return true
  return false
}

export function createIssueBag() {
  return {
    consoleErrors: [],
    pageErrors: [],
    failedRequests: [],
    badResponses: [],
  }
}

export function collectBrowserIssues(page, issueBag = createIssueBag()) {
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return
    const text = msg.text()
    if (CONSOLE_IGNORE_PATTERNS.some((pattern) => pattern.test(text))) return
    issueBag.consoleErrors.push(text)
  })

  page.on('pageerror', (error) => {
    issueBag.pageErrors.push(error.message)
  })

  page.on('requestfailed', (request) => {
    const url = request.url()
    const errorText = request.failure()?.errorText || 'unknown error'
    if (shouldIgnoreRequestFailure(url, errorText)) return
    issueBag.failedRequests.push(`${request.method()} ${url} :: ${errorText}`)
  })

  page.on('response', (response) => {
    const url = response.url()
    const status = response.status()
    if (status < 400) return
    if (REQUEST_IGNORE_PATTERNS.some((pattern) => pattern.test(url))) return
    issueBag.badResponses.push(`${status} ${response.request().method()} ${url}`)
  })

  return issueBag
}

export async function preparePageForQA(page) {
  await page.addInitScript(() => {
    try {
      const likelyNoticeVersions = ['v1.0', 'v1', '1.0', 'v2.0', 'v2', 'v3.0']
      for (const version of likelyNoticeVersions) {
        window.localStorage.setItem(`exanh_notice_seen_${version}`, 'true')
      }
      window.localStorage.setItem('exanh_dev_notice_dismissed_v1', 'true')
    } catch {
      // localStorage có thể bị chặn ở một số context. Khi đó sẽ đóng overlay bằng DOM sau khi load.
    }
  })
}

export async function dismissKnownOverlays(page) {
  // Đóng popup hướng dẫn test / thông báo hệ thống để test không bị nhiễu overlay mờ.
  const dialog = page.locator('[role="dialog"]').filter({
    hasText: /Hướng dẫn test|Thông báo kiểm thử|Báo lỗi ngay trong website|Luồng test theo vai trò/i,
  }).first()

  if (await dialog.isVisible({ timeout: 800 }).catch(() => false)) {
    const closeButton = dialog
      .locator('button[aria-label*="Đóng" i], button[aria-label*="Close" i], .site-notice-modal__close, button')
      .first()

    if (await closeButton.isVisible({ timeout: 800 }).catch(() => false)) {
      await closeButton.click({ timeout: 1500 }).catch(() => {})
      await page.waitForTimeout(300)
    }
  }

  // Fallback bằng JS nếu button dùng icon nên locator không bắt được.
  await page.evaluate(() => {
    const bodyText = document.body?.innerText || ''
    const hasKnownNotice = /Hướng dẫn test|Thông báo kiểm thử|Báo lỗi ngay trong website|Luồng test theo vai trò/i.test(bodyText)
    if (!hasKnownNotice) return

    const buttons = [...document.querySelectorAll('button')]
      .map((button) => {
        const rect = button.getBoundingClientRect()
        const label = [
          button.getAttribute('aria-label') || '',
          button.getAttribute('title') || '',
          button.innerText || '',
          button.className || '',
        ].join(' ')
        return { button, rect, label }
      })
      .filter(({ rect }) => rect.width > 0 && rect.height > 0)

    const explicitClose = buttons.find(({ label }) => /đóng|close|site-notice-modal__close|^x$|^×$/i.test(label.trim()))
    if (explicitClose) {
      explicitClose.button.click()
      return
    }

    const smallTopRightButton = buttons
      .filter(({ rect }) => rect.width <= 70 && rect.height <= 70 && rect.top <= 180 && rect.right >= window.innerWidth * 0.55)
      .sort((a, b) => b.rect.right - a.rect.right || a.rect.top - b.rect.top)[0]

    smallTopRightButton?.button.click()
  }).catch(() => {})

  await page.keyboard.press('Escape').catch(() => {})
  await page.waitForTimeout(250).catch(() => {})
}

export async function gotoAndWait(page, route) {
  await preparePageForQA(page)
  const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.locator('body').waitFor({ state: 'visible', timeout: 15_000 })
  await dismissKnownOverlays(page)
  return response
}

export async function assertPageIsUsable(page, routeLabel = 'current page') {
  await expect(page.locator('body'), `${routeLabel}: body phải hiển thị`).toBeVisible()

  const pageState = await page.evaluate(() => {
    const text = document.body.innerText.trim()
    const visibleElements = [...document.querySelectorAll('body *')].filter((element) => {
      const style = window.getComputedStyle(element)
      const rect = element.getBoundingClientRect()
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        Number(style.opacity) !== 0 &&
        rect.width > 0 &&
        rect.height > 0
      )
    })

    const visibleLinks = [...document.querySelectorAll('a')].filter((element) => {
      const rect = element.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    }).length

    const visibleButtons = [...document.querySelectorAll('button')].filter((element) => {
      const rect = element.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    }).length

    const loaderCount = document.querySelectorAll('.page-loader__spinner, [aria-label*="Đang tải"], [aria-label*="loading" i]').length

    return {
      textLength: text.length,
      visibleElementCount: visibleElements.length,
      visibleLinks,
      visibleButtons,
      loaderCount,
      title: document.title,
      hasReactRoot: Boolean(document.querySelector('#root')),
      bodySample: text.slice(0, 300),
    }
  })

  expect(pageState.hasReactRoot, `${routeLabel}: thiếu #root của React`).toBe(true)
  expect(pageState.visibleElementCount, `${routeLabel}: nghi màn trắng / UI không render. Sample: ${pageState.bodySample}`).toBeGreaterThan(5)
  expect(pageState.textLength, `${routeLabel}: nội dung quá ít, có thể đang trắng/lỗi. Sample: ${pageState.bodySample}`).toBeGreaterThan(30)
  expect(pageState.title, `${routeLabel}: document.title rỗng`).not.toEqual('')
}

export async function assertNoCriticalBrowserIssues(issueBag, routeLabel = 'current page') {
  expect(issueBag.pageErrors, `${routeLabel}: JS page errors`).toEqual([])
  expect(issueBag.consoleErrors, `${routeLabel}: Console errors`).toEqual([])

  const criticalBadResponses = issueBag.badResponses.filter((line) => {
    // Cho phép một vài request auth/storage bị chặn trên trang public nếu app xử lý fallback tốt.
    return !/\/auth\/v1\/user|\/storage\/v1\/object\/|challenges\.cloudflare\.com\/cdn-cgi\/challenge-platform|\/cdn-cgi\/challenge-platform/.test(line)
  })
  expect(criticalBadResponses, `${routeLabel}: HTTP 4xx/5xx responses`).toEqual([])

  const criticalFailedRequests = issueBag.failedRequests.filter((line) => {
    const match = line.match(/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+(.+?)\s+::\s+(.+)$/i)
    if (!match) return true
    return !shouldIgnoreRequestFailure(match[2], match[3])
  })

  expect(criticalFailedRequests, `${routeLabel}: Failed network requests`).toEqual([])
}

export async function assertNoHorizontalOverflow(page, routeLabel = 'current page') {
  const overflow = await page.evaluate(() => {
    const html = document.documentElement
    const body = document.body
    const viewportWidth = window.innerWidth
    const documentWidth = Math.max(html.scrollWidth, body.scrollWidth)
    const overflowingElements = [...document.querySelectorAll('body *')]
      .map((element) => {
        const rect = element.getBoundingClientRect()
        const style = window.getComputedStyle(element)
        if (style.position === 'fixed') return null
        if (rect.width <= 0 || rect.height <= 0) return null
        if (rect.right <= viewportWidth + 2) return null
        return {
          tag: element.tagName.toLowerCase(),
          className: String(element.className || '').slice(0, 100),
          text: element.innerText?.slice(0, 80) || '',
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        }
      })
      .filter(Boolean)
      .slice(0, 10)

    return {
      viewportWidth,
      documentWidth,
      overflowingElements,
    }
  })

  expect(
    overflow.documentWidth,
    `${routeLabel}: trang bị tràn ngang ${overflow.documentWidth}px > viewport ${overflow.viewportWidth}px. Elements: ${JSON.stringify(overflow.overflowingElements, null, 2)}`,
  ).toBeLessThanOrEqual(overflow.viewportWidth + 4)
}

export async function findImageIssues(page) {
  return await page.evaluate(() => {
    const selectors = [
      '.post-card-ui__media img',
      '.community-post-card__image',
      '.community-post-card__image-wrap img',
      '.post-detail-hero img',
      '.post-detail-page article img',
      '.banner-carousel img',
      '.hero-media img',
      '.auth-carousel-placeholder img',
    ]

    const nodes = [...document.querySelectorAll(selectors.join(','))]
    const uniqueNodes = [...new Set(nodes)]
    const issues = []

    uniqueNodes.forEach((img) => {
      const rect = img.getBoundingClientRect()
      const src = img.currentSrc || img.src || ''
      const alt = img.alt || ''
      const className = String(img.className || '')

      if (rect.width < 40 || rect.height < 40) return

      if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
        issues.push({
          type: 'BROKEN_OR_NOT_LOADED_IMAGE',
          selectorHint: className,
          alt,
          src,
          renderedWidth: Math.round(rect.width),
          renderedHeight: Math.round(rect.height),
        })
        return
      }

      const ratio = rect.width / rect.height
      const naturalRatio = img.naturalWidth / img.naturalHeight
      const isCoverImage =
        img.closest('.post-card-ui__media') ||
        img.closest('.community-post-card__image-wrap') ||
        img.closest('.banner-carousel') ||
        img.closest('.hero-media') ||
        img.closest('.auth-carousel-placeholder') ||
        className.includes('community-post-card__image')

      if (isCoverImage && (ratio < 1.35 || ratio > 2.05)) {
        issues.push({
          type: 'BAD_COVER_IMAGE_RATIO',
          selectorHint: className,
          alt,
          src,
          renderedWidth: Math.round(rect.width),
          renderedHeight: Math.round(rect.height),
          renderedRatio: Number(ratio.toFixed(2)),
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          naturalRatio: Number(naturalRatio.toFixed(2)),
          expected: 'Ảnh card/banner nên gần 16:9, khoảng chấp nhận 1.35–2.05',
        })
      }
    })

    return issues
  })
}

export async function assertMainImagesAreHealthy(page, routeLabel = 'current page') {
  const imageIssues = await findImageIssues(page)
  expect(imageIssues, `${routeLabel}: lỗi ảnh chính/card/banner`).toEqual([])
}

export async function safeClickFirstVisible(page, locator, description) {
  const count = await locator.count()
  expect(count, `${description}: không tìm thấy element`).toBeGreaterThan(0)
  const first = locator.first()
  await expect(first, `${description}: element không visible`).toBeVisible()
  await first.click()
}

export async function expectToastOrDialog(page, action, expectedPattern, description) {
  let dialogMessage = ''
  const dialogPromise = page.waitForEvent('dialog', { timeout: 3000 })
    .then(async (dialog) => {
      dialogMessage = dialog.message()
      await dialog.accept()
    })
    .catch(() => null)

  await action()
  await dialogPromise

  if (dialogMessage) {
    expect(dialogMessage, description).toMatch(expectedPattern)
    return
  }

  const statusLocator = page.locator('[role="status"], .ui-toast, .toast, [class*="toast"], [role="alert"]')
  await expect(statusLocator.filter({ hasText: expectedPattern }).first(), description).toBeVisible({ timeout: 5000 })
}
